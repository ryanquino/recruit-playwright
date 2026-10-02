class CareerPortalApplicationFormPage {
    constructor(page) {
        this.page = page;
        this.cxAdminBaseUrl = (process.env.CX_BASE_URL || 'https://qa-recruiting-cx.silkroad-eng.com/').replace(/\/$/, '');

        // Login locators (this is the separate CX "Career Site" admin app,
        // not the ATS backend — reached at /playwrightqa/Admin)
        this.loginField = this.page.getByLabel('Login');
        this.passwordField = this.page.getByLabel('Password');
        this.signInButton = this.page.getByRole('button', { name: 'Sign In' });

        // Application Form settings page locators
        this.pageHeading = this.page.getByRole('heading', { name: 'Manage Application Form', exact: true });
        this.viewFormHeading = this.page.getByRole('heading', { name: 'View Live Application Form' });
        this.quickApplyRadio = this.page.getByRole('radio', { name: 'Quick Apply (First Name, Last Name, Email, Resume/CV)' });
        this.useConfiguredFormRadio = this.page.getByRole('radio', { name: 'Use the configured application form below (If no application form is configured, Quick Apply will be used)' });
        this.saveButton = this.page.getByRole('button', { name: 'Save' });
        this.addFormLink = this.page.getByTitle('Add application form');

        // Configured form editor locators
        this.formNameField = this.page.getByLabel('Name');
        this.formEditorSaveButton = this.page.getByRole('button', { name: 'Save' });

        // Confirmation modal (used for publish/delete)
        this.modalConfirmButton = this.page.locator('#Admin_JobBoards_ApplicationForms_Modal_Primary_Button');
    }

    formPanel(formName) {
        // Exact match — "hasText" substring matching would also match e.g.
        // "PW Application Form CRUD (View)" for formName "PW Application
        // Form CRUD".
        return this.page.locator('.sr-panel').filter({ has: this.page.getByText(formName, { exact: true }) });
    }

    editFormIcon(formName) {
        return this.formPanel(formName).getByTitle('Edit application form');
    }

    cloneFormIcon(formName) {
        return this.formPanel(formName).getByTitle('Clone application form');
    }

    publishFormIcon(formName) {
        return this.formPanel(formName).getByTitle('Publish application form');
    }

    deleteFormIcon(formName) {
        return this.formPanel(formName).getByTitle('Delete application form');
    }

    viewFormIcon(formName) {
        return this.formPanel(formName).getByTitle('View application form');
    }

    formStatusText(formName) {
        return this.formPanel(formName).locator('.info');
    }

    async login() {
        if (!process.env.USERNAME || !process.env.PASSWORD) {
            throw new Error('USERNAME and PASSWORD environment variables must be set to log in to the CX Admin app');
        }
        await this.page.goto(`${this.cxAdminBaseUrl}/playwrightqa/Admin`);
        await this.loginField.fill(process.env.USERNAME);
        await this.passwordField.fill(process.env.PASSWORD);
        await this.signInButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async goToApplicationFormPage(portalId) {
        this.portalId = portalId;
        await this.page.goto(`${this.cxAdminBaseUrl}/playwrightqa/admin/JobBoards/ApplicationForms?PortalId=${portalId}`);
        await this.page.waitForLoadState('load');
    }

    // Saving the Quick Apply / Configured Form radio choice redirects back
    // to the portal's Career Site Settings TOC (not back to this page), so
    // re-navigate here afterward to confirm the choice persisted.
    async selectQuickApply() {
        await this.quickApplyRadio.check();
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.goToApplicationFormPage(this.portalId);
    }

    async selectConfiguredForm() {
        await this.useConfiguredFormRadio.check();
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.goToApplicationFormPage(this.portalId);
    }

    async createConfiguredForm(formName) {
        await this.addFormLink.click();
        await this.page.waitForLoadState('load');
        await this.formNameField.fill(formName);
        await this.formEditorSaveButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async editConfiguredForm(existingName, updatedName) {
        await this.editFormIcon(existingName).click();
        await this.page.waitForLoadState('load');
        await this.formNameField.fill(updatedName);
        await this.formEditorSaveButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async cloneConfiguredForm(sourceName, cloneName) {
        await this.cloneFormIcon(sourceName).click();
        await this.page.waitForLoadState('load');
        await this.formNameField.fill(cloneName);
        await this.formEditorSaveButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async publishConfiguredForm(formName) {
        await this.publishFormIcon(formName).click();
        await this.modalConfirmButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.modalConfirmButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async deleteConfiguredForm(formName) {
        await this.deleteFormIcon(formName).click();
        await this.modalConfirmButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.modalConfirmButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async viewConfiguredForm(formName) {
        await this.viewFormIcon(formName).click();
        await this.page.waitForLoadState('load');
    }
}

module.exports = CareerPortalApplicationFormPage;
