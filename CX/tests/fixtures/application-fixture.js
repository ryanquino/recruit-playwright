const { test: cxBaseFixture, expect } = require('./cx-base-fixture');

// Page files go here
const ApplicationFormPage = require('../../pages/application/application-form.page');
const ApplicationFormValidationPage = require('../../pages/application/application-form-validation.page');
const { getEmbeddedFrame } = require('../../pages/application/embedded-widget');

// Test data files go here
const applicationFormData = require('../../test-data/application/application-form.json');
const applicationFormLocalizationData = require('../../test-data/application/application-form-localization.json');

const cxUrl = 'playwrightqa/CorporateCareerPortal';
const cxUrl2 = 'playwrightqa/CorporateCareerPortal2';
const feeAgencyUrl = '/feeagency/C714F7E5-B6A6-4DE9-9659-1DF4A636CE7B';
const internalPortal = 'playwrightqa/InternalCareerPage';
const internalPortal2 = 'playwrightqa/InternalCareerPortal';

// Dedicated, single-language portals (portalId 2612-2614) — each renders
// entirely in its own language by default, no browser-locale simulation
// or CX Admin language-toggling needed. Used instead of forcing a locale
// on the shared CorporateCareerPortal(2), which only ever rendered
// English regardless of browser locale (Quick/Configured Apply language
// was never actually enabled there — see application-form-localization.spec.js).
// Each portal's Configured Apply form (French/German/Spanish, minimal
// First/Last/Email/Resume fields, built + published 2026-09-04) mirrors
// portal 2582's Quick/Configured toggle mechanism.
const frenchPortal = 'playwrightqa/FrenchCareerPortal';
const germanPortal = 'playwrightqa/GermanCareerPortal';
const spanishPortal = 'playwrightqa/SpanishCareerPortal';

/** @type {import('@playwright/test').TestType<ApplicationFixture, {}>} */
const test = cxBaseFixture.extend({
    // Page Fixtures go here
    applicationFormPage: async ({ page }, use) => {
        const applicationForm = new ApplicationFormPage(page);
        await page.goto(cxUrl);
        await use(applicationForm);
    },

    configuredApplicationFormPage: async ({ page }, use) => {
        const applicationForm = new ApplicationFormPage(page);
        await page.goto(cxUrl2);
        await use(applicationForm);
    },

    feeAgencyFormPage: async ({ page }, use) => {
        const applicationForm = new ApplicationFormPage(page);
        await page.goto(cxUrl+feeAgencyUrl);
        await use(applicationForm);
    },

    feeAgencyConfiguredFormPage: async ({ page }, use) => {
        const applicationForm = new ApplicationFormPage(page);
        await page.goto(cxUrl2+feeAgencyUrl);
        await use(applicationForm);
    },

    internalApplicationFormPage: async ({ page }, use) => {
        const applicationForm = new ApplicationFormPage(page);
        await page.goto(internalPortal);
        await use(applicationForm);
    },

    internalConfiguredApplicationFormPage: async ({ page }, use) => {
        const applicationForm = new ApplicationFormPage(page);
        await page.goto(internalPortal2);
        await use(applicationForm);
    },

    // [C805]/[C836] French — dedicated portal, no locale simulation needed
    frenchApplicationFormPage: async ({ page }, use) => {
        const applicationForm = new ApplicationFormPage(page);
        await page.goto(frenchPortal);
        await use(applicationForm);
    },

    // [C807]/[C837] German
    germanApplicationFormPage: async ({ page }, use) => {
        const applicationForm = new ApplicationFormPage(page);
        await page.goto(germanPortal);
        await use(applicationForm);
    },

    // [C806]/[C838] Spanish
    spanishApplicationFormPage: async ({ page }, use) => {
        const applicationForm = new ApplicationFormPage(page);
        await page.goto(spanishPortal);
        await use(applicationForm);
    },

    applicationFormValidationPage: async ({ page }, use) => {
        const validationPage = new ApplicationFormValidationPage(page);
        await page.goto(cxUrl);
        await use(validationPage);
    },

    // [C899]/[C902] Embedded Candidate Apply - External: reached through
    // the real embed widget (see embedded-widget.js) instead of a direct
    // page.goto, matching the actual "Embedded External CX Portal"
    // mechanism these TestRail cases describe.
    embeddedApplicationFormPage: async ({ page }, use) => {
        const frame = await getEmbeddedFrame(page, 'CorporateCareerPortal');
        const applicationForm = new ApplicationFormPage(frame);
        await use(applicationForm);
    },

    // [C905]/[C909] Embedded Candidate Apply - Internal
    embeddedInternalApplicationFormPage: async ({ page }, use) => {
        const frame = await getEmbeddedFrame(page, 'InternalCareerPage');
        const applicationForm = new ApplicationFormPage(frame);
        await use(applicationForm);
    },

    // Embedded Configured Apply - External. Same embed mechanism as
    // embeddedApplicationFormPage, pointed at CorporateCareerPortal2 — the
    // Configured Apply portal the direct configuredApplicationFormPage
    // fixture already uses. Live-verified 2026-09-29 through the embed:
    // portal2 serves #Jobs_JobDetail_Multiform_ApplyLink (configured) where
    // portal1 serves #Jobs_JobDetail_ApplyLink (quick), so the existing
    // navigate/submit methods pick the right form with no changes.
    embeddedConfiguredApplicationFormPage: async ({ page }, use) => {
        const frame = await getEmbeddedFrame(page, 'CorporateCareerPortal2');
        const applicationForm = new ApplicationFormPage(frame);
        await use(applicationForm);
    },

    // Embedded Configured Apply - Internal (InternalCareerPortal, the
    // configured counterpart to InternalCareerPage).
    embeddedInternalConfiguredApplicationFormPage: async ({ page }, use) => {
        const frame = await getEmbeddedFrame(page, 'InternalCareerPortal');
        const applicationForm = new ApplicationFormPage(frame);
        await use(applicationForm);
    },

    // Data Fixtures — converted to value fixtures
    applicationFormData: applicationFormData,
    applicationFormLocalizationData: applicationFormLocalizationData
});

// Best-effort cleanup — never let this hook's own failure fail/hang the
// whole worker (it previously did, timing out at the full 60s default and
// taking down every other test sharing this fixture in the same file).
test.afterAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const applicationForm = new ApplicationFormPage(page);

    try {
        await applicationForm.loginToATS();
        await applicationForm.cleanupCandidate('CX First', 'CX Last');
        await applicationForm.purge();
    } catch (error) {
        console.warn('application-fixture afterAll cleanup failed (non-fatal):', error.message);
    } finally {
        await context.close();
    }
});

module.exports = { test, expect };
