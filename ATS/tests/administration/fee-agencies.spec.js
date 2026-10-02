// @ts-check
const { test, expect } = require('../fixtures/administration-fixture.js');

test.describe.serial('Create, edit, deactivate, reactivate fee agency', () => {
    test('[C625] Create', async ({ feeAgenciesPage, feeAgenciesData }) => {
        //await feeAgenciesPage.createFeeAgency(feeAgency);
        await expect(await feeAgenciesPage.getNewlyAddedFeeAGencyLocator(feeAgenciesData.feeAgency.feeAgencyName)).toBeVisible();
    });

    test('[C622] Edit', async ({ feeAgenciesPage, feeAgenciesData }) => {
        await feeAgenciesPage.editFreeAgency(feeAgenciesData.searchFilters);
        await expect(await feeAgenciesPage.getTableRowCount()).toBeGreaterThan(0);
    });

    test('[C19852] Verify record count on jobs and candidate page', async ({ feeAgenciesPage, feeAgenciesData }) => {
        await expect(await feeAgenciesPage.getFeeAgencySourceResults(feeAgenciesData.feeAgency.feeAgencyName, 1)).toBeGreaterThan(0);
        await expect(await feeAgenciesPage.getFeeAgencySourceResults(feeAgenciesData.feeAgency.feeAgencyName, 2)).toBeGreaterThan(0);
    });

    test('[C13486] Deactivate', async ({ feeAgenciesPage, feeAgenciesData }) => {
        await feeAgenciesPage.deactivateFeeAgency(feeAgenciesData.feeAgency.feeAgencyName);
        await expect(await feeAgenciesPage.getFeeAgencyDeactivatedLocator(feeAgenciesData.feeAgency.feeAgencyName)).toBeVisible();
    });

    test('[C13487] Reactivate', async ({ feeAgenciesPage, feeAgenciesData }) => {
        await feeAgenciesPage.reactivateFeeAgency(feeAgenciesData.feeAgency.feeAgencyName);
        await expect(await feeAgenciesPage.getNewlyAddedFeeAGencyLocator(feeAgenciesData.feeAgency.feeAgencyName)).toBeVisible();
    });
});
