const { test: parityBase, expect } = require('./opensearch-parity-fixture');
const ScreenerQuestionsPage = require('../../pages/jobs/screener-questions.page');
const screenerQuestionsParityData = require('../../test-data/jobs/screener-questions-parity.json');

/** @type {import('@playwright/test').TestType<any, any>} */
const test = parityBase.extend({
    // Wraps `request` directly (no navigation) — the screener-questions
    // endpoint is a JSON API, fetched once per host inside each test.
    screenerQuestionsPage: async ({ request }, use) => {
        await use(new ScreenerQuestionsPage(request));
    },

    screenerQuestionsParityData: screenerQuestionsParityData,
});

module.exports = { test, expect };
