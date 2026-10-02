// @ts-check
const { test, expect } = require('../fixtures/job-list-fixture');
const CreateJobPostingPage = require('../../../ATS/pages/jobs/create-job-posting.page');
const AtsJobDetailsPage = require('../../../ATS/pages/jobs/job-details.page');
// Dedicated data for the ATS-create -> CX-verify C164 test (its own job
// title so it doesn't collide with the shared ATS create-job-posting data
// used by ATS [C239]/[C1]).
const configureJobDetailsData = require('../../test-data/jobs/configure-job-details.json');

test.describe('Job Details Page', () => {
    test.beforeEach(async ({ jobDetailsPage, jobDetailsData }) => {
        await jobDetailsPage.navigateToJobDetails(jobDetailsData.jobTitle);
    });

    // SUPERSEDED — see the live-verified 2026-09-23 note directly above the
    // test below; the jobDetailsPage/jobDetailsData fixture this test
    // actually uses points at playwrightqa/CorporateCareerPortal2 (job
    // 173194), which has a live template today, so this historical account
    // no longer describes what this specific test hits. Left for context in
    // case portal 2577 itself (whatever test used to exercise it) is ever
    // revisited.
    //
    // Known environment issue (2026-09-03): portal 2577 (Corporate Career
    // Portal, shared by this test) currently has NO published/live custom
    // Job Details Page template — every panel under
    // /playwrightqa/admin/JobBoards/JobListings?portalId=2577 is Archived,
    // was the template these assertions were written against. Candidate
    // page falls back to a bare default layout (one combined summary
    // line) instead of the separate #ConfigurablePageDetail__* sections
    // asserted below.
    //
    // Root cause fixed: career-portal-job-details-publish-view-archive.spec.js's
    // [C167]Publish->[C169]View->[C170]Archive block used to run against this same
    // shared portal instead of a dedicated one, so every full run
    // published a throwaway page then immediately archived it, leaving
    // nothing live — that block now runs against portalId 2609 (Hourly
    // Career Portal) instead, so this can no longer recur.
    //
    // Still blocked: the archived state above predates that fix and can't
    // be repaired from here. Live-verified (2026-09-03) the "Add Field"
    // editor for a new Job Details Page on this portal offers zero
    // addable fields beyond the 7 defaults (Category, Job Location,
    // Tracking Code, Position Type, Job Description, Required Skills,
    // Required Experience) — none of the Location/Salary/Duration/Level/
    // custom-field sections this test asserts on can be added through
    // self-service admin UI, so "All Fields" was built by another means
    // (data import/migration) not available to this test suite. Needs
    // someone with that access to republish an equivalent template — not
    // a code-only fix. Tracked, not silently deleted.
    // Live-verified 2026-09-23: the fixture's jobDetailsPage/jobDetailsData
    // point at job 173194 on playwrightqa/CorporateCareerPortal2, which DOES
    // have a live custom Job Details Page template (the "archived template"
    // blocker in the comment above no longer applies to this fixture — it
    // may still apply to whatever portal 2577 setup that comment describes,
    // but that's not what this test actually runs against). The real
    // remaining issue was that every #ConfigurablePageDetail__* locator's
    // own text includes its heading label (e.g. "Job Location\n\nPlaywright
    // City, Hawaii, United States"), so toHaveText() (exact match) can never
    // pass against a plain value — switched to toContainText() throughout,
    // matching the pattern the two OpenSearch create/edit tests below
    // already use successfully for these same locators. jobTitleHeading is
    // a plain page heading (no embedded label), so it keeps toHaveText().
    test('[C164] Configure Job Details Page', { tag: '@smoke' }, async ({ jobDetailsPage, jobDetailsData }) => {
        await expect(jobDetailsPage.jobTitleHeading).toHaveText(jobDetailsData.jobTitle);
        await expect(jobDetailsPage.categorySection).toContainText(jobDetailsData.category);
        await expect(jobDetailsPage.jobLocationSection).toContainText(jobDetailsData.location.jobLocation);
        await expect(jobDetailsPage.trackingCodeSection).toContainText(jobDetailsData.trackingCode);
        await expect(jobDetailsPage.positionTypeSection).toContainText(jobDetailsData.positionType);
        await expect(jobDetailsPage.jobDescriptionSection).toContainText(jobDetailsData.jobDescription);
        await expect(jobDetailsPage.requiredSkillsSection).toContainText(jobDetailsData.requiredSkills);
        await expect(jobDetailsPage.requiredExperienceSection).toContainText(jobDetailsData.requiredExperience);
        await expect(jobDetailsPage.additionalLocationsSection).toContainText(jobDetailsData.location.additionalLocations);
        await expect(jobDetailsPage.allLocationsSection).toContainText(jobDetailsData.location.allLocations[0]);
        await expect(jobDetailsPage.allLocationsSection).toContainText(jobDetailsData.location.allLocations[1]);
        await expect(jobDetailsPage.jobDurationSection).toContainText(jobDetailsData.jobDuration);
        await expect(jobDetailsPage.jobLevelSection).toContainText(jobDetailsData.jobLevel);
        await expect(jobDetailsPage.levelOfEducationSection).toContainText(jobDetailsData.levelOfEducation);
        await expect(jobDetailsPage.maximumSalarySection).toContainText(jobDetailsData.positionRequirements.maximumSalary);
        await expect(jobDetailsPage.minimumSalarySection).toContainText(jobDetailsData.positionRequirements.minimumSalary);
        await expect(jobDetailsPage.salaryRangeSection).toContainText(jobDetailsData.positionRequirements.salaryRange);
        await expect(jobDetailsPage.postedDateSection).toContainText(jobDetailsData.postedDate);
        await expect(jobDetailsPage.salaryCurrencySection).toContainText(jobDetailsData.positionRequirements.salaryCurrency);
        await expect(jobDetailsPage.salaryTypeSection).toContainText(jobDetailsData.positionRequirements.salaryType);
        await expect(jobDetailsPage.travelRequirementsSection).toContainText(jobDetailsData.positionRequirements.travel);
        await expect(jobDetailsPage.yearsOfExperienceSection).toContainText(jobDetailsData.yearsOfExperience);
        await expect(jobDetailsPage.exemptionStatusSection).toContainText(jobDetailsData.customFields.exemptionStatus);
        await expect(jobDetailsPage.jobGradeSection).toContainText(jobDetailsData.customFields.jobGrade);
        await expect(jobDetailsPage.industrySection).toContainText(jobDetailsData.industry);
        await expect(jobDetailsPage.hiringManagerSection).toContainText(jobDetailsData.hiringManager);
        await expect(jobDetailsPage.companyLocationSection).toContainText(jobDetailsData.companyLocation);
        await expect(jobDetailsPage.richTextSection).toContainText(jobDetailsData.richText);
        await expect(jobDetailsPage.customFieldTextSection).toContainText(jobDetailsData.customFields.text);
        await expect(jobDetailsPage.customFieldTextareaSection).toContainText(jobDetailsData.customFields.textarea);
        await expect(jobDetailsPage.customFieldDropdownSection).toContainText(jobDetailsData.customFields.dropdown);
        await expect(jobDetailsPage.customFieldMultiselectSection).toContainText(jobDetailsData.customFields.multiselect);
    });

    test('[C168763] Apply button is visible', { tag: '@smoke' }, async ({ jobDetailsPage }) => {
        expect(await jobDetailsPage.isApplyButtonVisibleAndClickable()).toBe(true);
    });
});

// Own describe so the beforeEach above (a specific job on
// CorporateCareerPortal2) doesn't apply — this opens any job on
// CorporateCareerPortal while toggling its Indeed Integrations ON, then OFF.
// Ends with both settings OFF, CorporateCareerPortal's normal state.
test.describe('Job Details Page - Apply with Indeed', () => {
    test('[TC-31348] Apply with Indeed button Visibility on Job Details Page', { tag: '@smoke' }, async ({ careerPortalJobDetailsPage, jobDetailsPage, jobDetailsData }) => {
        const indeed = jobDetailsData.applyWithIndeed;

        // Enable both Indeed Integrations settings in Admin
        await careerPortalJobDetailsPage.goToIndeedIntegrationsPage(indeed.portalId);
        await careerPortalJobDetailsPage.setIndeedIntegrations(true);
        await careerPortalJobDetailsPage.goToIndeedIntegrationsPage(indeed.portalId);
        await expect(careerPortalJobDetailsPage.applyWithIndeedToggle).toBeChecked();
        await expect(careerPortalJobDetailsPage.indeedEasilyApplyToggle).toBeChecked();

        // Career portal -> any job -> its Job Details page shows the button
        await jobDetailsPage.goToCareerPortal(indeed.portalPath);
        const { jobTitle, jobId } = await jobDetailsPage.navigateToFirstJobDetails();
        await expect(jobDetailsPage.page).toHaveURL(new RegExp(`${indeed.portalPath}/jobs/${jobId}`));
        await expect(jobDetailsPage.jobTitleHeading).toHaveText(jobTitle);

        await jobDetailsPage.applyWithIndeedButton.scrollIntoViewIfNeeded();
        await expect(jobDetailsPage.applyWithIndeedButton).toBeVisible();
        await expect(jobDetailsPage.applyWithIndeedButton).toContainText(indeed.buttonText);
        // Disable both settings in Admin
        await careerPortalJobDetailsPage.goToIndeedIntegrationsPage(indeed.portalId);
        await careerPortalJobDetailsPage.setIndeedIntegrations(false);
        await careerPortalJobDetailsPage.goToIndeedIntegrationsPage(indeed.portalId);
        await expect(careerPortalJobDetailsPage.applyWithIndeedToggle).not.toBeChecked();
        await expect(careerPortalJobDetailsPage.indeedEasilyApplyToggle).not.toBeChecked();

        // Same job's details page no longer shows the button
        await jobDetailsPage.navigateToJobById(indeed.portalPath, jobId);
        await expect(jobDetailsPage.jobTitleHeading).toHaveText(jobTitle);
        await expect(jobDetailsPage.applyWithIndeedButton).not.toBeVisible();
    });
});

// [C164] Configure Job Details Page — end-to-end across ATS + CX. Creates a
// job posting in the ATS backend (reusing CreateJobPostingPage, the same
// flow as ATS [C239]), then verifies that job surfaces on the CX candidate
// career portal's Job Details page. This is the create-then-verify variant
// of the fixme'd C164 above: it doesn't depend on a pre-existing published
// "All Fields" template, so it verifies the job's presence (title heading)
// rather than the archived custom-section layout.
test.describe.serial('Configure Job Details Page (ATS create -> CX verify)', () => {
    test('OpenSearch - Add Job Posting on ATS and Verify on CX', async ({ jobDetailsPage }) => {
        // Long end-to-end flow: full ATS job creation + a 30s OpenSearch
        // indexing wait + CX verification. Raise the timeout well above the
        // 60s default so the indexing wait doesn't eat the whole budget.
        test.setTimeout(240000);

        // Create the job posting in the ATS backend on the same browser
        // session. The beforeEach already navigated the page to the CX
        // portal, so switch over to ATS, log in, and create the job.
        const page = jobDetailsPage.page;
        const createJobPosting = new CreateJobPostingPage(page);
        await page.goto(process.env.ATS_BASE_URL || 'https://playwrightqa-openhire.silkroad-eng.com');
        await createJobPosting.login();
        await page.waitForLoadState('networkidle');
        await createJobPosting.navigateToJobPostingPage();
        await createJobPosting.createNewJobPosting(configureJobDetailsData, false);
        expect(await createJobPosting.searchAndVerify(configureJobDetailsData.internalJobTitle)).toBe(true);

        // Verify the same job now exists on the CX candidate career portal
        // and that every value entered in ATS surfaces on the configured Job
        // Details page. The configured template (with all the
        // #ConfigurablePageDetail__* sections) lives on CorporateCareerPortal2
        // (portalId 2582), not the bare-default CorporateCareerPortal. Values
        // are the exact CX display strings (labels for coded selects) captured
        // from a live render of this created job.
        const expected = configureJobDetailsData.expectedCxValues;
        // OpenSearch indexes the newly-created job asynchronously — give it
        // time to process before the candidate portal can surface the job.
        await page.waitForTimeout(60000);
        await page.goto(expected.portalUrl);
        await page.waitForLoadState('domcontentloaded');
        await jobDetailsPage.searchAndOpenJobDetails(expected.postedJobTitle);
        await page.waitForLoadState('domcontentloaded');
        await expect(jobDetailsPage.jobTitleHeading).toHaveText(expected.postedJobTitle);
        await expect(jobDetailsPage.categorySection).toContainText(expected.category);
        await expect(jobDetailsPage.jobLocationSection).toContainText(expected.jobLocation);
        await expect(jobDetailsPage.trackingCodeSection).toContainText(expected.trackingCode);
        await expect(jobDetailsPage.positionTypeSection).toContainText(expected.positionType);
        await expect(jobDetailsPage.jobDescriptionSection).toContainText(expected.jobDescription);
        await expect(jobDetailsPage.requiredSkillsSection).toContainText(expected.requiredSkills);
        await expect(jobDetailsPage.requiredExperienceSection).toContainText(expected.requiredExperience);
        await expect(jobDetailsPage.allLocationsSection).toContainText(expected.allLocations);
        await expect(jobDetailsPage.industrySection).toContainText(expected.industry);
        await expect(jobDetailsPage.jobDurationSection).toContainText(expected.jobDuration);
        await expect(jobDetailsPage.jobLevelSection).toContainText(expected.jobLevel);
        await expect(jobDetailsPage.levelOfEducationSection).toContainText(expected.levelOfEducation);
        await expect(jobDetailsPage.maximumSalarySection).toContainText(expected.maximumSalary);
        await expect(jobDetailsPage.minimumSalarySection).toContainText(expected.minimumSalary);
        await expect(jobDetailsPage.salaryCurrencySection).toContainText(expected.salaryCurrency);
        await expect(jobDetailsPage.salaryRangeSection).toContainText(expected.salaryRange);
        await expect(jobDetailsPage.salaryTypeSection).toContainText(expected.salaryType);
        await expect(jobDetailsPage.travelRequirementsSection).toContainText(expected.travelRequirements);
        await expect(jobDetailsPage.yearsOfExperienceSection).toContainText(expected.yearsOfExperience);
        await expect(jobDetailsPage.exemptionStatusSection).toContainText(expected.exemptionStatus);
        await expect(jobDetailsPage.jobGradeSection).toContainText(expected.jobGrade);
        await expect(jobDetailsPage.customFieldTextSection).toContainText(expected.customFieldText);
        await expect(jobDetailsPage.customFieldTextareaSection).toContainText(expected.customFieldTextarea);
        await expect(jobDetailsPage.customFieldDropdownSection).toContainText(expected.customFieldDropdown);
        await expect(jobDetailsPage.customFieldMultiselectSection).toContainText(expected.customFieldMultiselect);
        await expect(jobDetailsPage.hiringManagerSection).toContainText(expected.hiringManager);

        // No cleanup here — the edit test below runs next in this serial
        // block and needs the job to still be live. Deactivation happens
        // once in afterAll.
    });

    // [C149522-CX] Edit the job created above (via the ATS Edit Job flow,
    // reusing AtsJobDetailsPage.editJob), then re-verify on CX that the
    // updated values surface on the Job Details page. Depends on the create
    // test above (serial block) having posted the job.
    test('OpenSearch - Edit Job Details on ATS and Verify on CX', async ({ jobDetailsPage }) => {
        test.setTimeout(240000);
        const page = jobDetailsPage.page;
        const atsJobDetails = new AtsJobDetailsPage(page);
        const edit = configureJobDetailsData.editJob;

        // Edit the job in ATS. searchJobsAndClickCheckbox finds the job by
        // its current (pre-edit) posted title, then editJob updates it.
        await page.goto(process.env.ATS_BASE_URL || 'https://playwrightqa-openhire.silkroad-eng.com');
        await atsJobDetails.login();
        await page.waitForLoadState('networkidle');
        await atsJobDetails.navigateToJobDetailsPage();
        await atsJobDetails.searchJobsAndClickCheckbox(configureJobDetailsData.postedJobTitle);
        await atsJobDetails.editJobAllFields(edit);

        // Verify the full Job Details page on CX after OpenSearch reindexes
        // the edited job. The edited fields (title, description, required
        // skills/experience) show the updated values; every other section
        // is untouched by editJob() and must still show its original C164
        // value. Merge the two so all sections are asserted.
        const original = configureJobDetailsData.expectedCxValues;
        const updated = edit.expectedCxValues;
        const expected = { ...original, ...updated };
        await page.goto(original.portalUrl);
        await page.waitForLoadState('domcontentloaded');
        await jobDetailsPage.searchAndOpenJobDetails(expected.postedJobTitle);
        await page.waitForLoadState('domcontentloaded');
        await expect(jobDetailsPage.jobTitleHeading).toHaveText(expected.postedJobTitle);
        await expect(jobDetailsPage.categorySection).toContainText(expected.category);
        await expect(jobDetailsPage.jobLocationSection).toContainText(expected.jobLocation);
        await expect(jobDetailsPage.trackingCodeSection).toContainText(expected.trackingCode);
        await expect(jobDetailsPage.positionTypeSection).toContainText(expected.positionType);
        await expect(jobDetailsPage.jobDescriptionSection).toContainText(expected.jobDescription);
        await expect(jobDetailsPage.requiredSkillsSection).toContainText(expected.requiredSkills);
        await expect(jobDetailsPage.requiredExperienceSection).toContainText(expected.requiredExperience);
        await expect(jobDetailsPage.allLocationsSection).toContainText(expected.allLocations);
        await expect(jobDetailsPage.industrySection).toContainText(expected.industry);
        await expect(jobDetailsPage.jobDurationSection).toContainText(expected.jobDuration);
        await expect(jobDetailsPage.jobLevelSection).toContainText(expected.jobLevel);
        await expect(jobDetailsPage.levelOfEducationSection).toContainText(expected.levelOfEducation);
        await expect(jobDetailsPage.maximumSalarySection).toContainText(expected.maximumSalary);
        await expect(jobDetailsPage.minimumSalarySection).toContainText(expected.minimumSalary);
        await expect(jobDetailsPage.salaryCurrencySection).toContainText(expected.salaryCurrency);
        await expect(jobDetailsPage.salaryRangeSection).toContainText(expected.salaryRange);
        await expect(jobDetailsPage.salaryTypeSection).toContainText(expected.salaryType);
        await expect(jobDetailsPage.travelRequirementsSection).toContainText(expected.travelRequirements);
        await expect(jobDetailsPage.yearsOfExperienceSection).toContainText(expected.yearsOfExperience);
        await expect(jobDetailsPage.exemptionStatusSection).toContainText(expected.exemptionStatus);
        await expect(jobDetailsPage.jobGradeSection).toContainText(expected.jobGrade);
        await expect(jobDetailsPage.customFieldTextSection).toContainText(expected.customFieldText);
        await expect(jobDetailsPage.customFieldTextareaSection).toContainText(expected.customFieldTextarea);
        await expect(jobDetailsPage.customFieldDropdownSection).toContainText(expected.customFieldDropdown);
        await expect(jobDetailsPage.customFieldMultiselectSection).toContainText(expected.customFieldMultiselect);
        // editJobAllFields() doesn't touch Hiring Manager, so this should
        // still show the original create-step value.
        await expect(jobDetailsPage.hiringManagerSection).toContainText(expected.hiringManager);
    });

    // Cleanup — deactivate the (now edited) posting in ATS once, after both
    // tests in this block have run, so the portal is left in its original
    // state.
    test.afterAll(async ({ browser }) => {
        // The full ATS deactivation flow (login + navigate + search +
        // deactivate) exceeds the 60s default hook timeout.
        test.setTimeout(120000);
        const context = await browser.newContext();
        const page = await context.newPage();
        const createJobPosting = new CreateJobPostingPage(page);
        try {
            await page.goto(process.env.ATS_BASE_URL || 'https://playwrightqa-openhire.silkroad-eng.com');
            await createJobPosting.login();
            await page.waitForLoadState('networkidle');
            // Open the Jobs menu first so deactivateJobPosting() can reach the
            // Job Tracking item (it isn't visible until Jobs is expanded on a
            // fresh post-login page).
            await createJobPosting.jobsMenuItem.click();
            // Deactivate by the INTERNAL job title, not the edited posted
            // title — editJobAllFields only changes the posted title, so the
            // internal title (which the ATS Job Tracking "Job Title or Code"
            // search matches on) is still the original.
            await createJobPosting.deactivateJobPosting(configureJobDetailsData.internalJobTitle);
        } catch (error) {
            console.warn('job-details afterAll cleanup failed (non-fatal):', error instanceof Error ? error.message : String(error));
        } finally {
            await context.close();
        }
    });
});