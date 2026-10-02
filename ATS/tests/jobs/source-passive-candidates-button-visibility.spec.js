// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

// [C140229] Source Passive Candidates button
//
// The button is now labeled "Source with ROSI" in the current UI (the case predates that
// rename). Scope note: verified live for Normal (shown) and On Hold (hidden) statuses.
// Closed, Internal, and Waiting Approval weren't covered — no example jobs in those exact
// statuses were readily available in this QA environment within the time available.
test.describe('Source with ROSI button visibility by job status', () => {
    test('[C140229] Source with ROSI button shows for a Normal status job and is hidden for an On Hold job', async ({ jobDetailsPage, sourcePassiveCandidatesButtonVisibilityData }) => {
        await jobDetailsPage.openJobByName(sourcePassiveCandidatesButtonVisibilityData.normalStatusJob);
        await expect(jobDetailsPage.sourceWithRosiButton).toBeVisible();

        await jobDetailsPage.navigateToJobDetailsPage();
        await jobDetailsPage.openJobByName(sourcePassiveCandidatesButtonVisibilityData.onHoldStatusJobCode);
        await expect(jobDetailsPage.sourceWithRosiButton).not.toBeVisible();
    });
});
