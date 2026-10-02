const BasePage = require('../base.page.js');

class HomepageAnalyticsPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        // Dashboard
        this.analyticsOverviewHeading = this.page.getByRole('heading', { name: 'Analytics Overview' });
        // Every tile and chart carries an MUI InfoIcon whose aria-label holds its tooltip text
        this.infoIcons = this.page.locator('#main svg[data-testid="InfoIcon"]');
        this.tooltip = this.page.getByRole('tooltip');

        // Filters (react-dropdown, not native selects)
        this.workflowDropdown = this.page.locator('.Dropdown-root', { hasText: 'Workflow' });
        this.jobsCreatedSinceDropdown = this.page.locator('.Dropdown-root', { hasText: 'Jobs created since' });
        // Native select, only shown to Recruiting Managers; changing it submits the form (full reload)
        this.viewAsRecruiterDropdown = this.page.getByLabel('View as Recruiter:');

        // Candidate Pool (where tile clicks land)
        this.candidatePoolHeading = this.page.getByRole('heading', { name: 'Candidate Pool' });
        this.candidateSearchCriteria = this.page.locator('#main');
    }

    // Waits on the dashboard's own data request rather than networkidle, which never settles on
    // this page (background requests keep firing) and timed out the fixture in headless runs.
    async loginToDashboard(username, password) {
        const dashboardLoaded = this.waitForDashboardReload();
        await this.login(username, password);
        await dashboardLoaded;
        await this.analyticsOverviewHeading.waitFor();
    }

    getTile(label) {
        return this.page.locator('.rival-dashboard-card')
            .filter({ has: this.page.locator('.rival-dashboard-card-label').getByText(label, { exact: true }) });
    }

    getTileInfoIcon(label) {
        return this.getTile(label).locator('svg[data-testid="InfoIcon"]');
    }

    // MUI tooltips fade out, so the previous icon's tooltip can still be in the DOM when the next
    // opens; match by text rather than the bare getByRole('tooltip') (strict-mode violation).
    getTooltip(text) {
        return this.tooltip.filter({ hasText: text });
    }

    async hoverInfoIcon(icon) {
        await icon.scrollIntoViewIfNeeded();
        await icon.hover();
    }

    // A filter change refetches every widget; the Hires count request stands in for the reload.
    waitForDashboardReload(viewAsRecruiterId) {
        return this.page.waitForResponse(response =>
            response.url().includes('fuseaction=rest.rivalDashboardCounts') && response.url().includes('code=hires')
            && (!viewAsRecruiterId || response.url().includes(`viewAsRecruiterId=${viewAsRecruiterId}`)));
    }

    // Selected by option value: the same name can appear more than once (e.g. several "Susan Harris").
    async selectViewAsRecruiter(recruiterId) {
        const reload = this.waitForDashboardReload(recruiterId);
        await this.viewAsRecruiterDropdown.selectOption(recruiterId);
        await this.page.waitForURL(new RegExp(`viewAsRecruiterId=${recruiterId}`));
        return reload;
    }

    async selectWorkflow(workflow) {
        const reload = this.waitForDashboardReload();
        await this.workflowDropdown.click();
        await this.workflowDropdown.getByRole('option', { name: workflow, exact: true }).click();
        return reload;
    }

    // Options are relative to today (12/6/3/1 months back), so they're picked by position.
    // Scoped to the dropdown: for Recruiting Managers the page also has the View as Recruiter
    // <select>, whose <option>s a page-wide getByRole('option') would match first.
    async selectJobsCreatedSince(optionIndex) {
        const reload = this.waitForDashboardReload();
        await this.jobsCreatedSinceDropdown.click();
        await this.jobsCreatedSinceDropdown.getByRole('option').nth(optionIndex).click();
        return reload;
    }

    async getJobsCreatedSinceStartDate() {
        const label = await this.jobsCreatedSinceDropdown.innerText();
        return label.replace('Jobs created since', '').trim();
    }

    // Tiles redirect to Candidate Pool (search.resumes). Waits on that URL rather than networkidle,
    // which can hang while still on the dashboard (see loginToDashboard).
    async clickTile(label) {
        await this.getTile(label).click();
        await this.page.waitForURL(/fuseaction=search\.resumes/);
        await this.page.waitForLoadState('load');
    }
}

module.exports = HomepageAnalyticsPage;
