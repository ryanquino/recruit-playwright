const { test: baseFixture, expect } = require('./base-fixture');
const HomepageAnalyticsPage = require('../../pages/analytics/homepage-analytics.page');

// Test data
const homepageAnalyticsData = require('../../test-data/analytics/homepage-analytics.json');

/** @type {import('@playwright/test').TestType<AnalyticsFixture, {}>} */
const test = baseFixture.extend({
    // Page Fixtures
    // Homepage analytics is Looker-backed and only enabled on a separate tenant (ANALYTICS_BASE_URL,
    // lookerqa01) with its own Reporting Tier account, so this logs in there itself instead of using
    // basePage, which logs into the main playwrightqa tenant.
    homepageAnalyticsPage: async ({ page }, use) => {
        const analyticsPage = new HomepageAnalyticsPage(page);
        await page.goto(process.env.ANALYTICS_BASE_URL);
        await analyticsPage.loginToDashboard(process.env.ANALYTICS_USERNAME, process.env.ANALYTICS_PASSWORD);
        await use(analyticsPage);
    },

    // Data Fixtures
    homepageAnalyticsData: homepageAnalyticsData,
});

module.exports = { test, expect };
