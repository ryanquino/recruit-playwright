const BasePage = require('../base.page.js');

class BusinessUnitsPage extends BasePage {
    constructor(page) {
        super(page);

         // Define all locators
         this.administrationMenuItem = this.page.getByLabel('Administration', { exact: true });
         this.businessUnitNavLink = this.page.getByLabel('Business Units');
         this.createButton = this.page.getByRole('button', { name: 'Create' });
         this.labelField = this.page.getByLabel('Label *');
         this.descriptionField = this.page.getByLabel('Description');
         this.saveButton = this.page.getByRole('button', { name: 'Save' });
         this.noRadioButton = this.page.getByText('No', { exact: true });
         this.businessUnitTable = this.page.locator('table:has-text("Label")');      
    } 

    async navigateToBusinessUnitsPage() {
        await this.administrationMenuItem.click();
        await this.businessUnitNavLink.click();
        await this.page.waitForLoadState('load');   
    }

    async createNewBusinessUnit(businessUnit){
        await this.createButton.click();
        await this.page.waitForLoadState('load');   
        await this.labelField.click();
        await this.labelField.fill(businessUnit.label);
        await this.descriptionField.click();
        await this.descriptionField.fill(businessUnit.description);
        await this.saveButton.click();
        await this.page.waitForLoadState('load');   
    }

    async deactivateBusinessUnit(labelText){
        //locate the table that has the correct label
        const labelLink = this.page.locator(`table:has-text("Label") td:has-text("${labelText}") a`);
        await labelLink.click();
        await this.page.waitForLoadState('load');   
        await this.noRadioButton.check();
        await this.saveButton.click();
        await this.page.waitForLoadState('load');   
    }

    async isBusinessUnitVisible(labelText){
        //return the locator of the cell which has the correct label
        return await this.page.locator(`table:has-text("Label") td:has-text("${labelText}")`);;        
    }
}

module.exports = BusinessUnitsPage;
