// @ts-check
const { test, expect } = require('../fixtures/rss-fixture');
const RssFeedPage = require('../../pages/jobs/rss-feed.page');

// Test IDs (RS-*) come from CX_OpenSearch_Automation_Test_Plan (Test
// Cases).csv's "RSS Feed" area. This suite previously diffed RSS output
// between the OpenSearch-enabled and -disabled hosts — see rss-fixture.js's
// header for why that dependency was removed. Ground truth is now either
// the portal's own job list (completeness, [RS-01]/[RS-02]) or the job's
// own schema.org JSON-LD structured data (content accuracy, [RS-05]) —
// see JobDetailsPage.getStructuredData().
//
// [RS-03]/[RS-04] ("Freshness") need a real job closed/published in the
// shared QA ATS and an undocumented sync SLA to wait against — deliberately
// left as fixme() stubs at the bottom of this file, not attempted without
// that decision.
for (const feed of require('../../test-data/jobs/rss-feed-scope.json').feeds) {
    test.describe(`RSS — ${feed.name}`, () => {
        // [RS-06] — Kiwi case 31377 carries that scenario id as its
        // eva.playwright_key.
        test(`[C31377] ${feed.name} feed is well-formed and RSS 2.0 spec-compliant`, { tag: '@smoke' }, async ({ rssFeedPage, cxBaseUrl }) => {
            const result = await rssFeedPage.fetch(cxBaseUrl, feed.feedPath);

            expect.soft(result.status, `${result.url} returned HTTP ${result.status}`).toBe(200);
            expect.soft(result.version, `${result.url} is not RSS 2.0`).toBe('2.0');
            // RSS 2.0 spec: <channel> requires title, link, and description.
            expect.soft(result.channel && result.channel.title, `${result.url} missing channel title`).toBeTruthy();
            expect.soft(result.channel && result.channel.link, `${result.url} missing channel link`).toBeTruthy();
            expect.soft(result.channel && result.channel.description, `${result.url} missing channel description`).toBeTruthy();

            const items = RssFeedPage.getItems(result.channel);
            expect(items.length, `${result.url} has no items`).toBeGreaterThan(0);
            for (const item of items) {
                // RSS 2.0 spec: every <item> must have at least a title or a description.
                expect.soft(item.title || item.description, `${result.url} item "${item.link}" has neither title nor description`).toBeTruthy();
                expect.soft(item.link, `${result.url} item "${item.title}" is missing <link>`).toBeTruthy();
                expect.soft(item.guid, `${result.url} item "${item.title}" is missing <guid>`).toBeTruthy();
            }
        });

        // [RS-01]/[RS-02]: does the feed list exactly the jobs the portal
        // itself shows right now? Walks every page of results
        // (getAllResultCardsAcrossPages) — live-verified (2026-09-11):
        // Hourly Career Portal alone has 50 jobs across 2 pages at
        // 25/page, so a single-page read silently truncated it.
        test(`[C31374] Every job visible on ${feed.name} appears in the RSS feed`, { tag: '@smoke' }, async ({ rssFeedPage, jobsListPage, cxBaseUrl }) => {
            test.setTimeout(90_000);

            const [feedResult, portalCards] = await Promise.all([
                rssFeedPage.fetch(cxBaseUrl, feed.feedPath),
                jobsListPage.goto(feed.tenantPortalPath).then(() => jobsListPage.getAllResultCardsAcrossPages()),
            ]);

            const portalJobIds = new Set(portalCards.map(c => RssFeedPage.extractJobId(c.href)).filter(Boolean));
            expect(portalJobIds.size, 'no jobs found on the portal job list to compare against').toBeGreaterThan(0);

            const feedJobIds = new Set(RssFeedPage.getItems(feedResult.channel).map(i => RssFeedPage.extractJobId(i.link)).filter(Boolean));
            const missingFromFeed = [...portalJobIds].filter(id => !feedJobIds.has(id));
            expect.soft(missingFromFeed, `job(s) shown on the portal but missing from the RSS feed: ${missingFromFeed.join(', ')}`).toEqual([]);
        });

        test(`[C31375] Every RSS entry in ${feed.name} corresponds to a job actually visible on the portal`, { tag: '@smoke' }, async ({ rssFeedPage, jobsListPage, cxBaseUrl, page }) => {
            test.setTimeout(90_000);

            // Previously (2026-09-11, never filed as a ticket): Hourly
            // Career Portal's RSS feed included 12 jobs (e.g. 164552,
            // "Customer Service Manager") that didn't appear anywhere in
            // the portal's own paginated job search, despite each being a
            // live, fully-rendered, fully-applyable job page. Corporate
            // Career Portal had zero such jobs (28 portal jobs = 28 RSS
            // items exactly) — isolated to Hourly. This test was marked
            // test.fail() for that portal. Re-verified live 2026-09-15:
            // job 164552 and the rest of the feed now match Hourly's own
            // paginated job search exactly (62 jobs in the feed, 62 on the
            // portal, zero orphans) — the discoverability defect is gone.
            // Reads as index sync lag that resolved on its own (same
            // pattern as sitemap.xml's equivalent [SM-02] finding), not a
            // standing defect, so the test.fail() has been removed; it's
            // left as a real assertion that will catch a recurrence.

            const [feedResult, portalCards] = await Promise.all([
                rssFeedPage.fetch(cxBaseUrl, feed.feedPath),
                jobsListPage.goto(feed.tenantPortalPath).then(() => jobsListPage.getAllResultCardsAcrossPages()),
            ]);

            const portalJobIds = new Set(portalCards.map(c => RssFeedPage.extractJobId(c.href)).filter(Boolean));
            const feedJobIds = new Set(RssFeedPage.getItems(feedResult.channel).map(i => RssFeedPage.extractJobId(i.link)).filter(Boolean));
            const extraInFeed = [...feedJobIds].filter(id => !portalJobIds.has(id));

            // CSV step 2 for [RS-02] asks to "confirm the linked job page is
            // live" — classify each orphan rather than just counting it, so
            // a genuinely-dead link is distinguished from a live-but-
            // unsearchable one like 164552.
            for (const id of extraInFeed) {
                await test.step(`orphan job ${id}`, async () => {
                    await page.goto(`${cxBaseUrl.replace(/\/$/, '')}/${feed.tenantPortalPath}/jobs/${id}`);
                    await page.waitForLoadState('domcontentloaded');
                    const mainText = await page.locator('#mainContent').innerText().catch(() => '');
                    const isDead = mainText.includes('We apologize for the inconvenience, but we cannot find this position');
                    test.info().annotations.push({ type: 'orphan-status', description: `job ${id}: ${isDead ? 'dead (404-equivalent)' : 'live but not portal-searchable'}` });
                });
            }

            expect.soft(extraInFeed, `job(s) in the RSS feed that aren't currently shown on the portal: ${extraInFeed.join(', ')}`).toEqual([]);
        });

        test(`[C31376] ${feed.name} RSS entry fields accurately reflect the job's own data`, { tag: '@smoke' }, async ({ rssFeedPage, jobDetailsPage, cxBaseUrl }) => {
            // Looping a live page navigation per RSS item comfortably
            // exceeds the default 60s test timeout — same reasoning as the
            // multi-format submission tests and the sitemap job-detail-links
            // test elsewhere in this suite.
            test.setTimeout(120_000);

            const feedResult = await rssFeedPage.fetch(cxBaseUrl, feed.feedPath);
            const items = RssFeedPage.getItems(feedResult.channel);
            expect(items.length, `${feed.feedPath} has no items to check`).toBeGreaterThan(0);

            let structuredDataChecked = 0;

            for (const item of items) {
                const jobId = RssFeedPage.extractJobId(item.link);
                if (!jobId) continue;

                await test.step(`${item.trackingCode || jobId} ${item.title}`, async () => {
                    await jobDetailsPage.page.goto(`${cxBaseUrl.replace(/\/$/, '')}/${feed.tenantPortalPath}/jobs/${jobId}`);
                    await jobDetailsPage.page.waitForLoadState('domcontentloaded');
                    const structuredData = await jobDetailsPage.getStructuredData();

                    // Surfaced as a finding rather than skipped silently — a
                    // job missing its JSON-LD block is itself worth knowing
                    // about, just not something this test can compare against.
                    if (!structuredData) {
                        expect.soft(structuredData, `${item.link} has no schema.org JSON-LD block to verify against`).toBeTruthy();
                        return;
                    }
                    structuredDataChecked++;

                    // title
                    if (structuredData.title) {
                        expect.soft(item.title, `RSS title "${item.title}" doesn't match the job's own title "${structuredData.title}"`).toBe(structuredData.title);
                    }

                    // link — does it actually point at the right job, not
                    // just parse as a job URL? trackingCode/identifier is
                    // the stable correlation key.
                    if (structuredData.identifier && structuredData.identifier.value) {
                        expect.soft(item.trackingCode, `RSS trackingCode "${item.trackingCode}" doesn't match the job's own identifier "${structuredData.identifier.value}"`).toBe(structuredData.identifier.value);
                    }

                    // description — HTML markup can legitimately differ in
                    // whitespace between the two renderers, so compare
                    // normalized (tags stripped, whitespace collapsed) text.
                    if (structuredData.description && item.jobDescription) {
                        expect.soft(
                            RssFeedPage.normalizeText(item.jobDescription),
                            'RSS jobDescription (normalized) doesn\'t match the job\'s own description (normalized)'
                        ).toBe(RssFeedPage.normalizeText(structuredData.description));
                    }

                    // category
                    if (structuredData.occupationalCategory) {
                        expect.soft(
                            item.category,
                            `RSS category "${item.category}" doesn't match the job's own occupationalCategory "${structuredData.occupationalCategory}"`
                        ).toBe(structuredData.occupationalCategory);
                    }

                    // location — see the comment at the assertion itself for why this is a substring check, not exact equality.
                    const city = structuredData.jobLocation && structuredData.jobLocation.address && structuredData.jobLocation.address.addressLocality;
                    if (city && item.location) {
                        // Exact string equality isn't meaningful here — the
                        // RSS feed renders a full "[Street, ]City, Region,
                        // Country" display string (a region *name* and a
                        // localized country name, not the region/country
                        // *codes* the structured data carries, and an
                        // optional leading street address the structured
                        // data doesn't repeat), so the city is the one
                        // segment both sources are guaranteed to express
                        // identically — checked by substring, not prefix,
                        // since a street address can precede it.
                        expect.soft(
                            item.location.includes(city),
                            `RSS location "${item.location}" doesn't contain the job's own city "${city}"`
                        ).toBe(true);
                    }

                    // Pure format checks — no external source needed.
                    if (item.location) {
                        expect.soft(RssFeedPage.hasEmbeddedNewline(item.location), `"${item.location}" contains an embedded newline`).toBe(false);
                        expect.soft(RssFeedPage.hasDoubleComma(item.location), `"${item.location}" has a double comma (empty region)`).toBe(false);
                    }

                    // Note: this app's RSS output has no per-item <pubDate>
                    // (only a channel-level one) — live-verified 2026-09-11
                    // — so the CSV's pubDate field-accuracy check has
                    // nothing to compare and is intentionally not asserted
                    // here rather than asserted against a field that
                    // doesn't exist.
                });
            }

            // Guards against a false-negative pass if every item in this
            // feed happened to be missing its JSON-LD block (the per-item
            // checks above would then never actually compare anything).
            expect(structuredDataChecked, 'no items in this feed had usable structured data to verify against').toBeGreaterThan(0);
        });
    });
}

test.describe('RSS — multi-portal scoping', () => {
    // [RS-07]'s "brand" maps to portal here (this app's per-tenant RSS
    // endpoint is already portal-scoped by path, unlike sitemap.xml's
    // tenant-wide index — see sitemap-xml.page.js on the sibling
    // automated-tests/sitemap-link-check branch for that contrast) — every
    // item in a portal's feed should link back to that same portal, never
    // another one.
    test('[C234884] each portal\'s RSS feed contains only that portal\'s own jobs', { tag: '@smoke' }, async ({ rssFeedPage, cxBaseUrl }) => {
        test.setTimeout(60_000);

        for (const feed of require('../../test-data/jobs/rss-feed-scope.json').feeds) {
            await test.step(feed.name, async () => {
                const result = await rssFeedPage.fetch(cxBaseUrl, feed.feedPath);
                const items = RssFeedPage.getItems(result.channel);
                expect(items.length, `${feed.feedPath} has no items to check`).toBeGreaterThan(0);

                const wrongPortal = items.filter(i => RssFeedPage.extractPortalPath(i.link) !== feed.tenantPortalPath);
                expect.soft(
                    wrongPortal.map(i => i.link),
                    `item(s) in ${feed.name}'s feed that link to a different portal`
                ).toEqual([]);
            });
        }
    });
});

// [RS-03]/[RS-04] ("Freshness") now live in their own file,
// rss-freshness.spec.js, run via a dedicated `rss-freshness` project — see
// that file's header for why they're not part of this always-on suite.
// (Originally left as test.fixme() stubs here after a one-off manual
// verification, 2026-09-11; automated 2026-09-14.)
