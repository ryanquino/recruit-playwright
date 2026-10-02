// @ts-check
const { test, expect } = require('../fixtures/candidates-fixture');
const ManageRequisitionsPage = require('../../pages/jobs/manage-requisition.page');
const TaskListsPage = require('../../pages/administration/task-lists.page');

const dispositionOptions = [
    { value: '6', text: 'Declined-Relocation issue' },
    { value: '5', text: 'Declined-Compensation package' },
    { value: '4', text: 'Declined-Poor interview presentation' },
    { value: '3', text: 'Declined-Does not meet experience requirements' },
    { value: '2', text: 'Declined-Does not meet educational requirements' },
    { value: '1', text: 'Accepted/Hired' }       
];

test('[C46664] Candidate selection with checkbox selection: Add Comments', async ({ candidatesBulkActionsPage, candidateBulkActionsData }) => {
    await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
    await candidatesBulkActionsPage.addComment(candidateBulkActionsData.comment);
    await expect(candidatesBulkActionsPage.editSuccessfulAlert).toBeVisible();
});

// These all read/write tags on the same shared test candidate, so they run serially to avoid
// racing each other under fullyParallel (an earlier parallel run flaked when C190430 and C190487
// mutated the same candidate's tags at the same time).
test.describe.serial('Candidate tag management', () => {
    test('[C46665] Candidate selection with checkbox selection: Assign Tags', async ({ candidatesBulkActionsPage, candidateBulkActionsData }) => {
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
        await candidatesBulkActionsPage.assignManageTags(candidateBulkActionsData.tag);
        await expect(candidatesBulkActionsPage.editSuccessfulAlert).toBeVisible();
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
        await expect(await candidatesBulkActionsPage.verifyTagOnCRP(candidateBulkActionsData.tag)).toBe(true);
    });

    test('[C190430] Verify bulk tag assignment with existing tags', async ({ candidatesBulkActionsPage, candidateBulkActionsData }) => {
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
        await candidatesBulkActionsPage.assignManageTags(candidateBulkActionsData.tag);
        await expect(candidatesBulkActionsPage.editSuccessfulAlert).toBeVisible();
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
        await expect(await candidatesBulkActionsPage.verifyTagOnCRP(candidateBulkActionsData.tag)).toBe(true);
    });

    test('[C190488] Verify bulk tag management shows existing tags when matches found', async ({ candidatesBulkActionsPage, candidateBulkActionsData }) => {
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
        const suggestions = await candidatesBulkActionsPage.getTagAutocompleteSuggestions(candidateBulkActionsData.existingTagPartial);
        expect(suggestions.length).toBeGreaterThan(0);
        expect(suggestions.some(s => s.includes(candidateBulkActionsData.tag))).toBe(true);
    });

    test('[C190487] Verify bulk tag management Replace all with allows creating new tags', async ({ candidatesBulkActionsPage, candidateBulkActionsData }) => {
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
        await candidatesBulkActionsPage.replaceTagsWithNew(candidateBulkActionsData.newTag);
        await expect(candidatesBulkActionsPage.editSuccessfulAlert).toBeVisible();
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
        await expect(await candidatesBulkActionsPage.verifyTagOnCRP(candidateBulkActionsData.newTag)).toBe(true);
    });
});

test('[C13693] Candidate Bulk Actions - Send Email', async ({ candidatesBulkActionsPage, candidateBulkActionsData }) => {
    await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
    await candidatesBulkActionsPage.sendEmail('Playwright Email Template for Update');
    await expect(await candidatesBulkActionsPage.sendEmailSuccessfulAlert).toBeVisible();
});

test('[C2476] Candidate selection with checkbox selection: Change Hiring Stage', async ({ candidatesBulkActionsPage, candidateBulkActionsData }) => {
    await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.hiringStageCandidate);
    await candidatesBulkActionsPage.changeHiringStage(candidateBulkActionsData.changeHiringStage);
    await expect(candidatesBulkActionsPage.editSuccessfulAlert).toBeVisible();
    await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.hiringStageCandidate);
    await candidatesBulkActionsPage.changeHiringStage(candidateBulkActionsData.defaultHiringStage);
    await expect(candidatesBulkActionsPage.editSuccessfulAlert).toBeVisible();
});

test.describe.serial('Change Job Association and Resume Review', () => {
    test('[C2477] Candidate selection with checkbox selection: Change Job Association', async ({ candidatesBulkActionsPage, candidateBulkActionsData }) => {
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
        await candidatesBulkActionsPage.changeJobAssociation(candidateBulkActionsData.jobTitle);
        await expect(candidatesBulkActionsPage.editSuccessfulAlert).toBeVisible();
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
        await expect(candidatesBulkActionsPage.jobTitleTableColumnLocator).toHaveText(candidateBulkActionsData.jobTitle);
    });

    test('[C2481] Candidate selection with checkbox selection: Resume Review', async ({ candidatesBulkActionsPage, candidateBulkActionsData }) => {
        const taskListsPage = new TaskListsPage(candidatesBulkActionsPage.page);
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
        await candidatesBulkActionsPage.reviewReviewForwardResume(candidateBulkActionsData.jobTitle);
        await expect(await candidatesBulkActionsPage.getToDoListLocator(candidateBulkActionsData.jobTitle)).toBeVisible();
        await taskListsPage.navigateToTaskListsPage();
        await taskListsPage.completeEvaluation("Playwright comment");
        await expect(taskListsPage.resumeContainerLocator).toHaveCount(0);
    });
});

test.describe.serial('Qualify, Disqualify selected candidates', () => {
    test(`[C2480] Candidate selection with checkbox selection: Qualify Selected test`, async ({ candidatesBulkActionsPage, candidateBulkActionsData }) => {
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
        await candidatesBulkActionsPage.qualifySelected();
        await expect(candidatesBulkActionsPage.editSuccessfulAlert).toBeVisible();
        await expect(await candidatesBulkActionsPage.verifyQualifiedStatusOnCRP()).toBe(true);
    });

    test(`[C2479] Candidate selection with checkbox selection: Disqualify Selected test`, async ({ candidatesBulkActionsPage, candidateBulkActionsData }) => {
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
        await candidatesBulkActionsPage.disqualifySelected();
        await expect(candidatesBulkActionsPage.editSuccessfulAlert).toBeVisible();
        await expect(await candidatesBulkActionsPage.verifyDisualifiedStatusOnCRP()).toBe(true);
    });
});

test.describe.serial('Candidate selection with checkbox selection', () => {
    test('[C2475] Candidate selection with checkbox selection: Change Disposition', async ({ candidatesBulkActionsPage, candidateBulkActionsData }) => {
        await candidatesBulkActionsPage.addTableColumn();
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.dispositionTestCandidate);

        for (const { value, text } of dispositionOptions) {
            await candidatesBulkActionsPage.changeDisposition(value);
            await expect(candidatesBulkActionsPage.editSuccessfulAlert).toBeVisible();
            await expect(candidatesBulkActionsPage.dispositionTableColumnLocator).toHaveText(text);
        }
    });

    test(`[C46663] Candidate selection with checkbox selection: remove Disposition`, async ({ candidatesBulkActionsPage, candidateBulkActionsData }) => {
        await candidatesBulkActionsPage.addTableColumn();
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.dispositionTestCandidate);
        await candidatesBulkActionsPage.removeDisposition();
        await expect(candidatesBulkActionsPage.editSuccessfulAlert).toBeVisible();
        await expect(candidatesBulkActionsPage.dispositionTableColumnLocator).toBeEmpty();
    });

    test('[C2478] Candidate selection with checkbox selection: Delete Selected', async ({ candidatesBulkActionsPage, candidateBulkActionsData }) => {
        await candidatesBulkActionsPage.searchCandidate(candidateBulkActionsData.candidateName);
        await candidatesBulkActionsPage.deleteSelected(candidateBulkActionsData.jobTitle);
        await expect(candidatesBulkActionsPage.deleteSuccessfulAlert).toBeVisible();
    });
});