const BasePage = require('../base.page.js');

class ManageResourcesPage extends BasePage {
    constructor(page) {
        super(page);

        this.administrationMenuItem = this.page.getByLabel('Administration', { exact: true });
        this.manageResourcesNavLink = this.page.getByLabel('Manage Resources').getByText('Manage Resources');
        this.resourceThreeDotLinks = this.page.locator('#main div').filter({ hasText: 'Manage Resources Add resource' }).locator('i').first();
        this.addNewResourceLink = this.page.getByRole('link', { name: 'Add resource option' });
        this.resourceTypeDropdown = this.page.getByLabel('Select Resource Type *');
        this.resourceNameField = this.page.getByRole('textbox', { name: 'Resource Name *' });
        this.startDateCalendar = this.page.getByRole('textbox', { name: 'Subscription Start Date' });
        this.calendarDoneButton = this.page.getByRole('button', { name: 'Done' })
        this.expirationDateCalendar = this.page.getByRole('textbox', { name: 'Subscription Expiration Date' });
        this.costField = this.page.getByRole('textbox', { name: 'Cost' });
        this.saveButton = this.page.getByRole('button', { name: 'Save' });
        this.saveButton2 = this.page.getByRole('button', { name: 'Save' }).first();
        this.editLink = this.page.getByRole('listitem').filter({ hasText: 'Edit' });
        this.deactivateLink = this.page.getByRole('link', { name: 'De-activate' });
        this.activateLink = this.page.getByRole('link', { name: 'Activate' });
        this.editHowDidYouHearLink = this.page.getByRole('link', { name: 'Edit "How Did You Hear About' });
        this.showDeactivatedResourceLink = this.page.getByRole('link', { name: 'Show deactivated resources' });
        this.modifiedAlertSuccess = this.page.locator('div').filter({ hasText: 'Resource has been modified.' }).nth(1);
        this.deletedAlertASuccess = this.page.locator('div').filter({ hasText: 'Resource has been deleted.' }).nth(1);
        this.activatedAlertASuccess = this.page.locator('div').filter({ hasText: 'Resource has been reactivated.' }).nth(1);    
        this.sourceTextLocator = this.page.locator('#appliedFiltercandidateSourceList');
    }

    async navigateToManageResourcesPage() {
        await this.administrationMenuItem.click();
        await this.manageResourcesNavLink.click();
        await this.page.waitForLoadState('load');
    }

    async addResourceOption(resource){
        await this.resourceThreeDotLinks.click();
        await this.addNewResourceLink.click();
        await this.resourceTypeDropdown.selectOption(resource.resourceType);
        await this.resourceNameField.fill(resource.resourceName);
        await this.startDateCalendar.click();
        await this.startDateCalendar.fill(resource.startDate);
        await this.calendarDoneButton.click();
        await this.expirationDateCalendar.click();
        await this.expirationDateCalendar.fill(resource.expirationDate);
        await this.calendarDoneButton.click();
        await this.costField.fill(resource.cost);
        await this.saveButton.click();
    }

    async getNewlyAddedResource(resourceName){
        return await this.page.locator(`table:has-text("Resource") td:has-text("${resourceName}")`);    
    }

    async editResource(resourceName){
        await this.page.getByRole('row', { name: resourceName }).locator('i').click();
        await this.editLink.click();
        await this.page.waitForLoadState('load'); 
        await this.resourceNameField.click();
        await this.resourceNameField.fill(resourceName);
        await this.saveButton.click();
        await this.page.waitForLoadState('load');      
    }

    async deactivateResource(resourceName){
        await this.page.getByRole('row', { name: resourceName }).locator('i').click();
        await this.deactivateLink.click();
    }

    async activateResource(resourceName){      
        await this.resourceThreeDotLinks.click();
        await this.showDeactivatedResourceLink.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.getByRole('row', { name: resourceName }).locator('i').click();
        await this.activateLink.click();
    }

    async editOption(resourceName){
        await this.resourceThreeDotLinks.click();
        await this.editHowDidYouHearLink.click();
        await this.page.getByRole('textbox', { name: '17.' }).fill(resourceName);
        this.page.once('dialog', dialog => {
            dialog.accept();
        });
        await this.saveButton2.click();
        await this.manageResourcesNavLink.click();
        await this.page.waitForLoadState('load');
    }

    async redirectToCandidatePool(resourceName){
        await this.page.getByRole('link', { name: resourceName }).click();
    }
}

module.exports = ManageResourcesPage;
