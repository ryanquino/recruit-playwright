const BasePage = require('../base.page.js');

class MyAccountPage extends BasePage {
    constructor(page) {
        super(page);

         this.administrationMenuItem = this.page.getByLabel('Administration', { exact: true });
         this.profileActions = this.page.locator('.lifesuite__oh_profile-initial-small');
         this.myAcccountLink = this.page.getByRole('listitem').filter({ hasText: 'My Account' });
         this.cxLink = this.page.getByRole('listitem').filter({ hasText: 'Candidate Experience Admin' });
         this.logoutLink = this.page.getByRole('listitem').filter({ hasText: 'Log Out' });
         this.myGroupsTab = this.page.getByRole('link', { name: 'My Groups' });
         this.groupUsersDropdown = this.page.getByRole('textbox', { name: 'Group Users *' });
         this.addGroupLink = this.page.getByRole('link', { name: 'Add Group' });
         this.groupNameField = this.page.getByRole('textbox', { name: 'Group Name *' });
         this.groupTypeDropdown = this.page.getByLabel('Group Type');
         this.saveButton = this.page.getByRole('button', { name: 'Save' });
         this.loginFormLocator = this.page.locator('#splash-container div').filter({ hasText: 'Username Please enter username. Password Please enter password. Login Forgot' }).nth(3);
         this.tableRow = this.page.locator('#groupResults tbody tr');
         this.editLink = this.page.locator('a', { hasText: 'Edit' });
         this.deleteLink = this.page.locator('a', { hasText: 'Delete' });
         this.languageDropdown = this.page.locator('#languageID');
         this.germanHeading = this.page.getByRole('heading', { name: 'Eigenes Profil aktualisieren' });
         this.germanSaveButton = this.page.getByRole('button', { name: 'Speichern' });
         this.coutnryDropdown = this.page.getByLabel('Country');
    } 

    async navigateToMyAccountpage(){
        await this.profileActions.click();
        await this.myAcccountLink.click();
        await this.page.waitForLoadState('load');  
    }
    
    async getMyGroupTableCount(){
        await this.myGroupsTab.click();
        return (await this.tableRow.count()) > 0;
    }

    async addAGroup(groupDetails){
        await this.myGroupsTab.click();
        await this.addGroupLink.click();
        await this.groupNameField.fill(groupDetails.name);
        await this.groupTypeDropdown.selectOption(groupDetails.type);
        await this.groupUsersDropdown.click();
        await this.groupUsersDropdown.pressSequentially((groupDetails.users), { delay: 30 });
        await this.groupUsersDropdown.press('ArrowDown');
        await this.page.waitForSelector('.ui-autocomplete li', { state: 'attached' });
        await this.page.click(`.ui-autocomplete li:has-text("${groupDetails.users}")`);
        await this.saveButton.click();            
    }

    async getLocatorOfNewlyAddedGroup(name){
        return await this.page.locator(`table:has-text("Name") td:has-text("${name}")`);;
    }
    
    async editGroup(name){
        await this.myGroupsTab.click();
        await this.editLink.first().click();
        await this.groupNameField.fill(name);
        await this.saveButton.click();
    }

    async deleteGroup(){
        await this.myGroupsTab.click();
        this.page.once('dialog', dialog => {
            dialog.accept();
        });
        await this.deleteLink.last().click();
        await this.page.waitForLoadState('networkidle');  
    }

    async getCXUrlAfterRedirection(){
        await this.profileActions.click();
        const newTab = this.page.waitForEvent('popup');
        await this.cxLink.click();
        const cxPage = await newTab;
        await cxPage.waitForLoadState('domcontentloaded');
        const url = cxPage.url();
        return url.startsWith('https://qa-recruiting-cx.silkroad-eng.com/playwrightqa');
    }

    async logout(){
        await this.profileActions.click();
        await this.logoutLink.click();
        await this.page.waitForLoadState('networkidle');  
        return this.loginFormLocator;
    }

    async updateLangauge(value){ 
        if(await this.germanHeading.isVisible()) {
            await this.languageDropdown.selectOption(value);
            await this.page.waitForFunction(() => {
                const dropdown = document.querySelector('#countryID');
                return dropdown && dropdown.value === '230';
            });
            await this.germanSaveButton.click()
        }
        else {           
            await this.languageDropdown.selectOption(value);
            await this.page.waitForFunction(() => {
                const dropdown = document.querySelector('#countryID');
                return dropdown && dropdown.value === '230';
            });
            await this.saveButton.click();     
        }
        await this.page.waitForLoadState('networkidle');  
        
    }

}

module.exports = MyAccountPage;
