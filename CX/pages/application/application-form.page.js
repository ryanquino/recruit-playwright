class ApplicationFormPage {
    constructor(page) {
        this.page = page;
        this.path = require('path');
        this.fs = require('fs');
        this.crypto = require('crypto');
        this.BasePage = require('../../../ATS/pages/base.page');
        this.basePage = new this.BasePage(page);
        this.submittedEmail = null;

        // Locators
        this.applyButton = this.page.locator('#Jobs_JobDetail_ApplyLink');
        this.configuredApplyButton = this.page.locator('#Jobs_JobDetail_Multiform_ApplyLink');
        this.presubmissionText = this.page.locator('#Apply_ApplyToJob_PresubmissionText_Body');
        this.presubmissionSection = this.page.locator('#Apply_ApplyToJob_PresubmissionSection');
        this.presubmissionAcceptButton = this.page.locator('#Apply_ApplyToJob_PresubmissionText_Accept');
        this.configuredPresubmissionSection = this.page.locator('#MultiForm_Apply_PresubmissionText_Body');
        this.configuredPresubmissionAcceptButton = this.page.locator('#MultiForm_Apply_PresubmissionText_Accept');
        this.firstNameField = this.page.locator('#Apply_ApplyToJob_FirstName');
        this.lastNameField = this.page.locator('#Apply_ApplyToJob_LastName');
        this.emailField = this.page.locator('#Apply_ApplyToJob_Email');

        // [C885] Quick Apply - Open Submission - Default Portal Language
        this.firstNameLabel = this.page.locator('label[for="Apply_ApplyToJob_FirstName"]');
        this.lastNameLabel = this.page.locator('label[for="Apply_ApplyToJob_LastName"]');
        this.emailLabel = this.page.locator('label[for="Apply_ApplyToJob_Email"]');

        // [C836]-[C838] Configured Apply - External Portal - localization.
        // Live-verified (2026-08-27) label `for` attributes on the
        // Configured Apply form.
        this.firstNameCALabel = this.page.locator('label[for="FirstName"]');
        this.lastNameCALabel = this.page.locator('label[for="LastName"]');
        this.emailCALabel = this.page.locator('label[for="EmailAddress"]');
        this.firstNameCAField = this.page.locator('#FirstName');
        this.lastNameCAField = this.page.locator('#LastName');
        this.emailCAField = this.page.locator('#EmailAddress');

        // [C2607]-[C2609] Fee Agency - Configured Apply - Localization
        this.firstNameCALabel = this.page.locator('label[for="FirstName"]');
        this.lastNameCALabel = this.page.locator('label[for="LastName"]');
        this.emailCALabel = this.page.locator('label[for="EmailAddress"]');
        this.phoneNumberCAField = this.page.locator('#PrimaryPhoneNumber');
        this.countryCAField = this.page.locator('#CountryCode');
        this.addressCAField = this.page.locator('#AddressLine1');
        this.postalCodeCAField = this.page.locator('#PostalCode');
        this.resumeTextAField = this.page.locator('#ResumeText');
        this.originalSourceeCAField = this.page.locator('#OriginalSource');

        // [C724] "How did you hear about us?" = Employee Referral reveals
        // these 3 conditional fields (data-condition on OriginalSource ==
        // 'employeeReferral', live-verified 2026-08-31). First/Last are
        // required only in that state (data-val-requiredifhasvalue, not a
        // plain `required` attribute), Email is not.
        this.referrerFirstNameField = this.page.locator('#referrerFirstName');
        this.referrerLastNameField = this.page.locator('#referrerLastName');
        this.referrerEmailField = this.page.locator('#referrerEmailAddress');
        this.referrerFirstNameErrorLocator = this.page.locator('#referrerFirstName-error');
        this.referrerLastNameErrorLocator = this.page.locator('#referrerLastName-error');
        this.submitButton = this.page.locator('#Apply_ApplyToJob_SubmitButton');
        this.configuredSubmitButton = this.page.locator('#MultiForm_Apply_FinishButton');
        this.successMessage = this.page.locator('#Apply_Success_PageHeading');
        this.alreadyAppliedHeading = this.page.locator('#Error_AlreadyApplied_Success_PageHeading');
        this.openSubmissionLink = this.page.locator('#Jobs_PagedJobList_OpenSubmission a');
        // Live-verified (2026-09-15): the Internal Career Portal's job detail
        // page still uses the classic "#Jobs_JobDetail_LocationText" id, but
        // the External Portal (CorporateCareerPortal2, incl. its Fee Agency
        // entry point) now renders these jobs on the "Configured Job Details
        // Page" template instead, which has no element with that id — the
        // location value there lives in a plain <div> under
        // "#ConfigurablePageDetail__DisplayLocation" (next to an <h2>Job
        // Location</h2> label). Match whichever template is actually present
        // rather than assuming the classic id everywhere.
        this.jobDetailLocationText = this.page.locator('#Jobs_JobDetail_LocationText, #ConfigurablePageDetail__DisplayLocation > div');
        this.locationDropdown = this.page.locator('#Jobs_JobSearch_LocationSelect-selectized');
        // Live-verified (2026-09-15): this env's search-filters section now
        // auto-expands via JS shortly (~200ms) after page load, flipping the
        // toggle's accessible name from "Show search filters" to "Hide
        // search filters" — a fixed-name locator used to race that flip and
        // time out once the "Show" name no longer existed. Match either
        // state's name; ensureSearchFiltersExpanded() below decides whether
        // a click is still needed.
        this.showSearchFiltersLink = this.page.getByRole('link', { name: /search filters/i });
        this.searchIconButton = this.page.getByRole('button', { name: 'search' });
        this.feeAgencyEmailAddressField = this.page.locator('#FeeAgency_SignIn__EmailAddress');
        this.feeAgencySubmit = this.page.locator('#FeeAgency_SignIn_Submit');
        this.applicationFormNextButton = this.page.locator('#MultiForm_Apply_NextButton');
        this.applicationFormBackButton = this.page.locator('#MultiForm_Apply_BackButton');
        this.configuredFormPageTitle = this.page.locator('#MultiForm_Apply_PageTitle');
        this.cqeTravelQuestion = this.page.locator('#cqe_530');
        this.cqeSecurityClearanceQuestion = this.page.locator('#cqe_531');
        this.cqeSuccessQuestion = this.page.locator('#cqe_532');
        this.cqeQuantityQuestion = this.page.locator('#cqe_533');
        this.cqeJobsHeldQuestion = this.page.locator('#cqe_534');
        this.cqeAppealsQuestion = this.page.locator('#cqe_535');
        this.cqeMarketingExperienceQuestion = this.page.locator('#cqe_542');
        this.cqeMarketingDegreeQuestion = this.page.locator('#cqe_543');
        this.cqeScheduleLimitationsQuestion = this.page.locator('#cqe_649');
        this.cqeUniqueStrengthsQuestion = this.page.locator('#cqe_650');
        this.cqeManagerRatingQuestion = this.page.locator('#cqe_651');
        this.cqeManagerRatingExplanationQuestion = this.page.locator('#cqe_652');
        this.searchButton = this.page.locator('#Jobs_JobSearch_SubmitButton');

        // Custom field locators
        this.customFieldText = this.page.locator('#ResumeColumn1');
        this.customFieldDropdown = this.page.locator('#ResumeColumn2');
        this.customFieldMultiselect = this.page.locator('#ResumeColumn3');
        this.customFieldTextarea = this.page.locator('#ResumeColumn4');
        this.customFieldTextLabel = this.page.locator('#ResumeColumn1_label');
        this.customFieldDropdownLabel = this.page.locator('#ResumeColumn2_label');
        this.customFieldMultiselectLabel = this.page.locator('#ResumeColumn3_label');
        this.customFieldTextareaLabel = this.page.locator('#ResumeColumn4_label');

        // All field type locators - First page
        this.prefixField = this.page.locator('#NamePrefix');
        this.middleNameField = this.page.locator('#MiddleName');
        this.suffixField = this.page.locator('#NameSuffix');
        this.secondaryPhoneField = this.page.locator('#SecondaryPhoneNumber');
        // Primary Contact Method — <select> (0=Primary Phone, 1=Email,
        // 2=Secondary Phone, 3=Home Address). Live-verified 2026-09-14.
        this.primaryContactMethodField = this.page.locator('#PrimaryContactMethod');
        this.addressLine2Field = this.page.locator('#AddressLine2');
        this.cityField = this.page.locator('#City');
        this.stateField = this.page.locator('#State');
        // "Are you authorized to work in United States" — radio group
        // (name=Citizenship). _0 = authorized for any employer, _1 = present
        // employer only, _2 = requires sponsorship, _3 = unknown.
        // Live-verified 2026-09-14.
        this.workAuthorizedAnyEmployer = this.page.locator('#Citizenship_0');
        this.additionalCountriesField = this.page.locator('#AlternateAuthorizedCountriesToWork');
        this.securityClearanceYes = this.page.locator('#SecurityClearance_0');
        this.willingToRelocateYes = this.page.locator('#Relocation_2');
        // Relocation preferences — <select> of US states/territories — and
        // its free-text companion "Other relocation preferences".
        // Live-verified 2026-09-14.
        this.relocationPreferenceField = this.page.locator('#RelocationPreference');
        this.otherRelocationPreferenceField = this.page.locator('#OtherRelocationPreference');
        this.yearsOfExperienceField = this.page.locator('#RelevantWorkExperience');
        this.levelOfEducationField = this.page.locator('#CurrentLevelOfEducationCode');
        this.universityDegreesField = this.page.locator('#CollegiateMajors');
        this.certificationsField = this.page.locator('#Certifications');
        this.dateAvailableField = this.page.locator('#DateAvailable');
        this.currentJobTypeField = this.page.locator('#CurrentJobTypeCode');
        this.desiredJobTypeField = this.page.locator('#DesiredJobTypeCode');
        this.desiredCareerLevelField = this.page.locator('#DesiredCareerLevelCode');
        this.desiredSalaryField = this.page.locator('#Salary');
        this.attachmentFile1 = this.page.locator('#Attachment_1');
        this.attachmentFile2 = this.page.locator('#Attachment_2');
        this.attachmentFile3 = this.page.locator('#Attachment_3');
        this.attachmentFile4 = this.page.locator('#Attachment_4');

        // All field type locators - Second page
        this.genderMale = this.page.locator('#Gender_0');
        this.signatureField = this.page.locator('#Signature');
        this.signedDateField = this.page.locator('#SignatureDate');
        this.disabilityNameField = this.page.locator('#OfccpDisabilityForm_Name');
        this.disabilityDateField = this.page.locator('#OfccpDisabilityForm_Date');
        this.employeeIdField = this.page.locator('#OfccpDisabilityForm_EmployeeId');
        this.disabilityStatusYes = this.page.locator('#OfccpDisabilityForm_Status_0');
        this.veteranStatusYes = this.page.locator('#VeteranStatus_0');
        this.raceEthnicityWhite = this.page.locator('#Race_1');
        this.genderPlusMale = this.page.locator('#GenderPlus_0');

        // EEO/OFCCP section locators
        this.genderFieldset = this.page.locator('fieldset:has(#Gender_0)');
        this.disabilityFieldset = this.page.locator('fieldset:has(#OfccpDisabilityForm_Status_0)');
        this.veteranFieldset = this.page.locator('fieldset:has(#VeteranStatus_0)');
        this.raceFieldset = this.page.locator('fieldset:has(#Race_0)');
        this.genderPlusFieldset = this.page.locator('fieldset:has(#GenderPlus_0)');
        this.signatureLabel = this.page.locator('#Signature_label');
        this.signedDateLabel = this.page.locator('#SignatureDate_label');
        this.disabilityNameLabel = this.page.locator('#OfccpDisabilityForm_Name_label');
        this.disabilityDateLabel = this.page.locator('#OfccpDisabilityForm_Date_label');
        this.employeeIdLabel = this.page.locator('#OfccpDisabilityForm_EmployeeId_label');

        // Configured form validation error locators
        this.firstNameErrorLocator = this.page.locator('#FirstName-error');
        this.lastNameErrorLocator = this.page.locator('#LastName-error');
        this.emailErrorLocator = this.page.locator('#EmailAddress-error');
        this.phoneErrorLocator = this.page.locator('#PrimaryPhoneNumber-error');
        this.countryErrorLocator = this.page.locator('#CountryCode-error');
        this.addressErrorLocator = this.page.locator('#AddressLine1-error');
        this.postalCodeErrorLocator = this.page.locator('#PostalCode-error');
        this.resumeTextErrorLocator = this.page.locator('#File-error');

        // [C937] [C938] Configured Apply - Open Submission - Attachment 1 negative cases
        this.attachment1ErrorLocator = this.page.locator('#Attachment_1-error');

        // [C19] [C13] Quick Apply - Max File Size error (Internal & External portals)
        this.quickApplyResumeErrorLocator = this.page.locator('#Apply_ApplyToJob_File-error');

        // [C898] Fee Agency Quick Apply - Allow Duplicate Candidates
        this.feeAgencyDuplicateSettingDropdown = this.page.getByLabel('Allow Duplicate Candidate Submission');

        // Cleanup locators
        this.candidateNavLocator = this.page.getByLabel('Candidates', { exact: true });
        this.candidatePoolNavLocator = this.page.getByLabel('Candidate Pool');
        this.editSearchButtonLocator = this.page.getByText('Edit Search');
        this.checkAllItemsCheckboxLocator = this.page.locator('#checkAllItems');
        this.takeActionButtonLocator = this.page.getByRole('link', { name: 'Take Action ' });
        this.deleteSelectedButtonLocator = this.page.getByText('Delete Selected');
        this.bulkActionModalSaveButtonLocator = this.page.locator('#bulkActionModalSave');
        this.applyFiltersButton = this.page.getByRole('button', { name: 'Apply Filters' });
        
        // Purge locators
        this.recycleBinNavLocator = this.page.getByLabel('Recycle Bin');
        this.recycleBinEllipsis = this.page.locator('.oh__icon-button.lifesuite__float-right');
        this.purgeLink = this.page.getByRole('link', { name: 'Purge Recycle Bin' });
        this.purgeModalButton = this.page.locator('#purgeAll_ModalButtonPrimary');
    }

    // Presubmission text (Quick Apply's #Apply_ApplyToJob_PresubmissionSection,
    // Configured Apply's #MultiForm_Apply_PresubmissionText_Body) renders
    // asynchronously after the apply page loads — an immediate isVisible()
    // check right after waitForLoadState('domcontentloaded') can lose that
    // race and silently skip the Accept click, leaving the form gated.
    // Live-verified (2026-08-26): reaching this same apply form through a
    // cross-origin embedded iframe (for the Embedded Candidate Apply specs)
    // consistently lost that race; direct navigation usually wins it by
    // luck, so this was a latent flake here too. Wait briefly for the
    // section to appear instead of checking once.
    async acceptPresubmissionIfPresent(sectionLocator, acceptButton) {
        const appeared = await sectionLocator.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
        if (appeared) {
            await acceptButton.click();
        }
    }

    // Pages forward until the target job card is on screen, following the
    // pager button's own data-href rather than clicking it.
    //
    // Clicking is what the two navigate methods below used to do, and it
    // does not work inside the embedded portal. Live-verified 2026-09-30:
    // #Jobs_PagedJobList_NextLink is a <button type="submit"> that belongs
    // to no form (the only forms on the page are job search and job alert),
    // so its pagination is driven entirely by JS that, under
    // ?embedded=true, never navigates the iframe. The click loop therefore
    // ran all 20 iterations still reading "Page 1 of 4" and then hung the
    // full 60s test timeout on a card it had never paged to — that is what
    // failed [C905], whose "Playwright Internal Job Posting" sits on page 2
    // of the Internal Portal. Assigning window.location to the URL the
    // button already advertises works in both contexts, because a Frame and
    // a Page expose the same evaluate()/url()/waitForURL() API.
    async paginateToJobCard(jobCard, { maxPages = 20 } = {}) {
        const anyJobCard = this.page.locator('a.sr-panel');
        for (let i = 0; i < maxPages; i++) {
            // Never judge "not on this page" before the list has rendered:
            // an empty count on a still-loading page would page straight
            // past a card that is in fact right here.
            await anyJobCard.first().waitFor({ state: 'attached', timeout: 15000 }).catch(() => {});
            if (await jobCard.count() > 0) return;

            const nextButton = this.page.locator('#Jobs_PagedJobList_NextLink');
            // On the last page the button stays in the DOM and goes
            // disabled rather than disappearing — same behaviour
            // JobsListPage.getAllResultCardsAcrossPages() relies on.
            if (await nextButton.count() === 0 || await nextButton.isDisabled()) return;

            const nextHref = await nextButton.getAttribute('data-href');
            if (!nextHref) return;
            const nextUrl = new URL(nextHref, this.page.url()).href;
            if (nextUrl === this.page.url()) return;

            await this.page.evaluate(href => { window.location.href = href; }, nextUrl);
            await this.page.waitForURL(nextUrl, { timeout: 15000 });
            await this.page.waitForLoadState('domcontentloaded');
        }
    }

    // Paginates if the target job card isn't on the current page, same
    // fix as navigateToJobConfiguredApplicationForm() below (mirrors
    // JobsListPage's isJobTitleInList()/getAllResultCardsAcrossPages()).
    // Live-verified 2026-09-25: [C16]'s "Playwright Internal Job Posting"
    // fell onto page 2 of the Internal Portal's growing shared QA catalog,
    // which made the old plain page.click() hang for the full 60s test
    // timeout waiting for a card that was never going to appear on page 1.
    async navigateToJobApplicationForm(jobTitle) {
        const jobCard = this.page.locator(`a.sr-panel:has(.sr-panel__title:has-text("${jobTitle}"))`);
        await this.paginateToJobCard(jobCard);
        await jobCard.first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.applyButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.acceptPresubmissionIfPresent(this.presubmissionSection, this.presubmissionAcceptButton);
    }

    // [C726] Quick Apply (Variable) — appends ?source= to the job detail
    // page's own URL (not the Open Submission apply page goToOpenSubmission
    // WithSource() targets), matching TestRail's "Add a source to the URL
    // in the browser URL bar" step for a normal (non-Open-Submission) job
    // apply flow.
    async goToJobApplicationFormWithSource(jobTitle, source) {
        await this.page.click(`a.sr-panel:has(.sr-panel__title:has-text("${jobTitle}"))`);
        await this.page.waitForLoadState('domcontentloaded');
        const jobDetailUrl = new URL(this.page.url());
        jobDetailUrl.searchParams.set('source', source);
        await this.page.goto(jobDetailUrl.toString());
        await this.page.waitForLoadState('domcontentloaded');
        await this.applyButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.acceptPresubmissionIfPresent(this.presubmissionSection, this.presubmissionAcceptButton);
    }

    async feeAgencyLogin(email) {
        await this.feeAgencyEmailAddressField.fill(email);
        await this.feeAgencySubmit.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async navigateToFeeAgencyApplicationForm(email, jobTitle) {
        await this.feeAgencyEmailAddressField.fill(email);
        await this.feeAgencySubmit.click();
        await this.page.click(`a.sr-panel:has(.sr-panel__title:has-text("${jobTitle}"))`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.applyButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.acceptPresubmissionIfPresent(this.presubmissionSection, this.presubmissionAcceptButton);
    }

    async navigateToJobFeeAgencyConfiguredApplicationForm(email, jobTitle) {
        await this.feeAgencyEmailAddressField.fill(email);
        await this.feeAgencySubmit.click();
        await this.page.click(`a.sr-panel:has(.sr-panel__title:has-text("${jobTitle}"))`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.configuredApplyButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.acceptPresubmissionIfPresent(this.configuredPresubmissionSection, this.configuredPresubmissionAcceptButton);
    }

    // Paginates (via paginateToJobCard(), which follows the pager's own
    // data-href — see its comment for why clicking is not enough) if the
    // target job card isn't on the current page, instead of assuming it's
    // always on page 1. Live-verified 2026-09-25: [C5575]'s "Playwright
    // Updated Test Job" (a shared, growing QA catalog) fell onto page 2 as
    // newer jobs were added, which made the old plain page.click() hang for
    // the full 60s test timeout waiting for a card that was never going to
    // appear on page 1.
    async navigateToJobConfiguredApplicationForm(jobTitle) {
        const jobCard = this.page.locator(`a.sr-panel:has(.sr-panel__title:has-text("${jobTitle}"))`);
        await this.paginateToJobCard(jobCard);
        await jobCard.first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.configuredApplyButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.acceptPresubmissionIfPresent(this.configuredPresubmissionSection, this.configuredPresubmissionAcceptButton);
    }

    // [TC-15749] Configured Apply counterpart to goToJobApplicationFormWithSource()
    // — appends ?source= to the job detail page's URL, then clicks the
    // Configured Apply button instead of Quick Apply's.
    async goToJobConfiguredApplicationFormWithSource(jobTitle, source) {
        const jobCard = this.page.locator(`a.sr-panel:has(.sr-panel__title:has-text("${jobTitle}"))`);
        await this.paginateToJobCard(jobCard);
        await jobCard.first().click();
        await this.page.waitForLoadState('domcontentloaded');
        const jobDetailUrl = new URL(this.page.url());
        jobDetailUrl.searchParams.set('source', source);
        await this.page.goto(jobDetailUrl.toString());
        await this.page.waitForLoadState('domcontentloaded');
        await this.configuredApplyButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.acceptPresubmissionIfPresent(this.configuredPresubmissionSection, this.configuredPresubmissionAcceptButton);
    }

    async navigateToOpenSubmissions() {
        await this.openSubmissionLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.acceptPresubmissionIfPresent(this.presubmissionSection, this.presubmissionAcceptButton);
    }

    /** Same destination as navigateToJobConfiguredApplicationForm(), but hits the direct Apply/MultiForm/<jobId> URL on an explicit host — for OpenSearch enabled/disabled parity tests that drive one page across two hosts within a single test (mirrors JobsListPage.gotoOnHost()). Live-verified 2026-09-21: this route works without first going through the job list/search (which is exactly what a parity test needs to isolate — the form itself, not list/search behavior). */
    async gotoConfiguredApplicationFormOnHost(baseUrl, portalPath, jobId) {
        await this.page.goto(`${baseUrl.replace(/\/$/, '')}/${portalPath}/Apply/MultiForm/${jobId}`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.acceptPresubmissionIfPresent(this.configuredPresubmissionSection, this.configuredPresubmissionAcceptButton);
    }

    /**
     * Schema of every visible, non-hidden field on the *current* page of the
     * Configured Apply form: id, tag, input type, label text, required flag,
     * DOM/reading order among the page's rendered fields, placeholder text,
     * and — for <select>s — its option list, or for every other field its
     * default value (also covers radio/checkbox `value` attributes, which
     * are fixed by markup regardless of checked state — e.g. Gender_0's
     * value="0" — so this catches the same class of value-coding mismatch
     * screener-questions-parity found for select options, for radios too).
     * Read-only: doesn't fill or submit anything, so it's safe to call on
     * either page of the form, and must be called BEFORE
     * fillRequiredFieldsAndAdvance() on a given page so defaultValue reflects
     * the field's true initial state, not whatever this suite just filled.
     *
     * Live-verified 2026-09-21: required-ness is NOT expressed via the plain
     * HTML `required` attribute here — this form uses jQuery Unobtrusive
     * Validation's `data-val-required` attribute instead (consistent with
     * the referrerFirstName/LastName comment above, which found the same
     * thing for a different field).
     */
    async getVisibleFieldSchema() {
        return this.page.evaluate(() => {
            const fields = [];
            let order = 0;
            for (const el of document.querySelectorAll('input[id], select[id], textarea[id]')) {
                if (el.type === 'hidden') continue;
                if (!el.getClientRects().length) continue; // not rendered/visible on this page

                const tag = el.tagName.toLowerCase();
                const type = tag === 'input' ? el.type : tag;
                const labelEl = document.querySelector(`label[for="${el.id}"]`);
                const field = {
                    id: el.id,
                    tag,
                    type,
                    label: labelEl ? labelEl.textContent.trim() : null,
                    required: el.required || el.getAttribute('aria-required') === 'true' || el.hasAttribute('data-val-required'),
                    order: order++,
                    placeholder: el.placeholder || null,
                };
                if (tag === 'select') {
                    field.options = Array.from(el.options).map(o => ({ value: o.value, text: o.textContent.trim() }));
                } else {
                    field.defaultValue = el.value || null;
                }
                fields.push(field);
            }
            return fields;
        });
    }

    /**
     * Fills whichever of a known-safe set of fields are actually PRESENT on
     * the current page, then clicks Next and waits for the page-2
     * navigation. Schema-driven (checks getVisibleFieldSchema() first)
     * rather than a fixed field list, because the required-field set
     * genuinely differs between Configured Apply variants — e.g.
     * submitAllFieldsOpenSubmissionApplication()'s comments document that
     * Open Submission requires "How did you hear about us?" (not required
     * on the job-specific form) and needs the phone field blurred for its
     * intl-tel-input widget to validate. Filling every known-safe field
     * whenever it's present (not just when required) is harmless and keeps
     * this one method working for the job-specific, Open Submission, and
     * Fee Agency variants without three near-duplicate copies.
     *
     * Live-verified 2026-09-21: the Next click causes a full-page navigation
     * (server postback, not an in-place AJAX update) — waiting on the click
     * alone (or `waitForLoadState('load')` right after it) races the
     * navigation and can read back page 1's own (stale) schema instead of
     * page 2's; pairing the click with `waitForNavigation()` avoids that.
     */
    async fillRequiredFieldsAndAdvance(profile) {
        const present = ApplicationFormPage.byId(await this.getVisibleFieldSchema());
        const timestamp = Date.now();
        const emailWithTimestamp = profile.email.replace('@', `+${timestamp}@`);

        if (present.FirstName) await this.firstNameCAField.fill(profile.firstName);
        if (present.LastName) await this.lastNameCAField.fill(profile.lastName);
        if (present.EmailAddress) await this.emailCAField.fill(emailWithTimestamp);
        if (present.PrimaryPhoneNumber) {
            await this.phoneNumberCAField.fill(profile.primaryPhone);
            await this.phoneNumberCAField.blur();
        }
        if (present.CountryCode) await this.countryCAField.selectOption(profile.country);
        if (present.AddressLine1) await this.addressCAField.fill(profile.address);
        if (present.PostalCode) await this.postalCodeCAField.fill(profile.postalCode);
        if (present.ResumeText) await this.resumeTextAField.fill(profile.resumeFreeText);
        if (present.File) await this.configuredFormUploadCV();
        // Required on Open Submission only, but harmless to fill wherever present.
        if (present.OriginalSource) await this.originalSourceeCAField.selectOption(profile.howDidYouHearAboutUs);

        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => null),
            this.applicationFormNextButton.click(),
        ]);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Reads both pages' field schema, given the page is already sitting on
     * page 1 of a Configured Apply form (however it got there — direct
     * jobId URL, Open Submission's jobId 0, or the Fee Agency login-gated
     * flow). Never reaches/clicks the final Finish button, so no
     * application is actually submitted.
     *
     * getVisibleFieldSchema() numbers `order` from 0 within whichever single
     * page it's called on — each page gets its own 0-based sequence, since
     * that method has no idea it's being combined with another page's read.
     * Combining the two pages' fields naively would leave both starting at
     * order 0, so sorting the *combined* array by raw `order` interleaves
     * page 2 fields into the middle of page 1 (a page-2 field at order 5 and
     * a page-1 field at order 5 tie). Re-based here by offsetting every
     * page-2 field's order past the end of page 1, so the combined sequence
     * stays monotonic and actually reflects reading order top-to-bottom
     * across the full two-page flow.
     */
    async readBothPagesFieldSchema(profile) {
        const page1Fields = await this.getVisibleFieldSchema();

        await this.fillRequiredFieldsAndAdvance(profile);
        const page2Fields = await this.getVisibleFieldSchema();
        const page2FieldsRebased = page2Fields.map(field => ({ ...field, order: field.order + page1Fields.length }));

        return [...page1Fields, ...page2FieldsRebased];
    }

    /** Full Configured Apply form schema (both pages) for one host, for a specific job. */
    async getFullConfiguredFormSchema(baseUrl, portalPath, jobId, profile) {
        await this.gotoConfiguredApplicationFormOnHost(baseUrl, portalPath, jobId);
        return this.readBothPagesFieldSchema(profile);
    }

    /**
     * Full Configured Apply form schema for the Open Submission entry point
     * (no specific job — jobId "0" in the URL, same route
     * goToOpenSubmissionWithSource() uses below).
     */
    async getFullOpenSubmissionFormSchema(baseUrl, portalPath, profile) {
        return this.getFullConfiguredFormSchema(baseUrl, portalPath, '0', profile);
    }

    /**
     * Same destination as navigateToJobFeeAgencyConfiguredApplicationForm(),
     * but against an explicit host — the Fee Agency flow is login-gated (by
     * email, no password) rather than reachable via a direct jobId URL like
     * the other two variants, so this still has to drive the UI: land on
     * the Fee Agency portal path, submit the login email, click the target
     * job's panel, then Apply.
     */
    async gotoFeeAgencyConfiguredApplicationFormOnHost(baseUrl, feeAgencyPortalPath, email, jobTitle) {
        await this.page.goto(`${baseUrl.replace(/\/$/, '')}/${feeAgencyPortalPath}`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.feeAgencyEmailAddressField.fill(email);
        await this.feeAgencySubmit.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(`a.sr-panel:has(.sr-panel__title:has-text("${jobTitle}"))`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.configuredApplyButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.acceptPresubmissionIfPresent(this.configuredPresubmissionSection, this.configuredPresubmissionAcceptButton);
    }

    /** Full Configured Apply form schema (both pages) for one host, via the Fee Agency login-gated entry point. */
    async getFullFeeAgencyConfiguredFormSchema(baseUrl, feeAgencyPortalPath, email, jobTitle, profile) {
        await this.gotoFeeAgencyConfiguredApplicationFormOnHost(baseUrl, feeAgencyPortalPath, email, jobTitle);
        return this.readBothPagesFieldSchema(profile);
    }

    /** Field objects keyed by id, for by-id comparison across two hosts — mirrors ScreenerQuestionsPage.byId(). */
    static byId(fields) {
        return Object.fromEntries(fields.map(f => [f.id, f]));
    }

    async clickApplyOnConfiguredApplication(){
        await this.configuredApplyButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.acceptPresubmissionIfPresent(this.configuredPresubmissionSection, this.configuredPresubmissionAcceptButton);
    }

    async submitIncompleteConfiguredForm() {
        await this.applicationFormNextButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // Internal Portal's Configured Apply form is single-page (no Next
    // button), so submitting incomplete just means clicking Finish directly.
    async submitIncompleteInternalConfiguredForm() {
        await this.configuredSubmitButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // [5602] [C942] Configured Apply - Internal Portal - invalid attachment negative cases
    async submitInternalConfiguredApplicationWithFile(profile, filename) {
        await this.firstNameCAField.fill(profile.firstName);
        await this.lastNameCAField.fill(profile.lastName);
        await this.emailCAField.fill(profile.email);
        await this.configuredFormUploadFile(filename);
        await this.configuredSubmitButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // State/Location on this configured apply form has two quirks that
    // together caused the submitted state to never reach the ATS candidate
    // residence record (the Edit Candidate popup's #state came back empty),
    // even though the value looked correct in the visible select.
    // Live-verified 2026-09-14:
    //   1. Selecting a Country fires an async handler that REBUILDS + then
    //      clears the visible #State select ~1s later. Selecting a state
    //      before that reset fires is silently wiped. We wait for the reset
    //      to settle (the value stays put after ~1.5s) before selecting.
    //   2. The value that's actually submitted to the server lives in the
    //      hidden #State_hidden input, NOT the visible #State select — and
    //      the visible select's change event does NOT mirror into it. So we
    //      set #State_hidden explicitly to the same value.
    async selectStateWhenReady(stateValue) {
        const stateOption = this.stateField.locator(`option[value="${stateValue}"]`);
        await stateOption.waitFor({ state: 'attached', timeout: 10000 });
        // Let the country-change reset fire and settle before selecting, so
        // our selection isn't the one that gets wiped.
        await this.page.waitForTimeout(1500);
        await this.stateField.selectOption(stateValue);
        // Mirror the selection into the hidden field that actually submits.
        await this.page.evaluate((value) => {
            const hidden = document.getElementById('State_hidden');
            if (hidden) {
                hidden.value = value;
                hidden.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, stateValue);
    }

    async submitAllFieldsConfiguredApplication(profile) {
        const timestamp = Date.now();
        const emailWithTimestamp = profile.email.replace('@', `+${timestamp}@`);
        this.submittedEmail = emailWithTimestamp;

        // First page - Required fields
        await this.firstNameCAField.fill(profile.firstName);
        await this.lastNameCAField.fill(profile.lastName);
        await this.emailCAField.fill(this.submittedEmail);
        await this.phoneNumberCAField.fill(profile.primaryPhone);
        await this.countryCAField.selectOption(profile.country);
        await this.addressCAField.fill(profile.address);
        await this.postalCodeCAField.fill(profile.postalCode);
        await this.resumeTextAField.fill(profile.resumeFreeText);
        await this.configuredFormUploadCV();

        // First page - Optional fields
        const { allFields } = profile;
        await this.prefixField.selectOption(allFields.prefix);
        await this.middleNameField.fill(allFields.middleName);
        await this.suffixField.fill(allFields.suffix);
        await this.secondaryPhoneField.fill(allFields.secondaryPhone);
        await this.primaryContactMethodField.selectOption(allFields.primaryContactMethod);
        await this.addressLine2Field.fill(allFields.addressLine2);
        await this.cityField.fill(allFields.city);
        await this.selectStateWhenReady(allFields.state);
        // await this.additionalCountriesField.selectOption(allFields.additionalCountries);
        await this.workAuthorizedAnyEmployer.check();
        await this.securityClearanceYes.check();
        await this.willingToRelocateYes.check();
        await this.relocationPreferenceField.selectOption(allFields.relocationPreference);
        await this.otherRelocationPreferenceField.fill(allFields.otherRelocationPreference);
        await this.yearsOfExperienceField.fill(allFields.yearsOfExperience);
        await this.levelOfEducationField.selectOption(allFields.levelOfEducation);
        await this.universityDegreesField.fill(allFields.universityDegrees);
        await this.certificationsField.fill(allFields.certifications);
        await this.dateAvailableField.fill(allFields.dateAvailable);
        await this.currentJobTypeField.selectOption(allFields.currentJobType);
        await this.desiredJobTypeField.selectOption(allFields.desiredJobType);
        await this.desiredCareerLevelField.selectOption(allFields.desiredCareerLevel);
        await this.desiredSalaryField.fill(allFields.desiredSalary);
        const originalSourceVisible = await this.page.locator('#OriginalSource').isVisible();
        if (originalSourceVisible) {
            await this.originalSourceeCAField.selectOption(profile.howDidYouHearAboutUs);
        }

        // First page - CQE fields. The configured job's custom questions
        // are a mix of dropdown (select) and free-text inputs — fill each
        // by its type so none are left blank on submission.
        // Live-verified id/type map 2026-09-14.
        const { cqe } = allFields;
        await this.cqeTravelQuestion.selectOption(cqe.travel);
        await this.cqeSecurityClearanceQuestion.selectOption(cqe.securityClearance);
        await this.cqeSuccessQuestion.fill(cqe.success);
        await this.cqeQuantityQuestion.fill(cqe.quantity);
        await this.cqeJobsHeldQuestion.selectOption(cqe.jobsHeld);
        await this.cqeAppealsQuestion.fill(cqe.appeals);
        await this.cqeMarketingExperienceQuestion.selectOption(cqe.marketingExperience);
        await this.cqeMarketingDegreeQuestion.selectOption(cqe.marketingDegree);
        await this.cqeScheduleLimitationsQuestion.fill(cqe.scheduleLimitations);
        await this.cqeUniqueStrengthsQuestion.fill(cqe.uniqueStrengths);
        await this.cqeManagerRatingQuestion.selectOption(cqe.managerRating);
        await this.cqeManagerRatingExplanationQuestion.fill(cqe.managerRatingExplanation);

        // First page - Attachments
        const attachmentFilePath = this.path.join(__dirname, '../../test-data/files/resume.pdf');
        await this.attachmentFile1.setInputFiles(attachmentFilePath);
        await this.attachmentFile2.setInputFiles(attachmentFilePath);
        await this.attachmentFile3.setInputFiles(attachmentFilePath);
        await this.attachmentFile4.setInputFiles(attachmentFilePath);

        await this.applicationFormNextButton.click();
        await this.page.waitForLoadState('load');

        // Second page - Custom fields
        await this.customFieldText.fill(allFields.customFieldText);
        await this.customFieldDropdown.selectOption(allFields.customFieldDropdown);
        await this.customFieldMultiselect.selectOption(allFields.customFieldMultiselect);
        await this.customFieldTextarea.fill(allFields.customFieldTextarea);

        // Second page - EEO fields
        await this.genderMale.check();
        await this.signatureField.fill(allFields.signature);
        await this.signedDateField.fill(allFields.signedDate);
        await this.disabilityNameField.fill(allFields.disabilityName);
        await this.disabilityDateField.fill(allFields.disabilityDate);
        await this.employeeIdField.fill(allFields.employeeId);
        await this.disabilityStatusYes.check();
        await this.veteranStatusYes.check();
        await this.raceEthnicityWhite.check();
        await this.genderPlusMale.check();

        await this.configuredSubmitButton.click();
        // waitForLoadState('networkidle') here was fragile — it can hang
        // indefinitely on any background polling/analytics request instead
        // of reflecting the submission actually completing (live-verified
        // 2026-09-25: reproduced a 60s hang on this exact wait on firefox).
        // Every caller of these submit methods immediately checks
        // successMessage anyway, so wait for that directly instead.
        await this.successMessage.waitFor({ state: 'visible' });
    }

    // [C818] Open Submission variant of submitAllFieldsConfiguredApplication().
    // The Open Submission Configured Apply form in this environment exposes
    // a REDUCED field set compared to the job-specific form — live-verified
    // 2026-09-23 that these are absent and must NOT be filled (doing so
    // hangs the whole submission waiting on a locator that never appears):
    //   - "Are you authorized to work..." Citizenship radio group (#Citizenship_0)
    //   - "Relocation preferences" dropdown (#RelocationPreference)
    //   - "Other relocation preferences" free-text (#OtherRelocationPreference)
    //     — previously present, re-checked 2026-09-23: no longer on this form
    //   - every custom question (CQE) field (#cqe_*)
    // Everything else (including Primary Contact Method, State/Location, and
    // the second-page custom + EEO fields) is present and filled the same way.
    async submitAllFieldsOpenSubmissionApplication(profile) {
        const timestamp = Date.now();
        const emailWithTimestamp = profile.email.replace('@', `+${timestamp}@`);
        this.submittedEmail = emailWithTimestamp;

        // First page - Required fields
        await this.firstNameCAField.fill(profile.firstName);
        await this.lastNameCAField.fill(profile.lastName);
        await this.emailCAField.fill(this.submittedEmail);
        // The Open Submission form's phone fields use the intl-tel-input
        // widget, which only formats + validates the number on blur. Unlike
        // the job-specific form, this form enforces that validation at the
        // Next step, so an unblurred (raw) value reads as "Phone number is
        // Invalid" and silently blocks navigation. Blur after filling so the
        // widget accepts it. Live-verified 2026-09-14.
        await this.phoneNumberCAField.fill(profile.primaryPhone);
        await this.phoneNumberCAField.blur();
        await this.countryCAField.selectOption(profile.country);
        await this.addressCAField.fill(profile.address);
        await this.postalCodeCAField.fill(profile.postalCode);
        await this.resumeTextAField.fill(profile.resumeFreeText);
        await this.configuredFormUploadCV();

        // First page - Optional fields (excluding those absent on the Open
        // Submission form: work authorization + relocation preferences).
        const { allFields } = profile;
        await this.prefixField.selectOption(allFields.prefix);
        await this.middleNameField.fill(allFields.middleName);
        await this.suffixField.fill(allFields.suffix);
        await this.secondaryPhoneField.fill(allFields.secondaryPhone);
        await this.secondaryPhoneField.blur();
        await this.primaryContactMethodField.selectOption(allFields.primaryContactMethod);
        await this.addressLine2Field.fill(allFields.addressLine2);
        await this.cityField.fill(allFields.city);
        await this.selectStateWhenReady(allFields.state);
        await this.securityClearanceYes.check();
        await this.willingToRelocateYes.check();
        await this.yearsOfExperienceField.fill(allFields.yearsOfExperience);
        await this.levelOfEducationField.selectOption(allFields.levelOfEducation);
        await this.universityDegreesField.fill(allFields.universityDegrees);
        await this.certificationsField.fill(allFields.certifications);
        await this.dateAvailableField.fill(allFields.dateAvailable);
        await this.currentJobTypeField.selectOption(allFields.currentJobType);
        await this.desiredJobTypeField.selectOption(allFields.desiredJobType);
        await this.desiredCareerLevelField.selectOption(allFields.desiredCareerLevel);
        await this.desiredSalaryField.fill(allFields.desiredSalary);
        // "How did you hear about us?" is REQUIRED on the Open Submission
        // form — leaving it blank keeps the Next button on the first page
        // (live-verified 2026-09-14), so the second-page custom + EEO fields
        // are never reached and their values never reach ATS. Select it
        // unconditionally here.
        await this.originalSourceeCAField.selectOption(profile.howDidYouHearAboutUs);

        // No CQE fields on the Open Submission form — skipped.

        // First page - Attachments
        const attachmentFilePath = this.path.join(__dirname, '../../test-data/files/resume.pdf');
        await this.attachmentFile1.setInputFiles(attachmentFilePath);
        await this.attachmentFile2.setInputFiles(attachmentFilePath);
        await this.attachmentFile3.setInputFiles(attachmentFilePath);
        await this.attachmentFile4.setInputFiles(attachmentFilePath);

        await this.applicationFormNextButton.click();
        await this.page.waitForLoadState('load');

        // The Open Submission configured form's second page has NO custom-
        // field or EEO section (live-verified 2026-09-14 — no #ResumeColumn*
        // and no #Gender_0 render on page 2), unlike the job-specific form.
        // Page 2 is just the Finish step, so submit directly.
        await this.configuredSubmitButton.click();
        // waitForLoadState('networkidle') here was fragile — it can hang
        // indefinitely on any background polling/analytics request instead
        // of reflecting the submission actually completing (live-verified
        // 2026-09-25: reproduced a 60s hang on this exact wait on firefox).
        // Every caller of these submit methods immediately checks
        // successMessage anyway, so wait for that directly instead.
        await this.successMessage.waitFor({ state: 'visible' });
    }

    async fillFirstPageAndClickNext(profile) {
        const timestamp = Date.now();
        const emailWithTimestamp = profile.email.replace('@', `+${timestamp}@`);
        await this.firstNameCAField.fill(profile.firstName);
        await this.lastNameCAField.fill(profile.lastName);
        await this.emailCAField.fill(emailWithTimestamp);
        await this.phoneNumberCAField.fill(profile.primaryPhone);
        await this.countryCAField.selectOption(profile.country);
        await this.addressCAField.fill(profile.address);
        await this.postalCodeCAField.fill(profile.postalCode);
        await this.resumeTextAField.fill(profile.resumeFreeText);
        await this.configuredFormUploadCV();
        await this.applicationFormNextButton.click();
        await this.page.waitForLoadState('load');
    }

    getConfiguredFormErrorMessages() {
        return [
            this.firstNameErrorLocator,
            this.lastNameErrorLocator,
            this.emailErrorLocator,
            this.resumeTextErrorLocator
        ];
    }

    /**
     * The "Show/Hide search filters" toggle's accessible name auto-flips
     * shortly after page load (see the live-verified note on
     * showSearchFiltersLink above) as the site auto-expands the filters
     * section on its own. Poll its aria-expanded state for that transition
     * to settle (it's one-way: collapsed -> expanded, never observed to
     * revert) instead of clicking immediately, which used to race the
     * flip and either time out (name changed mid-wait) or, worse, click a
     * toggle that had just auto-expanded and collapse it back.
     */
    async ensureSearchFiltersExpanded() {
        const deadline = Date.now() + 2000;
        while (Date.now() < deadline && (await this.showSearchFiltersLink.getAttribute('aria-expanded')) !== 'true') {
            await this.page.waitForTimeout(100);
        }
        if ((await this.showSearchFiltersLink.getAttribute('aria-expanded')) !== 'true') {
            await this.showSearchFiltersLink.click();
        }
    }

    async locationSearch(location, dataValue) {
        await this.ensureSearchFiltersExpanded();
        await this.locationDropdown.click();
        await this.page.type('#Jobs_JobSearch_LocationSelect-selectized', location);
        // The filters section can shift/re-render while the selectize
        // dropdown is open, briefly overlapping it and intercepting the
        // pointer event on the option underneath (live-verified 2026-08-28:
        // "<section id="filters"> intercepts pointer events", retried for
        // the full test timeout). Force the click past that transient
        // overlap instead of waiting on actionability that never settles.
        await this.page.click(`.selectize-dropdown-content .option[data-value="${dataValue}"]`, { force: true });
        await this.page.evaluate(() => document.getElementById('Jobs_JobSearch_SubmitButton').click());
        await this.page.waitForLoadState('load');
        await this.page.locator('article.sr-search__section a.sr-panel').first().click();
        await this.page.locator('#Jobs_JobDetail_TitleText').waitFor({ state: 'visible', timeout: 30000 });
    }

    async submitApplication(profile) {
        const timestamp = Date.now();
        const emailWithTimestamp = profile.email.replace('@', `+${timestamp}@`);
        this.submittedEmail = emailWithTimestamp;     
        await this.firstNameField.fill(profile.firstName);
        await this.lastNameField.fill(profile.lastName);
        await this.emailField.fill(this.submittedEmail);
        await this.uploadCV();
        await this.submitButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async submitConfiguredApplication(profile){
        const timestamp = Date.now();
        const emailWithTimestamp = profile.email.replace('@', `+${timestamp}@`);
        this.submittedEmail = emailWithTimestamp;
        await this.firstNameCAField.fill(profile.firstName);
        await this.lastNameCAField.fill(profile.lastName);
        await this.emailCAField.fill(this.submittedEmail);
        await this.phoneNumberCAField.fill(profile.primaryPhone);
        await this.countryCAField.selectOption(profile.country);
        await this.addressCAField.fill(profile.address);
        await this.postalCodeCAField.fill(profile.postalCode);
        await this.resumeTextAField.fill(profile.resumeFreeText);
        await this.originalSourceeCAField.selectOption(profile.howDidYouHearAboutUs);
        await this.configuredFormUploadCV();
        await this.applicationFormNextButton.click();
        await this.page.waitForLoadState('load');
        await this.configuredSubmitButton.click();
        // waitForLoadState('networkidle') here was fragile — it can hang
        // indefinitely on any background polling/analytics request instead
        // of reflecting the submission actually completing (live-verified
        // 2026-09-25: reproduced a 60s hang on this exact wait on firefox).
        // Every caller of these submit methods immediately checks
        // successMessage anyway, so wait for that directly instead.
        await this.successMessage.waitFor({ state: 'visible' });
    }

    // [C836]-[C838] localization: the Configured Application Forms built
    // on the dedicated French/German/Spanish portals are single-page,
    // default-field-set forms (First Name, Last Name, Email, Resume/CV
    // Upload only — no Phone/Country/Address/PostalCode/ResumeText/
    // OriginalSource fields, no second page, no Next button, Finish
    // button is on page 1). submitConfiguredApplication() assumes the
    // full multi-page field set and would fail here trying to fill
    // fields that don't exist. Live-verified 2026-09-04.
    async submitMinimalConfiguredApplication(profile) {
        const timestamp = Date.now();
        const emailWithTimestamp = profile.email.replace('@', `+${timestamp}@`);
        this.submittedEmail = emailWithTimestamp;
        await this.firstNameCAField.fill(profile.firstName);
        await this.lastNameCAField.fill(profile.lastName);
        await this.emailCAField.fill(this.submittedEmail);
        await this.configuredFormUploadCV();
        await this.configuredSubmitButton.click();
        // waitForLoadState('networkidle') here was fragile — it can hang
        // indefinitely on any background polling/analytics request instead
        // of reflecting the submission actually completing (live-verified
        // 2026-09-25: reproduced a 60s hang on this exact wait on firefox).
        // Every caller of these submit methods immediately checks
        // successMessage anyway, so wait for that directly instead.
        await this.successMessage.waitFor({ state: 'visible' });
    }

    async submitAlreadyAppliedConfiguredApplication(profile) {
        await this.firstNameCAField.fill(profile.firstName);
        await this.lastNameCAField.fill(profile.lastName);
        await this.emailCAField.fill(profile.alreadyAppliedEmail);
        await this.phoneNumberCAField.fill(profile.primaryPhone);
        await this.countryCAField.selectOption(profile.country);
        await this.addressCAField.fill(profile.address);
        await this.postalCodeCAField.fill(profile.postalCode);
        await this.resumeTextAField.fill(profile.resumeFreeText);
        await this.configuredFormUploadCV();
        await this.applicationFormNextButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async submitInternalConfiguredApplication(profile){
        const timestamp = Date.now();
        const emailWithTimestamp = profile.email.replace('@', `+${timestamp}@`);
        this.submittedEmail = emailWithTimestamp;
        await this.firstNameCAField.fill(profile.firstName);
        await this.lastNameCAField.fill(profile.lastName);
        await this.emailCAField.fill(this.submittedEmail);
        await this.phoneNumberCAField.fill(profile.primaryPhone);
        await this.countryCAField.selectOption(profile.country);
        await this.addressCAField.fill(profile.address);
        await this.postalCodeCAField.fill(profile.postalCode);
        await this.resumeTextAField.fill(profile.resumeFreeText);
        await this.configuredFormUploadCV();
        await this.configuredSubmitButton.click();
        // waitForLoadState('networkidle') here was fragile — it can hang
        // indefinitely on any background polling/analytics request instead
        // of reflecting the submission actually completing (live-verified
        // 2026-09-25: reproduced a 60s hang on this exact wait on firefox).
        // Every caller of these submit methods immediately checks
        // successMessage anyway, so wait for that directly instead.
        await this.successMessage.waitFor({ state: 'visible' });
    }

    // [5551] [5544] [C5588] Configured Apply - External Portal / Open
    // Submission - Resume File Format / Text Conversion: same as
    // submitConfiguredApplication() but takes the resume filename as a
    // parameter instead of hardcoding resume.pdf, so it can be looped
    // over all valid formats.
    async submitConfiguredApplicationWithResume(profile, filename) {
        const timestamp = Date.now();
        const emailWithTimestamp = profile.email.replace('@', `+${timestamp}@`);
        this.submittedEmail = emailWithTimestamp;
        await this.firstNameCAField.fill(profile.firstName);
        await this.lastNameCAField.fill(profile.lastName);
        await this.emailCAField.fill(this.submittedEmail);
        await this.phoneNumberCAField.fill(profile.primaryPhone);
        await this.countryCAField.selectOption(profile.country);
        await this.addressCAField.fill(profile.address);
        await this.postalCodeCAField.fill(profile.postalCode);
        await this.resumeTextAField.fill(profile.resumeFreeText);
        await this.configuredFormUploadFile(filename);
        await this.applicationFormNextButton.click();
        await this.page.waitForLoadState('load');
        await this.configuredSubmitButton.click();
        // waitForLoadState('networkidle') here was fragile — it can hang
        // indefinitely on any background polling/analytics request instead
        // of reflecting the submission actually completing (live-verified
        // 2026-09-25: reproduced a 60s hang on this exact wait on firefox).
        // Every caller of these submit methods immediately checks
        // successMessage anyway, so wait for that directly instead.
        await this.successMessage.waitFor({ state: 'visible' });
    }

    // [5543] Configured Apply - Internal Portal - Resume Text Conversion:
    // same as submitInternalConfiguredApplication() but takes the resume
    // filename as a parameter instead of hardcoding resume.pdf.
    async submitInternalConfiguredApplicationWithResume(profile, filename) {
        const timestamp = Date.now();
        const emailWithTimestamp = profile.email.replace('@', `+${timestamp}@`);
        this.submittedEmail = emailWithTimestamp;
        await this.firstNameCAField.fill(profile.firstName);
        await this.lastNameCAField.fill(profile.lastName);
        await this.emailCAField.fill(this.submittedEmail);
        await this.phoneNumberCAField.fill(profile.primaryPhone);
        await this.countryCAField.selectOption(profile.country);
        await this.addressCAField.fill(profile.address);
        await this.postalCodeCAField.fill(profile.postalCode);
        await this.resumeTextAField.fill(profile.resumeFreeText);
        await this.configuredFormUploadFile(filename);
        await this.configuredSubmitButton.click();
        // waitForLoadState('networkidle') here was fragile — it can hang
        // indefinitely on any background polling/analytics request instead
        // of reflecting the submission actually completing (live-verified
        // 2026-09-25: reproduced a 60s hang on this exact wait on firefox).
        // Every caller of these submit methods immediately checks
        // successMessage anyway, so wait for that directly instead.
        await this.successMessage.waitFor({ state: 'visible' });
    }

    async submitFeeAgencyConfiguredApplication(profile){
        const timestamp = Date.now();
        const emailWithTimestamp = profile.email.replace('@', `+${timestamp}@`);
        this.submittedEmail = emailWithTimestamp;
        await this.firstNameCAField.fill(profile.firstName);
        await this.lastNameCAField.fill(profile.lastName);
        await this.emailCAField.fill(this.submittedEmail);
        await this.phoneNumberCAField.fill(profile.primaryPhone);
        await this.countryCAField.selectOption(profile.country);
        await this.addressCAField.fill(profile.address);
        await this.postalCodeCAField.fill(profile.postalCode);
        await this.resumeTextAField.fill(profile.resumeFreeText);
        await this.configuredFormUploadCV();
        await this.applicationFormNextButton.click();
        await this.page.waitForLoadState('load');
        await this.configuredSubmitButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // [C19] [C13] [C798] Quick Apply - Max File Size - Internal/External
    // portals reuse this with an explicit filename (e.g. the oversized
    // resume fixture) instead of adding a separate upload method.
    async uploadCV(filename = 'resume.pdf') {
        const filePath = this.path.join(__dirname, '../../test-data/files/' + filename);
        await this.page.locator('#Apply_ApplyToJob_File').setInputFiles(filePath);
    }

    async configuredFormUploadCV(){
        await this.configuredFormUploadFile('resume.pdf');
    }

    async configuredFormUploadFile(filename) {
        const filePath = this.path.join(__dirname, '../../test-data/files/' + filename);
        await this.page.locator('#File').setInputFiles(filePath);
    }

    // [C937] [C938] Configured Apply - Open Submission - Attachment 1
    // negative cases. Also the shared primitive for
    // uploadInvalidAttachments()/uploadValidAttachments() below, so
    // there's a single place that knows how to upload to one attachment
    // field.
    async configuredFormUploadAttachment(filename, attachmentNumber = 1) {
        const filePath = this.path.join(__dirname, '../../test-data/files/' + filename);
        await this[`attachmentFile${attachmentNumber}`].setInputFiles(filePath);
    }

    async uploadInvalidAttachments() {
        for (let i = 1; i <= 4; i++) {
            await this.configuredFormUploadAttachment('invalidfiletype.xml', i);
        }
    }

    async uploadValidAttachments() {
        for (let i = 1; i <= 4; i++) {
            await this.configuredFormUploadAttachment('resume.pdf', i);
        }
    }

    async loginToATS() {
        await this.page.goto(process.env.ATS_BASE_URL || 'https://playwrightqa-openhire.silkroad-eng.com');
        await this.basePage.login();
        await this.page.waitForLoadState('networkidle');
        await this.candidateNavLocator.click();
        await this.candidatePoolNavLocator.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getTableRowCount() {
        return this.candidateExistsForEmail(this.submittedEmail);
    }

    // [SC-079] "Job Title" is a default Candidate Pool result column (no
    // Configure Columns step needed, unlike Source). Confirms the ATS
    // application record isn't just "a candidate exists with this email"
    // (candidateExistsForEmail()) but is linked to the specific job that
    // was applied to. Assumes searchAppliedCandidate() (or an equivalent
    // filtered search by this.submittedEmail) already ran. Looks up the
    // column position by header text rather than a hardcoded index, since
    // the leading checkbox/indicator columns render as empty header cells.
    async getJobTitleForSubmittedCandidate() {
        const headerCells = this.page.locator('#bulkActionItemResultsTable thead th');
        const headerCount = await headerCells.count();
        let jobTitleColumnIndex = -1;
        for (let i = 0; i < headerCount; i++) {
            if ((await headerCells.nth(i).textContent()).trim() === 'Job Title') {
                jobTitleColumnIndex = i;
                break;
            }
        }
        if (jobTitleColumnIndex === -1) {
            throw new Error('Could not find a "Job Title" column in the Candidate Pool results table');
        }
        const jobTitleCell = this.page.locator('#bulkActionItemResultsTable tbody tr').first().locator('td').nth(jobTitleColumnIndex);
        return (await jobTitleCell.textContent()).trim();
    }

    // [C712]/[C713]/[C719]-[C721]/[C4303] Source/HDYHAU — reads the
    // candidate's recorded Source from the ATS Candidate Pool. Live-verified
    // (2026-08-27): "Source" isn't one of the default result columns, but
    // is available via the "Configure Columns" modal (#btnConfigureColumns
    // -> [data-code="source"] checkbox -> #configurableColumnsModalApply),
    // same configurable-columns mechanism CandidatesPoolPage.addTableColumn()
    // uses for country/state/recruiting manager. Once added it's the last
    // <td> in each result row (no data-code on the cell itself, only the
    // header). Assumes loginToATS() was already called.
    // Live-verified (2026-08-31): the email filter intermittently doesn't
    // take effect on the first "Apply Filters" click — the results table
    // still shows unfiltered results (many unrelated "CX First CX Last"
    // rows) for that one search, even though the #emailAddress field held
    // the correct value. Retries the whole search up to 3 times until
    // exactly 1 row is returned instead of trusting whatever's first on
    // the first try. (Note: the results row doesn't render the candidate's
    // email as visible text at all — only name/job/source/date — so
    // filtering rows by email text isn't an option; row count is the only
    // reliable signal here.)
    async getRecordedSourceForSubmittedCandidate() {
        const maxAttempts = 3;
        let rowCount = 0;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            await this.editSearchButtonLocator.click();
            await this.page.locator('#emailAddress').fill(this.submittedEmail);
            await this.applyFiltersButton.click();
            await this.page.waitForLoadState('networkidle');
            rowCount = await this.page.locator('#bulkActionItemResultsTable tbody tr').count();
            if (rowCount === 1) break;
        }
        if (rowCount !== 1) {
            throw new Error(`Expected exactly 1 candidate row for ${this.submittedEmail}, found ${rowCount} after ${maxAttempts} search attempts`);
        }

        const sourceHeaderText = this.page.locator('#bulkActionItemResultsTable thead').getByText('Source', { exact: true });
        const hasSourceColumn = await sourceHeaderText.count();
        if (!hasSourceColumn) {
            await this.page.locator('#btnConfigureColumns').click();
            await this.page.locator('[data-code="source"]').first().click();
            await this.page.locator('#configurableColumnsModalApply').click();
            // Live-verified 2026-09-25: waitForLoadState('networkidle') isn't
            // a reliable signal that the table's thead has actually been
            // re-rendered with the new column — this is an AJAX-driven
            // update, and reading the header immediately after could still
            // see the old column set. Wait for the real signal (the header
            // text itself appearing) instead.
            await sourceHeaderText.waitFor({ state: 'visible', timeout: 15000 });
        }

        // Live-verified 2026-09-25: the newly-added "Source" column doesn't
        // necessarily land as the LAST column (this table's default last
        // column is "Enter Date", a date) — a fixed .last() occasionally
        // grabbed "Enter Date" instead, e.g. returning "9/25/26" where
        // "SilkRoad Candidate Experience" was expected. Find the real
        // column index from the header row instead of assuming position.
        const headerCells = this.page.locator('#bulkActionItemResultsTable thead tr').first().locator('th, td');
        const headerTexts = (await headerCells.allInnerTexts()).map(t => t.trim());
        const sourceIndex = headerTexts.indexOf('Source');
        if (sourceIndex === -1) {
            throw new Error(`"Source" column not found in results table headers after configuring it: [${headerTexts.join(', ')}]`);
        }
        const sourceCell = this.page.locator('#bulkActionItemResultsTable tbody tr').first().locator('td').nth(sourceIndex);
        return (await sourceCell.textContent()).trim();
    }

    // [C713]/[C721] Source/HDYHAU (Variable/Online) — directly accesses the
    // Open Submission apply page with a ?source= query param, bypassing the
    // portal home page and "Submit Your Resume/CV" link (per TestRail's
    // "DO NOT navigate to the Open Submission form" step). Live-verified
    // (2026-08-27): the real routes are Apply/QuickApply/0 and
    // Apply/MultiForm/0 (not TestRail's legacy Apply/ApplyToJob?jobId=0).
    // Derives the portal path from the current page URL so it works for
    // both the Quick Apply and Configured Apply portal fixtures.
    async goToOpenSubmissionWithSource(source, isConfiguredApply = false) {
        const currentUrl = new URL(this.page.url());
        const portalPath = currentUrl.pathname.split('/').slice(0, 3).join('/');
        const applyPath = isConfiguredApply ? 'Apply/MultiForm/0' : 'Apply/QuickApply/0';
        await this.page.goto(`${portalPath}/${applyPath}?source=${encodeURIComponent(source)}`);
        await this.page.waitForLoadState('domcontentloaded');
        if (isConfiguredApply) {
            await this.acceptPresubmissionIfPresent(this.configuredPresubmissionSection, this.configuredPresubmissionAcceptButton);
        } else {
            await this.acceptPresubmissionIfPresent(this.presubmissionSection, this.presubmissionAcceptButton);
        }
    }

    // [C719]/[C720] Source/HDYHAU (Not Required) — Configured Apply Open
    // Submission where the "How did you hear about us?" field is present
    // but not required (live-verified 2026-08-27: no `required` attribute
    // on #OriginalSource on this environment's Configured Apply portal, and
    // submitting without selecting it isn't blocked). selectHDYHAU controls
    // whether the field is filled in, matching each case's "with/without
    // selecting a value" step.
    async submitConfiguredOpenSubmission(profile, selectHDYHAU) {
        const timestamp = Date.now();
        const emailWithTimestamp = profile.email.replace('@', `+${timestamp}@`);
        this.submittedEmail = emailWithTimestamp;
        await this.firstNameCAField.fill(profile.firstName);
        await this.lastNameCAField.fill(profile.lastName);
        await this.emailCAField.fill(this.submittedEmail);
        await this.phoneNumberCAField.fill(profile.primaryPhone);
        await this.countryCAField.selectOption(profile.country);
        await this.addressCAField.fill(profile.address);
        await this.postalCodeCAField.fill(profile.postalCode);
        await this.resumeTextAField.fill(profile.resumeFreeText);
        if (selectHDYHAU) {
            await this.originalSourceeCAField.selectOption(profile.howDidYouHearAboutUs);
        }
        await this.configuredFormUploadCV();
        await this.applicationFormNextButton.click();
        await this.page.waitForLoadState('load');
        await this.configuredSubmitButton.click();
        // waitForLoadState('networkidle') here was fragile — it can hang
        // indefinitely on any background polling/analytics request instead
        // of reflecting the submission actually completing (live-verified
        // 2026-09-25: reproduced a 60s hang on this exact wait on firefox).
        // Every caller of these submit methods immediately checks
        // successMessage anyway, so wait for that directly instead.
        await this.successMessage.waitFor({ state: 'visible' });
    }

    // [C724]/[TC-15756] Configured Apply, HDYHAU = Employee Referral —
    // fills the rest of the form plus the referrer fields this option
    // reveals, then submits. Same field set on CorporateCareerPortal2's
    // Open Submission form [C724] and its job apply form [TC-15756]
    // (live-verified 2026-10-01), so it serves both flows. referrerEmail is
    // optional (see referrerEmailField's docstring above); referrerFirstName/
    // LastName are always filled since this is used for the
    // successful-submission path.
    async submitConfiguredApplicationAsEmployeeReferral(profile) {
        const timestamp = Date.now();
        const emailWithTimestamp = profile.email.replace('@', `+${timestamp}@`);
        this.submittedEmail = emailWithTimestamp;
        await this.firstNameCAField.fill(profile.firstName);
        await this.lastNameCAField.fill(profile.lastName);
        await this.emailCAField.fill(this.submittedEmail);
        await this.phoneNumberCAField.fill(profile.primaryPhone);
        await this.countryCAField.selectOption(profile.country);
        await this.addressCAField.fill(profile.address);
        await this.postalCodeCAField.fill(profile.postalCode);
        await this.resumeTextAField.fill(profile.resumeFreeText);
        await this.originalSourceeCAField.selectOption({ label: 'Employee Referral' });
        await this.referrerFirstNameField.fill(profile.referrerFirstName);
        await this.referrerLastNameField.fill(profile.referrerLastName);
        await this.referrerEmailField.fill(profile.referrerEmail);
        await this.configuredFormUploadCV();
        await this.applicationFormNextButton.click();
        await this.page.waitForLoadState('load');
        await this.configuredSubmitButton.click();
        // waitForLoadState('networkidle') here was fragile — it can hang
        // indefinitely on any background polling/analytics request instead
        // of reflecting the submission actually completing (live-verified
        // 2026-09-25: reproduced a 60s hang on this exact wait on firefox).
        // Every caller of these submit methods immediately checks
        // successMessage anyway, so wait for that directly instead.
        await this.successMessage.waitFor({ state: 'visible' });
    }

    // [C898] Fee Agency Quick Apply - Allow Duplicate Candidates
    // resourceId is the ATS resource_id for "Playwright Fee Agency"
    // (playwright@rival-hr-qa.com), found via Administration > Fee
    // Agencies (live-verified 2026-08-27); same style of environment-
    // specific magic value as feeAgencyUrl in application-fixture.js.
    async goToFeeAgencyEditPage(resourceId) {
        const atsBaseUrl = process.env.ATS_BASE_URL || 'https://playwrightqa-openhire.silkroad-eng.com';
        await this.page.goto(`${atsBaseUrl}/?fuseaction=resources.editfee&resource_id=${resourceId}`);
        await this.page.waitForLoadState('load');
    }

    // [5543] [5544] [5551] [C5588] Configured Apply - Resume Text
    // Conversion / File Format: each submission in the format loop uses
    // a distinct timestamped email, so getTableRowCount() (which only
    // checks this.submittedEmail, i.e. the LAST submission) can't verify
    // that all 8 format submissions landed in ATS. This searches by one
    // specific email so each of the 8 can be verified individually,
    // without relying on a total-row-count assertion that would be
    // corrupted by other tests' same-named "CX First"/"CX Last"
    // candidates when run alongside them.
    // waitForLoadState('networkidle') after "Apply Filters" was the same
    // unbounded wait the submit methods above already dropped. The Candidate
    // Pool page keeps background requests going, so networkidle can burn the
    // remaining test budget and then surface as a timeout on whichever locator
    // the clock happened to land on — which is why CI failures here looked
    // scattered across unrelated locators (run 36387185046, 2026-09-28: a
    // "element is not stable" timeout on this very Apply Filters click, after
    // the apply half of the test had already spent most of the 60s).
    // Waiting for the results row instead is bounded and deterministic, and
    // falling through on timeout keeps candidateExistsForEmail() able to
    // return false for a candidate that genuinely is not there.
    async waitForCandidatePoolResults(timeout = 15000) {
        await this.page
            .locator('#bulkActionItemResultsTable tbody tr')
            .first()
            .waitFor({ state: 'visible', timeout })
            .catch(() => {});
    }

    async candidateExistsForEmail(email) {
        await this.editSearchButtonLocator.click();
        await this.page.locator('#emailAddress').fill(email);
        await this.page.getByRole('button', { name: 'Apply Filters' }).click();
        await this.waitForCandidatePoolResults();

        const rows = this.page.locator('#bulkActionItemResultsTable tbody tr');
        const count = await rows.count();
        return count > 0;
    }

    async searchAppliedCandidate() {
        await this.editSearchButtonLocator.click();
        await this.page.locator('#emailAddress').fill(this.submittedEmail);
        await this.page.getByRole('button', { name: 'Apply Filters' }).click();
        await this.waitForCandidatePoolResults();
    }

    async searchCandidateAndOpenCRP() {
        await this.editSearchButtonLocator.click();
        await this.page.locator('#emailAddress').fill(this.submittedEmail);
        await this.page.getByRole('button', { name: 'Apply Filters' }).click();
        await this.waitForCandidatePoolResults();
        await this.page.locator('table:has-text("Candidate") td a').first().click();
        await this.page.waitForLoadState('load');
    }

    // CRP header contact block — the candidate's full name renders as a
    // heading <p>, and the email as a mailto: link. Used to confirm the
    // submitted applicant landed in ATS with the expected details.
    crpCandidateName(firstName, lastName) {
        return this.page.getByText(`${firstName} ${lastName}`, { exact: true });
    }

    // Substring variant of crpCandidateName. When a prefix / middle name /
    // suffix were also submitted (the All Fields flows), the CRP header
    // renders the whole name in a single node, e.g.
    // "2 CX First Middle CX Last Jr." — so an exact "First Last" match
    // misses. This matches any heading node that contains the first name
    // followed by the last name. Live-verified 2026-09-14.
    crpCandidateFullName(firstName, lastName) {
        return this.page
            .getByText(new RegExp(`${firstName}\\b.*\\b${lastName}`))
            .first();
    }

    crpCandidateEmail() {
        // The email link href is mailto:<submittedEmail>.
        return this.page.locator(`a[href="mailto:${this.submittedEmail}"]`);
    }

    // Opens the CRP "Summary" tab where the Details / Education & Skills /
    // Availability / Location / Custom Fields sections render.
    async openCrpSummaryTab() {
        await this.page.locator('#tab-summaryTab').click();
        await this.page.locator('#tabpanel-summaryTab').waitFor({ state: 'visible', timeout: 15000 });
    }

    // Returns the value cell for a Summary-tab field, located by its label
    // text within the same form row. Works for the Details / Education /
    // Availability / Location sections (label in .ui-form-label, value in
    // the sibling .ui-formfield). Use with expect(...).toHaveText(value).
    crpSummaryFieldValue(label) {
        return this.page
            .locator('#tabpanel-summaryTab .ui-form-item', { has: this.page.locator('.ui-form-label label', { hasText: label }) })
            .locator('.ui-formfield');
    }

    // Section headings on the Summary tab (Details, Education / Skills,
    // Availability, Location, Custom Fields).
    crpSummarySectionHeading(name) {
        return this.page.locator('#tabpanel-summaryTab .ui-form-heading h3', { hasText: name });
    }

    // Opens the CRP "Evaluations" tab, where the candidate's submitted
    // custom question (CQE) answers render. The applicant's answers are
    // shown in the "Job Related (Applicant or Fee Agency)" fieldset
    // (controlarea=2) as "<p>Answer: VALUE</p>" beneath each question's
    // label. Live-verified 2026-09-14.
    async openCrpEvaluationsTab() {
        await this.page.locator('#tab-evaluationsTab').click();
        await this.page.locator('#tabpanel-evaluationsTab').waitFor({ state: 'visible', timeout: 15000 });
    }

    // Returns the "Answer" paragraph for a given CQE question within the
    // "Job Related (Applicant or Fee Agency)" fieldset — the section that
    // reflects what the applicant actually submitted on the apply form.
    // Scopes to #dspJobQuestionContainer so it doesn't collide with the
    // identically-labelled Recruiter Screening / Interview fieldsets.
    // Use with expect(...).toHaveText('Answer: VALUE').
    crpEvaluationAnswer(questionLabel) {
        return this.page
            .locator('#dspJobQuestionContainer .ui-form-item-vertical', {
                has: this.page.locator('label', { hasText: questionLabel })
            })
            .locator('p', { hasText: 'Answer:' });
    }

    // Opens the CRP "Take Action" -> "EEO Profile" form (#eeocins), where the
    // candidate's submitted EEO/OFCCP answers are pre-selected. Same-page
    // modal (matches ATS CandidateResumeProfilePage.eeoProfile()'s flow).
    async openEeoProfile() {
        await this.page.getByRole('button', { name: 'Take Action' }).click();
        await this.page.getByRole('menuitem', { name: 'EEO Profile' }).click();
        await this.page.locator('#eeocins').waitFor({ state: 'visible', timeout: 15000 });
    }

    // Dismisses the EEO Profile modal (#eeocins) without saving, so
    // subsequent actions (e.g. opening the Edit Candidate popup) aren't
    // blocked by the open modal.
    async closeEeoProfile() {
        await this.page.keyboard.press('Escape');
        await this.page.locator('#eeocins').waitFor({ state: 'hidden', timeout: 15000 });
    }

    // EEO Profile form field locators (#eeocins). Gender/veteran(pre-offer)/
    // disability are radios (assert .toBeChecked()); race is a <select>
    // (assert .toHaveValue()).
    get eeoGenderMaleRadio() { return this.page.locator('#sex_M'); }
    get eeoGenderFemaleRadio() { return this.page.locator('#sex_F'); }
    get eeoRaceSelect() { return this.page.locator('#racial_group'); }
    get eeoVeteranIdentifyRadio() { return this.page.locator('#ofccpvetstatus_MoreThanOneVeteran'); }
    get eeoVeteranNotRadio() { return this.page.locator('#ofccpvetstatus_NotAVeteran'); }
    get eeoDisabilityYesRadio() { return this.page.locator('#ofccpdisability2023_Disabled'); }
    get eeoDisabilityNoRadio() { return this.page.locator('#ofccpdisability2023_NotDisabled'); }

    // Clicks the CRP "Edit Candidate" icon, which opens the Modify Resume
    // Profile form in a popup window. Returns the popup Page so the caller
    // can assert on its fields. Closes nothing — caller may close it.
    async openEditCandidatePopup() {
        const context = this.page.context();
        const [popup] = await Promise.all([
            context.waitForEvent('page'),
            this.page.locator('#edit-candidate').click(),
        ]);
        await popup.waitForLoadState('domcontentloaded');
        await popup.locator('#EditRes').waitFor({ state: 'visible', timeout: 15000 });
        return popup;
    }

    // Compares the resume file linked in the CRP attachments table against
    // the local file that was uploaded, by SHA-256 hash of their bytes.
    // Downloads in-memory via the page's authenticated request context (no
    // file is written to disk, on the local machine or the CI runner).
    async uploadedResumeMatchesLocal(localFilename = 'resume.pdf') {
        // The attachments table is inside the "Attachments" tab — open it
        // first so the resume link is rendered.
        await this.page.locator('#tab-attachmentsTab').click();
        const link = this.page.locator('table.rival-table a[href*="resume.displayfile"]').first();
        await link.waitFor({ state: 'visible', timeout: 15000 });
        const href = await link.getAttribute('href');
        const absoluteUrl = new URL(href, this.page.url()).toString();

        const response = await this.page.request.get(absoluteUrl);
        const downloadedBuffer = await response.body();

        const localPath = this.path.join(__dirname, '../../test-data/files/' + localFilename);
        const localBuffer = this.fs.readFileSync(localPath);

        const hash = (buf) => this.crypto.createHash('sha256').update(buf).digest('hex');
        return hash(downloadedBuffer) === hash(localBuffer);
    }

    async cleanupCandidate(firstName, lastName) {
        await this.candidateNavLocator.click({ timeout: 10000 });
        await this.candidatePoolNavLocator.click({ timeout: 10000 });
        await this.page.waitForLoadState('load');
        await this.editSearchButtonLocator.click({ timeout: 10000 });
        await this.page.locator('#fullName').fill(firstName + ' ' + lastName);
        await this.applyFiltersButton.click({ timeout: 10000 });
        await this.page.waitForLoadState('load');

        const resultRows = this.page.locator('#bulkActionItemResultsTable tbody tr');
        const hasResults = await resultRows.count().catch(() => 0);
        if (hasResults === 0) {
            return;
        }

        await this.bulkDeleteSearchResults();
    }

    // The bulk-delete UI (check-all -> Take Action -> Delete Selected ->
    // modal Save) intermittently lags rendering between steps in this
    // environment, so #checkAllItems/#bulkActionModalSave aren't always
    // immediately actionable. Waits for each control to actually be
    // visible before interacting, and retries the whole flow once so a
    // one-off timing hiccup doesn't burn the full afterAll hook timeout.
    async bulkDeleteSearchResults(attempts = 2) {
        for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
                await this.checkAllItemsCheckboxLocator.waitFor({ state: 'visible', timeout: 10000 });
                await this.checkAllItemsCheckboxLocator.check({ timeout: 10000 });
                await this.takeActionButtonLocator.click({ timeout: 10000 });
                await this.deleteSelectedButtonLocator.click({ timeout: 10000 });
                await this.bulkActionModalSaveButtonLocator.waitFor({ state: 'visible', timeout: 10000 });
                await this.bulkActionModalSaveButtonLocator.click({ timeout: 10000 });
                await this.page.waitForLoadState('networkidle');
                return;
            } catch (error) {
                if (attempt === attempts) throw error;
                await this.page.waitForTimeout(1000);
            }
        }
    }

    // Defensive/bounded at every step, same root cause as cleanupCandidate()
    // above: this unconditionally assumed there was something in the
    // Recycle Bin to purge. When the bin is empty (the common case — most
    // tests either don't create a candidate or already deleted theirs via
    // cleanupCandidate()), the ellipsis menu/purge link/confirm modal never
    // renders, and the action hung until Playwright's own hook-timeout
    // mechanism force-cancelled it — which happens *before* a try/catch
    // around the call can see it, so wrapping the caller alone doesn't
    // help. Each step here now has a short explicit timeout and bails out
    // early (nothing to purge) instead of hanging for the full 60s budget.
    async purge(){
        await this.recycleBinNavLocator.click();
        await this.page.waitForLoadState('networkidle');

        const hasEllipsis = await this.recycleBinEllipsis.isVisible({ timeout: 5000 }).catch(() => false);
        if (!hasEllipsis) return;
        await this.recycleBinEllipsis.click({ timeout: 5000 });

        const hasPurgeLink = await this.purgeLink.isVisible({ timeout: 5000 }).catch(() => false);
        if (!hasPurgeLink) return;
        await this.purgeLink.click({ timeout: 5000 });

        const hasModalButton = await this.purgeModalButton.isVisible({ timeout: 5000 }).catch(() => false);
        if (!hasModalButton) return;
        await this.purgeModalButton.click({ timeout: 5000 });
    }

}

module.exports = ApplicationFormPage;