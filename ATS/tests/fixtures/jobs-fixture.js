const { test: baseFixture, expect } = require('./base-fixture');
const CreateJobPostingPage = require('../../pages/jobs/create-job-posting.page');
const JobTemplatesPage = require('../../pages/jobs/job-templates.page');
const JobsBulkActionPage = require('../../pages/jobs/jobs-bulk-action.page');
const JobsTrackingPage = require('../../pages/jobs/jobs-tracking.page');
const ManageRequisitionsPage = require('../../pages/jobs/manage-requisition.page');
const JobsEllipsisActionsPage = require('../../pages/jobs/jobs-ellipsis-actions.page');
const JobDetailsPage = require('../../pages/jobs/job-details.page');
const QuickSearchJobsPage = require('../../pages/jobs/quick-search-jobs.page');
const RosiSkillsMatchManageSkillsModalPage = require('../../pages/jobs/rosi-skills-match-manage-skills-modal.page');

// Test data
const createJobPostingData = require('../../test-data/jobs/create-job-posting.json');
const jobTemplatesData = require('../../test-data/jobs/job-templates.json');
const jobsBulkActionData = require('../../test-data/jobs/jobs-bulk-action.json');
const jobsSearchFiltersData = require('../../test-data/jobs/jobs-search-filters.json');
const manageRequisitionsData = require('../../test-data/jobs/manage-requisitions.json');
const jobsEllipsisActionsData = require('../../test-data/jobs/jobs-ellipsis-actions.json');
const jobDetailsData = require('../../test-data/jobs/job-details.json');
const quickSearchJobsData = require('../../test-data/jobs/quick-search-jobs.json');
const rosiSkillsMatchManageSkillsModalData = require('../../test-data/jobs/rosi-skills-match-manage-skills-modal.json');
const rosiSkillsMatchData = require('../../test-data/jobs/rosi-skills-match.json');
const jobDetailsDashboardTilesData = require('../../test-data/jobs/job-details-dashboard-tiles.json');
const sourcePassiveCandidatesButtonVisibilityData = require('../../test-data/jobs/source-passive-candidates-button-visibility.json');
const jobPostingsColumnLinksData = require('../../test-data/jobs/job-postings-column-links.json');
const rosiCandidateMatchWidgetData = require('../../test-data/jobs/rosi-candidate-match-widget.json');

/** @type {import('@playwright/test').TestType<JobsFixture, {}>} */
const test = baseFixture.extend({
    // Page Fixtures
    createJobPostingPage: async ({ basePage }, use) => {
        const page = new CreateJobPostingPage(basePage.page);
        await page.navigateToJobPostingPage();
        await use(page);
    },

    jobTemplatesPage: async ({ basePage }, use) => {
        const page = new JobTemplatesPage(basePage.page);
        await page.navigateToJobsTemplatePage();
        await use(page);
    },

    jobsBulkActionPage: async ({ basePage }, use) => {
        const page = new JobsBulkActionPage(basePage.page);
        await page.navigateToJobTrackingPage();
        await use(page);
    },

    jobsTrackingPage: async ({ basePage }, use) => {
        const page = new JobsTrackingPage(basePage.page);
        await page.navigateToJobTrackingPage();
        await use(page);
    },

    manageRequisitionsPage: async ({ basePage }, use) => {
        const page = new ManageRequisitionsPage(basePage.page);
        await page.navigateToManageRequisitionsPage();
        await use(page);
    },

    jobsEllipsisActionsPage: async ({ basePage }, use) => {
        const page = new JobsEllipsisActionsPage(basePage.page);
        await page.navigateToJobTrackingPage();
        await use(page);
    },

    jobDetailsPage: async ({ basePage }, use) => {
        const page = new JobDetailsPage(basePage.page);
        await page.navigateToJobDetailsPage();
        await use(page);
    },

    quickSearchJobsPage: async ({ basePage }, use) => {
        const page = new QuickSearchJobsPage(basePage.page);
        await use(page);
    },

    rosiSkillsMatchManageSkillsModalPage: async ({ basePage }, use) => {
        const page = new RosiSkillsMatchManageSkillsModalPage(basePage.page);
        await page.navigateToJobTrackingPage();
        await use(page);
    },

    // Data Fixtures — converted to value fixtures
    createJobPostingData: createJobPostingData,
    jobTemplatesData: jobTemplatesData,
    jobsBulkActionData: jobsBulkActionData,
    jobsSearchFiltersData: jobsSearchFiltersData,
    manageRequisitionsData: manageRequisitionsData,
    jobsEllipsisActionsData: jobsEllipsisActionsData,
    jobDetailsData: jobDetailsData,
    quickSearchJobsData: quickSearchJobsData,
    rosiSkillsMatchManageSkillsModalData: rosiSkillsMatchManageSkillsModalData,
    rosiSkillsMatchData: rosiSkillsMatchData,
    jobDetailsDashboardTilesData: jobDetailsDashboardTilesData,
    sourcePassiveCandidatesButtonVisibilityData: sourcePassiveCandidatesButtonVisibilityData,
    jobPostingsColumnLinksData: jobPostingsColumnLinksData,
    rosiCandidateMatchWidgetData: rosiCandidateMatchWidgetData,
});

module.exports = { test, expect };
