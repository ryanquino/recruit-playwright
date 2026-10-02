// @ts-check
const { test, expect } = require('../fixtures/application-form-validation-fixture');

// [C903]/[C910] automate the "Embedded External/Internal CX Portal" supported-file-types
// scenarios (TestRail sections "CX > Embedded > Embedded External/Internal CX Portal").
// Live-verified (2026-08-26): reached through the actual embed mechanism — page.setContent()
// with the real <script data-action="cxEmbedded"> snippet, which document.writes a
// cross-origin iframe at .../CorporateCareerPortal?embedded=true (or InternalCareerPage).
// See embedded-widget.js for the snippet and embeddedApplicationFormValidationPage /
// embeddedInternalApplicationFormValidationPage in application-form-validation-fixture.js
// for how the frame is wired into the existing ApplicationFormValidationPage.
test.describe('Embedded Candidate Apply Validation - Supported File Types', () => {
    test('[C903] Candidate Apply - Random Job External - Scenario 5 (Supported File Types)', async ({ embeddedApplicationFormValidationPage, applicationFormData }) => {
        await embeddedApplicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.jobTitle);
        await embeddedApplicationFormValidationPage.submitWithSupportedFileType(applicationFormData);
        const errorMessage = embeddedApplicationFormValidationPage.getRequiredFieldErrorMessages('resume');
        await expect(errorMessage).not.toBeVisible();
    });

    test('[C910] Candidate Apply - Random Job - Internal - Scenario 5 (Supported File Types)', async ({ embeddedInternalApplicationFormValidationPage, applicationFormData }) => {
        await embeddedInternalApplicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.internalJobTitle);
        await embeddedInternalApplicationFormValidationPage.submitWithSupportedFileType(applicationFormData);
        const errorMessage = embeddedInternalApplicationFormValidationPage.getRequiredFieldErrorMessages('resume');
        await expect(errorMessage).not.toBeVisible();
    });
});
