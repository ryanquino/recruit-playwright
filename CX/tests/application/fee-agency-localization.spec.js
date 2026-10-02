// @ts-check
const { test, expect } = require('../fixtures/application-fixture');

// [C2607]-[C2609] External Portal Fee Agency - Configured Apply -
// Localization. Live-verified (2026-08-31) via CX Admin's Manage
// Languages page (portalId 2582 = CorporateCareerPortal2, the same
// portal C836/C837/PR #164 uses): German, English (default), Spanish and
// French are all currently enabled — a shared precondition set up for
// other localization tests, not toggled by this file.
//
// [C2608]'s literal precondition ("no other language is enabled on the
// portal") doesn't hold in this shared environment. Tested instead with
// a browser locale that isn't one of the 4 enabled languages (Italian),
// which still exercises the behavior the case is actually about — falls
// back to the Default Portal Language (English) when the browser's
// language isn't a configured option.
//
// Real translated label copy captured live via the Fee Agency Configured
// Apply form itself (not guessed) — French matches PR #164's
// non-Fee-Agency External Portal capture exactly, confirming the Fee
// Agency entry point reaches the same underlying localized form.
//
// .serial(): getRecordedSourceForSubmittedCandidate() searches the ATS
// Candidate Pool by email under the same logged-in session — same
// concurrent-search race documented in fee-agency-apply.spec.js /
// application-form.page.js.
test.describe.serial('Fee Agency - Configured Apply - Localization', () => {
    test.describe('Spanish', () => {
        test.use({ locale: 'es-ES' });

        test('[C2607] External Portal Fee Agency - Configured Apply - Spanish', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
            await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
            const { es } = applicationFormData.feeAgencyExpectedLabels;
            // Flaky (2026-09-03): under full-suite load this form's first
            // paint after a locale change occasionally takes longer than
            // the default 5s to reflect the translated labels — passed
            // reliably on 3/3 isolated reruns, confirming it's a timing
            // margin issue, not a real translation defect.
            await expect(feeAgencyConfiguredFormPage.firstNameCALabel).toHaveText(es.firstName, { timeout: 15000 });
            await expect(feeAgencyConfiguredFormPage.lastNameCALabel).toHaveText(es.lastName, { timeout: 15000 });
            await expect(feeAgencyConfiguredFormPage.emailCALabel).toHaveText(es.email, { timeout: 15000 });

            await feeAgencyConfiguredFormPage.submitFeeAgencyConfiguredApplication(applicationFormData);
            await expect(feeAgencyConfiguredFormPage.successMessage).toBeVisible();
            await feeAgencyConfiguredFormPage.loginToATS();
            const source = await feeAgencyConfiguredFormPage.getRecordedSourceForSubmittedCandidate();
            await expect(source).toBe('Playwright Fee Agency 2');
        });
    });

    test.describe('Default Portal Language (browser language not enabled)', () => {
        test.use({ locale: 'it-IT' });

        test('[C2608] External Portal Fee Agency - Configured Apply - Default Portal Language', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
            await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
            const { en } = applicationFormData.feeAgencyExpectedLabels;
            // Same first-paint timing margin as [C2607] — see its comment.
            await expect(feeAgencyConfiguredFormPage.firstNameCALabel).toHaveText(en.firstName, { timeout: 15000 });
            await expect(feeAgencyConfiguredFormPage.lastNameCALabel).toHaveText(en.lastName, { timeout: 15000 });
            await expect(feeAgencyConfiguredFormPage.emailCALabel).toHaveText(en.email, { timeout: 15000 });

            await feeAgencyConfiguredFormPage.submitFeeAgencyConfiguredApplication(applicationFormData);
            await expect(feeAgencyConfiguredFormPage.successMessage).toBeVisible();
            await feeAgencyConfiguredFormPage.loginToATS();
            const source = await feeAgencyConfiguredFormPage.getRecordedSourceForSubmittedCandidate();
            await expect(source).toBe('Playwright Fee Agency 2');
        });
    });

    test.describe('French (Scenario 2 — enabled language matching browser)', () => {
        test.use({ locale: 'fr-FR' });

        test('[C2609] External Portal Fee Agency - Configured  Apply - Default Portal Language - Scenario 2', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
            await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
            const { fr } = applicationFormData.feeAgencyExpectedLabels;
            // Same first-paint timing margin as [C2607] — see its comment.
            await expect(feeAgencyConfiguredFormPage.firstNameCALabel).toHaveText(fr.firstName, { timeout: 15000 });
            await expect(feeAgencyConfiguredFormPage.lastNameCALabel).toHaveText(fr.lastName, { timeout: 15000 });
            await expect(feeAgencyConfiguredFormPage.emailCALabel).toHaveText(fr.email, { timeout: 15000 });

            await feeAgencyConfiguredFormPage.submitFeeAgencyConfiguredApplication(applicationFormData);
            await expect(feeAgencyConfiguredFormPage.successMessage).toBeVisible();
            await feeAgencyConfiguredFormPage.loginToATS();
            const source = await feeAgencyConfiguredFormPage.getRecordedSourceForSubmittedCandidate();
            await expect(source).toBe('Playwright Fee Agency 2');
        });
    });
});
