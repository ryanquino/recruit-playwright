// @ts-check
const { test, expect } = require('../fixtures/administration-fixture');

// [C171]-[C176] Manage Fee Agency Job Details Page. Live-verified
// (2026-08-27) against /playwrightqa/admin/FeeAgency/JobListings?portalId=2577
// (Career Site List > Corporate Career Portal > Fee Agency Job Details Page):
// this is the exact same add/edit/clone/publish/delete panel mechanism as
// career-portal-application-form-crud.spec.js's [C157]-[C161] — same panel
// structure, same icon titles pattern ("Edit/Clone/Publish/Delete job
// details page" vs. "... application form").
//
// [C171]'s TestRail title says "Adding forms x 5 scenarios", but this
// portal only has one language enabled ("English (English) [en]") — the
// precondition's "do this for each language" reduces to a single add here;
// there's no second locale row to repeat it against in this environment.
//
// Publishing is one-way in this app — a published page's edit/clone/
// publish/delete icons disappear, leaving only "View" (matching
// career-portal-application-form.page.js's documented behavior).
//
// Each test creates its own page instead of chaining off a sibling test's
// output — same self-contained pattern as career-portal-application-form
// -crud.spec.js's [C157]-[C161] and career-portal-job-details-publish-
// view-archive.spec.js's [C167]/[C169]/[C170]. This used to be one
// test.describe.serial() block (create -> edit that same page -> clone
// the edit -> publish the clone -> delete the edit); live-verified
// (run 34127983964, 2026-09-07) that a single flaky [C172] Edit timeout
// (waiting on the edit icon of the page [C171] had just created) cascade-
// skipped [C173]-[C176] too, even though none of them actually need a
// sibling test's output — Edit/Clone/Publish/Delete each only need *some*
// page to act on. All names still get a per-run unique suffix (worker
// index + timestamp): live-verified (2026-08-28) that a fixed name risks
// colliding with a stale draft left behind by a prior cancelled/failed
// run — this shared QA portal once accumulated 5 undeleted duplicate
// "PW Fee Agency Job Details CRUD" panels this way, causing a strict-mode
// violation on a locator expected to match exactly 1.
test.describe('Manage Fee Agency Job Details Page', () => {
    test('[C171] Manage Fee Agency Job Details Page - Adding forms x 5 scenarios', async ({ feeAgencyJobDetailsPage, feeAgencyJobDetailsData }, testInfo) => {
        const pageName = `${feeAgencyJobDetailsData.pageName} ${testInfo.workerIndex}-${Date.now()}`;
        await expect(feeAgencyJobDetailsPage.pageHeading).toBeVisible();
        await feeAgencyJobDetailsPage.createJobDetailsPage(pageName);
        await expect(feeAgencyJobDetailsPage.pagePanel(pageName)).toBeVisible();
    });

    test('[C172] Edit', async ({ feeAgencyJobDetailsPage, feeAgencyJobDetailsData }, testInfo) => {
        const suffix = `${testInfo.workerIndex}-${Date.now()}`;
        const pageName = `${feeAgencyJobDetailsData.pageName} Edit Source ${suffix}`;
        const updatedPageName = `${feeAgencyJobDetailsData.updatedPageName} ${suffix}`;
        await feeAgencyJobDetailsPage.createJobDetailsPage(pageName);
        await feeAgencyJobDetailsPage.editJobDetailsPage(pageName, updatedPageName);
        await expect(feeAgencyJobDetailsPage.pagePanel(updatedPageName)).toBeVisible();
    });

    test('[C173] Clone', async ({ feeAgencyJobDetailsPage, feeAgencyJobDetailsData }, testInfo) => {
        const suffix = `${testInfo.workerIndex}-${Date.now()}`;
        const sourcePageName = `${feeAgencyJobDetailsData.pageName} Clone Source ${suffix}`;
        const clonedPageName = `${feeAgencyJobDetailsData.clonedPageName} ${suffix}`;
        await feeAgencyJobDetailsPage.createJobDetailsPage(sourcePageName);
        await feeAgencyJobDetailsPage.cloneJobDetailsPage(sourcePageName, clonedPageName);
        await expect(feeAgencyJobDetailsPage.pagePanel(clonedPageName)).toBeVisible();
        await expect(feeAgencyJobDetailsPage.pagePanel(sourcePageName)).toBeVisible();
    });

    // Publishing is a one-way action in this app (see file header) — this
    // leaves its freshly created page permanently published on this portal.
    test('[C174] Publish', async ({ feeAgencyJobDetailsPage, feeAgencyJobDetailsData }, testInfo) => {
        const pageName = `${feeAgencyJobDetailsData.pageName} Publish Source ${testInfo.workerIndex}-${Date.now()}`;
        await feeAgencyJobDetailsPage.createJobDetailsPage(pageName);
        await feeAgencyJobDetailsPage.publishJobDetailsPage(pageName);
        await expect(feeAgencyJobDetailsPage.pageStatusText(pageName)).toContainText('Published');
    });

    test('[C175] Delete', async ({ feeAgencyJobDetailsPage, feeAgencyJobDetailsData }, testInfo) => {
        const pageName = `${feeAgencyJobDetailsData.pageName} Delete Source ${testInfo.workerIndex}-${Date.now()}`;
        await feeAgencyJobDetailsPage.createJobDetailsPage(pageName);
        await feeAgencyJobDetailsPage.deleteJobDetailsPage(pageName);
        await expect(feeAgencyJobDetailsPage.pagePanel(pageName)).not.toBeVisible();
    });

    // [C176] View — live-verified (2026-08-27/28): a freshly created +
    // published page exposes a single "View job details page" icon once
    // published, opening a read-only "View ... Live ..." page. Already
    // self-contained (was independent of the C171-175 chain even before
    // this file was de-serialized).
    test('[C176] View', async ({ feeAgencyJobDetailsPage, feeAgencyJobDetailsData, page }, testInfo) => {
        const viewPageName = `${feeAgencyJobDetailsData.pageName} View ${testInfo.workerIndex}-${Date.now()}`;
        await feeAgencyJobDetailsPage.createJobDetailsPage(viewPageName);
        await feeAgencyJobDetailsPage.publishJobDetailsPage(viewPageName);
        await expect(feeAgencyJobDetailsPage.pageStatusText(viewPageName)).toContainText('Published');

        await feeAgencyJobDetailsPage.viewJobDetailsPage(viewPageName);
        await expect(page.getByRole('heading', { name: new RegExp(`^View .* Live .* for ${feeAgencyJobDetailsData.careerPortalName}$`) })).toBeVisible();
    });
});
