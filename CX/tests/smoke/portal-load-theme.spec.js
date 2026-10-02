// @ts-check
const { test, expect } = require('../fixtures/smoke-fixture');

test.describe('Smoke - Portal Load', () => {
    // [SC-074] in CX_OpenSearch_Automation_Test_Plan; Kiwi case 31335 carries
    // that scenario id as its eva.playwright_key.
    test('[C31335] Corporate Career Portal loads with tenant branding applied', { tag: '@smoke' }, async ({ careerPortalPage, page }) => {
        await expect(page).toHaveTitle(/.+/);
        await expect(careerPortalPage.jobsNavLink).toBeVisible();

        await expect(careerPortalPage.logoImage).toBeVisible();
        const logoSrc = await careerPortalPage.logoImage.getAttribute('src');
        expect(logoSrc).toBeTruthy();

        await expect(careerPortalPage.bannerImage).toBeVisible();
        const bannerSrc = await careerPortalPage.bannerImage.getAttribute('src');
        expect(bannerSrc).toBeTruthy();
    });
});
