const BasePage = require('../base.page.js');

class FeeAgenciesPage extends BasePage {
    constructor(page) {
        super(page);

        // Define locators
        this.administrationMenuItem = this.page.getByLabel('Administration', { exact: true });
        this.feeAgenciesNavMenuLink = this.page.getByLabel('Fee Agencies').getByText('Fee Agencies');
        this.feeAgencyHelpLinks = this.page.locator('.oh__icon-button > div > .fas');
        this.createFeeAgencyLink = this.page.getByRole('link', { name: 'Create a Fee Agency' });
        this.feeAgencyNameField = this.page.getByLabel('Fee Agency Name *');
        this.feeAgencyAddressField = this.page.getByLabel('Address');
        this.cityField = this.page.getByLabel('City');
        this.stateOrCountryDropdown = this.page.getByLabel('State or Country');
        this.postalCodeField = this.page.getByLabel('Postal Code');
        this.phoneField = this.page.getByLabel('Phone');
        this.faxField = this.page.getByLabel('Fax');
        this.emailField = this.page.getByLabel('Agency Email');
        this.agencyUserNameField = this.page.getByLabel('Agency User Full Name');
        this.loginNameField = this.page.getByLabel('Login Name *');
        this.passwordField = this.page.getByLabel('Password *');
        this.subscriptionStartDate = this.page.getByLabel('Subscription Start Date');
        this.subscriptionEndDate = this.page.getByLabel('Subscription Expiration Date');
        this.submissionLimitField = this.page.getByLabel('Daily Resume Submission Limit');
        this.rateField = this.page.getByLabel('Rate');
        this.notesField = this.page.getByLabel('Notes');
        this.saveButton = this.page.getByRole('button', { name: 'Save' });
        this.editSearchLink = this.page.getByText('Edit Search');
        this.statusDropdown = this.page.getByLabel('Status', { exact: true });
        this.resultsPerPageDropdown = this.page.getByLabel('Results Per Page');
        this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
        this.sortByDirection = this.page.locator('#sortByDirection');
        this.jobFeeAgencyLocator = this.page.locator('#appliedFilterfeeAgencyId');
        this.resumeFeeAgencyLocator = this.page.locator('#appliedFiltercandidateSourceList');
        this.editFeeAgencyHelpLinks = this.page.locator('#main div').filter({ hasText: 'Edit Fee Agency Deactivate' }).locator('i');
        this.reactivateHelpLinks = this.page.locator('#main div').filter({ hasText: 'Edit Fee Agency Reactivate' }).locator('i');
        this.deactivateFeeAgencyLink = this.page.getByRole('link', { name: 'Deactivate this fee agency' });
        this.reactivateFeeAgencyLink = this.page.getByRole('link', { name: 'Reactivate this fee agency' });
        this.confirmDeactivateButton = this.page.locator('#confirm_feeagent_deactivation_ModalButtonPrimary');
        this.searchFeeAgencyField = this.page.getByLabel('Fee Agency Name');
    }

    async navigateToFeeAgenciesPage() {
        await this.administrationMenuItem.click();
        await this.feeAgenciesNavMenuLink.click();
        await this.page.waitForLoadState('load');
    }

    async createFeeAgency(feeAgency) {
        await this.feeAgencyHelpLinks.click();
        await this.createFeeAgencyLink.click();
        await this.page.waitForLoadState('load');  
        await this.feeAgencyNameField.fill(feeAgency.feeAgencyName);
        await this.feeAgencyAddressField.fill(feeAgency.address);
        await this.cityField.fill(feeAgency.city);
        await this.stateOrCountryDropdown.selectOption(feeAgency.stateOrCountry);
        await this.postalCodeField.fill(feeAgency.postalCode);
        await this.phoneField.fill(feeAgency.phone);
        await this.faxField.fill(feeAgency.fax);
        await this.emailField.fill(feeAgency.agencyEmail);
        await this.agencyUserNameField.fill(feeAgency.agencyUserFullName);
        await this.loginNameField.fill(feeAgency.loginName);
        await this.passwordField.fill(feeAgency.password);
        await this.submissionLimitField.fill(feeAgency.dailyResumeSubmissionLimit);
        await this.rateField.fill(feeAgency.rate);
        await this.page.getByLabel('Allow Duplicate Candidate').selectOption(feeAgency.allowDuplicateCandidateSubmission);
        await this.notesField.fill(feeAgency.notes);
        await this.saveButton.click();
        await this.page.waitForLoadState('load'); 
    }

    async getNewlyAddedFeeAGencyLocator(feeAgencyName) {
        await this.searchFeeAgency(feeAgencyName, '1');

        return this.page.getByRole('cell', { name: feeAgencyName, exact: true });
    }

    async editFreeAgency(searchFilters) {
        await this.editSearchLink.click();
        await this.searchFeeAgencyField.fill(" ");
        await this.statusDropdown.selectOption(searchFilters.status);
        await this.resultsPerPageDropdown.selectOption(searchFilters.results);
        await this.sortByDirection.selectOption(searchFilters.sort);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('load');
    }

    async getTableRowCount() {
        const tableLocator = this.page.locator('table[data-recordcount="#bulkActionItemsRecordCount"] tbody tr');
        await this.page.waitForSelector(`table[data-recordcount="#bulkActionItemsRecordCount"] tbody tr`, { state: 'visible' });        
        return await tableLocator.count();
    }

    async getFeeAgencySourceResults(feeAgencyName, pageType) {
        await this.searchFeeAgency(feeAgencyName, '1');

        const link = this.page.getByRole('row', { name: feeAgencyName }).getByRole('link', ).nth(pageType);
        await link.click();
        await this.page.waitForLoadState('networkidle');
        const rowCount = await this.page.locator('#bulkActionItemResultsTable tbody tr').count();
        await this.page.goBack();
        await this.page.waitForLoadState('load');
        return rowCount;
    }

    async deactivateFeeAgency(feeAgencyName) {
        await this.searchFeeAgency(feeAgencyName, '1');

        const labelLink = this.page.getByRole('cell', { name: feeAgencyName, exact: true }).getByRole('link');
        await labelLink.click();
        await this.page.waitForLoadState('load');
        await this.editFeeAgencyHelpLinks.click();
        await this.deactivateFeeAgencyLink.click();
        await this.confirmDeactivateButton.click();
        await this.page.waitForLoadState('load');
    }

    async getFeeAgencyDeactivatedLocator(feeAgencyName) {
        await this.searchFeeAgency(feeAgencyName, '0');

        return this.page.getByRole('cell', { name: feeAgencyName, exact: true });
    }

    async reactivateFeeAgency(feeAgencyName) {
        await this.searchFeeAgency(feeAgencyName, '0');

        const labelLink = this.page.getByRole('cell', { name: feeAgencyName, exact: true }).getByRole('link');
        await labelLink.click();
        await this.page.waitForLoadState('load');
        await this.reactivateHelpLinks.click();
        await this.reactivateFeeAgencyLink.click();
        await this.page.waitForLoadState('load');
    }

    async searchFeeAgency(feeAgencyName, status){
        await this.feeAgenciesNavMenuLink.click();
        await this.page.waitForLoadState('load');
        await this.editSearchLink.click();
        await this.searchFeeAgencyField.click();
        await this.searchFeeAgencyField.fill(feeAgencyName);
        await this.statusDropdown.selectOption(status);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async searchDeactivatedFeeAgency(feeAgencyName, status){
        await this.feeAgenciesNavMenuLink.click();
        await this.page.waitForLoadState('load');
        await this.editSearchLink.click();
        await this.searchFeeAgencyField.fill(feeAgencyName);
        await this.statusDropdown.selectOption(status);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

}

module.exports = FeeAgenciesPage;
