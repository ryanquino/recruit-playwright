// @ts-check
const { test, expect } = require('../fixtures/administration-fixture.js');

test.describe('Manage resource tests', () => {
    test('[C42728] Edit resource', async ({ manageResourcesPage, manageResourcesData }) => {
        await manageResourcesPage.editResource(manageResourcesData.resourceUpdate);
        await expect(await manageResourcesPage.modifiedAlertSuccess).toBeVisible();
    });

    test('[C42732] 	Edit how did you hear about us option', async ({ manageResourcesPage, manageResourcesData }) => {
        await manageResourcesPage.editOption(manageResourcesData.hdyhauUpdate);
        await expect(await manageResourcesPage.getNewlyAddedResource(manageResourcesData.hdyhauUpdate)).toBeVisible();
    });

    test('[C42742] 	Verify Redirect to Candidate Pool ', async ({ manageResourcesPage, manageResourcesData }) => {
        await manageResourcesPage.redirectToCandidatePool(manageResourcesData.resourceUpdate);
        await expect(await manageResourcesPage.sourceTextLocator).toHaveText(manageResourcesData.resourceUpdate);
    });
});

test.describe.serial('Resource Activation and Deactivation', () => {
    test('[C42729] Deactivate resource', async ({ manageResourcesPage, manageResourcesData }) => {
        await manageResourcesPage.deactivateResource(manageResourcesData.resourceName);
        await expect(await manageResourcesPage.deletedAlertASuccess).toBeVisible();
    });

    test('[C42730] Activate resource', async ({ manageResourcesPage, manageResourcesData }) => {
        await manageResourcesPage.activateResource(manageResourcesData.resourceName);
        await expect(await manageResourcesPage.activatedAlertASuccess).toBeVisible();
    });
});

test.describe.serial('HDYHAU Activation and Deactivation', () => {
    test('[C42733] 	Deactivate how did you hear about us', async ({ manageResourcesPage, manageResourcesData }) => {
        await manageResourcesPage.deactivateResource(manageResourcesData.hdyhau);
        await expect(await manageResourcesPage.deletedAlertASuccess).toBeVisible();
    });

    test('[C42734] 	Activate how did you hear about us', async ({ manageResourcesPage, manageResourcesData }) => {
        await manageResourcesPage.activateResource(manageResourcesData.hdyhau);
        await expect(await manageResourcesPage.activatedAlertASuccess).toBeVisible();
    });
});

