const { test: parityBase, expect } = require('./opensearch-parity-fixture');
const JobsListPage = require('../../pages/jobs/jobs-list.page');
const JobDetailsPage = require('../../pages/jobs/job-details.page');
const jobListAtsParityData = require('../../test-data/jobs/job-list-ats-parity.json');

/** @type {import('@playwright/test').TestType<any, any>} */
const test = parityBase.extend({
    // Un-navigated on purpose: the test drives .gotoOnHost()/.navigateToJobByIdOnHost()
    // itself, once per host being compared.
    jobsListPage: async ({ page }, use) => {
        await use(new JobsListPage(page));
    },

    jobDetailsPage: async ({ page }, use) => {
        await use(new JobDetailsPage(page));
    },

    jobListAtsParityData: jobListAtsParityData,
});

module.exports = { test, expect };
