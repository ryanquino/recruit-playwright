// @ts-check
const { test, expect } = require('../fixtures/application-fixture');

// This file used to wrap every describe block below (plus the ATS-session
// tests now in application-form-ats-verification.spec.js) in one outer
// test.describe.serial('Application Form Suite') block, purely to force
// everything onto a single CI worker and avoid a race on the shared ATS
// account's Candidate Pool search results (two *different* serial blocks
// running concurrently in separate workers could intermittently read back
// each other's search results — live-verified 2026-09-03). That meant one
// failing test anywhere in the file cascade-skipped every test after it —
// 28+ "did not run" from a single failure.
//
// None of the tests below actually touch that shared ATS search state —
// they submit a form and assert on the form/page itself, no loginToATS()
// + Candidate Pool read-back. The tests that do that have been moved to
// application-form-ats-verification.spec.js. That race is now prevented at
// the source by playwright-cx.config.js's workers: 1 on CI, so nothing in
// either file needs to be serial purely to dodge concurrency any more —
// everything here runs as plain, independent test.describe() blocks, and a
// failure in one no longer skips the others.
//
// The 'Fee Agency - Configured Application' block at the bottom was also
// de-serialized for the same reason: live-verified (run 34125520012,
// 2026-09-07) that a single [C4313] failure cascade-skipped 9 sibling
// tests, and its retry cascaded another 10 when [C4312] failed — no test
// in that block actually depends on a sibling's output (each logs in and
// navigates to its own job independently), so nothing is lost by freeing
// them from serial now that workers: 1 removes the only reason they were
// grouped that way.

// [C834] Configured Apply - Open Submission - Multiple Pages - Page Titles
// Live-verified (2026-08-25): the External Portal's Open Submission entry
// ("Submit Your Resume/CV") uses the same Configured Apply multi-page
// form as the regular job-apply flow covered by [C815] — page 1 shows
// "First Page" and, after filling required fields and clicking Next,
// page 2 shows "Second Page". Reuses fillFirstPageAndClickNext() and
// configuredFormPageTitle from ApplicationFormPage.
test.describe('Configured Application - External Portal - Open Submission', () => {
    test('[C834] Configured Apply - Open Submission - Multiple Pages - Page Titles', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToOpenSubmissions();
        await expect(configuredApplicationFormPage.configuredFormPageTitle).toHaveText('First Page');
        await configuredApplicationFormPage.fillFirstPageAndClickNext(applicationFormData);
        await expect(configuredApplicationFormPage.configuredFormPageTitle).toHaveText('Second Page');
    });
});

// [C885] Quick Apply - Open Submission - Default Portal Language
// Originally (2026-08-25) this asserted that with the browser context
// locale set to fr-FR, the External Portal's Open Submission Quick
// Apply form still rendered English labels — Quick Apply falling back
// to the default (English) portal language since no other language was
// enabled on the portal.
// Re-verified (2026-09-03): French is now deliberately enabled on this
// same portal as a precondition for [C805]/[C836]-[C838] (see
// application-form-localization.spec.js's file header), so a matching
// fr-FR browser locale now genuinely renders the French labels instead.
// Updated to reflect that reality — this now exercises the same
// locale-based rendering as [C805], reusing its label data as the
// source of truth instead of duplicating translated strings.
test.describe('Quick Apply - Open Submission - Default Portal Language', () => {
    test.use({ locale: 'fr-FR' });

    test('[C885] Quick Apply - Open Submission - Default Portal Language', async ({ applicationFormPage, applicationFormLocalizationData }) => {
        const { quickApply } = applicationFormLocalizationData.expectedLabels.fr;
        await applicationFormPage.navigateToOpenSubmissions();
        await expect(applicationFormPage.firstNameLabel).toHaveText(quickApply.firstName);
        await expect(applicationFormPage.lastNameLabel).toHaveText(quickApply.lastName);
        await expect(applicationFormPage.emailLabel).toHaveText(quickApply.email);
    });
});

// [C19] [C13] Quick Apply - Max File Size (Internal & External portals)
// Live-verified (2026-08-25) against this environment's Quick Apply form:
// uploading CX/test-data/files/oversized-resume.pdf to '#Apply_ApplyToJob_File'
// on both the Internal Career Site ("Playwright Internal Job Posting") and
// the External Career Site ("Playwright CX Test Quick Apply") surfaces a
// visible '#Apply_ApplyToJob_File-error' element with the exact text
// "Your Resume/CV is too large. Please upload a file smaller than 10 MB."
// Negative/validation-only — the oversized file is rejected client-side
// before submission, so no candidate record is created.
test.describe('Quick Apply - Max File Size', () => {
    test('[C19] Quick Apply - Random Job - Internal - Max File Size', async ({ internalApplicationFormPage, applicationFormData }) => {
        await internalApplicationFormPage.navigateToJobApplicationForm(applicationFormData.internalJobTitle);
        await internalApplicationFormPage.uploadCV(applicationFormData.oversizedResumeFile);
        await expect(internalApplicationFormPage.quickApplyResumeErrorLocator).toBeVisible();
        await expect(internalApplicationFormPage.quickApplyResumeErrorLocator).toContainText(applicationFormData.maxFileSizeErrorText);
    });

    test('[C13] Quick Apply - Random Job - External - Max File Size', async ({ applicationFormPage, applicationFormData }) => {
        await applicationFormPage.navigateToJobApplicationForm(applicationFormData.jobTitle);
        await applicationFormPage.uploadCV(applicationFormData.oversizedResumeFile);
        await expect(applicationFormPage.quickApplyResumeErrorLocator).toBeVisible();
        await expect(applicationFormPage.quickApplyResumeErrorLocator).toContainText(applicationFormData.maxFileSizeErrorText);
    });

    // [C798] Quick Apply - Open Submission - Max File Size
    // Live-verified (2026-08-25): the External Portal's Open Submission
    // Quick Apply form ("Submit Your Resume/CV" link) uses the same
    // '#Apply_ApplyToJob_File' field and surfaces the same
    // '#Apply_ApplyToJob_File-error' with identical copy as the regular
    // Quick Apply form used by [C13].
    test('[C798] Quick Apply - Open Submission - Max File Size', async ({ applicationFormPage, applicationFormData }) => {
        await applicationFormPage.navigateToOpenSubmissions();
        await applicationFormPage.uploadCV(applicationFormData.oversizedResumeFile);
        await expect(applicationFormPage.quickApplyResumeErrorLocator).toBeVisible();
        await expect(applicationFormPage.quickApplyResumeErrorLocator).toContainText(applicationFormData.maxFileSizeErrorText);
    });
});

test.describe('Configured Application - Internal Portal - Extended', () => {
    test('[C919] Configured Apply - Internal Portal - Negative (Incomplete Form)', async ({ internalConfiguredApplicationFormPage, applicationFormData }) => {
        await internalConfiguredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.internalJobTitle);
        await internalConfiguredApplicationFormPage.submitIncompleteInternalConfiguredForm();
        const errorMessages = internalConfiguredApplicationFormPage.getConfiguredFormErrorMessages();
        for (const locator of errorMessages) {
            await expect(locator).toBeVisible();
        }
    });

    test('[C942] Configured Apply - Internal Portal - Negative (Attachment Type)', async ({ internalConfiguredApplicationFormPage, applicationFormData }) => {
        await internalConfiguredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.internalJobTitle);
        await internalConfiguredApplicationFormPage.submitInternalConfiguredApplicationWithFile(applicationFormData, 'invalidfiletype.xml');
        await expect(internalConfiguredApplicationFormPage.resumeTextErrorLocator).toBeVisible();
    });

    test('[C5602] Configured Apply - Internal Portal - Attachments Invalid File Formats', async ({ internalConfiguredApplicationFormPage, applicationFormData }) => {
        await internalConfiguredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.internalJobTitle);
        await internalConfiguredApplicationFormPage.submitInternalConfiguredApplicationWithFile(applicationFormData, 'invalidfiletype.xml');
        await expect(internalConfiguredApplicationFormPage.resumeTextErrorLocator).toBeVisible();
    });

    test('[C918] Configured Apply - Internal Portal - Remote Job (WW)', async ({ internalConfiguredApplicationFormPage, applicationFormData }) => {
        const { locationSearchWorldwide } = applicationFormData;
        await internalConfiguredApplicationFormPage.locationSearch(locationSearchWorldwide.location, locationSearchWorldwide.dataValue);
        await expect(internalConfiguredApplicationFormPage.jobDetailLocationText).toHaveText(locationSearchWorldwide.jobDetailLocation);
    });

    test('[C920] Configured Apply - Internal Portal - Remote Job (State)', async ({ internalConfiguredApplicationFormPage, applicationFormData }) => {
        const { locationSearch } = applicationFormData;
        await internalConfiguredApplicationFormPage.locationSearch(locationSearch.location, locationSearch.dataValue);
        await expect(internalConfiguredApplicationFormPage.jobDetailLocationText).toHaveText(locationSearch.jobDetailLocation);
    });
});

test.describe('Configured Application - External Portal', () => {
    test('[C814] Configured Apply - External Portal - Incomplete Form', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        await configuredApplicationFormPage.submitIncompleteConfiguredForm();
        const errorMessages = configuredApplicationFormPage.getConfiguredFormErrorMessages();
        for (const locator of errorMessages) {
            await expect(locator).toBeVisible();
        }
    });

    test('[C815] Configured Apply - External Portal - Multiple Pages', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        await expect(configuredApplicationFormPage.configuredFormPageTitle).toHaveText('First Page');
        await configuredApplicationFormPage.fillFirstPageAndClickNext(applicationFormData);
        await expect(configuredApplicationFormPage.configuredFormPageTitle).toHaveText('Second Page');
    });

    test('[C816] Configured Apply - External Portal - CQEs (Yes/No)', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        const { cqeQuestions } = applicationFormData;
        await expect(configuredApplicationFormPage.page.locator('#cqe_530_label')).toHaveText(cqeQuestions.travelQuestion);
        await expect(configuredApplicationFormPage.cqeTravelQuestion).toBeVisible();
        await expect(configuredApplicationFormPage.page.locator('#cqe_531_label')).toHaveText(cqeQuestions.securityClearanceQuestion);
        await expect(configuredApplicationFormPage.cqeSecurityClearanceQuestion).toBeVisible();
    });

    test('[C819] Configured Apply - External Portal - CQEs (Multiple Choice)', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        const { cqeQuestions } = applicationFormData;
        await expect(configuredApplicationFormPage.page.locator('#cqe_542_label')).toHaveText(cqeQuestions.marketingExperienceQuestion);
        await expect(configuredApplicationFormPage.cqeMarketingExperienceQuestion).toBeVisible();
    });

    test('[C820] Configured Apply - External Portal - CQEs (Free Text)', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        const { cqeQuestions } = applicationFormData;
        await expect(configuredApplicationFormPage.page.locator('#cqe_532_label')).toHaveText(cqeQuestions.successQuestion);
        await expect(configuredApplicationFormPage.cqeSuccessQuestion).toBeVisible();
        await expect(configuredApplicationFormPage.page.locator('#cqe_533_label')).toHaveText(cqeQuestions.quantityQuestion);
        await expect(configuredApplicationFormPage.cqeQuantityQuestion).toBeVisible();
    });

    test('[C825] Configured Apply - External Portal - Remote Job (WW)', async ({ configuredApplicationFormPage, applicationFormData }) => {
        const { locationSearchWorldwide } = applicationFormData;
        await configuredApplicationFormPage.locationSearch(locationSearchWorldwide.location, locationSearchWorldwide.dataValue);
        await expect(configuredApplicationFormPage.jobDetailLocationText).toHaveText(locationSearchWorldwide.jobDetailLocation);
    });

    test('[C826] Configured Apply - External Portal - Remote Job (City)', async ({ configuredApplicationFormPage, applicationFormData }) => {
        const { locationSearchCity } = applicationFormData;
        await configuredApplicationFormPage.locationSearch(locationSearchCity.location, locationSearchCity.dataValue);
        // toContainText, not toHaveText: this US-scoped "Remote" option
        // renders as "Remote, United States" on the job detail page (same
        // as the State-level "US|US-REM" option) — the app doesn't
        // distinguish city vs. state for remote jobs, only worldwide vs.
        // US-scoped. Asserting the "Remote" substring keeps this test
        // focused on what it's actually verifying (a US-scoped remote
        // option, not the worldwide one) without hard-coding the exact
        // trailing country text.
        await expect(configuredApplicationFormPage.jobDetailLocationText).toContainText(locationSearchCity.jobDetailLocation);
    });

    test('[C827] Configured Apply - External Portal - Remote Job (State)', async ({ configuredApplicationFormPage, applicationFormData }) => {
        const { locationSearch } = applicationFormData;
        await configuredApplicationFormPage.locationSearch(locationSearch.location, locationSearch.dataValue);
        // toContainText on just "REMOTE", not an exact full string: this
        // search on the External Portal (CorporateCareerPortal2) resolves
        // to a job on that portal's Configured Job Details template, whose
        // displayed state/country formatting follows portalId 2582's own
        // "Job Location" Format admin setting — a shared setting this test
        // doesn't control, and which has been observed to change
        // independently of this suite (e.g. "REMOTE, US" vs. "REMOTE,
        // United States" depending on whether that setting uses country
        // codes or full names). Asserting the "REMOTE" keyword keeps this
        // test focused on what it actually verifies — a state-level (not
        // worldwide) remote job — without depending on that setting's
        // current value.
        await expect(configuredApplicationFormPage.jobDetailLocationText).toContainText('REMOTE');
    });

    test('[C822] Configured Apply - External Portal - Attachments Max File Size', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        await configuredApplicationFormPage.configuredFormUploadAttachment(applicationFormData.oversizedResumeFile);
        await expect(configuredApplicationFormPage.attachment1ErrorLocator).toBeVisible();
        await expect(configuredApplicationFormPage.attachment1ErrorLocator).toContainText(applicationFormData.maxAttachmentSizeErrorText);
    });

    test('[C5603] Configured Apply - External Portal - Attachments Invalid File Format', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        await configuredApplicationFormPage.uploadInvalidAttachments();

        for (let i = 1; i <= 4; i++) {
            await expect(configuredApplicationFormPage.page.locator(`#Attachment_${i}-error`)).toBeVisible();
            await expect(configuredApplicationFormPage.page.locator(`#Attachment_${i}-error`)).toContainText('The file type for Attachment');
        }
    });

    test('[C823] Configured Apply - External Portal - Attachments Valid File Format', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        await configuredApplicationFormPage.uploadValidAttachments();

        for (let i = 1; i <= 4; i++) {
            await expect(configuredApplicationFormPage.page.locator(`#Attachment_${i}-error`)).not.toBeVisible();
        }
    });

    test('[C830] Configured Apply - External Portal - Custom Fields - Resume Profile', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        const { customFields } = applicationFormData;

        // Fill required fields on the first page and navigate to the second page
        await configuredApplicationFormPage.fillFirstPageAndClickNext(applicationFormData);

        // Verify custom field labels are visible
        await expect(configuredApplicationFormPage.customFieldTextLabel).toHaveText(customFields.textFieldLabel);
        await expect(configuredApplicationFormPage.customFieldDropdownLabel).toHaveText(customFields.dropdownFieldLabel);
        await expect(configuredApplicationFormPage.customFieldMultiselectLabel).toHaveText(customFields.multiselectFieldLabel);
        await expect(configuredApplicationFormPage.customFieldTextareaLabel).toHaveText(customFields.textareaFieldLabel);

        // Verify custom field inputs are visible
        await expect(configuredApplicationFormPage.customFieldText).toBeVisible();
        await expect(configuredApplicationFormPage.customFieldDropdown).toBeVisible();
        await expect(configuredApplicationFormPage.customFieldMultiselect).toBeVisible();
        await expect(configuredApplicationFormPage.customFieldTextarea).toBeVisible();
    });

    test('[C5556] Configured Apply - External Portal - Custom Labels on Fields', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        const { customFields } = applicationFormData;

        // Fill required fields on the first page and navigate to the second page
        await configuredApplicationFormPage.fillFirstPageAndClickNext(applicationFormData);

        // Verify custom field labels are as expected
        await expect(configuredApplicationFormPage.customFieldTextLabel).toHaveText(customFields.textFieldLabel);
        await expect(configuredApplicationFormPage.customFieldDropdownLabel).toHaveText(customFields.dropdownFieldLabel);
        await expect(configuredApplicationFormPage.customFieldMultiselectLabel).toHaveText(customFields.multiselectFieldLabel);
        await expect(configuredApplicationFormPage.customFieldTextareaLabel).toHaveText(customFields.textareaFieldLabel);
    });

    test('[C5581] Configured Apply - External Portal - EEO / OFCCP', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);

        // Fill required fields on the first page and navigate to the second page
        await configuredApplicationFormPage.fillFirstPageAndClickNext(applicationFormData);

        // Verify EEO/OFCCP questions are visible
        await expect(configuredApplicationFormPage.genderFieldset).toBeVisible();
        await expect(configuredApplicationFormPage.genderFieldset.locator('legend')).toHaveText('What is your gender?');
        await expect(configuredApplicationFormPage.signatureField).toBeVisible();
        await expect(configuredApplicationFormPage.signedDateField).toBeVisible();
        await expect(configuredApplicationFormPage.disabilityFieldset).toBeVisible();
        await expect(configuredApplicationFormPage.disabilityFieldset.locator('legend')).toContainText('Please check one of the boxes below:');
        await expect(configuredApplicationFormPage.disabilityNameField).toBeVisible();
        await expect(configuredApplicationFormPage.disabilityDateField).toBeVisible();
        await expect(configuredApplicationFormPage.employeeIdField).toBeVisible();
        await expect(configuredApplicationFormPage.veteranFieldset).toBeVisible();
        await expect(configuredApplicationFormPage.veteranFieldset.locator('legend')).toContainText('Pre-Offer Invitation to Self-Identify as a Protected Veteran');
        await expect(configuredApplicationFormPage.raceFieldset).toBeVisible();
        await expect(configuredApplicationFormPage.raceFieldset.locator('legend')).toHaveText('What is your race/ethnicity?');
        await expect(configuredApplicationFormPage.genderPlusFieldset).toBeVisible();
        await expect(configuredApplicationFormPage.genderPlusFieldset.locator('legend')).toHaveText('What is your gender?');
    });

    test('[C5576] Configured Apply - External Portal - Multiple Pages - Back Button', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.jobTitle);
        await expect(configuredApplicationFormPage.configuredFormPageTitle).toHaveText('First Page');
        await configuredApplicationFormPage.fillFirstPageAndClickNext(applicationFormData);
        await expect(configuredApplicationFormPage.configuredFormPageTitle).toHaveText('Second Page');
        await configuredApplicationFormPage.applicationFormBackButton.click();
        await configuredApplicationFormPage.page.waitForLoadState('load');
        await expect(configuredApplicationFormPage.configuredFormPageTitle).toHaveText('First Page');
    });

    test('[C5575] Configured Apply - External Portal - Already Applied', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.alreadyAppliedJob);
        await configuredApplicationFormPage.submitAlreadyAppliedConfiguredApplication(applicationFormData);
        await expect(configuredApplicationFormPage.alreadyAppliedHeading).toBeVisible();
    });

});

test.describe('Configured Application - Internal Portal - Negative', () => {
    // TestRail's expected text reads "Your Attachment 1 is too large..." — this
    // environment's Internal Portal Configured Apply form only has a single
    // Resume/CV Upload field (no separate "Attachment 1" field configured), so
    // the field-name wording differs from TestRail's copy. The size-limit
    // rejection behavior itself is verified live (2026-08-24) against the real
    // #File-error validation message.
    test('[C943] Configured Apply - Internal Portal - Negative (Attachment Size)', async ({ internalConfiguredApplicationFormPage, applicationFormData }) => {
        await internalConfiguredApplicationFormPage.navigateToJobConfiguredApplicationForm(applicationFormData.internalJobTitle);
        await internalConfiguredApplicationFormPage.configuredFormUploadFile(applicationFormData.oversizedResumeFile);
        await expect(internalConfiguredApplicationFormPage.resumeTextErrorLocator).toBeVisible();
        await expect(internalConfiguredApplicationFormPage.resumeTextErrorLocator).toContainText(applicationFormData.maxFileSizeErrorTextConfigured);
    });
});

// [C930] [C937] [C938] Configured Apply - Open Submission
// Live-verified (2026-08-25): the External Portal's Open Submission entry
// ("Submit Your Resume/CV") uses the same multi-page Configured Apply
// form as the regular job-apply flow, including its Attachment 1 field,
// so it reuses existing ApplicationFormPage methods/locators via
// navigateToOpenSubmissions().
test.describe('Configured Application - External Portal - Open Submission', () => {
    test('[C930] Configured Apply - Open Submission - Negative (Incomplete Form)', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToOpenSubmissions();
        await configuredApplicationFormPage.submitIncompleteConfiguredForm();
        const errorMessages = configuredApplicationFormPage.getConfiguredFormErrorMessages();
        for (const locator of errorMessages) {
            await expect(locator).toBeVisible();
        }
    });

    // TestRail's expected copy ("Upload a doc, docx, htm, html, odt, pdf,
    // rtf, txt file.") is narrower than what this environment's Attachment
    // 1 field actually accepts/rejects — live-verified (2026-08-25) full
    // error text lists a much broader set of allowed formats
    // (avi, bmp, csv, doc, docx, gif, htm, html, jfif, jif, jpe, jpeg, jpg,
    // mp3, mpeg, mpg, odf, odg, odp, ods, odt, pdf, png, pps, ppt, pptx,
    // rtf, sxw, tif, tiff, txt, wmv, xls, xlsx). Asserting the real,
    // observed copy rather than TestRail's stale documented text.
    test('[C937] Configured Apply - Open Submission - Negative (Attachment Type)', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToOpenSubmissions();
        await configuredApplicationFormPage.configuredFormUploadAttachment('invalidfiletype.xml');
        await expect(configuredApplicationFormPage.attachment1ErrorLocator).toBeVisible();
        await expect(configuredApplicationFormPage.attachment1ErrorLocator).toContainText(applicationFormData.invalidAttachmentTypeErrorText);
    });

    test('[C938] Configured Apply - Open Submission - Negative (Attachment Size)', async ({ configuredApplicationFormPage, applicationFormData }) => {
        await configuredApplicationFormPage.navigateToOpenSubmissions();
        await configuredApplicationFormPage.configuredFormUploadAttachment(applicationFormData.oversizedResumeFile);
        await expect(configuredApplicationFormPage.attachment1ErrorLocator).toBeVisible();
        await expect(configuredApplicationFormPage.attachment1ErrorLocator).toContainText(applicationFormData.maxAttachmentSizeErrorText);
    });

});

test.describe('Fee Agency - Configured Application', () => {
    test('[C4311] External Portal Fee Agency - Configured Apply - Remote Job (WW)', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        const { locationSearchWorldwide } = applicationFormData;
        await feeAgencyConfiguredFormPage.feeAgencyLogin(applicationFormData.feeAgencyLoginEmail);
        await feeAgencyConfiguredFormPage.locationSearch(locationSearchWorldwide.location, locationSearchWorldwide.dataValue);
        await expect(feeAgencyConfiguredFormPage.jobDetailLocationText).toHaveText(locationSearchWorldwide.jobDetailLocation);
    });

    test('[C4312] External Portal Fee Agency - Configured Apply - Remote Job (State)', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        const { locationSearch } = applicationFormData;
        await feeAgencyConfiguredFormPage.feeAgencyLogin(applicationFormData.feeAgencyLoginEmail);
        await feeAgencyConfiguredFormPage.locationSearch(locationSearch.location, locationSearch.dataValue);
        // toContainText on just "REMOTE" — see [C827]'s comment in this
        // same file: the Fee Agency entry point is the same External
        // Portal (CorporateCareerPortal2) job pool, so its displayed
        // location formatting follows the same shared, independently-
        // changeable admin setting.
        await expect(feeAgencyConfiguredFormPage.jobDetailLocationText).toContainText('REMOTE');
    });

    test('[C4313] External Portal Fee Agency - Configured Apply - Remote Job (City)', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        const { locationSearchCity } = applicationFormData;
        await feeAgencyConfiguredFormPage.feeAgencyLogin(applicationFormData.feeAgencyLoginEmail);
        await feeAgencyConfiguredFormPage.locationSearch(locationSearchCity.location, locationSearchCity.dataValue);
        // toContainText, not toHaveText — see [C826]'s comment in this
        // same file: this US-scoped "Remote" option renders as "Remote,
        // United States", so assert the substring instead of hard-coding
        // the exact trailing country text.
        await expect(feeAgencyConfiguredFormPage.jobDetailLocationText).toContainText(locationSearchCity.jobDetailLocation);
    });

    test('[C4314] External Portal Fee Agency - Configured Apply - Incomplete Form', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        await feeAgencyConfiguredFormPage.submitIncompleteConfiguredForm();
        const errorMessages = feeAgencyConfiguredFormPage.getConfiguredFormErrorMessages();
        for (const locator of errorMessages) {
            await expect(locator).toBeVisible();
        }
    });

    test('[C4317] External Portal Fee Agency - Configured Apply - Multiple Pages', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        await expect(feeAgencyConfiguredFormPage.configuredFormPageTitle).toHaveText('First Page');
        await feeAgencyConfiguredFormPage.fillFirstPageAndClickNext(applicationFormData);
        await expect(feeAgencyConfiguredFormPage.configuredFormPageTitle).toHaveText('Second Page');
    });

    test('[C4318] External Portal Fee Agency - Configured Apply - CQEs (Yes/No)', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        const { cqeQuestions } = applicationFormData;
        await expect(feeAgencyConfiguredFormPage.page.locator('#cqe_543_label')).toHaveText(cqeQuestions.marketingDegreeQuestion);
        await expect(feeAgencyConfiguredFormPage.page.locator('#cqe_543')).toBeVisible();
        await expect(feeAgencyConfiguredFormPage.page.locator('#cqe_530_label')).toHaveText(cqeQuestions.travelQuestion);
        await expect(feeAgencyConfiguredFormPage.cqeTravelQuestion).toBeVisible();
    });

    test('[C4320] External Portal Fee Agency - Configured Apply - CQEs (Free Text)', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        const { cqeQuestions } = applicationFormData;
        await expect(feeAgencyConfiguredFormPage.page.locator('#cqe_649_label')).toHaveText(cqeQuestions.scheduleLimitationsQuestion);
        await expect(feeAgencyConfiguredFormPage.page.locator('#cqe_649')).toBeVisible();
        await expect(feeAgencyConfiguredFormPage.page.locator('#cqe_650_label')).toHaveText(cqeQuestions.uniqueStrengthsQuestion);
        await expect(feeAgencyConfiguredFormPage.page.locator('#cqe_650')).toBeVisible();
    });

    test('[C4321] External Portal Fee Agency - Configured Apply - CQEs (Multiple Choice)', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        const { cqeQuestions } = applicationFormData;
        await expect(feeAgencyConfiguredFormPage.page.locator('#cqe_534_label')).toHaveText(cqeQuestions.jobsHeldQuestion);
        await expect(feeAgencyConfiguredFormPage.page.locator('#cqe_534')).toBeVisible();
        await expect(feeAgencyConfiguredFormPage.page.locator('#cqe_542_label')).toHaveText(cqeQuestions.marketingExperienceQuestion);
        await expect(feeAgencyConfiguredFormPage.cqeMarketingExperienceQuestion).toBeVisible();
    });

    test('[C4315] External Portal Fee Agency - Configured Apply - Attachments Max File Size', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        await feeAgencyConfiguredFormPage.configuredFormUploadFile(applicationFormData.oversizedResumeFile);
        await expect(feeAgencyConfiguredFormPage.resumeTextErrorLocator).toBeVisible();
        await expect(feeAgencyConfiguredFormPage.resumeTextErrorLocator).toContainText(applicationFormData.maxFileSizeErrorTextConfigured);
    });

    test('[C4316] External Portal Fee Agency - Configured Apply - Attachments File Format', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        await feeAgencyConfiguredFormPage.uploadInvalidAttachments();

        for (let i = 1; i <= 4; i++) {
            await expect(feeAgencyConfiguredFormPage.page.locator(`#Attachment_${i}-error`)).toBeVisible();
            await expect(feeAgencyConfiguredFormPage.page.locator(`#Attachment_${i}-error`)).toContainText('The file type for Attachment');
        }
    });


    test('[C4324] External Portal Fee Agency - Configured Apply - Custom Fields - Contact Info', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        const { customFields } = applicationFormData;

        await feeAgencyConfiguredFormPage.fillFirstPageAndClickNext(applicationFormData);

        await expect(feeAgencyConfiguredFormPage.customFieldTextLabel).toHaveText(customFields.textFieldLabel);
        await expect(feeAgencyConfiguredFormPage.customFieldDropdownLabel).toHaveText(customFields.dropdownFieldLabel);
        await expect(feeAgencyConfiguredFormPage.customFieldMultiselectLabel).toHaveText(customFields.multiselectFieldLabel);
        await expect(feeAgencyConfiguredFormPage.customFieldTextareaLabel).toHaveText(customFields.textareaFieldLabel);

        await expect(feeAgencyConfiguredFormPage.customFieldText).toBeVisible();
        await expect(feeAgencyConfiguredFormPage.customFieldDropdown).toBeVisible();
        await expect(feeAgencyConfiguredFormPage.customFieldMultiselect).toBeVisible();
        await expect(feeAgencyConfiguredFormPage.customFieldTextarea).toBeVisible();
    });

    test('[C4323] External Portal Fee Agency - Configured Apply - Custom Fields - Resume Profile', async ({ feeAgencyConfiguredFormPage, applicationFormData }) => {
        await feeAgencyConfiguredFormPage.navigateToJobFeeAgencyConfiguredApplicationForm(applicationFormData.feeAgencyLoginEmail, applicationFormData.feeAgencyTestJob);
        const { customFields } = applicationFormData;

        await feeAgencyConfiguredFormPage.fillFirstPageAndClickNext(applicationFormData);

        await expect(feeAgencyConfiguredFormPage.customFieldTextLabel).toHaveText(customFields.textFieldLabel);
        await expect(feeAgencyConfiguredFormPage.customFieldDropdownLabel).toHaveText(customFields.dropdownFieldLabel);
        await expect(feeAgencyConfiguredFormPage.customFieldMultiselectLabel).toHaveText(customFields.multiselectFieldLabel);
        await expect(feeAgencyConfiguredFormPage.customFieldTextareaLabel).toHaveText(customFields.textareaFieldLabel);

        await expect(feeAgencyConfiguredFormPage.customFieldText).toBeVisible();
        await expect(feeAgencyConfiguredFormPage.customFieldDropdown).toBeVisible();
        await expect(feeAgencyConfiguredFormPage.customFieldMultiselect).toBeVisible();
        await expect(feeAgencyConfiguredFormPage.customFieldTextarea).toBeVisible();
    });
});
