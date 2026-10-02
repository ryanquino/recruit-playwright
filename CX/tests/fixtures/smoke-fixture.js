const { test: cxBaseFixture, expect } = require('./cx-base-fixture');

// Page files go here
const CareerPortalPage = require('../../pages/portal/career-portal.page');

const cxUrl = 'playwrightqa/CorporateCareerPortal';

/** @type {import('@playwright/test').TestType<any, any>} */
const test = cxBaseFixture.extend({
    careerPortalPage: async ({ page }, use) => {
        const careerPortalPage = new CareerPortalPage(page);
        await page.goto(cxUrl);
        await use(careerPortalPage);
    },
});

module.exports = { test, expect };
