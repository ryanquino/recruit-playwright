// @ts-check
const { test, expect } = require('../fixtures/candidates-fixture');

test('[C357] Verify Source Default Value', async ({ employeeReferralsPage }) => {
    const sourceValue = await employeeReferralsPage.employeeReferralsSourceLocator.textContent();
    await expect(sourceValue.trim()).toBe('EMPLOYEE REFERRAL');
});

test('[C358] Verify Listing', async ({ employeeReferralsPage }) => {
    await expect(await employeeReferralsPage.getTableResultsCount()).toBe(true);
    const value = await employeeReferralsPage.sourceTableLocator.innerText();
    await expect(value.trim()).not.toBe('');
});



