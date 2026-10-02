const { test: cxBaseFixture, expect } = require('./cx-base-fixture');

// Page files go here
const ApplicationFormPage = require('../../pages/application/application-form.page');

// Test data files go here
const applicationFormData = require('../../test-data/application/application-form.json');

const cxUrl = 'playwrightqa/CorporateCareerPortal';
const feeAgencyUrl = '/feeagency/C714F7E5-B6A6-4DE9-9659-1DF4A636CE7B';

// No afterAll cleanup here — unlike application-fixture.js, none of these
// tests ever create a candidate record (they're rejected at the Fee Agency
// Sign In email gate, before any application form is reached), so there's
// nothing to clean up and the shared candidate-bulk-delete afterAll hook
// would only fail here (see application-fixture.js's known flakiness,
// documented in TESTRAIL_AUTOMATION_SESSION_SUMMARY.md).
/** @type {import('@playwright/test').TestType<any, any>} */
const test = cxBaseFixture.extend({
    feeAgencyFormPage: async ({ page }, use) => {
        const applicationForm = new ApplicationFormPage(page);
        await page.goto(cxUrl + feeAgencyUrl);
        await use(applicationForm);
    },

    applicationFormData: applicationFormData,
});

module.exports = { test, expect };
