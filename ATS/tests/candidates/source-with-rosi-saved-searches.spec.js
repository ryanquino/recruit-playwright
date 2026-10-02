// @ts-check
const { test, expect } = require('../fixtures/candidates-fixture');

test.describe.serial('Source with ROSI - Saved Searches', () => {
    test('[C261525] Save search and verify in saved searches list', async ({ sourcePassiveCandidatesPage, sourcePassiveCandidateData }) => {
        // Apply filters
        await sourcePassiveCandidatesPage.applyCandidateFilter('jobTitle', sourcePassiveCandidateData.job_title);

        // Verify filters are applied
        await expect(sourcePassiveCandidatesPage.includedFilter.filter({ hasText: sourcePassiveCandidateData.job_title })).toBeVisible();

        // Save search
        await sourcePassiveCandidatesPage.saveSearchAs(sourcePassiveCandidateData.saved_search_name);
        await expect(sourcePassiveCandidatesPage.savedSuccessfullyMessage).toBeVisible();

        // View all saved searches
        await sourcePassiveCandidatesPage.viewAllSavedSearches();
        await expect(sourcePassiveCandidatesPage.mySavedSearchesHeading).toBeVisible();
        await expect(sourcePassiveCandidatesPage.nameColumnHeader).toBeVisible();
        await expect(sourcePassiveCandidatesPage.locationColumnHeader).toBeVisible();
        await expect(sourcePassiveCandidatesPage.dateUpdatedColumnHeader).toBeVisible();
        await expect(sourcePassiveCandidatesPage.getSavedSearchByName(sourcePassiveCandidateData.saved_search_name)).toBeVisible();
    });

    test('[C150306] Delete saved search', async ({ sourcePassiveCandidatesPage, sourcePassiveCandidateData }) => {
        // Navigate to Source with ROSI page (already done by fixture)
        
        // View all saved searches
        await sourcePassiveCandidatesPage.viewAllSavedSearches();
        await expect(sourcePassiveCandidatesPage.mySavedSearchesHeading).toBeVisible();
        await expect(sourcePassiveCandidatesPage.nameColumnHeader).toBeVisible();
        await expect(sourcePassiveCandidatesPage.locationColumnHeader).toBeVisible();
        await expect(sourcePassiveCandidatesPage.dateUpdatedColumnHeader).toBeVisible();

        // Hover over saved search to reveal delete button
        await sourcePassiveCandidatesPage.hoverOverSavedSearch(sourcePassiveCandidateData.saved_search_name);

        // Delete saved search
        await sourcePassiveCandidatesPage.deleteButton.click();
        await expect(sourcePassiveCandidatesPage.deleteConfirmationText).toBeVisible();
        await sourcePassiveCandidatesPage.continueButton.click();
        await expect(sourcePassiveCandidatesPage.deletedSuccessfullyMessage).toBeVisible();
    });
});
