// @ts-check
const { test, expect } = require('../fixtures/candidates-fixture');
const RecycleBinPage = require('../../pages/candidates/recycle-bin.page');

test.describe.serial('Upload Candidates', () => {
    test('[C386] upload', async ({ candidatesPage }) => {
        await candidatesPage.uploadResume('Resume.docx');
        await candidatesPage.saveResume();
        await expect(candidatesPage.successMessageLocator).toBeVisible();
    });

    test('[C385] manual entry', async ({ candidatesPage }) => {
        const recycleBinPage = new RecycleBinPage(candidatesPage.page);
        await candidatesPage.fillManualEntry();
        await expect(candidatesPage.successMessageLocator).toBeVisible();
        await candidatesPage.cleanupCandidate();
        await recycleBinPage.purge();
        await expect(candidatesPage.recycleBinMessageLocator).toBeVisible();
    });
});

test('[C387] upload - Scenario 2', async ({ candidatesPage }) => {
    await candidatesPage.uploadResume('invalid.json');
    await candidatesPage.uploadResume('resume.pdf');
    await expect(candidatesPage.invalidFileErrorMessageLocator).toBeVisible();
    await expect(candidatesPage.fileExtensionErrorLocator).toBeVisible();
});

