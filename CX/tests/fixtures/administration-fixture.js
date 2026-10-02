const { test: base, expect } = require('@playwright/test');

// Page files go here
const CareerPortalApplicationFormPage = require('../../pages/administration/career-portal-application-form.page');
const CareerPortalJobDetailsPage = require('../../pages/administration/career-portal-job-details.page');
const CareerPortalJobListPage = require('../../pages/administration/career-portal-job-list.page');
const CareerPortalLanguagesPage = require('../../pages/administration/career-portal-languages.page');
const CareerPortalOpenSubmissionPage = require('../../pages/administration/career-portal-open-submission.page');
const FeeAgencyJobDetailsPage = require('../../pages/administration/fee-agency-job-details.page');

// Test data files go here
const careerPortalApplicationFormData = require('../../test-data/administration/career-portal-application-form.json');
const careerPortalJobDetailsData = require('../../test-data/administration/career-portal-job-details.json');
const careerPortalJobListData = require('../../test-data/administration/career-portal-job-list.json');
const careerPortalOpenSubmissionData = require('../../test-data/administration/career-portal-open-submission.json');
const feeAgencyJobDetailsData = require('../../test-data/administration/fee-agency-job-details.json');

/** @type {import('@playwright/test').TestType<any, any>} */
const test = base.extend({
    // Page Fixtures go here — this is the separate CX "Career Site" admin
    // app (playwrightqa/Admin), not the ATS backend, so it has its own
    // login rather than using cx-base-fixture's ATS-backed cxBasePage.
    careerPortalApplicationFormPage: async ({ page }, use) => {
        const applicationFormPage = new CareerPortalApplicationFormPage(page);
        await applicationFormPage.login();
        await applicationFormPage.goToApplicationFormPage(careerPortalApplicationFormData.portalId);
        await use(applicationFormPage);
    },

    // [C163]/[C167]-[C170] Manage Job Details Page
    // (/playwrightqa/admin/JobBoards/JobListings).
    careerPortalJobDetailsPage: async ({ page }, use) => {
        const jobDetailsPage = new CareerPortalJobDetailsPage(page);
        await jobDetailsPage.login();
        await jobDetailsPage.goToJobDetailsPage(careerPortalJobDetailsData.portalId);
        await use(jobDetailsPage);
    },

    // [C178]/[C179]/[C180]/[C181]/[C182]-[C189] Manage Job List — Rich Text
    // Field Options and Display Options
    // (/playwrightqa/admin/JobBoards/JobList).
    careerPortalJobListPage: async ({ page }, use) => {
        const jobListPage = new CareerPortalJobListPage(page);
        await jobListPage.login();
        await jobListPage.goToJobListPage(careerPortalJobListData.portalId);
        await use(jobListPage);
    },

    // [C805]-[C807]/[C836]-[C838] Manage Languages
    // (/playwrightqa/admin/JobBoards/Locales) — no fixed portalId since
    // callers toggle languages on more than one portal; call
    // goToLanguagesPage(portalId) explicitly.
    careerPortalLanguagesPage: async ({ page }, use) => {
        const languagesPage = new CareerPortalLanguagesPage(page);
        await languagesPage.login();
        await use(languagesPage);
    },

    // [C116]-[C118] Manage Open Submission Form
    // (/playwrightqa/admin/JobBoards/OpenSubmissionForms).
    careerPortalOpenSubmissionPage: async ({ page }, use) => {
        const openSubmissionPage = new CareerPortalOpenSubmissionPage(page);
        await openSubmissionPage.login();
        await openSubmissionPage.goToOpenSubmissionPage(careerPortalOpenSubmissionData.portalId);
        await use(openSubmissionPage);
    },

    // [C171]-[C176] Manage Fee Agency Job Details Page — same admin app,
    // same login, same CRUD panel mechanism as CareerPortalApplicationFormPage
    // (live-verified 2026-08-27: /playwrightqa/admin/FeeAgency/JobListings).
    feeAgencyJobDetailsPage: async ({ page }, use) => {
        const jobDetailsPage = new FeeAgencyJobDetailsPage(page);
        await jobDetailsPage.login();
        await jobDetailsPage.goToFeeAgencyJobDetailsPage(feeAgencyJobDetailsData.portalId);
        await use(jobDetailsPage);
    },

    // Data Fixtures — converted to value fixtures
    careerPortalApplicationFormData: careerPortalApplicationFormData,
    careerPortalJobDetailsData: careerPortalJobDetailsData,
    careerPortalJobListData: careerPortalJobListData,
    careerPortalOpenSubmissionData: careerPortalOpenSubmissionData,
    feeAgencyJobDetailsData: feeAgencyJobDetailsData
});

module.exports = { test, expect };
