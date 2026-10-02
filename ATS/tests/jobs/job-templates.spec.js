// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

test.describe.serial('Job Templates page', () => {
    test('[C633] create/edit', async ({ jobTemplatesPage, jobTemplatesData }) => {
        const templateLocator = await jobTemplatesPage.getLocatorOfNewlyCreatedJobTemplate(jobTemplatesData.templateName);
        await expect(templateLocator).toBeVisible();
    });

    test('[C635] sorting', async ({ jobTemplatesPage }) => {
        const isSorted = await jobTemplatesPage.isJobTemplateSorted();
        expect(isSorted).toBeTruthy();
    });

    test('[C632] listing', async ({ jobTemplatesPage }) => {
        const rowCount = await jobTemplatesPage.getTableRowCount();
        expect(rowCount).toBeGreaterThan(0);
    });

    test('[C636] activate/deactivate', async ({ jobTemplatesPage, jobTemplatesData }) => {
        await jobTemplatesPage.deactivateJobTemplate(jobTemplatesData.templateName);
        const deactivatedLocator = await jobTemplatesPage.getLocatorOfNewlyCreatedJobTemplate(jobTemplatesData.templateName);
        await expect(deactivatedLocator).not.toBeVisible();
        await jobTemplatesPage.activateJobTemplate(jobTemplatesData.templateName);
        const activatedLocator = await jobTemplatesPage.getLocatorOfNewlyCreatedJobTemplate(jobTemplatesData.templateName);
        await expect(activatedLocator).toBeVisible();
    });
});


