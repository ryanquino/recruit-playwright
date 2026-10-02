// @ts-check
const { test } = require('@playwright/test');
const CareerPortalApplicationFormPage = require('../../pages/administration/career-portal-application-form.page');

// Ensures the dedicated FrenchCareerPortal/GermanCareerPortal/
// SpanishCareerPortal (portalId 2613/2614/2612) have their "Manage
// Application Form" toggle set to "Use the configured application
// form below" — the precondition [C836]/[C837]/[C838] in
// application-form-localization.spec.js assume, rather than toggle
// themselves.
//
// This is a deliberately separate file, not a beforeAll/beforeEach in
// the localization spec itself: combining a CX Admin toggle action
// with the candidate-facing applicationFixture in the same test
// reproducibly hangs on this suite (live-verified 2026-09-04 — same
// failure mode application-form-localization.spec.js's own history
// already documented for language-toggling, root cause unidentified
// in either case). Kept fully isolated — no candidate-facing fixture
// involved — sidesteps it entirely.
//
// The toggle is durable CX Admin state, not reset between runs, so
// this doesn't need to run before every localization test run — only
// when the precondition needs (re-)establishing. selectConfiguredForm()
// is idempotent (Playwright's .check() no-ops if already checked), so
// it's safe to run this file any time, including repeatedly.
test.describe('Ensure Configured Apply is selected on localization portals', () => {
    const PORTALS = [
        { name: 'French', portalId: 2613 },
        { name: 'German', portalId: 2614 },
        { name: 'Spanish', portalId: 2612 },
    ];

    for (const { name, portalId } of PORTALS) {
        test(`${name} Career Portal (${portalId}) uses the configured application form`, async ({ page }) => {
            const formPage = new CareerPortalApplicationFormPage(page);
            await formPage.login();
            await formPage.goToApplicationFormPage(portalId);
            await formPage.selectConfiguredForm();
        });
    }
});
