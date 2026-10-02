// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

test.describe.serial('Jobs Ellipsis Actions', () => {
    test('[C231] save search', async ({ jobsEllipsisActionsPage, jobsEllipsisActionsData }) => {
        await jobsEllipsisActionsPage.addColumns();
        await jobsEllipsisActionsPage.saveSearch(jobsEllipsisActionsData.name);
        await expect(await jobsEllipsisActionsPage.getPageHeading(jobsEllipsisActionsData.name)).toBeVisible()
    });

    test('[C232] my search', async ({ jobsEllipsisActionsPage, jobsEllipsisActionsData }) => {
        await jobsEllipsisActionsPage.addColumns();
        await jobsEllipsisActionsPage.mySearches(jobsEllipsisActionsData.name);
        await expect(await jobsEllipsisActionsPage.getPageHeading(jobsEllipsisActionsData.name)).toBeVisible()
    });

    test('[C233] manage my search', async ({ jobsEllipsisActionsPage, jobsEllipsisActionsData }) => {
        await jobsEllipsisActionsPage.manageMySearches(jobsEllipsisActionsData.name);
        await expect(await jobsEllipsisActionsPage.getPageHeading(jobsEllipsisActionsData.name)).not.toBeVisible()
    });
});

test('[C234] basic search', async ({ jobsEllipsisActionsPage }) => {
    await jobsEllipsisActionsPage.basicSearch();
    await expect(await jobsEllipsisActionsPage.getPageHeading('Jobs')).toBeVisible()
});

test('[C229] edit columns test', async ({ jobsEllipsisActionsPage }) => {
    await jobsEllipsisActionsPage.addColumns();
    await expect(jobsEllipsisActionsPage.tableHeading).toContainText('All Locations');
    await expect(jobsEllipsisActionsPage.tableHeading).toContainText('Business Unit');
    await expect(jobsEllipsisActionsPage.tableHeading).toContainText('City');
});

test('[C230] edit columns - scenario 2', async ({ jobsEllipsisActionsPage, jobsEllipsisActionsData }) => {
    await jobsEllipsisActionsPage.addAllAvailableColumns();
    for (const label of jobsEllipsisActionsData.allColumnLabels) {
        await expect(jobsEllipsisActionsPage.tableHeading).toContainText(label);
    }
});

test('[C235] export results', async ({ jobsEllipsisActionsPage }) => {
    const download = await jobsEllipsisActionsPage.exportSearchResults();
    expect(download.suggestedFilename()).toBe('Jobs.xlsx');
});