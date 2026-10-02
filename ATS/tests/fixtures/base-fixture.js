const { test: base, expect } = require('@playwright/test');
const BasePage = require('../../pages/base.page');

/** @type {import('@playwright/test').TestType<BaseFixtures, {}>} */
const test = base.extend({
    basePage: async ({ page }, use) => {
        const basePage = new BasePage(page);
        await page.goto('/');
        await basePage.login();
        await use(basePage);
    },
});

module.exports = { test, expect };