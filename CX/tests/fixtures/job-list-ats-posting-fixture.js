const { test: cxBaseFixture, expect } = require('./cx-base-fixture');

// Page files go here
const JobsListPage = require('../../pages/jobs/jobs-list.page');
const AtsJobDetailsPage = require('../../../ATS/pages/jobs/job-details.page');

// Test data files go here
const jobListAtsPostingData = require('../../test-data/jobs/job-list-ats-posting.json');

/** @type {import('@playwright/test').TestType<any, any>} */
const test = cxBaseFixture.extend({
    // Page Fixtures go here
    jobsListPage: async ({ page }, use) => {
        const jobsListPage = new JobsListPage(page);
        await page.goto(jobListAtsPostingData.portalPath);
        await use(jobsListPage);
    },

    // Deliberately NOT pre-navigated or logged in: the test reads the CX
    // portal first and only then moves the same page over to the ATS, so
    // doing it here would throw away the CX side before it was read.
    atsJobDetailsPage: async ({ page }, use) => {
        await use(new AtsJobDetailsPage(page));
    },

    // Data Fixtures — converted to value fixtures
    jobListAtsPostingData: jobListAtsPostingData
});

module.exports = { test, expect };
