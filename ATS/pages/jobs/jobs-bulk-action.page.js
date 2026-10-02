const BasePage = require('../base.page.js');

class JobsBulkActionPage extends BasePage {
    constructor(page) {
        super(page);
         
         this.jobsMenuItem = this.page.getByLabel('Jobs', { exact: true });
         this.editSearchLink = this.page.getByText('Edit Search');
         this.jobTrackingMenuItem = this.page.getByText('Job Tracking', { exact: true });
         this.clearFiltersButton = this.page.getByRole('button', { name: 'Clear Filters' });
         this.jobTitleOrCodeField = this.page.getByLabel('Job Title or Code');
         this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
         this.tableCheckbox = this.page.locator('#checkAllItems');
         this.tableRow = this.page.getByRole('row');
         this.takeActionDropdown = this.page.getByRole('link', { name: 'Take Action ' });
         this.activateLink = this.page.getByText('Activate', { exact: true });
         this.deactivateLink = this.page.getByText('Deactivate');
         this.reassignRecruiterLink = this.page.getByText('Reassign Recruiter');
         this.reassignRecruitingManagerLink = this.page.getByText('Reassign Recruiting Manager');
         this.reassignHiringManagerLink = this.page.getByText('Reassign Hiring Manager');
         this.reassignRepliesEmailToLink = this.page.getByText('Reassign Replies Emailed To');
         this.reassignBusinessUnitLink = this.page.getByText('Reassign Business Unit');
         this.reassignDepartmentLink = this.page.getByText('Reassign Department');
         this.reassignCategoryLink = this.page.getByText('Reassign Category');
         this.reassignCompanyLocationLink = this.page.getByText('Reassign Company Location');
         this.addAdditionalLocationLink = this.page.getByText('Add Additional Location');
         this.removeAdditionalLocationLink = this.page.getByText('Remove Additional Location');
         this.addFeeAgencyLink = this.page.getByText('Assign to Fee Agency');
         this.removeFeeAgencyLink = this.page.getByText('Remove From Fee Agency');
         this.reassignRecruiterDropdown = this.page.locator('#newAssigneeId_input');
         this.reassignBusinessUnitDropdown = this.page.locator('#newBusinessUnitId_input');
         this.reassigDepartmentDropdown = this.page.locator('#newDepartmentId_input');
         this.reassigCategoryDropdown = this.page.locator('#newCategoryId_input');
         this.reassigCompanyLocationDropdown = this.page.locator('#newCompanyLocationId_input');
         this.addAdditionalLocationDropdown = this.page.locator('#addCompanyLocationId_input');
         this.removeAdditionalLocationDropdown = this.page.locator('#removeCompanyLocationId_input');
         this.addFeeAgencyDropdown = this.page.locator('#addFeeAgencyId_input');
         this.bulkActionModalSave = this.page.locator('#bulkActionModalSave');
         this.successModalLocator = this.page.locator('div').filter({ hasText: 'Your edit was successful!' }).nth(1);
         this.dropdownSummary = this.page.getByLabel('Perform Another Bulk Action');
         this.goButton = this.page.locator('#bulkActionModalGo');

    }

    getValidationError(message){
        return this.page.getByText(message, { exact: true });
    }

    async navigateToJobTrackingPage() {
        await this.jobsMenuItem.click();
        await this.jobTrackingMenuItem.click();
        await this.page.waitForLoadState('load');
    }

    async searchJobsAndClickCheckbox(jobTitle){
        await this.editSearchLink.click();
        await this.clearFiltersButton.click();
        await this.jobTitleOrCodeField.fill(jobTitle);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.tableCheckbox.check();
    }

    async deactivateJobPosting(){
        await this.takeActionDropdown.click();      
        await this.deactivateLink.click();
        await this.bulkActionModalSave.click();     
    }

    async activateJobPosting(){
        await this.takeActionDropdown.click();      
        await this.activateLink.click();
        await this.bulkActionModalSave.click();     
    }
    
    async reassignManagers(recruiter, role){
        await this.takeActionDropdown.click();
        if(role == 'recruiter')await this.reassignRecruiterLink.click();  
        else if(role == 'recruitingManager') await this.reassignRecruitingManagerLink.click();  
        else if(role == 'hiringManager') await this.reassignHiringManagerLink.click();  
        else if(role == 'repliesEmailTo') await this.reassignRepliesEmailToLink.click();  
        await this.reassignRecruiterDropdown.click();
        await this.reassignRecruiterDropdown.pressSequentially(recruiter, { delay: 30 });
        await this.reassignRecruiterDropdown.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${recruiter}")`);
        await this.bulkActionModalSave.click();  
    }

    async reassignEntity(value, entity){
        await this.takeActionDropdown.click();
        switch(entity){
            case 'businessUnit':
                await this.reassignBusinessUnitLink.click();
                await this.reassignBusinessUnitDropdown.click();
                await this.reassignBusinessUnitDropdown.pressSequentially(value, { delay: 30 });
                await this.reassignBusinessUnitDropdown.press('ArrowDown');
                break;
            case 'department':
                await this.reassignDepartmentLink.click();
                await this.reassigDepartmentDropdown.click();
                await this.reassigDepartmentDropdown.pressSequentially(value, { delay: 30 });
                await this.reassigDepartmentDropdown.press('ArrowDown');
                break;
            case 'category':
                await this.reassignCategoryLink.click();
                await this.reassigCategoryDropdown.click();
                await this.reassigCategoryDropdown.pressSequentially(value, { delay: 30 });
                await this.reassigCategoryDropdown.press('ArrowDown');
                break;
            case 'companyLocation':
                await this.reassignCompanyLocationLink.click();
                await this.reassigCompanyLocationDropdown.click();
                await this.reassigCompanyLocationDropdown.pressSequentially(value, { delay: 30 });
                await this.reassigCompanyLocationDropdown.press('ArrowDown');
                break;
            case 'addAdditionalLocation':
                await this.addAdditionalLocationLink.click();
                await this.addAdditionalLocationDropdown.click();
                await this.addAdditionalLocationDropdown.pressSequentially(value, { delay: 30 });
                await this.addAdditionalLocationDropdown.press('ArrowDown');
                break;
            case 'removeAdditionalLocation':
                await this.removeAdditionalLocationLink.click();
                await this.removeAdditionalLocationDropdown.click();
                await this.removeAdditionalLocationDropdown.pressSequentially(value, { delay: 30 });
                await this.removeAdditionalLocationDropdown.press('ArrowDown');
                break;
            case 'addFeeAgency':
                await this.addFeeAgencyLink.click();
                await this.addFeeAgencyDropdown.click();
                await this.addFeeAgencyDropdown.pressSequentially(value, { delay: 30 });
                await this.addFeeAgencyDropdown.press('ArrowDown');
                break;
            case 'removeFeeAgency':
                await this.removeFeeAgencyLink.click();
                await this.addFeeAgencyDropdown.click();
                await this.addFeeAgencyDropdown.pressSequentially(value, { delay: 30 });
                await this.addFeeAgencyDropdown.press('ArrowDown');
                break;                                             
        }      
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${value}")`);
        await this.bulkActionModalSave.click();  
        await this.page.waitForLoadState('networkidle');
    }

    async attemptInvalidReassign(entity, invalidValue){
        await this.takeActionDropdown.click();
        switch(entity){
            case 'hiringManager':
                await this.reassignHiringManagerLink.click();
                await this.reassignRecruiterDropdown.click();
                await this.reassignRecruiterDropdown.pressSequentially(invalidValue, { delay: 30 });
                break;
            case 'businessUnit':
                await this.reassignBusinessUnitLink.click();
                await this.reassignBusinessUnitDropdown.click();
                await this.reassignBusinessUnitDropdown.pressSequentially(invalidValue, { delay: 30 });
                break;
            case 'department':
                await this.reassignDepartmentLink.click();
                await this.reassigDepartmentDropdown.click();
                await this.reassigDepartmentDropdown.pressSequentially(invalidValue, { delay: 30 });
                break;
            case 'category':
                await this.reassignCategoryLink.click();
                await this.reassigCategoryDropdown.click();
                await this.reassigCategoryDropdown.pressSequentially(invalidValue, { delay: 30 });
                break;
            case 'companyLocation':
                await this.reassignCompanyLocationLink.click();
                await this.reassigCompanyLocationDropdown.click();
                await this.reassigCompanyLocationDropdown.pressSequentially(invalidValue, { delay: 30 });
                break;
            case 'addAdditionalLocation':
                await this.addAdditionalLocationLink.click();
                await this.addAdditionalLocationDropdown.click();
                await this.addAdditionalLocationDropdown.pressSequentially(invalidValue, { delay: 30 });
                break;
        }
        await this.page.waitForLoadState('networkidle');
        await this.bulkActionModalSave.click();
    }

    async removeAdditionalLocationWithoutSelecting(){
        await this.takeActionDropdown.click();
        await this.removeAdditionalLocationLink.click();
        await this.bulkActionModalSave.click();
    }

    async revert(option, value){
        await this.dropdownSummary.selectOption(option);
        await this.goButton.click();
        await this.page.waitForLoadState('networkidle');
        switch (option) {
            case 'postings.reassignRecruiter':
            case 'postings.reassignRecruitingManager':
            case 'postings.reassignRepliesEmailedTo':
            case 'postings.reassignHiringManager':
                await this.reassignRecruiterDropdown.click();
                await this.reassignRecruiterDropdown.pressSequentially(value, { delay: 30 });
                await this.reassignRecruiterDropdown.press('ArrowDown');
                break;
            case 'postings.reassignBusinessUnit':
                await this.reassignBusinessUnitDropdown.click();
                await this.reassignBusinessUnitDropdown.pressSequentially(value, { delay: 30 });
                await this.reassignBusinessUnitDropdown.press('ArrowDown');
                break;    
            case 'postings.reassignDepartment':
                await this.reassigDepartmentDropdown.click();
                await this.reassigDepartmentDropdown.pressSequentially(value, { delay: 30 });
                await this.reassigDepartmentDropdown.press('ArrowDown');
                break;
            case 'postings.reassignCategory':
                await this.reassigCategoryDropdown.click();
                await this.reassigCategoryDropdown.pressSequentially(value, { delay: 30 });
                await this.reassigCategoryDropdown.press('ArrowDown');
                break;
            case 'postings.reassignCompanyLocation':
                await this.reassigCompanyLocationDropdown.click();
                await this.reassigCompanyLocationDropdown.pressSequentially(value, { delay: 30 });
                await this.reassigCompanyLocationDropdown.press('ArrowDown');
                break;
        }    
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${value}")`);
        await this.bulkActionModalSave.click();  
    }
}

module.exports = JobsBulkActionPage;
