// @ts-check
const { test, expect } = require('../fixtures/job-list-fixture');
const CreateJobPostingPage = require('../../../ATS/pages/jobs/create-job-posting.page');
const JobDetailsPage = require('../../pages/jobs/job-details.page');

test.describe('CX Search', () => {
    test('[C6] Keyword search', { tag: '@smoke' }, async ({ jobsListPage, jobsListData }) => {
        await jobsListPage.keywordSearch(jobsListData.keyword);
        const isVisible = await jobsListPage.isJobSearchSectionVisible();
        await expect(isVisible).toBe(true);
    });

    test('[C7] Location search', { tag: '@smoke' }, async ({ jobsListPage, jobsListData }) => {
        await jobsListPage.locationSearch(jobsListData.country);
        const isVisible = await jobsListPage.isJobSearchSectionVisible();
        await expect(isVisible).toBe(true);
    });

    test('[C8] Categories search', { tag: '@smoke' }, async ({ jobsListPage, jobsListData }) => {
        await jobsListPage.categorySearch(jobsListData.category);
        const isVisible = await jobsListPage.isJobSearchSectionVisible();
        await expect(isVisible).toBe(true);
    });

    test('[C9] Position type search', { tag: '@smoke' }, async ({ jobsListPage, jobsListData }) => {
        await jobsListPage.positionTypeSearch(jobsListData.positionType);
        const isVisible = await jobsListPage.isJobSearchSectionVisible();
        await expect(isVisible).toBe(true);
    });

    // [SC-063] Live-verified (2026-09-17): this portal's keyword search is a
    // loose/full-text match (it can match on description text, not just the
    // title — e.g. searching "Change" also returned "Account Executive" and
    // "Project Manager"), so asserting every *title* contains the keyword
    // would be both wrong and, for a broad term like "Playwright", would
    // pass even if the search did nothing at all (this catalog is almost
    // entirely Playwright-authored test jobs). Asserts the two properties
    // that actually demonstrate the search filters: a known real job is
    // present for a real term, and a nonsense term returns nothing.
    test('[C31371] Keyword search returns a known match and excludes an unrelated term', { tag: '@smoke' }, async ({ jobsListPage, jobsListData }) => {
        await jobsListPage.keywordSearch(jobsListData.keyword);
        const titles = await jobsListPage.getResultTitles();
        expect(titles.length).toBeGreaterThan(0);
        expect(titles).toContain(jobsListData.knownJobTitleForKeyword);

        // Fresh navigation first: keywordSearch() re-submits on top of
        // whatever's already loaded rather than resetting it, so searching
        // again on the same page can pick up stale results (live-verified
        // 2026-09-17).
        await jobsListPage.page.goto('playwrightqa/CorporateCareerPortal2');
        await jobsListPage.keywordSearch(jobsListData.noMatchKeyword);
        const noMatchTitles = await jobsListPage.getResultTitles();
        expect(noMatchTitles.length).toBe(0);
    });

    // [SC-064] Combining two facets should apply AND (intersection) logic,
    // not OR: the combined result set must be no larger than either facet
    // applied alone, and strictly smaller than the broader facet
    // (Position Type, which matches most jobs) to prove the narrower
    // facet (Category) actually constrained it rather than being ignored.
    test('[C31331] Combining facets applies AND logic, not OR', { tag: '@smoke' }, async ({ jobsListPage, jobsListData, page }) => {
        const cxUrl = 'playwrightqa/CorporateCareerPortal2';

        await jobsListPage.categorySearch(jobsListData.category);
        const categoryOnlyCount = (await jobsListPage.getResultTitles()).length;

        // Fresh navigation between each measurement: the facet search
        // helpers apply their filter on top of whatever's already
        // selected on the page rather than replacing it, so reusing the
        // same page across measurements would silently accumulate filters
        // instead of isolating "Position Type alone".
        await page.goto(cxUrl);
        await jobsListPage.positionTypeSearch(jobsListData.positionType);
        const positionTypeOnlyCount = (await jobsListPage.getResultTitles()).length;

        await page.goto(cxUrl);
        await jobsListPage.categoryAndPositionTypeSearch(jobsListData.category, jobsListData.categoryDataValue, jobsListData.positionType);
        const combinedTitles = await jobsListPage.getResultTitles();

        expect(combinedTitles.length).toBeGreaterThan(0);
        expect(combinedTitles.length).toBeLessThanOrEqual(categoryOnlyCount);
        expect(combinedTitles.length).toBeLessThan(positionTypeOnlyCount);
    });
});

test.describe('Pagination', () => {
    // [SC-065] Walks from page 1 to page 2 and confirms every job is shown
    // exactly once across the two pages: no job repeated, none dropped, and
    // the page indicator actually advances. Compares by href (each job's
    // unique CX URL), not title — live-verified (2026-09-17) this catalog
    // has genuinely duplicate-titled jobs (different jobs, same title), so
    // title alone isn't a safe uniqueness key here (matches this page
    // object's own getAllResultCards() comment about trackingCode).
    test('[C31332] Job list pagination shows no duplicate or missing jobs across pages', async ({ jobsListPage, page }) => {
        await expect(jobsListPage.prevPageButton).toBeDisabled();
        const pageOneIndicator = await jobsListPage.pageIndicator.innerText();
        const pageOneCards = await jobsListPage.getAllResultCards();
        expect(pageOneCards.length).toBeGreaterThan(0);

        await jobsListPage.nextPageButton.click();
        await page.waitForLoadState('domcontentloaded');

        const pageTwoIndicator = await jobsListPage.pageIndicator.innerText();
        const pageTwoCards = await jobsListPage.getAllResultCards();
        expect(pageTwoCards.length).toBeGreaterThan(0);
        expect(pageTwoIndicator).not.toBe(pageOneIndicator);

        const pageOneHrefs = pageOneCards.map(card => card.href);
        const overlap = pageTwoCards.filter(card => pageOneHrefs.includes(card.href));
        expect(overlap.length).toBe(0);
    });
});

test.describe('Job Alert', () => {
    test('[C13246] Create Job Alert', { tag: '@smoke' }, async ({ jobsListPage, jobsListData }) => {
        await jobsListPage.keywordSearch(jobsListData.keyword);
        await jobsListPage.createJobAlert(jobsListData.jobAlertDetails);
        await expect(jobsListPage.flashMessageContainer).toBeVisible();
        await expect(jobsListPage.flashMessageText).toHaveText('Your job alert has been created for you.');
    });
});

// Deactivating/closing a job in ATS must remove it from the CX job list —
// this verifies the flip side, that a deactivated job's own direct CX URL
// no longer resolves to the job either. Reuses the "Playwright Deactivation
// Test" job that ATS/tests/jobs/jobs-bulk-action.spec.js's [C208]/[C210]
// deactivate/reactivate, so it must leave that job active again afterward
// (afterAll below) for that suite to keep working.
test.describe.serial('Deactivated Job Not Visible on CX', () => {
    test('Deactivated job shows the "position not found" message on its CX job details page', async ({ jobsListPage, jobsListData }) => {
        // ATS login + deactivate, then polling CX for the async-indexed
        // removal (up to 6 retries at 15s apiece — see waitForJobNotFound()),
        // comfortably exceed the 60s default test timeout.
        test.setTimeout(180000);

        const deactivatedJobData = jobsListData.deactivatedJob;
        const page = jobsListPage.page;
        const createJobPosting = new CreateJobPostingPage(page);
        const cxJobDetailsPage = new JobDetailsPage(page);

        await page.goto(process.env.ATS_BASE_URL || 'https://playwrightqa-openhire.silkroad-eng.com');
        await createJobPosting.login();
        await page.waitForLoadState('networkidle');
        // Jobs menu isn't expanded yet on a fresh post-login page, and
        // deactivateJobPostingAndGetId() goes straight for the Job Tracking
        // item under it (same caveat as job-details.spec.js's afterAll).
        await createJobPosting.jobsMenuItem.click();

        const jobId = await createJobPosting.deactivateJobPostingAndGetId(deactivatedJobData.jobTitle);
        expect(jobId, 'expected a numeric jobId in the ATS job details URL').toBeTruthy();

        // Deactivating in ATS doesn't hide the job from CX instantly — poll
        // until it does (or exhaust retries and let the assertion below fail
        // with a clear diff).
        await cxJobDetailsPage.waitForJobNotFound(deactivatedJobData.portalPath, jobId);
        await expect(cxJobDetailsPage.jobNotFoundMessage).toHaveText(deactivatedJobData.notFoundMessage);
    });

    // Cleanup — reactivate the shared job so other suites relying on it
    // (jobs-bulk-action.spec.js [C208]/[C210]) find it active on their next run.
    test.afterAll(async ({ browser, jobsListData }) => {
        test.setTimeout(120000);
        const context = await browser.newContext();
        const page = await context.newPage();
        const createJobPosting = new CreateJobPostingPage(page);
        try {
            await page.goto(process.env.ATS_BASE_URL || 'https://playwrightqa-openhire.silkroad-eng.com');
            await createJobPosting.login();
            await page.waitForLoadState('networkidle');
            await createJobPosting.jobsMenuItem.click();
            await createJobPosting.reactivateJobPosting(jobsListData.deactivatedJob.jobTitle);
        } catch (error) {
            console.warn('Deactivated Job Not Visible on CX afterAll cleanup failed (non-fatal):', error instanceof Error ? error.message : String(error));
        } finally {
            await context.close();
        }
    });
});

// Fixed, pre-existing jobs in this QA env, each in a non-open ATS posting
// status that shouldn't be visible to candidates — On Hold (pending/paused),
// Closed (positions filled), Limited (restricted visibility). None are
// created/toggled by this test, so there's nothing to clean up afterward.
const NON_OPEN_JOB_KEYS = [
    { status: 'On Hold', key: 'onHold' },
    { status: 'Closed', key: 'closed' },
    { status: 'Limited', key: 'limited' },
];

test.describe('Non-Open Jobs Not Visible on CX', () => {
    for (const { status, key } of NON_OPEN_JOB_KEYS) {
        test(`${status} job does not appear on the CX job list`, async ({ jobsListPage, jobsListData }) => {
            // Paging through the full job list (see isJobTitleInList()) across
            // several pages can comfortably exceed the 60s default test timeout.
            test.setTimeout(90000);

            const data = jobsListData.nonOpenJobs[key];
            const isListed = await jobsListPage.isJobTitleInList(data.jobTitle);
            expect(isListed, `expected "${data.jobTitle}" (${status}, ATS jobId ${data.jobId}) not to appear on the CX job list`).toBe(false);
        });
    }
});