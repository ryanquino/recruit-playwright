// @ts-check
const { test, expect } = require('../fixtures/candidates-fixture');

test('[C265] Search for Candidate Name ', async ({ candidatesPoolPage, candidateSearchFiltersData }) => {
    await candidatesPoolPage.applyFilter('candidateName', candidateSearchFiltersData.candidate_name);
    await expect(await candidatesPoolPage.isFilterResultVisible(candidateSearchFiltersData.candidate_name)).toBeVisible();
    await expect(await candidatesPoolPage.areThereCandidateSearchResults()).toBe(true);
});

test('[C264] Filter by Recruiting Manager', async ({ candidatesPoolPage, candidateSearchFiltersData }) => {  
    await candidatesPoolPage.applyFilter('recruitingManager', candidateSearchFiltersData.recruiting_manager);       
    await candidatesPoolPage.addTableColumn();
    await expect(await candidatesPoolPage.isFilterResultVisible(candidateSearchFiltersData.recruiting_manager)).toBeVisible();
    await expect(await candidatesPoolPage.areThereCandidateSearchResults()).toBe(true);
});

test('[C266] Search for Enter in the last', async ({ candidatesPoolPage, candidateSearchFiltersData }) => {
    await candidatesPoolPage.applyFilter('enteredLast', candidateSearchFiltersData.entered_in_the_last, { interval: candidateSearchFiltersData.entered_in_the_last_days });      
    await expect(await candidatesPoolPage.areThereCandidateSearchResults()).toBe(true);
});

test('[C5503] Search for Enter Date', async ({ candidatesPoolPage }) => {
    await candidatesPoolPage.applyFilter('enterDateRange', { startMonth: '0', startDay: '1', startYear: '2024', end: '28' });
    await expect(await candidatesPoolPage.areThereCandidateSearchResults()).toBe(true);
});

test('[C267] Search for Current Stage', async ({ candidatesPoolPage, candidateSearchFiltersData }) => {
    await candidatesPoolPage.applyFilter('currentStage', candidateSearchFiltersData.current_stage);
    await expect(await candidatesPoolPage.isFilterResultVisible(candidateSearchFiltersData.current_stage)).toBeVisible();
    await expect(await candidatesPoolPage.areThereCandidateSearchResults()).toBe(true);
});

test('[C268] Search for Country', async ({ candidatesPoolPage, candidateSearchFiltersData }) => {
    await candidatesPoolPage.applyFilter('country', 'United States');  
    await candidatesPoolPage.addTableColumn();
    await expect(await candidatesPoolPage.isFilterResultVisible(candidateSearchFiltersData.country)).toBeVisible();
    await expect(await candidatesPoolPage.areThereCandidateSearchResults()).toBe(true);
});

test('[C269] Search for Country and State', async ({ candidatesPoolPage, candidateSearchFiltersData }) => {
    await candidatesPoolPage.applyFilter('state', { country: candidateSearchFiltersData.country, state: candidateSearchFiltersData.state });
    await candidatesPoolPage.addTableColumn();
    await expect(await candidatesPoolPage.isFilterResultVisible(candidateSearchFiltersData.country)).toBeVisible();
    await expect(await candidatesPoolPage.isFilterResultVisible(candidateSearchFiltersData.state)).toBeVisible();
    await expect(await candidatesPoolPage.areThereCandidateSearchResults()).toBe(true);
});

test('[C5469] Search for Sort By', async ({ candidatesPoolPage }) => {
    await candidatesPoolPage.applyFilter('sort', 'desc');
    await expect(await candidatesPoolPage.areThereCandidateSearchResults()).toBe(true);
});

test('[C5515] Search for none ', async ({ candidatesPoolPage, candidateSearchFiltersData }) => {
    await candidatesPoolPage.applyFilter('candidateName', candidateSearchFiltersData.candidate_name + candidateSearchFiltersData.randomString);
    await expect(await candidatesPoolPage.areThereCandidateSearchResults()).toBe(false);
});

test('[C136899] Test Multi-Application Icon Display', async ({ candidatesPoolPage, candidateSearchFiltersData }) => {
    await candidatesPoolPage.applyFilter('candidateName', candidateSearchFiltersData.candidate_name);
    await expect(candidatesPoolPage.getMultiApplicationIcon(candidateSearchFiltersData.candidate_name)).toBeVisible();
});

test('[C154253] Test Fail Flag Filter Options', async ({ candidatesPoolPage, candidateSearchFiltersData }) => {
    await candidatesPoolPage.applyFilter('failFlag', candidateSearchFiltersData.fail_flag);
    await expect(await candidatesPoolPage.areThereCandidateSearchResults()).toBe(true);
});

test('[C184255] Candidate Pool - Indicators Column Addition', async ({ candidatesPoolPage }) => {
    await expect(candidatesPoolPage.tableHeading).toContainText('Indicators');
    await expect(candidatesPoolPage.indicatorsColumnCells.first()).toBeVisible();
});

test('[C184256] Indicators Column - Existing Icons Display', async ({ candidatesPoolPage }) => {
    await expect(candidatesPoolPage.indicatorsColumnCells.first()).toBeVisible();
    expect(await candidatesPoolPage.indicatorsColumnIcons.count()).toBeGreaterThan(0);
});

test('[C204082] Candidate Pool - Click through resumes', async ({ candidatesPoolPage }) => {
    await candidatesPoolPage.clickThroughToResume();
    await expect(candidatesPoolPage.page).toHaveURL(/fuseaction=resume\.(pager|displayResume)/);
});

test('[C204084] Candidate Pool - Preview Resume - XSS issue', async ({ candidatesPoolPage, candidateSearchFiltersData }) => {
    let dialogFired = false;
    candidatesPoolPage.page.on('dialog', async (dialog) => {
        dialogFired = true;
        await dialog.dismiss();
    });
    await candidatesPoolPage.applyFilter('candidateName', candidateSearchFiltersData.candidate_name);
    await candidatesPoolPage.openFirstResumePreview();
    await expect(candidatesPoolPage.resumePreviewModal).toBeVisible();
    expect(dialogFired).toBe(false);
});



