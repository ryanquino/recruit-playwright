const { test: parityBase, expect } = require('./opensearch-parity-fixture');
const ApplicationFormPage = require('../../pages/application/application-form.page');
const applicationFormParityData = require('../../test-data/application/application-form-parity.json');

/** @type {import('@playwright/test').TestType<any, any>} */
const test = parityBase.extend({
    // Un-navigated on purpose: the test drives .gotoConfiguredApplicationFormOnHost()
    // itself, once per host being compared.
    applicationFormPage: async ({ page }, use) => {
        await use(new ApplicationFormPage(page));
    },

    applicationFormParityData: applicationFormParityData,
});

module.exports = { test, expect };
