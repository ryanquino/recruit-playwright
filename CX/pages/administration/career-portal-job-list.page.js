const CxAdminBasePage = require('./cx-admin-base.page');

class CareerPortalJobListPage extends CxAdminBasePage {
    constructor(page) {
        super(page);

        // Manage Job List locators
        this.pageHeading = this.page.getByRole('heading', { name: 'Manage Job List', exact: true });
        // TinyMCE rich text editor — live-verified (2026-08-27) the iframe
        // is named "Admin_JobList__RichText_ifr"; its <body> is the
        // editable surface.
        this.richTextFrame = this.page.frameLocator('#Admin_JobList__RichText_ifr');
        this.richTextBody = this.richTextFrame.locator('body');
        this.showRichTextDropdown = this.page.getByLabel('Show Rich Text');
        this.saveButton = this.page.getByRole('button', { name: 'Save' });

        // Display Options section — live-verified (getByLabel resolves real
        // <select> elements: Admin_JobList__JobListOrderBy etc.). The page's
        // own help text says Order By / Results Per Page only take effect
        // when Group By is "Nothing" — grouped job lists are always
        // alphabetical within each group instead.
        this.groupByDropdown = this.page.getByLabel('Group By');
        this.orderByDropdown = this.page.getByLabel('Order By');
        this.resultsPerPageDropdown = this.page.getByLabel('Results Per Page');

        // Candidate-facing job listing (playwrightqa/CorporateCareerPortal)
        // — same locator jobs-list.page.js uses for the corporate career
        // site's job cards.
        this.candidateJobListings = this.page.locator('article.sr-search__section');

        // Job Location Details / Job Search Filters sections — live-verified
        // (2026-08-27) via full-page aria snapshot: real <select> and
        // role=switch elements.
        this.jobLocationFormatDropdown = this.page.getByLabel('Job Location Format');
        this.displayLocationCountSwitch = this.page.getByLabel('Display count of additional locations');
        this.collapseSearchFiltersSwitch = this.page.getByLabel('Collapse search filter section by default');
        this.searchByLocationSwitch = this.page.getByLabel('Search jobs by Location');
        this.searchByCategorySwitch = this.page.getByLabel('Search jobs by category');
        this.searchByPositionTypeSwitch = this.page.getByLabel('Search jobs by position type');
    }

    async goToJobListPage(portalId) {
        this.portalId = portalId;
        await this.page.goto(`${this.cxAdminBaseUrl}/playwrightqa/admin/JobBoards/JobList?portalId=${portalId}`);
        await this.page.waitForLoadState('load');
    }

    async setRichText(text) {
        await this.richTextBody.click();
        await this.richTextBody.fill(text);
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.goToJobListPage(this.portalId);
    }

    async setRichTextPosition(position) {
        await this.showRichTextDropdown.selectOption({ label: position });
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.goToJobListPage(this.portalId);
    }

    // Cleanup — clears the rich text field back to empty so this shared
    // portal setting doesn't carry leftover test content, same convention
    // as career-portal-application-form-toggle.spec.js's C155/C156 restore.
    async clearRichText() {
        await this.richTextBody.click();
        await this.richTextBody.fill('');
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async setGroupBy(option) {
        const [value] = await this.groupByDropdown.selectOption({ label: option });
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.goToJobListPage(this.portalId);
        return value;
    }

    // Order By only renders/applies once Group By is "Nothing" — grouped
    // lists are always alphabetical within each group. Forces that
    // precondition first so this is safe to call on its own.
    async setOrderBy(option) {
        await this.groupByDropdown.selectOption({ label: 'Nothing' });
        const [value] = await this.orderByDropdown.selectOption({ label: option });
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.goToJobListPage(this.portalId);
        return value;
    }

    // Same "Group By must be Nothing" precondition as setOrderBy().
    async setResultsPerPage(count) {
        await this.groupByDropdown.selectOption({ label: 'Nothing' });
        const [value] = await this.resultsPerPageDropdown.selectOption({ label: String(count) });
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.goToJobListPage(this.portalId);
        return value;
    }

    async goToCandidateJobListPage() {
        await this.page.goto(`${this.cxAdminBaseUrl}/playwrightqa/CorporateCareerPortal`);
        await this.page.waitForLoadState('domcontentloaded');
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
        await this.goToJobListPage(this.portalId);
        return value;
    }

    // Shared toggle helper for the role=switch controls on this page —
    // only clicks if the switch isn't already in the desired state, so
    // callers get an idempotent "set to X" instead of a blind toggle.
    async setSwitch(switchLocator, checked) {
        const current = await switchLocator.getAttribute('aria-checked');
        if ((current === 'true') !== checked) {
            await switchLocator.click();
        }
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.goToJobListPage(this.portalId);
    }

    async setDisplayLocationCount(checked) {
        await this.setSwitch(this.displayLocationCountSwitch, checked);
    }

    async setCollapseSearchFilters(checked) {
        await this.setSwitch(this.collapseSearchFiltersSwitch, checked);
    }

    async setSearchByLocation(checked) {
        await this.setSwitch(this.searchByLocationSwitch, checked);
    }

    async setSearchByCategory(checked) {
        await this.setSwitch(this.searchByCategorySwitch, checked);
    }

    async setSearchByPositionType(checked) {
        await this.setSwitch(this.searchByPositionTypeSwitch, checked);
    }
}

module.exports = CareerPortalJobListPage;
