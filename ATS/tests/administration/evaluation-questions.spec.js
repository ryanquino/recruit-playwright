// @ts-check
const { test, expect } = require('../fixtures/administration-fixture.js');

test.describe.serial('Create Category and CQE', () => {
    test('[C597] Create Category', async ({ evaluationQuestionsPage, evaluationQuestionsData }) => {
        await evaluationQuestionsPage.createCategory(evaluationQuestionsData.category);
        await expect(await evaluationQuestionsPage.isCategoryExists(evaluationQuestionsData.category.name)).toBeVisible();
    });
    test('[C598] Edit Category', async ({ evaluationQuestionsPage, evaluationQuestionsData }) => {
        await evaluationQuestionsPage.modifyCategory(evaluationQuestionsData.category);
        await expect(await evaluationQuestionsPage.isCategoryExists(evaluationQuestionsData.category.name)).toBeVisible();  
    });

    test('[C599] Create Question', async ({ evaluationQuestionsPage, evaluationQuestionsData }) => {
        await evaluationQuestionsPage.createYesNoQuestion(evaluationQuestionsData.questions);
        await expect(await evaluationQuestionsPage.isQuestionExist(evaluationQuestionsData.category.name, evaluationQuestionsData.questions.yesNoQuestionName)).toBeVisible();       
    });
    test('[C600] Create Question - Scenario 2', async ({ evaluationQuestionsPage, evaluationQuestionsData }) => {
        await evaluationQuestionsPage.createFreeTextQuestion(evaluationQuestionsData.questions);
        await expect(await evaluationQuestionsPage.isQuestionExist(evaluationQuestionsData.category.name, evaluationQuestionsData.questions.freeTextQuestionName)).toBeVisible();     
    });
    test('[C601] Create Question - Scenario 3', async ({ evaluationQuestionsPage, evaluationQuestionsData }) => {
        await evaluationQuestionsPage.createMultipleChoiceQuestion(evaluationQuestionsData.questions);
        await expect(await evaluationQuestionsPage.isQuestionExist(evaluationQuestionsData.category.name, evaluationQuestionsData.questions.multipleChoiceQuestionName)).toBeVisible();
        await evaluationQuestionsPage.deleteCategory(evaluationQuestionsData.category);
        await expect(await evaluationQuestionsPage.isCategoryExists(evaluationQuestionsData.category.name)).not.toBeVisible();           
    });
});

test.describe.serial('View Ranking Criteria', () => {
    test('[C602] View Ranking Criteria', async ({ evaluationQuestionsPage, evaluationQuestionsData }) => {
        await evaluationQuestionsPage.createRankingCriteria(evaluationQuestionsData.criteria);
        await expect(await evaluationQuestionsPage.isRankingExist(evaluationQuestionsData.criteria.name)).toBeVisible();
    });
    test('[C603] Edit Ranking Criteria', async ({ evaluationQuestionsPage, evaluationQuestionsData }) => {
        await evaluationQuestionsPage.editRankingCriteria(evaluationQuestionsData.criteria);
        await expect(await evaluationQuestionsPage.isRankingExist(evaluationQuestionsData.criteria.name)).toBeVisible();
    });
    test('[C604] Delete Ranking Criteria', async ({ evaluationQuestionsPage, evaluationQuestionsData }) => {
        await evaluationQuestionsPage.deleteRankingCriteria(evaluationQuestionsData.criteria.name);
        await expect(evaluationQuestionsPage.deleteConfirmationSuccessAlert).toBeVisible();
        await expect(await evaluationQuestionsPage.isRankingExist(evaluationQuestionsData.criteria.name)).not.toBeVisible();      
    });

});
