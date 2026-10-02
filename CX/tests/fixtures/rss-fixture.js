const { test: base, expect } = require('@playwright/test');
const RssFeedPage = require('../../pages/jobs/rss-feed.page');
const JobsListPage = require('../../pages/jobs/jobs-list.page');
const JobDetailsPage = require('../../pages/jobs/job-details.page');

// This suite used to also fetch a second, "OpenSearch-disabled" host
// (qa-recruiting-cx-test / CX_TEST_BASE_URL) purely to diff RSS output
// against it. That host is being retired once OpenSearch ships — it's a
// temporary migration-verification environment, not a permanent one, and a
// general-purpose regression suite shouldn't depend on it. (Enabled-vs-
// disabled parity itself is still covered, deliberately, on its own
// short-lived branch: automated-tests/rnd-21359-opensearch-parity — not
// here.) CX_BASE_URL — already the one documented CX host var (README.md,
// CX/README.md, playwright-cx.config.js's baseURL) — is now the only host
// this suite needs. Content correctness (category/location) is checked
// against each job's own schema.org JSON-LD structured data instead of a
// second host — see JobDetailsPage.getStructuredData().
const CX_BASE_URL = process.env.CX_BASE_URL || 'https://qa-recruiting-cx.silkroad-eng.com';

/** @type {import('@playwright/test').TestType<any, any>} */
const test = base.extend({
    rssFeedPage: async ({ request }, use) => {
        await use(new RssFeedPage(request));
    },

    // Un-navigated on purpose: rss-feed.spec.js drives this to whichever
    // tenant portal a given feed's test data names (Corporate, Hourly, ...).
    jobsListPage: async ({ page }, use) => {
        await use(new JobsListPage(page));
    },

    jobDetailsPage: async ({ page }, use) => {
        await use(new JobDetailsPage(page));
    },

    cxBaseUrl: CX_BASE_URL,
});

module.exports = { test, expect };
