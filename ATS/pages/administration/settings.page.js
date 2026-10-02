const BasePage = require('../base.page.js');

class SettingsPage extends BasePage {
    constructor(page) {
        super(page);

        // Define all locators
        this.administrationMenuItem = this.page.getByLabel('Administration', { exact: true });
        this.settingsNavLink = this.page.getByLabel('Settings').getByText('Settings');
        this.candidateResumeProfileSettingLink = this.page.getByRole('link', { name: 'Candidate Resume Profile' });
        this.candidateUploadFieldControlSettingLink = this.page.getByRole('link', { name: 'Candidate Upload Field Controls' });
        this.displayJobFieldsSettingLink = this.page.getByRole('link', { name: 'Displayed Job Fields' });
        this.displayRequisitionFieldsSettingLink = this.page.getByRole('link', { name: 'Displayed Requisition Fields' });
        this.duplicateCandidateSearchSettingLink = this.page.getByRole('link', { name: 'Duplicate Candidate Search' });
        this.saveButton = this.page.locator('#saveSettingsModalButtonPrimary');
        this.toastrMessage = this.page.locator('span.toastr_message_text', { hasText: 'Your edit was successful!' });
        this.veteranIconSetting = this.page.getByRole('link', { name: 'Icon for Veteran Candidates' });
        this.multipleJobsIconSetting = this.page.getByRole('link', { name: 'Icon to Indicate Candidate has Applied to Multiple Jobs' });
        this.assessmentsSettingLink = this.page.getByRole('link', { name: 'Assessments' });
        this.cookiePolicySettingLink = this.page.getByRole('link', { name: 'Cookie Policy Acknowledgement for Career Sites' });
        this.eeoInfoSettingLink = this.page.getByRole('link', { name: 'EEO Info' });
        this.hiringStageLink = this.page.getByRole('link', { name: 'Hiring Stage' });
        this.candidateMenuLink = this.page.getByRole('menuitem', { name: 'Candidates' });
        this.candidatePoolLink = this.page.getByLabel('Candidate Pool').getByText('Candidate Pool');
        this.editSearchLink = this.page.getByText('Edit Search');
        this.clearFiltersButton = this.page.getByRole('button', { name: 'Clear Filters' });
        this.candidateNameField = this.page.getByRole('textbox', { name: 'Candidate Name' });
        this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
        this.emailForOutagesAndUpgradesLink = this.page.getByRole('link', { name: 'Email For Outages And Upgrades' });
        this.emailSettingsLink = this.page.getByRole('link', { name: 'Email Settings' });
        this.eFormNotificationEmailLink = this.page.getByRole('link', { name: 'eForm Notification Email' });
        this.lockedJobTemplateFieldsLink = this.page.getByRole('link', { name: 'Locked Job Template Fields' });
        this.lockOffersLink = this.page.getByRole('link', { name: 'Lock Offers' });
        this.lockRequisitionsLink = this.page.getByRole('link', { name: 'Lock Requisitions' });
        this.resumeSearchLink = this.page.getByRole('link', { name: 'Resume Search' });
        this.trackingCodeManagementLink = this.page.getByRole('link', { name: 'Tracking Code Management' });
        this.reviewRequestsLink = this.page.getByRole('link', { name: 'Review Requests' });
        this.dispositionForHiredCandidatesLink = this.page.getByRole('link', { name: 'Disposition For Hired Candidates' });
        this.dispositionIneligibleForHireLink = this.page.getByRole('link', { name: 'Disposition Candidate As Ineligible For Hire/Rehire' });
        this.resumeResultsTable = this.page.locator('#resumeResultsTable');
        this.emailList = this.page.locator('#outagesAndUpgradesEmailTextArea');
        this.replyToAddressCheckbox = this.page.locator('#replyToEnabled');
        this.jobTemplateDropdown = this.page.locator('#job_template_id_label');
        this.jobtemplateMessageModalButton = this.page.locator('#JobTemplateMessage_ModalButtonPrimary');
        this.rosiJobDescriptionsLink = this.page.getByRole('link', { name: 'ROSI Job Descriptions' });
        this.rosiCopilotLink = this.page.getByRole('link', { name: 'ROSI Copilot' });
        this.rosiSourcingLink = this.page.getByRole('link', { name: 'ROSI Sourcing' });
        this.rosiOutreachLink = this.page.getByRole('link', { name: 'ROSI Outreach' });
        this.rosiEmailTemplateRefinementLink = this.page.getByRole('link', { name: 'ROSI Email Template Refinement' });
        this.rosiSkillsMatchLink = this.page.getByRole('link', { name: 'ROSI Skills Match' });

    }

    async navigateToSettingsPage() {
        await this.administrationMenuItem.click();
        await this.settingsNavLink.click();
        await this.page.waitForLoadState('load');
    }

    async navigateToCreateRequisitionPage() {
        await this.page.getByRole('menuitem', { name: 'Jobs' }).click();
        await this.page.getByRole('menuitem', { name: 'Create Requisition' }).click();
        await this.page.locator('form').filter({ hasText: 'View as Recruiter: [All]' }).locator('div').first().click();
        await this.page.locator('#main').getByRole('listitem').filter({ hasText: 'Create Requisition' }).click();

    }

    async updateCandidateResumeProfileSetting(updateTo){
        await this.candidateResumeProfileSettingLink.click();
        await this.page.getByLabel(updateTo).check();
        await this.saveButton.click();
    }

    async updateDuplicateCandidateSearchSetting(shouldCheck){
        await this.duplicateCandidateSearchSettingLink.click();
        const checkboxes = [
            '#duplicateCandidateSearchCriteria_emailAddress',
            '#duplicateCandidateSearchCriteria_telephone'
        ];
        // Loop through each duplicate search criteria checkbox to check/uncheck them in bulk
        for (const selector of checkboxes) {
            if (shouldCheck) await this.page.locator(selector).check();
            else await this.page.locator(selector).uncheck();
        }
        await this.saveButton.click();
    }

    async updateLockOffersSetting(flag){
        await this.lockOffersLink.click();
        if(flag) await this.page.locator('#lockOffers_1').check();
        else await this.page.locator('#lockOffers_0').check();
        await this.saveButton.click();
    }

    async updateLockRequisitionsSetting(flag){
        await this.lockRequisitionsLink.click();
        if(flag) await this.page.locator('#lockRequisitions_1').check();
        else await this.page.locator('#lockRequisitions_0').check();
        await this.saveButton.click();
    }

    async updateResumeSearchSetting(flag){
        await this.resumeSearchLink.click();
        const fields = [
            '#isOFCCPComplianceAdvancedSearchEnabled',
            '#isOFCCPComplianceQuickSearchEnabled',
            '#isResumeCountStageFilterEnabled',
            '#isHMReviewedResumesEnabled',
        ];
        for (const selector of fields) {
            if (flag) await this.page.locator(`${selector}_1`).check();
            else await this.page.locator(`${selector}_0`).check();
        }
        await this.saveButton.click();
    }

    async updateTrackingCodeManagementSetting(flag){
        await this.trackingCodeManagementLink.click();
        if(flag) await this.page.locator('#isTrackingCodeEnabled_1').check();
        else await this.page.locator('#isTrackingCodeEnabled_0').check();
        await this.saveButton.click();
    }

    async updateReviewRequestsSetting(flag){
        await this.reviewRequestsLink.click();
        if(flag) await this.page.locator('#resumeReviewRequireComments_1').check();
        else await this.page.locator('#resumeReviewRequireComments_0').check();
        await this.saveButton.click();
    }

    async updateDispositionForHiredCandidatesSetting(flag){
        await this.dispositionForHiredCandidatesLink.click();
        if(flag) await this.page.locator('#dispositionOnHireControlQuestion_1').check();
        else await this.page.locator('#dispositionOnHireControlQuestion_0').check();
        await this.saveButton.click();
    }

    async updateDispositionIneligibleForHireSetting(flag){
        await this.dispositionIneligibleForHireLink.click();
        if(flag) await this.page.locator('#autoMarkDoNotHireControlQuestion_1').check();
        else await this.page.locator('#autoMarkDoNotHireControlQuestion_0').check();
        await this.saveButton.click();
    }

    async updateCandidateUploadFieldControlSetting(updateTo){
        await this.candidateUploadFieldControlSettingLink.click();
        const labels = ['Country', 'Address', 'City', 'State/Location', 'Zip/Postal Code',
            { label: 'Email', exact: true }, 'Primary Phone', 'Résumé Content', 'Select Source'];
        // Loop through each field label to check/uncheck them based on the updateTo flag
        for (const item of labels) {
            const locator = typeof item === 'string' ? this.page.getByLabel(item) : this.page.getByLabel(item.label, { exact: item.exact });
            if (updateTo) await locator.check();
            else await locator.uncheck();
        }
        await this.saveButton.click();
    }

    async navigateToUpload(){
        await this.page.getByRole('menuitem', { name: 'Candidates' }).click();
        await this.page.getByLabel('Upload').getByText('Upload').click();
        await this.page.getByRole('button', { name: 'Manual Entry' }).click();
        await this.page.getByRole('button', { name: 'Check For Duplicates' }).click();
    }

    async navigateToCreateJobPosting(){
        await this.page.getByRole('menuitem', { name: 'Jobs' }).click();
        await this.page.getByRole('menuitem', { name: 'Create Job Posting' }).click();
        await this.page.waitForLoadState('networkidle')
    }

    getField(fieldName) {
        return this.page.locator(fieldName);
    }

    getDisplayedJobFields() {
        const selectors = [
            '#mailings', '#workflowId',
            '#isEvergreen_0', '#ext_job_title', '#trackingcode', '#numofpositions',
            '#status', '#jobtype', '#joblev', '#duration', '#start', '#addressLine1', '#addressLine2', '#state',
            '#additionalLocations_input', '#eeoccat', '#eeogroup', '#travel', '#perdiem_1',
            '#salmin', '#salmax', '#saltype', '#salcurrency', '#degree', '#experyrs'
        ];

        return selectors.map(s => this.page.locator(s));
    }

    async updateDisplayJobFieldsSetting(shouldCheck) {
        await this.displayJobFieldsSettingLink.click();
        const fields = [
            '#viewing_jobInformation_jobTemplate', '#viewing_jobInformation_jobId',
            '#viewing_jobInformation_trackingcode', '#displayed_jobInformation_trackingcode',
            '#viewing_jobInformation_ext_job_title', '#displayed_jobInformation_ext_job_title',
            '#viewing_jobInformation_internalJobTitle', '#viewing_jobInformation_jobCategory',
            '#viewing_jobInformation_joblev', '#displayed_jobInformation_joblev',
            '#viewing_jobInformation_eeoccat', '#displayed_jobInformation_eeoccat',
            '#viewing_jobInformation_eeogroup', '#displayed_jobInformation_eeogroup',
            '#viewing_jobInformation_evergreenJob', '#displayed_jobInformation_evergreenJob',
            '#viewing_jobInformation_travel', '#displayed_jobInformation_travel',
            '#viewing_jobInformation_duration', '#displayed_jobInformation_duration',
            '#viewing_jobInformation_start', '#displayed_jobInformation_start',
            '#viewing_jobInformation_perdiem', '#displayed_jobInformation_perdiem',
            '#viewing_jobInformation_jobDescription',
            '#viewing_jobLocationDetails_companyLocation',
            '#viewing_jobLocationDetails_addressLine1', '#displayed_jobLocationDetails_addressLine1',
            '#viewing_jobLocationDetails_addressLine2', '#displayed_jobLocationDetails_addressLine2',
            '#viewing_jobLocationDetails_city', '#viewing_jobLocationDetails_state',
            '#displayed_jobLocationDetails_state', '#viewing_jobLocationDetails_zipPostalCode',
            '#viewing_jobLocationDetails_country',
            '#viewing_jobLocationDetails_additionalLocations', '#displayed_jobLocationDetails_additionalLocations',
            '#viewing_compensationAndBudget_salmin', '#displayed_compensationAndBudget_salmin',
            '#viewing_compensationAndBudget_salmax', '#displayed_compensationAndBudget_salmax',
            '#viewing_compensationAndBudget_salcurrency', '#displayed_compensationAndBudget_salcurrency',
            '#viewing_compensationAndBudget_saltype', '#displayed_compensationAndBudget_saltype',
            '#viewing_compensationAndBudget_budgetedSalary', '#viewing_compensationAndBudget_budgetedCurrency',
            '#viewing_compensationAndBudget_budgetedQuarter', '#viewing_compensationAndBudget_budgetedYear',
            '#viewing_organizationalContext_department', '#viewing_organizationalContext_businessUnit',
            '#viewing_organizationalContext_businessFunction', '#viewing_organizationalContext_industry',
            '#viewing_organizationalContext_jobtype', '#displayed_organizationalContext_jobtype',
            '#viewing_organizationalContext_numofpositions', '#displayed_organizationalContext_numofpositions',
            '#viewing_organizationalContext_numofpositionsfilled',
            '#viewing_organizationalContext_internaldesc', '#displayed_organizationalContext_internaldesc',
            '#viewing_experienceAndQualifications_experyrs', '#displayed_experienceAndQualifications_experyrs',
            '#viewing_experienceAndQualifications_degree', '#displayed_experienceAndQualifications_degree',
            '#viewing_experienceAndQualifications_experience', '#displayed_experienceAndQualifications_experience',
            '#viewing_experienceAndQualifications_requiredskills', '#displayed_experienceAndQualifications_requiredskills',
            '#viewing_experienceAndQualifications_internalskills', '#displayed_experienceAndQualifications_internalskills',
            '#viewing_personnelAndRecruitment_hiringManager', '#viewing_personnelAndRecruitment_recruitingManager',
            '#viewing_personnelAndRecruitment_recruiter', '#viewing_personnelAndRecruitment_recruitingTeam',
            '#viewing_personnelAndRecruitment_workflowId', '#displayed_personnelAndRecruitment_workflowId',
            '#viewing_personnelAndRecruitment_feeAgencies',
            '#viewing_personnelAndRecruitment_mailings', '#displayed_personnelAndRecruitment_mailings',
            '#viewing_postingLifecycle_priority', '#viewing_postingLifecycle_originalPostedDate',
            '#viewing_postingLifecycle_postingdate', '#displayed_postingLifecycle_postingdate',
            '#viewing_postingLifecycle_closeddate', '#displayed_postingLifecycle_closeddate',
            '#viewing_postingLifecycle_status', '#displayed_postingLifecycle_status',
            '#viewing_postingLifecycle_postingStatusChangeRule',
            '#viewing_jobCustomFields_dspeeoform', '#viewing_jobCustomFields_worldco_exempstatus',
            '#viewing_jobCustomFields_worldco_jobgrade',
        ];
        // Loop through each job field selector to check/uncheck visibility settings in bulk
        for (const selector of fields) {
            if (shouldCheck) await this.page.locator(selector).check();
            else await this.page.locator(selector).uncheck();
        }
        await this.saveButton.click();
        await this.toastrMessage.waitFor({ state: 'visible', timeout: 10000 })
    }

    async updateDisplayRequisitionFields(shouldCheck){
        await this.displayRequisitionFieldsSettingLink.click();
        const fields = [
            '#displayed_budgetcurrency', '#displayed_budgetedquarter', '#displayed_budgetedsalary',
            '#displayed_budgetedyear', '#displayed_department_id', '#displayed_eeoc_cat_id',
            '#displayed_eeogroup', '#displayed_experience_rqd', '#displayed_requiredskills',
            '#displayed_notes', '#displayed_skills_notes', '#displayed_addressLine1',
            '#displayed_addressLine2', '#displayed_state', '#displayed_level_of_ed',
            '#displayed_perdiem', '#displayed_salary_currency', '#displayed_salary_max',
            '#displayed_salary_min', '#displayed_salarytype', '#displayed_travel',
            '#displayed_yrs_of_exp', '#displayed_iApprovalAdminID', '#displayed_iCreatorName',
            '#displayed_duration', '#displayed_evergreenJob', '#displayed_extjobtitle',
            '#displayed_joblevel', '#displayed_jobtype', '#displayed_numofpositions',
            '#displayed_startdte', '#displayed_TrackingCode', '#displayed_workflowId',
        ];
        // Loop through each requisition field selector to check/uncheck visibility settings in bulk
        for (const selector of fields) {
            if (shouldCheck) await this.page.locator(selector).check();
            else await this.page.locator(selector).uncheck();
        }
        await this.saveButton.click();
    }

    getDisplayedRequisitionFields() {
        const selectors = [
            '#budgetcurrency', '#budgetedquarter', '#budgetedsalary', '#budgetedyear',
            '#department_id_label', '#eeoc_cat_id', '#eeogroup', '#addressLine1',
            '#addressLine2', '#state', '#level_of_ed', '#perdiem_1', '#salary_currency',
            '#salary_max', '#salary_min', '#salarytype', '#travel', '#yrs_of_exp',
            '#iApprovalAdminID', '#iCreatorName', '#duration', '#isEvergreen_0',
            '#extjobtitle', '#joblevel', '#jobtype', '#numofpositions', '#startdte',
            '#TrackingCode', '#workflowId',
        ];

        return selectors.map(s => this.page.locator(s));
    }

    async searchCandidate(){
        await this.candidateMenuLink.click();
        await this.candidatePoolLink.click();
        await this.page.waitForLoadState('load');
        await this.editSearchLink.click();
        await this.clearFiltersButton.click();
    }

    async enableVeteranIcon(flag){
        await this.veteranIconSetting.click();
        if(flag) await this.page.getByLabel('Yes').check();
        else await this.page.getByLabel('No').check();
  
        await this.saveButton.click();
        
    }

    async enableMultipleJobsIcon(flag){
        await this.multipleJobsIconSetting.click();
        if(flag) await this.page.getByLabel('Yes').check();
        else await this.page.getByLabel('No').check();
  
        await this.saveButton.click();
    }

    async enableRecruiterInitiatedAssessment(flag){
        await this.assessmentsSettingLink.click();
        if(flag) await this.page.locator('#isRecruiterInitiatedAssessmentEnabled_1').check();
        else await this.page.locator('#isRecruiterInitiatedAssessmentEnabled_0').check();
        await this.saveButton.click();
    }

    async enableCookiePolicy(flag){
        await this.cookiePolicySettingLink.click();
        if(flag) {
            await this.page.locator('#cookiePolicyEnabled_20_1').check();
            await this.page.locator('#cookiePolicyUrl_20').fill('https://qa-recruiting-cx.silkroad-eng.com/playwrightqa/CorporateCareerPortal2');
        }
        else await this.page.locator('#cookiePolicyEnabled_20_0').check();
        await this.saveButton.click();
    }

    async enableNonBinaryGenderOption(flag){
        await this.eeoInfoSettingLink.click();
        if(flag) await this.page.locator('#showNonBinaryOptionForGenderQuestion_1').check();
        else await this.page.locator('#showNonBinaryOptionForGenderQuestion_0').check();
        await this.saveButton.click();
    }

    async isNonBinaryOptionVisibleOnCRP(){
        await this.candidateMenuLink.click();
        await this.candidatePoolLink.click();
        await this.page.waitForLoadState('load');
        await this.editSearchLink.click();
        await this.clearFiltersButton.click();
        await this.candidateNameField.fill('Playwright Playwright');
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('load');
        await this.page.locator('#bulkActionItemResultsTable tbody tr td:nth-child(3) a').first().click();
        await this.page.waitForLoadState('load');
        await this.page.getByRole('button', { name: 'Take Action' }).click();
        await this.page.getByRole('menuitem', { name: 'EEO Profile' }).click();
        await this.page.waitForLoadState('networkidle');
        const isVisible = await this.page.locator('#sex_X').isVisible();
        await this.page.locator('#formModalClose').click();
        return isVisible;
    }

    async verifyVetranIconIsActive(veteran){
        await this.candidateNameField.click();
        await this.candidateNameField.fill(veteran);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('load');
        const icon = this.page.locator('i.fa-flag-usa[title="U.S. Veteran"]');
        const classList = await icon.getAttribute('class');
        return classList.includes('veteran-icon-active');       
    }

    async verifyVetranIconIsVisible(veteran){
        await this.candidateNameField.click();
        await this.candidateNameField.fill(veteran);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('load');

        return await this.page.locator('i.fa-flag-usa[title="U.S. Veteran"]').isVisible();
    }

    async verifyMultipleJobsIconIsInactive(candidate){
        await this.candidateNameField.click();
        await this.candidateNameField.fill(candidate);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('load');
        const icon = this.page.locator('i.fa-copy[title="No other applications"]').first();
        const classList = await icon.getAttribute('class');
        return classList.includes('multiple-jobs-icon-inactive');
    }

    async verifyMultipleJobsIconIsVisible(candidate){
        await this.candidateNameField.click();
        await this.candidateNameField.fill(candidate);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('load');

        return await this.page.locator('i.fa-copy[title="No other applications"]').isVisible();
    }

    async addEmailForOutageAndUpgrades(email){
        await this.emailForOutagesAndUpgradesLink.click();
        await this.emailList.fill(email);
        await this.saveButton.click();
    }

    async enableEmailSettings(){
        await this.emailSettingsLink.click();
        await this.replyToAddressCheckbox.click();
        await this.saveButton.click();
    }

    async addEFormNotificationEmail(){
        await this.eFormNotificationEmailLink.click();    
        const checkboxIds = [
            '#emailRecruitingManager_144', '#emailRecruiter_144', '#emailHiringManager_144',
            '#emailRecruitingManager_145', '#emailRecruiter_145', '#emailHiringManager_145',
            '#emailRecruitingManager_146', '#emailRecruiter_146', '#emailHiringManager_146'
        ];
        // Check all eForm notification checkboxes
        for (const id of checkboxIds) {
            await this.page.locator(id).click();
        }
        await this.saveButton.click();
    }

    async enableHiringStages(size){
        await this.hiringStageLink.click();   
        await this.page.locator('#rolesSelect').selectOption('2');
        await this.page.locator('#workflowsSelect').selectOption('1');
        if(size === 1){
            await this.page.locator('#workflowStagesSelect').click();
            await this.page.locator('#workflowStagesSelect').selectOption('8');
        }
        else {
            await this.page.locator('#workflowStagesSelect').click();
            await this.page.locator('#workflowStagesSelect option').first().click();
            await this.page.locator('#workflowStagesSelect option').last().click({ modifiers: ['Shift'] });
        }

        await this.saveButton.click();
    }

    async verifyHiringStageOnCRP(){
        await this.candidateNameField.fill('Playwright Hiring Stage Test');
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('load');
        await this.page.locator('#bulkActionItemResultsTable tbody tr td:nth-child(3) a').first().click();
        await this.page.waitForLoadState('load');
        const hiringStageCombobox = this.page.locator('[role="combobox"][aria-labelledby*="hiring-stage"]');
        await hiringStageCombobox.waitFor({ state: 'visible', timeout: 30000 });
        await hiringStageCombobox.click();
        await this.page.waitForLoadState('networkidle');
        const stageOption = this.page.getByRole('option', { name: '3rd Party Sourced' });
        const isDisabled = !(await stageOption.isEnabled());
        await this.page.keyboard.press('Escape');

        return isDisabled;
    }

    async updateLockedJobTemplateFields(shouldCheck) {
        await this.lockedJobTemplateFieldsLink.click();
        const fields = [
            '#ReadOnly_eeoccat', '#ReadOnly_enableTaxBreak', '#ReadOnly_eeogroup', '#ReadOnly_packageId',
            '#ReadOnly_customFields',
            '#ReadOnly_budgetcurrency', '#ReadOnly_BudgetedSalary', '#ReadOnly_function', '#ReadOnly_department_id', '#ReadOnly_industry',
            '#ReadOnly_jobdescription', '#ReadOnly_experience', '#ReadOnly_requiredskills',
            '#ReadOnly_internaldesc', '#ReadOnly_internalskills',
            '#ReadOnly_categoryId',
            '#ReadOnly_workflowId', '#ReadOnly_jobTitle', '#ReadOnly_duration', '#ReadOnly_joblev', '#ReadOnly_jobtype',
            '#ReadOnly_addressLine1', '#ReadOnly_addressLine2', '#ReadOnly_city', '#ReadOnly_country', '#ReadOnly_location_id', '#ReadOnly_postalCode', '#ReadOnly_state',
            '#ReadOnly_degree', '#ReadOnly_salmax', '#ReadOnly_salmin', '#ReadOnly_perdiem', '#ReadOnly_salcurrency', '#ReadOnly_saltype', '#ReadOnly_travel', 
            //'#ReadOnly_experyrs',
        ];
        for (const selector of fields) {
            if (shouldCheck) await this.page.locator(selector).check();
            else await this.page.locator(selector).uncheck();
        }
        await this.saveButton.click();
    }

    async navigateToCreateJobPostingWithTemplate(){
        await this.navigateToCreateJobPosting();
        await this.selectAutocompleteOption(this.jobTemplateDropdown, "Playwright Job Template");
        await this.jobtemplateMessageModalButton.click();
        await this.page.waitForLoadState('load');
    }

    getLockedJobTemplateFields() {
        const selectors = [
            '#eeoccat',
            '#workflowId', '#job_title', '#duration', '#jobtype',
            '#addressLine1', '#city', '#country', '#location_id_label', '#postal_code', '#state',
            '#degree', '#salmax', '#salmin', '#salcurrency', '#saltype', '#travel', 
            //'#experyrs',
        ];

        return selectors.map(s => this.page.locator(s));
    }

    getLockedJobTemplateRteFields() {
        const selectors = [
            // Description/Skills (RTE fields show .disabledRteText when locked)
            '#jobdescription_rte_container .disabledRteText',
            '#experience_rte_container .disabledRteText',
            '#requiredskills_rte_container .disabledRteText',
            // Internal Fields
            '#internalskills_rte_container .disabledRteText',
            '#internaldesc_rte_container .disabledRteText',
        ];

        return selectors.map(s => this.page.locator(s));
    }

    async selectAutocompleteOption(dropdown, value) {
        await dropdown.click();
        await dropdown.pressSequentially(value, { delay: 30 });
        await this.page.waitForLoadState('domcontentloaded');
        await dropdown.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${value}")`);
    }

    async updateRosiJobDescriptionsSetting(shouldCheck) {
        await this.rosiJobDescriptionsLink.click();
        const checkboxes = [
            '#location_id', '#industry', '#dept_notes_id', '#JobType',
            '#yrs_of_exp', '#JobLevel', '#level_of_ed', '#JobDuration',
            '#perdiem', '#Travel', '#SalaryType', '#Salary_Min', '#Salary_Max',
        ];
        if (shouldCheck) {
            await this.page.locator('#enableAIJObDescription_1').check();
            for (const selector of checkboxes) {
                await this.page.locator(selector).check();
            }
        } else {
            await this.page.locator('#enableAIJObDescription_0').check();
            for (const selector of checkboxes) {
                await this.page.locator(selector).uncheck();
            }
        }
        await this.saveButton.click();
    }

    async updateRosiCopilotSetting(flag){
        await this.rosiCopilotLink.click();
        if(flag) await this.page.locator('#isRivalCopilotEnabledYes').check();
        else await this.page.locator('#isRivalCopilotEnabledNo').check();
        await this.saveButton.click();
    }

    async updateRosiOutreachSetting(flag) {
        await this.rosiOutreachLink.click();
        const fields = [
            '#isGenerativeAIEmailOutreachEnabled',
            '#isImportAndOutreachEnabled',
        ];
        for (const selector of fields) {
            if (flag) await this.page.locator(`${selector}_1`).check();
            else await this.page.locator(`${selector}_0`).check();
        }
        await this.saveButton.click();
    }

    async updateRosiEmailTemplateRefinementSetting(flag){
        await this.rosiEmailTemplateRefinementLink.click();
        if(flag) await this.page.locator('#isRosiEmailTemplateRefinementEnabledYes').check();
        else await this.page.locator('#isRosiEmailTemplateRefinementEnabledNo').check();
        await this.saveButton.click();
    }

    async updateRosiSkillsMatchSetting(flag){
        await this.rosiSkillsMatchLink.click();
        if(flag) await this.page.locator('#isRosiSkillsMatchEnabledYes').check();
        else await this.page.locator('#isRosiSkillsMatchEnabledNo').check();
        await this.saveButton.click();
    }
}

module.exports = SettingsPage;
