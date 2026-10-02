class FeeAgencyJobDetailsPage {
    constructor(page) {
        this.page = page;
        this.cxAdminBaseUrl = (process.env.CX_BASE_URL || 'https://qa-recruiting-cx.silkroad-eng.com/').replace(/\/$/, '');

        // Login locators (separate CX "Career Site" admin app, not the ATS
        // backend — reached at /playwrightqa/Admin, same as
        // CareerPortalApplicationFormPage)
        this.loginField = this.page.getByLabel('Login');
        this.passwordField = this.page.getByLabel('Password');
        this.signInButton = this.page.getByRole('button', { name: 'Sign In' });

        // Manage Fee Agency Job Details Page locators
        this.pageHeading = this.page.getByRole('heading', { name: 'Manage Fee Agency Job Details Page', exact: true });
        this.addPageIcon = this.page.getByTitle('Add job details page');

        // Page editor locators
        this.nameField = this.page.getByLabel('Name');
        this.pageEditorSaveButton = this.page.getByRole('button', { name: 'Save' });

        // Confirmation drawer (used for publish/delete). Live-verified
        // (2026-08-27): unlike CareerPortalApplicationFormPage's modal
        // (#Admin_JobBoards_ApplicationForms_Modal_Primary_Button), this
        // page's publish/delete icons open a side drawer with its own
        // "Publish"/"Delete" confirm button.
        this.publishConfirmButton = this.page.getByRole('button', { name: 'Publish' });
        this.deleteConfirmButton = this.page.getByRole('button', { name: 'Delete' });
    }

    pagePanel(pageName) {
        // Exact match — "hasText" substring matching would also match e.g.
        // a panel named "PW Fee Agency Job Details CRUD (Edited)" for
        // pageName "PW Fee Agency Job Details CRUD".
        return this.page.locator('.sr-panel').filter({ has: this.page.getByText(pageName, { exact: true }) });
    }

    editPageIcon(pageName) {
        return this.pagePanel(pageName).getByTitle('Edit job details page');
    }

    clonePageIcon(pageName) {
        return this.pagePanel(pageName).getByTitle('Clone job details page');
    }

    publishPageIcon(pageName) {
        return this.pagePanel(pageName).getByTitle('Publish job details page');
    }

    deletePageIcon(pageName) {
        return this.pagePanel(pageName).getByTitle('Delete job details page');
    }

    // [C176] View — only appears once a form is published, replacing the
    // edit/clone/delete icons (live-verified 2026-08-27).
    viewPageIcon(pageName) {
        return this.pagePanel(pageName).getByTitle('View job details page');
    }

    pageStatusText(pageName) {
        return this.pagePanel(pageName).locator('.info');
    }

    async login() {
        if (!process.env.USERNAME || !process.env.PASSWORD) {
            throw new Error('USERNAME and PASSWORD environment variables must be set to log in to the CX Admin app');
        }
        await this.page.goto(`${this.cxAdminBaseUrl}/playwrightqa/Admin`);
        await this.loginField.fill(String(process.env.USERNAME).trim());
        await this.passwordField.fill(String(process.env.PASSWORD));
        await this.signInButton.click();
        // Live-verified (2026-08-28): waiting on networkidle alone here is a
        // race — it can resolve in the gap before the post-login redirect
        // actually lands, so a subsequent goto() to an admin page sometimes
        // bounces back to Sign In (auth cookie not yet set). Wait for the
        // signed-in nav ("Sign Out" link) to confirm login truly completed.
        await this.page.getByRole('link', { name: 'Sign Out' }).waitFor({ state: 'visible', timeout: 15000 });
    }

    async goToFeeAgencyJobDetailsPage(portalId) {
        this.portalId = portalId;
        await this.page.goto(`${this.cxAdminBaseUrl}/playwrightqa/admin/FeeAgency/JobListings?portalId=${portalId}`);
        await this.page.waitForLoadState('load');
    }

    async createJobDetailsPage(pageName) {
        await this.addPageIcon.click();
        await this.page.waitForLoadState('load');
        await this.nameField.fill(pageName);
        await this.pageEditorSaveButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async editJobDetailsPage(existingName, updatedName) {
        await this.editPageIcon(existingName).click();
        await this.page.waitForLoadState('load');
        await this.nameField.fill(updatedName);
        await this.pageEditorSaveButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async cloneJobDetailsPage(sourceName, cloneName) {
        await this.clonePageIcon(sourceName).click();
        await this.page.waitForLoadState('load');
        await this.nameField.fill(cloneName);
        await this.pageEditorSaveButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async publishJobDetailsPage(pageName) {
        await this.publishPageIcon(pageName).click();
        await this.publishConfirmButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async deleteJobDetailsPage(pageName) {
        await this.deletePageIcon(pageName).click();
        await this.deleteConfirmButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    // [C176] View — opens the read-only "View Live Job Details Page".
    async viewJobDetailsPage(pageName) {
        await this.viewPageIcon(pageName).click();
        await this.page.waitForLoadState('load');
    }
}

module.exports = FeeAgencyJobDetailsPage;
