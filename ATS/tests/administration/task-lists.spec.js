// @ts-check
const { test, expect } = require('../fixtures/administration-fixture.js');
const ManageRequisitionsPage = require('../../pages/jobs/manage-requisition.page');
const CandidatesBulkActionsPage = require('../../pages/candidates/candidates-bulk-actions.page.js');
const RecycleBinPage = require('../../pages/candidates/recycle-bin.page.js');
const requisitionsData = require('../../test-data/jobs/manage-requisitions.json');

test.describe.serial('Cancel and Complete Resume Review', () => {
    /** @type {string | null} */
    let prospectName = null;
    
    test.afterEach(async ({ taskListsPage }) => {
        if (!prospectName) return;

        const candidatesBulkActionsPage = new CandidatesBulkActionsPage(taskListsPage.page);
        await candidatesBulkActionsPage.goToAdvancedSearchPage();
        await candidatesBulkActionsPage.searchCandidate(prospectName);
        await candidatesBulkActionsPage.deleteSelected();

        const recycleBinPage = new RecycleBinPage(taskListsPage.page);
        await recycleBinPage.navigateToRecycleBin();
        await recycleBinPage.purge();

        prospectName = null;
    });

    test('[C861] Resume Review - Cancel Complete Review', async ({ taskListsPage, taskListsData }) => {
        const candidatesBulkActionsPage = new CandidatesBulkActionsPage(taskListsPage.page);
        await candidatesBulkActionsPage.goToAdvancedSearchPage();
        await candidatesBulkActionsPage.searchCandidate(taskListsData.candidateName);
        await candidatesBulkActionsPage.reviewReviewForwardResume(taskListsData.jobTitle);
        await taskListsPage.navigateToTaskListsPage();
        await taskListsPage.cancelEvaluation(taskListsData.comment);
        await expect(taskListsPage.resumeContainerLocator).toHaveCount(0);
    })

    test('[C932] Resume Review - Complete Review', async ({ taskListsPage, taskListsData }) => {
        const candidatesBulkActionsPage = new CandidatesBulkActionsPage(taskListsPage.page);
        await candidatesBulkActionsPage.goToAdvancedSearchPage();
        await candidatesBulkActionsPage.searchCandidate(taskListsData.candidateName);
        await candidatesBulkActionsPage.reviewReviewForwardResume(taskListsData.jobTitle);
        await taskListsPage.navigateToTaskListsPage();
        await taskListsPage.completeEvaluation(taskListsData.comment);
        await expect(taskListsPage.resumeContainerLocator).toHaveCount(0);
    })

    test('[C858] Task Tile functionality test - Verify Tile functionality', async ({ taskListsPage, taskListsData }) => {
        const candidatesBulkActionsPage = new CandidatesBulkActionsPage(taskListsPage.page);
        await candidatesBulkActionsPage.goToAdvancedSearchPage();
        await candidatesBulkActionsPage.searchCandidate(taskListsData.candidateName);
        await candidatesBulkActionsPage.reviewReviewForwardResume(taskListsData.jobTitle);
        await taskListsPage.navigateToTaskListsPage();
        await taskListsPage.completeReviewOnCRP(taskListsData.comment);
        await expect(taskListsPage.resumeContainerLocator).toHaveCount(0);
    })

    test('[C870] Requisition Approvals - Verify Tile Information', async ({ taskListsPage }) => {
        const manageRequisitionsPage = new ManageRequisitionsPage(taskListsPage.page);
        await manageRequisitionsPage.navigateToManageRequisitionsPage();
        await manageRequisitionsPage.createRequisition(requisitionsData, false);
        await taskListsPage.navigateToTaskListsPage();  
        await expect(await taskListsPage.getRequisitionDetailsHeading(requisitionsData.internalJobTitle)).toBeVisible();
    })

    test('[C922] Requisition Approvals - Cancel Requisition Approvals', async ({ taskListsPage }) => {
        await taskListsPage.cancelApproveRequisition();
        await expect(await taskListsPage.requisitionCardHeading).toBeVisible();
    })

    test('[C926] Requisition Rejections - Confirm Requisition Rejection', async ({ taskListsPage, taskListsData }) => {
        const manageRequisitionsPage = new ManageRequisitionsPage(taskListsPage.page);
        await taskListsPage.rejectRequisition(taskListsData.comment);
        await manageRequisitionsPage.navigateToManageRequisitionsPage();
        await expect(taskListsPage.firstApprovalStatusColor).toBeVisible();
    })
    
    test('[C69849] Delete requisition', async ({ taskListsPage, taskListsData }) => {
        const manageRequisitionsPage = new ManageRequisitionsPage(taskListsPage.page);
        await manageRequisitionsPage.navigateToManageRequisitionsPage();
        await taskListsPage.deleteRejectedRequisition();
        await expect(taskListsPage.requisitionsTableFirstRow).toHaveCount(0);
    })

    test('[C923] Requisition Approvals - Verify Approvals with coments', async ({ taskListsPage, taskListsData }) => {
        const manageRequisitionsPage = new ManageRequisitionsPage(taskListsPage.page);
        await manageRequisitionsPage.navigateToManageRequisitionsPage();
        await manageRequisitionsPage.createRequisition(requisitionsData, false);
        await taskListsPage.navigateToTaskListsPage();  
        await taskListsPage.approveRequisition(taskListsData.comment);
        await expect(taskListsPage.requisitionsContainer).toHaveCount(0);
        await manageRequisitionsPage.navigateToManageRequisitionsPage();
        await expect(taskListsPage.approvedStatusColor).toBeVisible();
        await taskListsPage.deleteRejectedRequisition();
        await expect(taskListsPage.requisitionsTableFirstRow).toHaveCount(0);
    })

    test('[C924] Requisition Approvals - Verify Approvals without coments', async ({ taskListsPage }) => {
        const manageRequisitionsPage = new ManageRequisitionsPage(taskListsPage.page);
        await manageRequisitionsPage.navigateToManageRequisitionsPage();
        await manageRequisitionsPage.createRequisition(requisitionsData, false);
        await taskListsPage.navigateToTaskListsPage();  
        await taskListsPage.approveRequisition();
        await expect(taskListsPage.requisitionsContainer).toHaveCount(0);
        await manageRequisitionsPage.navigateToManageRequisitionsPage();
        await expect(taskListsPage.approvedStatusColor).toBeVisible();
        await taskListsPage.deleteRejectedRequisition();
        await expect(taskListsPage.requisitionsTableFirstRow).toHaveCount(0);
    })

    //Skippeng Gen AI tests for now for futher investigation an how to improve test execution with AI behavior
    test.skip('[C142037] Gen AI - Import and Outreach', async ({ taskListsPage, taskListsData }) => {
        await taskListsPage.importAndOutreach(taskListsData.genAi);
        await taskListsPage.waitForGenAiCard();
        const card = await taskListsPage.isGenAICardVisible(taskListsData.genAi.testJob);
        await expect(card).toBeTruthy();
    })

    test.skip('[C142040] Gen AI - Review Email Drafts', async ({ taskListsPage, taskListsData }) => {
        await taskListsPage.reviewEmailDrafts();
        prospectName = await taskListsPage.getCandidateNameFromEmailMeta();
        const name =  await taskListsPage.getEmailDraftName();
        await expect(name).toBe(prospectName);
    })

    test.skip('[C142038] Gen AI - Delete All', async ({ taskListsPage, taskListsData }) => {
        await taskListsPage.importAndOutreach(taskListsData.genAi);
        await taskListsPage.waitForGenAiCard();
        await taskListsPage.reviewEmailDrafts();
        prospectName = await taskListsPage.getCandidateNameFromEmailMeta();
        await taskListsPage.navigateToTaskListsPage();
        await taskListsPage.deleteAllGenAiEmail();
        const card = await taskListsPage.isGenAICardVisible(taskListsData.genAi.testJob);
        await expect(card).not.toBeTruthy();
        await expect(taskListsPage.successAlert).toHaveText(taskListsData.genAi.deleteSuccessAlert);
    })

    test.skip('[C142039] Gen AI - Send All', async ({ taskListsPage, taskListsData }) => {
        await taskListsPage.importAndOutreach(taskListsData.genAi);
        await taskListsPage.waitForGenAiCard();
        await taskListsPage.reviewEmailDrafts();
        prospectName = await taskListsPage.getCandidateNameFromEmailMeta();
        await taskListsPage.navigateToTaskListsPage();
        await taskListsPage.sendAllGenAiEmail();
        await expect(taskListsPage.successAlert).toHaveText(taskListsData.genAi.sendAllSuccessAlert);
    })

    test.skip('[C142041] Gen AI - Edit Email Draft', async ({ taskListsPage, taskListsData }) => {
        await taskListsPage.importAndOutreach(taskListsData.genAi);
        await taskListsPage.waitForGenAiCard();
        await taskListsPage.reviewEmailDrafts();
        await taskListsPage.editEmailDraft();
        await expect(taskListsPage.successAlert).toHaveText(taskListsData.genAi.editSuccessAlert);
    })

    test.skip('[C142043] Gen AI - Preview Email Draft', async ({ taskListsPage, taskListsData }) => {
        await taskListsPage.reviewEmailDrafts();
        await expect(await taskListsPage.previewEmailDraft()).toBeTruthy();
    })

    test.skip('[C142042] Gen AI - Delete Email Draft', async ({ taskListsPage, taskListsData }) => {
        await taskListsPage.reviewEmailDrafts();
        prospectName = await taskListsPage.getCandidateNameFromEmailMeta();
        await taskListsPage.deleteEmailDraft();
        await expect(taskListsPage.successAlert).toHaveText(taskListsData.genAi.deleteEmailDraftSuccessAlert);
    })

    test.skip('[C142044] Gen AI - Send Email Draft', async ({ taskListsPage, taskListsData }) => {
        await taskListsPage.importAndOutreach(taskListsData.genAi);
        await taskListsPage.waitForGenAiCard();
        await taskListsPage.reviewEmailDrafts();
        prospectName = await taskListsPage.getCandidateNameFromEmailMeta();
        await taskListsPage.sendEmailDraft();
        await expect(taskListsPage.successAlert).toHaveText(taskListsData.genAi.sendEmailDraftSuccessAlert);
    })

    test.skip('[C142045] Gen AI - Bulk Send Email Draft', async ({ taskListsPage, taskListsData }) => {
        await taskListsPage.importAndOutreach(taskListsData.genAi);
        await taskListsPage.waitForGenAiCard();
        await taskListsPage.reviewEmailDrafts();
        prospectName = await taskListsPage.getCandidateNameFromEmailMeta();
        await taskListsPage.bulkSendEmailDrafts();
        await expect(taskListsPage.successAlert).toHaveText(taskListsData.genAi.sendAllOnReviewDraftsSuccessAlert);
    })
});

test.describe('Task List - Tile Count', () => {
    // The test creates a resume review task; decline it afterwards (even on failure)
    // so the shared account's task list is left as it was.
    test.afterEach(async ({ taskListsPage, taskListsData }) => {
        await taskListsPage.cancelPendingResumeReview(taskListsData.comment);
    });

    test('[TC-16267] Task Tile functionality test - Verify the Tile list total count', { tag: '@smoke' }, async ({ taskListsPage, taskListsData }) => {
        const candidatesBulkActionsPage = new CandidatesBulkActionsPage(taskListsPage.page);
        await candidatesBulkActionsPage.goToAdvancedSearchPage();
        await candidatesBulkActionsPage.searchCandidate(taskListsData.candidateName);
        await candidatesBulkActionsPage.reviewReviewForwardResume(taskListsData.jobTitle);

        const badgeCount = await taskListsPage.getTodoListCount();
        expect(badgeCount).toBeGreaterThan(0);

        await taskListsPage.navigateToTaskListsPage();
        await expect(taskListsPage.taskTiles).toHaveCount(badgeCount);
    });
});
