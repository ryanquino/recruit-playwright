// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

const testCases = [
    { id: '[C209]', type: 'recruiter', option: 'postings.reassignRecruiter' },
    { id: '[C211]', type: 'recruitingManager', option: 'postings.reassignRecruitingManager' },
    { id: '[C213]', type: 'hiringManager', option: 'postings.reassignHiringManager' },
    { id: '[C212]', type: 'repliesEmailTo', option: 'postings.reassignRepliesEmailedTo' },
    { id: '[C215]', type: 'businessUnit', option: 'postings.reassignBusinessUnit' },
    { id: '[C217]', type: 'department', option: 'postings.reassignDepartment' },
    { id: '[C219]', type: 'category', option: 'postings.reassignCategory' },
    { id: '[C221]', type: 'companyLocation', option: 'postings.reassignCompanyLocation' },
];

testCases.forEach(({ id, type, option }) => {
    test(`${id} take action - reassign ${type}`, async ({ jobsBulkActionPage, jobsBulkActionData }) => {
        await jobsBulkActionPage.searchJobsAndClickCheckbox(jobsBulkActionData.default.title1);
        if (['recruiter', 'recruitingManager', 'hiringManager', 'repliesEmailTo'].includes(type)) {
            await jobsBulkActionPage.reassignManagers(jobsBulkActionData.updateTo.recruiter, type);
        } else {
            await jobsBulkActionPage.reassignEntity(jobsBulkActionData.updateTo[type], type);
        }
        await expect(await jobsBulkActionPage.successModalLocator).toBeVisible();
        await jobsBulkActionPage.revert(option, jobsBulkActionData.default[type]);
    });
});

const invalidTestCases = [
    { id: '[C214]', type: 'hiringManager', errorMessage: 'You must select a hiring manager.' },
    { id: '[C216]', type: 'businessUnit', errorMessage: 'You must select a business unit.' },
    { id: '[C218]', type: 'department', errorMessage: 'You must select a department.' },
    { id: '[C220]', type: 'category', errorMessage: 'You must select a category.' },
    { id: '[C222]', type: 'companyLocation', errorMessage: 'You must select a company location.' },
];

invalidTestCases.forEach(({ id, type, errorMessage }) => {
    test(`${id} take action - reassign ${type} - scenario 2`, async ({ jobsBulkActionPage, jobsBulkActionData }) => {
        await jobsBulkActionPage.searchJobsAndClickCheckbox(jobsBulkActionData.default.title1);
        await jobsBulkActionPage.attemptInvalidReassign(type, jobsBulkActionData.invalidValue);
        await expect(jobsBulkActionPage.getValidationError(errorMessage)).toBeVisible();
    });
});

test.describe.serial('Additional Location Actions', () => {
    test.use({ skipJobDeactivation: true });
    test('[C223] take action - add additional locations', async ({ jobsBulkActionPage, jobsBulkActionData }) => {
        await jobsBulkActionPage.searchJobsAndClickCheckbox(jobsBulkActionData.default.title1);
        await jobsBulkActionPage.reassignEntity(jobsBulkActionData.updateTo.additionalLocation, 'addAdditionalLocation');
        await expect(await jobsBulkActionPage.successModalLocator).toBeVisible();
    });

    test('[C225] take action - remove additional locations', async ({ jobsBulkActionPage, jobsBulkActionData }) => {
        await jobsBulkActionPage.searchJobsAndClickCheckbox(jobsBulkActionData.default.title1);
        await jobsBulkActionPage.reassignEntity(jobsBulkActionData.updateTo.additionalLocation, 'removeAdditionalLocation');
        await expect(await jobsBulkActionPage.successModalLocator).toBeVisible();
    });

    test('[C224] take action - add additional locations - scenario 2', async ({ jobsBulkActionPage, jobsBulkActionData }) => {
        await jobsBulkActionPage.searchJobsAndClickCheckbox(jobsBulkActionData.default.title1);
        await jobsBulkActionPage.attemptInvalidReassign('addAdditionalLocation', jobsBulkActionData.invalidValue);
        await expect(jobsBulkActionPage.getValidationError('You must select a company location.')).toBeVisible();
    });

    test('[C226] take action - remove additional locations - scenario 2', async ({ jobsBulkActionPage, jobsBulkActionData }) => {
        await jobsBulkActionPage.searchJobsAndClickCheckbox(jobsBulkActionData.default.jobTitleForDeactivation);
        await jobsBulkActionPage.removeAdditionalLocationWithoutSelecting();
        await expect(jobsBulkActionPage.getValidationError('You must select a company location.')).toBeVisible();
    });
});

test.describe.serial('Fee Agency Actions', () => {
    test.use({ skipJobDeactivation: true });
    test('[C227] take action - assign to fee agency', async ({ jobsBulkActionPage, jobsBulkActionData }) => {
        await jobsBulkActionPage.searchJobsAndClickCheckbox(jobsBulkActionData.default.title1);
        await jobsBulkActionPage.reassignEntity(jobsBulkActionData.updateTo.feeagency, 'addFeeAgency');
        await expect(await jobsBulkActionPage.successModalLocator).toBeVisible();
    });

    test('[C228] take action - remove from fee agency - scenario 2', async ({ jobsBulkActionPage, jobsBulkActionData }) => {
        await jobsBulkActionPage.searchJobsAndClickCheckbox(jobsBulkActionData.default.title1);
        await jobsBulkActionPage.reassignEntity(jobsBulkActionData.updateTo.feeagency, 'removeFeeAgency');
        await expect(await jobsBulkActionPage.successModalLocator).toBeVisible();
    });

});

test.describe.serial('Deactivate/activate jobs', () => {
    test.use({ skipJobDeactivation: true });
    test('[C208] take action - deactivate', async ({ jobsBulkActionPage, jobsBulkActionData }) => {
        await jobsBulkActionPage.searchJobsAndClickCheckbox(jobsBulkActionData.default.jobTitleForDeactivation);
        await jobsBulkActionPage.deactivateJobPosting();
        await expect(await jobsBulkActionPage.successModalLocator).toBeVisible();
    });
    
    test('[C210] take action - activate', async ({ jobsBulkActionPage, jobsBulkActionData }) => {
        await jobsBulkActionPage.searchJobsAndClickCheckbox(jobsBulkActionData.default.jobTitleForDeactivation);
        await jobsBulkActionPage.activateJobPosting();
        await expect(await jobsBulkActionPage.successModalLocator).toBeVisible();
    });
});

