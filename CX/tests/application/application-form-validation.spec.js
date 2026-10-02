// @ts-check
const { test, expect } = require('../fixtures/application-form-validation-fixture');

test.describe('Application Form Validation - Open Submission', () => {
    test('[C796] Quick Apply - Open Submission - Form not completed', async ({ applicationFormValidationPage }) => {
        await applicationFormValidationPage.navigateToOpenSubmissions();
        await applicationFormValidationPage.submitIncompleteForm();
        const errorMessages = applicationFormValidationPage.getRequiredFieldErrorMessages();

        // Loop through each error message locator to verify all required field errors are visible
        for (const locator of errorMessages) {
            await expect(locator).toBeVisible();
        }
    });

    test('[C797] Quick Apply - Open Submission - Incorrect Email Address', async ({ applicationFormValidationPage, applicationFormData }) => {
        await applicationFormValidationPage.navigateToOpenSubmissions();
        await applicationFormValidationPage.submitWithIncompleteEmailAddress(applicationFormData);
        const errorMessages = applicationFormValidationPage.getRequiredFieldErrorMessages('email');
        await expect(errorMessages).toBeVisible();
    });

    test('[C800] Quick Apply - Open Submission - Invalid File Types', async ({ applicationFormValidationPage, applicationFormData }) => {
        await applicationFormValidationPage.navigateToOpenSubmissions();
        await applicationFormValidationPage.submitWithInvalidFileType(applicationFormData);
        const errorMessages = applicationFormValidationPage.getRequiredFieldErrorMessages('resume');
        await expect(errorMessages).toBeVisible();
    });

    test('[C799] Quick Apply - Open Submission - Supported File Types', async ({ applicationFormValidationPage, applicationFormData }) => {
        await applicationFormValidationPage.navigateToOpenSubmissions();
        await applicationFormValidationPage.submitWithSupportedFileType(applicationFormData);
        const errorMessages = applicationFormValidationPage.getRequiredFieldErrorMessages('resume');
        await expect(errorMessages).not.toBeVisible();
    });

    test('[C884] Quick Apply - Open Submission - Already Submitted', async ({ applicationFormValidationPage, applicationFormData }) => {
        await applicationFormValidationPage.navigateToOpenSubmissions(applicationFormData.alreadyAppliedJob);
        await applicationFormValidationPage.submitApplication(applicationFormData);
        await expect(applicationFormValidationPage.alreadyAppliedHeading).toBeVisible();

    });
});

test.describe('Application Form Validation - Random Job - External', () => {
    test('[C11] Quick Apply - Random Job - External - Form not completed', async ({ applicationFormValidationPage, applicationFormData }) => {
        await applicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.jobTitle);
        await applicationFormValidationPage.submitIncompleteForm();
        const errorMessages = applicationFormValidationPage.getRequiredFieldErrorMessages();

        // Loop through each error message locator to verify all required field errors are visible
        for (const locator of errorMessages) {
            await expect(locator).toBeVisible();
        }
    });

    test('[C12] Quick Apply - Random Job - External - Incorrect Email Address', async ({ applicationFormValidationPage, applicationFormData }) => {
        await applicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.jobTitle);
        await applicationFormValidationPage.submitWithIncompleteEmailAddress(applicationFormData);
        const errorMessages = applicationFormValidationPage.getRequiredFieldErrorMessages('email');
        await expect(errorMessages).toBeVisible();
    });

    test('[C14] Quick Apply - Random Job - External - Supported File Types', async ({ applicationFormValidationPage, applicationFormData }) => {
        await applicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.jobTitle);
        await applicationFormValidationPage.submitWithSupportedFileType(applicationFormData);
        const errorMessages = applicationFormValidationPage.getRequiredFieldErrorMessages('resume');
        await expect(errorMessages).not.toBeVisible();
    });

    test('[C15] Quick Apply - Random Job - External - Invalid File Types', async ({ applicationFormValidationPage, applicationFormData }) => {
        await applicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.jobTitle);
        await applicationFormValidationPage.submitWithInvalidFileType(applicationFormData);
        const errorMessages = applicationFormValidationPage.getRequiredFieldErrorMessages('resume');
        await expect(errorMessages).toBeVisible();
    });

    test('[C878] Quick Apply - Random Job - External - Already Applied', async ({ applicationFormValidationPage, applicationFormData }) => {
        await applicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.alreadyAppliedJob);
        await applicationFormValidationPage.submitApplication(applicationFormData);
        await expect(applicationFormValidationPage.alreadyAppliedHeading).toBeVisible();

    });
});

test.describe('Application Form Validation - Random Job - Internal', () => {
    test('[C17] Quick Apply - Random Job - Internal - Form not completed', async ({ internalApplicationFormValidationPage, applicationFormData }) => {
        await internalApplicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.internalJobTitle);
        await internalApplicationFormValidationPage.submitIncompleteForm();
        const errorMessages = internalApplicationFormValidationPage.getRequiredFieldErrorMessages();

        for (const locator of errorMessages) {
            await expect(locator).toBeVisible();
        }
    });

    test('[C18] Quick Apply - Random Job - Internal - Incorrect Email Address (Negative)', async ({ internalApplicationFormValidationPage, applicationFormData }) => {
        await internalApplicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.internalJobTitle);
        await internalApplicationFormValidationPage.submitWithIncompleteEmailAddress(applicationFormData);
        const errorMessages = internalApplicationFormValidationPage.getRequiredFieldErrorMessages('email');
        await expect(errorMessages).toBeVisible();
    });

    test('[C20] Quick Apply - Random Job - Internal - Supported File Types', async ({ internalApplicationFormValidationPage, applicationFormData }) => {
        await internalApplicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.internalJobTitle);
        await internalApplicationFormValidationPage.submitWithSupportedFileType(applicationFormData);
        const errorMessages = internalApplicationFormValidationPage.getRequiredFieldErrorMessages('resume');
        await expect(errorMessages).not.toBeVisible();
    });

    test('[C21] Quick Apply - Random Job - Internal - Invalid File Types', async ({ internalApplicationFormValidationPage, applicationFormData }) => {
        await internalApplicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.internalJobTitle);
        await internalApplicationFormValidationPage.submitWithInvalidFileType(applicationFormData);
        const errorMessages = internalApplicationFormValidationPage.getRequiredFieldErrorMessages('resume');
        await expect(errorMessages).toBeVisible();
    });

    test('[C881] Quick Apply - Random Job - Internal - Already Applied', async ({ internalApplicationFormValidationPage, applicationFormData }) => {
        await internalApplicationFormValidationPage.navigateToJobApplicationForm(applicationFormData.internalAlreadyAppliedJob);
        await internalApplicationFormValidationPage.submitApplication(applicationFormData);
        await expect(internalApplicationFormValidationPage.alreadyAppliedHeading).toBeVisible();
    });
});
