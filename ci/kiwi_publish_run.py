#!/usr/bin/env python3
"""Publish a JUnit XML report to EVA TCMS from CI, over the XML-RPC endpoint.

Reference implementation for docs/junit-reports/README.md. Standard library
only, so a CI job needs nothing but a Python 3.9+ interpreter.

    export KIWI_BASE_URL=https://your-kiwi-instance.example.com
    export KIWI_CLIENT_ID=...          # manage.py eva_create_api_client
    export KIWI_CLIENT_SECRET=...

    python kiwi_publish_run.py \
        --plan 42 \
        --build "$GITHUB_RUN_NUMBER-${GITHUB_SHA:0:7}" \
        --summary "e2e #$GITHUB_RUN_NUMBER" \
        --report results/junit-report.xml \
        --attach results/junit-report.xml \
        --finish

What it does, in order:

    Build          find-or-create, under the plan's version
    TestRun        find-or-create, one per (plan, build)
    per <testcase> resolve the TestCase, add it to the run (which creates the
                   TestExecution), set the execution status, and comment the
                   failure text
    attachments    upload the raw report, gzipped
    TestRun        stamp stop_date with --finish

Case resolution is by **external key first**: a Playwright/Cypress title such as
``Careers search › [C1234] Keyword search`` carries the TestRail id the cases
were migrated with, and that id is stored on the migrated case as the
``eva.testrail_key`` property. Matching on it survives every rename of the test
title.

A test written against a scenario id rather than migrated from TestRail has no
such id to carry — ``Job list › [SC-064] Combining facets applies AND logic``.
Those are matched next, on ``eva.playwright_key``. That property holds a
comma-separated list, so one case can cover several tests (``RS-03,RS-04``),
which a single-valued key cannot express.

A test named after the Kiwi case itself — ``[TC-15959] ATS Standard login`` —
needs neither: ``TC-<id>`` IS the case id, so it links directly and is checked
before both keys.

Only when none of these match does this fall back to matching the summary, and
then to authoring a new case with --create-missing.
"""

from __future__ import annotations

import argparse
import base64
import gzip
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import xmlrpc.client
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree

#: settings.FILE_UPLOAD_MAX_SIZE on the server, checked after base64-decoding.
MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024

#: bleach_allowlist.generally_xss_unsafe — what tcms/kiwi_attachments/validators.py
#: scans every upload for. A report containing any of these as a tag is refused.
FORBIDDEN_TAGS = (
    "applet",
    "audio",
    "bgsound",
    "body",
    "canvas",
    "embed",
    "frame",
    "frameset",
    "head",
    "html",
    "iframe",
    "link",
    "meta",
    "object",
    "param",
    "ruby",
    "rt",
    "script",
    "source",
    "title",
    "track",
    "video",
    "xmp",
)

#: A Kiwi case id in a test title, "TC-<id>" as Kiwi itself displays it. Checked
#: before the other keys; PLAYWRIGHT_KEY_IN_TITLE would also match it, but no
#: case carries "TC-<id>" as an eva.playwright_key, so without this it never
#: resolved.
KIWI_CASE_ID_IN_TITLE = re.compile(r"\[TC-(\d+)\]")

#: Where the TestRail migration records the source id (integrations/
#: eva_testrail_migration/kiwi_writer.py), formatted "C<id>".
CASE_KEY_PROPERTY = "eva.testrail_key"

#: The same id as it appears in an automated test's title.
CASE_KEY_IN_TITLE = re.compile(r"\[(C\d+)\]")

#: Where a case records the tag(s) used by a Playwright-native test — one that
#: was written against a scenario id rather than migrated from TestRail, so it
#: has no "C<id>" to carry. Unlike eva.testrail_key this may hold SEVERAL
#: comma-separated tags ("RS-03,RS-04"), which is how one case covers more than
#: one test; an exact match on the property value cannot express that, hence
#: playwright_key_index() splitting rather than a filter on value.
PLAYWRIGHT_KEY_PROPERTY = "eva.playwright_key"

#: Such a tag as it appears in a test title: two or more letters, a hyphen,
#: then digits — [SC-064], [RS-03], [SM-05]. Deliberately does not match
#: [C1234], which CASE_KEY_IN_TITLE owns, nor a bare [Sitemap].
PLAYWRIGHT_KEY_IN_TITLE = re.compile(r"\[([A-Za-z]{2,}-\d+)\]")

#: JUnit outcome -> TestExecutionStatus name. Resolved to ids at runtime: the
#: fork seeds eight statuses and their ids are not contractual.
STATUS_FOR_RESULT = {
    "passed": "PASSED",
    "failure": "FAILED",
    "error": "ERROR",
    "skipped": "WAIVED",
}

#: Kiwi truncates nothing for us; TestCase.summary is a CharField(255).
SUMMARY_MAX = 255


# --------------------------------------------------------------------------- #
# transport
# --------------------------------------------------------------------------- #


class _BearerMixin:
    """Adds the OAuth2 bearer header to every XML-RPC request.

    BearerTokenAuthenticationMiddleware (tcms/eva_auth/middleware.py) is ordinary
    Django middleware, so it authenticates /xml-rpc/ exactly as it does
    /json-rpc/ — no session, no CSRF token, no cookie to carry between calls.
    """

    token = ""
    acting_user = ""

    def send_headers(self, connection, headers):
        connection.putheader("Authorization", f"Bearer {self.token}")
        if self.acting_user:
            # ENH-42: attribute the writes to a person, not the service account.
            connection.putheader("X-Kiwi-Acting-User", self.acting_user)
        super().send_headers(connection, headers)


class BearerTransport(_BearerMixin, xmlrpc.client.Transport):
    pass


class BearerSafeTransport(_BearerMixin, xmlrpc.client.SafeTransport):
    pass


def fetch_token(base_url: str, client_id: str, client_secret: str) -> str:
    """Exchange client credentials for a bearer token at /o/token/."""
    body = urllib.parse.urlencode({"grant_type": "client_credentials"}).encode()
    basic = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    request = urllib.request.Request(
        f"{base_url}/o/token/",
        data=body,
        headers={
            "Authorization": f"Basic {basic}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)["access_token"]


def connect(base_url: str, acting_user: str = "") -> xmlrpc.client.ServerProxy:
    token = fetch_token(
        base_url, os.environ["KIWI_CLIENT_ID"], os.environ["KIWI_CLIENT_SECRET"]
    )
    transport_class = (
        BearerSafeTransport if base_url.startswith("https://") else BearerTransport
    )
    transport = transport_class()
    transport.token = token
    transport.acting_user = acting_user
    # allow_none: XML-RPC has no native null and Kiwi serializes empty FKs as one.
    return xmlrpc.client.ServerProxy(
        f"{base_url}/xml-rpc/", transport=transport, allow_none=True
    )


# --------------------------------------------------------------------------- #
# report parsing
# --------------------------------------------------------------------------- #


def parse_junit(path: Path) -> list[dict]:
    """Flatten a JUnit/xUnit report into {summary, case_key, result, message}."""
    root = ElementTree.parse(path).getroot()
    suites = [root] if root.tag == "testsuite" else list(root.iter("testsuite"))

    records = []
    for suite in suites:
        for case in suite.iter("testcase"):
            name = case.get("name") or ""
            classname = case.get("classname") or suite.get("name") or ""

            result, message = "passed", ""
            for outcome in ("failure", "error", "skipped"):
                node = case.find(outcome)
                if node is not None:
                    result = outcome
                    message = (node.get("message") or node.text or "").strip()
                    break

            stderr = case.find("system-err")
            if result != "passed" and stderr is not None and stderr.text:
                message = f"{message}\n\n{stderr.text.strip()}".strip()

            kiwi_match = KIWI_CASE_ID_IN_TITLE.search(name)
            key_match = CASE_KEY_IN_TITLE.search(name)
            pw_match = PLAYWRIGHT_KEY_IN_TITLE.search(name)
            records.append(
                {
                    # The bare title is the case summary; the file name it came
                    # from is context, kept out of the summary so a moved spec
                    # file does not read as a different test case.
                    "summary": name[:SUMMARY_MAX],
                    "source": classname,
                    "kiwi_case_id": int(kiwi_match.group(1)) if kiwi_match else None,
                    "case_key": key_match.group(1) if key_match else "",
                    "playwright_key": pw_match.group(1) if pw_match else "",
                    "result": result,
                    "message": message,
                }
            )
    return records


# --------------------------------------------------------------------------- #
# TCMS operations
# --------------------------------------------------------------------------- #


def first(rows, what: str):
    """First row, or a diagnosis — an empty result here is rarely "not found".

    Every read is product-scoped (FEAT-020). A service user with no
    UserProductAccess passes each permission check and then sees nothing, so the
    honest failure is "your key cannot see it", not "it does not exist".
    """
    if not rows:
        raise SystemExit(
            f"{what} returned nothing. Either it does not exist, or this API key "
            f"has no access to its product — check the service user has "
            f"UserProductAccess(all_products=True), which is what "
            f"eva_create_api_client sets."
        )
    return rows[0]


def ensure_build(server, version_id: int, name: str) -> int:
    existing = server.Build.filter({"name": name, "version": version_id})
    if existing:
        return existing[0]["id"]
    return server.Build.create({"name": name, "version": version_id})["id"]


def ensure_run(server, plan_id: int, build_id: int, summary: str, manager: int) -> int:
    existing = server.TestRun.filter({"plan": plan_id, "build": build_id})
    if existing:
        return existing[0]["id"]
    return server.TestRun.create(
        {
            "plan": plan_id,
            "build": build_id,
            "summary": summary,
            "manager": manager,
        }
    )["id"]


def playwright_key_index(server) -> dict[str, int]:
    """Tag -> case id, over every eva.playwright_key the caller can see.

    Read once per run and not per result: the property holds a comma-separated
    list, so the tag in a title is a MEMBER of a value rather than the value
    itself, and TestCase.properties can only match a value exactly. One scan
    and a split is both correct and cheaper than a round trip per result.

    First writer wins on a duplicate tag, matching how the eva.testrail_key
    lookup takes rows[0] when several cases carry the same key.
    """
    index: dict[str, int] = {}
    for row in server.TestCase.properties({"name": PLAYWRIGHT_KEY_PROPERTY}):
        for tag in (row.get("value") or "").split(","):
            tag = tag.strip()
            if tag:
                index.setdefault(tag, row["case"])
    return index


def resolve_case(
    server, plan_id, product_id, record, create_missing, pw_index=None
) -> int | None:
    """Kiwi case id -> external key -> Playwright tag -> summary in plan -> (optionally) author."""
    # Confirmed to exist (and be visible) rather than trusted, so a typo'd id
    # falls through to the other rules instead of failing the whole publish.
    if record.get("kiwi_case_id") and server.TestCase.filter({"pk": record["kiwi_case_id"]}):
        return record["kiwi_case_id"]

    if record["case_key"]:
        rows = server.TestCase.properties(
            {"name": CASE_KEY_PROPERTY, "value": record["case_key"]}
        )
        if rows:
            return rows[0]["case"]

    if record.get("playwright_key") and pw_index is not None:
        case_id = pw_index.get(record["playwright_key"])
        if case_id is not None:
            return case_id

    hits = server.TestCase.filter({"plan": plan_id, "summary": record["summary"]})
    if hits:
        return hits[0]["id"]

    if not create_missing:
        return None

    category = first(
        server.Category.filter({"product": product_id}),
        f"Category.filter(product={product_id})",
    )["id"]
    priority = first(server.Priority.filter({"is_active": True}), "Priority.filter")[
        "id"
    ]
    # Only a CONFIRMED case can be added to a run.
    confirmed = first(
        server.TestCaseStatus.filter({"is_confirmed": True}), "TestCaseStatus.filter"
    )["id"]

    case_id = server.TestCase.create(
        {
            "summary": record["summary"],
            "category": category,
            "priority": priority,
            "case_status": confirmed,
            "is_automated": True,
            "text": f"Authored from an automated run of `{record['source']}`.",
        }
    )["id"]
    server.TestPlan.add_case(plan_id, case_id)
    # So the next run matches on the key instead of re-creating the case. A
    # Playwright-native test has no "C<id>" to record, so its own tag is what
    # gets stored — under the property that tag is actually looked up in.
    if record["case_key"]:
        server.TestCase.add_property(case_id, CASE_KEY_PROPERTY, record["case_key"])
    elif record.get("playwright_key"):
        server.TestCase.add_property(
            case_id, PLAYWRIGHT_KEY_PROPERTY, record["playwright_key"]
        )
        if pw_index is not None:
            # Keep the index honest for the rest of this run.
            pw_index.setdefault(record["playwright_key"], case_id)
    return case_id


def publish_results(server, run_id, plan_id, product_id, records, create_missing):
    status_ids = {
        status["name"]: status["id"] for status in server.TestExecutionStatus.filter({})
    }
    tally: dict[str, int] = {}
    unmatched: list[str] = []

    # Only worth a round trip if something in this report carries such a tag.
    pw_index = (
        playwright_key_index(server)
        if any(record.get("playwright_key") for record in records)
        else {}
    )

    for record in records:
        case_id = resolve_case(
            server, plan_id, product_id, record, create_missing, pw_index
        )
        if case_id is None:
            unmatched.append(
                record["case_key"] or record.get("playwright_key") or record["summary"]
            )
            continue

        # add_case creates the executions, or returns the existing ones on a
        # re-run. It returns a LIST, and often more than one entry: TestRun.
        # create_execution() builds one execution per combination of the case's
        # properties (testruns/models.py), and every migrated case carries
        # eva.testrail_key / eva.jira_key. One JUnit result cannot say which
        # parameter combination ran, so every execution of the case gets the
        # result — updating only the first would silently leave the rest IDLE.
        executions = server.TestRun.add_case(run_id, case_id)

        status_name = STATUS_FOR_RESULT[record["result"]]
        for execution in executions:
            server.TestExecution.update(
                execution["id"], {"status": status_ids[status_name]}
            )
            if record["message"]:
                server.TestExecution.add_comment(
                    execution["id"], record["message"][:4000]
                )

        tally[status_name] = tally.get(status_name, 0) + 1

    return tally, unmatched


def _forbidden_tag_in(payload: bytes) -> str | None:
    lowered = payload.lower()
    for tag in FORBIDDEN_TAGS:
        if f"<{tag}".encode() in lowered:
            return tag
    return None


def attach(server, api: str, object_id: int, paths, raw: bool) -> None:
    for path in paths:
        payload = path.read_bytes()
        filename = path.name

        if raw:
            tag = _forbidden_tag_in(payload)
            if tag:
                raise SystemExit(
                    f"{path}: contains <{tag} — the server's attachment validator "
                    f"refuses it. Drop --raw so it is uploaded gzipped."
                )
        else:
            filename, payload = f"{path.name}.gz", gzip.compress(payload)

        if len(payload) > MAX_ATTACHMENT_BYTES:
            raise SystemExit(
                f"{path}: {len(payload)} bytes after packing is over the server's "
                f"{MAX_ATTACHMENT_BYTES}-byte limit."
            )

        getattr(server, f"{api}.add_attachment")(
            object_id, filename, base64.b64encode(payload).decode()
        )
        print(f"  attached {filename} ({len(payload)} bytes)")


# --------------------------------------------------------------------------- #


def main() -> None:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--base-url", default=os.environ.get("KIWI_BASE_URL"))
    parser.add_argument("--acting-user", default=os.environ.get("KIWI_ACTING_USER", ""))
    parser.add_argument("--plan", type=int, required=True, help="TestPlan id")
    parser.add_argument(
        "--version", type=int, help="Version id (default: the plan's own version)"
    )
    parser.add_argument(
        "--manager", type=int, help="run manager user id (default: the plan's author)"
    )
    parser.add_argument("--build", required=True, help="build name, e.g. the CI run id")
    parser.add_argument("--summary", required=True, help="run summary")
    # extend + nargs so a shell glob (results/*.xml) expands into the list.
    parser.add_argument(
        "--report",
        type=Path,
        action="extend",
        nargs="+",
        default=[],
        help="JUnit XML report(s) to publish as executions",
    )
    parser.add_argument(
        "--attach",
        type=Path,
        action="extend",
        nargs="+",
        default=[],
        help="file(s) to attach to the run",
    )
    parser.add_argument(
        "--raw",
        action="store_true",
        help="attach uncompressed (fails if the validator would refuse)",
    )
    parser.add_argument(
        "--create-missing",
        action="store_true",
        help="author a TestCase for a result that matches none",
    )
    parser.add_argument(
        "--finish", action="store_true", help="stamp the run's stop_date when done"
    )
    parser.add_argument(
        "--fail-on-test-failure",
        action="store_true",
        help="exit 1 when a published result is FAILED/ERROR (default: the exit "
        "code reflects only whether publishing succeeded)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="resolve cases and print what would happen; write nothing",
    )
    args = parser.parse_args()

    if not args.base_url:
        raise SystemExit("--base-url or KIWI_BASE_URL is required")

    base_url = args.base_url.rstrip("/")
    server = connect(base_url, args.acting_user)

    try:
        plan = first(
            server.TestPlan.filter({"pk": args.plan}),
            f"TestPlan.filter(pk={args.plan})",
        )
        product_id = plan["product"]
        version_id = args.version or plan["product_version"]
        # NOT User.filter: that needs auth.view_user, which is outside
        # API_PERMISSION_APP_LABELS, so an issued API client is denied it.
        manager = args.manager or plan["author"]

        records = [record for report in args.report for record in parse_junit(report)]

        if args.dry_run:
            pw_index = (
                playwright_key_index(server)
                if any(record.get("playwright_key") for record in records)
                else {}
            )
            for record in records:
                case_id = resolve_case(
                    server, args.plan, product_id, record, False, pw_index
                )
                key = record["case_key"] or record.get("playwright_key") or "-"
                print(
                    f"  {STATUS_FOR_RESULT[record['result']]:<7} "
                    f"{'case ' + str(case_id) if case_id else 'NO MATCH':<10} "
                    f"{key:<9} {record['summary']}"
                )
            print(f"{len(records)} result(s); nothing written (--dry-run)")
            return

        build_id = ensure_build(server, version_id, args.build)
        run_id = ensure_run(server, args.plan, build_id, args.summary, manager)
        print(f"run {run_id}: {base_url}/runs/{run_id}/")

        tally, unmatched = publish_results(
            server, run_id, args.plan, product_id, records, args.create_missing
        )

        if args.attach:
            attach(server, "TestRun", run_id, args.attach, args.raw)

        if args.finish:
            stop = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
            server.TestRun.update(run_id, {"stop_date": stop})

        print(
            "results: "
            + (", ".join(f"{k}={v}" for k, v in sorted(tally.items())) or "none")
        )
        if unmatched:
            print(
                f"unmatched: {len(unmatched)} (re-run with --create-missing to author"
                f" them): {', '.join(unmatched[:5])}"
                f"{' …' if len(unmatched) > 5 else ''}"
            )

        # The exit code reports whether *publishing* worked, not what was
        # published: a red "publish" step next to a green one for a run whose
        # tests failed reads as "the upload broke", and hides the real thing.
        # A CI job already fails on its own test results. --fail-on-test-failure
        # is there for a caller with no other check to hang that on.
        if args.fail_on_test_failure and (tally.get("FAILED") or tally.get("ERROR")):
            sys.exit(1)
    except xmlrpc.client.Fault as fault:
        # Kiwi reports permission and validation problems as XML-RPC faults.
        raise SystemExit(f"TCMS rejected the call: {fault.faultString}") from fault


if __name__ == "__main__":
    main()
