const BasePage = require('../base.page.js');

class JobsEllipsisActionsPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

         this.jobsMenuItem = this.page.getByLabel('Jobs', { exact: true });
         this.jobTrackingMenuItem = this.page.getByText('Job Tracking', { exact: true });
         this.ellipsisLink = this.page.locator('.oh__icon-button > div > .fas');
         this.columnsLink = this.page.getByRole('link', { name: 'Columns' });
         this.allLocationsColumn = this.page.getByText('All Locations');
         this.businessUnitColumn = this.page.locator('#configurableColumnbusinessUnit').getByText('Business Unit');
         this.cityColumn = this.page.locator('#configurableColumncity').getByText('City');
         this.applyColumnButton = this.page.locator('#configurableColumnsModalApply');
         this.tableHeading = this.page.locator('table thead tr');
         this.saveSearchAsLink = this.page.getByRole('link', { name: 'Save Search As' });
         this.nameField = this.page.getByLabel('Name');
         this.saveButton = this.page.locator('#saveSearchModalSave');
         this.mySearchesLink = this.page.getByRole('link', { name: 'My Searches', exact: true });
         this.manageMySearchesLink = this.page.getByRole('link', { name: 'Manage my searches' });
         this.manageMySearchesSaveButton = this.page.locator('#manageSavedSearchesModalSave');
         this.basicSearchLink = this.page.getByRole('link', { name: 'Basic Searches' });
         this.basicSearchJobsLink = this.page.locator('#savedSearch_1');

         // Pipeline column (Kiwi/TestRail case calls it "Prospects"; the app labels it
         // "Pipeline" in both the Configure Columns modal and the resulting table header
         // — data-code is still prospectCount).
         this.pipelineColumnOption = this.page.locator('#configurableColumnprospectCount').getByText('Pipeline', { exact: true });
         this.pipelineColumnHeader = this.page.getByRole('columnheader', { name: 'Pipeline' });

         this.exportSearchResultsLink = this.page.getByRole('link', { name: 'Export Search Results' });
         this.exportDownloadButton = this.page.locator('#exportSearchResultsModalButtonPrimary');

         // All available (unselected-by-default) columns in the Columns modal
         this.availableColumnIds = [
             'allLocations', 'businessUnit', 'city', 'closedDate', 'country', 'createDate', 'daysOld',
             'department', 'isEvergreen', 'farthestStageName', 'hiringManager', 'lastHireDate', 'modifiedDate',
             'originalPostedDate', 'positionsFilledCountOfAvailable', 'positionType', 'postingDate',
             'externalJobTitleForDisplay', 'priority', 'prospectCount', 'recruiter', 'recruitingManager',
             'reviewRequestCountOfCompleted', 'region', 'isActive', 'workflowName',
         ];

    }

    async navigateToJobTrackingPage() {
        await this.jobsMenuItem.click();
        await this.jobTrackingMenuItem.click();
        await this.page.waitForLoadState('load');
    }

    async addColumns(){
        await this.ellipsisLink.click();
        await this.columnsLink.click();
        await this.allLocationsColumn.click();
        await this.businessUnitColumn.click();
        await this.cityColumn.click();
        await this.applyColumnButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async addAllAvailableColumns(){
        await this.ellipsisLink.click();
        await this.columnsLink.click();
        await this.applyColumnButton.waitFor({ state: 'visible', timeout: 10000 });
        for (const columnId of this.availableColumnIds) {
            await this.page.locator(`#configurableColumn${columnId}`).click();
        }
        await this.applyColumnButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async exportSearchResults(){
        await this.ellipsisLink.click();
        await this.exportSearchResultsLink.click();
        const downloadPromise = this.page.waitForEvent('download');
        await this.exportDownloadButton.click();
        return await downloadPromise;
    }

    async saveSearch(name){
        await this.ellipsisLink.click();
        await this.saveSearchAsLink.click();
        await this.nameField.fill(name);
        await this.saveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getPageHeading(heading){
        return this.page.getByRole('heading', { name: heading, level: 1 });
    }

    async mySearches(name){
        await this.ellipsisLink.click();
        await this.mySearchesLink.click();
        await this.page.locator('a', { hasText: name }).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async manageMySearches(name){
        await this.ellipsisLink.click();
        await this.manageMySearchesLink.click();
        await this.page.locator('.control-group', { hasText: name }).locator('input[type="checkbox"]').check();
        await this.manageMySearchesSaveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // Returns whether the Pipeline column option was available and got added. When the
    // EnableGenerativeAIOutreach feature flag is off for the logged-in user, the option
    // is absent from the modal and this closes it without changing anything.
    async addPipelineColumnIfAvailable(){
        await this.ellipsisLink.click();
        await this.columnsLink.click();
        await this.applyColumnButton.waitFor({ state: 'visible', timeout: 10000 });
        if (!(await this.pipelineColumnOption.isVisible().catch(() => false))) {
            await this.page.keyboard.press('Escape');
            return false;
        }
        await this.pipelineColumnOption.click();
        await this.applyColumnButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        return true;
    }

    async getFirstPipelineCellLink(){
        const headers = await this.page.locator('table thead tr th, table thead tr td').allTextContents();
        const colIndex = headers.findIndex((h) => h.trim() === 'Pipeline');
        if (colIndex === -1) throw new Error('Pipeline column not found in table header');
        return this.page.locator('table tbody tr').first().locator(`td:nth-child(${colIndex + 1}) a`);
    }

    async basicSearch(){
        await this.ellipsisLink.click();
        await this.basicSearchLink.click();
        await this.basicSearchJobsLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}

module.exports = JobsEllipsisActionsPage;
