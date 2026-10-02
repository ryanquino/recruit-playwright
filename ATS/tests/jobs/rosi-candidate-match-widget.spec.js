// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

// [C190449] Verify Candidate Match modal displays on Job Details page
//
// Scope note: no job in the QA environment currently has ROSI-scored candidates
// (Source with ROSI has to be run and given time to process, which was not triggered
// here to avoid mutating shared QA data), so the per-candidate score/matched-skills
// modal itself could not be verified against real markup. This test covers the part
// that is real and stable today: the ROSI Candidate Match widget renders on the Job
// Details page with its "how it's calculated" info icon. Opening a specific
// candidate's score modal needs a job seeded with pre-computed ROSI scores.
test.describe('ROSI Candidate Match', () => {
    test('[C190449] ROSI Candidate Match widget displays on Job Details page', async ({ jobDetailsPage, rosiCandidateMatchWidgetData }) => {
        await jobDetailsPage.openJobByName(rosiCandidateMatchWidgetData.jobTitle);

        await expect(jobDetailsPage.rosiCandidateMatchLabel).toBeVisible();
        await expect(jobDetailsPage.rosiCandidateMatchInfoIcon).toBeVisible();
    });
});
