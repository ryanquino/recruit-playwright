// @ts-check
const { test, expect } = require('../fixtures/administration-fixture');

// [C162] Career Portal - View Configured Application Form. Same separate
// CX Admin app as career-portal-application-form-toggle.spec.js (see that
// file's header), against portalId 2609 (Hourly Career Portal).
//
// Publishing auto-archives whichever form was previously live for this
// locale (live-verified 2026-08-26 — publishing a clone in the CRUD spec
// flipped an earlier run's published form here to "Archived"), and
// archived forms are just as immutable/undeletable as published ones. So
// a fixed, reused name can't work here without risking a name collision
// between a stale archived copy and a fresh draft; a per-run unique name
// sidesteps that entirely at the cost of leaving one more
// permanently-archived form behind each run (same one-way constraint as
// the CRUD spec's publish/delete steps).
//
// Fully independent of the toggle and CRUD specs — no shared state, so it
// doesn't need to run serially with (or after) either of them. Split into
// its own file for that reason.
test.describe('Career Portal - View Configured Application Form', () => {
    test('[C162] View Configured Application Form', async ({ careerPortalApplicationFormPage, careerPortalApplicationFormData }) => {
        const viewFormName = `${careerPortalApplicationFormData.viewFormName} ${test.info().workerIndex}-${Date.now()}`;

        await careerPortalApplicationFormPage.createConfiguredForm(viewFormName);
        await careerPortalApplicationFormPage.publishConfiguredForm(viewFormName);
        await careerPortalApplicationFormPage.viewConfiguredForm(viewFormName);
        await expect(careerPortalApplicationFormPage.viewFormHeading).toBeVisible();
    });
});
