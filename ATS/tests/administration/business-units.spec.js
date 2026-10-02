// @ts-check
const { test, expect } = require('../fixtures/administration-fixture.js');

test.describe.serial('Add and verify a new business unit', () => {
    test('[C584] Create - Scenario 2', async ({ businessUnitsPage, businessUnitsData }) => {
        //create a new business unit
        await businessUnitsPage.createNewBusinessUnit(businessUnitsData);
        await expect(await businessUnitsPage.isBusinessUnitVisible(businessUnitsData.label)).toBeVisible();        
    });

    test('[C70307] Deactivate', async ({ businessUnitsPage, businessUnitsData }) => {  
        //deactivate the newly create business unit for cleanup
        await businessUnitsPage.deactivateBusinessUnit(businessUnitsData.label);
        await expect(await businessUnitsPage.isBusinessUnitVisible(businessUnitsData.label)).not.toBeVisible();      
    });
});


  
  