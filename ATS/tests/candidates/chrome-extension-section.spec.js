// @ts-check
const { test, expect } = require('../fixtures/candidates-fixture');

test.describe('Source with ROSI - Chrome Extension Section', () => {
    test('[C261518] Verify Chrome Extension section is visible and expandable', async ({ sourcePassiveCandidatesPage }) => {
        await expect(sourcePassiveCandidatesPage.sourcePassiveCandidatePageHeading).toBeVisible();

        // Expand Chrome Extension section
        await sourcePassiveCandidatesPage.expandChromeExtensionButtonLocator.click();

        // Verify Chrome Extension section elements are visible
        await expect(sourcePassiveCandidatesPage.chromeExtensionHeadingLocator).toBeVisible();
        await expect(sourcePassiveCandidatesPage.chromeExtensionDescriptionLocator).toBeVisible();
        await expect(sourcePassiveCandidatesPage.installExtensionLinkLocator).toBeVisible();
    });
});
