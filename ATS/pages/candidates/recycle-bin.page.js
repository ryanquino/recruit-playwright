const BasePage = require('../base.page.js');

class RecycleBinPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        //Candidate Pool locators
        this.candidateNavLocator = this.page.getByLabel('Candidates', { exact: true });
        this.recycleBinNavLocator = this.page.getByLabel('Recycle Bin');
        this.uploadNavLocator = this.page.getByLabel('Upload');
        this.candidatePoolNavLocator = this.page.getByLabel('Candidate Pool');
        this.editSearchButton = this.page.getByText('Edit Search');
        this.candidateNameField = this.page.getByLabel('Candidate Name');
        this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
        this.firstCheckbox = this.page.locator('input[name="bulkActionItemId"]').first();
        this.takeActionButton = this.page.getByRole('link', { name: 'Take Action ' });
        this.deleteSelectedLink = this.page.getByRole('listitem').filter({ hasText: 'Delete Selected' });
        this.modalSaveButton = this.page.locator('#bulkActionModalSave');
        this.recycleBinTableLocator = this.page.locator('table.rival-table tbody tr');
        this.searchField = this.page.getByRole('searchbox');
        this.searchButton = this.page.locator('#submitSearch');
        this.recycleBinEllipsis = this.page.locator('.oh__icon-button.lifesuite__float-right');
        this.firstCheckbox = this.page.locator('input[name="bulkActionItemId"]').first();
        this.firstCheckboxRecycleBin = this.page.locator('#resumeid_1').first();
        this.restoreLink = this.page.getByRole('link', { name: 'Restore' });
        this.deleteLink = this.page.getByRole('link', { name: 'Delete' }).first();
        this.purgeLink = this.page.getByRole('link', { name: 'Purge Recycle Bin' });
        this.purgeModalButton = this.page.locator('#purgeAll_ModalButtonPrimary');
        this.deleteModalButton = this.page.locator('#purge_ModalButtonPrimary');
        this.successToaster = this.page.locator('text=The selected resumes have been restored to the Talent Community stage.');
        this.deleteSuccessToaster = this.page.locator('text=The resume have been purged from the recycle bin.');
        this.purgeSuccessToaster = this.page.locator('text=The resumes have been purged from the recycle bin.');
        this.recycleBinMessageLocator = this.page.getByText('There are no resumes in the Recycle Bin.');
        this.selectAllCheckbox = this.page.locator('#selectAllCheckbox');
    } 

    async navigateToRecycleBin(){
        await this.candidateNavLocator.click();
        await this.recycleBinNavLocator.click();
        await this.page.waitForLoadState('load');
    }

    async navigateToUpload(){
        await this.uploadNavLocator.click(); 
        await this.page.waitForLoadState('load');
    }

    async deleteCandidate(candidateName){
        await this.candidatePoolNavLocator.click();
        await this.page.waitForLoadState('load');
        await this.editSearchButton.click();
        await this.candidateNameField.fill(candidateName);
        await this.applyFiltersButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.firstCheckbox.check();
        await this.takeActionButton.click();
        await this.deleteSelectedLink.click();
        await this.modalSaveButton.click();
        await this.recycleBinNavLocator.click();
        await this.page.waitForLoadState('networkidle');
    }

    async search(searchString){
        await this.searchField.fill(searchString);
        await this.searchButton.click();
    }

    async restore(){
        await this.recycleBinNavLocator.click();
        await this.page.waitForLoadState('load');
        await this.firstCheckboxRecycleBin.click();
        await this.recycleBinEllipsis.click();
        await this.restoreLink.click();
        await this.page.waitForLoadState('load');
    }

    async delete(){
        await this.recycleBinNavLocator.click();
        await this.page.waitForLoadState('load');
        await this.selectAllCheckbox.check();
        await this.recycleBinEllipsis.click();
        await this.deleteLink.click();
        await this.deleteModalButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async purge(){
        await this.recycleBinNavLocator.click();
        await this.page.waitForLoadState('load');
        await this.recycleBinEllipsis.click();
        await this.purgeLink.click();
        await this.purgeModalButton.click();
    }

}

module.exports = RecycleBinPage;
