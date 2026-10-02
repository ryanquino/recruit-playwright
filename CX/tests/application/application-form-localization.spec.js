// @ts-check
const { test, expect } = require('../fixtures/application-fixture');

// [C805]-[C807]/[C836]-[C838] Localization — French/German/Spanish.
//
// Uses the dedicated FrenchCareerPortal/GermanCareerPortal/SpanishCareerPortal
// (portalId 2613/2614/2612) instead of forcing a browser locale on the
// shared CorporateCareerPortal(2) (portalId 2577/2582). Those portals
// never actually rendered translated labels regardless of browser
// locale — live-verified (2026-09-04) that portal 2582's own Configured
// Application Forms are managed per-language (de/en/es/fr slots in CX
// Admin), and only the English slot had ever been built, so
// [C836]-style Configured Apply localization was failing there by
// design, not from a locale-tag mismatch. The dedicated portals below
// render fully in their own language out of the box (navigation,
// Quick Apply via Open Submission, job listings) with zero locale
// simulation or CX Admin language-toggling needed.
//
// Configured Apply on these portals required building a form: each
// portal's own Configured Application Forms list was likewise empty.
// Built + published 2026-09-04 (CX Admin > Manage Application Form >
// portalId 2612/2613/2614) with the default field set a new form
// starts with (First Name, Last Name, Email, Resume/CV Upload) — no
// extra fields, since that's all these label-rendering checks need.
//
// Precondition (not automated by this suite, same convention as other
// CX Admin state elsewhere): each portal's "Manage Application Form"
// page (CareerPortalApplicationFormPage, /playwrightqa/admin/JobBoards/
// ApplicationForms?PortalId=<id>) has its Application Form radio set to
// "Use the configured application form below" rather than "Quick
// Apply" — that's the toggle that makes navigateToJobConfiguredApplicationForm()
// land on /Apply/MultiForm/<jobId> instead of /Apply/QuickApply/<jobId>.
// Set once via that same admin page's selectConfiguredForm(), not
// re-toggled by this file. Open Submission (Quick Apply tests below)
// is governed by a separate admin setting and is unaffected by this
// toggle either way — live-verified on all three portals.
//
// Outer describe.serial(): every test here calls loginToATS() and
// reads back a candidate-pool search result under the same shared ATS
// account (see application-form.spec.js's header comment for the
// live-verified cross-worker race this avoids under CI's workers: 2).
test.describe.serial('Application Form Localization', () => {
    test.describe('French', () => {
        test('[C805] Quick Apply - Open Submission - French', async ({ frenchApplicationFormPage, applicationFormLocalizationData }) => {
            const { fr } = applicationFormLocalizationData.expectedLabels;
            await frenchApplicationFormPage.navigateToOpenSubmissions();
            await expect(frenchApplicationFormPage.firstNameLabel).toHaveText(fr.quickApply.firstName);
            await expect(frenchApplicationFormPage.lastNameLabel).toHaveText(fr.quickApply.lastName);
            await expect(frenchApplicationFormPage.emailLabel).toHaveText(fr.quickApply.email);

            await frenchApplicationFormPage.submitApplication(applicationFormLocalizationData);
            await expect(frenchApplicationFormPage.successMessage).toBeVisible();
            await frenchApplicationFormPage.loginToATS();
            await expect(await frenchApplicationFormPage.getTableRowCount()).toBe(true);

            // Open the candidate's CRP and verify the submitted first name,
            // last name, and email are visible on the profile.
            await frenchApplicationFormPage.searchCandidateAndOpenCRP();
            await expect(frenchApplicationFormPage.crpCandidateName(applicationFormLocalizationData.firstName, applicationFormLocalizationData.lastName)).toBeVisible();
            await expect(frenchApplicationFormPage.crpCandidateEmail()).toBeVisible();
            await expect(await frenchApplicationFormPage.uploadedResumeMatchesLocal('resume.pdf')).toBe(true);
        });

        test('[C836] Configured Apply - French', async ({ frenchApplicationFormPage, applicationFormLocalizationData }) => {
            const { fr } = applicationFormLocalizationData.expectedLabels;
            await frenchApplicationFormPage.navigateToJobConfiguredApplicationForm('Responsable Service Client');
            await expect(frenchApplicationFormPage.firstNameCALabel).toHaveText(fr.configuredApply.firstName);
            await expect(frenchApplicationFormPage.lastNameCALabel).toHaveText(fr.configuredApply.lastName);
            await expect(frenchApplicationFormPage.emailCALabel).toHaveText(fr.configuredApply.email);

            await frenchApplicationFormPage.submitMinimalConfiguredApplication(applicationFormLocalizationData);
            await expect(frenchApplicationFormPage.successMessage).toBeVisible();
            await frenchApplicationFormPage.loginToATS();
            await expect(await frenchApplicationFormPage.getTableRowCount()).toBe(true);
        });
    });

    test.describe('German', () => {
        test('[C807] Quick Apply - Open Submission - German', async ({ germanApplicationFormPage, applicationFormLocalizationData }) => {
            const { de } = applicationFormLocalizationData.expectedLabels;
            await germanApplicationFormPage.navigateToOpenSubmissions();
            await expect(germanApplicationFormPage.firstNameLabel).toHaveText(de.quickApply.firstName);
            await expect(germanApplicationFormPage.lastNameLabel).toHaveText(de.quickApply.lastName);
            await expect(germanApplicationFormPage.emailLabel).toHaveText(de.quickApply.email);

            await germanApplicationFormPage.submitApplication(applicationFormLocalizationData);
            await expect(germanApplicationFormPage.successMessage).toBeVisible();
            await germanApplicationFormPage.loginToATS();
            await expect(await germanApplicationFormPage.getTableRowCount()).toBe(true);

            // Open the candidate's CRP and verify the submitted first name,
            // last name, and email are visible on the profile.
            await germanApplicationFormPage.searchCandidateAndOpenCRP();
            await expect(germanApplicationFormPage.crpCandidateName(applicationFormLocalizationData.firstName, applicationFormLocalizationData.lastName)).toBeVisible();
            await expect(germanApplicationFormPage.crpCandidateEmail()).toBeVisible();
            await expect(await germanApplicationFormPage.uploadedResumeMatchesLocal('resume.pdf')).toBe(true);
        });

        test('[C837] Configured Apply - German', async ({ germanApplicationFormPage, applicationFormLocalizationData }) => {
            const { de } = applicationFormLocalizationData.expectedLabels;
            // "Senior Kundendienstmitarbeiter" — the real, live job title on
            // this portal's seed data, same convention as [C836]'s French
            // job title and [C838]'s Spanish one. Live-verified 2026-09-24:
            // "Playwright CX Test Quick Apply" (a different portal's job)
            // isn't posted to the German portal at all, so
            // navigateToJobConfiguredApplicationForm()'s has-text() match
            // against it hung until the 60s test timeout.
            await germanApplicationFormPage.navigateToJobConfiguredApplicationForm('Senior Kundendienstmitarbeiter');
            await expect(germanApplicationFormPage.firstNameCALabel).toHaveText(de.configuredApply.firstName);
            await expect(germanApplicationFormPage.lastNameCALabel).toHaveText(de.configuredApply.lastName);
            await expect(germanApplicationFormPage.emailCALabel).toHaveText(de.configuredApply.email);

            await germanApplicationFormPage.submitMinimalConfiguredApplication(applicationFormLocalizationData);
            await expect(germanApplicationFormPage.successMessage).toBeVisible();
            await germanApplicationFormPage.loginToATS();
            await expect(await germanApplicationFormPage.getTableRowCount()).toBe(true);
        });
    });

    test.describe('Spanish', () => {
        test('[C806] Quick Apply - Open Submission - Spanish', async ({ spanishApplicationFormPage, applicationFormLocalizationData }) => {
            const { es } = applicationFormLocalizationData.expectedLabels;
            await spanishApplicationFormPage.navigateToOpenSubmissions();
            await expect(spanishApplicationFormPage.firstNameLabel).toHaveText(es.quickApply.firstName);
            await expect(spanishApplicationFormPage.lastNameLabel).toHaveText(es.quickApply.lastName);
            await expect(spanishApplicationFormPage.emailLabel).toHaveText(es.quickApply.email);

            await spanishApplicationFormPage.submitApplication(applicationFormLocalizationData);
            await expect(spanishApplicationFormPage.successMessage).toBeVisible();
            await spanishApplicationFormPage.loginToATS();
            await expect(await spanishApplicationFormPage.getTableRowCount()).toBe(true);

            // Open the candidate's CRP and verify the submitted first name,
            // last name, and email are visible on the profile.
            await spanishApplicationFormPage.searchCandidateAndOpenCRP();
            await expect(spanishApplicationFormPage.crpCandidateName(applicationFormLocalizationData.firstName, applicationFormLocalizationData.lastName)).toBeVisible();
            await expect(spanishApplicationFormPage.crpCandidateEmail()).toBeVisible();
            await expect(await spanishApplicationFormPage.uploadedResumeMatchesLocal('resume.pdf')).toBe(true);
        });

        test('[C838] Configured Apply - Spanish', async ({ spanishApplicationFormPage, applicationFormLocalizationData }) => {
            const { es } = applicationFormLocalizationData.expectedLabels;
            // "Represetante" (missing an "n") is the real, live job title
            // on this portal's seed data — not a typo in this test.
            // navigateToJobConfiguredApplicationForm() does a has-text()
            // match against the actual DOM, so "Representante" (correct
            // spelling) would match nothing and fail. Live-verified
            // 2026-09-04.
            await spanishApplicationFormPage.navigateToJobConfiguredApplicationForm('Represetante de Servicio, I');
            await expect(spanishApplicationFormPage.firstNameCALabel).toHaveText(es.configuredApply.firstName);
            await expect(spanishApplicationFormPage.lastNameCALabel).toHaveText(es.configuredApply.lastName);
            await expect(spanishApplicationFormPage.emailCALabel).toHaveText(es.configuredApply.email);

            await spanishApplicationFormPage.submitMinimalConfiguredApplication(applicationFormLocalizationData);
            await expect(spanishApplicationFormPage.successMessage).toBeVisible();
            await spanishApplicationFormPage.loginToATS();
            await expect(await spanishApplicationFormPage.getTableRowCount()).toBe(true);
        });
    });
});
