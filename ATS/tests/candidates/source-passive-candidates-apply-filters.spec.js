// @ts-check
const { test, expect } = require('../fixtures/candidates-fixture');

test.describe('Source Passive Candidates - Apply Filters', () => {
    test('[C106289] Apply Job Title filter', async ({ sourcePassiveCandidatesPage, sourcePassiveCandidateData }) => {
        await sourcePassiveCandidatesPage.applyCandidateFilter('jobTitle', sourcePassiveCandidateData.job_title);
        const result = await sourcePassiveCandidatesPage.getResult();
        // Extended timeout needed - ROSI external search can take 15-30s to return results
        await expect(result).toBeVisible({ timeout: 40000 });
        await expect(sourcePassiveCandidatesPage.searchQuerySummary).toContainText(sourcePassiveCandidateData.job_title);

        // Verify only Start Over button is visible, Apply button is not
        await expect(sourcePassiveCandidatesPage.startOverButtonLocator).toBeVisible();
        await expect(sourcePassiveCandidatesPage.applyButtonInResultsLocator).not.toBeVisible();
    });
});
