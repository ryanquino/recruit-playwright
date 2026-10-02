// @ts-check
const { test, expect } = require('@playwright/test');
const RssFeedPage = require('../../pages/jobs/rss-feed.page');
const CreateJobPostingPage = require('../../../ATS/pages/jobs/create-job-posting.page');
const BasePage = require('../../../ATS/pages/base.page');
const baseJobPosting = require('../../../ATS/test-data/jobs/create-job-posting.json');

// [RS-03]/[RS-04] ("Freshness") — how quickly a job posting change reaches
// the RSS feed. Unlike every other RS-* case, these need a real mutation
// (create, then deactivate) against the shared QA ATS
// (ATS_BASE_URL, default playwrightqa-openhire.silkroad-eng.com), not just
// a read — so this lives in its own `rss-freshness` Playwright project
// (see playwright-cx.config.js), deliberately excluded from `chromium` /
// `firefox` / `webkit` / `msedge` / `rss-feed`. Run it explicitly via
// `--project=rss-freshness`.
//
// [RS-04] and [RS-03] each create and clean up their own job — they don't
// share one. They're not actually related (one asks "does a new job show
// up", the other "does a closed job go away") beyond both timing the same
// SLA, so forcing them through one shared job serially would just make
// [RS-03] wait out [RS-04]'s ~5min appearance poll before even starting its
// own. Run in parallel workers instead (the `rss-freshness` project is
// given its own worker budget in CI — see cx-tests.yml — since, unlike the
// suites that share a candidate-pool search result, this file's two tests
// touch nothing but their own independently-created jobs).
//
// Baseline, from the original manual verification (2026-09-11, ATS job
// 173701, Corporate Career Portal):
//   - a job created via ATS "Create Job Posting" needs no separate
//     "publish to career site" step to reach the CX candidate portal
//   - it appeared in the RSS feed ~5 minutes (272s-302s) after creation
//   - after "Take Action" > "Deactivate" > Save, it dropped out of the
//     feed on the next check
//   - RSS is served through CloudFront with a 5-minute max-age, but
//     live-verified (2026-09-14) as a per-request MISS in practice — a
//     "_cb=<timestamp>" cache-busting query param is still appended on
//     every poll below, to rule out any caching layer as a confound while
//     timing the actual backend SLA.
//   - the RSS <trackingCode> element mirrors the job's numeric CX job ID
//     (e.g. "164552"), NOT the ATS "Tracking Code" form field — live-
//     verified 2026-09-14 by inspecting a real feed. That numeric ID isn't
//     known ahead of creation here, so items are matched by <title>
//     instead (given a run-unique title, this is unambiguous).
//
// Scoped to Corporate Career Portal only (not Hourly) — that's the portal
// the original manual verification used, and this suite's ATS environment
// (playwrightqa-openhire) maps to that tenant.

const ATS_BASE_URL = process.env.ATS_BASE_URL || 'https://playwrightqa-openhire.silkroad-eng.com';
const CX_BASE_URL = process.env.CX_BASE_URL || 'https://qa-recruiting-cx.silkroad-eng.com';
const FEED_PATH = '/playwrightqa/CorporateCareerPortal/rss';

const POLL_INTERVAL_MS = 20_000;
const POLL_TIMEOUT_MS = 7 * 60_000; // observed SLA ~5min; comfortable margin without being unbounded

/**
 * Poll `check()` every `intervalMs` until it returns true, or throw after `timeoutMs`.
 * @returns {Promise<number>} elapsed ms on success
 */
async function pollUntil(check, { intervalMs, timeoutMs, description }) {
    const start = Date.now();
    for (;;) {
        if (await check()) return Date.now() - start;
        if (Date.now() - start > timeoutMs) {
            throw new Error(`Timed out after ${timeoutMs}ms waiting for: ${description}`);
        }
        await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
}

/** Cache-busted feed fetch — a fresh, unique query string on every call defeats CloudFront (or any other intermediate cache) so each poll reflects the feed as it stands right now, not a stale copy. */
async function feedHasItemTitled(request, title) {
    const rssFeedPage = new RssFeedPage(request);
    const bustedPath = `${FEED_PATH}?_cb=${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const result = await rssFeedPage.fetch(CX_BASE_URL, bustedPath);
    return RssFeedPage.getItems(result.channel).some(item => item.title === title);
}

async function loginToAts(page) {
    await page.goto(ATS_BASE_URL);
    await new BasePage(page).login();
}

/** Create a uniquely-titled job in ATS and confirm ATS itself has it (job tracking search) — doesn't touch the CX/RSS side. */
async function createJob(page, title, trackingCode) {
    await loginToAts(page);
    const createJobPostingPage = new CreateJobPostingPage(page);
    await createJobPostingPage.navigateToJobPostingPage();
    await createJobPostingPage.createNewJobPosting(
        { ...baseJobPosting, internalJobTitle: title, postedJobTitle: title, trackingCode },
        false
    );
    await expect(await createJobPostingPage.searchAndVerify(title), `"${title}" didn't show up in ATS job tracking after creation`).toBe(true);
}

async function deactivateJob(page, title) {
    await loginToAts(page);
    const createJobPostingPage = new CreateJobPostingPage(page);
    // deactivateJobPosting()'s first step clicks jobTrackingMenuItem, a nav
    // link that only exists once the parent "Jobs" menu is expanded.
    // createJob() gets this for free (navigateToJobPostingPage() already
    // expanded it earlier in that same page), but this is a fresh
    // page/login with the menu never opened — live-verified 2026-09-14 in
    // CI (run 34857325288): without this click, jobTrackingMenuItem never
    // appears and the locator hangs for the full test timeout, 4/4 tries.
    await createJobPostingPage.jobsMenuItem.click();
    await createJobPostingPage.deactivateJobPosting(title);
    await expect(createJobPostingPage.deactivateSuccessModalLocator).toBeVisible();
}

function uniqueJobTitle(label) {
    return `Playwright RSS Freshness ${label} ${Date.now()}`;
}

test.describe('RSS — freshness', () => {
    test('[C31333] new job appears in the RSS feed within the expected timeframe', async ({ page, request }) => {
        test.setTimeout(10 * 60_000);

        const title = uniqueJobTitle('appear');
        const trackingCode = `PWFreshnessAppear${Date.now()}`;
        let deactivated = false;

        try {
            await createJob(page, title, trackingCode);

            const elapsedMs = await pollUntil(
                () => feedHasItemTitled(request, title),
                { intervalMs: POLL_INTERVAL_MS, timeoutMs: POLL_TIMEOUT_MS, description: `"${title}" to appear in ${FEED_PATH}` }
            );

            test.info().annotations.push({ type: 'freshness', description: `appeared in the RSS feed ${Math.round(elapsedMs / 1000)}s after creation` });

            // This test only cares about appearance — done with the job
            // once that's known either way, so clean it up here rather
            // than leaving it active in the shared QA ATS.
            await deactivateJob(page, title);
            deactivated = true;
        } finally {
            if (!deactivated) {
                await deactivateJob(page, title).catch(error =>
                    console.error(`[RS-04] cleanup: failed to deactivate "${title}" — it may need manual deactivation in ATS. ${error.message}`)
                );
            }
        }
    });

    test('[C31333] closed job is removed from the RSS feed', async ({ page, request }) => {
        test.setTimeout(17 * 60_000); // two sequential polls (appear, then remove) within this one test

        const title = uniqueJobTitle('close');
        const trackingCode = `PWFreshnessClose${Date.now()}`;
        let deactivated = false;

        try {
            await createJob(page, title, trackingCode);

            // Precondition for this test, not the thing under test: "removed"
            // only means something once the job was actually present. Own
            // job, own poll — not [RS-04]'s — so this runs independently of
            // (and, given >1 worker, concurrently with) that test.
            await pollUntil(
                () => feedHasItemTitled(request, title),
                { intervalMs: POLL_INTERVAL_MS, timeoutMs: POLL_TIMEOUT_MS, description: `"${title}" to appear in ${FEED_PATH} (precondition for [RS-03])` }
            );

            await deactivateJob(page, title);
            deactivated = true;

            const elapsedMs = await pollUntil(
                async () => !(await feedHasItemTitled(request, title)),
                { intervalMs: POLL_INTERVAL_MS, timeoutMs: POLL_TIMEOUT_MS, description: `"${title}" to be removed from ${FEED_PATH}` }
            );

            test.info().annotations.push({ type: 'freshness', description: `removed from the RSS feed ${Math.round(elapsedMs / 1000)}s after deactivation` });
        } finally {
            // Covers the case where creation succeeded but the appearance
            // precondition itself timed out/failed before deactivation ran.
            if (!deactivated) {
                await deactivateJob(page, title).catch(error =>
                    console.error(`[RS-03] cleanup: failed to deactivate "${title}" — it may need manual deactivation in ATS. ${error.message}`)
                );
            }
        }
    });
});
