// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

test.describe('Quick Search Jobs', () => {
    test('[C237] search for jobs using quick search', async ({ quickSearchJobsPage, quickSearchJobsData }) => {
        await quickSearchJobsPage.searchForJob(quickSearchJobsData.search_term_1);
        const firstJobLink = await quickSearchJobsPage.getJobLinkByName(quickSearchJobsData.expected_job_1);
        await expect(firstJobLink.first()).toBeVisible();

        await quickSearchJobsPage.searchForJob(quickSearchJobsData.search_term_2);
        const secondJobLink = await quickSearchJobsPage.getJobLinkByName(quickSearchJobsData.expected_job_2);
        await expect(secondJobLink).toBeVisible();
    });

    test('[C238] search for specific job and verify single result', async ({ quickSearchJobsPage, quickSearchJobsData }) => {
        await quickSearchJobsPage.searchForJob(quickSearchJobsData.search_term_3);
        const specificJobLink = await quickSearchJobsPage.getJobLinkByName(quickSearchJobsData.expected_job_3);
        await expect(specificJobLink).toBeVisible();
    });

    test('[C299] search none with the wrong input', async ({ quickSearchJobsPage, quickSearchJobsData }) => {
        await quickSearchJobsPage.searchForJob(quickSearchJobsData.search_term_invalid);
        await expect(quickSearchJobsPage.resultsFound).toHaveText('0');
    });
});
