// @ts-check
const { test, expect } = require('../fixtures/candidates-fixture');

test.describe.serial('Candidates Ellipsis Action', () => {
    test('[C291] save search', async ({ candidatesEllipsisActionsPage, candidatesEllipsisActionsData }) => {
        await candidatesEllipsisActionsPage.deleteExistingSavedSearch(candidatesEllipsisActionsData.name);
        await candidatesEllipsisActionsPage.addTableColumn();
        await candidatesEllipsisActionsPage.saveSearch(candidatesEllipsisActionsData.name);
        const pageHeading = await candidatesEllipsisActionsPage.getPageHeading(candidatesEllipsisActionsData.name);
        await expect(pageHeading).toBeVisible();
    });

    test('[C292] my search', async ({ candidatesEllipsisActionsPage, candidatesEllipsisActionsData }) => {
        await candidatesEllipsisActionsPage.addTableColumn();
        await candidatesEllipsisActionsPage.mySearches(candidatesEllipsisActionsData.name);
        const pageHeading = await candidatesEllipsisActionsPage.getPageHeading(candidatesEllipsisActionsData.name);
        await expect(pageHeading).toBeVisible()
    });

    test('[C293] manage my search', async ({ candidatesEllipsisActionsPage, candidatesEllipsisActionsData }) => {
        await candidatesEllipsisActionsPage.manageMySearches(candidatesEllipsisActionsData.name);
        const pageHeading = await candidatesEllipsisActionsPage.getPageHeading(candidatesEllipsisActionsData.name);
        await expect(pageHeading).not.toBeVisible()
    });

    test('[C294] basic search', async ({ candidatesEllipsisActionsPage }) => {
        await candidatesEllipsisActionsPage.basicSearch();
        const pageHeading = await candidatesEllipsisActionsPage.getPageHeading("Today's Resumes");
        await expect(pageHeading).toBeVisible()
    });

    test('[C289] edit columns', async ({ candidatesEllipsisActionsPage }) => {
        await candidatesEllipsisActionsPage.addTableColumn();
        await expect(candidatesEllipsisActionsPage.tableHeading).toContainText('City');
        await expect(candidatesEllipsisActionsPage.tableHeading).toContainText('Disposition');
        await expect(candidatesEllipsisActionsPage.tableHeading).toContainText('Days to Hire');
    });

    test('[C179623] Candidate Pool/Job Tracking - Ellipses dropdown alphabetical order', async ({ candidatesEllipsisActionsPage }) => {
        const labels = await candidatesEllipsisActionsPage.getEllipsisMenuItemLabels();
        const sortedLabels = [...labels].sort((a, b) => a.localeCompare(b));
        expect(labels).toEqual(sortedLabels);
    });
});

