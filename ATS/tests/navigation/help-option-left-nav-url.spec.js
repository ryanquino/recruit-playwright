// @ts-check
const { test, expect } = require('../fixtures/base-fixture');

test.describe('Help Option Left Nav URL', () => {
    test('[C221169] Verify Help option in left navigation opens correct URL', async ({ basePage }) => {
        // Open the menu
        await basePage.menuButton.click();
        
        // Click Help option and wait for new page to open
        const helpPagePromise = basePage.page.waitForEvent('popup');
        await basePage.helpMenuItem.click();
        const helpPage = await helpPagePromise;
        
        // Verify Help page URL
        await expect(helpPage).toHaveURL('https://recruiting-help.rival-hr.com/WelcometoRecruit.htm');
    });
});
