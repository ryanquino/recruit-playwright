const BasePage = require('../base.page.js');

class EvaluationQuestionsPage extends BasePage {
    constructor(page) {
        super(page);

         // Define all locators
         //category locators
         this.administrationMenuItem = this.page.getByLabel('Administration', { exact: true });
         this.evaluationQuestionsNavMenuLink = this.page.getByLabel('Evaluation Questions').getByText('Evaluation Questions');
         this.createCategoryLink = this.page.getByRole('link', { name: 'Create Category' });
         this.createQuestionLink = this.page.getByRole('link', { name: 'Create Question' });
         this.viewRankingCriteriaLink = this.page.getByRole('link', { name: 'View Ranking Criteria' });
         this.categoryNameField = this.page.getByLabel('Category Name *');  
         this.categoryDescriptionField = this.page.getByLabel('Category Description');
         this.createCategoryButton = this.page.getByRole('button', { name: 'Create Category' });
         this.updateCategoryButton = this.page.getByRole('button', { name: 'Update Category' });
         this.deleteCategoryButton = this.page.getByRole('button', { name: 'Delete' });
         this.modalConfirmDeleteButton = this.page.locator('#confirmdelete_ModalButtonPrimary');
         this.mainCategoryHelpLinks = this.page.locator('#main i').first();
         this.manageEvaluationCategoryHelpLinks = this.page.locator('#main div').filter({ hasText: 'Manage Evaluation Category Help Return to Manage Evaluations' }).locator('i').first();
         this.modifyCategoryHelpLinks = this.page.locator('#main div').filter({ hasText: 'Manage Evaluations - Display Questions Return to Manage Evaluations Modify' }).locator('i').first();9
         this.returnToManageEvaluations = this.page.getByRole('link', { name: 'Return to Manage Evaluations' });
         this.modifyLink = this.page.getByRole('link', { name: 'Modify' });
         this.selectAllQuestionsCheckbox = this.page.getByLabel('Select All');
         this.deleteQuestionsButton = this.page.getByRole('button', { name: 'Delete Question(s)' })
         this.okConfirmDeleteButton = this.page.locator('#confirmDeleteModalButtonPrimary');

         //create question locators
         this.yesNoAnswerTypeOption = this.page.locator('#answer_type_1Field').getByText('Yes/No');
         this.nextButton = this.page.getByRole('button', { name: 'Next' });
         this.defineQuestionField = this.page.getByLabel('Please define the question.');
         this.nextButton2 = this.page.locator('button[name="btnNxt2"]');
         this.defineEvaluationField = this.page.getByLabel('Please define an evaluation');
         this.nextButton3 = this.page.locator('button[name="btnNxt3"]');
         this.yesSetFailFlagField = this.page.getByRole('row', { name: 'Yes Set "fail" flag for this' }).getByRole('spinbutton');
         this.noSetFailFlagField = this.page.getByRole('row', { name: 'No Set "fail" flag for this' }).getByRole('spinbutton');
         this.setFailFlagCheckbox = this.page.getByRole('row', { name: 'No Set "fail" flag for this' }).getByLabel('Set "fail" flag for this');
         this.nextButton4 = this.page.locator('button[name="btnNxt4"]');
         this.categoryDropdown = this.page.getByLabel('Please select the category');
         this.nextButton6 = this.page.locator('button[name="btnNxt6"]');
         this.createQuestionButton = this.page.getByRole('button', { name: 'Create' });
         this.freeTextAnswerTypeOption = this.page.locator('#answer_type_2Field').getByText('Free Text');
         this.multipleChoiceAnswerTypeOption = this.page.getByText('Multiple Choice', { exact: true });
         this.firstChoiceAnswerField = this.page.locator('table > tbody > tr > td > input.ui-form-field-text[type="text"]:not([readonly])').first();
         this.secondChoiceAnswerField = this.page.locator('table > tbody > tr:nth-child(2) > td > input.ui-form-field-text[type="text"]:not([readonly])').first();
         this.thirdChoiceAnswerField = this.page.locator('table > tbody > tr:nth-child(3) > td > input.ui-form-field-text[type="text"]:not([readonly])').first();
         this.fourthChoiceAnswerFIeld = this.page.locator('table > tbody > tr:nth-child(4) > td > input.ui-form-field-text[type="text"]:not([readonly])').first();
         this.firstChoiceGradeField = this. page.getByRole('row', { name: 'answer1 Set "fail" flag for' }).getByRole('spinbutton').first();
         this.secondChoiceGradeField = this.page.getByRole('row', { name: 'answer2 Set "fail" flag for' }).getByRole('spinbutton');
         this.thirdChoiceGradeFIeld = this.page.locator('table > tbody > tr:nth-child(3) > td:nth-child(2) > .ui-form-field-text');
         this.fourthChoiceGradeField = this.page.locator('table > tbody > tr:nth-child(4) > td:nth-child(2) > .ui-form-field-text');
         this.setFailFlagChoice2 = this.page.locator('#answer_fail_002_2');
         this.setFailFlagChoice3 = this.page.locator('#answer_fail_002_3');
         this.setFailFlagChoice4 = this.page.locator('#answer_fail_002_4');
         this.nextButton5 = this.page.locator('button[name="btnNxt5"]');

         //criteria locators
         this.criteriaHelpLink = this.page.locator('#main div').filter({ hasText: 'View Details Add Criteria' }).nth(2);
         this.addCriteriaLink = this.page.getByRole('link', { name: 'Add Criteria' });
         this.criteriaRichTextEditor = this.page.locator('iframe[title="Rich Text Area"]').contentFrame().locator('html');
         this.criteriaSaveButton = this.page.getByRole('button', { name: 'Save' });
         this.editCriteriaLink = this.page.getByRole('link', { name: 'Edit' });
         this.deleteCriteriaLink = this.page.getByRole('link', { name: 'Delete' });
         this.deleteConfirmationSuccessAlert = this.page.locator('div').filter({ hasText: 'Criteria have been deleted!' }).nth(1);
    } 

    async navigateToEvaluationQuestions() {
        await this.administrationMenuItem.click();
        await this.evaluationQuestionsNavMenuLink.click();
        await this.page.waitForLoadState('load');  
    }

    async createCategory(category){
        await this.mainCategoryHelpLinks.click();
        await this.createCategoryLink.click();
        await this.page.waitForLoadState('load'); 
        await this.categoryNameField.click();
        await this.categoryNameField.fill(category.name);
        await this.categoryDescriptionField.click();
        await this.categoryDescriptionField.fill(category.description);
        await this.createCategoryButton.click();
        await this.page.waitForLoadState('load'); 
        await this.manageEvaluationCategoryHelpLinks.click();
        await this.returnToManageEvaluations.click();
        await this.page.waitForLoadState('load');
    }

    async isCategoryExists(name){
        return await this.page.locator(`table:has-text("Category Name") td:has-text("${name}")`); 
    }

    async modifyCategory(category){
        const labelLink = this.page.locator(`table:has-text("Category Name") td:has-text("${category.name}") a`);
        await labelLink.click();
        await this.page.waitForLoadState('load');
        await this.categoryNameField.click();
        await this.categoryDescriptionField.fill(category.updatedDescription);
        await this.updateCategoryButton.click();
        await this.page.waitForLoadState('load'); 
        await this.manageEvaluationCategoryHelpLinks.click();
        await this.returnToManageEvaluations.click();
        await this.page.waitForLoadState('load');
    }

    async deleteCategory(category){
        await this.evaluationQuestionsNavMenuLink.click();
        await this.page.waitForLoadState('load');
        const labelLink = this.page.locator(`table:has-text("Category Name") td:has-text("${category.name}") a`);
        await labelLink.click();
        await this.page.waitForLoadState('load');
        await this.modifyCategoryHelpLinks.click();
        await this.modifyLink.click();
        await this.page.waitForLoadState('load');
        await this.deleteCategoryButton.click();
        await this.modalConfirmDeleteButton.click();
        await this.page.waitForLoadState('load');
        await this.selectAllQuestionsCheckbox.check();
        await this.deleteQuestionsButton.click();
        await this.okConfirmDeleteButton.click();
        await this.page.waitForLoadState('load');
    }

    async createYesNoQuestion(question){
        await this.mainCategoryHelpLinks.click();
        await this.createQuestionLink.click();
        await this.page.waitForLoadState('load');
        await this.yesNoAnswerTypeOption.click();
        await this.nextButton.click();
        await this.page.waitForLoadState('load');
        await this.defineQuestionField.click();
        await this.defineQuestionField.fill(question.yesNoQuestionName);
        await this.page.keyboard.press('Tab'); 
        await this.nextButton2.click();
        await this.page.waitForLoadState('load');
        await this.defineEvaluationField.click();
        await this.defineEvaluationField.fill(question.yesNoEvaluation);
        await this.page.keyboard.press('Tab'); 
        await this.nextButton3.click();
        await this.page.waitForLoadState('load');
        await this.yesSetFailFlagField.click();
        await this.yesSetFailFlagField.fill(question.yesEvaluation);
        await this.noSetFailFlagField.click();
        await this.noSetFailFlagField.fill(question.noEvaluation);
        await this.setFailFlagCheckbox.check();
        await this.nextButton4.click();
        await this.page.waitForLoadState('load');
        await this.categoryDropdown.selectOption({ label: question.categoryName });
        await this.nextButton6 .click();
        await this.page.waitForLoadState('load');
        await this.createQuestionButton.click();
        await this.page.waitForLoadState('load');
    }

    async createFreeTextQuestion(question){
        await this.evaluationQuestionsNavMenuLink.click();
        await this.page.waitForLoadState('load');
        await this.mainCategoryHelpLinks.click();
        await this.createQuestionLink.click();
        await this.page.waitForLoadState('load');
        await this.freeTextAnswerTypeOption.click();
        await this.nextButton.click();
        await this.page.waitForLoadState('load');
        await this.defineQuestionField.click();
        await this.defineQuestionField.fill(question.freeTextQuestionName);
        await this.page.keyboard.press('Tab'); 
        await this.nextButton2.click();
        await this.page.waitForLoadState('load');
        await this.categoryDropdown.selectOption({ label: question.categoryName });
        await this.page.keyboard.press('Tab'); 
        await this.nextButton6.click();
        await this.page.waitForLoadState('load');
        await this.createQuestionButton.click();
        await this.page.waitForLoadState('load');
    }

    async isQuestionExist(categoryName, questionName){
        const labelLink = this.page.locator(`table:has-text("Category Name") td:has-text("${categoryName}") a`);
        await labelLink.click();
        await this.page.waitForLoadState('load');
        return await this.page.locator(`table:has-text("Question") td:has-text("${questionName}")`); 
    }

    async createMultipleChoiceQuestion(question){
        await this.evaluationQuestionsNavMenuLink.click();
        await this.page.waitForLoadState('load');
        await this.mainCategoryHelpLinks.click();
        await this.createQuestionLink.click();
        await this.page.waitForLoadState('load');
        await this.multipleChoiceAnswerTypeOption.click();
        await this.nextButton.click();
        await this.defineQuestionField.click();
        await this.defineQuestionField.fill(question.multipleChoiceQuestionName);
        await this.page.keyboard.press('Tab'); 
        await this.nextButton2.click();
        await this.defineEvaluationField.click();
        await this.defineEvaluationField.fill(question.freeTextEvaluation);
        await this.page.keyboard.press('Tab'); 
        await this.nextButton3.click();
        await this.page.keyboard.press('Tab');  

        //fill in first row of inputs
        await this.firstChoiceAnswerField.fill(question.firstChoiceName);
        await this.firstChoiceGradeField.fill(question.firstChoiceEvaluation); 
        //fill in second row of inputs
        await this.secondChoiceAnswerField.fill(question.secondChoiceName); 
        await this.secondChoiceGradeField.fill(question.secondChoiceEvaluation);
        await this.setFailFlagChoice2.check();
        //fill in third row of inputs
        await this.thirdChoiceAnswerField.fill(question.thirdChoiceName);
        await this.thirdChoiceGradeFIeld.fill(question.thirdChoiceEvaluation);
        await this.setFailFlagChoice3.check();
        //fill in fourth row of inputs
        await this.fourthChoiceAnswerFIeld.fill(question.fourthChoiceName);
        await this.fourthChoiceGradeField.fill(question.fourthChoiceEvaluation);      
        await this.setFailFlagChoice4.check();

        await this.nextButton5.click();
        await this.categoryDropdown.selectOption({ label: question.categoryName });
        await this.nextButton6.click();
        await this.createQuestionButton.click();
        await this.page.waitForLoadState('load');       
    }

    async createRankingCriteria(criteria){
        await this.mainCategoryHelpLinks.click();
        await this.viewRankingCriteriaLink.click();
        await this.page.waitForLoadState('load');
        await this.criteriaHelpLink.click();
        await this.addCriteriaLink.click();
        await this.page.waitForLoadState('load');
        // Wait for iframe to load and switch to it
        const frame = await this.page.frameLocator('iframe[title="Rich Text Area"]');
        const richTextEditor = frame.locator('[contenteditable="true"]');
        await richTextEditor.fill(criteria.name);
        await this.criteriaSaveButton.click();
        await this.page.waitForLoadState('load');
    }

    async editRankingCriteria(criteria){
        await this.mainCategoryHelpLinks.click();
        await this.viewRankingCriteriaLink.click();
        await this.page.waitForLoadState('load');
        await this.page.getByRole('row', { name: criteria.name }).locator('i').first().click();
        await this.editCriteriaLink.click();
        const frame = await this.page.frameLocator('iframe[title="Rich Text Area"]');
        const richTextEditor = frame.locator('[contenteditable="true"]');
        await richTextEditor.fill(criteria.updatedCriteriaName);
        await this.criteriaSaveButton.click();
    }

    async deleteRankingCriteria(criteriaName){
        await this.mainCategoryHelpLinks.click();
        await this.viewRankingCriteriaLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.getByRole('row', { name: criteriaName}).locator('i').first().click();
        await this.deleteCriteriaLink.click();
    }

    async isRankingExist(criteriaName){
        const currentUrl = await this.page.url();
        if (!currentUrl.includes("?fuseaction=box.rankview")) {
            await this.mainCategoryHelpLinks.click();
            await this.viewRankingCriteriaLink.click();
        }    
        await this.page.waitForLoadState('domcontentloaded');
        return this.page.locator(`table:has-text("Criteria") td:has-text("${criteriaName}")`);
    }

}

module.exports = EvaluationQuestionsPage;
