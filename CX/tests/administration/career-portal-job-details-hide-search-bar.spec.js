// @ts-check
const { test, expect } = require('../fixtures/administration-fixture');

// [C163] Manage Job Details Page - Hide Search Bar. Live-verified
// (2026-08-27) against /playwrightqa/admin/JobBoards/JobListings?portalId=2577 —
// the non-Fee-Agency counterpart of FeeAgencyJobDetailsPage, same admin app,
// same add/edit/clone/publish/delete/view/archive panel mechanism and
// icon-title pattern ("... job details page").
//
// Independent of the Publish/View/Archive and Delete specs in this same
// feature area — split into its own file so it doesn't have to share a
// file (or run order) with either.
test.describe('Manage Job Details Page - Hide Search Bar', () => {
    // Shared portal setting — every other Quick/Configured Apply test
    // against this portal depends on the job details page rendering
    // normally, so restore it to its original (visible) state afterward,
    // same convention as career-portal-application-form-toggle.spec.js's
    // C155/C156 restore.
    test.afterEach(async ({ careerPortalJobDetailsPage, careerPortalJobDetailsData }) => {
        // The test body navigates away to the candidate-facing job details
        // page to verify the toggle's effect — go back to the admin
        // settings page first, since setHideJobSearchBar() needs the
        // toggle control to be on-screen.
        await careerPortalJobDetailsPage.goToJobDetailsPage(careerPortalJobDetailsData.portalId);
        await careerPortalJobDetailsPage.setHideJobSearchBar(false);
    });

    test('[C163] Enable Job Details Page - Hide "Search jobs by keywords" bar on Job Details page', async ({ careerPortalJobDetailsPage, careerPortalJobDetailsData }) => {
        await expect(careerPortalJobDetailsPage.pageHeading).toBeVisible();
        await careerPortalJobDetailsPage.setHideJobSearchBar(true);
        await careerPortalJobDetailsPage.goToCandidateJobDetails(careerPortalJobDetailsData.jobTitle);
        await expect(careerPortalJobDetailsPage.candidateJobSearchBox).not.toBeVisible();
    });
});
