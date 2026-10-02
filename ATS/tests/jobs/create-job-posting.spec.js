// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

test.describe('Create job postings', () => {
    test('[C239] create (*Huge case*)', async ({  createJobPostingPage, createJobPostingData }) => {
        await createJobPostingPage.createNewJobPosting(createJobPostingData, false);
        await expect(await createJobPostingPage.searchAndVerify(createJobPostingData.internalJobTitle)).toBe(true);
        await createJobPostingPage.deactivateJobPosting(createJobPostingData.internalJobTitle);
        await expect(await createJobPostingPage.deactivateSuccessModalLocator).toBeVisible();
    });

    test('[C1] Create Evergreen Job', async ({  createJobPostingPage, createJobPostingData }) => {
        await createJobPostingPage.createNewJobPosting(createJobPostingData, true);
        await expect(await createJobPostingPage.searchAndVerify(createJobPostingData.evergreenJobTitle)).toBe(true);
        await createJobPostingPage.deactivateJobPosting(createJobPostingData.evergreenJobTitle);
        await expect(await createJobPostingPage.deactivateSuccessModalLocator).toBeVisible();
    });

    test('[C242] create a posting with duplicate Internal Job Title shows a warning', async ({ createJobPostingPage, createJobPostingData }) => {
        // Reuses the same Internal Job Title as [C239] above (which this suite creates
        // repeatedly) to reliably trigger the duplicate check, but with its own unique
        // tracking code so this run's job can be cleaned up unambiguously afterward.
        const uniqueTrackingCode = 'C242-' + Date.now();
        await createJobPostingPage.fillPositionDetails({ ...createJobPostingData, trackingCode: uniqueTrackingCode }, false);
        await createJobPostingPage.fillDepartmentAndBudgetDetails(createJobPostingData);
        await createJobPostingPage.fillPriorityDetails();
        await createJobPostingPage.selectCategory(createJobPostingData);

        await expect(await createJobPostingPage.isDuplicateWarningShown()).toBe(true);

        await createJobPostingPage.handleDuplicateCheck();
        await createJobPostingPage.attachFiles();
        await createJobPostingPage.selectQuestions();
        await createJobPostingPage.completeJobPosting();

        await expect(await createJobPostingPage.searchAndVerify(uniqueTrackingCode)).toBe(true);
        await createJobPostingPage.deactivateJobPosting(uniqueTrackingCode);
        await expect(await createJobPostingPage.deactivateSuccessModalLocator).toBeVisible();
    });

    // [C148943] Create Job Posting - Not applicable fields
    // Scope note: verified Job Level, Travel, and Industry default to "Not Applicable"
    // when left unselected. Business Function was not included — its accessible label
    // couldn't be pinned down reliably in the time available (it renders further down the
    // Department & Budget step and getByLabel('Business Function') didn't resolve it).
    test('[C148943] Job Level, Travel, and Industry default to "Not Applicable" when unselected', async ({ createJobPostingPage, createJobPostingData }) => {
        await createJobPostingPage.navigateToJobPostingPage();

        await expect(await createJobPostingPage.getDefaultOptionLabel(createJobPostingPage.jobLevelDropdown)).toBe('Not Applicable');
        await expect(await createJobPostingPage.getDefaultOptionLabel(createJobPostingPage.travelDropdown)).toBe('Not Applicable');

        // Verified live: the wizard doesn't persist a searchable job record until later
        // steps are submitted, so stopping after Position Details leaves nothing to clean up.
        await createJobPostingPage.fillPositionDetails({ ...createJobPostingData, trackingCode: 'C148943-' + Date.now() }, false);
        await expect(await createJobPostingPage.getDefaultOptionLabel(createJobPostingPage.industryDropdown)).toBe('Not Applicable');
    });

    // [C234852] Job Create/Edit - Email template dropdown populated with active templates
    test('[C234852] Automated Email for Imported Candidates dropdown is populated with active templates and a blank option', async ({ createJobPostingPage }) => {
        await createJobPostingPage.navigateToJobPostingPage();

        const options = await createJobPostingPage.getEmailTemplateOptions();
        expect(options.length).toBeGreaterThan(1);
        expect(options).toContain('Playwright Email Template for Update');
        expect(options[0].trim()).toBe('[ Choose One ]');
    });
});