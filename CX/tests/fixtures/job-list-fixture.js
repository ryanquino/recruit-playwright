const { test: cxBaseFixture, expect } = require('./cx-base-fixture');

// Page files go here
const JobsListPage = require('../../pages/jobs/jobs-list.page');
const JobDetailsPage = require('../../pages/jobs/job-details.page');
const CareerPortalJobDetailsPage = require('../../pages/administration/career-portal-job-details.page');

// Test data files go here
const jobsListData = require('../../test-data/jobs/job-list.json');
const jobDetailsData = require('../../test-data/jobs/job-details.json');

const cxUrl = 'playwrightqa/CorporateCareerPortal2';

/** @type {import('@playwright/test').TestType<any, any>} */
const test = cxBaseFixture.extend({
    // Page Fixtures go here
    jobsListPage: async ({ page }, use) => {
        const jobsPage = new JobsListPage(page);
        await page.goto(cxUrl);
        await use(jobsPage);
    },

    jobDetailsPage: async ({ page }, use) => {
        const jobsPage = new JobDetailsPage(page);
        await page.goto(cxUrl);
        await use(jobsPage);
    },

    // CX "Career Site" admin app, for tests that must change a portal
    // setting before verifying it on the candidate side. Logged in only —
    // each test navigates to the admin page (and portalId) it needs.
    careerPortalJobDetailsPage: async ({ page }, use) => {
        const careerPortalJobDetailsPage = new CareerPortalJobDetailsPage(page);
        await careerPortalJobDetailsPage.login();
        await use(careerPortalJobDetailsPage);
    },

    // Data Fixtures — converted to value fixtures
    jobsListData: jobsListData,
    jobDetailsData: jobDetailsData
});

module.exports = { test, expect };
