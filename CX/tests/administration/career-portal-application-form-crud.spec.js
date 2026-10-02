// @ts-check
const { test, expect } = require('../fixtures/administration-fixture');

// [C157]-[C161] Career Portal - Configured Application Form CRUD. Same
// separate CX Admin app as career-portal-application-form-toggle.spec.js
// (see that file's header), against portalId 2609 (Hourly Career Portal).
//
// Also live-verified: published configured forms are immutable in this
// app — the edit/clone/publish/delete icons disappear once published,
// leaving only "View". So [C160] leaves one permanently published form
// behind on this portal — that's the only state the real app allows, not
// test debris left uncleaned.
//
// Each test creates its own form instead of chaining off a sibling test's
// output — same self-contained pattern as career-portal-open-submission
// .spec.js's [C119]-[C122] and fee-agency-job-details.spec.js's [C176].
// This used to be one test.describe.serial() block (create -> edit that
// same form -> clone the edit -> publish the clone -> delete the edit);
// a single flaky step (e.g. a login timeout on [C157]) then skipped every
// test after it in the chain, even though Edit/Clone/Publish/Delete don't
// actually need each other's output — each only needs *a* form to act on,
// not specifically the one a sibling test produced. All names still get a
// per-run unique suffix (worker index + timestamp), same reasoning as
// before: a fixed name risks colliding with a stale draft left behind by
// a prior cancelled/failed run — live-verified (2026-09-03): 6 stale
// "PW Application Form CRUD" drafts had accumulated this way, causing a
// strict-mode violation on a locator expected to match exactly 1.
test.describe('Career Portal - Configured Application Form CRUD', () => {
    test('[C157] Create Configured Application Form', async ({ careerPortalApplicationFormPage, careerPortalApplicationFormData }, testInfo) => {
        const formName = `${careerPortalApplicationFormData.formName} ${testInfo.workerIndex}-${Date.now()}`;
        await careerPortalApplicationFormPage.createConfiguredForm(formName);
        await expect(careerPortalApplicationFormPage.formPanel(formName)).toBeVisible();
    });

    test('[C158] Edit Configured Application Forms', async ({ careerPortalApplicationFormPage, careerPortalApplicationFormData }, testInfo) => {
        const suffix = `${testInfo.workerIndex}-${Date.now()}`;
        const formName = `${careerPortalApplicationFormData.formName} Edit Source ${suffix}`;
        const updatedFormName = `${careerPortalApplicationFormData.updatedFormName} ${suffix}`;
        await careerPortalApplicationFormPage.createConfiguredForm(formName);
        await careerPortalApplicationFormPage.editConfiguredForm(formName, updatedFormName);
        await expect(careerPortalApplicationFormPage.formPanel(updatedFormName)).toBeVisible();
    });

    test('[C159] Clone Configured Application Forms', async ({ careerPortalApplicationFormPage, careerPortalApplicationFormData }, testInfo) => {
        const suffix = `${testInfo.workerIndex}-${Date.now()}`;
        const sourceFormName = `${careerPortalApplicationFormData.formName} Clone Source ${suffix}`;
        const clonedFormName = `${careerPortalApplicationFormData.clonedFormName} ${suffix}`;
        await careerPortalApplicationFormPage.createConfiguredForm(sourceFormName);
        await careerPortalApplicationFormPage.cloneConfiguredForm(sourceFormName, clonedFormName);
        await expect(careerPortalApplicationFormPage.formPanel(clonedFormName)).toBeVisible();
        await expect(careerPortalApplicationFormPage.formPanel(sourceFormName)).toBeVisible();
    });

    // Publishing is a one-way action in this app (see file header) — this
    // leaves its freshly created form permanently published on this portal.
    test('[C160] Publish Configured Application Forms', async ({ careerPortalApplicationFormPage, careerPortalApplicationFormData }, testInfo) => {
        const formName = `${careerPortalApplicationFormData.formName} Publish Source ${testInfo.workerIndex}-${Date.now()}`;
        await careerPortalApplicationFormPage.createConfiguredForm(formName);
        await careerPortalApplicationFormPage.publishConfiguredForm(formName);
        await expect(careerPortalApplicationFormPage.formStatusText(formName)).toContainText('Published');
    });

    test('[C161] Delete Configured Application Forms', async ({ careerPortalApplicationFormPage, careerPortalApplicationFormData }, testInfo) => {
        const formName = `${careerPortalApplicationFormData.formName} Delete Source ${testInfo.workerIndex}-${Date.now()}`;
        await careerPortalApplicationFormPage.createConfiguredForm(formName);
        await careerPortalApplicationFormPage.deleteConfiguredForm(formName);
        await expect(careerPortalApplicationFormPage.formPanel(formName)).not.toBeVisible();
    });
});
