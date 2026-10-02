const BasePage = require('../base.page.js');

class CreateJobPostingPage extends BasePage {
    constructor(page) {
        super(page);

         // Define all locators
         this.jobsMenuItem = this.page.getByLabel('Jobs', { exact: true });
         this.createJobPostingNavLink = this.page.getByLabel('Create Job Posting');
         this.jobTrackingMenuItem = this.page.getByLabel('Job Tracking').getByText('Job Tracking');
         this.assignedRecruiterDropdown = this.page.getByLabel('Assigned Recruiter *');
         this.internalJobTitleField = this.page.getByLabel('Internal Job Title *');
         this.postedJobTitleField  = this.page.getByLabel('Posted Job Title');
         this.expectedStartDate = this.page.getByLabel('Expected Start Date');
         this.trackingCodeField = this.page.getByLabel('Tracking Code');
         this.jobLevelDropdown = this.page.getByLabel('Job Level');
         this.cityField = this.page.getByLabel('City *');
         this.zipCodeField = this.page.getByLabel('Zip/Postal Code *');
         this.stateDropdown = this.page.getByLabel('State');
         this.eeo1JobCategoryDropdown = this.page.getByLabel('EEO-1 Job Category *');
         this.travelDropdown = this.page.getByLabel('Travel');
         this.salaryMinimumField = this.page.getByLabel('Minimum Salary');
         this.salaryMaximumField = this.page.getByLabel('Maximum Salary');
         this.salaryTypeDropdown = this.page.getByLabel('Salary Type');
         this.yearsOfExperienceDropdown = this.page.getByLabel('Years of Experience');
         this.levelOfEducationDropdown = this.page.getByLabel('Level of Education');
         this.referralBonusField = this.page.getByLabel('Referral Bonus *');
         this.referralPointsField = this.page.getByLabel('Referral Points');    
         this.positionTypeDropdown = this.page.getByLabel('Position Type');       
         this.salaryCurrencyDropdown = this.page.getByLabel('Salary Currency');
         this.jobDescriptionRTE = this.page.locator('#jobdescription_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.requiredSkillsRTE = this.page.locator('#requiredskills_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.requiredExperienceRTE = this.page.locator('#experience_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.internalDescriptionRTE = this.page.locator('#internaldesc_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.internalSkillsRTE = this.page.locator('#internalskills_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.exemptStatusDropdown = this.page.getByLabel('Exemption Status *');
         this.collectEEODropdown = this.page.getByLabel('Collect EEO for this job? *');
         // Custom fields (first page, same section as Collect EEO)
         this.jobGradeField = this.page.locator('#worldco_jobgrade_cstfld');
         this.customFieldTextInput = this.page.locator('#customfieldtext_cstfld');
         this.customFieldTextareaInput = this.page.locator('#customfieldtextarea_cstfld');
         this.customFieldDropdown = this.page.locator('#customfielddropdown_cstfld');
         this.customFieldMultiselect = this.page.locator('#customfieldmultiselect_cstfld');
         this.automatedEmailForImportedCandidatesLabel = this.page.getByText('Automated Email for Imported and Manually Uploaded Candidates');
         this.automatedEmailForImportedCandidatesDropdown = this.page.getByLabel('Automated Email for Imported and Manually Uploaded Candidates');
         this.continueButton = this.page.getByRole('button', { name: 'Continue' })
         this.businessUnitDropdown = this.page.getByLabel('Business Unit *');
         this.departmentDropdown = this.page.locator('#department_id_label');
         this.hiringManagerDropdown = this.page.locator('#HireManager_label');
         this.industryDropdown = this.page.getByLabel('Industry');
         this.budgetedSalaryField = this.page.locator('#BudgetedSalary');
         this.selectJobCategory = this.page.getByText('Software Engineer');
         this.selectAllQuestions = this.page.getByRole('button', { name: 'Select All' });
         this.questionCompletedButton = this.page.getByRole('button', { name: 'Question Selection Completed' });
         this.finishAndReturnButton = this.page.getByRole('button', { name: 'Finish and Return' });
         this.editSearchLink = this.page.getByText('Edit Search');
         this.clearFiltersButton = this.page.getByRole('button', { name: 'Clear Filters' });
         this.jobTitleOrCodeField = this.page.getByLabel('Job Title or Code');
         this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
         this.tableRow = this.page.getByRole('row');
         this.jobHelpLinks = this.page.locator('#main div').filter({ hasText: 'Print Edit This Job Post New' }).nth(2);
         this.editJobPostingLink = this.page.getByRole('link', { name: 'Edit This Job' });
         this.saveButton = this.page.getByRole('button', { name: 'Save' });
         this.editJobPostingDepartment = this.page.getByRole('link', { name: 'Edit Job Posting - Department' });
         this.editJobPostingCategory = this.page.getByRole('link', { name: 'Edit Job Posting - Category' });
         this.editJobPostingHelpLinks = this.page.locator('#main div').filter({ hasText: 'Print Return to Job Postings' }).nth(3);
         this.takeActionDropdown = this.page.getByRole('link', { name: 'Take Action ' });
         this.deactivateLink = this.page.getByText('Deactivate');
         this.activateLink = this.page.getByText('Activate', { exact: true });
         this.deactivateModalSave = this.page.locator('#bulkActionModalSave');
         this.deactivateSuccessModalLocator = this.page.locator('div').filter({ hasText: 'Your edit was successful!' }).nth(1);
         this.evergreenJobNo = this.page.locator('#isEvergreen_0');
         this.evergreenJobYes = this.page.locator('#isEvergreen_1');
         this.possibleDuplicateHeading = this.page.getByRole('heading', { name: 'Possible Duplicate Job Posting' });

    }

    async navigateToJobPostingPage() {
        await this.jobsMenuItem.click();
        await this.createJobPostingNavLink.click(); 
    }


    async createNewJobPosting(jobPosting, isEvergreenJob) {
        await this.fillPositionDetails(jobPosting, isEvergreenJob);
        await this.fillDepartmentAndBudgetDetails(jobPosting);
        await this.fillPriorityDetails();
        await this.selectCategory(jobPosting);
        await this.handleDuplicateCheck();
        await this.attachFiles();
        await this.selectQuestions();
        await this.completeJobPosting();
    }
    
    // position details
    async fillPositionDetails(jobPosting, isEvergreenJob) {
        await this.assignedRecruiterDropdown.selectOption(jobPosting.assignedRecruiter);
        if(isEvergreenJob) {
            await this.evergreenJobYes.check();
            await this.internalJobTitleField.fill(jobPosting.evergreenJobTitle);
            await this.postedJobTitleField.fill(jobPosting.evergreenPostedJobTitle);
        }
        else {
            await this.evergreenJobNo.check();
            await this.internalJobTitleField.fill(jobPosting.internalJobTitle);
            await this.postedJobTitleField.fill(jobPosting.postedJobTitle);
        }
        await this.trackingCodeField.fill(jobPosting.trackingCode);
        await this.jobLevelDropdown.selectOption(jobPosting.jobLevel);
        await this.expectedStartDate.fill(jobPosting.expectedStartDate);
        await this.cityField.fill(jobPosting.city);
        await this.zipCodeField.fill(jobPosting.zipCode);
        await this.stateDropdown.selectOption(jobPosting.state);
        await this.travelDropdown.selectOption(jobPosting.travel);
        await this.salaryMinimumField.fill(jobPosting.salaryMinimum);
        await this.salaryMaximumField.fill(jobPosting.salaryMinimum);
        await this.salaryTypeDropdown.selectOption(jobPosting.salaryType);
        await this.levelOfEducationDropdown.selectOption(jobPosting.levelOfEducation);
        await this.yearsOfExperienceDropdown.selectOption(jobPosting.yearsOfExperience);
        await this.referralBonusField.fill(jobPosting.referralBonus);
        await this.referralPointsField.fill(jobPosting.referralPoints);
        await this.jobDescriptionRTE.fill(jobPosting.jobDescription);
        await this.requiredSkillsRTE.fill(jobPosting.requiredSkills);
        await this.requiredExperienceRTE.fill(jobPosting.requiredExperience);
        await this.internalSkillsRTE.fill(jobPosting.skillsCandidateShouldPossess);
        await this.internalDescriptionRTE.fill(jobPosting.notesOnPosition);
        await this.exemptStatusDropdown.selectOption(jobPosting.exemptStatus);
        // Custom fields — only filled when the data provides a customFields
        // block, so the shared ATS create-job-posting data (which omits it)
        // is unaffected.
        if (jobPosting.customFields) {
            const cf = jobPosting.customFields;
            await this.jobGradeField.fill(cf.jobGrade);
            await this.customFieldTextInput.fill(cf.text);
            await this.customFieldTextareaInput.fill(cf.textarea);
            await this.customFieldDropdown.selectOption(cf.dropdown);
            await this.customFieldMultiselect.selectOption(cf.multiselect);
        }
        await this.collectEEODropdown.selectOption(jobPosting.collectEEO);  
        await this.continueButton.click();
    }
    
    //  deepartment and budget details
    async fillDepartmentAndBudgetDetails(jobPosting) {
        await this.hiringManagerDropdown.click();
        await this.hiringManagerDropdown.fill(jobPosting.hiringManager);
        await this.hiringManagerDropdown.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${jobPosting.hiringManager}")`); 
        await this.businessUnitDropdown.selectOption(jobPosting.businessUnit);   
        await this.departmentDropdown.click();
        await this.departmentDropdown.fill(jobPosting.department);
        await this.departmentDropdown.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${jobPosting.department}")`);
        await this.industryDropdown.selectOption(jobPosting.industry);  
        await this.continueButton.click();
    }
    
    // priority details
    async fillPriorityDetails() {
        await this.continueButton.click();
    }
    
    // category selection
    async selectCategory(jobPosting) {
        await this.page.getByText(jobPosting.selectCategory).click();
        await this.continueButton.click();
    }
    
    // handle possible duplicate check
    async handleDuplicateCheck() {
        await this.page.waitForLoadState('load');
        const isVisible = await this.page.getByRole('heading', { name: 'Possible Duplicate Job Posting' }).isVisible();
        if (isVisible) {
            await this.page.locator('label.duplicate-job-option-card[data-option="createNew"]').click();
            await this.page.locator('#duplicateJobContinueBtn').click();
        }
    }

    // For [C242]: check the warning appears without dismissing it, so the caller can assert then decide
    async isDuplicateWarningShown() {
        await this.page.waitForLoadState('load');
        return this.possibleDuplicateHeading.isVisible();
    }

    // For [C148943]: default (unselected) option label for a Position Details dropdown
    async getDefaultOptionLabel(dropdownLocator) {
        return dropdownLocator.locator('option:checked').innerText();
    }

    // For [C234852]: all options in the "Automated Email for..." dropdown, in display order
    async getEmailTemplateOptions() {
        return this.automatedEmailForImportedCandidatesDropdown.locator('option').allInnerTexts();
    }

    // attachments
    async attachFiles() {
        await this.continueButton.click();
    }
    
    // question selection 
    async selectQuestions() {
        await this.selectAllQuestions.click();
        await this.questionCompletedButton.click();
    }
    
    // complete job posting
    async completeJobPosting() {
        await this.finishAndReturnButton.click();
    }

    async searchAndVerify(jobTitle){
        await this.jobTrackingMenuItem.click();
        await this.page.waitForLoadState('load');
        await this.editSearchLink.click();
        await this.clearFiltersButton.click();
        await this.jobTitleOrCodeField.fill(jobTitle);
        await this.applyFiltersButton.click();
        return (await this.tableRow.count()) > 0;
    }

    async searchAndVerifyEvergreenJob(jobTitle){
        await this.jobTrackingMenuItem.click();
        await this.page.waitForLoadState('load');
        await this.editSearchLink.click();
        await this.jobTitleOrCodeField.fill(jobTitle);
        await this.applyFiltersButton.click();
        await this.page.getByRole('link', { name: '' }).click();
        await this.page.locator('#configurableColumnisEvergreen').getByText('Evergreen Job').click();
        await this.page.locator('#configurableColumnsModalApply').click();
        return (await this.tableRow.count()) > 0;
    }

    // Search results row's own title-link href already carries
    // ?jobId=<id> (fuseaction=postings.displayjob&jobId=<id> — the same
    // numeric id the CX candidate portal uses at .../jobs/<id>), so read it
    // straight off the link instead of navigating there (clicking td.first()
    // below only checks the row's selection checkbox — it never leaves this
    // search results page).
    async getJobIdFromSearchResults(jobTitle){
        await this.jobTrackingMenuItem.click();
        await this.page.waitForLoadState('load');
        await this.editSearchLink.click();
        // Clear Filters — the Edit Search panel's default Job Status filter
        // is scoped to "Open" postings only, which hides this job if it's
        // currently deactivated/closed (e.g. left over from an earlier
        // interrupted run).
        await this.clearFiltersButton.click();
        await this.jobTitleOrCodeField.fill(jobTitle);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('networkidle');

        const href = await this.page.locator('table tbody tr').first().locator('a').first().getAttribute('href');
        return new URL(href, this.page.url()).searchParams.get('jobId');
    }

    // The Take Action confirm modal's Continue/Save button (#bulkActionModalSave)
    // is flaky in this app — live-verified (2026-09-14): it briefly flips to
    // aria-hidden mid-transition and Playwright's actionability check can
    // catch it there, timing out a plain .click(). Retrying past that
    // transition resolves it.
    async clickModalSave(attempts = 3){
        for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
                await this.deactivateModalSave.waitFor({ state: 'visible', timeout: 10000 });
                await this.page.waitForTimeout(500);
                await this.deactivateModalSave.click({ timeout: 5000 });
                return;
            } catch (error) {
                if (attempt === attempts) throw error;
            }
        }
    }

    async deactivateJobPosting(jobTitle){
        await this.jobTrackingMenuItem.click();
        await this.page.waitForLoadState('load');
        await this.editSearchLink.click();
        await this.jobTitleOrCodeField.fill(jobTitle);
        await this.applyFiltersButton.click();
        await this.page.locator('td').first().click();
        await this.takeActionDropdown.click();
        await this.deactivateLink.click();
        await this.deactivateModalSave.click();
    }

    // Same flow as deactivateJobPosting(), but returns the job's numeric id
    // (via getJobIdFromSearchResults() above) so a caller can verify the
    // deactivated job's CX page directly, without depending on CX search
    // (which won't surface a deactivated job at all).
    async deactivateJobPostingAndGetId(jobTitle){
        const jobId = await this.getJobIdFromSearchResults(jobTitle);

        await this.page.locator('td').first().click();
        await this.takeActionDropdown.click();
        await this.deactivateLink.click();
        await this.clickModalSave();

        return jobId;
    }

    // Reverses deactivateJobPostingAndGetId() — reactivates the job so a
    // shared/reused job posting (e.g. the "Playwright Deactivation Test" job
    // other suites also deactivate/activate) is left active for later runs.
    async reactivateJobPosting(jobTitle){
        await this.jobTrackingMenuItem.click();
        await this.page.waitForLoadState('load');
        await this.editSearchLink.click();
        // Clear Filters — the job is deactivated at this point, so the
        // default "Open" Job Status filter would hide it from the search.
        await this.clearFiltersButton.click();
        await this.jobTitleOrCodeField.fill(jobTitle);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.locator('td').first().click();
        await this.takeActionDropdown.click();
        await this.activateLink.click();
        await this.clickModalSave();
    }

}

module.exports = CreateJobPostingPage;
