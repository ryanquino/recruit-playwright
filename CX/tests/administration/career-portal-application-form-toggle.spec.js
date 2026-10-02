// @ts-check
const { test, expect } = require('../fixtures/administration-fixture');

// [C155]/[C156] Career Portal - Application Form. Live-verified (2026-08-26)
// that this area lives in a SEPARATE admin application from the ATS
// backend: https://qa-recruiting-cx.silkroad-eng.com/playwrightqa/Admin
// (Career Site List > per-portal "Career Site Settings" gear > Application
// Form). Same relicx credentials work there.
//
// Runs against portalId 2609 (Hourly Career Portal) — dedicated to this
// area, not used by any other test in this repo (unlike portal 2577,
// which every other Quick/Configured Apply test depends on), so this
// file's own state changes can't pollute anything else.
//
// C155/C156 toggle the same "Quick Apply vs Configured Form" radio
// setting for this portal — serial to avoid one overwriting the other's
// setting mid-run (live-verified 2026-08-26: parallel execution raced and
// failed one of the two). C156 restores it to Quick Apply at the end.
// Split into its own file (was previously grouped with the Configured
// Application Form CRUD and View tests below) so this radio-toggle pair
// is the only thing that has to run serially with itself.
test.describe.serial('Career Portal - Application Form', () => {
    test('[C155] Select Application Form - Quick Apply', async ({ careerPortalApplicationFormPage }) => {
        await expect(careerPortalApplicationFormPage.pageHeading).toBeVisible();
        await careerPortalApplicationFormPage.selectQuickApply();
        await expect(careerPortalApplicationFormPage.quickApplyRadio).toBeChecked();
    });

    test('[C156] Select Application Form - Use the configured application form below', async ({ careerPortalApplicationFormPage }) => {
        await expect(careerPortalApplicationFormPage.pageHeading).toBeVisible();
        await careerPortalApplicationFormPage.selectConfiguredForm();
        await expect(careerPortalApplicationFormPage.useConfiguredFormRadio).toBeChecked();

        // Restore the shared default (Quick Apply) this portal's other
        // consumers depend on.
        await careerPortalApplicationFormPage.selectQuickApply();
        await expect(careerPortalApplicationFormPage.quickApplyRadio).toBeChecked();
    });
});
