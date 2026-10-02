const ApplicationFormPage = require('./application-form.page');

class ApplicationFormValidationPage extends ApplicationFormPage {
    constructor(page) {
        super(page);
        this.path = require('path');

        // Error message locators
        this.submitButton = this.page.locator('#Apply_ApplyToJob_SubmitButton');
        this.firstNameErrorLocator = this.page.locator('#Apply_ApplyToJob_FirstName-error');
        this.lastNameErrorLocator = this.page.locator('#Apply_ApplyToJob_LastName-error');
        this.emailErrorLocator = this.page.locator('#Apply_ApplyToJob_Email-error');
        this.resumeErrorLocator = this.page.locator('#Apply_ApplyToJob_File-error');
        this.firstNameField = this.page.locator('#Apply_ApplyToJob_FirstName');
        this.lastNameField = this.page.locator('#Apply_ApplyToJob_LastName');
        this.emailField = this.page.locator('#Apply_ApplyToJob_Email');
        this.alreadyAppliedHeading = this.page.locator('#Error_AlreadyApplied_Success_PageHeading');
    }

    async submitApplication(profile) {
        await this.firstNameField.fill(profile.firstName);
        await this.lastNameField.fill(profile.lastName);
        await this.emailField.fill(profile.alreadyAppliedEmail);
        await this.uploadCV('resume.pdf');
        await this.submitButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async submitIncompleteForm() {
        await this.submitButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async submitWithIncompleteEmailAddress(profile) {
        await this.firstNameField.fill(profile.firstName);
        await this.lastNameField.fill(profile.lastName);
        await this.emailField.fill(profile.incorrectEmailAddress);
        await this.uploadCV('resume.pdf');
        await this.submitButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async submitWithSupportedFileType(profile) {
        await this.uploadCV('resume.pdf');
        await this.submitButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async submitWithInvalidFileType(profile) {
        await this.firstNameField.fill(profile.firstName);
        await this.lastNameField.fill(profile.lastName);
        await this.emailField.fill(profile.email);
        await this.uploadCV('invalidfiletype.xml');
        await this.submitButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    getEmailFieldErrorMessages() {
        const selectors = [
            '#Apply_ApplyToJob_Email-error',
        ];

        return selectors.map(s => this.page.locator(s));
    }

    getRequiredFieldErrorMessages(field) {
        const selectors = {
            firstName: '#Apply_ApplyToJob_FirstName-error',
            lastName: '#Apply_ApplyToJob_LastName-error',
            email: '#Apply_ApplyToJob_Email-error',
            resume: '#Apply_ApplyToJob_File-error',
        };

        if (field) return this.page.locator(selectors[field]);
        return Object.values(selectors).map(s => this.page.locator(s));
    }

    async uploadCV(filename) {
        const filePath = this.path.join(__dirname, '../../test-data/files/' + filename);
        await this.page.locator('#Apply_ApplyToJob_File').setInputFiles(filePath);
    }
}

module.exports = ApplicationFormValidationPage;
