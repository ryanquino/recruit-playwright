const CxAdminBasePage = require('./cx-admin-base.page');

class CareerPortalOpenSubmissionPage extends CxAdminBasePage {
    constructor(page) {
        super(page);

        // Manage Open Submission Form page locators — live-verified
        // (2026-08-27) via full-page aria snapshot against
        // /playwrightqa/admin/JobBoards/OpenSubmissionForms?portalId=2577.
        // Same panel/radio mechanism as career-portal-application-form.page.js's
        // Quick Apply / Configured Form choice, just for Open Submission.
        this.pageHeading = this.page.getByRole('heading', { name: 'Manage Open Submission Form', exact: true });
        this.allowOpenSubmissionsSwitch = this.page.getByRole('switch', { name: 'Allow Open Submissions' });
        this.quickApplyRadio = this.page.getByRole('radio', { name: 'Quick Apply (First Name, Last Name, Email, Resume/CV)' });
        this.useConfiguredFormRadio = this.page.getByRole('radio', { name: 'Use the configured open submission form below (If no open submission form is configured, Quick Apply will be used)' });
        this.saveButton = this.page.getByRole('button', { name: 'Save' });
        this.addFormLink = this.page.getByTitle('Add open submission form');

        // Configured form editor locators (Add/Edit/Clone English Draft
        // Open Submission Form page) — live-verified (2026-08-27).
        this.formNameField = this.page.getByLabel('* Name', { exact: true });
        this.formDescriptionField = this.page.getByLabel('Description (Only displayed internally)');
        this.formEditorSaveButton = this.page.getByRole('button', { name: 'Save' });

        // Publish confirmation modal locators
        this.publishConfirmButton = this.page.getByRole('button', { name: 'Publish', exact: true });
    }

    async goToOpenSubmissionPage(portalId) {
        this.portalId = portalId;
        await this.page.goto(`${this.cxAdminBaseUrl}/playwrightqa/admin/JobBoards/OpenSubmissionForms?portalId=${portalId}`);
        await this.page.waitForLoadState('load');
    }

    // Saving the radio choice redirects back to the portal's Career Site
    // Settings TOC (same behavior as career-portal-application-form.page.js),
    // so re-navigate here afterward to confirm the choice persisted.
    async selectQuickApply() {
        await this.quickApplyRadio.check();
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.goToOpenSubmissionPage(this.portalId);
    }

    async selectConfiguredForm() {
        await this.useConfiguredFormRadio.check();
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.goToOpenSubmissionPage(this.portalId);
    }

    // [C115] Enable Allow Open Submissions — the switch above the Quick
    // Apply / Configured Form radio group that governs whether candidates
    // can submit an application without applying to a specific job at all.
    // Live-verified (2026-09-10): unlike the radio choice, toggling this
    // doesn't hide the rest of the page (the radio group and configured
    // forms list stay visible either way) — it's a plain switch sharing
    // the same Save button, which redirects to the Career Site Settings
    // TOC just like selectQuickApply()/selectConfiguredForm(), so
    // re-navigate here afterward too.
    async disableAllowOpenSubmissions() {
        await this.allowOpenSubmissionsSwitch.uncheck();
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.goToOpenSubmissionPage(this.portalId);
    }

    async enableAllowOpenSubmissions() {
        await this.allowOpenSubmissionsSwitch.check();
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.goToOpenSubmissionPage(this.portalId);
    }

    formPanel(formName) {
        return this.page.locator('.sr-panel').filter({ has: this.page.getByText(formName, { exact: true }) });
    }

    async createConfiguredForm(formName) {
        await this.addFormLink.click();
        await this.page.waitForLoadState('load');
        await this.formNameField.fill(formName);
        await this.formEditorSaveButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    // [C119] Edit — updates the (internal-only) Description field and
    // saves; caller re-opens the editor afterward to confirm persistence.
    async editFormDescription(formName, description) {
        await this.formPanel(formName).getByTitle('Edit application form').click();
        await this.page.waitForLoadState('load');
        await this.formDescriptionField.fill(description);
        await this.formEditorSaveButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async openFormEditor(formName) {
        await this.formPanel(formName).getByTitle('Edit application form').click();
        await this.page.waitForLoadState('load');
    }

    // [C120] Clone — clone pre-fills Name with the source form's name, so
    // rename it to keep panels distinguishable.
    async cloneForm(formName, cloneName) {
        await this.formPanel(formName).getByTitle('Clone application form').click();
        await this.page.waitForLoadState('load');
        await this.formNameField.fill(cloneName);
        await this.formEditorSaveButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    // [C121] Publish — confirms the "Publish Open Submission Form" modal.
    // Once published, the panel's Edit/Clone/Delete icons are replaced by
    // a single "View application form" (visibility) icon.
    async publishForm(formName) {
        await this.formPanel(formName).getByTitle('Publish application form').click();
        await this.publishConfirmButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    // [C122] View — opens the read-only "View Live Application Form" page
    // for a published form.
    async viewPublishedForm(formName) {
        await this.formPanel(formName).getByTitle('View application form').click();
        await this.page.waitForLoadState('load');
    }
}

module.exports = CareerPortalOpenSubmissionPage;
