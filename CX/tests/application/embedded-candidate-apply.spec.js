// @ts-check
const { test, expect } = require('../fixtures/application-fixture');
const ApplicationFormPage = require('../../pages/application/application-form.page');

// The embedded page objects are built on a Playwright Frame, but the ATS runs
// on the TOP-LEVEL page — Frame.page() gets back to it. Carrying submittedEmail
// across is what points the Candidate Pool search at this run's applicant
// (every submit method timestamps the address). Same shape as the inline
// verification [C899]/[C905] already do, factored out so the four flows below
// assert identically instead of drifting apart.
async function verifyInAts(embeddedPage, applicationFormData) {
    const atsVerify = new ApplicationFormPage(embeddedPage.page.page());
    atsVerify.submittedEmail = embeddedPage.submittedEmail;
    await atsVerify.loginToATS();
    await expect(await atsVerify.getTableRowCount()).toBe(true);
    await atsVerify.searchCandidateAndOpenCRP();
    await expect(atsVerify.crpCandidateName(applicationFormData.firstName, applicationFormData.lastName)).toBeVisible();
    await expect(atsVerify.crpCandidateEmail()).toBeVisible();
    await expect(await atsVerify.uploadedResumeMatchesLocal('resume.pdf')).toBe(true);
}

// [C899]/[C905] and [C902]/[C909] automate the "Embedded External/Internal CX Portal"
// candidate apply scenarios (TestRail sections "CX > Embedded > Embedded External/Internal
// CX Portal"). Live-verified (2026-08-26): these are now reached through the actual embed
// mechanism — page.setContent() with the real <script data-action="cxEmbedded"> snippet,
// which document.writes a cross-origin iframe at .../CorporateCareerPortal?embedded=true
// (or InternalCareerPage). See embedded-widget.js for the snippet and embeddedApplicationFormPage
// / embeddedInternalApplicationFormPage in application-fixture.js for how the frame is wired
// into the existing ApplicationFormPage (a Playwright Frame exposes the same locator API as
// Page, so the page object works unmodified).
// .serial(): these tests share the applicationFormData "CX First"/"CX Last" identity
// with the application-fixture afterAll cleanup (bulk-deletes that candidate). Running
// them in parallel races the shared candidate record and the cleanup step, matching why
// application-form.spec.js wraps its equivalent tests in the same serial pattern.
test.describe.serial('Embedded Candidate Apply', () => {
    test('[C899] Candidate Apply - Random Job External', { tag: '@smoke' }, async ({ embeddedApplicationFormPage, applicationFormData }) => {
        await embeddedApplicationFormPage.navigateToJobApplicationForm(applicationFormData.jobTitle);
        await embeddedApplicationFormPage.submitApplication(applicationFormData);
        await expect(embeddedApplicationFormPage.successMessage).toBeVisible();

        // The CRP verification runs against the ATS backend on the TOP-LEVEL
        // page, not the embed iframe. Build an ApplicationFormPage on the
        // parent page and carry over the submitted email so the candidate
        // search targets the right applicant.
        const topPage = embeddedApplicationFormPage.page.page();
        const atsVerify = new ApplicationFormPage(topPage);
        atsVerify.submittedEmail = embeddedApplicationFormPage.submittedEmail;
        await atsVerify.loginToATS();
        await expect(await atsVerify.getTableRowCount()).toBe(true);
        await atsVerify.searchCandidateAndOpenCRP();
        await expect(atsVerify.crpCandidateName(applicationFormData.firstName, applicationFormData.lastName)).toBeVisible();
        await expect(atsVerify.crpCandidateEmail()).toBeVisible();
        await expect(await atsVerify.uploadedResumeMatchesLocal('resume.pdf')).toBe(true);
    });

    test('[C905] Candidate Apply - Random Job - Internal', { tag: '@smoke' }, async ({ embeddedInternalApplicationFormPage, applicationFormData }) => {
        await embeddedInternalApplicationFormPage.navigateToJobApplicationForm(applicationFormData.internalJobTitle);
        await embeddedInternalApplicationFormPage.submitApplication(applicationFormData);
        await expect(embeddedInternalApplicationFormPage.successMessage).toBeVisible();

        // CRP verification on the top-level page (see [C899] note above).
        const topPage = embeddedInternalApplicationFormPage.page.page();
        const atsVerify = new ApplicationFormPage(topPage);
        atsVerify.submittedEmail = embeddedInternalApplicationFormPage.submittedEmail;
        await atsVerify.loginToATS();
        await expect(await atsVerify.getTableRowCount()).toBe(true);
        await atsVerify.searchCandidateAndOpenCRP();
        await expect(atsVerify.crpCandidateName(applicationFormData.firstName, applicationFormData.lastName)).toBeVisible();
        await expect(atsVerify.crpCandidateEmail()).toBeVisible();
        await expect(await atsVerify.uploadedResumeMatchesLocal('resume.pdf')).toBe(true);
    });

    test('[C902] Candidate Apply - Random Job External - Scenario 4 (Max File Size)', async ({ embeddedApplicationFormPage, applicationFormData }) => {
        await embeddedApplicationFormPage.navigateToJobApplicationForm(applicationFormData.jobTitle);
        await embeddedApplicationFormPage.uploadCV(applicationFormData.oversizedResumeFile);
        await expect(embeddedApplicationFormPage.quickApplyResumeErrorLocator).toBeVisible();
        await expect(embeddedApplicationFormPage.quickApplyResumeErrorLocator).toContainText(applicationFormData.maxFileSizeErrorText);
    });

    test('[C909] Candidate Apply - Random Job - Internal - Scenario 4 (Max File Size)', async ({ embeddedInternalApplicationFormPage, applicationFormData }) => {
        await embeddedInternalApplicationFormPage.navigateToJobApplicationForm(applicationFormData.internalJobTitle);
        await embeddedInternalApplicationFormPage.uploadCV(applicationFormData.oversizedResumeFile);
        await expect(embeddedInternalApplicationFormPage.quickApplyResumeErrorLocator).toBeVisible();
        await expect(embeddedInternalApplicationFormPage.quickApplyResumeErrorLocator).toContainText(applicationFormData.maxFileSizeErrorText);
    });

    // The four below extend embedded coverage from Quick Apply only to the
    // remaining apply flows the direct (non-embedded) suite already covers —
    // Configured Apply on both portals, and both Open Submission variants.
    // They mirror their direct equivalents one-for-one: [C813] Configured
    // External, [C912] Configured Internal, [C22] Open Submission Quick and
    // [C23] Open Submission Configured, differing only in that the portal is
    // reached through the embed widget.
    //
    // Kiwi had no case for any of these — the Embedded External/Internal CX
    // Portal sections held only C899-C911, all Quick Apply — so cases 31327-
    // 31330 were authored in those two sections and carry an eva.testrail_key
    // matching the [CXXXXX] id below, which is what ci/kiwi_publish_run.py
    // resolves on. The key survives a rename of the test title; the summary
    // fallback would not.
    //
    // Fee Agency is deliberately absent: it is served from a /feeagency/{guid}
    // URL path, and the embed snippet only targets a data-portalcode, so the
    // sign-in form is not reachable inside the iframe at all (live-verified
    // 2026-09-29: zero #FeeAgency_SignIn__EmailAddress fields and zero
    // feeagency links anywhere inside the embedded portal).
    test('[C31327] Embedded Configured Apply - External Portal', async ({ embeddedConfiguredApplicationFormPage, applicationFormData }) => {
        test.slow();
        await embeddedConfiguredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        await embeddedConfiguredApplicationFormPage.submitConfiguredApplication(applicationFormData);
        await expect(embeddedConfiguredApplicationFormPage.successMessage).toBeVisible();
        await verifyInAts(embeddedConfiguredApplicationFormPage, applicationFormData);
    });

    // submitInternalConfiguredApplication(), not submitConfiguredApplication():
    // the internal portal's configured form has no "How did you hear about us?"
    // (#OriginalSource) field and is single-page, so the external variant times
    // out waiting for a field that does not exist there. Same method the direct
    // [C912]/[C913] tests use.
    test('[C31328] Embedded Configured Apply - Internal Portal', async ({ embeddedInternalConfiguredApplicationFormPage, applicationFormData }) => {
        test.slow();
        await embeddedInternalConfiguredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.internalJobTitle);
        await embeddedInternalConfiguredApplicationFormPage.submitInternalConfiguredApplication(applicationFormData);
        await expect(embeddedInternalConfiguredApplicationFormPage.successMessage).toBeVisible();
        await verifyInAts(embeddedInternalConfiguredApplicationFormPage, applicationFormData);
    });

    // Open Submission is external-only by design — live-verified 2026-09-29
    // that neither embedded internal portal renders the Open Submission link.
    test('[C31329] Embedded Open Submission - Quick Apply', async ({ embeddedApplicationFormPage, applicationFormData }) => {
        test.slow();
        await embeddedApplicationFormPage.navigateToOpenSubmissions();
        await embeddedApplicationFormPage.submitApplication(applicationFormData);
        await expect(embeddedApplicationFormPage.successMessage).toBeVisible();
        await verifyInAts(embeddedApplicationFormPage, applicationFormData);
    });

    test('[C31330] Embedded Open Submission - Configured Apply', async ({ embeddedConfiguredApplicationFormPage, applicationFormData }) => {
        test.slow();
        await embeddedConfiguredApplicationFormPage.navigateToOpenSubmissions();
        await embeddedConfiguredApplicationFormPage.submitConfiguredApplication(applicationFormData);
        await expect(embeddedConfiguredApplicationFormPage.successMessage).toBeVisible();
        await verifyInAts(embeddedConfiguredApplicationFormPage, applicationFormData);
    });
});
