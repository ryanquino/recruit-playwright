const CxAdminBasePage = require('./cx-admin-base.page');

// Manage Languages page — live-verified (2026-08-27) via full-page aria
// snapshot against /playwrightqa/admin/JobBoards/Locales?portalId=2577.
// Enabling a language here (a switch per language, English is the fixed
// default and can't be disabled from this page) makes it "a configuration
// option for Presubmission Text, Application Form, Job Details Page" per
// the page's own help text — this is the previously-undocumented mechanism
// behind TestRail's "Portal language set to X" preconditions for the
// C805-C807/C836-C838/etc. localization cases.
class CareerPortalLanguagesPage extends CxAdminBasePage {
    constructor(page) {
        super(page);

        this.pageHeading = this.page.getByRole('heading', { name: 'Manage Languages', exact: true });
        this.saveButton = this.page.getByRole('button', { name: 'Save' });
    }

    async goToLanguagesPage(portalId) {
        this.portalId = portalId;
        await this.page.goto(`${this.cxAdminBaseUrl}/playwrightqa/admin/JobBoards/Locales?portalId=${portalId}`);
        await this.page.waitForLoadState('load');
    }

    languageSwitch(languageName) {
        return this.page.getByRole('switch', { name: new RegExp(languageName) });
    }

    // Enabling/disabling redirects back to the portal's Career Site
    // Settings TOC (same pattern as career-portal-open-submission.page.js),
    // so re-navigate here afterward to confirm the choice persisted.
    async setLanguageEnabled(languageName, enabled) {
        const toggle = this.languageSwitch(languageName);
        if (enabled) {
            await toggle.check();
        } else {
            await toggle.uncheck();
        }
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.goToLanguagesPage(this.portalId);
    }
}

module.exports = CareerPortalLanguagesPage;
