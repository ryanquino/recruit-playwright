const { test: baseFixture, expect } = require('./base-fixture');
const UploadCandidatesPage = require('../../pages/candidates/upload-candidates.page');
const CandidatesPoolPage = require('../../pages/candidates/candidates_pool.page');
const CandidatesBulkActionsPage = require('../../pages/candidates/candidates-bulk-actions.page');
const SourcePassiveCandidatesPage = require('../../pages/candidates/source_passive_candidates.page');
const EmployeeReferralsPage = require('../../pages/candidates/employee-referrals.page');
const RecycleBinPage = require('../../pages/candidates/recycle-bin.page');
const CandidateResumeProfilePage = require('../../pages/candidates/candidate-resume-profile.page');
const CandidatesEllipsisActionsPage = require('../../pages/candidates/candidates-ellipsis-actions.page');

// Test data
const candidateData = require('../../test-data/candidates/candidate.json');
const candidateSearchFiltersData = require('../../test-data/candidates/candidate_search_filters.json');
const candidateBulkActionsData = require('../../test-data/candidates/candidates-bulk-action.json');
const sourcePassiveCandidateData = require('../../test-data/candidates/source_passive_candidates.json');
const candidatesEllipsisActionsData = require('../../test-data/candidates/candidates-ellipsis-actions.json');
const candidateResumeProfileData = require('../../test-data/candidates/candidate-resume-profile.json');

/** @type {import('@playwright/test').TestType<CandidatesFixtures, {}>} */
const test = baseFixture.extend({
    // Page Fixtures
    candidatesPage: async ({ basePage }, use) => {
        const page = new UploadCandidatesPage(basePage.page, candidateData);
        await page.goToUpload();
        await use(page);
    },

    candidatesPoolPage: async ({ basePage }, use) => {
        const page = new CandidatesPoolPage(basePage.page);
        await page.goToAdvancedSearchPage();
        await use(page);
    },

    candidatesBulkActionsPage: async ({ basePage }, use) => {
        const page = new CandidatesBulkActionsPage(basePage.page);
        await page.goToAdvancedSearchPage();
        await use(page);
    },

    sourcePassiveCandidatesPage: async ({ basePage }, use) => {
        const page = new SourcePassiveCandidatesPage(basePage.page);
        await page.goToSourcePassiveCandidatesPage();
        await use(page);
    },

    employeeReferralsPage: async ({ basePage }, use) => {
        const page = new EmployeeReferralsPage(basePage.page);
        await page.navigateToEmployeeReferrals();
        await use(page);
    },

    recycleBinPage: async ({ basePage }, use) => {
        const page = new RecycleBinPage(basePage.page);
        await page.navigateToRecycleBin();
        await use(page);
    },

    candidatesEllipsisActionsPage: async ({ basePage }, use) => {
        const page = new CandidatesEllipsisActionsPage(basePage.page);
        await page.goToAdvancedSearchPage();
        await use(page);
    },

    candidateResumeProfilePage: async ({ basePage }, use) => {
        const page = new CandidateResumeProfilePage(basePage.page);
        await page.navigateToCandidateProfile();
        await use(page);
    },

    // Data Fixtures — converted to value fixtures
    candidateData: candidateData,
    candidateSearchFiltersData: candidateSearchFiltersData,
    candidateBulkActionsData: candidateBulkActionsData,
    sourcePassiveCandidateData: sourcePassiveCandidateData,
    candidatesEllipsisActionsData: candidatesEllipsisActionsData,
    candidateResumeProfileData: candidateResumeProfileData,
});

module.exports = { test, expect };