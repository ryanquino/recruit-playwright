const BasePage = require('../base.page.js');

class AdministrationPage extends BasePage {
    constructor(page, candidateData) {
        super(page);
        this.page = page;
        this.data = candidateData;

        this.uniqueJobCategoryName = `playwright automation ${Date.now()}`;

         // Define all locators
         this.administrationMenuItem = this.page.getByLabel('Administration', { exact: true });
         this.aapJobGroupSubMenuItem = this.page.getByLabel('AAP Job Group').getByText('AAP Job Group')
         this.eeoCategoryDropdown = page.locator('#eeoccat');
         this.addButton = page.getByRole('button', { name: 'Add' });
         this.aapJobGroupInput = page.locator('.eeogroupinput').last()
         this.saveButton = page.getByRole('button', { name: 'Save' });
         this.successMessage = page.getByText('AAP Job Group was saved');
         this.newAAPJobGroup = page.locator(`input[value="${this.uniqueJobCategoryName}"]`);         
    } 

    async navigateToAAPJobGroup() {
        await this.administrationMenuItem.click();
        await this.aapJobGroupSubMenuItem.click();
    }

    async selectEEOCategory(category) {
        await this.page.waitForLoadState('load');        
        await this.eeoCategoryDropdown.selectOption(category);
    }

    async addAAPJobGroup() {
        await this.addButton.click();
        await this.aapJobGroupInput.pressSequentially(this.uniqueJobCategoryName);
        await this.saveButton.click();
    }

}

module.exports = AdministrationPage;
