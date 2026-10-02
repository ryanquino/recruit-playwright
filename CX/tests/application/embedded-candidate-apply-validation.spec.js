// @ts-check
const { test, expect } = require('../fixtures/application-form-validation-fixture');

// [C900]/[C901]/[C904] and [C906]/[C908]/[C911] automate the negative "Embedded
// External/Internal CX Portal" apply scenarios (TestRail sections "CX > Embedded >
// Embedded External/Internal CX Portal"). Live-verified (2026-08-26): these are now
// reached through the actual embed mechanism — see embedded-candidate-apply.spec.js's
// header comment and embedded-widget.js for details.
test.describe('Embedded Candidate Apply Validation - Random Job - External', () => {
    test('[C900] Candidate Apply - Random Job External - Scenario 2 (Form not completed)', async ({ embeddedApplicationFormValidationPage, applicationFormData }) => {
        await embeddedApplicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.jobTitle);
        await embeddedApplicationFormValidationPage.submitIncompleteForm();
        const errorMessages = embeddedApplicationFormValidationPage.getRequiredFieldErrorMessages();

        for (const locator of errorMessages) {
            await expect(locator).toBeVisible();
        }
    });

    test('[C901] Candidate Apply - Random Job External - Scenario 3 (Invalid Email)', async ({ embeddedApplicationFormValidationPage, applicationFormData }) => {
        await embeddedApplicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.jobTitle);
        await embeddedApplicationFormValidationPage.submitWithIncompleteEmailAddress(applicationFormData);
        const errorMessage = embeddedApplicationFormValidationPage.getRequiredFieldErrorMessages('email');
        await expect(errorMessage).toBeVisible();
    });

    test('[C904] Candidate Apply - Random Job External - Scenario 6 (Invalid File Type)', async ({ embeddedApplicationFormValidationPage, applicationFormData }) => {
        await embeddedApplicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.jobTitle);
        await embeddedApplicationFormValidationPage.submitWithInvalidFileType(applicationFormData);
        const errorMessage = embeddedApplicationFormValidationPage.getRequiredFieldErrorMessages('resume');
        await expect(errorMessage).toBeVisible();
    });
});

test.describe('Embedded Candidate Apply Validation - Random Job - Internal', () => {
    test('[C906] Candidate Apply - Random Job - Internal - Scenario 2 (Form not completed)', async ({ embeddedInternalApplicationFormValidationPage, applicationFormData }) => {
        await embeddedInternalApplicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.internalJobTitle);
        await embeddedInternalApplicationFormValidationPage.submitIncompleteForm();
        const errorMessages = embeddedInternalApplicationFormValidationPage.getRequiredFieldErrorMessages();

        for (const locator of errorMessages) {
            await expect(locator).toBeVisible();
        }
    });

    test('[C908] Candidate Apply - Random Job - Internal - Scenario 3 (Invalid Email)', async ({ embeddedInternalApplicationFormValidationPage, applicationFormData }) => {
        await embeddedInternalApplicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.internalJobTitle);
        await embeddedInternalApplicationFormValidationPage.submitWithIncompleteEmailAddress(applicationFormData);
        const errorMessage = embeddedInternalApplicationFormValidationPage.getRequiredFieldErrorMessages('email');
        await expect(errorMessage).toBeVisible();
    });

    test('[C911] Candidate Apply - Random Job - Internal - Scenario 6 (Invalid File Type)', async ({ embeddedInternalApplicationFormValidationPage, applicationFormData }) => {
        await embeddedInternalApplicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.internalJobTitle);
        await embeddedInternalApplicationFormValidationPage.submitWithInvalidFileType(applicationFormData);
        const errorMessage = embeddedInternalApplicationFormValidationPage.getRequiredFieldErrorMessages('resume');
        await expect(errorMessage).toBeVisible();
    });
});
