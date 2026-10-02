// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');
const JobDetailsPage = require('../../pages/jobs/job-details.page');

test.describe('ROSI Skills Match', () => {
    test('[C212759] Verify login and navigate to Specific Playwright Test job', async ({ basePage, rosiSkillsMatchData }) => {
        // Verify user is logged in and on Open Jobs page
        await expect(basePage.openJobsHeading).toBeVisible();
        
        // Navigate to Specific Playwright Test job
        const jobDetailsPage = new JobDetailsPage(basePage.page);
        await jobDetailsPage.openSpecificPlaywrightTestJob();
        
        // Verify job details page loaded
        await expect(jobDetailsPage.readyToIdentifyText).toBeVisible();
    });

    test('[C222333] Open Manage Skills modal from job details', async ({ rosiSkillsMatchManageSkillsModalPage, rosiSkillsMatchManageSkillsModalData }) => {
        await rosiSkillsMatchManageSkillsModalPage.openJob(rosiSkillsMatchManageSkillsModalData.job_title);
        await rosiSkillsMatchManageSkillsModalPage.openManageSkillsModal();
        await expect(rosiSkillsMatchManageSkillsModalPage.manageSkillsHeading).toBeVisible();
    });
});
