// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

test.describe('Job Templates Navigation', () => {
    test('[C20498] Verify Job Templates page is accessible from Jobs menu', async ({ basePage }) => {
        const JobTemplatesPage = require('../../pages/jobs/job-templates.page');
        const jobTemplatesPage = new JobTemplatesPage(basePage.page);
        
        // Click Jobs menu to expand it
        // Click Jobs menu to expand it
        await jobTemplatesPage.jobsMenuItem.click();
        
        // Wait for the navigation link to be visible after menu expansion
        await expect(jobTemplatesPage.jobTemplatesNavLink).toBeVisible();
        
        // Verify "Create Job Template" link is visible in the Jobs menu
        
        // Click on Job Templates link to navigate to the page
        await jobTemplatesPage.jobTemplatesNavLink.click();
        await basePage.page.waitForLoadState('load');
        
        // Verify Job Templates heading is visible on the page
        await expect(basePage.page.getByRole('heading', { name: 'Job Templates' })).toBeVisible();
    });
});
