const BasePage = require('../base.page.js');

class OfferRejectionLettersPage extends BasePage {
    constructor(page) {
        super(page);

        this.path = require('path');

         // Define all locators
         this.administrationMenuItem = this.page.getByLabel('Administration', { exact: true });
         this.offerRejectionLettersNavLink = this.page.getByLabel('Offer/Rejection Letters');
         this.uploadButton = this.page.getByRole('button', { name: 'Upload' })
         this.uploadOfferInputLocator = this.page.locator('label').filter({ hasText: 'Choose File' }).first();
         this.uploadRejectionInputLocator = this.page.locator('label').filter({ hasText: 'Choose File' }).nth(1);
         this.offerLetterNameField = this.page.locator('#offerLetterName');
         this.offerLetterDescriptionField = this.page.locator('#offerLetterDescription');
         this.rejectionLetterNameField = this.page.locator('#rejectionLetterName');
         this.rejectionLetterDescriptionField = this.page.locator('#rejectionLetterDescription');
         this.uploadOfferSuccessMessage =  this.page.locator('text=The Offer Letter document was successfully uploaded.');
         this.uploadRejectionSuccessMessage =  this.page.locator('text=The Rejection Letter document was successfully uploaded.');
         this.offerLetterList = this.page.locator('#offerLetterList');
         this.deleteOfferLetterButton = this.page.locator('#deleteOfferLetterButton');
         this.rejectionLetterList = this.page.locator('#rejectionLetterList');
         this.deleteRejectionLetterButton = this.page.locator('#deleteRejectionLetterButton');
    } 

    async navigateToOfferRejectionLettersPage() {
        await this.administrationMenuItem.click();
        await this.offerRejectionLettersNavLink.click();
        await this.page.waitForLoadState('load');   
    }

    async uploadFile(file, test){
        if(test == 'offer'){
            const filePath = this.path.join(__dirname, '../../test-data/files/' + file.offerLetterPath);
            await this.uploadOfferInputLocator.setInputFiles(filePath);
            await this.offerLetterNameField.fill(file.offerLetterName);
            await this.offerLetterDescriptionField.fill(file.offerLetterDescription);
        }
        else{
            const filePath = this.path.join(__dirname, '../../test-data/files/' + file.rejectionLetterPath);
            await this.uploadRejectionInputLocator.setInputFiles(filePath);
            await this.rejectionLetterNameField.fill(file.rejectionLetterName);
            await this.rejectionLetterDescriptionField.fill(file.rejectionLetterDescription);
        }
        
        await this.uploadButton.click();
    }

    async deleteLetter(data, test){
        if(test == 'offer'){
            await this.offerLetterList.selectOption({ label: data.offerLetterName });
            await this.deleteOfferLetterButton.click();
        }
        else{
            await this.rejectionLetterList.selectOption({ label: data.rejectionLetterName });
            await this.deleteRejectionLetterButton.click();
        }       
    }

    async getListLocator(data, test){
        if(test == 'offer'){
            return this.page.locator('#offerLetterList >> option', { hasText: data.offerLetterName })
        }
        else{
            return this.page.locator('#rejectionLetterList >> option', { hasText: data.rejectionLetterName })
        }
    }

}

module.exports = OfferRejectionLettersPage;
