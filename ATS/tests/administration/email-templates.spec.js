// @ts-check
const { test, expect } = require('../fixtures/administration-fixture.js');

test('[C588] Preview Email', async ({ emailTemplatesPage, emailTemplatesData }) => {  
    await emailTemplatesPage.redirectToPreview(emailTemplatesData.emailTemplateUpdateROSI.title);
    await expect(emailTemplatesPage.templateTitle).toHaveText(emailTemplatesData.emailTemplateUpdateROSI.title);
    await expect(emailTemplatesPage.eeoDataRequest).toHaveText(emailTemplatesData.emailTemplateUpdateROSI.subject);
    await expect(emailTemplatesPage.rejectionJobClosed).toContainText(emailTemplatesData.emailTemplateUpdateROSI.body);   
});

test('[C589] Edit', async ({ emailTemplatesPage, emailTemplatesData }) => {  
    await emailTemplatesPage.editEmailTemplate(emailTemplatesData.emailTemplateUpdate);
    await expect(emailTemplatesPage.selectEmailTemplateDropdown).toContainText(emailTemplatesData.emailTemplateUpdate.title);
});

test('[C197512] Refine with ROSI', async ({ emailTemplatesPage, emailTemplatesData }) => {
    await emailTemplatesPage.refineWithROSI(emailTemplatesData.emailTemplateUpdate);
    await expect(emailTemplatesPage.selectEmailTemplateDropdown).toContainText(emailTemplatesData.emailTemplateUpdate.title);
});

test.describe.serial('Add a new email templatte', () => {
    test('[C587] Create Batch Email Template', async ({ emailTemplatesPage, emailTemplatesData }) => {     
        await emailTemplatesPage.createBatchEmailTemplate(emailTemplatesData.emailTemplate);
        await expect(emailTemplatesPage.selectEmailTemplateDropdown).toContainText(emailTemplatesData.emailTemplate.title);          
    });

    test('[C590] Delete Email Template', async ({ emailTemplatesPage, emailTemplatesData }) => {               
        await emailTemplatesPage.deleteBatchEmailTemplate(emailTemplatesData.emailTemplate.title);
        await expect(await emailTemplatesPage.selectEmailTemplateDropdown).not.toContainText(emailTemplatesData.emailTemplate.title);
    });
});
  
  