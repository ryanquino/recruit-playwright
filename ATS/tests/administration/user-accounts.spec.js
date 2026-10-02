// @ts-check
const { test, expect } = require('../fixtures/administration-fixture.js');

test.describe('Verify listing, add user account, edit and activate/deactivate tests', () => {
    test('[C672] Listing', async ({ userAccountsPage }) => {
        await expect(await userAccountsPage.hasTableRecords()).toBeGreaterThan(0);
    });

    test('[C673] Add', async ({ userAccountsPage, userAccountsData }) => {
        //await userAccountsPage.addNewUser(userAccount[0]);  
        await expect(await userAccountsPage.getNewlyCreatedUser(userAccountsData.newUser.firstName + " " + userAccountsData.newUser.lastName, "1")).toBeVisible();       
    });

    test('[C675] Edit', async ({ userAccountsPage, userAccountsData }) => {
        const fullnameUpdate = userAccountsData.updateUser.firstName + " " + userAccountsData.updateUser.lastName;
        await userAccountsPage.editUser(fullnameUpdate, userAccountsData.updateUser.updatedEmail);
        await userAccountsPage.updatePermissions(fullnameUpdate, userAccountsData.updateUser.permissions, 'deleteRoles');
        await userAccountsPage.updatePermissions(fullnameUpdate, userAccountsData.updateUser.permissions, 'addRoles');
        await expect(await userAccountsPage.getUpdatedUserEmail(userAccountsData.updateUser, "1")).toBeVisible();       
    });

    test('[C677] activate', async ({ userAccountsPage, userAccountsData }) => {
        const fullnameActive = userAccountsData.activeUser.firstName + " " + userAccountsData.activeUser.lastName;
        await userAccountsPage.updateActiveUserAccount(fullnameActive, "1", 'inactivate');
        await expect(await userAccountsPage.userUpdateSuccessLocator).toBeVisible();
        await userAccountsPage.updateActiveUserAccount(fullnameActive, "0", 'activate');
        await expect(await userAccountsPage.userUpdateSuccessLocator).toBeVisible();
    });
});
