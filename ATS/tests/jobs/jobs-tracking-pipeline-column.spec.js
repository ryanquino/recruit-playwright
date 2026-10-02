// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

test.describe('Job Tracking Page - Pipeline (Prospects) column', () => {
    test('[C106785] Pipeline column can be added and its count links to the matching Candidate Pool results', async ({ jobsEllipsisActionsPage }) => {
        const wasAdded = await jobsEllipsisActionsPage.addPipelineColumnIfAvailable();

        test.skip(!wasAdded, 'Pipeline (Prospects) column option is not available — EnableGenerativeAIOutreach feature flag is off for this user.');

        await expect(jobsEllipsisActionsPage.pipelineColumnHeader).toBeVisible();

        const pipelineLink = await jobsEllipsisActionsPage.getFirstPipelineCellLink();
        const pipelineCount = (await pipelineLink.textContent())?.trim();
        expect(pipelineCount, 'Pipeline column has no count in the first table row').toBeTruthy();

        await pipelineLink.click();
        await jobsEllipsisActionsPage.page.waitForLoadState('networkidle');

        expect(jobsEllipsisActionsPage.page.url()).toContain('prospectForJobId');
        const candidatePoolCount = await jobsEllipsisActionsPage.page.locator('#bulkActionItemsRecordCount').textContent();
        expect(candidatePoolCount, 'Candidate Pool record count element not found').toBeTruthy();
        expect(candidatePoolCount?.trim()).toBe(pipelineCount);
    });
});
