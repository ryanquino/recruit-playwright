const BasePage = require('../base.page.js');

class EmailTemplatesPage extends BasePage {
    constructor(page) {
        super(page);

         this.administrationMenuItem = this.page.getByLabel('Administration', { exact: true });
         this.emailTempalatesNavLink = this.page.getByLabel('Email Templates');
         this.createNewTemplateField = this.page.getByRole('textbox', { name: 'Create New Template' });
         this.defineEmailSubjectField = this.page.getByRole('textbox', { name: 'Define Email Subject' });
         this.emailBodyRTE = this.page.locator('iframe[title="Rich Text Area"]').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.saveButton = this.page.getByRole('button', { name: 'Save' });
         this.selectEmailTemplateDropdown = this.page.getByLabel('Select an existing template');
         this.deleteButton = this.page.getByRole('button', { name: 'Delete' });
         this.previewButton = this.page.locator('#previewButton');
         this.editButton = this.page.getByRole('button', { name: 'Edit' });
         this.templateTitle = this.page.locator('.ui-form-item').nth(0).locator('.ui-form-field');
         this.eeoDataRequest = this.page.locator('.ui-form-item').nth(1).locator('.ui-form-field');
         this.rejectionJobClosed = this.page.locator('.ui-form-item').nth(2).locator('.ui-form-field');
         this.refineWithROSIButton = this.page.locator('#refineEmailBodyWithAIBtn');
         this.generateWithAIButton = this.page.locator('#generateWithAI');
         
    } 

    async navigateToEmailTemplatesPage() {
        await this.administrationMenuItem.click();
        await this.emailTempalatesNavLink.click();
        await this.page.waitForLoadState('load');   
    }

    async createBatchEmailTemplate(emailTemplate){
        await this.createNewTemplateField.fill(emailTemplate.title);
        await this.defineEmailSubjectField.fill(emailTemplate.subject);
        await this.emailBodyRTE.fill(emailTemplate.body);
        await this.saveButton.click();
        await this.page.waitForLoadState('load'); 
    }

    async deleteBatchEmailTemplate(title){
        await this.page.selectOption('#selectEmail', { label: title }); 
        await this.page.waitForLoadState('networkidle'); 
        await this.page.on('dialog', async (dialog) => {         
            await dialog.accept();
        });
        await this.deleteButton.click();
        await this.page.waitForLoadState('networkidle'); 
    }

    async redirectToPreview(title) {
        await this.selectEmailTemplateDropdown.selectOption({ label: title });
        await this.page.waitForLoadState('networkidle'); 
        await this.previewButton.click();
    }

    async editEmailTemplate(emailTemplate){
        await this.page.selectOption('#selectEmail', { label: emailTemplate.title }); 
        await this.page.waitForLoadState('networkidle'); 
        await this.previewButton.click();
        await this.editButton.click();
        await this.saveButton.click();
    }

    async refineWithROSI(emailTemplate){
        await this.page.selectOption('#selectEmail', { label: emailTemplate.title }); 
        await this.page.waitForLoadState('networkidle'); 
        await this.refineWithROSIButton.click();
        await this.generateWithAIButton.click();
        const useRosiMessageButton = this.page.locator('#generatedEmailTemplateModalButtonPrimary');
        await this.page.waitForFunction(
            (el) => !el.disabled,
            await useRosiMessageButton.elementHandle()
        );
        await useRosiMessageButton.click();
        await this.saveButton.click();
    }

}

module.exports = EmailTemplatesPage;
