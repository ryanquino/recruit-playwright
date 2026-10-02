// @ts-check
const { test, expect } = require('../fixtures/administration-fixture');

// [C167]/[C169]/[C170] Manage Job Details Page - Publish/View/Archive.
// Same admin app as career-portal-job-details-hide-search-bar.spec.js (see
// that file's header) — /playwrightqa/admin/JobBoards/JobListings.
//
// Each test creates and publishes its own page instead of chaining off a
// sibling test's — same self-contained pattern as fee-agency-job-details
// .spec.js's [C176] View. This used to be one test.describe.serial() block
// (Publish -> View the same page -> Archive the same page); a flaky
// Publish then skipped View and Archive too, even though neither actually
// needs that specific page — just *a* published one.
//
// Publishing is one-way in this app, same as career-portal-application-form
// -crud.spec.js — each of these leaves its own page permanently published
// (View) or archived (Archive) behind on this portal.
test.describe('Manage Job Details Page - Publish/View/Archive', () => {
    test('[C167] Publish', async ({ careerPortalJobDetailsPage }, testInfo) => {
        const pageName = `PW Job Details Publish ${testInfo.workerIndex}-${Date.now()}`;
        await careerPortalJobDetailsPage.createJobDetailsPage(pageName);
        await careerPortalJobDetailsPage.publishJobDetailsPage(pageName);
        await expect(careerPortalJobDetailsPage.pageStatusText(pageName)).toContainText('Published');
    });

    test('[C169] View', async ({ careerPortalJobDetailsPage }, testInfo) => {
        const pageName = `PW Job Details View ${testInfo.workerIndex}-${Date.now()}`;
        await careerPortalJobDetailsPage.createJobDetailsPage(pageName);
        await careerPortalJobDetailsPage.publishJobDetailsPage(pageName);
        await careerPortalJobDetailsPage.viewJobDetailsPage(pageName);
        await expect(careerPortalJobDetailsPage.viewLiveHeading).toBeVisible();
    });

    test('[C170] Archive', async ({ careerPortalJobDetailsPage }, testInfo) => {
        const pageName = `PW Job Details Archive ${testInfo.workerIndex}-${Date.now()}`;
        await careerPortalJobDetailsPage.createJobDetailsPage(pageName);
        await careerPortalJobDetailsPage.publishJobDetailsPage(pageName);
        await careerPortalJobDetailsPage.archiveJobDetailsPage(pageName);
        await expect(careerPortalJobDetailsPage.pageStatusText(pageName)).toContainText('Archived');
    });
});
