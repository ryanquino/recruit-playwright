// @ts-check
const { test, expect } = require('../fixtures/fee-agency-validation-fixture');

// [C891]/[C892]/[C893] automate the Fee Agency Sign In email gate (the
// "Enter the Fee Agency's email address and click the submit button" step
// shared by every Fee Agency apply scenario, e.g. [C35]/[C36]). These fail
// before any candidate application is created, so they carry no cleanup
// dependency on the shared application-fixture afterAll hook. Error copy
// live-verified against this environment on 2026-08-26:
// - empty submit -> `"Email Address" is required.`
// - malformed email -> `"Email Address" is invalid.`
// - well-formed but unrecognized email -> `Authentication Failed`
test.describe('Fee Agency Quick Apply Validation', () => {
    test('[C891] External Portal Fee Agency - Quick Apply - Empty Email Address', async ({ feeAgencyFormPage }) => {
        await feeAgencyFormPage.feeAgencySubmit.click();
        await expect(feeAgencyFormPage.page.getByText('"Email Address" is required.')).toBeVisible();
    });

    test('[C892] External Portal Fee Agency - Quick Apply - Invalid Email Address', async ({ feeAgencyFormPage }) => {
        await feeAgencyFormPage.feeAgencyEmailAddressField.fill('not-an-email');
        await feeAgencyFormPage.feeAgencySubmit.click();
        await expect(feeAgencyFormPage.page.getByText('"Email Address" is invalid.')).toBeVisible();
    });

    test('[C893] External Portal Fee Agency - Quick Apply - Incorrect Email Address', async ({ feeAgencyFormPage, applicationFormData }) => {
        await feeAgencyFormPage.feeAgencyEmailAddressField.fill(applicationFormData.email);
        await feeAgencyFormPage.feeAgencySubmit.click();
        await expect(feeAgencyFormPage.page.getByText('Authentication Failed')).toBeVisible();
    });
});
