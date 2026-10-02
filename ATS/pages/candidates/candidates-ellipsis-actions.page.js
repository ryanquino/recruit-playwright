const BasePage = require('../base.page.js');

class CandidatesEllipsisActionsPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        //Candidate Pool locators
        this.candidateNavLocator = this.page.getByLabel('Candidates', { exact: true });
        this.candidatePoolNavLocator = this.page.getByLabel('Candidate Pool');
        this.candidatesEllipsisActions = this.page.locator('.oh__icon-button > div > .fas');
        this.columnsLink = this.page.locator('#configureColumns');
        this.basicSearchLink = this.page.locator('#systemSearches');
        this.saveSearchAsLink = this.page.locator('#saveFilters');
        this.mySearchesLink = this.page.locator('#mySearches');
        this.manageMySearchesLink = this.page.locator('#manageMySearches');
        this.daysToHireColumn = this.page.locator('[data-code="daysToHire"]');
        this.cityColumn = this.page.locator('[data-code="city"]');
        this.dispositionColumn = this.page.locator('[data-code="disposition"]');
        this.applyColumnButton = this.page.locator('#configurableColumnsModalApply');
        this.tableHeading = this.page.locator('table thead tr');
        this.basicTodaysResumesLink = this.page.locator('#savedSearch_5');
        this.nameField = this.page.getByLabel('Name', { exact: true });
        this.manageMySearchesSaveButton = this.page.locator('#manageSavedSearchesModalSave');
        this.saveButton = this.page.locator('#saveSearchModalSave');
        // Scope to the dropdown's real shared list container via a confirmed top-level item, rather than
        // an incomplete hardcoded id list, so every item (including ones without a known id) is captured.
        this.ellipsisMenu = this.columnsLink.locator('xpath=ancestor::ul[1]');
    }

    //Navigate to candidate pool advanced search page
    async goToAdvancedSearchPage(){
        await this.candidateNavLocator.click();
        await this.candidatePoolNavLocator.click();
        await this.page.waitForLoadState('networkidle');
    }

    async addTableColumn(){
        await this.candidatesEllipsisActions.click();
        await this.columnsLink.click();
        await this.cityColumn.click();
        await this.dispositionColumn.click();
        await this.daysToHireColumn.click();
        await this.applyColumnButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getPageHeading(heading){
        return this.page.getByRole('heading', { name: heading, level: 1 });
    }

    async basicSearch(){
        await this.candidatesEllipsisActions.click();
        await this.basicSearchLink.click();
        await this.basicTodaysResumesLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async saveSearch(name){
        await this.candidatesEllipsisActions.click();
        await this.saveSearchAsLink.click();
        await this.nameField.fill(name);
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        // After saving, navigate to the saved search via My Searches to load it
        await this.candidatesEllipsisActions.click();
        await this.mySearchesLink.click();
        const searchLink = this.page.locator('a', { hasText: name });
        await searchLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async mySearches(name){
        await this.candidatesEllipsisActions.click();
        await this.mySearchesLink.click();
        const searchLink = this.page.locator('a', { hasText: name });
        await searchLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
    
    async manageMySearches(name){
        await this.candidatesEllipsisActions.click();
        await this.manageMySearchesLink.click();
        await this.page.locator('.control-group', { hasText: name }).locator('input[type="checkbox"]').check();
        await this.manageMySearchesSaveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async deleteExistingSavedSearch(name){
        await this.candidatesEllipsisActions.click();
        if (await this.manageMySearchesLink.isVisible()) {
            await this.manageMySearchesLink.click();
            const checkbox = this.page.locator('.control-group', { hasText: name }).locator('input[type="checkbox"]');
            if (await checkbox.isVisible()) {
                await checkbox.check();
            }
            await this.manageMySearchesSaveButton.click();
            await this.page.waitForLoadState('domcontentloaded');
        } else {
            // No saved searches exist, close the menu by clicking elsewhere
            await this.page.keyboard.press('Escape');
        }
    }

    // Open the ellipsis dropdown and return its item labels in display order
    async getEllipsisMenuItemLabels(){
        await this.candidatesEllipsisActions.click();
        await this.columnsLink.waitFor({ state: 'visible' });
        const labels = await this.ellipsisMenu.locator('> li').allTextContents();
        return labels.map(label => label.trim()).filter(Boolean);
    }
}

module.exports = CandidatesEllipsisActionsPage;
