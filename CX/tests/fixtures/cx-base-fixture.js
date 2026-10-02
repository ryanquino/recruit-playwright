const { test: base, expect } = require('@playwright/test');
const BasePage = require('../../../ATS/pages/base.page');

/** @type {import('@playwright/test').TestType<BaseFixtures, {}>} */
const test = base.extend({
    cxBasePage: async ({ page }, use) => {
        const basePage = new BasePage(page);
        await page.goto(process.env.BASE_URL);
        await basePage.login();
        await use({ page, basePage });
    }
});

module.exports = { test, expect };