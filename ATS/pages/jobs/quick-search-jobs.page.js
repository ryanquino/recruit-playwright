const BasePage = require('../base.page.js');

class QuickSearchJobsPage extends BasePage {
    constructor(page) {
        super(page);

        // Define all locators
        this.jobSearchInput = this.page.getByRole('textbox', { name: 'Job Search' });
        this.resultsFound = this.page.locator('#bulkActionItemsRecordCount');
    }

    async searchForJob(searchTerm) {
        await this.jobSearchInput.click();
        await this.jobSearchInput.fill(searchTerm);
        await this.jobSearchInput.press('Enter');
        await this.page.waitForLoadState('load');
    }

    async getJobLinkByName(jobName) {
        return this.page.getByRole('link', { name: jobName });
    }

    async isJobVisible(jobName) {
        const jobLink = await this.getJobLinkByName(jobName);
        return await jobLink.first().isVisible();
    }
}

module.exports = QuickSearchJobsPage;
