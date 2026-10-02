// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

test.describe('Edit Job Required Skills', () => {
    test('[C240] edit required skills for a job', async ({ jobDetailsPage, jobDetailsData }) => {
        // Generate unique skills text with timestamp
        const timestamp = Date.now();
        const updatedSkills = `${jobDetailsData.updated_required_skills} ${timestamp}`;
        
        // Navigate to job tracking and open the job
        await jobDetailsPage.navigateToJobDetailsPage();
        await jobDetailsPage.openJobByName(jobDetailsData.job_name_for_edit);
        
        // Edit the required skills with unique text
        await jobDetailsPage.editRequiredSkills(updatedSkills);
        
        // Expand Experience & Qualifications section to verify the change
        await jobDetailsPage.expandExperienceQualificationsSection();
        
        // Verify the updated skills are visible
        const skillsText = jobDetailsPage.page.getByText(updatedSkills);
        await expect(skillsText.first()).toBeVisible();
    });
});
