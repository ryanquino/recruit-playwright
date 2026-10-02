class CareerPortalJobDetailsPage {
    constructor(page) {
        this.page = page;
        this.cxAdminBaseUrl = (process.env.CX_BASE_URL || 'https://qa-recruiting-cx.silkroad-eng.com/').replace(/\/$/, '');

        // Login locators (separate CX "Career Site" admin app, not the ATS
        // backend — reached at /playwrightqa/Admin, same pattern as
        // CareerPortalApplicationFormPage / FeeAgencyJobDetailsPage)
        this.loginField = this.page.getByLabel('Login');
        this.passwordField = this.page.getByLabel('Password');
        this.signInButton = this.page.getByRole('button', { name: 'Sign In' });

        // Manage Job Details Page locators
        this.pageHeading = this.page.getByRole('heading', { name: 'Manage Job Details Page', exact: true });
        this.viewLiveHeading = this.page.getByRole('heading', { name: 'View Live Job Details Page' });
        // [C163] "Hide 'Search jobs by keywords' bar on Job Details page"
        this.hideJobSearchBarToggle = this.page.locator('#Admin_JobListings__HideJobDetailsJobSearch');
        this.saveButton = this.page.getByRole('button', { name: 'Save' });
        // Job Location Details section — "Job Location" Format dropdown.
        // Live-verified 2026-09-23: distinct from, and NOT the same setting
        // as, CareerPortalJobListPage's Job Location Format (that one lives
        // under "Manage Job List" and only affects the job list/search
        // results cards — changing it has zero effect on this Job Details
        // page's own location text, even after 75+ seconds). This one has
        // a "Default" option (value 0) the Job List dropdown doesn't.
        this.jobLocationFormatDropdown = this.page.locator('#Admin_JobListings__JobLocationOptions');
        // This portal now has multiple configured languages (English,
        // German), each with its own "add" icon under its own heading —
        // scope to English specifically instead of the ambiguous
        // page-wide getByTitle (re-verified 2026-08-31: getByTitle matches
        // one per language).
        this.addPageIcon = this.page.getByRole('heading', { name: 'English' }).getByRole('link', { name: 'add' });

        // Page editor locators (Add/Edit/Clone form)
        this.nameField = this.page.getByLabel('Name');
        this.pageEditorSaveButton = this.page.getByRole('button', { name: 'Save' });

        // Publish/Delete/Archive confirmation drawer buttons — live-verified
        // (2026-08-27) this is a side drawer with its own confirm button,
        // same as FeeAgencyJobDetailsPage's publish/delete drawer, not the
        // shared #Admin_JobBoards_ApplicationForms_Modal_Primary_Button
        // modal CareerPortalApplicationFormPage uses.
        this.publishConfirmButton = this.page.getByRole('button', { name: 'Publish' });
        this.deleteConfirmButton = this.page.getByRole('button', { name: 'Delete' });
        this.archiveConfirmButton = this.page.getByRole('button', { name: 'Archive' });

        // [C163] Candidate-facing verification — same portal, same page,
        // switching from the admin app to the live career site to confirm
        // the toggle's effect. Mirrors ApplicationFormPage mixing CX
        // candidate-side and ATS admin-side methods on one page object.
        this.candidateJobSearchBox = this.page.getByRole('searchbox', { name: 'Job Search' });

        // [TC-31348] Manage Indeed Integrations
        // (/playwrightqa/admin/JobBoards/IndeedIntegrations) — both switches
        // must be ON before "Apply with Indeed" renders on the candidate
        // Job Details page. Live-verified 2026-09-30: the Kiwi case's
        // "Enable Mobile Apply From Indeed Job Feed (Easily Apply)" is
        // labelled "Enable Indeed Easily Apply" in the admin UI today.
        this.applyWithIndeedToggle = this.page.getByRole('switch', { name: 'Enable Apply with Indeed' });
        this.indeedEasilyApplyToggle = this.page.getByRole('switch', { name: 'Enable Indeed Easily Apply' });
    }

    pagePanel(pageName) {
        return this.page.locator('.sr-panel').filter({ has: this.page.getByText(pageName, { exact: true }) });
    }

    publishPageIcon(pageName) {
        return this.pagePanel(pageName).getByTitle('Publish job details page');
    }

    deletePageIcon(pageName) {
        return this.pagePanel(pageName).getByTitle('Delete job details page');
    }

    viewPageIcon(pageName) {
        return this.pagePanel(pageName).getByTitle('View job details page');
    }

    archivePageIcon(pageName) {
        return this.pagePanel(pageName).getByTitle('Archive job details page');
    }

    pageStatusText(pageName) {
        return this.pagePanel(pageName).locator('.info');
    }

    async login() {
        await this.page.goto(`${this.cxAdminBaseUrl}/playwrightqa/Admin`);
        await this.loginField.fill(process.env.USERNAME);
        await this.passwordField.fill(process.env.PASSWORD);
        await this.signInButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async goToJobDetailsPage(portalId) {
        this.portalId = portalId;
        await this.page.goto(`${this.cxAdminBaseUrl}/playwrightqa/admin/JobBoards/JobListings?portalId=${portalId}`);
        await this.page.waitForLoadState('load');
    }

    async createJobDetailsPage(pageName) {
        await this.addPageIcon.click();
        await this.page.waitForLoadState('load');
        await this.nameField.fill(pageName);
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

    async archiveJobDetailsPage(pageName) {
        await this.archivePageIcon(pageName).click();
        await this.archiveConfirmButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async viewJobDetailsPage(pageName) {
        await this.viewPageIcon(pageName).click();
        await this.page.waitForLoadState('load');
    }

    // [C163] toggle is a checkbox-styled switch; the visible control isn't
    // considered "stable" by Playwright's actionability checks, so this
    // clicks with force like the live-verified probe (2026-08-27).
    async setHideJobSearchBar(hide) {
        const isChecked = await this.hideJobSearchBarToggle.isChecked();
        if (isChecked !== hide) {
            await this.hideJobSearchBarToggle.click({ force: true });
        }
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /** @returns {Promise<{value: string, label: string, selected: boolean}[]>} */
    async getJobLocationFormatOptions() {
        return this.jobLocationFormatDropdown.locator('option').evaluateAll(
            (/** @type {HTMLOptionElement[]} */ els) => els.map(o => ({ value: o.value, label: o.textContent?.trim() ?? '', selected: o.selected }))
        );
    }

    async setJobLocationFormat(format) {
        const [value] = await this.jobLocationFormatDropdown.selectOption({ label: format });
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.goToJobDetailsPage(this.portalId);
        return value;
    }

    async goToIndeedIntegrationsPage(portalId) {
        await this.page.goto(`${this.cxAdminBaseUrl}/playwrightqa/admin/JobBoards/IndeedIntegrations?portalId=${portalId}`);
        await this.page.waitForLoadState('networkidle');
    }

    // Sets both Indeed switches ON or OFF (no-op for any already in that
    // state) and saves.
    async setIndeedIntegrations(enabled) {
        await this.applyWithIndeedToggle.setChecked(enabled);
        await this.indeedEasilyApplyToggle.setChecked(enabled);
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async goToCandidateJobDetails(jobTitle) {
        await this.page.goto(`${this.cxAdminBaseUrl}/playwrightqa/CorporateCareerPortal`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(`a.sr-panel:has(.sr-panel__title:has-text("${jobTitle.replace(/"/g, '\\"')}"))`);
        await this.page.waitForLoadState('domcontentloaded');
    }
}

module.exports = CareerPortalJobDetailsPage;
