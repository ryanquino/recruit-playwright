const { test: base, expect } = require('@playwright/test');
const SitemapXmlPage = require('../../pages/jobs/sitemap-xml.page');
const JobsListPage = require('../../pages/jobs/jobs-list.page');
const sitemapXmlScopeData = require('../../test-data/jobs/sitemap-xml-scope.json');

// The real /sitemap.xml — a separate feature from the candidate-facing HTML
// "Sitemap" page (see sitemap-fixture.js / sitemap.page.js). Single host,
// same convention as the RSS suite's rss-fixture.js.
const CX_BASE_URL = process.env.CX_BASE_URL || 'https://qa-recruiting-cx.silkroad-eng.com';

/** @type {import('@playwright/test').TestType<any, any>} */
const test = base.extend({
    sitemapXmlPage: async ({ request }, use) => {
        await use(new SitemapXmlPage(request));
    },

    // Un-navigated: each test drives this to whichever portal its test
    // data names.
    jobsListPage: async ({ page }, use) => {
        await use(new JobsListPage(page));
    },

    cxBaseUrl: CX_BASE_URL,
    sitemapXmlScopeData: sitemapXmlScopeData,
});

module.exports = { test, expect };
