const BasePage = require('../base.page.js');

class SourcePassiveCandidatesPage extends BasePage {     
    constructor(page) {
        super(page);
        this.page = page;
        this.initializeNavigationElements();
        this.initializeSearchElements();
        this.initializeFilterElements();
        this.initializeResultElements();
        this.initializeSavedSearchElements();
    }

    initializeNavigationElements() {
        this.navMenuLink = this.page.locator('#topMenu-menuItem-icon');
        this.navMenuJobsIcon = this.page.getByLabel('Jobs');
        this.navMenuAdministrationLink = this.page.getByLabel('Administration').getByText('Administration');
        this.sourcePassiveCandidatesSettings = this.page.getByRole('link', { name: 'Source with ROSI' });
        this.sourcePassiveCandidatePageHeading = this.page.getByRole('heading', { name: 'Source with ROSI' });
        this.jobTrackingLink = this.page.getByLabel('Job Tracking', { exact: true });
        this.settingsLink = this.page.getByLabel('Settings').getByText('Settings');
        this.navMenuCandidateLink = this.page.getByLabel('Candidates', { exact: true });
        this.sourcePassiveCandidatesMenuLink = this.page.getByLabel('Source with ROSI').getByText('Source with ROSI');
    }

    initializeSearchElements() {
        this.editSearchLink = this.page.getByText('Edit Search');
        this.jobTitleCodeField = this.page.getByLabel('Job Title or Code');
        this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
        this.testDataLink = this.page.getByRole('link', { name: 'Playwright CRP Job Test' });
        this.sourcePassiveCandidatesButton = this.page.getByRole('button', { name: 'Source with ROSI' });
        this.clearFiltersButton = this.page.getByRole('button', { name: 'Clear Filters' });
        this.searchQuerySummary = this.page.getByText('Searching for candidates');
    }

    initializeFilterElements() {
        this.jobTitleSection = this.page.getByRole('heading', { name: 'Job Title' });
        this.prefferedJobTitleField = this.page.getByLabel('Preferred Job Titles');
        this.prefferedJobTitleExclusion = this.page.locator('#collapsible-card-eucbjl1o').getByText('Exclusions');
        this.excludeJobTitleField = this.page.getByLabel('Excluded Job Titles');
        this.skillsSection = this.page.getByRole('heading', { name: 'Skills' });
        this.includedSkillsField = this.page.getByPlaceholder('E.g. Accounting');
        this.excludedSkillsField = this.page.getByLabel('Excluded Skills');
        this.locationSection = this.page.getByRole('heading', { name: 'Location' });
        this.locationCityField = this.page.getByPlaceholder('E.g. Seattle');
        this.locationEverywhereCheckbox = this.page.getByRole('checkbox', { name: 'Everywhere' });
        this.educationSection = this.page.getByRole('heading', { name: 'Education' });
        this.degreeRequired = this.page.getByLabel('Degree Required');
        this.schoolName = this.page.getByPlaceholder('E.g. Stanford OR Harvard');
        this.companiesSection = this.page.getByRole('heading', { name: 'Companies' });
        this.includedCompany = this.page.getByPlaceholder('E.g. Google');
        this.excludedCompany = this.page.getByLabel('Excluded Companies');
        this.excludedCompanyField = this.page.getByRole('checkbox', { name: 'Exclusions' });
        this.industrySection = this.page.getByRole('heading', { name: 'Industry' });
        this.industryField = this.page.getByPlaceholder('E.g. Financial Services');
        this.highlightSection = this.page.getByRole('heading', { name: 'Highlights (Powered by ROSI)' }).first();
        this.highlightCheckbox = this.page.getByLabel('🏃 More Likely to Move');
        this.experienceSection = this.page.getByRole('heading', { name: 'Experience' });
        this.yearsOfExperienceRange = this.page.getByLabel('Years of experience').nth(1);
        this.monthsAtCurrentJob = this.page.getByLabel('Months at current job').nth(2);
        this.includedFilter = this.page.locator('b');
        this.applyButton = this.page.getByRole('button', { name: 'Apply' });
    }

    initializeResultElements() {
        this.sourcePassiveCandidatesResultsList = this.page.locator('.ui-lib-sr-MuiGrid-root > div:nth-child(2) > div > div:nth-child(2)');
        this.enableDiversitySetting = this.page.getByLabel('Select None of diversity types');
        this.saveDiversitySettingButton = this.page.locator('#saveSettingsModalButtonPrimary');
    }

    initializeSavedSearchElements() {
        this.saveSearchOptionsButton = this.page.getByRole('button', { name: 'Save search options' });
        this.saveSearchAsOption = this.page.getByText('Save Search As...');
        this.saveSearchAsHeading = this.page.getByRole('heading', { name: 'Save Search As...' });
        this.searchNameInput = this.page.getByRole('textbox', { name: 'Search Name' });
        this.saveButton = this.page.getByRole('button', { name: 'Save' });
        this.savedSuccessfullyMessage = this.page.getByText('Saved Successfully');
        this.savedSearchesCombobox = this.page.getByRole('combobox', { name: 'Saved Searches' });
        this.viewAllOption = this.page.getByRole('option', { name: 'View All' });
        this.mySavedSearchesHeading = this.page.getByRole('heading', { name: 'My Saved Searches' });
        this.nameColumnHeader = this.page.getByRole('columnheader', { name: 'Name' });
        this.locationColumnHeader = this.page.getByRole('columnheader', { name: 'Location' });
        this.dateUpdatedColumnHeader = this.page.getByRole('columnheader', { name: 'Date Updated' });
        this.deleteButton = this.page.getByRole('button', { name: 'Delete' });
        this.deleteConfirmationText = this.page.getByText('Are you sure you want to');
        this.continueButton = this.page.getByRole('button', { name: 'Continue' });
        this.deletedSuccessfullyMessage = this.page.getByText('Deleted Successfully');
    }

    async goToSourcePassiveCandidatesPageFromJobs(jobTitle){
        await this.navMenuLink.click();
        await this.navMenuJobsIcon.click();       
        await this.jobTrackingLink.click();
        await this.page.waitForLoadState('load');
        await this.editSearchLink.click();
        await this.clearFiltersButton.click();
        await this.jobTitleCodeField.click();
        await this.jobTitleCodeField.fill(jobTitle);
        await this.page.selectOption('#isActive', '1');
        await this.applyFiltersButton.click();
        await this.testDataLink.click();
        await this.page.waitForLoadState('load');
        await this.sourcePassiveCandidatesButton.click();
        await this.page.waitForSelector('h1.lifesuite__h1.lifesuite__float-left', { state: 'visible' });    
    }

    async goToSourcePassiveCandidatesPage(){
        await this.navMenuLink.click();
        await this.navMenuCandidateLink.click();
        await this.sourcePassiveCandidatesMenuLink.click();
        await this.page.waitForLoadState('load');
    }

    async applyCandidateFilter(filterType, value, additionalOptions = {}){
        await this.page.waitForSelector('.ui-lib-sr-MuiCircularProgress-svg', { state: 'visible' });
        await this.page.waitForSelector('.ui-lib-sr-MuiCircularProgress-svg', {state: 'hidden'});
        switch(filterType){
            case 'jobTitle':
                await this.jobTitleSection.click();
                await this.prefferedJobTitleField.click();
                await this.prefferedJobTitleField.fill(value);
                await this.prefferedJobTitleField.press('Enter');            
                break;
            case 'skills':
                await this.skillsSection.click();
                await this.includedSkillsField.fill(value);
                await this.includedSkillsField.press('Enter');
                break;
            case 'location':
                await this.locationSection.click();
                await this.locationCityField.click();
                await this.locationCityField.fill(value);
                await this.locationCityField.press('Enter');
                break;
            case 'education':
                await this.educationSection.click();
                await this.degreeRequired.click();
                await this.page.getByRole('option', { name: value }).click();
                await this.schoolName.click();
                await this.schoolName.fill(additionalOptions.schoolName);
                await this.schoolName.press('Enter');
                break;
            case 'companies':
                await this.companiesSection.click();
                await this.includedCompany.click();
                await this.includedCompany.fill(value);
                await this.includedCompany.press('Enter');
                await this.excludedCompanyField.check();
                await this.excludedCompany.click();
                await this.excludedCompany.fill(additionalOptions.excludedCompany);
                await this.excludedCompany.press('Enter');
                break;
            case 'industry':
                await this.industrySection.click();
                await this.industryField.click();
                await this.industryField.fill(value);
                await this.page.keyboard.press('Enter');
                break;
            case 'highlights':
                await this.highlightSection.click();
                await this.highlightCheckbox.check();
                break;         
        }
        await this.applyButton.click();
    }

    async getResult(){
        await this.page.waitForSelector('entl-4ejps8', { state: 'hidden' });
        const result = await this.page.locator('[id^="profile-"][class*="entl-1aj47gf"]').first();
        return result;
    }

    async waitForLoadingSpinner(){
        await this.page.waitForSelector('.ui-lib-sr-MuiCircularProgress-svg', { state: 'visible' });
        await this.page.waitForSelector('.ui-lib-sr-MuiCircularProgress-svg', {state: 'hidden'});
    }

    async saveSearchAs(searchName) {
        await this.saveSearchOptionsButton.click();
        await this.saveSearchAsOption.click();
        await this.searchNameInput.click();
        await this.searchNameInput.fill(searchName);
        await this.saveButton.click();
    }

    async viewAllSavedSearches() {
        await this.savedSearchesCombobox.waitFor({ state: 'visible' });
        await this.savedSearchesCombobox.click();
        await this.viewAllOption.waitFor({ state: 'visible' });
        await this.viewAllOption.click();
    }

    getSavedSearchByName(searchName) {
        return this.page.getByText(searchName).first();
    }

    async hoverOverSavedSearch(searchName) {
        const savedSearch = this.getSavedSearchByName(searchName);
        await savedSearch.hover();
    }
}

module.exports = SourcePassiveCandidatesPage;