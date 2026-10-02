const BasePage = require('../base.page.js');

class UploadCandidatesPage extends BasePage {
    constructor(page, candidateData) {
        super(page);
        this.page = page;
        this.data = candidateData;

        // File system path utility
        this.path = require('path');

         // Define all locators
         this.successMessageLocator = this.page.getByText("resume profile was successfully added to the");
         this.invalidFileErrorMessageLocator = this.page.getByText('The following errors occurred');
         this.fileExtensionErrorLocator = this.page.locator('#errorMessagePanel div').filter({ hasText: 'The file extension of the' });
         this.recycleBinMessageLocator = this.page.getByText('There are no resumes in the Recycle Bin.');
         this.uploadInputLocator = this.page.locator('input[type="file"]');
         this.uploadButtonLocator = this.page.getByRole('button', { name: 'Upload' });
         this.saveButtonLocator = this.page.getByRole('button', { name: 'Save' });
         this.manualEntryButtonLocator = this.page.getByRole('button', { name: 'Manual Entry' });
         this.checkForDuplicatesButtonLocator = this.page.getByRole('button', { name: 'Check For Duplicates' });
         this.candidateNavLocator = this.page.getByLabel('Candidates', { exact: true });
         this.candidatePoolNavLocator = this.page.getByLabel('Candidate Pool');
         this.uploadNavLocator = this.page.getByLabel('Upload');
         this.emailInputLocator = this.page.locator('#email');
         this.addressInputLocator = this.page.locator('input[name="Address"]');
         this.address2InputLocator = this.page.locator('input[name="Address2"]');
         this.stateDropdownLocator = this.page.getByLabel('State/Location');
         this.degreeLevelDropdownLocator = this.page.locator('#DEGREELEVEL');
         this.currentJobTypeDropdownLocator = this.page.getByLabel('Current job type');
         this.desiredJobTypeDropdownLocator = this.page.getByLabel('Desired job type');
         this.careerLevelDropdownLocator = this.page.getByLabel('Career level');
         this.relocateDropdownLocator = this.page.getByLabel('Willing to relocate?');
         this.takeActionButtonLocator = this.page.getByRole('link', { name: 'Take Action ' });
         this.deleteSelectedButtonLocator = this.page.getByText('Delete Selected');
         this.bulkActionModalSaveButtonLocator = this.page.locator('#bulkActionModalSave');
         this.editSearchButtonLocator = this.page.getByText('Edit Search');
         this.checkAllItemsCheckboxLocator = this.page.locator('#checkAllItems');
         this.recycleBinPurgeIconLocator = this.page.locator('.oh__menu-icon .oh__icon-button');
         this.firstCheckbox = this.page.locator('input[name="bulkActionItemId"]').first();
         this.addToPipelineFieldLocator = this.page.getByRole('textbox', { name: 'Associate with Job Pipeline' });
         this.addToPipelineLabelLocator = this.page.getByText('Associate with Job Pipeline');
         this.uploadCandidatesHeadingLocator = this.page.getByRole('heading', { name: 'Upload Candidates' });
         this.candidateNameEmailInputLocator = this.page.getByRole('textbox', { name: 'Candidate Name Candidate Email' });
         this.clearFiltersButtonLocator = this.page.getByRole('button', { name: 'Clear Filters' });
         this.applyFiltersButtonLocator = this.page.getByRole('button', { name: 'Apply Filters' });
         this.associateWithPipelineLocator = this.page.locator('#pipelineJobId_input');
         this.pipelineForJobPostingLocator = this.page.locator('#prospectForJobId_input');
    } 

    // Navigate to upload section
    async goToUpload() {
        await this.candidateNavLocator.click();
        await this.uploadNavLocator.click();
        await this.page.waitForLoadState('load');
    }

    // Upload a file
    async uploadResume(filename) {
        const filePath = this.path.join(__dirname, '../../test-data/files/' + filename);
        // The file input is rendered after the Upload page finishes loading.
        // Without this wait, setInputFiles intermittently times out (seen ~2/30
        // on repeat runs) when it fires before the input is attached.
        await this.uploadInputLocator.waitFor({ state: 'attached', timeout: 30000 });
        await this.uploadInputLocator.setInputFiles(filePath);
        await this.uploadButtonLocator.click();
    }

    // Save the resume
    async saveResume() {
        await this.saveButtonLocator.click();
    }

    // Fill out manual entry form
    async fillManualEntry() {
        const fullName = `${this.data.resume_info.full_name.first_name} ${this.data.resume_info.full_name.last_name}`;
        await this.uploadNavLocator.click();
        await this.manualEntryButtonLocator.click();
        await this.page.waitForLoadState('load');
        await this.fillField('Candidate Name', fullName);
        await this.emailInputLocator.fill(this.data.resume_info.contact.email);
        await this.checkForDuplicatesButtonLocator.click();
        await this.fillField('Attached File Description', this.data.attachments.attached_file_description);
        await this.fillField('Full Name *', fullName);
        await this.fillField('First Name *', this.data.resume_info.full_name.first_name);
        await this.fillField('Middle Name', this.data.resume_info.full_name.middle_name);
        await this.fillField('Last Name *', this.data.resume_info.full_name.last_name);
        await this.fillField('Skill Set', this.data.resume_info.skill_set);
        await this.page.locator('#country').selectOption(this.data.resume_info.location.country);
        await this.addressInputLocator.fill(this.data.resume_info.location.address);
        await this.address2InputLocator.fill(this.data.resume_info.location.address_continued);
        await this.fillField('City', this.data.resume_info.location.city);
        await this.stateDropdownLocator.selectOption(this.data.resume_info.location.state);
        await this.fillField('Zip/Postal Code', this.data.resume_info.location.zip_code);
        await this.fillField('Primary Phone', this.data.resume_info.contact.primary_phone);
        await this.fillField('Secondary Phone', this.data.resume_info.contact.secondary_phone);
        await this.degreeLevelDropdownLocator.selectOption(this.data.resume_info.degree_level);
        await this.fillField('College majors', this.data.resume_info.college_majors);
        await this.fillField('Professional Certifications', this.data.resume_info.professional_certifications);
        await this.fillField('Résumé Content', this.data.resume_content);
        await this.fillField('Notes/Comments', this.data.notes_comments);
        await this.fillField('Salary Requirement/', this.data.resume_info.salary_requirement_expectations);
        await this.currentJobTypeDropdownLocator.selectOption(this.data.resume_info.current_job_type);
        await this.desiredJobTypeDropdownLocator.selectOption(this.data.resume_info.desired_job_type);
        await this.careerLevelDropdownLocator.selectOption(this.data.resume_info.career_level);
        await this.relocateDropdownLocator.selectOption(this.data.resume_info.willing_to_relocate);
        await this.fillField('Years of Experience', this.data.resume_info.years_of_experience);
        await this.page.getByText('Candidate\'s status to work in').click();
        await this.page.locator('#Security_1Field').getByText('Yes').click();
        await this.saveResume();
    }

    // Reusable function to fill a field
    async fillField(label, value) {
        const field = this.page.getByLabel(label);
        await field.click();
        await field.fill(value);
    }

    // Simplified manual entry for testing Add to Pipeline field visibility
    async fillBasicManualEntry(candidateName, email) {
        await this.manualEntryButtonLocator.click();
        await this.page.waitForLoadState('load');
        await this.candidateNameEmailInputLocator.fill(candidateName);
        await this.emailInputLocator.fill(email);
        await this.checkForDuplicatesButtonLocator.click();
        await this.page.waitForLoadState('load');
        await this.selectAutocompleteOption(this.associateWithPipelineLocator, 'Playwright Pipeline');
        await this.saveButtonLocator.click();
        await this.page.waitForLoadState('networkidle');
    }

    async selectAutocompleteOption(dropdown, value) {
        await dropdown.click();
        await dropdown.pressSequentially(value, { delay: 30 });
        await this.page.waitForLoadState('domcontentloaded');
        await dropdown.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${value}")`);
    }

    async verifyPipelineOnCRP(){
        await this.candidatePoolNavLocator.click();
        await this.page.waitForLoadState('load');
        await this.editSearchButtonLocator.click();
        await this.selectAutocompleteOption(this.pipelineForJobPostingLocator, 'Playwright Pipeline');
        await this.page.getByLabel('Candidate Name').press('Enter');
        await this.page.waitForLoadState('networkidle');

        const firstRow = this.page.locator('#bulkActionItemResultsTable tbody tr').first();
        return await firstRow.isVisible();
    }

     // Method to clean up a candidate
     async cleanupCandidate() {
        // Navigate to Candidates > Candidate Pool
        await this.candidatePoolNavLocator.click();
        await this.page.waitForLoadState('load');

        // Search for the candidate
        await this.editSearchButtonLocator.click();
        await this.fillField('Candidate Name', `${this.data.resume_info.full_name.first_name}`);
        await this.page.getByLabel('Candidate Name').press('Enter');
        await this.page.waitForLoadState('load');

        // Select and delete the candidate
        await this.firstCheckbox.check();
        await this.takeActionButtonLocator.click();
        await this.deleteSelectedButtonLocator.click();
        await this.bulkActionModalSaveButtonLocator.click();
        await this.page.waitForNavigation();
    }

    // Method to clean up a candidate by name
    async cleanupCandidateByName(candidateName) {
        await this.candidatePoolNavLocator.click();
        await this.page.waitForLoadState('load');

        await this.editSearchButtonLocator.click();
        await this.clearFiltersButtonLocator.click();
        await this.fillField('Candidate Name', candidateName);
        await this.applyFiltersButtonLocator.click();
        await this.page.waitForLoadState('networkidle');

        const firstRow = this.page.locator('#bulkActionItemResultsTable tbody tr').first();
        const hasResults = await firstRow.isVisible().catch(() => false);
        if (hasResults) {
            await this.checkAllItemsCheckboxLocator.scrollIntoViewIfNeeded();
            await this.checkAllItemsCheckboxLocator.check({ timeout: 10000 });
            await this.takeActionButtonLocator.click();
            await this.deleteSelectedButtonLocator.click();
            await this.bulkActionModalSaveButtonLocator.click();
            await this.page.waitForLoadState('load');
        }
    }
}

module.exports = UploadCandidatesPage;