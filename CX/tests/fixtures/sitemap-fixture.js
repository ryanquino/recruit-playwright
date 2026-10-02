const { test: cxBaseFixture, expect } = require('./cx-base-fixture');

// Page files go here
const SitemapPage = require('../../pages/jobs/sitemap.page');
const JobDetailsPage = require('../../pages/jobs/job-details.page');
const JobsListPage = require('../../pages/jobs/jobs-list.page');

/** @type {import('@playwright/test').TestType<any, any>} */
const test = cxBaseFixture.extend({
    // Page Fixtures go here
    sitemapPage: async ({ page }, use) => {
        const sitemapPage = new SitemapPage(page);
        await sitemapPage.goto();
        await use(sitemapPage);
    },

    jobDetailsPage: async ({ page }, use) => {
        await use(new JobDetailsPage(page));
    },

    // Un-navigated: the completeness test drives this to the same portal
    // the sitemap covers (Corporate Career Portal) itself.
    jobsListPage: async ({ page }, use) => {
        await use(new JobsListPage(page));
    },
});

module.exports = { test, expect };
