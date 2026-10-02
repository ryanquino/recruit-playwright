// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');
const CreateJobPostingPage = require('../../pages/jobs/create-job-posting.page');

test.describe('Embedded Job Details Page', () => {
    test('[C149522] Edit Job', async ({ jobDetailsPage, jobDetailsData }) => {
        await jobDetailsPage.searchJobsAndClickCheckbox(jobDetailsData.jobDetailsTestJob);
        await jobDetailsPage.editJob(jobDetailsData);
        await expect(await jobDetailsPage.getJobInJobInformation(jobDetailsData.postedJobTitle)).toBeVisible();
    });

    test('[C149523] Post New Job', async ({ jobDetailsPage, jobDetailsData }) => {
        const createNewJobPosting = new CreateJobPostingPage(jobDetailsPage.page);
        await jobDetailsPage.searchJobsAndClickCheckbox(jobDetailsData.jobDetailsTestJob);
        await jobDetailsPage.postNewJob();
        await createNewJobPosting.createNewJobPosting(jobDetailsData);
        const searchResult = await createNewJobPosting.searchAndVerify(jobDetailsData.internalJobTitle);
        expect(searchResult).toBe(true);
        await createNewJobPosting.deactivateJobPosting(jobDetailsData.internalJobTitle);
        await expect(createNewJobPosting.deactivateSuccessModalLocator).toBeVisible();
    });

    test('[C149524] Clone This Job', async ({ jobDetailsPage, jobDetailsData }) => {
        await jobDetailsPage.searchJobsAndClickCheckbox(jobDetailsData.jobDetailsTestJob);
        await jobDetailsPage.cloneThisJob();
        await expect(jobDetailsPage.successAlert).toBeVisible();
        await jobDetailsPage.searchClonedJob(jobDetailsData.jobDetailsTestJob);
        await expect(jobDetailsPage.successAlert).toHaveText(jobDetailsData.deactivateSuccessAlert);
    });
});
