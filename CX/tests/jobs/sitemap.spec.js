// @ts-check
const { test, expect } = require('../fixtures/sitemap-fixture');
const SitemapPage = require('../../pages/jobs/sitemap.page');

// Live-verified (2026-09-09): a job/apply link for an ID that doesn't exist
// still returns HTTP 200 — the app renders this message server-side instead
// of a 4xx, so a status-code-only check would miss a broken sitemap link.
const NOT_FOUND_MARKER = 'We apologize for the inconvenience, but we cannot find this position';

// The sitemap covers Corporate Career Portal only (see sitemap.page.js's
// hardcoded goto()) — the completeness check below is scoped to match.
const TENANT_PORTAL_PATH = 'playwrightqa/CorporateCareerPortal';

test.describe('Sitemap', () => {
    test('[C31378] Sitemap lists the core navigation links', { tag: '@smoke' }, async ({ sitemapPage }) => {
        // Scoped to #mainContent: "My Account"/"Jobs" also appear in the
        // header banner nav outside the sitemap's own link list, which
        // would otherwise trip a strict-mode "resolved to 2 elements" error.
        const sitemapList = sitemapPage.page.locator('#mainContent');

        await expect(sitemapPage.heading).toBeVisible();
        await expect(sitemapList.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
        await expect(sitemapList.getByRole('link', { name: 'My Account', exact: true })).toBeVisible();
        await expect(sitemapList.getByRole('link', { name: 'Open Submission', exact: true })).toBeVisible();
        await expect(sitemapList.getByRole('link', { name: 'Jobs', exact: true })).toBeVisible();
    });

    test('[Sitemap] every link on the page returns a working response', async ({ sitemapPage, request }) => {
        const links = await sitemapPage.getAllLinks();
        expect(links.length).toBeGreaterThan(0);

        for (const link of links) {
            await test.step(`${link.text} -> ${link.href}`, async () => {
                const response = await request.get(link.href);
                expect.soft(response.status(), `${link.href} returned HTTP ${response.status()}`).toBeLessThan(400);

                const body = await response.text();
                expect.soft(
                    body.includes(NOT_FOUND_MARKER),
                    `${link.href} rendered a "position not found" error page`
                ).toBe(false);
            });
        }
    });
});

test.describe('Sitemap job detail links', () => {
    test('[Sitemap] every job detail link opens a matching, working job page', async ({ sitemapPage, page, jobDetailsPage }) => {
        test.setTimeout(120_000);

        const links = await sitemapPage.getAllLinks();
        const jobLinks = links.filter(link => /\/jobs\/\d+$/.test(link.href));
        expect(jobLinks.length).toBeGreaterThan(0);

        for (const link of jobLinks) {
            await test.step(`${link.text} -> ${link.href}`, async () => {
                await page.goto(link.href);
                await page.waitForLoadState('domcontentloaded');

                await expect.soft(jobDetailsPage.jobTitleHeading).toBeVisible();
                await expect.soft(jobDetailsPage.jobTitleHeading).toContainText(link.text);

                const applyIsUsable = await jobDetailsPage.isApplyButtonVisibleAndClickable();
                expect.soft(applyIsUsable, `${link.href} did not show a usable Apply button`).toBe(true);
            });
        }
    });
});

test.describe('Sitemap Apply links', () => {
    test('[Sitemap] every Apply link opens a working application entry point', async ({ sitemapPage, page }) => {
        test.setTimeout(120_000);

        const links = await sitemapPage.getAllLinks();
        const applyLinks = links.filter(link => link.href.includes('/Apply/QuickApply/'));
        expect(applyLinks.length).toBeGreaterThan(0);

        for (const link of applyLinks) {
            await test.step(`${link.text} -> ${link.href}`, async () => {
                await page.goto(link.href);
                await page.waitForLoadState('domcontentloaded');

                const mainContentText = await page.locator('#mainContent').innerText();
                expect.soft(
                    mainContentText.includes(NOT_FOUND_MARKER),
                    `${link.href} rendered a "position not found" error page`
                ).toBe(false);

                // Apply flow starts behind a presubmission Accept/Decline gate for
                // some jobs, or opens straight to the application form for others
                // (live-verified 2026-09-09) — either counts as "working".
                const presubmissionGateVisible = await page.getByRole('button', { name: 'Accept' }).isVisible().catch(() => false);
                const applicationFormVisible = await page.locator('form').first().isVisible().catch(() => false);

                expect.soft(
                    presubmissionGateVisible || applicationFormVisible,
                    `${link.href} showed neither a presubmission gate nor an application form`
                ).toBe(true);
            });
        }
    });
});

test.describe('Sitemap completeness', () => {
    // Does every job the portal currently shows have a sitemap entry, and
    // does every job-detail link in the sitemap correspond to a job the
    // portal currently shows? Joined by job ID (extracted from the URL)
    // rather than the full link/href string, so this doesn't false-positive
    // on a relative-vs-absolute URL difference. Walks every page of job-list
    // results (getAllResultCardsAcrossPages) — a single-page read would
    // silently under-count any portal with more than 25 jobs.
    test('[C31379] every job on the portal has a sitemap link, and every job-detail sitemap link is a job the portal currently shows', { tag: '@smoke' }, async ({ sitemapPage, jobsListPage }) => {
        test.setTimeout(90_000);

        // Sequential, not Promise.all: sitemapPage and jobsListPage drive
        // the same underlying page/browser context (Playwright's default
        // `page` fixture), so navigating one concurrently with reading the
        // other destroys the execution context mid-evaluate.
        const sitemapLinks = await sitemapPage.getAllLinks();
        await jobsListPage.goto(TENANT_PORTAL_PATH);
        const portalCards = await jobsListPage.getAllResultCardsAcrossPages();

        const sitemapJobIds = new Set(
            sitemapLinks.map(l => SitemapPage.extractJobId(l.href)).filter(Boolean)
        );
        const portalJobIds = new Set(
            portalCards.map(c => SitemapPage.extractJobId(c.href)).filter(Boolean)
        );

        expect(portalJobIds.size, 'no jobs found on the portal job list to compare against').toBeGreaterThan(0);

        const missingFromSitemap = [...portalJobIds].filter(id => !sitemapJobIds.has(id));
        const extraInSitemap = [...sitemapJobIds].filter(id => !portalJobIds.has(id));

        expect.soft(missingFromSitemap, `job(s) shown on the portal but missing from the sitemap: ${missingFromSitemap.join(', ')}`).toEqual([]);
        expect.soft(extraInSitemap, `job(s) in the sitemap that aren't currently shown on the portal: ${extraInSitemap.join(', ')}`).toEqual([]);
    });
});
