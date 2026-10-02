// @ts-check
const { test, expect } = require('../fixtures/administration-fixture');

// [C168] Manage Job Details Page - Delete. Same admin app as
// career-portal-job-details-hide-search-bar.spec.js (see that file's
// header) — /playwrightqa/admin/JobBoards/JobListings.
//
// Fully self-contained (creates and deletes its own draft page) — no
// shared state with the Hide Search Bar or Publish/View/Archive specs in
// this same feature area, so it doesn't need to run serially with (or
// after) either of them. Split into its own file for that reason.
test.describe('Manage Job Details Page - Delete', () => {
    test('[C168] Delete', async ({ careerPortalJobDetailsPage }) => {
        const draftName = `PW Job Details Delete ${Date.now()}`;
        await careerPortalJobDetailsPage.createJobDetailsPage(draftName);
        await expect(careerPortalJobDetailsPage.pagePanel(draftName)).toBeVisible();

        await careerPortalJobDetailsPage.deleteJobDetailsPage(draftName);
        await expect(careerPortalJobDetailsPage.pagePanel(draftName)).not.toBeVisible();
    });
});
