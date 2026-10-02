// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

test.describe('Job Templates Page - Job Postings Column Links', () => {
    test('[C184262] job postings count is a clickable link that filters Job Tracking by template', async ({ jobTemplatesPage, jobPostingsColumnLinksData }) => {
        await jobTemplatesPage.viewAllTemplates();

        const postingsLink = await jobTemplatesPage.getJobPostingsCountLink(jobPostingsColumnLinksData.templateName);
        await expect(postingsLink).toBeVisible();

        await jobTemplatesPage.clickJobPostingsLink(jobPostingsColumnLinksData.templateName);

        const filterSummary = await jobTemplatesPage.getJobTemplateFilterSummary();
        await expect(filterSummary).toContainText(jobPostingsColumnLinksData.templateName);
    });
});
