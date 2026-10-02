const BasePage = require('../base.page.js');

class EmployeeReferralsPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        //Candidate Pool locators
        this.candidateNavLocator = this.page.getByLabel('Candidates', { exact: true });
        this.employeeReferralsNavLocator = this.page.getByLabel('Employee Referrals');
        this.editSearchButton = this.page.getByText('Edit Search');
        this.removeJobOwnerIcon = this.page.locator('#jobOwnerId_log').getByText('x');
        this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
        this.employeeReferralsSourceLocator = this.page.locator('#appliedFiltercandidateSourceList');
        this.sourceTableLocator = this.page.locator('#bulkActionItemResultsTable tbody tr').locator('td').nth(6);
        this.tableRowCount = this.page.locator('#bulkActionItemsRecordCount');

    } 

    async navigateToEmployeeReferrals(){
        await this.candidateNavLocator.click();
        await this.employeeReferralsNavLocator.click();
        await this.page.waitForLoadState('load');
    }

    async getTableResultsCount(){
        await this.editSearchButton.click();
        await this.removeJobOwnerIcon.click();
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('networkidle');
        return Number(await this.tableRowCount.textContent()) > 0;
    }

}

module.exports = EmployeeReferralsPage;
