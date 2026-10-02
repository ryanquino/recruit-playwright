// @ts-check
const { test, expect } = require('../fixtures/sitemap-xml-fixture');
const SitemapXmlPage = require('../../pages/jobs/sitemap-xml.page');

// Test IDs (RS-*/SM-*) come from CX_OpenSearch_Automation_Test_Plan (Test
// Cases).csv — this file covers the "Sitemap.xml" area's read-only cases
// (SM-01, SM-02, SM-05, SM-06). SM-03/SM-04 ("Freshness") need a real job
// closed/created in the shared QA ATS and an undocumented sync SLA to wait
// against — deliberately left as fixme() stubs, not attempted without a
// decision on which job is safe to mutate and what the real SLA is.
//
// This is a genuinely different artifact from the candidate-facing HTML
// "Sitemap" page tested in sitemap.spec.js — see sitemap-xml.page.js's
// header. Scoped to both portals the RSS suite already covers (Corporate,
// Hourly), not just Corporate, since /sitemap.xml is tenant-wide and both
// tenants are reachable.
for (const portal of require('../../test-data/jobs/sitemap-xml-scope.json').portals) {
    test.describe(`Sitemap.xml — ${portal.name}`, () => {
        test(`[SM-01] Every job visible on the portal appears in sitemap.xml — ${portal.name}`, { tag: '@smoke' }, async ({ sitemapXmlPage, jobsListPage, cxBaseUrl }) => {
            test.setTimeout(90_000);

            // Previously broken (2026-09-11 through 2026-09-14, never filed
            // as a ticket): sitemap_playwrightqa.xml was completely empty
            // (0 URLs) despite Corporate Career Portal having live jobs,
            // while Hourly Career Portal's tenant sitemap listed its jobs
            // correctly — pointed at a stalled sitemap-generation pipeline
            // for this environment rather than this tenant being
            // specifically excluded. Re-checked 2026-09-24: no longer
            // reproduces — this tenant's sitemap is populated and this test
            // passes cleanly, so the test.fail() marker that used to be
            // here has been removed.

            const [tenantSitemap, portalCards] = await Promise.all([
                sitemapXmlPage.fetchTenantSitemap(cxBaseUrl, portal.tenant),
                jobsListPage.goto(portal.tenantPortalPath).then(() => jobsListPage.getAllResultCardsAcrossPages()),
            ]);

            expect(tenantSitemap, `no child sitemap found in the index for tenant "${portal.tenant}"`).toBeTruthy();

            const portalJobIds = new Set(portalCards.map(c => SitemapXmlPage.extractJobId(c.href)).filter(Boolean));
            expect(portalJobIds.size, 'no jobs found on the portal job list to compare against').toBeGreaterThan(0);

            const scopedUrls = SitemapXmlPage.filterByPortal(tenantSitemap.urls, portal.tenantPortalPath);
            const sitemapJobIds = new Set(scopedUrls.map(u => SitemapXmlPage.extractJobId(u.loc)).filter(Boolean));

            const missingFromSitemap = [...portalJobIds].filter(id => !sitemapJobIds.has(id));
            expect.soft(missingFromSitemap, `job(s) shown on the portal but missing from sitemap.xml: ${missingFromSitemap.join(', ')}`).toEqual([]);
        });

        test(`[SM-02] Every sitemap.xml URL corresponds to a job actually visible on the portal — ${portal.name}`, { tag: '@smoke' }, async ({ sitemapXmlPage, jobsListPage, cxBaseUrl, page }) => {
            test.setTimeout(90_000);

            // Live-verified 2026-09-11: sitemap.xml included jobs (e.g.
            // 164552) absent from the portal's own paginated job search —
            // same apparent root cause as the RSS suite's [RS-02] finding
            // (sitemap.xml and the RSS feed drawing from a broader index
            // than the live search index). Re-verified 2026-09-14: no
            // longer reproducible — sitemap_qarecruiting01.xml and the
            // Hourly Career Portal's own job search matched exactly (62/62,
            // including 164552 now present in both). Reads as index sync
            // lag that resolved on its own rather than a standing defect,
            // so the test.fail() has been removed; it's left as a real
            // assertion that will catch a recurrence.
            //
            // Caveat (2026-09-14, see [SM-01]'s header comment for detail):
            // sitemap.xml is a static snapshot that appears not to have
            // regenerated in 62+ hours in this environment (stuck on
            // version "v=2026.09.11.220429"), so this test currently
            // passing may just mean that 3-day-old snapshot still happens
            // to match today's live portal listing, not that the
            // generation pipeline has demonstrably caught up. If sitemap
            // generation really is stalled, this could start failing again
            // on its own as new jobs are added/removed, without any
            // "recurrence" of the original defect per se.

            const tenantSitemap = await sitemapXmlPage.fetchTenantSitemap(cxBaseUrl, portal.tenant);
            expect(tenantSitemap, `no child sitemap found in the index for tenant "${portal.tenant}"`).toBeTruthy();
            const scopedUrls = SitemapXmlPage.filterByPortal(tenantSitemap.urls, portal.tenantPortalPath);

            if (scopedUrls.length === 0) {
                // Nothing to reconcile against a live page for — [SM-01]
                // above is the test that catches an empty/under-populated
                // sitemap; this test only has work to do when there's at
                // least one URL scoped to this portal.
                test.skip(true, `sitemap.xml has no URLs scoped to ${portal.tenantPortalPath} — see [SM-01]`);
            }

            await jobsListPage.goto(portal.tenantPortalPath);
            const portalCards = await jobsListPage.getAllResultCardsAcrossPages();
            const portalJobIds = new Set(portalCards.map(c => SitemapXmlPage.extractJobId(c.href)).filter(Boolean));

            const sitemapJobIds = new Set(scopedUrls.map(u => SitemapXmlPage.extractJobId(u.loc)).filter(Boolean));
            const extraInSitemap = [...sitemapJobIds].filter(id => !portalJobIds.has(id));

            // CSV step 2 for SM-02 asks to "confirm the job page is live" —
            // classify each orphan rather than just counting it, so a
            // genuinely-dead link (404/"not found" marker) is distinguished
            // from a live-but-unsearchable one like 164552.
            for (const id of extraInSitemap) {
                await test.step(`orphan job ${id}`, async () => {
                    await page.goto(`${cxBaseUrl.replace(/\/$/, '')}/${portal.tenantPortalPath}/jobs/${id}`);
                    await page.waitForLoadState('domcontentloaded');
                    const mainText = await page.locator('#mainContent').innerText().catch(() => '');
                    const isDead = mainText.includes('We apologize for the inconvenience, but we cannot find this position');
                    test.info().annotations.push({ type: 'orphan-status', description: `job ${id}: ${isDead ? 'dead (404-equivalent)' : 'live but not portal-searchable'}` });
                });
            }

            expect.soft(extraInSitemap, `job(s) in sitemap.xml that aren't currently shown on the portal: ${extraInSitemap.join(', ')}`).toEqual([]);
        });
    });
}

test.describe('Sitemap.xml — validity', () => {
    // [SM-05] — Kiwi case 15283 ("CX - Sitemap generation from OpenSearch"),
    // reached through its eva.testrail_key C234883. It covers this test alone
    // now that [SM-06] has its own case (31380).
    test('[C234883] sitemap.xml (index and child sitemaps) is well-formed and sitemaps.org-compliant', { tag: '@smoke' }, async ({ sitemapXmlPage, cxBaseUrl }) => {
        test.setTimeout(60_000);

        const index = await sitemapXmlPage.fetchIndex(cxBaseUrl);
        expect.soft(index.status, `${index.url} returned HTTP ${index.status}`).toBe(200);
        expect.soft(index.body.includes('<sitemapindex'), `${index.url} root element is not <sitemapindex>`).toBe(true);
        expect(index.sitemaps.length, `${index.url} lists no child sitemaps`).toBeGreaterThan(0);

        for (const { tenant, name } of require('../../test-data/jobs/sitemap-xml-scope.json').portals) {
            await test.step(`${name} (${tenant})`, async () => {
                const child = await sitemapXmlPage.fetchTenantSitemap(cxBaseUrl, tenant);
                expect.soft(child, `no child sitemap listed in the index for tenant "${tenant}"`).toBeTruthy();
                if (!child) return;

                expect.soft(child.status, `${child.url} returned HTTP ${child.status}`).toBe(200);
                const problems = SitemapXmlPage.validateUrlset(child.body, child.urls);
                expect.soft(problems, `${child.url} sitemaps.org compliance problems: ${problems.join('; ')}`).toEqual([]);
            });
        }
    });
});

test.describe('Sitemap.xml — multi-tenant scoping', () => {
    // [SM-06]'s "brand" maps to tenant in this app (see sitemap-xml.page.js's
    // header) — each tenant's own child sitemap should list only that
    // tenant's URLs, never another tenant's.
    //
    // Kiwi case 31380, split out of 15283. Both this test and [SM-05] above
    // used to carry [C234883], so both resolved to 15283 and whichever
    // published second overwrote the other's verdict. 15283 now covers
    // [SM-05] alone.
    test('[C31380] each tenant\'s sitemap.xml contains only that tenant\'s own job URLs', { tag: '@smoke' }, async ({ sitemapXmlPage, cxBaseUrl }) => {
        test.setTimeout(60_000);

        for (const { tenant, name } of require('../../test-data/jobs/sitemap-xml-scope.json').portals) {
            await test.step(`${name} (${tenant})`, async () => {
                const child = await sitemapXmlPage.fetchTenantSitemap(cxBaseUrl, tenant);
                if (!child || child.urls.length === 0) return; // nothing to check — see [SM-01] for the empty-sitemap finding itself

                const wrongTenant = child.urls.filter(u => SitemapXmlPage.extractTenant(u.loc) !== tenant);
                expect.soft(wrongTenant.map(u => u.loc), `URL(s) in ${tenant}'s sitemap that belong to a different tenant`).toEqual([]);
            });
        }
    });
});

test.describe('Sitemap.xml — freshness (not automated)', () => {
    // [SM-03]/[SM-04]: live-verified end-to-end 2026-09-11 with the same
    // one-off ATS job used for [RS-03]/[RS-04] (internal title/tracking
    // code "PWFreshness1789127035383", ATS jobId 173701, Corporate Career
    // Portal — created, observed, then closed, not left as a standing
    // fixture). Findings:
    //   - [SM-04]: the job never appeared in sitemap_playwrightqa.xml at
    //     any point while live (polled for 7.5+ minutes) — but this isn't
    //     really a "freshness/SLA" finding distinct from [SM-01]:
    //     sitemap_playwrightqa.xml is completely empty (0 URLs) for this
    //     entire tenant regardless of a job's age, so a brand-new job was
    //     never going to appear either. [SM-01] already covers this
    //     defect; a dedicated [SM-04] test here would just be re-asserting
    //     the same empty-sitemap fact via a different job.
    //   - [SM-03]: couldn't be observed at all — the job was never present
    //     in sitemap.xml in the first place (see above), so there was
    //     nothing to watch disappear after closing it. Testing "closed job
    //     removed from sitemap.xml" for real would require closing one of
    //     the *already-present* Hourly Career Portal jobs (qarecruiting01's
    //     sitemap does have entries) — not attempted here since that means
    //     mutating a pre-existing job other tests may reference, not a
    //     fresh one-off created for this purpose; needs an explicit "yes,
    //     and here's which job" decision first.
    test.fixme('[SM-03] closed job\'s URL is removed from sitemap.xml', async () => {
        // See file header — not observable with a Corporate Career Portal
        // job (tenant sitemap is empty regardless, see [SM-01]); would need
        // a pre-existing Hourly Career Portal job closed instead, not
        // attempted without that being explicitly authorized.
    });

    test.fixme('[SM-04] new job\'s URL appears in sitemap.xml within the expected timeframe', async () => {
        // See file header — subsumed by [SM-01]'s finding: the tenant
        // sitemap is empty for every Corporate Career Portal job, new or
        // old, so this doesn't test anything [SM-01] doesn't already cover.
    });
});
