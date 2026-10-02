const BasePage = require('../base.page.js');

class UserAccountsPage extends BasePage {
    constructor(page) {
        super(page);

         // Define all locators
         //category locators
         this.administrationMenuItem = this.page.getByLabel('Administration', { exact: true });
         this.userAccountsNavMenuLink = this.page.getByLabel('User Accounts').getByText('User Accounts');

         this.userAccountHelpLinks = this.page.locator('#main div').filter({ hasText: 'User Accounts Add User' }).locator('i').first();
         this.addUserTextLink = this.page.getByRole('link', { name: 'Add User' });
         this.firstNameField = this.page.getByLabel('First Name *')
         this.lastNameField = this.page.getByLabel('Last Name *');
         this.phoneField = this.page.getByLabel('Phone');
         this.emailField = this.page.getByLabel('Email Address *');
         this.usernameField = this.page.getByLabel('Username *');
         this.singleSignOnId = this.page.getByLabel('Single Sign-on ID');
         this.roleField = this.page.getByLabel('Role *');
         this.permissionsField = this.page.getByLabel('Permissions');
         this.timeZoneField = this.page.getByLabel('Time Zone');
         this.addAllLocationButton = this.page.getByRole('button', { name: 'Add All' });
         this.saveNewUserButton = this.page.getByRole('button', { name: 'Save' });

         this.editSearchLink = this.page.getByText('Edit Search');
         this.fullNameField = this.page.getByPlaceholder('Type all or part of name');
         this.statusDropdown = this.page.getByLabel('Status', { exact: true });
         this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
         this.bulkActionDropdown = this.page.locator('#performBulkAction');
         this.performActionButton = this.page.locator('#performBulkActionButton');
         this.checkboxClick = this.page.locator('td').first();
         this.continueButton = this.page.locator('#takeActionMessageModalContinue');
         this.userUpdateSuccessLocator = this.page.getByText('× Users updated successfully.');
         this.assignRole = this.page.locator('#assignRoleId');
    } 

    async navigateToUserAccounts() {
        await this.administrationMenuItem.click();
        await this.userAccountsNavMenuLink.click();
        await this.page.waitForLoadState('load');  
    }

    async hasTableRecords() {
        await this.page.waitForSelector('#userResultsTable tbody tr:nth-child(1)', { state: 'attached' });
        const tableLocator = this.page.locator('#userResultsTable tbody tr');
        const rowCount = await tableLocator.count();   
        return rowCount;
    }

    async addNewUser(userAccount){
        await this.userAccountHelpLinks.click();
        await this.page.waitForLoadState('load');  
        await this.addUserTextLink.click();
        await this.firstNameField.click();
        await this.firstNameField.fill(userAccount.firstName);
        await this.lastNameField.click();
        await this.lastNameField.fill(userAccount.lastName);
        await this.phoneField.click();
        await this.phoneField.fill(userAccount.phone);
        await this.emailField.click();
        await this.emailField.fill(userAccount.emailAddress);
        await this.usernameField.click();
        await this.usernameField.fill(userAccount.username);
        await this.singleSignOnId.click();
        await this.singleSignOnId.fill(userAccount.singleSignOnId);
        await this.roleField.selectOption(userAccount.role);
        await this.permissionsField.selectOption(userAccount.permissions);
        await this.addAllLocationButton.click();
        await this.saveNewUserButton.click();
        await this.page.waitForLoadState('load'); 
    }

    async getNewlyCreatedUser(fullname, status){
        await this.searchUser(fullname, status);

        return await this.page.locator(`table:has-text("Name") td:has-text("${fullname}")`);   
    }

    async getUpdatedUserEmail(userAccount, status){
        await this.searchUser(userAccount.firstName + " " + userAccount.lastName, status);

        return await this.page.locator(`table:has-text("Email Address") td:has-text("${userAccount.updatedEmail}")`).first();   
    }

    async editUser(fullname, email){
        await this.searchUser(fullname, "1");
        const labelLink = this.page.locator(`table:has-text("Name") td:has-text("${fullname}") a`);
        await labelLink.click();
        await this.page.waitForLoadState('load'); 
        await this.emailField.click();
        await this.emailField.fill(email);
        await this.saveNewUserButton.click();
        await this.page.waitForLoadState('load');
    }

    async updateActiveUserAccount(fullname, status, option){
        await this.searchUser(fullname, status);
        await this.page.locator('td').first().click();
        await this.bulkActionDropdown.selectOption(option);
        await this.performActionButton.click();
        await this.continueButton.click();
        await this.page.waitForLoadState('load');
    }

    async updatePermissions(fullname, permissions, role){
        await this.searchUser(fullname, "1");
        await this.page.locator('td').first().click();
        await this.bulkActionDropdown.selectOption(role);
        await this.performActionButton.click();
        await this.assignRole.selectOption(permissions);
        await this.continueButton.click();
        await this.page.waitForLoadState('load');
    }


    async searchUser(fullname, status){
        await this.page.waitForLoadState('networkidle');
        await this.editSearchLink.click();
        await this.fullNameField.waitFor({ state: 'visible', timeout: 10000 });
        await this.fullNameField.fill(fullname);
        await this.statusDropdown.selectOption(status);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('domcontentloaded'); 
    }

}

module.exports = UserAccountsPage;
