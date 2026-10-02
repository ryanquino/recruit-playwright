const { test, expect } = require('@playwright/test');
const BasePage = require('../../pages/base.page.js');
const userData = require('../../test-data/users.json');
let basePage;

test.beforeEach(async ({ page }) => {
  basePage = new BasePage(page);
  await page.goto("/");
});

test('[TC-15959] ATS Standard login', { tag: '@smoke' }, async ({ page }) => {

  await test.step('Scenario Login with an Inactive User with valid credentials', async () => {
    await basePage.login(...userData.users.inactive);

    await expect(basePage.loginErrorMessage).toHaveText("Your user account has been deactivated. Please contact your SilkRoad Recruiting administrator.");
  
  });

  await test.step('Scenario Login with an Active User with an invalid username', async () => {
    await basePage.login(...userData.users.invalid_username);

    await expect(basePage.loginErrorMessage).toHaveText("You have used an incorrect Username and or Password. Please review this information and try again. Or, contact your system administrator.");
  });

  await test.step('Scenario Login with an Active User with an invalid password', async () => {
    await basePage.login(...userData.users.invalid_password);

    await expect(basePage.loginErrorMessage).toHaveText("You have used an incorrect Username and or Password. Please review this information and try again. Or, contact your system administrator.");
  });

  await test.step('Scenario Login with an Active User with valid credentials', async () => {
    await basePage.login();

    await expect(basePage.openJobsHeading).toBeVisible();
  });

});