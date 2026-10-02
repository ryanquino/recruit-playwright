// @ts-check
const { test, expect } = require('../fixtures/candidates-fixture');

test.describe('Manual Candidate Upload - Add to Pipeline Field', () => {
    test.afterEach(async ({ candidatesPage, candidateData }) => {
        await candidatesPage.cleanupCandidateByName(candidateData.addToPipeline.candidate_name);
    });

    test('[C234854] Verify "Add to Pipeline" field is visible after saving candidate', async ({ candidatesPage, candidateData }) => {
        await candidatesPage.fillBasicManualEntry(candidateData.addToPipeline.candidate_name, candidateData.addToPipeline.email);
        const first = await candidatesPage.verifyPipelineOnCRP();
        await expect(first).toBe(true);

    });
});
