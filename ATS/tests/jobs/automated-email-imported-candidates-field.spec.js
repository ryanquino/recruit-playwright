// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

test.describe('Automated Email for Imported Candidates Field', () => {
    test('[C234851] Verify field is visible on Create Job Posting page', async ({ createJobPostingPage }) => {
        await expect(createJobPostingPage.page.getByRole('heading', { name: 'Create Job Posting' })).toBeVisible();
        await expect(createJobPostingPage.automatedEmailForImportedCandidatesLabel).toBeVisible();
        await expect(createJobPostingPage.automatedEmailForImportedCandidatesDropdown).toBeVisible();
    });

    test('[C261546] Verify field is visible on Edit Job Posting page', async ({ jobDetailsPage }) => {
        await jobDetailsPage.specificPlaywrightTestJobLink.click();

        // Open Edit Job Posting page
        await jobDetailsPage.ellipsisMenuLinks.click();
        await jobDetailsPage.editJobLink.click();

        // Verify Edit Job Posting page loaded
        await expect(jobDetailsPage.editJobPostingHeading).toBeVisible();

        // Verify Automated Email for Imported Candidates field is visible
        await expect(jobDetailsPage.automatedEmailForImportedCandidatesLabel).toBeVisible();
        await expect(jobDetailsPage.automatedEmailForImportedCandidatesDropdown).toBeVisible();
    });
});
