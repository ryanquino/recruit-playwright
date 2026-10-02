// @ts-check
const { test, expect } = require('../fixtures/administration-fixture');

test.describe.serial('Company Locations', () => {
    test('[C593] Create company location', async ({ companyLocationsPage, companyLocationsData }) => {
        await expect(companyLocationsPage.getLocationRow(companyLocationsData.locationName)).toBeVisible();     
    });

    test('[C595] Display company location', async ({ companyLocationsPage, companyLocationsData }) => {
        await companyLocationsPage.displayLocation();
        await expect(companyLocationsPage.getLocationRow(companyLocationsData.locationName)).toBeVisible();     
    });

});