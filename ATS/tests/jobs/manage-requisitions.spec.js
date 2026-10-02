// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

test('[C246] list', async ({ manageRequisitionsPage }) => {
    await expect(await manageRequisitionsPage.getTableRowCount()).toBe(true);
});

test.describe.serial('Manage Requisitions Actions', () => {
    test('[C247] create (*Huge case*)', async ({ manageRequisitionsPage, manageRequisitionsData }) => {
        await manageRequisitionsPage.createRequisition(manageRequisitionsData, false);
        await expect(
            await manageRequisitionsPage.getApproversTableLocator(manageRequisitionsData.approvers)
        ).toBeVisible();
    });

    test('[C250] approve', async ({ manageRequisitionsPage, manageRequisitionsData }) => {
        await manageRequisitionsPage.approveRequisition();
        await expect(
            await manageRequisitionsPage.getRequisitionsTableLocator(manageRequisitionsData.internalJobTitle)
        ).toBeVisible();
    });

    test('[C249] post', async ({ manageRequisitionsPage, manageRequisitionsData }) => {
        await manageRequisitionsPage.postRequisition(manageRequisitionsData.trackingCode);
        await manageRequisitionsPage.searchPostedRequisition(manageRequisitionsData.internalJobTitle);
        await expect(await manageRequisitionsPage.getTableRowCount()).toBe(true);
        await manageRequisitionsPage.deactivatePostedRequisition();
        await expect(await manageRequisitionsPage.deactivateSuccessAlertLocator).toBeVisible();
    });

    test('[C873] Create Evergreen Requisition', async ({ manageRequisitionsPage, manageRequisitionsData }) => {
        await manageRequisitionsPage.createRequisition(manageRequisitionsData, true);
        await expect(
            await manageRequisitionsPage.getApproversTableLocator(manageRequisitionsData.approvers)
        ).toBeVisible();
        await manageRequisitionsPage.approveRequisition();
        await manageRequisitionsPage.navigateToManageRequisitionsPage();
        await manageRequisitionsPage.deleteRequisition();
        await expect(manageRequisitionsPage.requisitionsTableFirstRow).toHaveCount(0);
    });
});