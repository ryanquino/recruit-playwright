// @ts-check
const { test, expect } = require('../fixtures/administration-fixture.js');

test.describe.serial('OfferLetters', () => {
    test('[C50339] Create Offer Letter', async ({ offerRejectionLettersPage, offerRejectionLettersData }) => {
        await offerRejectionLettersPage.uploadFile(offerRejectionLettersData, 'offer');
        await expect(offerRejectionLettersPage.uploadOfferSuccessMessage).toBeVisible();
    })

    test('[C644] Offer letter delete', async ({ offerRejectionLettersPage, offerRejectionLettersData }) => {
        await offerRejectionLettersPage.deleteLetter(offerRejectionLettersData, 'offer');
        await expect(await offerRejectionLettersPage.getListLocator(offerRejectionLettersData, 'offer')).toHaveCount(0);
    })
});

test.describe.serial('Rejection Letters', () => {
    test('[C50340] Create Rejection Letter', async ({ offerRejectionLettersPage, offerRejectionLettersData }) => {
        await offerRejectionLettersPage.uploadFile(offerRejectionLettersData, 'rejection');
        await expect(offerRejectionLettersPage.uploadRejectionSuccessMessage).toBeVisible();
    })

    test('[C646] Rejection letter delete', async ({ offerRejectionLettersPage, offerRejectionLettersData }) => {
        await offerRejectionLettersPage.deleteLetter(offerRejectionLettersData, 'rejection');
        await expect(await offerRejectionLettersPage.getListLocator(offerRejectionLettersData, 'rejection')).toHaveCount(0);
    })  
});

