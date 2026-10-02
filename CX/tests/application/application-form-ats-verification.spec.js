// @ts-check
const { test, expect } = require('../fixtures/application-fixture');

// Consolidated home for every application-form test that logs into the
// shared ATS backend account (process.env.USERNAME/PASSWORD, see
// ATS/pages/base.page.js) and reads back a Candidate Pool search result
// (getTableRowCount() / getRecordedSourceForSubmittedCandidate() /
// candidateExistsForEmail() / searchAppliedCandidate()). That account's
// search/result state is apparently shared server-side rather than scoped
// per browser session — live-verified (2026-09-03, and again 2026-09-07
// on run 34125520012) that two *different* describe.serial() blocks
// touching it (each internally serial) still raced each other when
// Playwright ran them concurrently in separate workers.
//
// A per-file (or per-block) describe.serial() can't fix this on its own:
// it only guarantees order WITHIN that block, not mutual exclusion
// against every OTHER file that also touches this same shared ATS
// session — and three other files do (fee-agency-apply.spec.js,
// fee-agency-localization.spec.js, application-form-localization.spec.js).
// The actual fix is playwright-cx.config.js's workers: 1 on CI, which
// removes the race at its source for all four files simultaneously — see
// that file's comment. With no concurrency possible, none of the tests
// below need to be serial with each other either, so this is now a plain
// describe() purely for report grouping/organization (this is where every
// ATS-Candidate-Pool-reading application-form test lives), not for
// execution-order guarantees. A failure in one no longer skips any other.
test.describe('Application Form - ATS Candidate Pool Verification', () => {


test.describe('Application Form Page', () => {
    // [SC-079] Beyond [C10]'s "a candidate with this email exists"
    // (getTableRowCount()), confirms the resulting ATS application record
    // is linked to the specific job that was applied to, not just any
    // record for that candidate.
    test('[C31370] Quick Apply creates a candidate and application record linked to the correct job', { tag: '@smoke' }, async ({ applicationFormPage, applicationFormData }) => {
        await applicationFormPage.navigateToJobApplicationForm(applicationFormData.jobTitle);
        await applicationFormPage.submitApplication(applicationFormData);
        await expect(applicationFormPage.successMessage).toBeVisible();
        await applicationFormPage.loginToATS();
        await applicationFormPage.searchAppliedCandidate();
        const jobTitle = await applicationFormPage.getJobTitleForSubmittedCandidate();
        expect(jobTitle).toBe(applicationFormData.jobTitle);
    });

    test('[C10] Application Form - Quick Apply', { tag: '@smoke' }, async ({ applicationFormPage, applicationFormData }) => {
        await applicationFormPage.navigateToJobApplicationForm(applicationFormData.jobTitle);
        await applicationFormPage.submitApplication(applicationFormData);
        await expect(applicationFormPage.successMessage).toBeVisible();
        await applicationFormPage.loginToATS();
        const recordCount = await applicationFormPage.getTableRowCount();
        await expect(recordCount).toBe(true);

        // Open the candidate's CRP and verify the submitted first name, last
        // name, and email are visible on the profile.
        await applicationFormPage.searchCandidateAndOpenCRP();
        await expect(applicationFormPage.crpCandidateName(applicationFormData.firstName, applicationFormData.lastName)).toBeVisible();
        await expect(applicationFormPage.crpCandidateEmail()).toBeVisible();

        // Verify the resume attached in ATS matches the file that was uploaded.
        await expect(await applicationFormPage.uploadedResumeMatchesLocal('resume.pdf')).toBe(true);

        // Open the Edit Candidate popup and verify the submitted contact
        // details persisted on the Modify Resume Profile form.
        const editPopup = await applicationFormPage.openEditCandidatePopup();
        await expect(editPopup.locator('#fullname')).toHaveValue(`${applicationFormData.firstName} ${applicationFormData.lastName}`);
        await expect(editPopup.locator('#firstname')).toHaveValue(applicationFormData.firstName);
        await expect(editPopup.locator('#lastname')).toHaveValue(applicationFormData.lastName);
        await expect(editPopup.locator('#emailaddress')).toHaveValue(applicationFormPage.submittedEmail);
        await editPopup.close();
    });

    test('[C22] Open Submission - Quick Apply', { tag: '@smoke' }, async ({ applicationFormPage, applicationFormData }) => {
        await applicationFormPage.navigateToOpenSubmissions();
        await applicationFormPage.submitApplication(applicationFormData);
        await expect(applicationFormPage.successMessage).toBeVisible();
        await applicationFormPage.loginToATS();
        const recordCount = await applicationFormPage.getTableRowCount();
        await expect(recordCount).toBe(true);

        // Open the candidate's CRP and verify the submitted first name, last
        // name, and email are visible on the profile.
        await applicationFormPage.searchCandidateAndOpenCRP();
        await expect(applicationFormPage.crpCandidateName(applicationFormData.firstName, applicationFormData.lastName)).toBeVisible();
        await expect(applicationFormPage.crpCandidateEmail()).toBeVisible();
        await expect(await applicationFormPage.uploadedResumeMatchesLocal('resume.pdf')).toBe(true);
    });

    test('[C813] Application Form - Configured Application', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        await configuredApplicationFormPage.submitConfiguredApplication(applicationFormData);
        await expect(configuredApplicationFormPage.successMessage).toBeVisible();
        await configuredApplicationFormPage.loginToATS();
        const recordCount = await configuredApplicationFormPage.getTableRowCount();
        await expect(recordCount).toBe(true);
    });

    test('[C23] Open Submission - Configured Application', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToOpenSubmissions();
        await configuredApplicationFormPage.submitConfiguredApplication(applicationFormData);
        await expect(configuredApplicationFormPage.successMessage).toBeVisible();
        await configuredApplicationFormPage.loginToATS();
        const recordCount = await configuredApplicationFormPage.getTableRowCount();
        await expect(recordCount).toBe(true);
    });

    test('[C35] Fee Agency Quick Apply', { tag: '@smoke' }, async ({ feeAgencyFormPage, applicationFormData }) => {
        await feeAgencyFormPage.navigateToFeeAgencyApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        await feeAgencyFormPage.submitApplication(applicationFormData);
        await expect(feeAgencyFormPage.successMessage).toBeVisible();
        await feeAgencyFormPage.loginToATS();
        const recordCount = await feeAgencyFormPage.getTableRowCount();
        await expect(recordCount).toBe(true);

        // Open the candidate's CRP and verify the submitted first name, last
        // name, and email are visible on the profile.
        await feeAgencyFormPage.searchCandidateAndOpenCRP();
        await expect(feeAgencyFormPage.crpCandidateName(applicationFormData.firstName, applicationFormData.lastName)).toBeVisible();
        await expect(feeAgencyFormPage.crpCandidateEmail()).toBeVisible();
        await expect(await feeAgencyFormPage.uploadedResumeMatchesLocal('resume.pdf')).toBe(true);
    });

    test('[C36] Fee Agency Configured Application', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        await feeAgencyConfiguredFormPage.submitFeeAgencyConfiguredApplication(applicationFormData);
        await expect(feeAgencyConfiguredFormPage.successMessage).toBeVisible();
        await feeAgencyConfiguredFormPage.loginToATS();
        const recordCount = await feeAgencyConfiguredFormPage.getTableRowCount();
        await expect(recordCount).toBe(true);
    });

    test('[C16] Internal Portal - Quick Apply', { tag: '@smoke' }, async ({ internalApplicationFormPage, applicationFormData }) => {
        await internalApplicationFormPage.navigateToJobApplicationForm(applicationFormData.internalJobTitle);
        await internalApplicationFormPage.submitApplication(applicationFormData);
        await expect(internalApplicationFormPage.successMessage).toBeVisible();
        await internalApplicationFormPage.loginToATS();
        const recordCount = await internalApplicationFormPage.getTableRowCount();
        await expect(recordCount).toBe(true);

        // Open the candidate's CRP and verify the submitted first name, last
        // name, and email are visible on the profile.
        await internalApplicationFormPage.searchCandidateAndOpenCRP();
        await expect(internalApplicationFormPage.crpCandidateName(applicationFormData.firstName, applicationFormData.lastName)).toBeVisible();
        await expect(internalApplicationFormPage.crpCandidateEmail()).toBeVisible();
        await expect(await internalApplicationFormPage.uploadedResumeMatchesLocal('resume.pdf')).toBe(true);
    });

    test('[C912] Internal Configured Application', async ({ internalConfiguredApplicationFormPage, applicationFormData }) => {
        await internalConfiguredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.internalJobTitle);
        await internalConfiguredApplicationFormPage.submitInternalConfiguredApplication(applicationFormData);
        await expect(internalConfiguredApplicationFormPage.successMessage).toBeVisible();
        await internalConfiguredApplicationFormPage.loginToATS();
        const recordCount = await internalConfiguredApplicationFormPage.getTableRowCount();
        await expect(recordCount).toBe(true);
    });


    test('[C913] Configured Apply - Internal Portal - All Fields', { tag: '@smoke' }, async ({ internalConfiguredApplicationFormPage, applicationFormData }) => {
        await internalConfiguredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.internalJobTitle);
        await internalConfiguredApplicationFormPage.submitInternalConfiguredApplication(applicationFormData);
        await expect(internalConfiguredApplicationFormPage.successMessage).toBeVisible();
        await internalConfiguredApplicationFormPage.loginToATS();
        const recordCount = await internalConfiguredApplicationFormPage.getTableRowCount();
        await expect(recordCount).toBe(true);

        // Open the candidate's CRP and verify name, email, and the uploaded
        // resume all landed in ATS.
        await internalConfiguredApplicationFormPage.searchCandidateAndOpenCRP();
        await expect(internalConfiguredApplicationFormPage.crpCandidateName(applicationFormData.firstName, applicationFormData.lastName)).toBeVisible();
        await expect(internalConfiguredApplicationFormPage.crpCandidateEmail()).toBeVisible();
        await expect(await internalConfiguredApplicationFormPage.uploadedResumeMatchesLocal('resume.pdf')).toBe(true);
    });

    // Previously skipped due to a KNOWN ATS BUG: the Edit Candidate popup's
    // #name_prefix shows the raw internal code '2' instead of the submitted
    // label 'Mr.'. Re-verified 2026-09-16: no longer reproducing — this test
    // (including the expectedEditPopup.prefix assertion) passes end-to-end.
    test('[C817] Configured Apply - External Portal - All the Field types', { tag: '@smoke' }, async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        await configuredApplicationFormPage.submitAllFieldsConfiguredApplication(applicationFormData);
        await expect(configuredApplicationFormPage.successMessage).toBeVisible();
        await configuredApplicationFormPage.loginToATS();
        const recordCount = await configuredApplicationFormPage.getTableRowCount();
        await expect(recordCount).toBe(true);

        // Open the candidate's CRP and verify name, email, and the uploaded
        // resume all landed in ATS.
        await configuredApplicationFormPage.searchCandidateAndOpenCRP();
        await expect(configuredApplicationFormPage.crpCandidateName(applicationFormData.firstName, applicationFormData.lastName)).toBeVisible();
        await expect(configuredApplicationFormPage.crpCandidateEmail()).toBeVisible();
        await expect(await configuredApplicationFormPage.uploadedResumeMatchesLocal('resume.pdf')).toBe(true);

        // Verify the submitted All Fields values reflect on the CRP Summary
        // tab (Details / Education / Availability sections).
        const summary = applicationFormData.expectedSummary;
        await configuredApplicationFormPage.openCrpSummaryTab();
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Degree level')).toHaveText(summary.degreeLevel);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('College majors')).toHaveText(summary.collegeMajors);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Certificates')).toHaveText(summary.certificates);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Years experience')).toHaveText(summary.yearsExperience);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Career level')).toHaveText(summary.careerLevel);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Date available')).toHaveText(summary.dateAvailable);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Desired job type')).toHaveText(summary.desiredJobType);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Current job type')).toHaveText(summary.currentJobType);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Salary requirements')).toHaveText(summary.salaryRequirements);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Security clearance')).toHaveText(summary.securityClearance);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Willing to relocate?')).toHaveText(summary.willingToRelocate);

        // Open the EEO Profile and verify the submitted EEO/OFCCP answers
        // (Male gender, White race, protected veteran, has disability).
        await configuredApplicationFormPage.openEeoProfile();
        await expect(configuredApplicationFormPage.eeoGenderMaleRadio).toBeChecked();
        await expect(configuredApplicationFormPage.eeoRaceSelect).toHaveValue('1');
        await expect(configuredApplicationFormPage.eeoVeteranIdentifyRadio).toBeChecked();
        await expect(configuredApplicationFormPage.eeoDisabilityYesRadio).toBeChecked();
        await configuredApplicationFormPage.closeEeoProfile();

        // Open the Evaluations tab and verify the submitted custom question
        // (CQE) answers landed in ATS. They render under the "Job Related
        // (Applicant or Fee Agency)" fieldset as "Answer: VALUE".
        const cqe = applicationFormData.expectedCqeAnswers;
        await configuredApplicationFormPage.openCrpEvaluationsTab();
        await expect(configuredApplicationFormPage.crpEvaluationAnswer(cqe.travelQuestion)).toHaveText(cqe.travelAnswer);
        await expect(configuredApplicationFormPage.crpEvaluationAnswer(cqe.securityClearanceQuestion)).toHaveText(cqe.securityClearanceAnswer);
        await expect(configuredApplicationFormPage.crpEvaluationAnswer(cqe.successQuestion)).toHaveText(cqe.successAnswer);
        await expect(configuredApplicationFormPage.crpEvaluationAnswer(cqe.quantityQuestion)).toHaveText(cqe.quantityAnswer);
        await expect(configuredApplicationFormPage.crpEvaluationAnswer(cqe.jobsHeldQuestion)).toHaveText(cqe.jobsHeldAnswer);
        await expect(configuredApplicationFormPage.crpEvaluationAnswer(cqe.appealsQuestion)).toHaveText(cqe.appealsAnswer);
        await expect(configuredApplicationFormPage.crpEvaluationAnswer(cqe.marketingExperienceQuestion)).toHaveText(cqe.marketingExperienceAnswer);
        await expect(configuredApplicationFormPage.crpEvaluationAnswer(cqe.marketingDegreeQuestion)).toHaveText(cqe.marketingDegreeAnswer);
        await expect(configuredApplicationFormPage.crpEvaluationAnswer(cqe.scheduleLimitationsQuestion)).toHaveText(cqe.scheduleLimitationsAnswer);
        await expect(configuredApplicationFormPage.crpEvaluationAnswer(cqe.uniqueStrengthsQuestion)).toHaveText(cqe.uniqueStrengthsAnswer);
        await expect(configuredApplicationFormPage.crpEvaluationAnswer(cqe.managerRatingQuestion)).toHaveText(cqe.managerRatingAnswer);
        await expect(configuredApplicationFormPage.crpEvaluationAnswer(cqe.managerRatingExplanationQuestion)).toHaveText(cqe.managerRatingExplanationAnswer);

        // Open the Edit Candidate popup and verify every populated contact
        // field persisted from the All Fields submission.
        const editValues = applicationFormData.expectedEditPopup;
        const editPopup = await configuredApplicationFormPage.openEditCandidatePopup();
        await expect(editPopup.locator('#fullname')).toHaveValue(editValues.fullName);
        await expect(editPopup.locator('#name_prefix')).toHaveValue(editValues.prefix);
        await expect(editPopup.locator('#firstname')).toHaveValue(editValues.firstName);
        await expect(editPopup.locator('#middlename')).toHaveValue(editValues.middleName);
        await expect(editPopup.locator('#lastname')).toHaveValue(editValues.lastName);
        await expect(editPopup.locator('#name_suffix')).toHaveValue(editValues.suffix);
        await expect(editPopup.locator('#country')).toHaveValue(editValues.country);
        await expect(editPopup.locator('#City')).toHaveValue(editValues.city);
        await expect(editPopup.locator('#AddressLine1')).toHaveValue(editValues.addressLine1);
        await expect(editPopup.locator('#AddressLine2')).toHaveValue(editValues.addressLine2);
        await expect(editPopup.locator('#state')).toHaveValue(editValues.state);
        await expect(editPopup.locator('#postalcode')).toHaveValue(editValues.postalCode);
        await expect(editPopup.locator('#primary_phone_no')).toHaveValue(editValues.primaryPhone);
        await expect(editPopup.locator('#secondary_phone_no')).toHaveValue(editValues.secondaryPhone);
        await expect(editPopup.locator('#emailaddress')).toHaveValue(configuredApplicationFormPage.submittedEmail);
        await editPopup.close();
    });

    // Open Submission variant of the All Fields configured apply — reaches
    // the same configured form via the Open Submission link (no specific
    // job) and submits the field set, then verifies the candidate,
    // name/email, and uploaded resume in ATS. Uses the Open-Submission-
    // specific submit method: unlike the job-specific [C817], the Open
    // Submission configured form in this environment does NOT expose the
    // "authorized to work" Citizenship group, the "Relocation preferences"
    // dropdown, or any custom questions (CQEs), so those are skipped (see
    // submitAllFieldsOpenSubmissionApplication). Live-verified 2026-09-14.
    // Previously also skipped due to the KNOWN ATS prefix bug (#name_prefix
    // shows the raw code '2' instead of the submitted 'Mr.'), which this
    // test's expectedEditPopup.prefix assertion checks for. Re-verified
    // 2026-09-16: no longer reproducing — this test passes end-to-end.
    test('[C818] Configured Apply - Open Submission - All the Field types', { tag: '@smoke' }, async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToOpenSubmissions();
        await configuredApplicationFormPage.submitAllFieldsOpenSubmissionApplication(applicationFormData);
        await expect(configuredApplicationFormPage.successMessage).toBeVisible();
        await configuredApplicationFormPage.loginToATS();
        const recordCount = await configuredApplicationFormPage.getTableRowCount();
        await expect(recordCount).toBe(true);

        // Open the candidate's CRP and verify name, email, and the uploaded
        // resume all landed in ATS. The CRP header renders the full name as
        // one node "{prefix} {first} {middle} {last} {suffix}" (e.g.
        // "2 CX First Middle CX Last Jr." — live-verified 2026-09-14), so
        // the exact first+last match used elsewhere won't match here; assert
        // the first+last appear as a substring of that combined heading.
        await configuredApplicationFormPage.searchCandidateAndOpenCRP();
        await expect(
            configuredApplicationFormPage.crpCandidateFullName(applicationFormData.firstName, applicationFormData.lastName)
        ).toBeVisible();
        await expect(configuredApplicationFormPage.crpCandidateEmail()).toBeVisible();
        await expect(await configuredApplicationFormPage.uploadedResumeMatchesLocal('resume.pdf')).toBe(true);

        // Verify the submitted All Fields values reflect on the CRP Summary
        // tab (Details / Education / Availability sections).
        const summary = applicationFormData.expectedSummary;
        await configuredApplicationFormPage.openCrpSummaryTab();
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Degree level')).toHaveText(summary.degreeLevel);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('College majors')).toHaveText(summary.collegeMajors);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Certificates')).toHaveText(summary.certificates);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Years experience')).toHaveText(summary.yearsExperience);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Career level')).toHaveText(summary.careerLevel);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Date available')).toHaveText(summary.dateAvailable);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Desired job type')).toHaveText(summary.desiredJobType);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Current job type')).toHaveText(summary.currentJobType);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Salary requirements')).toHaveText(summary.salaryRequirements);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Security clearance')).toHaveText(summary.securityClearance);
        await expect(configuredApplicationFormPage.crpSummaryFieldValue('Willing to relocate?')).toHaveText(summary.willingToRelocate);

        // No EEO Profile / custom-field assertions here: the Open Submission
        // configured form is single-page and has no EEO section or custom
        // questions (live-verified 2026-09-14), so nothing is submitted for
        // them to verify. See submitAllFieldsOpenSubmissionApplication.

        // Open the Edit Candidate popup and verify every populated contact
        // field persisted from the All Fields submission.
        const editValues = applicationFormData.expectedEditPopup;
        const editPopup = await configuredApplicationFormPage.openEditCandidatePopup();
        await expect(editPopup.locator('#fullname')).toHaveValue(editValues.fullName);
        await expect(editPopup.locator('#name_prefix')).toHaveValue(editValues.prefix);
        await expect(editPopup.locator('#firstname')).toHaveValue(editValues.firstName);
        await expect(editPopup.locator('#middlename')).toHaveValue(editValues.middleName);
        await expect(editPopup.locator('#lastname')).toHaveValue(editValues.lastName);
        await expect(editPopup.locator('#name_suffix')).toHaveValue(editValues.suffix);
        await expect(editPopup.locator('#country')).toHaveValue(editValues.country);
        await expect(editPopup.locator('#City')).toHaveValue(editValues.city);
        await expect(editPopup.locator('#AddressLine1')).toHaveValue(editValues.addressLine1);
        await expect(editPopup.locator('#AddressLine2')).toHaveValue(editValues.addressLine2);
        await expect(editPopup.locator('#state')).toHaveValue(editValues.state);
        await expect(editPopup.locator('#postalcode')).toHaveValue(editValues.postalCode);
        await expect(editPopup.locator('#primary_phone_no')).toHaveValue(editValues.primaryPhone);
        await expect(editPopup.locator('#secondary_phone_no')).toHaveValue(editValues.secondaryPhone);
        await expect(editPopup.locator('#emailaddress')).toHaveValue(configuredApplicationFormPage.submittedEmail);
        await editPopup.close();
    });

    // Previously skipped due to the KNOWN ATS prefix bug: the Edit Candidate
    // popup's #name_prefix shows the raw code '2' instead of the submitted
    // 'Mr.'. Re-verified 2026-09-16: no longer reproducing — this test
    // (including the expectedEditPopup.prefix assertion) passes end-to-end.
    test('[C4325] External Portal Fee Agency - Configured Apply - All the Field types', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        await feeAgencyConfiguredFormPage.submitAllFieldsConfiguredApplication(applicationFormData);
        await expect(feeAgencyConfiguredFormPage.successMessage).toBeVisible();
        await feeAgencyConfiguredFormPage.loginToATS();
        const recordCount = await feeAgencyConfiguredFormPage.getTableRowCount();
        await expect(recordCount).toBe(true);

        // Open the candidate's CRP and verify name, email, and the uploaded
        // resume all landed in ATS.
        await feeAgencyConfiguredFormPage.searchCandidateAndOpenCRP();
        await expect(feeAgencyConfiguredFormPage.crpCandidateName(applicationFormData.firstName, applicationFormData.lastName)).toBeVisible();
        await expect(feeAgencyConfiguredFormPage.crpCandidateEmail()).toBeVisible();
        await expect(await feeAgencyConfiguredFormPage.uploadedResumeMatchesLocal('resume.pdf')).toBe(true);

        // Verify the submitted All Fields values reflect on the CRP Summary
        // tab (Details / Education / Availability sections).
        const summary = applicationFormData.expectedSummary;
        await feeAgencyConfiguredFormPage.openCrpSummaryTab();
        await expect(feeAgencyConfiguredFormPage.crpSummaryFieldValue('Degree level')).toHaveText(summary.degreeLevel);
        await expect(feeAgencyConfiguredFormPage.crpSummaryFieldValue('College majors')).toHaveText(summary.collegeMajors);
        await expect(feeAgencyConfiguredFormPage.crpSummaryFieldValue('Certificates')).toHaveText(summary.certificates);
        await expect(feeAgencyConfiguredFormPage.crpSummaryFieldValue('Years experience')).toHaveText(summary.yearsExperience);
        await expect(feeAgencyConfiguredFormPage.crpSummaryFieldValue('Career level')).toHaveText(summary.careerLevel);
        await expect(feeAgencyConfiguredFormPage.crpSummaryFieldValue('Date available')).toHaveText(summary.dateAvailable);
        await expect(feeAgencyConfiguredFormPage.crpSummaryFieldValue('Desired job type')).toHaveText(summary.desiredJobType);
        await expect(feeAgencyConfiguredFormPage.crpSummaryFieldValue('Current job type')).toHaveText(summary.currentJobType);
        await expect(feeAgencyConfiguredFormPage.crpSummaryFieldValue('Salary requirements')).toHaveText(summary.salaryRequirements);
        await expect(feeAgencyConfiguredFormPage.crpSummaryFieldValue('Security clearance')).toHaveText(summary.securityClearance);
        await expect(feeAgencyConfiguredFormPage.crpSummaryFieldValue('Willing to relocate?')).toHaveText(summary.willingToRelocate);

        // Open the EEO Profile and verify the submitted EEO/OFCCP answers.
        await feeAgencyConfiguredFormPage.openEeoProfile();
        await expect(feeAgencyConfiguredFormPage.eeoGenderMaleRadio).toBeChecked();
        await expect(feeAgencyConfiguredFormPage.eeoRaceSelect).toHaveValue('1');
        await expect(feeAgencyConfiguredFormPage.eeoVeteranIdentifyRadio).toBeChecked();
        await expect(feeAgencyConfiguredFormPage.eeoDisabilityYesRadio).toBeChecked();
        await feeAgencyConfiguredFormPage.closeEeoProfile();

        // Open the Edit Candidate popup and verify every populated contact
        // field persisted from the All Fields submission.
        const editValues = applicationFormData.expectedEditPopup;
        const editPopup = await feeAgencyConfiguredFormPage.openEditCandidatePopup();
        await expect(editPopup.locator('#fullname')).toHaveValue(editValues.fullName);
        await expect(editPopup.locator('#name_prefix')).toHaveValue(editValues.prefix);
        await expect(editPopup.locator('#firstname')).toHaveValue(editValues.firstName);
        await expect(editPopup.locator('#middlename')).toHaveValue(editValues.middleName);
        await expect(editPopup.locator('#lastname')).toHaveValue(editValues.lastName);
        await expect(editPopup.locator('#name_suffix')).toHaveValue(editValues.suffix);
        await expect(editPopup.locator('#country')).toHaveValue(editValues.country);
        await expect(editPopup.locator('#City')).toHaveValue(editValues.city);
        await expect(editPopup.locator('#AddressLine1')).toHaveValue(editValues.addressLine1);
        await expect(editPopup.locator('#AddressLine2')).toHaveValue(editValues.addressLine2);
        await expect(editPopup.locator('#state')).toHaveValue(editValues.state);
        await expect(editPopup.locator('#postalcode')).toHaveValue(editValues.postalCode);
        await expect(editPopup.locator('#primary_phone_no')).toHaveValue(editValues.primaryPhone);
        await expect(editPopup.locator('#secondary_phone_no')).toHaveValue(editValues.secondaryPhone);
        await expect(editPopup.locator('#emailaddress')).toHaveValue(feeAgencyConfiguredFormPage.submittedEmail);
        await editPopup.close();
    });
});
test.describe('Configured Application - Internal Portal - Resume Formats', () => {
    test('[C5552] Configured Apply - Internal Portal - Resume File Format', async ({ internalConfiguredApplicationFormPage, applicationFormData }) => {
        await internalConfiguredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.internalJobTitle);
        await internalConfiguredApplicationFormPage.submitInternalConfiguredApplication(applicationFormData);
        await expect(internalConfiguredApplicationFormPage.successMessage).toBeVisible();
        await internalConfiguredApplicationFormPage.loginToATS();
        await internalConfiguredApplicationFormPage.searchAppliedCandidate();
        await internalConfiguredApplicationFormPage.page.locator('i.fas.fa-file-alt.btn-quick-view').first().click();
        await expect(internalConfiguredApplicationFormPage.page.locator('#pdfModalLabel')).toBeVisible();
        // This site renders the preview via PDFObject.js, which picks the
        // embedding element per-browser: Chromium/Firefox get
        // <embed class="pdfobject">, WebKit gets <iframe class="pdfobject">
        // instead (live-verified 2026-09-25 — same content, same
        // fileDownload URL, different tag). '#pdf-container embed' alone
        // resolved to nothing on WebKit and was previously skipped there;
        // '.pdfobject' matches whichever element renders on any browser.
        const pdfEmbed = internalConfiguredApplicationFormPage.page.locator('#pdf-container .pdfobject');
        await expect(pdfEmbed).toBeVisible();
        const src = await pdfEmbed.getAttribute('src');
        expect(src).toContain('fileDownload');
    });

    // [5543] Configured Apply - Internal Portal - Resume Text Conversion
    // Live-verified (2026-08-25) with sample resume files added for all 8
    // TestRail-required formats (doc, docx, htm, html, odt, pdf, rtf,
    // txt). Per-format text-content parity on the ATS Resume/CV tab isn't
    // automated (no page object reads that tab's rendered text yet, only
    // [C5552]'s PDF-preview-modal check, which is PDF-specific); this
    // asserts successful submission + ATS record presence for every
    // format instead.
    test('[C5543] Configured Apply - Internal Portal - Resume Text Conversion', async ({ internalConfiguredApplicationFormPage, applicationFormData }) => {
        // 8 full form submissions plus an ATS login/search comfortably
        // exceed the default 60s test timeout.
        test.setTimeout(120000);
        const listingUrl = internalConfiguredApplicationFormPage.page.url();
        const submittedEmails = [];
        for (const filename of applicationFormData.resumeFormats) {
            await internalConfiguredApplicationFormPage.page.goto(listingUrl);
            await internalConfiguredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.internalJobTitle);
            await internalConfiguredApplicationFormPage.submitInternalConfiguredApplicationWithResume(applicationFormData, filename);
            await expect(internalConfiguredApplicationFormPage.successMessage).toBeVisible();
            submittedEmails.push(internalConfiguredApplicationFormPage.submittedEmail);
        }
        await internalConfiguredApplicationFormPage.loginToATS();
        for (const email of submittedEmails) {
            const candidateExists = await internalConfiguredApplicationFormPage.candidateExistsForEmail(email);
            await expect(candidateExists).toBe(true);
        }
    });
});

test.describe('Configured Application - External Portal - Resume Formats', () => {
    // [5544] Configured Apply - External Portal - Resume Text Conversion
    // Live-verified (2026-08-25) with sample resume files added for all 8
    // TestRail-required formats (doc, docx, htm, html, odt, pdf, rtf,
    // txt). Per-format text-content parity on the ATS Resume/CV tab isn't
    // automated (no page object reads that tab's content yet); this
    // asserts successful submission + ATS record presence for every
    // format instead.
    test('[C5544] Configured Apply - External Portal - Resume Text Conversion', async ({ configuredApplicationFormPage, applicationFormData }) => {
        // 8 full form submissions plus an ATS login/search comfortably
        // exceed the default 60s test timeout.
        test.setTimeout(120000);
        const listingUrl = configuredApplicationFormPage.page.url();
        const submittedEmails = [];
        for (const filename of applicationFormData.resumeFormats) {
            await configuredApplicationFormPage.page.goto(listingUrl);
            await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
            await configuredApplicationFormPage.submitConfiguredApplicationWithResume(applicationFormData, filename);
            await expect(configuredApplicationFormPage.successMessage).toBeVisible();
            submittedEmails.push(configuredApplicationFormPage.submittedEmail);
        }
        await configuredApplicationFormPage.loginToATS();
        for (const email of submittedEmails) {
            const candidateExists = await configuredApplicationFormPage.candidateExistsForEmail(email);
            await expect(candidateExists).toBe(true);
        }
    });

    // [5551] Configured Apply - External Portal - Resume File Format
    // Same file-availability unblock as [5544] above. Uploads each of the
    // 8 valid formats one by one, confirms the application finishes
    // successfully for each, then confirms every one of the 8 landed in
    // ATS (not just the last submission).
    test('[C5551] Configured Apply - External Portal - Resume File Format', async ({ configuredApplicationFormPage, applicationFormData }) => {
        // 8 full form submissions plus an ATS login/search comfortably
        // exceed the default 60s test timeout.
        test.setTimeout(120000);
        const listingUrl = configuredApplicationFormPage.page.url();
        const submittedEmails = [];
        for (const filename of applicationFormData.resumeFormats) {
            await configuredApplicationFormPage.page.goto(listingUrl);
            await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
            await configuredApplicationFormPage.submitConfiguredApplicationWithResume(applicationFormData, filename);
            await expect(configuredApplicationFormPage.successMessage).toBeVisible();
            submittedEmails.push(configuredApplicationFormPage.submittedEmail);
        }
        await configuredApplicationFormPage.loginToATS();
        for (const email of submittedEmails) {
            const candidateExists = await configuredApplicationFormPage.candidateExistsForEmail(email);
            await expect(candidateExists).toBe(true);
        }
    });
});

test.describe('Configured Application - External Portal - Open Submission - Resume Formats', () => {
    // [C5588] Configured Apply - Open Submission - Resume Text Conversion
    // Live-verified (2026-08-25) with sample resume files added for all 8
    // TestRail-required formats (doc, docx, htm, html, odt, pdf, rtf,
    // txt). Reuses the same multi-page Configured Apply flow already
    // proven reliable for Open Submission by [C834]/[C930]/[C937]/[C938]
    // in application-form.spec.js (via navigateToOpenSubmissions()), just
    // parameterized by resume filename. Per-format text-content parity on
    // the ATS Resume/CV tab isn't automated (no page object reads that
    // tab's content yet); asserts successful submission + ATS record
    // presence for every format instead.
    test('[C5588] Configured Apply - Open Submission - Resume Text Conversion', async ({ configuredApplicationFormPage, applicationFormData }) => {
        // 8 full form submissions plus an ATS login/search comfortably
        // exceed the default 60s test timeout.
        test.setTimeout(120000);
        const listingUrl = configuredApplicationFormPage.page.url();
        const submittedEmails = [];
        for (const filename of applicationFormData.resumeFormats) {
            await configuredApplicationFormPage.page.goto(listingUrl);
            await configuredApplicationFormPage.navigateToOpenSubmissions();
            await configuredApplicationFormPage.submitConfiguredApplicationWithResume(applicationFormData, filename);
            await expect(configuredApplicationFormPage.successMessage).toBeVisible();
            submittedEmails.push(configuredApplicationFormPage.submittedEmail);
        }
        await configuredApplicationFormPage.loginToATS();
        for (const email of submittedEmails) {
            const candidateExists = await configuredApplicationFormPage.candidateExistsForEmail(email);
            await expect(candidateExists).toBe(true);
        }
    });
});

// [C712]/[C713]/[C719]-[C721] Open Submission - Source/HDYHAU. Live-verified
// (2026-08-27) against this environment's two External Portal Open
// Submission forms (CorporateCareerPortal = Quick Apply,
// CorporateCareerPortal2 = Configured Apply):
//
// - Quick Apply Open Submission has no "How did you hear about us?" field
//   at all — its Source always defaults to "SilkRoad Candidate Experience"
//   when reached via the portal's "Submit Your Resume/CV" link [C712], and
//   is driven entirely by a ?source= query param when the apply page is
//   hit directly [C713].
// - Configured Apply Open Submission's "How did you hear about us?" field
//   (#OriginalSource) is present but NOT required on this portal (no
//   `required` attribute; submitting without selecting it isn't blocked).
//   That's the "Not Required" scenario TestRail describes for [C719]/
//   [C720]/[C721]/[C722]/[C724] — there's no portal in this environment
//   where the field is Required, so [C715]-[C718]/[C723] (the Required
//   variants) aren't covered here; they'd need to be force-fit onto this
//   portal's actual (Not Required) configuration to pass, which wouldn't
//   be testing what TestRail describes. [C723] specifically (Required,
//   Employee Referral) is blocked for this same reason — not added as a
//   fixme stub here since it needs no more than the existing [C715]-
//   [C718]/[C723] documentation on the unfinished-consolidated branch.
//
// Not serial: getRecordedSourceForSubmittedCandidate() searches the ATS
// Candidate Pool by email and reads back the first result row, which used
// to race against concurrent searches from other tests under the same
// logged-in ATS session. playwright-cx.config.js's workers: 1 removes
// that concurrency at its source, so these don't need to be serial with
// each other (or with anything else in this file) any more — see this
// file's header comment.
test.describe('Open Submission - Source/HDYHAU', () => {
    test('[C712] Open Submission Quick Apply (SilkRoad Candidate Experience)', { tag: '@smoke' }, async ({ applicationFormPage, applicationFormData }) => {
        await applicationFormPage.navigateToOpenSubmissions();
        await applicationFormPage.submitApplication(applicationFormData);
        await expect(applicationFormPage.successMessage).toBeVisible();
        await applicationFormPage.loginToATS();
        const source = await applicationFormPage.getRecordedSourceForSubmittedCandidate();
        await expect(source).toBe('SilkRoad Candidate Experience');
    });

    test('[C713] Open Submission Quick Apply (Variable)', async ({ applicationFormPage, applicationFormData }) => {
        await applicationFormPage.goToOpenSubmissionWithSource('opensubmissionquickapplysource');
        await applicationFormPage.submitApplication(applicationFormData);
        await expect(applicationFormPage.successMessage).toBeVisible();
        await applicationFormPage.loginToATS();
        const source = await applicationFormPage.getRecordedSourceForSubmittedCandidate();
        await expect(source).toBe('opensubmissionquickapplysource');
    });

    test('[C719] Open Submission Configured Apply with "How did you hear about us?" Not Required (SilkRoad Candidate Experience)', { tag: '@smoke' }, async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToOpenSubmissions();
        await expect(configuredApplicationFormPage.originalSourceeCAField).toBeVisible();
        await configuredApplicationFormPage.submitConfiguredOpenSubmission(applicationFormData, false);
        await expect(configuredApplicationFormPage.successMessage).toBeVisible();
        await configuredApplicationFormPage.loginToATS();
        const source = await configuredApplicationFormPage.getRecordedSourceForSubmittedCandidate();
        await expect(source).toBe('SilkRoad Candidate Experience');
    });

    test('[C720] Open Submission Configured Apply with "How did you hear about us?" Not Required (How did you hear about us?)', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToOpenSubmissions();
        await configuredApplicationFormPage.submitConfiguredOpenSubmission(applicationFormData, true);
        await expect(configuredApplicationFormPage.successMessage).toBeVisible();
        await configuredApplicationFormPage.loginToATS();
        const source = await configuredApplicationFormPage.getRecordedSourceForSubmittedCandidate();
        await expect(source).toBe(applicationFormData.howDidYouHearAboutUs);
    });

    test('[C721] Open Submission Configured Apply with "How did you hear about us?" Not Required (Online)', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.goToOpenSubmissionWithSource('online', true);
        await expect(configuredApplicationFormPage.originalSourceeCAField).toBeVisible();
        await configuredApplicationFormPage.submitConfiguredOpenSubmission(applicationFormData, false);
        await expect(configuredApplicationFormPage.successMessage).toBeVisible();
        await configuredApplicationFormPage.loginToATS();
        const source = await configuredApplicationFormPage.getRecordedSourceForSubmittedCandidate();
        await expect(source).toBe('SilkRoad Candidate Experience');
    });

    // [C722] Not Required (Variable) — unlike [C721]'s "online" (a magic
    // value that falls back to the default source), an arbitrary source
    // string passed through untouched: field hidden, Source = the exact
    // value from the URL.
    test('[C722] Open Submission Configured Apply with "How did you hear about us?" Not Required (Variable)', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.goToOpenSubmissionWithSource('opensubmissionconfiguredapplysource', true);
        await expect(configuredApplicationFormPage.originalSourceeCAField).not.toBeVisible();
        await configuredApplicationFormPage.submitConfiguredOpenSubmission(applicationFormData, false);
        await expect(configuredApplicationFormPage.successMessage).toBeVisible();
        await configuredApplicationFormPage.loginToATS();
        const source = await configuredApplicationFormPage.getRecordedSourceForSubmittedCandidate();
        await expect(source).toBe('opensubmissionconfiguredapplysource');
    });

    // [C724] Not Required (Employee Referral) — selecting "Employee
    // Referral" reveals Referrer's First/Last Name (required,
    // live-verified 2026-08-31 via client-side validation errors) and
    // Referrer's Email Address (not required). Live-verified: the ATS
    // records the recruited candidate's Source as the referrer's full
    // name ("<referrerFirstName> <referrerLastName>"), not the literal
    // string "Employee Referral" — TestRail's "Verify Source is the
    // Employee Referral" step means whoever was named as the referrer.
    test('[C724] Open Submission Configured Apply with "How did you hear about us?" Not Required (Employee Referral)', { tag: '@smoke' }, async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToOpenSubmissions();
        await expect(configuredApplicationFormPage.originalSourceeCAField).toBeVisible();
        await configuredApplicationFormPage.originalSourceeCAField.selectOption({ label: 'Employee Referral' });
        await expect(configuredApplicationFormPage.referrerFirstNameField).toBeVisible();
        await expect(configuredApplicationFormPage.referrerLastNameField).toBeVisible();
        await expect(configuredApplicationFormPage.referrerEmailField).toBeVisible();

        await configuredApplicationFormPage.applicationFormNextButton.click();
        await expect(configuredApplicationFormPage.referrerFirstNameErrorLocator).toBeVisible();
        await expect(configuredApplicationFormPage.referrerLastNameErrorLocator).toBeVisible();

        await configuredApplicationFormPage.submitConfiguredApplicationAsEmployeeReferral(applicationFormData);
        await expect(configuredApplicationFormPage.successMessage).toBeVisible();
        await configuredApplicationFormPage.loginToATS();
        const source = await configuredApplicationFormPage.getRecordedSourceForSubmittedCandidate();
        await expect(source).toBe(`${applicationFormData.referrerFirstName} ${applicationFormData.referrerLastName}`);
    });
});

// [C725]/[C726] Quick Apply - Source/HDYHAU (the regular job-apply flow,
// not Open Submission — same Source defaulting/override mechanism as
// [C712]/[C713] above, applied to navigateToJobApplicationForm() instead
// of navigateToOpenSubmissions()). Not serial, for the same reason as the
// block above — playwright-cx.config.js's workers: 1 removes the
// concurrent-search race at its source.
test.describe('Quick Apply - Source/HDYHAU', () => {
    test('[C725] Quick Apply (SilkRoad Candidate Experience)', { tag: '@smoke' }, async ({ applicationFormPage, applicationFormData }) => {
        await applicationFormPage.navigateToJobApplicationForm(applicationFormData.jobTitle);
        await applicationFormPage.submitApplication(applicationFormData);
        await expect(applicationFormPage.successMessage).toBeVisible();
        await applicationFormPage.loginToATS();
        const source = await applicationFormPage.getRecordedSourceForSubmittedCandidate();
        await expect(source).toBe('SilkRoad Candidate Experience');
    });

    test('[C726] Quick Apply (Variable)', async ({ applicationFormPage, applicationFormData }) => {
        await applicationFormPage.goToJobApplicationFormWithSource(applicationFormData.jobTitle, 'quickapplysource');
        await applicationFormPage.submitApplication(applicationFormData);
        await expect(applicationFormPage.successMessage).toBeVisible();
        await applicationFormPage.loginToATS();
        const source = await applicationFormPage.getRecordedSourceForSubmittedCandidate();
        await expect(source).toBe('quickapplysource');
    });
});

// [TC-15749]/[TC-15756] Configured Apply - Source/HDYHAU (the regular job-apply flow
// on CorporateCareerPortal2, not Open Submission). TestRail describes the
// "How did you hear about us?" field as Required, but live-verified
// (2026-10-01) that on this portal's job form #OriginalSource has no
// `required`/data-val-required attribute and the form advances to page 2
// with it left empty — same as the Open Submission form [C719]-[C724]
// covers. The "field is required" step is therefore intentionally not
// asserted here; everything after it (Employee Referral's conditional
// fields, their validation, and the ATS Source) is.
test.describe('Configured Apply - Source/HDYHAU', () => {
    // "online" is a magic source value: like [C721] on Open Submission, it
    // doesn't hide the HDYHAU field, and the Source recorded in the ATS is
    // whatever the candidate selected there rather than "online".
    test('[TC-15749] Configured Apply with "How did you hear about us?" Required (Online)', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.goToJobConfiguredApplicationFormWithSource(applicationFormData.jobTitle, 'online');
        await expect(configuredApplicationFormPage.originalSourceeCAField).toBeVisible();
        await configuredApplicationFormPage.submitConfiguredApplication(applicationFormData);
        await expect(configuredApplicationFormPage.successMessage).toBeVisible();
        await configuredApplicationFormPage.loginToATS();
        const source = await configuredApplicationFormPage.getRecordedSourceForSubmittedCandidate();
        await expect(source).toBe(applicationFormData.howDidYouHearAboutUs);
    });

    // Same Source semantics as [C724]: the ATS records the referrer's full
    // name, not the literal "Employee Referral".
    test('[TC-15756] Configured Apply with "How did you hear about us?" Required (Employee Referral)', { tag: '@smoke' }, async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        await expect(configuredApplicationFormPage.originalSourceeCAField).toBeVisible();
        await configuredApplicationFormPage.originalSourceeCAField.selectOption({ label: 'Employee Referral' });
        await expect(configuredApplicationFormPage.referrerFirstNameField).toBeVisible();
        await expect(configuredApplicationFormPage.referrerLastNameField).toBeVisible();
        await expect(configuredApplicationFormPage.referrerEmailField).toBeVisible();

        await configuredApplicationFormPage.applicationFormNextButton.click();
        await expect(configuredApplicationFormPage.referrerFirstNameErrorLocator).toBeVisible();
        await expect(configuredApplicationFormPage.referrerLastNameErrorLocator).toBeVisible();

        await configuredApplicationFormPage.submitConfiguredApplicationAsEmployeeReferral(applicationFormData);
        await expect(configuredApplicationFormPage.successMessage).toBeVisible();
        await configuredApplicationFormPage.loginToATS();
        const source = await configuredApplicationFormPage.getRecordedSourceForSubmittedCandidate();
        await expect(source).toBe(`${applicationFormData.referrerFirstName} ${applicationFormData.referrerLastName}`);
    });
});
});
