// @ts-check
const { test, expect } = require('../fixtures/candidates-fixture');
const UploadCandidates = require('../../pages/candidates/upload-candidates.page');
const candidateData = require('../../test-data/candidates/candidate.json');


test.describe.serial('Purge candidates', () => {
    test('[C372] Listing', async ({ recycleBinPage }) => {
        const uploadCandidate = new UploadCandidates(recycleBinPage.page, candidateData);
        await recycleBinPage.navigateToUpload();
        await uploadCandidate.fillManualEntry();
        //await uploadCandidate.saveResume();
        await recycleBinPage.deleteCandidate('Playwright Upload Playwright');
        await expect(await recycleBinPage.recycleBinTableLocator.count()).toBeGreaterThan(0);
    });

    test('[C373] Search', async ({ recycleBinPage }) => {
        await recycleBinPage.search('Playwright');
        await expect(await recycleBinPage.recycleBinTableLocator.count()).toBeGreaterThan(0);
    });

    test('[C377] Restore', async ({ recycleBinPage }) => {
        await recycleBinPage.restore();
        await expect(await recycleBinPage.successToaster).toBeVisible();
    });

    test('[C378] Delete', async ({ recycleBinPage }) => {
        const uploadCandidate = new UploadCandidates(recycleBinPage.page, candidateData);
        await recycleBinPage.navigateToUpload();
        await uploadCandidate.fillManualEntry();
        //await uploadCandidate.saveResume();
        await recycleBinPage.deleteCandidate('Playwright Upload Playwright');
        await recycleBinPage.delete();
        await expect(await recycleBinPage.recycleBinMessageLocator).toBeVisible();
    });

    test('[C379] Purge', async ({ recycleBinPage }) => {
        const uploadCandidate = new UploadCandidates(recycleBinPage.page, candidateData);
        await recycleBinPage.navigateToUpload();
        await uploadCandidate.fillManualEntry();
        //await uploadCandidate.saveResume();
        await recycleBinPage.deleteCandidate('Playwright Upload Playwright');
        await recycleBinPage.purge();
        await expect(await recycleBinPage.purgeSuccessToaster).toBeVisible();
        await expect(await recycleBinPage.recycleBinMessageLocator).toBeVisible();
    });
});








