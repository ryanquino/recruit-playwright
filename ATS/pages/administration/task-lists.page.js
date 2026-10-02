const BasePage = require('../base.page.js');
const CandidatesBulkActionPage = require('../candidates/candidates-bulk-actions.page.js');
const ManageRequisitionsPage = require('../jobs/manage-requisition.page.js');

class TaskListsPage extends BasePage {
    constructor(page) {
        super(page);
        this.candidatesBulkActionPage = new CandidatesBulkActionPage(page);
        this.manageRequisitionsPage = new ManageRequisitionsPage(page);

        this.completeReviewButton = this.page.getByRole('button', { name: 'Complete Review' }).first();
        this.selectEvaluationDropdown = this.page.getByRole('button', { name: 'Select an Evaluation' });
        this.schdeuleInterviewOption = this.page.getByRole('option', { name: 'Schedule Interview' });
        this.declineOption = this.page.getByRole('option', { name: 'Declined-Does not meet education requirements' }).first();
        this.commentField = this.page.getByRole('textbox', { name: 'Comments' }).first();
        this.confirmButton = this.page.getByRole('button', { name: 'Confirm' }).first();
        this.successModalLocator = this.page.locator('div').filter({ hasText: 'Your resume review response' }).nth(1);
        this.viewRequisitionDetailsLink = this.page.getByRole('link', { name: 'View requisition details' }).first();
        this.requisitionModalHeading = this.page.getByRole('heading', { name: 'Playwright Requisition Test' });
        this.viewResumeTextLink = this.page.getByRole('link', { name: 'View resume' }).first();
        this.viewProfileTextLink = this.page.getByRole('link', { name: 'View Profile' }).first();
        this.crpDropdownActions = this.page.getByRole('button', { name: 'Take Action' });
        this.completeReviewMenuItem = this.page.getByRole('menuitem', { name: 'Complete Review' });
        this.noPendingTaskTextLocator = this.page.locator('#noPendingTasks');
        this.rejectButton = this.page.getByRole('button', { name: 'Reject' }).first();
        this.firstApprovalStatusColor = this.page.locator('table.rival-table tbody tr').first().locator('td.ui-align-center .dot.reddot').first();
        this.requisitionsTableFirstRow = this.page.getByRole('row', { name: 'Playwright Requisition Test' }).locator('i').first();
        this.requisitionsEditLink = this.page.getByRole('link', { name: 'Edit' });
        this.requisitionsDeleteButton = this.page.getByRole('button', { name: 'Delete' }).first();
        this.confirmDeleteModal = this.page.locator('#confirm_req_delete_ModalButtonPrimary');
        this.requisitionTableCell = this.page.locator('table.rival-table tbody tr').first().locator('td').nth(1);
        this.approveButton = this.page.getByRole('button', { name: 'Approve' }).first();
        this.cancelTextLink = this.page.getByRole('button', { name: 'Cancel' }).first();
        this.requisitionCardHeading = this.page.getByRole('heading', { name: 'Playwright Requisition Test' }).first();
        this.resumeContainerLocator = this.page.locator('#todo-list-resumes .todo-list__card-containerfalse');
        this.requisitionsContainer = this.page.locator('#todo-list-requisitions .todo-list__card-containerfalse');
        this.taskTiles = this.page.locator('.todo-list__card-containerfalse');
        this.approvedStatusColor = this.page.locator('table.rival-table tbody tr').first().locator('td.ui-align-center .dot.greendot');
        this.jobsMenuItem = this.page.getByLabel('Jobs', { exact: true });
        this.jobTrackingMenuItem = this.page.getByText('Job Tracking', { exact: true });
        this.sourcePassiveCandidatesButton = this.page.getByRole('button', { name: 'Source with ROSI' });
        this.importButton = this.page.getByRole('button', { name: 'Import selected candidates' });
        this.importAndOutreachButton = this.page.getByRole('button', { name: 'Import and Outreach' });
        this.emailSubjectCombobox = this.page.getByRole('combobox', { name: 'Enter Subject for' });
        this.generateEmailButton = this.page.getByRole('button', { name: 'Generate Personalized Email' });
        this.closeButton = this.page.getByRole('button', { name: 'Close', exact: true });
        this.deleteAllEmailDraftsButton = this.page.getByRole('button', { name: 'Delete All' }).first();
        this.firstCandidateCheckbox = this.page.locator('div[role="article"] input[type="checkbox"]');
        this.successAlert = this.page.locator('.toast-message .toastr_message_text');
        this.reviewTextLink = this.page.locator('.toast-message a', { hasText: 'Review' });
        this.sendAllEmailDraftsButton = this.page.getByRole('button', { name: 'Send All' }).first();
        this.reviewEmailDraftsButton = this.page.getByRole('button', { name: 'REVIEW DRAFTS' }).first();
        this.editIcon = this.page.locator('i.js-edit-resume');
        this.previewIcon = this.page.locator('i.preview-email-draft');
        this.deleteIcon = this.page.locator('i.delete-email-draft');
        this.generatePersonalizedEmailButton = this.page.locator('#generatePersonalizedEmailWithAIBtn');
        this.saveContactPoweredByAIButton = this.page.locator('#btnSaveContactPoweredByAI');
        this.editModalCloseIcon = this.page.locator('#sendEmailGenAIOutreach_ModalCloseX');
        this.deleteButton = this.page.locator('#confirm_delete_ModalButtonPrimary');
        this.sendIcon = this.page.locator('i.send-email-draft');
        this.confirmSendEmailDraft = this.page.locator('#emailDraftSendButton');
        this.checkboxAllEmailDraft = this.page.locator('#selectAllEmails');
        this.sendAllEmailDrafts = this.page.locator('#sendAllEmails'); 
        this.confirmSendAllEmailDrafts = this.page.locator('#sendAllEmailsModalButton');
    }

    async navigateToTaskListsPage() {
        await this.candidatesBulkActionPage.taskListIcon.click();
        await this.page.waitForLoadState('load');
    }

    async completeEvaluation(comment) {
        await this.completeReviewButton.click();
        await this.selectEvaluationDropdown.click();
        await this.schdeuleInterviewOption.click();
        await this.commentField.fill(comment);
        await this.confirmButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async cancelEvaluation(comment) {
        await this.completeReviewButton.click();
        await this.selectEvaluationDropdown.click();
        await this.declineOption.click();
        await this.commentField.fill(comment);
        await this.confirmButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getRequisitionDetailsHeading(jobTitle){
        await this.viewRequisitionDetailsLink.click();
        return this.page.getByRole('heading', { name: jobTitle });
    }

    async rejectRequisition(comment){
        await this.rejectButton.click();
        await this.commentField.fill(comment);
        await this.confirmButton.click();
    }

    async deleteRejectedRequisition(){
        await this.requisitionsTableFirstRow.click();
        await this.requisitionsEditLink.click();
        await this.requisitionsDeleteButton.click();
        await this.confirmDeleteModal.click();
    }

    async completeReviewOnCRP(comment){
        await this.viewResumeTextLink.click();
        await this.viewProfileTextLink.click();
        await this.page.waitForLoadState('load');
        const newPagePopupPromise = this.page.waitForEvent('popup');
        await this.crpDropdownActions.waitFor({ state: 'visible' });
        await this.crpDropdownActions.click();
        await this.completeReviewMenuItem.waitFor({ state: 'visible' });
        await this.completeReviewMenuItem.click();
        const newpagePopup = await newPagePopupPromise;
        await newpagePopup.getByLabel('Please evaluate candidate to').selectOption('1');
        await newpagePopup.getByRole('textbox', { name: 'You may provide a comment for' }).fill(comment);
        await newpagePopup.getByRole('button', { name: 'Save' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async getRequisitionDetailsHeading(jobTitle){
        await this.viewRequisitionDetailsLink.click();
        return this.page.getByRole('heading', { name: jobTitle });
    }

    async rejectRequisition(comment){
        await this.rejectButton.click();
        await this.commentField.fill(comment);
        await this.confirmButton.click();
    }

    async deleteRejectedRequisition(){
        await this.requisitionsTableFirstRow.click();
        await this.requisitionsEditLink.click();
        await this.page.waitForLoadState('load');
        await this.requisitionsDeleteButton.click();
        await this.confirmDeleteModal.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async cancelApproveRequisition(){
        await this.approveButton.click();
        await this.cancelTextLink.click();
    }

    async getTodoListCount(){
        await this.page.reload({ waitUntil: 'load' });
        const count = Number(await this.page.locator('#todoTaskCount').textContent());
        return count;
    }

    // Cleanup for tests that create a resume review task: declines it from the task list
    // if one is still pending, so no task is left behind on the shared account.
    async cancelPendingResumeReview(comment) {
        await this.navigateToTaskListsPage();
        if (await this.completeReviewButton.isVisible()) {
            await this.cancelEvaluation(comment);
        }
    }

    async getRequisitionTableContent(){
        const cellText = await this.requisitionTableCell.textContent();
        return cellText;
    }

    async approveRequisition(comment){
        await this.approveButton.click();
        if(comment == null){
            await this.confirmButton.click();
        }
        else{
            await this.commentField.click();
            await this.commentField.fill(comment);
            await this.confirmButton.click();
        }
    }

    async importAndOutreach(genAi){
        await this.jobsMenuItem.click();
        await this.jobTrackingMenuItem.click();
        await this.page.getByRole('link', { name: genAi.testJob }).click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.sourcePassiveCandidatesButton.click();
        await this.page.waitForSelector('svg.ui-lib-sr-MuiCircularProgress-svg.entl-13o7eu2', {state: 'visible'});
        await this.page.waitForSelector('svg.ui-lib-sr-MuiCircularProgress-svg.entl-13o7eu2', {state: 'hidden'});
        await this.page.locator('#perPage').click();
        await this.page.getByRole('option', { name: '50 results' }).click();
        await this.page.waitForSelector('svg.ui-lib-sr-MuiCircularProgress-svg.entl-13o7eu2', {state: 'visible'});
        await this.page.waitForSelector('svg.ui-lib-sr-MuiCircularProgress-svg.entl-13o7eu2', {state: 'hidden'});
        await this.firstCandidateCheckbox.nth(this.getRandomNumber()).click();
        await this.importButton.click();
        await this.importAndOutreachButton.click();
        await this.emailSubjectCombobox.click();
        await this.page.getByRole('option', { name: genAi.emailSubject }).click();
        await this.generateEmailButton.click();
        await this.closeButton.click();
    }

    async waitForGenAiCardAndClickReview() {
        const genAiCard = this.page.locator('#toast-container .toast-success:has-text("Email Generation Completed")');
        const interval = 5000;
        const maxRetries = 12;

        for (let i = 0; i < maxRetries; i++) {   
            await this.page.waitForTimeout(interval);
            if (await genAiCard.isVisible()) {
                break;
            }
            await this.page.reload();
            await this.page.waitForLoadState('domcontentloaded');
        }

        await this.reviewTextLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async isGenAICardVisible(job){
        const card = this.page.locator('.todo-card-title.searchable', { hasText: job });
        return await card.isVisible();
    }

    async deleteAllGenAiEmail(){
        await this.deleteAllEmailDraftsButton.click();
        await this.confirmButton.click();
    }

    async sendAllGenAiEmail(){
        await this.sendAllEmailDraftsButton.click();
        await this.confirmButton.click();
    }

    async reviewEmailDrafts(){
        await this.reviewEmailDraftsButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getEmailDraftName(){
        const candidateName = this.page.locator('.email-group a[href*="resume.displayResume"]').first();
        const actualName = await candidateName.textContent();

        return actualName;
    }

    async getCandidateNameFromEmailMeta() {
        const name = await this.page
            .locator('.email-meta a[href*="fuseaction=resume.displayResume"]')
            .first()
            .innerText();
        return name.trim();
    }

    async editEmailDraft(){
        await this.editIcon.click();
        await this.page.locator('.tox-edit-area iframe').waitFor({ state: 'attached' });
        const frame = this.page.frameLocator('.tox-edit-area iframe');
        await frame.locator('body').waitFor({ state: 'visible' });
        await this.generatePersonalizedEmailButton.click();
        await this.page.waitForFunction(() => {
            const btn = document.querySelector('#generatePersonalizedEmailWithAIBtn');
            return btn && !btn.disabled;
        });
        await this.saveContactPoweredByAIButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async previewEmailDraft(){
        await this.previewIcon.click();
        const modal = this.page.locator('#previewEmailGenAIOutreach_Modal');
        const header = this.page.locator('#previewEmailGenAIOutreach_ModalHeader');
        await modal.waitFor({ state: 'visible' });
        const headingText = await header.textContent();
        return headingText.trim() === 'Email Preview';
    }

    async deleteEmailDraft(){
        await this.deleteIcon.click();
        await this.deleteButton.click();
    }

    async sendEmailDraft(){
        await this.sendIcon.click();
        await this.confirmSendEmailDraft.click();
    }

    async bulkSendEmailDrafts(){
        await this.checkboxAllEmailDraft.check();
        await this.sendAllEmailDrafts.click();
        await this.confirmSendAllEmailDrafts.click();
    }

    async waitForGenAiCard() {
        await this.navigateToTaskListsPage();
        const card = this.page.locator('div[id^="emails__"].todo-list__card-containerfalse');
        const interval = 3000;
        const maxRetries = 12;

        for (let i = 0; i < maxRetries; i++) {   
            await this.page.waitForTimeout(interval);
            if (await card.isVisible()) {
                break;
            }
            await this.page.reload();
            await this.page.waitForLoadState('domcontentloaded');
        }
    }

    getRandomNumber(min = 0, max = 49) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = TaskListsPage;