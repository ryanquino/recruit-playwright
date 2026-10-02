const BasePage = require('../base.page.js');

class ManageRequisitionPage extends BasePage {
    constructor(page, candidateData) {
        super(page);
        this.page = page;
        this.data = candidateData;

         // Define all locators
         this.jobsMenuItem = this.page.getByLabel('Jobs', { exact: true });
         this.manageRequisitionsMenuItem = this.page.getByLabel('Create Requisition').getByText('Create Requisition').first();
         this.viewAsRecruiterDropdown = this.page.getByLabel('View as Recruiter:');
         this.requisitionsTable = this.page.locator('table.rival-table');
         this.jobCreatorDropdown = this.page.locator('#iReqMgrID');
         this.internalJobTitleField = this.page.getByRole('textbox', { name: 'Internal Job Title *' });
         this.postedJobTitleField = this.page.getByRole('textbox', { name: 'Posted Job Title' });
         this.trackingCodeField = this.page.getByRole('textbox', { name: 'Tracking Code' });
         this.numberOfPositionsField = this.page.getByRole('textbox', { name: 'Number of Positions' });
         this.jobLevelDropdown = this.page.getByLabel('Job Level');
         this.expectedStartDate = this.page.getByRole('textbox', { name: 'Expected Start Date' });
         this.countryDropdown = this.page.getByLabel('Country *');
         this.addressLineField = this.page.getByRole('textbox', { name: 'Address Line 1' });
         this.cityField = this.page.getByRole('textbox', { name: 'City *' });
         this.stateDropdown = this.page.getByLabel('State');
         this.zipCodeField = this.page.getByRole('textbox', { name: 'Zip/Postal Code *' });
         this.travelDropdown = this.page.getByLabel('Travel');
         this.minimumSalaryField = this.page.getByRole('textbox', { name: 'Salary Minimum' });
         this.maximumSalaryField = this.page.getByRole('textbox', { name: 'Salary Maximum' });
         this.levelOfEducationDropdown = this.page.getByLabel('Level of Education');
         this.yearsOfExperienceDropdown = this.page.getByLabel('Years of Experience');
         this.departmentDropdown = this.page.getByRole('textbox', { name: 'Type information to search...' });
         this.budgetedSalaryField = this.page.getByRole('textbox', { name: 'Budgeted Salary' });
         this.referralBonusField = this.page.getByRole('textbox', { name: 'Referral Bonus *' });
         this.referralPointsField = this.page.getByRole('textbox', { name: 'Referral Points' });
         this.jobDescriptionRTE = this.page.locator('#jobdescription_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.requiredSkillsRTE = this.page.locator('#requiredskills_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.requiredExperienceRTE = this.page.locator('#experience_rqd_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.notesOnPositionRTE = this.page.locator('#notes_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.internalSkillsRTE = this.page.locator('#skills_notes_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.exemptStatusDropdown = this.page.getByLabel('Exemption Status *');
         this.collectEEODropdown = this.page.getByLabel('Collect EEO for this job? *');
         this.saveAndRouteForApprovalButton = this.page.getByRole('button', { name: 'Save and Route for Approval' }).nth(1);
         this.approversDropdown = this.page.getByRole('textbox', { name: 'Approvers' });
         this.saveButton = this.page.getByRole('button', { name: 'Save' });
         this.requisitionsHelpLink = this.page.locator('form').filter({ hasText: 'View as Recruiter: [All]' }).locator('div').first();
         this.createRequisitionLink = this.page.locator('#main').getByRole('listitem').filter({ hasText: 'Create Requisition' });
         this.jobDurationDropdown = this.page.locator('#duration');
         this.toDoTaskLink = this.page.getByRole('link', { name: '' });
         this.approveRequisitionButton = this.page.getByRole('button', { name: 'Approve' }).first();
         this.commentField = this.page.getByRole('textbox', { name: 'Comments' });
         this.confirmButton = this.page.getByRole('button', { name: 'Confirm' });
         this.reviewInSequenceCheckbox = this.page.getByRole('checkbox', { name: 'Review In Sequence' });
         this.sendApprovalEmailCheckbox = this.page.getByRole('checkbox', { name: 'Send Approval Emails' });
         this.requisitionLinks = this.page.getByRole('row', { name: 'Approved Playwright' }).locator('i').first();
         this.postLink = this.page.locator('#frmMain').getByRole('listitem').filter({ hasText: 'Post' });
         this.repliesEmailedToDropdown = this.page.getByLabel('Replies emailed to *');
         this.continueButton = this.page.getByRole('button', { name: 'Continue' });
         this.businessUnitDropdown = this.page.getByLabel('Business Unit *');
         this.selectCategory = this.page.getByRole('radio', { name: 'Accounting and Finance' });
         this.questionSelectionCompletedButton = this.page.getByRole('button', { name: 'Question Selection Completed' });
         this.finishAndReturnButton = this.page.getByRole('button', { name: 'Finish and Return' });
         this.jobTrackingMenuItem = this.page.getByText('Job Tracking', { exact: true });
         this.editSearchLink = this.page.getByText('Edit Search');
         this.jobTitleOrCodeField = this.page.getByRole('textbox', { name: 'Job Title or Code' });
         this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
         this.checkAllItemsCheckbox = this.page.locator('#checkAllItems');
         this.takeActionDropdown =this.page.getByRole('link', { name: 'Take Action ' });
         this.deactivateLink = this.page.getByText('Deactivate');
         this.deactivateSaveButton = this.page.locator('#bulkActionModalSave');
         this.tableRow = this.page.getByRole('row');
         this.deactivateSuccessAlertLocator = this.page.locator('div').filter({ hasText: 'Your edit was successful!' }).nth(1);
         this.evergreenJobNo = this.page.locator('#isEvergreen_0');
         this.evergreenJobYes = this.page.locator('#isEvergreen_1');
         this.requisitionsTableFirstRow = this.page.getByRole('row', { name: 'Playwright Evergreen Requisition' }).locator('i').first();
         this.requisitionsEditLink = this.page.getByRole('link', { name: 'Edit' });
         this.requisitionsDeleteButton = this.page.getByRole('button', { name: 'Delete' }).first();
         this.confirmDeleteModal = this.page.locator('#confirm_req_delete_ModalButtonPrimary');
    }

    async navigateToManageRequisitionsPage() {
        await this.jobsMenuItem.click();
        await this.manageRequisitionsMenuItem.click();
        await this.page.waitForLoadState('load');
    }

    async doesRequisitionsTableHaveResults(){
        return (await this.tableRow.count()) > 0;

    }

    // create requisition 
    async createRequisition(requisition, isEvergreenJob) {
        await this.requisitionsHelpLink.click();
        await this.createRequisitionLink.click();
        await this.fillPositionDetails(requisition, isEvergreenJob);
        await this.fillJobDescriptionDetails(requisition);
        await this.completeApprovalProcess(requisition);
    }

    // fill position details
    async fillPositionDetails(requisition, isEvergreenJob) {
        if(isEvergreenJob) {
            await this.evergreenJobYes.check();
            await this.internalJobTitleField.fill(requisition.evergreenJobTitle);
            await this.postedJobTitleField.fill(requisition.evergreenJobTitle);    
        }
        else{
            await this.evergreenJobNo.check();
            await this.internalJobTitleField.fill(requisition.internalJobTitle);
            await this.postedJobTitleField.fill(requisition.postedJobTitle);
        }
        await this.trackingCodeField.fill(requisition.trackingCode);
        await this.numberOfPositionsField.fill(requisition.numberOfPositions);
        await this.jobLevelDropdown.selectOption(requisition.jobLevel);
        await this.jobDurationDropdown.selectOption(requisition.jobDuration);
        await this.expectedStartDate.fill(requisition.expectedStartDate);
        await this.countryDropdown.selectOption(requisition.country);
        await this.addressLineField.fill(requisition.address);
        await this.cityField.fill(requisition.city);
        await this.stateDropdown.selectOption(requisition.state);
        await this.zipCodeField.fill(requisition.zipCode);
        await this.travelDropdown.selectOption(requisition.travel);
        await this.jobCreatorDropdown.click();
        await this.jobCreatorDropdown.selectOption(requisition.jobCreator);
        await this.minimumSalaryField.fill(requisition.salaryMinimum);
        await this.maximumSalaryField.fill(requisition.salaryMaximum);
        await this.levelOfEducationDropdown.selectOption(requisition.levelOfEducation);
        await this.yearsOfExperienceDropdown.selectOption(requisition.yearsOfExperience);
        await this.departmentDropdown.click();
        await this.departmentDropdown.fill(requisition.department);
        await this.departmentDropdown.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${requisition.department}")`);
        await this.budgetedSalaryField.fill(requisition.budgetedSalary);
        await this.referralBonusField.fill(requisition.referralBonus);
        await this.referralPointsField.fill(requisition.referralPoints);
    }

    // fill job description details
    async fillJobDescriptionDetails(requisition) {
        await this.jobDescriptionRTE.fill(requisition.jobDescription);
        await this.requiredSkillsRTE.fill(requisition.requiredSkills);
        await this.requiredExperienceRTE.fill(requisition.requiredExperience);
        await this.internalSkillsRTE.fill(requisition.internalSkills);
        await this.notesOnPositionRTE.fill(requisition.internalNotes);
        await this.exemptStatusDropdown.selectOption(requisition.exemptStatus);
        await this.collectEEODropdown.selectOption(requisition.collectEEO);
        await this.saveAndRouteForApprovalButton.click();
    }

    // complete approval process
    async completeApprovalProcess(requisition) {
        await this.reviewInSequenceCheckbox.uncheck();
        await this.reviewInSequenceCheckbox.check();      
        await this.selectApprovers(requisition.approvers);
        await this.sendApprovalEmailCheckbox.uncheck();
        await this.sendApprovalEmailCheckbox.check();
        await this.saveButton.click();
    }

    // select approvers
    async selectApprovers(approvers) {
        await this.approversDropdown.click();
        await this.approversDropdown.pressSequentially(approvers, { delay: 30 });
        await this.approversDropdown.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${approvers}")`);
    }

    async getApproversTableLocator(jobCreator){
        return this.page.locator(`#approvalResultsTable tbody tr td:first-child`, { hasText: jobCreator });
    }

    async getRequisitionsTableLocator(jobTitle){
        await this.manageRequisitionsMenuItem.click();
        await this.page.waitForLoadState('load');
        return this.page.locator(`table:has-text("Requisition (Tracking Code) Location Name (Location Code)") td:has-text("${jobTitle}")`).first();   
    }

    async approveRequisition(){
        await this.toDoTaskLink.click();
        await this.page.waitForLoadState('load');
        await this.approveRequisitionButton.click();
        await this.commentField.fill('approve comment');
        await this.confirmButton.click();
    }

    async postRequisition() {
        await this.manageRequisitionsMenuItem.click();
        await this.page.waitForLoadState('load');
        await this.requisitionLinks.click();    
        await this.postLink.click();
        await this.fillJobPostPositionDetails();
        await this.fillDepartmentAndBudgetDetails();
        await this.completePrioritySection();
        await this.selectCategorySection();
        await this.handleDuplicateCheck();
        await this.attachFiles();
        await this.completeQuestionSelection();
        await this.finishPosting();
    }

    // fill position details
    async fillJobPostPositionDetails() {
        await this.repliesEmailedToDropdown.selectOption('jobhosting@silkroadtech.com');
        await this.continueButton.click();
    }

    // fill department and budget details 
    async fillDepartmentAndBudgetDetails() {
        await this.businessUnitDropdown.selectOption('1');
        await this.continueButton.click();
    }

    // complete priority section
    async completePrioritySection() {
        await this.continueButton.click();
    }

    // category section
    async selectCategorySection() {
        await this.selectCategory.check();
        await this.continueButton.click();
    }

    // handle duplicate check 
    async handleDuplicateCheck() {
        await this.page.waitForLoadState('load');
        const isDuplicate = await this.page
            .getByRole('heading', { name: 'Possible Duplicate Heading' })
            .isVisible();
        if (isDuplicate) {
            await this.continueButton.click();
        }
    }

    // attachments
    async attachFiles() {        
        await this.continueButton.click();
    }

    // complete question selection
    async completeQuestionSelection() {
        await this.questionSelectionCompletedButton.click();
    }

    // finish posting
    async finishPosting() {
        await this.finishAndReturnButton.click();
    }

    async searchPostedRequisition(jobTitle){
        await this.jobTrackingMenuItem.click();
        await this.page.waitForLoadState('load');     
        await this.editSearchLink.click();
        await this.jobTitleOrCodeField.click();
        await this.jobTitleOrCodeField.fill(jobTitle);
        await this.applyFiltersButton.click();    
        await this.page.waitForLoadState('load');     
    }

    async getTableRowCount(){
        return (await this.tableRow.count()) > 0;
    }

    async deactivatePostedRequisition(){
        await this.checkAllItemsCheckbox.check();
        await this.takeActionDropdown.click();
        await this.deactivateLink.click();
        await this.deactivateSaveButton.click();
    }

    async deleteRequisition(){
        await this.requisitionsTableFirstRow.click();
        await this.requisitionsEditLink.click();
        await this.page.waitForLoadState('load');
        await this.requisitionsDeleteButton.click();
        await this.confirmDeleteModal.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}

module.exports = ManageRequisitionPage;
