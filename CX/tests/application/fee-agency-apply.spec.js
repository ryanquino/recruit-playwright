// @ts-check
const { test, expect } = require('../fixtures/application-fixture');

// [C762]/[C887] restate the Fee Agency "Happy Path" already covered by
// [C35]/[C36] (Fee Agency Quick/Configured Apply) under distinct TestRail
// case IDs. Automated the same way, reusing the same proven
// feeAgencyFormPage/feeAgencyConfiguredFormPage fixtures and
// submitApplication()/submitFeeAgencyConfiguredApplication() methods. Both
// now also assert the ATS-recorded Source is the fee agency's own name,
// the same getRecordedSourceForSubmittedCandidate() pattern [C4303] below
// already proves — this is the part of "Fee Agency Apply" a smoke check
// actually needs to catch (a candidate landing in ATS attributed to the
// wrong source), not just a visible success message. Live-verified
// 2026-09-25: applicationFormData.feeAgencyLoginEmail/feeAgencyTestJob (used
// by both [C887]/[C762] here and [C4303]'s first submission below) all
// resolve to the same fee agency account, "Playwright Fee Agency 2" —
// despite goToFeeAgencyEditPage()'s resource_id 36392 comment saying
// "Playwright Fee Agency" (no "2"); that comment is stale/imprecise, the
// recorded Source string is the source of truth here.
// [C898] (Allow Duplicate Candidates) lives in this same serial block —
// live-verified (2026-08-27) that "Playwright Fee Agency"'s "Allow
// Duplicate Candidate Submission" setting is already "Allow this fee
// agency to submit any candidate" (the default), so it only verifies
// that state (read-only) and confirms a genuine duplicate — same job,
// same email — is accepted. submitApplication() normally timestamps a
// fresh email per call, so the duplicate submission fills the form
// directly with the first submission's exact email to force a true
// duplicate.
// .serial(): all three share the applicationFormData "CX First"/"CX Last"
// identity with the application-fixture afterAll cleanup, same as
// embedded-candidate-apply.spec.js. Keeping them in one file/serial block
// (rather than splitting [C898] into its own file) avoids two separate
// afterAll hooks racing to bulk-delete the same-named candidates when
// files run in parallel — cleanupCandidate() searches by full name and
// bulk-deletes every match, so one shared afterAll safely covers all
// three tests' candidates.
const FEE_AGENCY_RESOURCE_ID = '36392';
const feeAgencyCxUrl = 'playwrightqa/CorporateCareerPortal/feeagency/C714F7E5-B6A6-4DE9-9659-1DF4A636CE7B';
const feeAgencyCxUrl2 = 'playwrightqa/CorporateCareerPortal2/feeagency/C714F7E5-B6A6-4DE9-9659-1DF4A636CE7B';

test.describe.serial('Fee Agency Apply', () => {
    test('[C887] External Portal Fee Agency - Quick Apply - Happy Path', { tag: '@smoke' }, async ({ feeAgencyFormPage, applicationFormData }) => {
        await feeAgencyFormPage.navigateToFeeAgencyApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        await feeAgencyFormPage.submitApplication(applicationFormData);
        await expect(feeAgencyFormPage.successMessage).toBeVisible();
        await feeAgencyFormPage.loginToATS();
        const source = await feeAgencyFormPage.getRecordedSourceForSubmittedCandidate();
        await expect(source).toBe('Playwright Fee Agency 2');
    });

    test('[C762] External Portal Fee Agency - Configured Apply - Happy Path', { tag: '@smoke' }, async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        await feeAgencyConfiguredFormPage.submitFeeAgencyConfiguredApplication(applicationFormData);
        await expect(feeAgencyConfiguredFormPage.successMessage).toBeVisible();
        await feeAgencyConfiguredFormPage.loginToATS();
        const source = await feeAgencyConfiguredFormPage.getRecordedSourceForSubmittedCandidate();
        await expect(source).toBe('Playwright Fee Agency 2');
    });

    test('[C898] External Portal Fee Agency - Quick Apply - Allow Duplicate Candidates', async ({ feeAgencyFormPage, applicationFormData }) => {
        await feeAgencyFormPage.navigateToFeeAgencyApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        await feeAgencyFormPage.submitApplication(applicationFormData);
        await expect(feeAgencyFormPage.successMessage).toBeVisible();
        const duplicateEmail = feeAgencyFormPage.submittedEmail;

        await feeAgencyFormPage.loginToATS();
        await feeAgencyFormPage.goToFeeAgencyEditPage(FEE_AGENCY_RESOURCE_ID);
        await expect(feeAgencyFormPage.feeAgencyDuplicateSettingDropdown.locator('option:checked')).toHaveText('Allow this fee agency to submit any candidate');

        await feeAgencyFormPage.page.goto(feeAgencyCxUrl);
        await feeAgencyFormPage.navigateToFeeAgencyApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        await feeAgencyFormPage.firstNameField.fill(applicationFormData.firstName);
        await feeAgencyFormPage.lastNameField.fill(applicationFormData.lastName);
        await feeAgencyFormPage.emailField.fill(duplicateEmail);
        await feeAgencyFormPage.uploadCV();
        await feeAgencyFormPage.submitButton.click();
        await feeAgencyFormPage.page.waitForLoadState('domcontentloaded');
        await expect(feeAgencyFormPage.successMessage).toBeVisible();
    });

    // [C4303] External Portal Fee Agency - Configured Apply - Allow
    // Duplicate Candidates. Live-verified (2026-08-31): "Playwright Fee
    // Agency 2"'s duplicate setting is already "Allow this fee agency to
    // submit any candidate" (same default as [C898]'s fee agency), so
    // this verifies that state and confirms 3 submissions all succeed: a
    // fresh candidate, a genuine duplicate (same job, same email), and a
    // different-job submission with the same identity. "Playwright New
    // Job Posting" is a second job available on this fee agency's
    // listing, distinct from applicationFormData.feeAgencyTestJob.
    test('[C4303] External Portal Fee Agency - Configured Apply - Allow Duplicate Candidates', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        await feeAgencyConfiguredFormPage.submitFeeAgencyConfiguredApplication(applicationFormData);
        await expect(feeAgencyConfiguredFormPage.successMessage).toBeVisible();
        const duplicateEmail = feeAgencyConfiguredFormPage.submittedEmail;

        await feeAgencyConfiguredFormPage.loginToATS();
        await feeAgencyConfiguredFormPage.goToFeeAgencyEditPage(FEE_AGENCY_RESOURCE_ID);
        await expect(feeAgencyConfiguredFormPage.feeAgencyDuplicateSettingDropdown.locator('option:checked')).toHaveText('Allow this fee agency to submit any candidate');
        // Not a redundant login — goToFeeAgencyEditPage() navigated off the
        // Candidate Pool page onto the Fee Agency edit page;
        // getRecordedSourceForSubmittedCandidate() needs to be back on
        // Candidate Pool (loginToATS() ends there), and live-verified
        // (2026-08-31) that re-navigating to the ATS base URL does show
        // the login form again here, not a silent redirect past it.
        await feeAgencyConfiguredFormPage.loginToATS();
        const firstSource = await feeAgencyConfiguredFormPage.getRecordedSourceForSubmittedCandidate();
        await expect(firstSource).toBe('Playwright Fee Agency 2');

        // Same job, same email — a genuine duplicate.
        await feeAgencyConfiguredFormPage.page.goto(feeAgencyCxUrl2);
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        await feeAgencyConfiguredFormPage.firstNameCAField.fill(applicationFormData.firstName);
        await feeAgencyConfiguredFormPage.lastNameCAField.fill(applicationFormData.lastName);
        await feeAgencyConfiguredFormPage.emailCAField.fill(duplicateEmail);
        await feeAgencyConfiguredFormPage.phoneNumberCAField.fill(applicationFormData.primaryPhone);
        await feeAgencyConfiguredFormPage.countryCAField.selectOption(applicationFormData.country);
        await feeAgencyConfiguredFormPage.addressCAField.fill(applicationFormData.address);
        await feeAgencyConfiguredFormPage.postalCodeCAField.fill(applicationFormData.postalCode);
        await feeAgencyConfiguredFormPage.resumeTextAField.fill(applicationFormData.resumeFreeText);
        await feeAgencyConfiguredFormPage.configuredFormUploadCV();
        await feeAgencyConfiguredFormPage.applicationFormNextButton.click();
        await feeAgencyConfiguredFormPage.page.waitForLoadState('load');
        await feeAgencyConfiguredFormPage.configuredSubmitButton.click();
        await feeAgencyConfiguredFormPage.page.waitForLoadState('networkidle');
        await expect(feeAgencyConfiguredFormPage.successMessage).toBeVisible();

        // Different job, same email.
        await feeAgencyConfiguredFormPage.page.goto(feeAgencyCxUrl2);
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencySecondJob);
        await feeAgencyConfiguredFormPage.firstNameCAField.fill(applicationFormData.firstName);
        await feeAgencyConfiguredFormPage.lastNameCAField.fill(applicationFormData.lastName);
        await feeAgencyConfiguredFormPage.emailCAField.fill(duplicateEmail);
        await feeAgencyConfiguredFormPage.phoneNumberCAField.fill(applicationFormData.primaryPhone);
        await feeAgencyConfiguredFormPage.countryCAField.selectOption(applicationFormData.country);
        await feeAgencyConfiguredFormPage.addressCAField.fill(applicationFormData.address);
        await feeAgencyConfiguredFormPage.postalCodeCAField.fill(applicationFormData.postalCode);
        await feeAgencyConfiguredFormPage.resumeTextAField.fill(applicationFormData.resumeFreeText);
        await feeAgencyConfiguredFormPage.configuredFormUploadCV();
        await feeAgencyConfiguredFormPage.applicationFormNextButton.click();
        await feeAgencyConfiguredFormPage.page.waitForLoadState('load');
        await feeAgencyConfiguredFormPage.configuredSubmitButton.click();
        await feeAgencyConfiguredFormPage.page.waitForLoadState('networkidle');
        await expect(feeAgencyConfiguredFormPage.successMessage).toBeVisible();
    });
});
