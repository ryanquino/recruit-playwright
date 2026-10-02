const { test: baseFixture, expect } = require('./base-fixture');
const AAPJobGroupPage = require('../../pages/administration/aap-job-group.page');
const BusinessUnitsPage = require('../../pages/administration/business-units.page');
const DepartmentsPage = require('../../pages/administration/departments.page');
const EmailTemplatesPage = require('../../pages/administration/email-templates.page');
const EvaluationQuestionsPage = require('../../pages/administration/evaluation-questions.page');
const FeeAgenciesPage = require('../../pages/administration/fee-agencies.page');
const ManageResourcesPage = require('../../pages/administration/manage-resources.page');
const MyAccountPage = require('../../pages/administration/my-account.page');
const TaskListsPage = require('../../pages/administration/task-lists.page');
const UserAccountsPage = require('../../pages/administration/user-accounts.page');
const OfferRejectionLettersPage = require('../../pages/administration/offer-rejection-letters.page');
const CompanyLocationsPage = require('../../pages/administration/company-locations.page');
const SettingsPage = require('../../pages/administration/settings.page');


// Test data
const emailTemplatesData = require('../../test-data/administration/email-templates.json');
const businessUnitsData = require('../../test-data/administration/business-units.json');
const departmentsData = require('../../test-data/administration/departments.json');
const evaluationQuestionsData = require('../../test-data/administration/evaluation-questions.json');
const feeAgenciesData = require('../../test-data/administration/fee-agencies.json');
const manageResourcesData = require('../../test-data/administration/manage-resources.json');
const myAccountData = require('../../test-data/administration/my-account.json');
const taskListsData = require('../../test-data/administration/task-lists.json');
const userAccountsData = require('../../test-data/administration/user_accounts.json');
const offerRejectionLettersData = require('../../test-data/administration/offer-rejection-letters.json');
const companyLocationsData = require('../../test-data/administration/company-locations.json');
const settingsData = require('../../test-data/administration/settings.json');


/** @type {import('@playwright/test').TestType<JobsFixture, {}>} */
const test = baseFixture.extend({
    // Page Fixtures
    aapJobGroupPage: async ({ basePage }, use) => {
        const page = new AAPJobGroupPage(basePage.page);
        await page.navigateToAAPJobGroup();
        await use(page);
    },

    businessUnitsPage: async ({ basePage }, use) => {
        const page = new BusinessUnitsPage(basePage.page);
        await page.navigateToBusinessUnitsPage();
        await use(page);
    },

    departmentsPage: async ({ basePage }, use) => {
        const page = new DepartmentsPage(basePage.page);
        await page.navigateToDepartments();
        await use(page);
    },

    emailTemplatesPage: async ({ basePage }, use) => {
        const page = new EmailTemplatesPage(basePage.page);
        await page.navigateToEmailTemplatesPage();
        await use(page);
    },

    evaluationQuestionsPage: async ({ basePage }, use) => {
        const page = new EvaluationQuestionsPage(basePage.page);
        await page.navigateToEvaluationQuestions();
        await use(page);
    },

    feeAgenciesPage: async ({ basePage }, use) => {
        const page = new FeeAgenciesPage(basePage.page);
        await page.navigateToFeeAgenciesPage();
        await use(page);
    },

    manageResourcesPage: async ({ basePage }, use) => {
        const page = new ManageResourcesPage(basePage.page);
        await page.navigateToManageResourcesPage();
        await use(page);
    },

    myAccountPage: async ({ basePage }, use) => {
        const page = new MyAccountPage(basePage.page);
        await page.navigateToMyAccountpage();
        await use(page);
    },

    taskListsPage: async ({ basePage }, use) => {
        const page = new TaskListsPage(basePage.page);
        await page.navigateToTaskListsPage();
        await use(page);
    },

    userAccountsPage: async ({ basePage }, use) => {
        const page = new UserAccountsPage(basePage.page);
        await page.navigateToUserAccounts();
        await use(page);
    },

    offerRejectionLettersPage: async ({ basePage }, use) => {
        const page = new OfferRejectionLettersPage(basePage.page);
        await page.navigateToOfferRejectionLettersPage();
        await use(page);
    },

    companyLocationsPage: async ({ basePage }, use) => {
        const page = new CompanyLocationsPage(basePage.page);
        await page.navigateToCompanyLocationsPage();
        await use(page);
    },

    settingsPage: async ({ basePage }, use) => {
        const page = new SettingsPage(basePage.page);
        await page.navigateToSettingsPage();
        await use(page);
    },

    // Data Fixtures — converted to value fixtures
    emailTemplatesData: emailTemplatesData,
    businessUnitsData: businessUnitsData,
    departmentsData: departmentsData,
    evaluationQuestionsData: evaluationQuestionsData,
    feeAgenciesData: feeAgenciesData,
    manageResourcesData: manageResourcesData,
    myAccountData: myAccountData,
    taskListsData: taskListsData,
    userAccountsData: userAccountsData,
    offerRejectionLettersData: offerRejectionLettersData,
    companyLocationsData: companyLocationsData,
    settingsData: settingsData,
});

module.exports = { test, expect };
