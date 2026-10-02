const { test: parityBase, expect } = require('./opensearch-parity-fixture');
const CareerPortalJobListPage = require('../../pages/administration/career-portal-job-list.page');
const CareerPortalJobDetailsPage = require('../../pages/administration/career-portal-job-details.page');
const jobData = require('../../test-data/jobs/job-details-location-format-parity.json');

// The CX "Career Site" admin app (playwrightqa/Admin) that owns both Job
// Location Format settings exists on a single host — there's no
// enabled/disabled variant of the admin app itself, only of the
// candidate-facing pages these settings are supposed to affect. So each
// fixture logs into the admin app once (always against CX_BASE_URL) and
// separately exposes the two candidate host URLs (from
// opensearch-parity-fixture.js) for the test to drive on its own.
//
// Two distinct admin pages/settings are in play, each affecting a
// different candidate-facing surface (live-verified 2026-09-23):
// - "Manage Job List" (CareerPortalJobListPage) → the job list/search
//   results page's cards.
// - "Manage Job Details Page" (CareerPortalJobDetailsPage) → an
//   individual job's own Job Details page.
/** @type {import('@playwright/test').TestType<any, any>} */
const test = parityBase.extend({
    careerPortalJobListPage: async ({ page }, use) => {
        const jobListPage = new CareerPortalJobListPage(page);
        await jobListPage.login();
        await jobListPage.goToJobListPage(jobData.portalId);
        await use(jobListPage);
    },

    careerPortalJobDetailsPage: async ({ page }, use) => {
        const jobDetailsPage = new CareerPortalJobDetailsPage(page);
        await jobDetailsPage.login();
        await jobDetailsPage.goToJobDetailsPage(jobData.portalId);
        await use(jobDetailsPage);
    },

    jobData: jobData,
});

module.exports = { test, expect };
