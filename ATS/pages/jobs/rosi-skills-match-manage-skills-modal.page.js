const BasePage = require('../base.page.js');

class RosiSkillsMatchManageSkillsModalPage extends BasePage {
    constructor(page) {
        super(page);

        this.jobsMenuItem = this.page.getByLabel('Jobs', { exact: true });
        this.jobTrackingMenuItem = this.page.getByText('Job Tracking', { exact: true }).first();
        this.rosiSkillsMatchText = this.page.getByText('ROSI Skills Match');
        this.manageSkillsButton = this.page.getByRole('button', { name: 'Manage skills' });
        this.manageSkillsHeading = this.page.getByRole('heading', { name: 'Manage Skills' });
    }

    async navigateToJobTrackingPage() {
        await this.jobsMenuItem.click();
        await this.jobTrackingMenuItem.click();
        await this.page.waitForLoadState('load');
    }

    async openJob(jobTitle) {
        await this.page.getByRole('link', { name: jobTitle }).click();
        await this.page.waitForLoadState('load');
        await this.manageSkillsButton.waitFor({ state: 'visible', timeout: 10000 });
    }

    async openManageSkillsModal() {
        await this.manageSkillsButton.click();
        await this.page.waitForLoadState('load');
    }
}

module.exports = RosiSkillsMatchManageSkillsModalPage;
