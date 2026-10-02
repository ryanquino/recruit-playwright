const { test: cxBaseFixture, expect } = require('./cx-base-fixture');
const ApplicationFormValidationPage = require('../../pages/application/application-form-validation.page');
const { getEmbeddedFrame } = require('../../pages/application/embedded-widget');

// Test data
const applicationFormData = require('../../test-data/application/application-form.json');

const cxUrl = 'playwrightqa/CorporateCareerPortal';
const internalPortal = 'playwrightqa/InternalCareerPage';

/** @type {import('@playwright/test').TestType<ApplicationFormValidationFixture, {}>} */
const test = cxBaseFixture.extend({
    applicationFormValidationPage: async ({ page }, use) => {
        const validationPage = new ApplicationFormValidationPage(page);
        await page.goto(cxUrl);
        await use(validationPage);
    },

    internalApplicationFormValidationPage: async ({ page }, use) => {
        const validationPage = new ApplicationFormValidationPage(page);
        await page.goto(internalPortal);
        await use(validationPage);
    },

    // [C900]/[C901]/[C903]/[C904] Embedded Candidate Apply Validation -
    // External: reached through the real embed widget (see
    // embedded-widget.js) instead of a direct page.goto, matching the
    // actual "Embedded External CX Portal" mechanism these TestRail cases
    // describe.
    embeddedApplicationFormValidationPage: async ({ page }, use) => {
        const frame = await getEmbeddedFrame(page, 'CorporateCareerPortal');
        const validationPage = new ApplicationFormValidationPage(frame);
        await use(validationPage);
    },

    // [C906]/[C908]/[C910]/[C911] Embedded Candidate Apply Validation - Internal
    embeddedInternalApplicationFormValidationPage: async ({ page }, use) => {
        const frame = await getEmbeddedFrame(page, 'InternalCareerPage');
        const validationPage = new ApplicationFormValidationPage(frame);
        await use(validationPage);
    },

    // Data Fixtures
    applicationFormData: applicationFormData,
});

module.exports = { test, expect };
