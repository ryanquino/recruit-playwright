const BasePage = require('../base.page.js');

class CandidatesPoolPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        //Candidate Pool locators
        this.candidateNavLocator = this.page.getByLabel('Candidates', { exact: true });
        this.candidatePoolNavLocator = this.page.getByLabel('Candidate Pool');
        this.editSearchButton = this.page.getByText('Edit Search');
        this.candidateNameField = this.page.getByLabel('Candidate Name');
        this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
        this.clearFiltersButton = this.page.getByRole('button', { name: 'Clear Filters' });
        this.recruitingManagerField = this.page.locator('#recruitingManagerId_input');
        this.enteredLastField = this.page.getByLabel('Entered in the last');
        this.dateIntervalDropdown = this.page.locator('#createdDateIntervalType');
        this.startDateField = this.page.getByLabel('Enter Date');
        this.endDateField = this.page.locator('#createdDateEnd');
        this.hiringStageField = this.page.locator('#hiringStageId_input');
        this.countryField = this.page.locator('#countryCode_input');
        this.regionField = this.page.locator('#regionCode_input');
        this.sortDirectionDropdown = this.page.locator('#sortByDirection');
        this.tableRowCounter = this.page.locator('#bulkActionItemResultsTable tbody tr');
        this.columnButtonModal = this.page.getByRole('link', { name: '' });
        this.recruitingManagerColumn = this.page.locator('[data-code="recruitingManager"]');
        this.countryColumn = this.page.locator('[data-code="country"]');
        this.stateColumn = this.page.locator('[data-code="region"]');
        this.applyColumnButton = this.page.locator('#configurableColumnsModalApply');
        this.tableHeading = this.page.locator('table thead tr');
        this.tableRows = this.page.locator('#bulkActionItemResultsTable tbody tr');
        this.failFlagDropdown = this.page.getByLabel('Fail Flag');
        // The Indicators <th> carries data-code="indicators" but its <td> siblings don't repeat data-code,
        // so the indicators cell is matched by its column position (2nd column, after the checkbox column).
        this.indicatorsColumnCells = this.page.locator('#bulkActionItemResultsTable tbody tr td:nth-child(2)');
        this.indicatorsColumnIcons = this.page.locator('#bulkActionItemResultsTable tbody tr td:nth-child(2) i.indicators-icon');
        this.firstCandidateNameTableLocator = this.page.locator('table:has-text("Candidate") td a').first();
        this.firstResumePreviewLink = this.page.locator('#bulkActionItemResultsTable tbody tr').first().locator('.btn-quick-view');
        this.resumePreviewModal = this.page.locator('#quickViewModalBody');
        this.columnLinkLocator = this.page.getByRole('link', { name: '' });

    } 

    //Navigate to candidate pool advanced search page
    async goToAdvancedSearchPage(){
        await this.candidateNavLocator.click();
        await this.candidatePoolNavLocator.click();
        await this.page.waitForLoadState('load');
    }

    //Add columns the to table result
    async addTableColumn(){
        await this.columnLinkLocator.click();
        await this.countryColumn.click();
        await this.recruitingManagerColumn.click();
        await this.stateColumn.click();
        await this.applyColumnButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector('[data-code="country"]', {state: 'visible', timeout: 10000});
        await this.page.waitForSelector('#bulkActionItemResultsTable', { state: 'attached' });
    }
    
    //Search filter functionality
    async applyFilter(filterType, value, additionalOptions = {}) {
        await this.editSearchButton.click();
        await this.clearFiltersButton.click();
        switch (filterType) {
            case 'candidateName':
                await this.candidateNameField.click();
                await this.candidateNameField.fill(value);
                break;
    
            case 'recruitingManager':
                await this.recruitingManagerField.click();
                await this.recruitingManagerField.fill(value);
                await this.recruitingManagerField.press('ArrowDown');
                await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
                await this.page.click('.ui-autocomplete li:has-text("'+value+'")');
                await this.recruitingManagerField.press('Tab');
                break;
    
            case 'enteredLast':
                await this.enteredLastField.click();
                await this.enteredLastField.press('ControlOrMeta+a');
                await this.enteredLastField.fill(value);
                await this.dateIntervalDropdown.selectOption(additionalOptions.interval);
                break;
    
            case 'enterDateRange':
                await this.startDateField.click();
                await this.page.locator('#ui-datepicker-div').getByRole('combobox').first().selectOption(value.startMonth);
                await this.page.locator('#ui-datepicker-div').getByRole('combobox').nth(1).selectOption(value.startYear);
                await this.page.getByRole('cell', { name: value.startDay, exact: true }).getByRole('link').click();
                await this.endDateField.click();
                await this.page.getByRole('link', { name: value.end }).click();
                break;
    
            case 'currentStage':
                await this.hiringStageField.click();
                await this.hiringStageField.fill(value);
                await this.hiringStageField.press('ArrowDown');
                await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
                await this.page.click('.ui-autocomplete li:has-text("'+value+'")');
                await this.hiringStageField.press('Tab');
                break;
    
            case 'country':
                await this.countryField.click();
                await this.countryField.fill(value);
                await this.countryField.press('ArrowDown');
                await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
                await this.page.click('.ui-autocomplete li:has-text("'+value+'")');
                await this.countryField.press('Tab');
                break;
                break;
    
            case 'state':
                await this.countryField.click();
                await this.countryField.fill(value.country);
                await this.countryField.press('ArrowDown');
                await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
                await this.page.click('.ui-autocomplete li:has-text("'+value.country+'")');
                await this.countryField.press('Tab');

                await this.regionField.click();
                await this.regionField.fill(value.state);
                await this.regionField.press('ArrowDown');
                await this.page.click('.ui-autocomplete li:has-text("'+value.state+'")');
                await this.regionField.press('Tab');
                break;
    
            case 'sort':
                await this.sortDirectionDropdown.selectOption(value);
                break;

            case 'failFlag':
                await this.failFlagDropdown.selectOption(value);
                break;

            default:
                throw new Error(`Unknown filter type: ${filterType}`);
        }
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForSelector('#bulkActionItemResultsTable', { state: 'attached' });

    }

    // Verify that the table contains specific text
    async isFilterResultVisible(value) {
        await this.page.waitForSelector(`a[href*="/?fuseaction=resume.pager"]`, { state: 'visible' });
        return await this.page.locator(`table td:has-text("${value}")`).first();
    }

    // Verify that the table contains results
    async areThereCandidateSearchResults() {
        await this.page.locator('#bulkActionItemsRecordCount');
        return Number(await this.page.locator('#bulkActionItemsRecordCount').textContent()) > 0;
    }

    // Return the row for a given candidate name
    getCandidateRow(candidateName) {
        return this.tableRows.filter({ hasText: candidateName });
    }

    // Return the multi-application indicator icon for a given candidate row
    getMultiApplicationIcon(candidateName) {
        return this.getCandidateRow(candidateName).locator('.multiple-jobs-icon-active[title="Candidate has Applied to Multiple Jobs"]').first();
    }

    // Click through a candidate's name link and return the name that was clicked
    async clickThroughToResume() {
        const name = (await this.firstCandidateNameTableLocator.textContent()).trim();
        await this.firstCandidateNameTableLocator.click();
        await this.page.waitForLoadState('load');
        return name;
    }

    // Open the resume preview for the first candidate row
    async openFirstResumePreview() {
        await this.firstResumePreviewLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

}

module.exports = CandidatesPoolPage;
