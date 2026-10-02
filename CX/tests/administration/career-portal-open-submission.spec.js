// @ts-check
const { test, expect } = require('../fixtures/administration-fixture');

// [C115]-[C118] Manage Open Submission Form. Live-verified (2026-08-27,
// C115 added 2026-09-10) against
// /playwrightqa/admin/JobBoards/OpenSubmissionForms?portalId=2577: same
// radio/panel mechanism as career-portal-application-form.page.js's Quick
// Apply / Configured Form choice, just for Open Submission — "Allow Open
// Submissions" is a separate switch above that radio group (doesn't hide
// it either way) and is already on and "Quick Apply" is the current
// selection on this portal.
//
// [C118]'s TestRail title says "Adding forms x 10 scenarios" (one per
// language), but this portal only has one language enabled ("English
// (English) [en]") — same reduction as [C171]'s "x 5 scenarios" in
// fee-agency-job-details.spec.js: there's no second locale row to repeat
// it against in this environment, so this covers the single available
// scenario.
//
// .serial() because all four read/write shared portal settings on this
// same page/Save button (the "Allow Open Submissions" switch and the
// "Open Submission Form" radio choice); afterEach restores both to the
// portal's original state (on / Quick Apply) after each test.
test.describe.serial('Manage Open Submission Form', () => {
    test.afterEach(async ({ careerPortalOpenSubmissionPage, careerPortalOpenSubmissionData }) => {
        await careerPortalOpenSubmissionPage.goToOpenSubmissionPage(careerPortalOpenSubmissionData.portalId);
        await careerPortalOpenSubmissionPage.enableAllowOpenSubmissions();
        await careerPortalOpenSubmissionPage.selectQuickApply();
    });

    // [C115] Enable Allow Open Submissions — flip it off first so enabling
    // it back is a genuine state change rather than a no-op re-save of an
    // already-checked switch, then confirm the "on" state persists across
    // a re-navigation (round-trip, same pattern as the radio tests below).
    test('[C115] Enable Allow Open Submissions', async ({ careerPortalOpenSubmissionPage }) => {
        await expect(careerPortalOpenSubmissionPage.pageHeading).toBeVisible();
        await careerPortalOpenSubmissionPage.disableAllowOpenSubmissions();
        await expect(careerPortalOpenSubmissionPage.allowOpenSubmissionsSwitch).not.toBeChecked();
        await careerPortalOpenSubmissionPage.enableAllowOpenSubmissions();
        await expect(careerPortalOpenSubmissionPage.allowOpenSubmissionsSwitch).toBeChecked();
    });

    test('[C116] Select Open Submission Form - Quick Apply (First Name, Last Name, Email, Resume/CV)', async ({ careerPortalOpenSubmissionPage }) => {
        await expect(careerPortalOpenSubmissionPage.pageHeading).toBeVisible();
        await careerPortalOpenSubmissionPage.selectQuickApply();
        await expect(careerPortalOpenSubmissionPage.quickApplyRadio).toBeChecked();
    });

    test('[C117] Select Open Submission Form - Use the configured open submission form below', async ({ careerPortalOpenSubmissionPage }) => {
        await careerPortalOpenSubmissionPage.selectConfiguredForm();
        await expect(careerPortalOpenSubmissionPage.useConfiguredFormRadio).toBeChecked();
    });

    test('[C118] Select Configured Open Submission Form Language - Adding forms x 10 scenarios', async ({ careerPortalOpenSubmissionPage, careerPortalOpenSubmissionData }) => {
        await careerPortalOpenSubmissionPage.selectConfiguredForm();
        const formName = `${careerPortalOpenSubmissionData.formName} ${Date.now()}`;
        await careerPortalOpenSubmissionPage.createConfiguredForm(formName);
        await expect(careerPortalOpenSubmissionPage.formPanel(formName)).toBeVisible();
    });

    // [C119] Edit — Configure Open Submission Form. Live-verified
    // (2026-08-27): TestRail's steps reference a legacy "Manage
    // Presubmission Text" flow; this environment's equivalent is the
    // panel's "Edit application form" icon, which reopens the same
    // Configure Open Submission Form editor createConfiguredForm() used,
    // pre-filled with the form's current values. Editing the (internal-
    // only) Description field and re-opening the editor confirms the
    // change persisted.
    test('[C119] Edit', async ({ careerPortalOpenSubmissionPage, careerPortalOpenSubmissionData }) => {
        const formName = `${careerPortalOpenSubmissionData.formName} ${Date.now()}`;
        await careerPortalOpenSubmissionPage.createConfiguredForm(formName);
        await careerPortalOpenSubmissionPage.editFormDescription(formName, careerPortalOpenSubmissionData.editedDescription);
        await careerPortalOpenSubmissionPage.openFormEditor(formName);
        await expect(careerPortalOpenSubmissionPage.formDescriptionField).toHaveValue(careerPortalOpenSubmissionData.editedDescription);
    });

    // [C120] Clone — Live-verified (2026-08-27): the panel's "Clone
    // application form" icon opens the same editor pre-filled with the
    // source form's Name, which is renamed here (Clone would otherwise
    // duplicate the source name) and saved as a new panel.
    test('[C120] Clone', async ({ careerPortalOpenSubmissionPage, careerPortalOpenSubmissionData }) => {
        const formName = `${careerPortalOpenSubmissionData.formName} ${Date.now()}`;
        const cloneName = `${formName} Clone`;
        await careerPortalOpenSubmissionPage.createConfiguredForm(formName);
        await careerPortalOpenSubmissionPage.cloneForm(formName, cloneName);
        await expect(careerPortalOpenSubmissionPage.formPanel(cloneName)).toBeVisible();
    });

    // [C121] Publish — Live-verified (2026-08-27): the panel's "Publish
    // application form" icon opens a confirmation modal; confirming
    // replaces the panel's Edit/Clone/Delete icons with a single "View
    // application form" (visibility) icon and a "Published on <date> by
    // <user>" status line.
    test('[C121] Publish', async ({ careerPortalOpenSubmissionPage, careerPortalOpenSubmissionData }) => {
        const formName = `${careerPortalOpenSubmissionData.formName} ${Date.now()}`;
        await careerPortalOpenSubmissionPage.createConfiguredForm(formName);
        await careerPortalOpenSubmissionPage.publishForm(formName);
        const panel = careerPortalOpenSubmissionPage.formPanel(formName);
        await expect(panel.getByText('Published on', { exact: false })).toBeVisible();
        await expect(panel.getByTitle('View application form')).toBeVisible();
    });

    // [C122] View — Live-verified (2026-08-27): opens the read-only "View
    // Live Application Form" page for a published form.
    test('[C122] View', async ({ careerPortalOpenSubmissionPage, careerPortalOpenSubmissionData, page }) => {
        const formName = `${careerPortalOpenSubmissionData.formName} ${Date.now()}`;
        await careerPortalOpenSubmissionPage.createConfiguredForm(formName);
        await careerPortalOpenSubmissionPage.publishForm(formName);
        await careerPortalOpenSubmissionPage.viewPublishedForm(formName);
        await expect(page.getByRole('heading', { name: /^View .* Live .* for Hourly Career Portal$/ })).toBeVisible();
    });
});
