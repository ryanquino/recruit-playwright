const BasePage = require('../base.page.js');

class JobTrackingPage extends BasePage {
    constructor(page, candidateData) {
        super(page);
        this.page = page;
        this.data = candidateData;

        this.uniqueJobCategoryName = `playwright automation ${Date.now()}`;

         // Define all locators
         this.jobsMenuItem = this.page.getByLabel('Jobs', { exact: true });
         this.jobTrackingMenuItem = this.page.getByText('Job Tracking', { exact: true });
         this.editSearchLink = this.page.getByText('Edit Search');
         this.clearFiltersButton = this.page.getByRole('button', { name: 'Clear Filters' });
         this.jobTitleOrCodeField = this.page.getByLabel('Job Title or Code');
         this.jobStatusDropdown = this.page.getByLabel('Job Status');
         this.postingStatusDropdown = this.page.locator('#postingStatus_input');
         this.companyLocationDropdown = this.page.locator('#companyLocationId_input');
         this.additionalLocationDropdown = this.page.locator('#additionalCompanyLocationId_input');
         this.hiringStageDropdown = this.page.locator('#hiringStageId_input');
         this.postedDateField = this.page.getByLabel('Posted Date');
         this.endPostingDateField = this.page.locator('#postingDateEnd');
         this.recruitingManagerDropdown = this.page.locator('#recruitingManagerId_input');
         this.sortByDropdown = this.page.getByLabel('Sort By');
         this.sortDirectionDropdown = this.page.locator('#sortByDirection');
         this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
         this.postingDateStart = this.page.locator('input[name="postingDateStart"]');
         this.resultsFound = this.page.locator('#bulkActionItemsRecordCount');

         // Sortable result columns
         this.internalJobTitleColumnHeader = this.page.getByRole('columnheader', { name: 'Internal Job Title' });
         this.trackingCodeColumnHeader = this.page.getByRole('columnheader', { name: 'Tracking Code' });
         this.locationColumnHeader = this.page.getByRole('columnheader', { name: 'Location' });
         this.postingStatusColumnHeader = this.page.getByRole('columnheader', { name: 'Posting Status' });
    }

    async navigateToJobTrackingPage() {
        await this.jobsMenuItem.click();
        await this.jobTrackingMenuItem.click();
        await this.page.waitForLoadState('load');
    }

    async applySearchFilters(jobFilter, filterType){
        await this.editSearchLink.click();
        await this.clearFiltersButton.click();
        switch(filterType){
            case 'jobTitle':
                await this.jobTitleOrCodeField.fill(jobFilter.jobTitleOrCode);
                break;
            case 'status':
                await this.jobStatusDropdown.selectOption(jobFilter.jobStatus);
                break;
            case 'postingStatus':
                await this.postingStatusDropdown.click();
                await this.postingStatusDropdown.fill(jobFilter.postingStatus);
                await this.postingStatusDropdown.press('ArrowDown');
                await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
                await this.page.getByRole('menuitem', { name: jobFilter.postingStatus }).click();
                
                break;
            case 'primaryLocation':
                await this.companyLocationDropdown.click();
                await this.companyLocationDropdown.fill(jobFilter.primaryLocation);
                await this.companyLocationDropdown.press('ArrowDown');
                await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
                await this.page.getByRole('menuitem', { name: jobFilter.primaryLocation }).click();           
                break;
            case 'additionalLocation':
                await this.additionalLocationDropdown.click();
                await this.additionalLocationDropdown.fill(jobFilter.additionalLocations);
                await this.additionalLocationDropdown.press('ArrowDown');
                await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
                await this.page.getByRole('menuitem', { name: jobFilter.additionalLocations }).click();          
                break;
            case 'currentStage':
                await this.hiringStageDropdown.click();
                await this.hiringStageDropdown.fill(jobFilter.currentStage);
                await this.hiringStageDropdown.press('ArrowDown');
                await this.page.getByRole('menuitem', { name: jobFilter.currentStage }).click();
                break;
            case 'postedDate':
                const datePickerInput = this.postingDateStart;
                await datePickerInput.fill(jobFilter.postedDateStart);
                const today = new Date();
                const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
                await this.page.fill('#postingDateEnd', formattedDate);
                break;
            case 'recruitingManager':
                await this.recruitingManagerDropdown.click();
                await this.recruitingManagerDropdown.fill(jobFilter.recruitingManager);
                await this.recruitingManagerDropdown.press('ArrowDown');
                await this.page.getByRole('menuitem', { name: jobFilter.recruitingManager }).click();
                break;
            case 'sortBy':
                await this.sortByDropdown.selectOption(jobFilter.sortBy);
                await this.sortDirectionDropdown.selectOption(jobFilter.sortByAscDesc);
                break;
                
        }
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    // Search filters/results-per-page persist server-side per account, so a preceding
    // test's filter state can leak into this one even with a fresh browser session.
    // Clearing filters normalizes to a known base view before asserting on sort order.
    async resetToDefaultView() {
        await this.editSearchLink.click();
        await this.clearFiltersButton.click();
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async sortByColumnHeader(columnHeaderLocator) {
        await columnHeaderLocator.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getColumnValues(columnHeaderName) {
        const headerCells = await this.page.locator('table thead tr th, table thead tr td').allTextContents();
        const colIndex = headerCells.findIndex((h) => h.trim() === columnHeaderName);
        if (colIndex === -1) throw new Error(`Column "${columnHeaderName}" not found in table header`);
        return this.page.locator(`table tbody tr td:nth-child(${colIndex + 1})`).allTextContents();
    }

}

module.exports = JobTrackingPage;
