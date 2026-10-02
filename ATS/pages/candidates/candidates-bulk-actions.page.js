const BasePage = require('../base.page.js');

class CandidatesBulkActionsPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        this.candidateNavLocator = this.page.getByLabel('Candidates', { exact: true });
        this.candidatePoolNavLocator = this.page.getByLabel('Candidate Pool');
        this.editSearchButton = this.page.getByText('Edit Search');
        this.candidateNameField = this.page.getByLabel('Candidate Name');
        this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
        this.takeActionButton = this.page.getByRole('link', { name: 'Take Action ' });
        this.changeDispositionLink = this.page.getByRole('listitem').filter({ hasText: 'Change Disposition' });
        this.removeDispositionLink = this.page.getByRole('listitem').filter({ hasText: 'Remove Disposition' });
        this.dispositionDropdown = this.page.locator('#newDispositionId');
        this.modalSaveButton = this.page.locator('#bulkActionModalSave');
        this.columnButtonModal = this.page.getByRole('link', { name: '' });
        this.dispositionColumn = this.page.locator('[data-code="disposition"]');
        this.applyColumnButton = this.page.locator('#configurableColumnsModalApply');
        this.columnLinkLocator = this.page.getByRole('link', { name: '' });
        this.editSuccessfulAlert = this.page.locator('div').filter({ hasText: 'Your edit was successful!' }).nth(1);
        this.declinedRelocation = this.page.getByRole('cell', { name: 'Declined-Relocation issue' });
        this.dispositionTableColumnLocator = this.page.locator('table tbody tr:first-child td').nth(6);
        this.deleteSuccessfulAlert = this.page.locator('div').filter({ hasText: 'The Resume/CV Profiles have been moved to the Recycle Bin' }).nth(1);
        this.jobTitleTableColumnLocator = this.page.locator('table tbody tr:first-child td').nth(3);
        this.changeJobAssociationLink = this.page.getByRole('listitem').filter({ hasText: 'Change Job Association' });
        this.deleteSelectedLink = this.page.getByRole('listitem').filter({ hasText: 'Delete Selected' });
        this.newJobIdInputFIeld = this.page.locator('#newJobId_input');
        this.firstCheckbox = this.page.locator('input[name="bulkActionItemId"]').first();
        this.disqualifySelectedLink = this.page.getByRole('listitem').filter({ hasText: 'Disqualify Selected' });
        this.qualifySelectedLink = this.page.getByRole('listitem').filter({ hasText: 'Qualify Selected' }).nth(1) ;
        this.yesRadioButton = this.page.locator('#qualifiedstatus_1');
        this.noRadioButton = this.page.locator('#qualifiedstatus_0');
        this.firstCandidateNameTableLocator = this.page.locator(`table:has-text("Candidate") td a`).first();
        this.assignTagsLink = this.page.getByRole('listitem').filter({ hasText: 'Assign/Manage Tags' });
        this.assignTagMethodDropdown = this.page.getByLabel('Select a method');
        this.newTagInputField = this.page.locator('#newTagId_input');
        this.addCommentsLink = this.page.getByRole('listitem').filter({ hasText: 'Add Comment' });
        this.commentField = this.page.locator('#comment');
        this.jobPostingDropdown = this.page.locator('#jobId_input');
        this.resumeReviewLink = this.page.getByRole('listitem').filter({ hasText: 'Resume Review/Forward Resume' });
        this.subjectField = this.page.getByLabel('Subject: *');
        this.internalRecipientsDropdown = this.page.locator('#internal_user_id_input');
        this.resumeCVTabHtmlCheckbox = this.page.getByLabel('Resume/CV tab HTML');
        this.taskListIcon = this.page.getByRole('link', { name: '' });
        this.sendEmailLink = this.page.getByRole('listitem').filter({ hasText: 'Send Email' });
        this.emailTemplateDropdown = this.page.getByLabel('Select a "Template" message');
        this.sendEmailButton = this.page.getByRole('button', { name: 'Send' });
        this.sendEmailSuccessfulAlert = this.page.locator('div').filter({ hasText: 'Email Transmission Completed' }).nth(1);
        this.noRadioButton = this.page.locator('#qualifiedstatus_0');
        this.firstCandidateNameTableLocator = this.page.locator(`table:has-text("Candidate") td a`).first();
        this.assignTagsLink = this.page.getByRole('listitem').filter({ hasText: 'Assign/Manage Tags' });
        this.assignTagMethodDropdown = this.page.getByLabel('Select a method');
        this.newTagInputField = this.page.locator('#newTagId_input');
        this.addCommentsLink = this.page.getByRole('listitem').filter({ hasText: 'Add Comment' });
        this.commentField = this.page.locator('#comment');
        this.jobPostingDropdown = this.page.locator('#jobId_input');
        this.resumeReviewLink = this.page.getByRole('listitem').filter({ hasText: 'Resume Review/Forward Resume' });
        this.subjectField = this.page.getByLabel('Subject: *');
        this.internalRecipientsDropdown = this.page.locator('#internal_user_id_input');
        this.resumeCVTabHtmlCheckbox = this.page.getByLabel('Resume/CV tab HTML');
        this.sendEmailLink = this.page.getByRole('listitem').filter({ hasText: 'Send Email' });
        this.emailTemplateDropdown = this.page.getByLabel('Select a "Template" message');
        this.sendEmailButton = this.page.getByRole('button', { name: 'Send' });
        this.sendEmailSuccessfulAlert = this.page.locator('div').filter({ hasText: 'Email Transmission Completed' }).nth(1);
        this.clearFiltersButton = this.page.getByRole('button', { name: 'Clear Filters' });
        this.changeHiringStageLink = this.page.getByRole('listitem').filter({ hasText: 'Change Hiring Stage' });
        this.hiringStageDropdown = this.page.locator('#newStageId');
    } 

    async goToAdvancedSearchPage(){
        await this.candidateNavLocator.click();
        await this.candidatePoolNavLocator.click();
        await this.page.waitForLoadState('load');
    }

    async addTableColumn(){
        await this.columnLinkLocator.click();
        await this.dispositionColumn.click();
        await this.applyColumnButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }  

    async searchCandidate(candidateName){
        await this.editSearchButton.click();
        await this.clearFiltersButton.click();
        await this.candidateNameField.fill(candidateName);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    } 

    async goToAdvancedSearchPage(){
        await this.candidateNavLocator.click();
        await this.candidatePoolNavLocator.click();
        await this.page.waitForLoadState('load');
    }

    async addTableColumn(){
        await this.columnLinkLocator.click();
        await this.dispositionColumn.click();
        await this.applyColumnButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }  

    async changeDisposition(dispositionValue){
        await this.firstCheckbox.check();
        await this.takeActionButton.click();
        await this.changeDispositionLink.click();
        await this.dispositionDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await this.dispositionDropdown.selectOption(dispositionValue);
        await this.modalSaveButton.click();
    }

    async disqualifySelected(){
        await this.firstCheckbox.check();
        await this.takeActionButton.click();
        await this.disqualifySelectedLink.click();
        await this.modalSaveButton.click();
    }

    async verifyDisualifiedStatusOnCRP(){
        await this.firstCandidateNameTableLocator.click();
        await this.page.waitForLoadState('load');
        const disqualifiedRadio = this.page.locator('input[name="qualification"][value="false"]');
        await disqualifiedRadio.waitFor({ state: 'visible' });
        return await disqualifiedRadio.isChecked();
    }

    async qualifySelected(){
        await this.firstCheckbox.check();
        await this.takeActionButton.click();
        await this.qualifySelectedLink.click();
        await this.modalSaveButton.click();
    }

    async verifyQualifiedStatusOnCRP(){
        await this.firstCandidateNameTableLocator.click();
        await this.page.waitForLoadState('load');
        const qualifiedRadio = this.page.locator('input[name="qualification"][value="true"]');
        await qualifiedRadio.waitFor({ state: 'visible' });
        return await qualifiedRadio.isChecked();
    }

    async changeJobAssociation(jobTitle){
        await this.firstCheckbox.check();
        await this.takeActionButton.click();
        await this.changeJobAssociationLink.click();
        await this.newJobIdInputFIeld.click();
        await this.newJobIdInputFIeld.fill(jobTitle);
        await this.newJobIdInputFIeld.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${jobTitle}")`); 
        await this.modalSaveButton.click();
    }

    async deleteSelected(){
        await this.firstCheckbox.check();
        await this.takeActionButton.click();
        await this.deleteSelectedLink.click();
        await this.modalSaveButton.click();
    }

    async assignManageTags(tag){
        await this.firstCheckbox.check();
        await this.takeActionButton.click();
        await this.assignTagsLink.click();
        await this.assignTagMethodDropdown.selectOption('addToExisting');
        await this.newTagInputField.click();
        await this.newTagInputField.fill(tag);
        await this.newTagInputField.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${tag}")`); 
        await this.modalSaveButton.click();
    }

    async replaceTagsWithNew(tag){
        await this.firstCheckbox.check();
        await this.takeActionButton.click();
        await this.assignTagsLink.click();
        await this.assignTagMethodDropdown.selectOption('replaceAllWith');
        await this.newTagInputField.click();
        await this.newTagInputField.fill(tag);
        await this.newTagInputField.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${tag}")`);
        await this.modalSaveButton.click();
    }

    async getTagAutocompleteSuggestions(partialTag){
        await this.firstCheckbox.check();
        await this.takeActionButton.click();
        await this.assignTagsLink.click();
        await this.assignTagMethodDropdown.selectOption('addToExisting');
        await this.newTagInputField.click();
        await this.newTagInputField.fill(partialTag);
        await this.newTagInputField.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        const suggestions = await this.page.locator('.ui-autocomplete li').allTextContents();
        await this.page.keyboard.press('Escape');
        return suggestions.map(s => s.trim()).filter(Boolean);
    }

    async verifyTagOnCRP(tag){
        await this.firstCandidateNameTableLocator.click();
        await this.page.waitForLoadState('load');
        const tagsList = this.page.locator('div[role="list"][aria-label="Associated tags"]');
        await tagsList.waitFor({ state: 'visible' });
        return tagsList.locator(`span[aria-label="${tag}"]`).isVisible();
    }

    async removeDisposition(){
        await this.firstCheckbox.check();
        await this.takeActionButton.click();
        await this.removeDispositionLink.click();
        await this.modalSaveButton.click();
    }

    async addComment(comment){
        await this.firstCheckbox.check();
        await this.takeActionButton.click();
        await this.addCommentsLink.click();
        await this.commentField.fill(comment);
        await this.modalSaveButton.click();
    }

    async reviewReviewForwardResume(jobTitle){
        await this.editSearchButton.click();
        await this.clearFiltersButton.click();
        await this.jobPostingDropdown.click();
        await this.jobPostingDropdown.fill(jobTitle);
        await this.jobPostingDropdown.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${jobTitle}")`); 
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.firstCheckbox.check();
        await this.takeActionButton.click();
        await this.resumeReviewLink.click();
        await this.subjectField.fill('Playwright Resume Review');
        await this.internalRecipientsDropdown.click();
        await this.internalRecipientsDropdown.fill('Relicx Test');
        await this.internalRecipientsDropdown.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${'Relicx Test'}")`); 
        await this.resumeCVTabHtmlCheckbox.check();
        await this.modalSaveButton.click();
    }

    async getToDoListLocator(jobTitle){
        await this.taskListIcon.click();
        await this.page.waitForLoadState('load');
        return this.page.locator('.todo-list__todos-container .todo-card-title', { hasText: jobTitle });
    }

    async sendEmail(template){
        await this.firstCheckbox.check();
        await this.takeActionButton.click();
        await this.sendEmailLink.click();
        await this.emailTemplateDropdown.selectOption({ label: template });
        const iframeElementHandle = await this.page.waitForSelector('iframe#txtEmailMsg_ifr');
        const frame = await iframeElementHandle.contentFrame();
        await frame.waitForSelector('body#tinymce');
        await this.modalSaveButton.click();
    }

    async changeHiringStage(hiringStage){
        await this.firstCheckbox.check();
        await this.takeActionButton.click();
        await this.changeHiringStageLink.click();
        await this.hiringStageDropdown.selectOption({ label: hiringStage });
        await this.modalSaveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}

module.exports = CandidatesBulkActionsPage;
