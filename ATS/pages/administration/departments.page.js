const BasePage = require('../base.page.js');

class DepartmentsPage extends BasePage {
    constructor(page) {
        super(page);

         // Define all locators
         this.administrationMenuItem = this.page.getByLabel('Administration');
         this.departmentsNavMenuLink = this.page.getByLabel('Departments');        
         this.viewAllDepartMentsTextLink = this.page.getByRole('link', { name: 'View all Departments' });
         this.createButton = this.page.getByRole('button', { name: 'Create' });
         this.departmentsTable = this.page.locator('table:has-text("Departments")');
         this.departmentNameField = this.page.getByLabel('Department Name: *');
         this.departmentNumberField = this.page.getByLabel('Number: *');
         this.departmentNotesField = this.page.getByLabel('Notes:');
         this.saveButton = this.page.getByRole('button', { name: 'Save' });
         this.deactivateButton = this.page.getByRole('button', { name: 'De-activate' });
    } 

    async navigateToDepartments() {
        await this.administrationMenuItem.click();
        await this.departmentsNavMenuLink.click();
        await this.page.waitForLoadState('load'); 
    }

    async createDepartment(department, number){
        await this.createButton.click();
        await this.page.waitForLoadState('load'); 
        await this.departmentNameField.click();
        await this.departmentNameField.fill(department.departmentName); 
        await this.departmentNumberField.click();
        await this.departmentNumberField.fill(number); 
        await this.departmentNotesField.click();
        await this.departmentNotesField.fill(department.notes); 
        await this.saveButton.click();
        await this.page.waitForLoadState('load'); 
    }

    async editDepartment(departmentName, update){
        const labelLink = this.page.locator(`table:has-text("Department") td:has-text("${departmentName}") a`);
        await labelLink.click();
        await this.page.waitForLoadState('load');
        await this.departmentNameField.click();
        await this.departmentNameField.fill(update); 
        await this.saveButton.click();
        await this.page.waitForLoadState('load');  
    }
    

    async isAddedDepartmentExist(departmentName){
        return await this.page.locator(`table:has-text("Department") td:has-text("${departmentName}")`);        
    }


    async getDepartmentRowCount(){
        await this.viewAllDepartMentsTextLink.click();
        // Count the number of rows in the table body
        const rowCount = await this.page.locator(`table:has-text("Department") tbody tr`).count();
        return rowCount;
    }

    async deactivateDepartment(departmentName){
        //locate the table that has the correct label
        const labelLink = this.page.locator(`table:has-text("Department") td:has-text("${departmentName}") a`);
        await labelLink.click();
        await this.page.waitForLoadState('load');
        await this.deactivateButton.click();
        await this.page.waitForLoadState('load');
    }
}

module.exports = DepartmentsPage;
