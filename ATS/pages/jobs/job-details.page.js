const BasePage = require('../base.page.js');

class JobDetailsPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        this.jobsMenuItem = this.page.getByLabel('Jobs', { exact: true });
        this.jobTrackingMenuItem = this.page.getByText('Job Tracking', { exact: true }).first();
        this.editSearchLink = this.page.getByText('Edit Search');
        this.clearFiltersButton = this.page.getByRole('button', { name: 'Clear Filters' });
        this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
        this.jobTitleOrCodeField = this.page.getByLabel('Job Title or Code');
        this.tableCheckbox = this.page.locator('#checkAllItems');
        this.firstTableRow = this.page.locator('#bulkActionItemResultsTable tbody tr td:nth-child(2) a').first();
        this.postedJobTitleField  = this.page.getByLabel('Posted Job Title');
        this.jobDescriptionRTE = this.page.locator('#jobdescription_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
        this.requiredSkillsRTE = this.page.locator('#requiredskills_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
        this.requiredExperienceRTE = this.page.locator('#experience_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
        this.internalDescriptionRTE = this.page.locator('#internaldesc_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
        this.internalSkillsRTE = this.page.locator('#internalskills_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
        this.saveButton = this.page.getByRole('button', { name: 'Save' });
        this.ellipsisMenuLinks = this.page.locator('i.fas.fa-ellipsis-v');
        this.editJobLink = this.page.locator('#postingsView_edit a', { hasText: 'Edit This Job' });
        this.editJobPostingHeading = this.page.getByRole('heading', { name: 'Edit Job Posting - Position' });
        this.automatedEmailForImportedCandidatesLabel = this.page.getByText('Automated Email for Imported and Manually Uploaded Candidates');
        this.automatedEmailForImportedCandidatesDropdown = this.page.getByLabel('Automated Email for Imported and Manually Uploaded Candidates');
        this.postNewJobLink = this.page.locator('#postingsView_post a', { hasText: 'Post New Job' });
        this.cloneThisJobLink = this.page.locator('#postingsView_clone a', { hasText: 'Clone This Job' });
        this.successAlert = this.page.locator('.toast-success .toastr_message_text');
        this.postingStatusDropdown = this.page.locator('#postingStatus_input');
        this.takeActionButton = this.page.getByRole('link', { name: 'Take Action ' });
        this.deactivateLink  = this.page.getByRole('listitem').filter({ hasText: 'Deactivate' });
        this.modalSave = this.page.locator('#bulkActionModalSave');
        
        // Edit Job Posting - full field set (same labels/ids as the Create
        // Job Posting form; the edit form renders every field on one page).
        this.trackingCodeField = this.page.getByLabel('Tracking Code');
        this.jobLevelDropdown = this.page.getByLabel('Job Level');
        this.cityField = this.page.getByLabel('City *');
        this.zipCodeField = this.page.getByLabel('Zip/Postal Code *');
        this.stateDropdown = this.page.getByLabel('State');
        this.travelDropdown = this.page.getByLabel('Travel');
        this.salaryMinimumField = this.page.getByLabel('Minimum Salary');
        this.salaryMaximumField = this.page.getByLabel('Maximum Salary');
        this.salaryTypeDropdown = this.page.getByLabel('Salary Type');
        this.levelOfEducationDropdown = this.page.getByLabel('Level of Education');
        this.yearsOfExperienceDropdown = this.page.getByLabel('Years of Experience');
        this.positionTypeDropdown = this.page.getByLabel('Position Type');
        this.salaryCurrencyDropdown = this.page.getByLabel('Salary Currency');
        this.exemptStatusDropdown = this.page.getByLabel('Exemption Status *');
        this.jobGradeField = this.page.locator('#worldco_jobgrade_cstfld');
        this.customFieldTextInput = this.page.locator('#customfieldtext_cstfld');
        this.customFieldTextareaInput = this.page.locator('#customfieldtextarea_cstfld');
        this.customFieldDropdown = this.page.locator('#customfielddropdown_cstfld');
        this.customFieldMultiselect = this.page.locator('#customfieldmultiselect_cstfld');

        // ROSI Skills Match locators
        this.specificPlaywrightTestJobLink = this.page.getByRole('link', { name: 'Specific Playwright Test' });
        this.readyToIdentifyText = this.page.getByText('Ready to identify top talent?');

        this.sourceWithRosiButton = this.page.getByRole('button', { name: 'Source with ROSI' });

        // Job Details dashboard tiles ("Embedded Job Posting Details Page")
        this.jobOverviewHeading = this.page.getByText('Job Overview', { exact: true });
        this.recruitmentFunnelHeading = this.page.getByText('Recruitment Funnel', { exact: true });
        this.sectionsCollapseAllButton = this.page.getByText('Collapse All', { exact: true });
        this.sectionsExpandAllButton = this.page.getByText('Expand All', { exact: true });
        this.jobInformationExpandButton = this.page.getByRole('button', { name: 'Job Information', exact: true });
        this.personnelRecruitmentExpandButton = this.page.getByRole('button', { name: 'Personnel & Recruitment', exact: true });

        // ROSI Candidate Match widget (dashboard card on Job Details) — not a semantic heading, plain text + icon
        this.rosiCandidateMatchLabel = this.page.getByText('ROSI Candidate Match', { exact: true });
        this.rosiCandidateMatchInfoIcon = this.page.locator('svg[aria-label="How candidate match is calculated"]');
    }

    async navigateToJobDetailsPage() {
        await this.jobsMenuItem.click();
        await this.jobTrackingMenuItem.click();
        await this.page.waitForLoadState('load');
    }

    async searchJobsAndClickCheckbox(jobTitle){
        await this.editSearchLink.click();
        await this.jobTitleOrCodeField.fill(jobTitle);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.tableCheckbox.check();
        await this.firstTableRow.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async editJob(jobPosting){
        await this.ellipsisMenuLinks.click();
        await this.editJobLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.postedJobTitleField.fill(jobPosting.postedJobTitle);
        await this.jobDescriptionRTE.fill(jobPosting.jobDescription);
        await this.requiredSkillsRTE.fill(jobPosting.requiredSkills);
        await this.requiredExperienceRTE.fill(jobPosting.requiredExperience);
        await this.internalSkillsRTE.fill(jobPosting.skillsCandidateShouldPossess);
        await this.internalDescriptionRTE.fill(jobPosting.notesOnPosition);
        await this.saveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // Edits every CX-visible field on the Edit Job Posting form (single
    // page), so the CX Job Details page can be re-verified end to end after
    // an edit. Mirrors CreateJobPostingPage.fillPositionDetails' field set.
    async editJobAllFields(jobPosting){
        await this.ellipsisMenuLinks.click();
        await this.editJobLink.click();
        await this.page.waitForLoadState('domcontentloaded');

        // Coded dropdowns (Position Type, Job Level, Travel, Salary Type,
        // Salary Currency, Level of Education, Years of Experience, State,
        // Exemption Status) are selected by their visible label — the edit
        // form's <option value> codes differ from the create form's (e.g.
        // Position Type's #jobtype uses different values), but the labels are
        // stable across both.
        await this.postedJobTitleField.fill(jobPosting.postedJobTitle);
        await this.trackingCodeField.fill(jobPosting.trackingCode);
        await this.jobLevelDropdown.selectOption({ label: jobPosting.jobLevelLabel });
        await this.positionTypeDropdown.selectOption({ label: jobPosting.positionTypeLabel });
        await this.cityField.fill(jobPosting.city);
        await this.zipCodeField.fill(jobPosting.zipCode);
        await this.stateDropdown.selectOption({ label: jobPosting.stateLabel });
        await this.travelDropdown.selectOption({ label: jobPosting.travelLabel });
        await this.salaryMinimumField.fill(jobPosting.salaryMinimum);
        await this.salaryMaximumField.fill(jobPosting.salaryMaximum);
        await this.salaryTypeDropdown.selectOption({ label: jobPosting.salaryTypeLabel });
        // Salary Currency uses value="USD" on both create and edit forms
        // (its visible label differs from the plain code), so select by value.
        await this.salaryCurrencyDropdown.selectOption(jobPosting.salaryCurrency);
        await this.levelOfEducationDropdown.selectOption({ label: jobPosting.levelOfEducationLabel });
        await this.yearsOfExperienceDropdown.selectOption({ label: jobPosting.yearsOfExperienceLabel });
        await this.jobDescriptionRTE.fill(jobPosting.jobDescription);
        await this.requiredSkillsRTE.fill(jobPosting.requiredSkills);
        await this.requiredExperienceRTE.fill(jobPosting.requiredExperience);
        await this.internalSkillsRTE.fill(jobPosting.skillsCandidateShouldPossess);
        await this.internalDescriptionRTE.fill(jobPosting.notesOnPosition);
        await this.exemptStatusDropdown.selectOption({ label: jobPosting.exemptStatusLabel });

        if (jobPosting.customFields) {
            const cf = jobPosting.customFields;
            await this.jobGradeField.fill(cf.jobGrade);
            await this.customFieldTextInput.fill(cf.text);
            await this.customFieldTextareaInput.fill(cf.textarea);
            await this.customFieldDropdown.selectOption(cf.dropdown);
            await this.customFieldMultiselect.selectOption(cf.multiselect);
        }

        await this.saveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getJobInJobInformation(jobTitle) {
        return this.page
            .locator('.ui-lib-jp-MuiTypography-root.ui-lib-jp-MuiTypography-text-sm-regular.entl-155yehy')
            .getByText(jobTitle, { exact: true }).first();
    }

    async postNewJob(){
        await this.ellipsisMenuLinks.click();
        await this.postNewJobLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async cloneThisJob(){
        await this.ellipsisMenuLinks.click();
        await this.cloneThisJobLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async searchClonedJob(jobTitle){
        await this.saveButton.click();
        await this.navigateToJobDetailsPage();
        await this.editSearchLink.click();
        await this.clearFiltersButton.click();
        await this.jobTitleOrCodeField.fill(jobTitle);
        await this.page.selectOption('#isActive', '1');
        await this.postingStatusDropdown.click();
        await this.postingStatusDropdown.fill('On Hold');
        await this.postingStatusDropdown.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.getByRole('menuitem', { name: 'On Hold' }).click();
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.tableCheckbox.check();
        await this.takeActionButton.click();
        await this.deactivateLink.click();
        await this.modalSave.click();
    }


    async openJobByName(jobTitle) {
        await this.editSearchLink.click();
        await this.clearFiltersButton.click();
        await this.jobTitleOrCodeField.fill(jobTitle);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.firstTableRow.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async editRequiredSkills(skills) {
        await this.ellipsisMenuLinks.click();
        await this.editJobLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.requiredSkillsRTE.fill(skills);
        await this.saveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async expandExperienceQualificationsSection() {
        const section = this.page.getByRole('button', { name: 'Experience & Qualifications', exact: true });
        await section.click();
    }

    async loginAndNavigateToJob() {
        await this.page.goto('/');
        await this.login();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async openSpecificPlaywrightTestJob() {
        await this.specificPlaywrightTestJobLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // Dashboard stat tile (Candidates, New Candidates, Pending Disposition, Pipeline, Offers Extended, Positions, Open)
    getStatTile(label) {
        return this.page.getByText(label, { exact: true });
    }

    async toggleCollapseAllSections() {
        await this.sectionsCollapseAllButton.click();
    }

    async toggleExpandAllSections() {
        await this.sectionsExpandAllButton.click();
    }

    async toggleJobInformationSection() {
        await this.jobInformationExpandButton.click();
    }

    async togglePersonnelRecruitmentSection() {
        await this.personnelRecruitmentExpandButton.click();
    }

    // The job overview's "Career Site Links" list names every career site the
    // job is currently posted to, one <li> per site, each linking straight at
    // that site's copy of the job:
    //   .../playwrightqa/CorporateCareerPortal/Jobs/173194
    // so the portal code is the path segment before /Jobs/.
    //
    // Live-verified 2026-09-30: the list is lazy-loaded — it is NOT in the DOM
    // at domcontentloaded, so this waits for it rather than reading straight
    // away. Returns [] if it never appears, which is a meaningful answer (the
    // job is posted to no career site at all), not an error — the caller is
    // better placed to say whether that is a failure.
    // Single place this flow resolves the ATS host, so a caller driving the
    // page from CX over to the ATS never has to name it.
    get atsBaseUrl() {
        return process.env.ATS_BASE_URL || 'https://playwrightqa-openhire.silkroad-eng.com';
    }

    async goToAtsAndLogin() {
        await this.page.goto(this.atsBaseUrl);
        await this.login();
        await this.page.waitForLoadState('load');
    }

    async getCareerSitePortalCodes(jobId, timeout = 15000) {
        await this.page.goto(`${this.atsBaseUrl}/?fuseaction=postings.displayjob&jobId=${jobId}`);
        await this.page.waitForLoadState('domcontentloaded');

        const careerSiteLinks = this.page.getByRole('list', { name: 'Career Site Links' });
        const appeared = await careerSiteLinks
            .waitFor({ state: 'visible', timeout })
            .then(() => true)
            .catch(() => false);
        if (!appeared) return [];

        const hrefs = await careerSiteLinks
            .getByRole('link')
            .evaluateAll(links => links.map(link => link.getAttribute('href')));

        return hrefs
            .map(href => (/\/([^/]+)\/Jobs\/\d+/i.exec(href || '') || [])[1])
            .filter(Boolean);
    }
}

module.exports = JobDetailsPage;
