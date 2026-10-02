const BasePage = require('../base.page.js');
const CandidatesBulkActionPage = require('../candidates/candidates-bulk-actions.page.js');

class CandidateResumeProfilePage extends BasePage {
    constructor(page) {
        super(page);
        this.candidatesBulkActionPage = new CandidatesBulkActionPage(page);

        this.path = require('path');

        this.candidateNavLocator = this.page.getByLabel('Candidates', { exact: true });
        this.candidatePoolNavLocator = this.page.getByLabel('Candidate Pool');
        this.editSearchButton = this.page.getByText('Edit Search');
        this.candidateNameField = this.page.getByLabel('Candidate Name');
        this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
        this.clearFiltersButton = this.page.getByRole('button', { name: 'Clear Filters' });
        this.firstCandidateNameTableLocator = this.page.locator(`table:has-text("Candidate") td a`).first();
        this.takeActionButton = this.page.getByRole('button', { name: 'Take Action' });
        this.completeReviewMenuItem = this.page.getByRole('menuitem', { name: 'Complete Review' });
        this.addCommentMenuItem = this.page.getByRole('menuitem', { name: 'Add Comment' });
        this.createNewProfileMenuItem = this.page.getByRole('menuitem', { name: 'Create New Profile' });
        this.deleteThisProfileMenuItem = this.page.getByRole('menuitem', { name: 'Delete this Profile' });
        this.resumeCommentTextArea = this.page.locator('#comment');
        this.saveButton = this.page.locator('#save_crp_comment');
        this.successAlert = this.page.locator('.toast-success .toastr_message_text');
        this.requestReviewMenuItem = this.page.getByRole('menuitem', { name: 'Request a Review' });
        this.subjectField = this.page.getByLabel('Subject: *');
        this.internalRecipientsDropdown = this.page.locator('#internal_user_id_input');
        this.resumeCVTabHtmlCheckbox = this.page.getByLabel('Resume/CV tab HTML');
        this.saveButtonRequestReview = this.page.locator('#formModalSave');
        this.sendEmailMenuItem = this.page.getByRole('menuitem', { name: 'Send Email' });
        this.emailTemplateDropdown = this.page.getByLabel('Select a "Template" message');
        this.emailSubjectField = this.page.locator('#emailsubject');
        this.sendEmailButton = this.page.getByRole('button', { name: 'Send' });
        this.associateWithJobPostingDropdown = this.page.locator('#jobs_input');
        this.createNewProfileSaveButton = this.page.getByRole('button', { name: 'Save' });
        this.confirmDelete = this.page.locator('#confirm_delete_ModalButtonPrimary');
        this.otherApplicationLink = this.page.locator('#jobs-button-aolbgens');
        this.changeJobMenuItem = this.page.getByRole('menuitem', { name: 'Change Job' });
        this.changeJobSaveButton = this.page.getByRole('button', { name: 'Save' });
        this.employeeProfileMenuItem = this.page.getByRole('menuitem', { name: 'Employee Profile' });
        this.employeeTab = this.page.getByRole('tab', { name: 'Employee' });
        this.evaluationRankingMenuItem = this.page.getByRole('menuitem', { name: 'Evaluation Ranking' });
        this.changeDispositionMenuItem = this.page.getByRole('menuitem', { name: 'Change Disposition' });
        this.removeDispositionMenuItem = this.page.getByRole('menuitem', { name: 'Remove Disposition' });
        this.removeDispositionOkayButton = this.page.locator('#confirm_remove_disposition_ModalButtonPrimary');
        this.eeoProfileMenuItem = this.page.getByRole('menuitem', { name: 'EEO Profile' });
        this.femaleOption = this.page.getByText('Female');
        this.candidateQuestionDropdown = this.page.getByLabel('What is the candidate\'s');
        this.identifyAsOption = this.page.getByText('I Identify As One Or More Of');
        this.chooseNotToSelfIdentifyOption = this.page.getByText('I Choose Not To Self-Identify.');
        this.noDisability2023 = this.page.locator('#ofccpdisability2023_NotDisabledField').getByText('No, I do not have a');
        this.noDisabilityPost2023 = this.page.locator('#ofccpdisabilitypost2023_NotDisabledField').getByText('No, I do not have a');
        this.noDisability2020 = this.page.locator('#ofccpdisability2020_NotDisabledField');
        this.noDisabilityPost2020 = this.page.locator('#ofccpdisabilitypost2020_NotDisabledField').getByText('No, I Don\'t Have A Disability');
        this.noDisabilityOld = this.page.locator('#ofccpdisability_NotDisabledField').getByText('NO, I DON’T HAVE A DISABILITY');
        this.noDisabilityPostOld = this.page.locator('#ofccpdisabilitypost_NotDisabledField').getByText('NO, I DON’T HAVE A DISABILITY');
        this.disabledStatusNo = this.page.locator('#disabledstatus_NField').getByText('No');
        this.notApplicableOption = this.page.getByText('Not Applicable');
        this.hiringStageDropdown = this.page.getByRole('combobox', { name: 'Hiring Stage' });
        this.expectedStartDateField = this.page.getByRole('textbox', { name: 'Expected Start Date *' });
        this.salaryAgreementField = this.page.getByRole('textbox', { name: 'Salary Agreement (Offered)' });
        this.cityField = this.page.getByRole('textbox', { name: 'City' });
        this.positionLocationField = this.page.getByRole('textbox', { name: 'Position Location' });
        this.continueButton = this.page.getByRole('button', { name: 'Continue' });
        this.approversDropdown = this.page.getByRole('textbox', { name: 'Approvers' });
        this.approverSaveButton = this.page.getByRole('button', { name: 'Save' });
        this.approversThreeDotLinks = this.page.locator('#main div').filter({ hasText: 'Offer Approvals Return to Job' }).locator('i');
        this.approveButton = this.page.getByRole('button', { name: 'Approve' });
        this.commentTextArea = this.page.locator('#todo-todo-list__comment-field');
        this.confirmButton = this.page.getByRole('button', { name: 'Confirm' });
        this.taskListIcon = this.page.getByRole('link', { name: 'Task List' });
        this.closeJobDropdown = this.page.getByLabel('Close this job? *');
        this.hiredStageLabel = this.page.locator('.ui-lib-cr-MuiSelect-select');
        this.resumeSummaryTab = this.page.locator('#tab-summaryTab');
        this.editResumeButton = this.page.getByRole('button', { name: 'Edit', exact: true });
        this.resumeCVTab = this.page.locator('#tab-resumeTab');
        this.activityStatusTab = this.page.locator('#tab-activityTab');
        this.evaluationsTab = this.page.locator('#tab-evaluationsTab');
        this.editEvaluationsButton = this.page.getByRole('button', { name: 'Edit Evaluations' });
        this.contactROSIOutreachNButton = this.page.getByRole('button', { name: 'Contact (ROSI Outreach)' });
        this.contactROSIOutreachJobPostingDropdown = this.page.locator('#associatedJobId_input');
        this.continueButtonROSIOutreach = this.page.locator('#btnContinueWithContactPoweredByAIModal');
        this.emailSubjectROSIOutreach = this.page.locator('input#emailSubject_input[type="text"]');
        this.generateROSIEmailOutreach = this.page.locator('#generatePersonalizedEmailWithAIBtn');
        this.manageNotesButton = this.page.locator('button[aria-label="Manage Notes"]');
        this.notesModal = this.page.locator('div[role="dialog"][aria-labelledby="contact-notes-dialog-title"]');
        this.notesTextArea = this.page.locator('textarea[aria-label="Notes"]');
        this.editNotesButton = this.page.locator('button', { hasText: 'Edit' }).nth(1);
        this.saveNotesButton = this.page.locator('button', { hasText: 'Save' }).nth(3);
        this.clearAllButton = this.page.locator('button', { hasText: 'Clear All' });
        
    }

    async navigateToCandidateProfile() {
        await this.candidateNavLocator.click();
        await this.candidatePoolNavLocator.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async searchCandidateAndOpenCRP(candidateName){
        await this.editSearchButton.click();
        await this.clearFiltersButton.click();
        await this.candidateNameField.fill(candidateName);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.firstCandidateNameTableLocator.click();
        await this.page.waitForLoadState('load');
    }

    async addComment(comment) {
        await this.takeActionButton.click();
        await this.addCommentMenuItem.click();
        await this.page.locator('#resumeComments_Modal').waitFor({ state: 'visible' });
        await this.resumeCommentTextArea.fill(comment);
        await this.saveButton.click();
    }

    async selectAutocompleteOption(dropdown, value) {
        await dropdown.click();
        await dropdown.pressSequentially(value, { delay: 30 });
        await this.page.waitForLoadState('domcontentloaded');
        await dropdown.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${value}")`);
    }

    async requestReview(recipient, subject) {
        await this.takeActionButton.click();
        await this.requestReviewMenuItem.click();
        await this.subjectField.fill(subject);
        await this.selectAutocompleteOption(this.internalRecipientsDropdown, recipient);
        await this.resumeCVTabHtmlCheckbox.check();
        await this.saveButtonRequestReview.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async completeReview(comment) {
        const newPagePopupPromise = this.page.waitForEvent('popup');
        await this.takeActionButton.click();
        await this.completeReviewMenuItem.click();
        const newpagePopup = await newPagePopupPromise;
        await newpagePopup.getByLabel('Please evaluate candidate to').selectOption('1');
        await newpagePopup.getByRole('textbox', { name: 'You may provide a comment for' }).fill(comment);
        await newpagePopup.getByRole('button', { name: 'Save' }).click();
    }
    
    async isCompleteReviewButtonExist() {
        await this.takeActionButton.click();
        return await this.completeReviewMenuItem.isVisible();
    }

    async waitForEmailBodyToLoad() {
        await this.page.waitForFunction(() => {
            const iframe = document.querySelector('#txtEmailMsg_ifr');
            const body = iframe?.contentDocument?.querySelector('body#tinymce');
            return body && body.innerText.trim().length > 0;
        }, { timeout: 15000 });
    }

    async waitForDropdownOption(label) {
        await this.page.waitForFunction(
            (label) => {
                const selects = document.querySelectorAll('select');
                for (const select of selects) {
                    const hasOption = Array.from(select.options).some(opt => opt.text === label);
                    if (hasOption) return true;
                }
                return false;
            },
            label,
            { timeout: 15000 }
        );
    }

    async sendEmail(template){
        await this.takeActionButton.click();
        await this.sendEmailMenuItem.click();
        await this.page.waitForLoadState('networkidle');
        await this.emailTemplateDropdown.waitFor({ state: 'visible' });
        await this.waitForDropdownOption(template);
        await this.emailTemplateDropdown.selectOption({ label: template });
        await this.emailSubjectField.fill(template);
        await this.waitForEmailBodyToLoad();
        await this.saveButtonRequestReview.click();
    }

    async createNewProfile(jobPosting) {
        await this.takeActionButton.click();
        await this.createNewProfileMenuItem.click();
        await this.selectAutocompleteOption(this.associateWithJobPostingDropdown, jobPosting);
        await this.page.selectOption('#to_folder', { label: '3rd Party Sourced' });
        await this.createNewProfileSaveButton.click();
    }

    async deleteThisProfile() {
        await this.takeActionButton.click();
        await this.deleteThisProfileMenuItem.click();
        await this.confirmDelete.click();
    }

    async changeJob(jobPosting) {
        await this.takeActionButton.click();
        await this.changeJobMenuItem.click();
        await this.selectAutocompleteOption(this.associateWithJobPostingDropdown, jobPosting);
        await this.page.selectOption('#to_folder', { label: 'Internet Applicant' });
        await this.changeJobSaveButton.click();
    }

    getHiringStageDropdownValue() {
        return this.page.locator('.ui-lib-cr-MuiSelect-select');
    }

    getJobHeadingLocator(jobPosting) {
        return this.page.locator('p.ui-lib-cr-MuiTypography-root', { hasText: jobPosting });
    }

    async employeeProfile(profile) {
        await this.takeActionButton.click();
        const page1Promise = this.page.waitForEvent('popup');
        await this.employeeProfileMenuItem.click();
        const page1 = await page1Promise;
        await page1.getByRole('textbox', { name: 'Department' }).fill(profile.employeeProfileDepartment);
        await page1.getByRole('textbox', { name: 'Supervisor' }).fill(profile.employeeProfileSupervisor);
        await page1.getByRole('textbox', { name: 'Position Title' }).fill(profile.employeeProfilePositionTitle);
        await page1.getByRole('textbox', { name: 'Work Phone No. Work Location' }).fill(profile.employeeProfileWorkPhoneNo);
        await page1.locator('#currlocation').selectOption(profile.employeeProfileWorkLocation);
        await page1.getByRole('button', { name: 'Save' }).click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.employeeTab.click();
    }

    getLabeledFieldLocator(label) {
        return this.page.locator(`.ui-form-item:has-text("${label}") .ui-formfield`);
    }

    async getCandidateNameFromCard(cardLocator) {
        return await cardLocator.locator('h3 a').textContent();
    }

    async evaluationRanking(ranking){
        await this.takeActionButton.click();
        const page1Promise = this.page.waitForEvent('popup');
        await this.evaluationRankingMenuItem.click();
        const page1 = await page1Promise;
        for (let i = 1; i <= 10; i++) {
            await page1.locator(`#grade${i}_3_992287Field`).getByText(ranking).click();
        }
        await page1.getByRole('button', { name: 'Save' }).click();
        await this.page.getByRole('tab', { name: 'Evaluations' }).click();
    }

    async getRankingScoreValue() {
        const container = this.page.locator('.ui-form-item-horizontal', {
            has: this.page.locator('label.lifesuite__input-label', { hasText: 'Ranking Criteria Score' })
        });
        return await container.locator('.ui-formfield').innerText();
    }

    async changeDisposition(disposition){
        await this.takeActionButton.click();
        await this.changeDispositionMenuItem.click();
        await this.page.selectOption('#modalFormChangeDisposition_dispositionId', { label: disposition });
        await this.saveButtonRequestReview.click();
    }

    async getDispositionValue() {
        const dispositionSection = this.page.locator('div:has(> p:has-text("Disposition"))');
        return await dispositionSection.locator('span.ui-lib-cr-MuiChip-label').innerText();
    }
    
    async removeDisposition(){
        await this.takeActionButton.click();
        await this.removeDispositionMenuItem.click();
        await this.removeDispositionOkayButton.click();
    }

    async eeoProfile(){
        await this.takeActionButton.click();
        await this.eeoProfileMenuItem.click();
        await this.femaleOption.click();
        await this.candidateQuestionDropdown.selectOption('1');
        await this.identifyAsOption.click();
        await this.chooseNotToSelfIdentifyOption.click();
        await this.noDisability2023.click();
        await this.noDisabilityPost2023.click();
        await this.noDisability2020.click();
        await this.noDisabilityPost2020.click();
        await this.noDisabilityOld.click();
        await this.noDisabilityPostOld.click();
        await this.disabledStatusNo.click();
        await this.notApplicableOption.click();
        await this.saveButtonRequestReview.click();
    }

    async changeHiringStage(stageName) {
        await this.hiringStageDropdown.click();
        await this.page.getByText(stageName, { exact: true }).first().click();
    }

    async redirectToCRP(resume){
        await this.page.getByRole('link', { name: resume }).click();
    }

    async changeHiringStageOfferApproval(expectedStartDate, salaryAgreement, city, positionLocation, approverName, resume){
        await this.changeHiringStage('Offer Approval');
        await this.expectedStartDateField.fill(expectedStartDate);
        await this.salaryAgreementField.fill(salaryAgreement);
        await this.cityField.fill(city);
        await this.positionLocationField.fill(positionLocation);
        await this.continueButton.click();
        this.page.once('dialog', async dialog => {
            await dialog.accept();
        });
        await this.page.waitForLoadState('load');
        await this.selectAutocompleteOption(this.approversDropdown, approverName);
        await this.approverSaveButton.click();
        await this.page.waitForLoadState('load');
        await this.approversThreeDotLinks.click();
        await this.redirectToCRP(resume);
        await this.redirectToCRP(resume);
    }

    async acceptOffer(){
        await this.candidatesBulkActionPage.taskListIcon.click();
        await this.page.waitForLoadState('load');
        await this.approveButton.click();
        await this.commentTextArea.fill('Test');
        await this.confirmButton.click();
        await this.candidatePoolNavLocator.click();
    }

    async changeHiringStageToHired() {
        await this.changeHiringStage('Hired');
        await this.closeJobDropdown.selectOption('no');
        await this.continueButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async editSummaryResume(resume){
        const page1Promise = this.page.waitForEvent('popup');
        await this.editResumeButton.click();
        const resumePopup = await page1Promise;
        await resumePopup.getByRole('textbox', { name: 'Skill Set' }).fill(resume.skillSet);
        await resumePopup.getByRole('textbox', { name: 'University/College Degree' }).fill(resume.universityDegree);
        await resumePopup.getByRole('textbox', { name: 'Professional Certifications' }).fill(resume.professionalCertifications);
        await resumePopup.getByLabel('Current job type').selectOption(resume.currentJobType);
        await resumePopup.getByLabel('Desired job type').selectOption(resume.desiredJobType);
        await resumePopup.getByLabel('Desired Career Level').selectOption(resume.desiredCareerLevel);
        await resumePopup.getByRole('textbox', { name: 'Salary Requirement/' }).fill(resume.salaryRequirement);
        await resumePopup.getByLabel('Relocation willingness').selectOption(resume.relocationWillingness);
        await resumePopup.getByRole('textbox', { name: 'Years of Experience' }).fill(resume.yearsOfExperience);
        await resumePopup.getByRole('button', { name: 'Save' }).click();
    }

    getSummaryLocators(labelText){
        return this.page.locator('.ui-form-item', {has: this.page.locator('div.ui-form-label', { hasText: labelText })}).locator('.ui-formfield');
    }

    async viewResumeCVTabContent(){
        await this.resumeCVTab.click();
        return this.page.locator('.ui-form-item-vertical').first();
    }

    async editResumeCVTabContent(resumeContent){
        await this.resumeCVTab.click();
        await this.page.waitForLoadState('networkidle');
        await this.editResumeButton.click();
        const frame = this.page.frameLocator('#resumeContent_ifr');
        await frame.locator('body#tinymce').fill(resumeContent);
        await this.approverSaveButton.click();
    }

    async updateActivityStatusTab(date, flag) {
        await this.activityStatusTab.click();
        await this.page.waitForLoadState('networkidle');

        const initiationDate = flag === 1 ? date.initiationDate : '';
        const completedDate = flag === 1 ? date.completedDate : '';
        const shouldCheck = flag === 1;

        for (let i = 1; i <= 7; i++) {
            await this.page.locator(`input[name="flagno${i}"]`).setChecked(shouldCheck);
            await this.page.locator(`#initdateno${i}`).fill(initiationDate);
            await this.page.locator(`#cmdateno${i}`).fill(completedDate);
        }

        await this.approverSaveButton.click();
    }

    async getActivityRowValues(index) {
        const flagChecked = await this.page.locator(`input[name="flagno${index}"]`).isChecked();
        const initDate = await this.page.locator(`#initdateno${index}`).inputValue();
        const compDate = await this.page.locator(`#cmdateno${index}`).inputValue();

        return {
            flagChecked,
            initDate,
            compDate,
        };
    }
    
    async editEvaluations(ranking){
        await this.evaluationsTab.click();
        await this.page.waitForLoadState('networkidle');
        const page1Promise = this.page.waitForEvent('popup');
        await this.editEvaluationsButton.click();
        const page1 = await page1Promise;
        for (let i = 1; i <= 10; i++) {
            await page1.locator(`#grade${i}_3_992287Field`).getByText(ranking).click();
        }
        await page1.getByRole('button', { name: 'Save' }).click();
    }

    async viewEvaluationsTab(){
        await this.evaluationsTab.click();
        await this.page.waitForLoadState('networkidle');
    }

    async contactROSIOutreach(ROSIJobPosting){
        await this.contactROSIOutreachNButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForFunction(
            () => {
                const buttons = document.querySelectorAll('button');
                for (const btn of buttons) {
                    if (btn.textContent.includes('Contact (ROSI Outreach)') && !btn.disabled) {
                        return true;
                    }
                }
                return false;
            },
            { timeout: 30000 }
        );
        await this.contactROSIOutreachNButton.click();
        await this.selectAutocompleteOption(this.contactROSIOutreachJobPostingDropdown, ROSIJobPosting);
        await this.continueButtonROSIOutreach.click();
        await this.page.waitForSelector('#sendEmailGenAIOutreach_Modal', { state: 'visible' });
        await this.emailSubjectROSIOutreach.pressSequentially('%%');
        const dropdown = this.page.locator('ul.ui-autocomplete[role="listbox"]').first();
        await dropdown.waitFor({ state: 'visible' });
        await this.page.waitForLoadState('domcontentloaded');
        await dropdown.locator('li >> a').nth(2).click();
        await this.generateROSIEmailOutreach.click();
        const sendButton = this.page.locator('#btnSendContactPoweredByAI');
        await sendButton.waitFor({ state: 'visible' });
        await this.page.waitForFunction(
            (el) => !el.disabled,
            await sendButton.elementHandle()
        );
        await sendButton.click();
    }

    async viewManageNotesLinkVisibility(){
        await this.page.waitForLoadState('networkidle');
        const isVisible = await this.manageNotesButton.isVisible();
        const isEnabled = await this.manageNotesButton.isEnabled();

        return isVisible && isEnabled;
    }

    async isNotesModalVisible(){
        await this.manageNotesButton.click();
        await this.page.waitForLoadState('networkidle');
        const isVisible = await this.notesModal.isVisible();

        return isVisible;
    }

    async isNotesEmpty(){
        const placeholder = await this.notesTextArea.getAttribute('placeholder');

        return placeholder === 'No notes yet. Click EDIT to add.';
    }

    async saveNotes(note){
        await this.manageNotesButton.click();
        await this.editNotesButton.click();
        await this.notesTextArea.fill(note);
        await this.saveNotesButton.click();

    }

    // Saved notes are auto-prefixed with a datestamp, e.g. "[08-Sep-2026 10:09:56] - {note}"
    async getNotesValue(){
        return this.notesTextArea.inputValue();
    }

    async isUpdateAlertShown() {
        await this.page.getByText('Notes have been changed.').waitFor({ state : 'visible' });
        return true;
    }

    async clearNotes(){
        await this.manageNotesButton.click();
        await this.editNotesButton.click();
        await this.clearAllButton.click();
        await this.saveNotesButton.click();
    }
}

module.exports = CandidateResumeProfilePage;