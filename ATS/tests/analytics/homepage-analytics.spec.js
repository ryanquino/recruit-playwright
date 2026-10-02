// @ts-check
const { test, expect } = require('../fixtures/analytics-fixture');

test.describe('Homepage Analytics', () => {
    // Runs against the Looker-enabled tenant only; see analytics-fixture.js.
    test.skip(!process.env.ANALYTICS_BASE_URL || !process.env.ANALYTICS_USERNAME || !process.env.ANALYTICS_PASSWORD,
        'ANALYTICS_BASE_URL / ANALYTICS_USERNAME / ANALYTICS_PASSWORD not set');

    test('[TC-15980] Homepage Analytics - Tooltip Icon', { tag: '@smoke' }, async ({ homepageAnalyticsPage, homepageAnalyticsData }) => {
        await expect(homepageAnalyticsPage.analyticsOverviewHeading).toBeVisible();

        for (const tile of homepageAnalyticsData.tiles) {
            await expect(homepageAnalyticsPage.getTileInfoIcon(tile)).toBeVisible();
        }
        await expect(homepageAnalyticsPage.infoIcons).toHaveCount(homepageAnalyticsData.tiles.length + homepageAnalyticsData.charts.length);

        const iconCount = await homepageAnalyticsPage.infoIcons.count();
        for (let i = 0; i < iconCount; i++) {
            const icon = homepageAnalyticsPage.infoIcons.nth(i);
            const description = await icon.getAttribute('aria-label');
            expect(description).toBeTruthy();

            await homepageAnalyticsPage.hoverInfoIcon(icon);
            await expect(homepageAnalyticsPage.getTooltip(/** @type {string} */ (description))).toBeVisible();
        }
    });

    test('[TC-15978] Dropdown Filters', { tag: '@smoke' }, async ({ homepageAnalyticsPage, homepageAnalyticsData }) => {
        const workflowReload = await homepageAnalyticsPage.selectWorkflow(homepageAnalyticsData.workflow);
        expect(workflowReload.ok()).toBeTruthy();
        expect(workflowReload.url()).toContain(`workflowId=${homepageAnalyticsData.workflowId}`);
        await expect(homepageAnalyticsPage.workflowDropdown).toContainText(homepageAnalyticsData.workflow);

        const dateReload = await homepageAnalyticsPage.selectJobsCreatedSince(homepageAnalyticsData.jobsCreatedSinceOptionIndex);
        expect(dateReload.ok()).toBeTruthy();
        expect(dateReload.url()).toContain(`jobAgeMonths=${homepageAnalyticsData.jobsCreatedSinceMonths}`);
        const startDate = await homepageAnalyticsPage.getJobsCreatedSinceStartDate();

        await homepageAnalyticsPage.clickTile(homepageAnalyticsData.filterCarryThroughTile);
        await expect(homepageAnalyticsPage.candidatePoolHeading).toBeVisible();
        await expect(homepageAnalyticsPage.candidateSearchCriteria).toContainText(`Hiring Workflow: ${homepageAnalyticsData.workflow}`);
        await expect(homepageAnalyticsPage.candidateSearchCriteria).toContainText(`Job Created Date: ${startDate} -`);
    });

    // Scope note: the Days to Hire column header only renders when the search returns candidates;
    // the analytics account has no hires yet, so the column is verified via the redirect's
    // appendColumns=daysToHire parameter instead of the table header.
    test('[TC-15979] Homepage Analytics - Average Days to Hire card', { tag: '@smoke' }, async ({ homepageAnalyticsPage, homepageAnalyticsData }) => {
        await homepageAnalyticsPage.selectWorkflow(homepageAnalyticsData.workflow);
        await homepageAnalyticsPage.selectJobsCreatedSince(homepageAnalyticsData.jobsCreatedSinceOptionIndex);
        const startDate = await homepageAnalyticsPage.getJobsCreatedSinceStartDate();

        await homepageAnalyticsPage.clickTile(homepageAnalyticsData.averageDaysToHireTile);
        await expect(homepageAnalyticsPage.candidatePoolHeading).toBeVisible();
        await expect(homepageAnalyticsPage.candidateSearchCriteria).toContainText('Job Filled: Yes');
        await expect(homepageAnalyticsPage.candidateSearchCriteria).toContainText('Current Stage: Hired');
        await expect(homepageAnalyticsPage.page).toHaveURL(/appendColumns=daysToHire/);

        // Dashboard filters carry through: workflow, jobs created since, view as recruiter
        await expect(homepageAnalyticsPage.candidateSearchCriteria).toContainText(`Hiring Workflow: ${homepageAnalyticsData.workflow}`);
        await expect(homepageAnalyticsPage.candidateSearchCriteria).toContainText(`Job Created Date: ${startDate} -`);
        await expect(homepageAnalyticsPage.candidateSearchCriteria).toContainText(`Recruiter: ${homepageAnalyticsData.recruiterName}`);
    });

    // Scope note: every recruiter shows 0 counts on lookerqa01 for the default date range, so the
    // reload is verified by the recruiter-scoped requests and the Candidate Pool filter, not by
    // comparing numbers between recruiters.
    test('[TC-15977] View as Recruiter', { tag: '@smoke' }, async ({ homepageAnalyticsPage, homepageAnalyticsData }) => {
        const { id, name } = homepageAnalyticsData.viewAsRecruiter;

        const recruiterReload = await homepageAnalyticsPage.selectViewAsRecruiter(id);
        expect(recruiterReload.ok()).toBeTruthy();
        await expect(homepageAnalyticsPage.analyticsOverviewHeading).toBeVisible();
        await expect(homepageAnalyticsPage.viewAsRecruiterDropdown).toHaveValue(id);

        await homepageAnalyticsPage.clickTile(homepageAnalyticsData.filterCarryThroughTile);
        await expect(homepageAnalyticsPage.candidatePoolHeading).toBeVisible();
        await expect(homepageAnalyticsPage.candidateSearchCriteria).toContainText(`Recruiter: ${name}`);
    });
});
