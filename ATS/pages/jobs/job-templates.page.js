const BasePage = require('../base.page.js');

class JobTemplatesPage extends BasePage {
    constructor(page) {
        super(page);

         // Define all locators
         this.jobsMenuItem = this.page.getByLabel('Jobs', { exact: true });
         this.jobTemplatesNavLink = this.page.getByLabel('Create Job Template');
         this.createJobTemplateButton = this.page.getByRole('button', { name: 'Create' });
         this.templateNameField = this.page.getByLabel('Template Name *');
         this.locationDropdown  = this.page.getByLabel('Location', { exact: true });
         this.hiringWorkflowDropdown = this.page.getByLabel('Hiring Workflow *');
         this.codeField = this.page.getByLabel('Code *');
         this.industryDropdown = this.page.getByLabel('Industry');
         this.departmentDropdown = this.page.getByLabel('Department', { exact: true });
         this.businessFunctionDropdown = this.page.getByLabel('Business Function');
         this.positionTypeDropdown = this.page.getByLabel('Position Type');
         this.yearsOfExperienceDropdown = this.page.getByLabel('Years of Experience');
         this.levelOfEducationDropdown = this.page.getByLabel('Level of Education');
         this.travelDropdown = this.page.getByLabel('Travel');
         this.salaryTypeDropdown = this.page.getByLabel('Salary Type');
         this.budgetedSalary = this.page.getByLabel('Budgeted Salary');
         this.budgetCurrencyDropdown = this.page.getByLabel('Budget Currency');
         this.salaryMinimumField = this.page.getByLabel('Salary Minimum');
         this.salaryMaximumField = this.page.getByLabel('Salary Maximum');
         this.salaryCurrencyDropdown = this.page.getByLabel('Salary Currency');
         this.jobDescriptionRTE = this.page.locator('#sJobDesc_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.requiredSkillsRTE = this.page.locator('#sReqSkills_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.requiredExperienceRTE = this.page.locator('#experience_rqd_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.internalNotesRTE = this.page.locator('#sIntDesc_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.internalSkillsRTE = this.page.locator('#sIntSkills_ifr').contentFrame().getByLabel('Rich Text Area. Press ALT-0');
         this.exemptStatusDropdown = this.page.getByLabel('Exemption Status (E)');
         this.collectEEODropdown = this.page.getByLabel('Collect EEO for this job? (N)');
         this.saveButton = this.page.getByRole('button', { name: 'Save' });
         this.viewAllTemplatesLink = this.page.getByRole('link', { name: 'View all Templates' });
         this.deactivateButton = this.page.getByRole('button', { name: 'De-activate' });
         this.activateButton = this.page.getByRole('button', { name: 'Activate' });
         this.showAllJobTemplate = this.page.getByLabel('Show only active Job Templates');
    } 

    async navigateToJobsTemplatePage() {
        await this.jobsMenuItem.click();
        await this.jobTemplatesNavLink.click();
        await this.page.waitForLoadState('load');   
    }

    async createJobTemplate(jobTemplate){
        await this.createJobTemplateButton.click();
        await this.page.waitForLoadState('load');  
        await this.templateNameField.click();
        await this.templateNameField.fill(jobTemplate.templateName);
        await this.locationDropdown.selectOption(jobTemplate.location);
        await this.hiringWorkflowDropdown.selectOption(jobTemplate.hiringWorkflow);
        await this.codeField.click();
        await this.codeField.fill(jobTemplate.code);
        await this.industryDropdown.selectOption(jobTemplate.industry);
        await this.departmentDropdown.selectOption(jobTemplate.department);
        await this.businessFunctionDropdown.selectOption(jobTemplate.businessFunction);
        await this.positionTypeDropdown.selectOption(jobTemplate.positionType);
        await this.yearsOfExperienceDropdown.selectOption(jobTemplate.yearsOfExperience);
        await this.levelOfEducationDropdown.selectOption(jobTemplate.levelOfEducation);
        await this.travelDropdown.selectOption(jobTemplate.travel);
        await this.salaryTypeDropdown.selectOption(jobTemplate.salaryType);
        await this.budgetedSalary.click();
        await this.budgetedSalary.fill(jobTemplate.budgetedSalary);
        await this.budgetCurrencyDropdown.selectOption(jobTemplate.budgetCurrency);
        await this.salaryMinimumField.click();
        await this.salaryMinimumField.fill(jobTemplate.salaryMinimum);
        await this.salaryMaximumField.click();
        await this.salaryMaximumField.fill(jobTemplate.salaryMaximum);
        await this.salaryCurrencyDropdown.selectOption(jobTemplate.salaryCurrency);
        await this.jobDescriptionRTE.fill(jobTemplate.jobDescription);
        await this.requiredSkillsRTE.fill(jobTemplate.requiredSkills);
        await this.requiredExperienceRTE.fill(jobTemplate.requiredExperience);
        await this.internalNotesRTE.fill(jobTemplate.internalNotes);
        await this.internalSkillsRTE.fill(jobTemplate.internalSkills);
        await this.exemptStatusDropdown.selectOption(jobTemplate.exemptStatus);
        await this.collectEEODropdown.selectOption(jobTemplate.collectEEO);
        await this.saveButton.click();
        await this.page.waitForLoadState('load');  
    }

    async getLocatorOfNewlyCreatedJobTemplate(templateName){
        await this.page.getByRole('cell', { name: 'P', exact: true }).click();
        await this.page.waitForLoadState('networkidle');  
        return await this.page.locator(`table:has-text("Template Name") td:has-text("${templateName}")`);     
    }

    async isJobTemplateSorted(){
        await this.page.getByRole('cell', { name: 'A', exact: true }).click();
        await this.page.waitForLoadState('networkidle');  

        const templateNames = await this.page
        .locator('table:has-text("Template Name") tr td:nth-child(0)')
        .allTextContents();

        return templateNames.every(text => text.trim().toUpperCase().startsWith('A'));
    }

    async getTableRowCount(){
        await this.viewAllTemplatesLink.click();
        await this.page.waitForLoadState('load');
        return await this.page.locator(`table:has-text("Template Name") tbody tr`).count();
    }

    async viewAllTemplates(){
        await this.viewAllTemplatesLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    //Job Postings column link for a given template row (3rd column: Template Name, Client Code, Job Postings, Active)
    async getJobPostingsCountLink(templateName){
        const row = this.page.locator('table:has-text("Template Name") tbody tr', { hasText: templateName });
        return row.locator('td').nth(2).getByRole('link');
    }

    async clickJobPostingsLink(templateName){
        const link = await this.getJobPostingsCountLink(templateName);
        await link.click();
        await this.page.waitForLoadState('networkidle');
    }

    //Filter summary shown on the Job Tracking page after following a Job Postings link, e.g. "Job Template: Benefits Administrator (0000000045)"
    // Original vs fixed: getByText('Job Template:') only matched the <strong> label itself —
    // the template name lives in a sibling <span id="appliedFilterjobTemplateId">, not inside it.
    async getJobTemplateFilterSummary(){
        return this.page.locator('#appliedFilterjobTemplateId');
    }

    async deactivateJobTemplate(templateName){
        const labelLink = this.page.locator(`table:has-text("Template Name") td:has-text("${templateName}") a`);
        await labelLink.click();
        await this.page.waitForLoadState('load');  
        await this.deactivateButton.click();
        await this.page.waitForLoadState('load');  
    }

    async activateJobTemplate(templateName){
        await this.showAllJobTemplate.uncheck();
        await this.page.waitForLoadState('load');  
        await this.page.getByRole('cell', { name: 'P', exact: true }).click();
        await this.page.waitForLoadState('load');  
        const labelLink = this.page.locator(`table:has-text("Template Name") td:has-text("${templateName}") a`);
        await labelLink.click();
        await this.page.waitForLoadState('load');  
        await this.activateButton.click();
        await this.page.waitForLoadState('load');  
    }


}

module.exports = JobTemplatesPage;
