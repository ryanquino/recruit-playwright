// @ts-check
const { test, expect } = require('../fixtures/administration-fixture.js');

test.describe('Settings', () => {
    test('[C657] Candidate Resume Profile Setting', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateCandidateResumeProfileSetting('No');
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.updateCandidateResumeProfileSetting('Yes');
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C658] Candidate Upload Field Controls', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateCandidateUploadFieldControlSetting(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.navigateToUpload();
        await expect(settingsPage.getField('#country')).toHaveAttribute('required');
        await expect(settingsPage.getField('#Address')).toHaveAttribute('required');
        await expect(settingsPage.getField('#state')).toHaveAttribute('required');
        await expect(settingsPage.getField('#Zip')).toHaveAttribute('required');
        await expect(settingsPage.getField('#Email')).toHaveAttribute('required');
        await expect(settingsPage.getField('#Phone')).toHaveAttribute('required');
        await expect(settingsPage.getField('#Skills')).toHaveAttribute('required');
        await expect(settingsPage.getField('#OriginalSource_input')).toHaveAttribute('required');
        await settingsPage.navigateToSettingsPage();
        await settingsPage.updateCandidateUploadFieldControlSetting(false);
    });

    test('[C659] Display Job Fields', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateDisplayJobFieldsSetting(false);
        await settingsPage.navigateToCreateJobPosting();
        const displayedFields = settingsPage.getDisplayedJobFields();
        
        // Loop through each job field locator to verify all fields are hidden when the setting is disabled
        for (const locator of displayedFields) {
            await expect(locator).toBeHidden();
        }
        await settingsPage.navigateToSettingsPage();
        await settingsPage.updateDisplayJobFieldsSetting(true);
    });

    test('[C660] Display Requisition Fields', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateDisplayRequisitionFields(false);
        await settingsPage.navigateToCreateRequisitionPage();
        const displayedFields = settingsPage.getDisplayedRequisitionFields();

        // Loop through each requisition field locator to verify all fields are hidden when the setting is disabled
        for (const locator of displayedFields) {
            await expect(locator).toBeHidden();
        }
        await settingsPage.navigateToSettingsPage();
        await settingsPage.updateDisplayRequisitionFields(true);
    });

    test('[C662] Duplicate Candidate Search', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateDuplicateCandidateSearchSetting(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.updateDuplicateCandidateSearchSetting(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C667] Lock Offers', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateLockOffersSetting(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.updateLockOffersSetting(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C668] Lock Requisitions', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateLockRequisitionsSetting(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.updateLockRequisitionsSetting(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C669] Resume Search', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateResumeSearchSetting(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.updateResumeSearchSetting(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C671] Tracking Code Management', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateTrackingCodeManagementSetting(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.updateTrackingCodeManagementSetting(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C670] Review Requests', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateReviewRequestsSetting(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.updateReviewRequestsSetting(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C763] Disposition For Hired Candidates', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateDispositionForHiredCandidatesSetting(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.updateDispositionForHiredCandidatesSetting(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C764] Disposition Candidate As Ineligible For Hire/Rehire', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateDispositionIneligibleForHireSetting(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.updateDispositionIneligibleForHireSetting(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C13309] Icon for Veteran Candidates', async ({ settingsPage, settingsData }) => {
        await settingsPage.enableVeteranIcon(true);
        await settingsPage.searchCandidate();
        const isActive = await settingsPage.verifyVetranIconIsActive(settingsData.veteran);
        await expect(isActive).toBe(true);
        await settingsPage.navigateToSettingsPage();
        await settingsPage.enableVeteranIcon(false);
        await settingsPage.searchCandidate();
        const isVisible = await settingsPage.verifyVetranIconIsVisible(settingsData.veteran);
        await expect(isVisible).toBe(false);
    });

    test('[C134158] Icon to Indicate Candidate has Applied to Multiple Jobs', async ({ settingsPage, settingsData }) => {
        await settingsPage.enableMultipleJobsIcon(true);
        await settingsPage.searchCandidate();
        const isInactive = await settingsPage.verifyMultipleJobsIconIsInactive(settingsData.candidate);
        await expect(isInactive).toBe(true);
        await settingsPage.navigateToSettingsPage();
        await settingsPage.enableMultipleJobsIcon(false);
        await settingsPage.searchCandidate();
        const isVisible = await settingsPage.verifyMultipleJobsIconIsVisible(settingsData.candidate);
        await expect(isVisible).toBe(false);
    });

    test('[C662] EEO Info', async ({ settingsPage, settingsData }) => {
        await settingsPage.enableNonBinaryGenderOption(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
        const isVisible = await settingsPage.isNonBinaryOptionVisibleOnCRP();
        await expect(isVisible).toBe(true);
        await settingsPage.navigateToSettingsPage();
        await settingsPage.enableNonBinaryGenderOption(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
        const isHidden = await settingsPage.isNonBinaryOptionVisibleOnCRP();
        await expect(isHidden).toBe(false);
    });

    test('[C664] Hiring Stages', async ({ settingsPage, settingsData }) => {
        await settingsPage.enableHiringStages(1);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.searchCandidate();
        const isDisabled = await settingsPage.verifyHiringStageOnCRP();
        await expect(isDisabled).toBe(true);
        await settingsPage.navigateToSettingsPage();
        await settingsPage.enableHiringStages(0);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.searchCandidate();
        const isEnabled = await settingsPage.verifyHiringStageOnCRP();
        await expect(isEnabled).toBe(false);
    });

    test('[C666] Locked Job Template Fields', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateLockedJobTemplateFields(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.navigateToCreateJobPostingWithTemplate();
        const lockedFields = settingsPage.getLockedJobTemplateFields();
        const lockedRteFields = settingsPage.getLockedJobTemplateRteFields();

        // Loop through each locked field locator to verify all fields are disabled when the setting is enabled
        for (const locator of lockedFields) {
            await expect(locator).toBeDisabled();
        }
        // Loop through each locked RTE field to verify the disabled text is visible
        for (const locator of lockedRteFields) {
            await expect(locator).toBeVisible();
        }
        await settingsPage.navigateToSettingsPage();
        await settingsPage.updateLockedJobTemplateFields(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });
});

test.describe('Settings - Career Sites', () => {
    test('[C652] Assessments', async ({ settingsPage, settingsData }) => {
        await settingsPage.enableRecruiterInitiatedAssessment(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.enableRecruiterInitiatedAssessment(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C653] Cookie Policy Acknowledgement for Career Sites', async ({ settingsPage, settingsData }) => {
        await settingsPage.enableCookiePolicy(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.enableCookiePolicy(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });
  
});

test.describe('Settings - General', () => {
    test('[C649] Email For Outages And Upgrades', async ({ settingsPage, settingsData }) => {
        await settingsPage.addEmailForOutageAndUpgrades(settingsData.emailForOutagesAndUpgrades);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C650] Email Settings', async ({ settingsPage, settingsData }) => {
        await settingsPage.enableEmailSettings();
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C651] eForm Notification Email', async ({ settingsPage, settingsData }) => {
        await settingsPage.addEFormNotificationEmail();
        await expect(settingsPage.toastrMessage).toBeVisible();
    });
});


test.describe('Settings - ROSI Features', () => {
    test('[C276268] ROSI Job Description', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateRosiJobDescriptionsSetting(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.updateRosiJobDescriptionsSetting(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C276269] ROSI Copilot', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateRosiCopilotSetting(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.updateRosiCopilotSetting(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C276271] ROSI Outreach', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateRosiOutreachSetting(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.updateRosiOutreachSetting(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C276272] ROSI Email Template Refinement', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateRosiEmailTemplateRefinementSetting(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.updateRosiEmailTemplateRefinementSetting(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });

    test('[C276273] ROSI Skills Match', async ({ settingsPage, settingsData }) => {
        await settingsPage.updateRosiSkillsMatchSetting(false);
        await expect(settingsPage.toastrMessage).toBeVisible();
        await settingsPage.updateRosiSkillsMatchSetting(true);
        await expect(settingsPage.toastrMessage).toBeVisible();
    });
  
});
