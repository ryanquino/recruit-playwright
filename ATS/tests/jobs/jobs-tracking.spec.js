// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

const testCases = [
    { testId: 'C202', description: 'Search for Job Title', filterIndex: 'jobTitle'},
    { testId: 'C203', description: 'Search for Status', filterIndex: 'status' },
    { testId: 'C204', description: 'Search for Posting Status', filterIndex: 'postingStatus' },
    { testId: 'C205', description: 'Search for Primary Location', filterIndex: 'primaryLocation' },
    { testId: 'C206', description: 'Search for Additional Location', filterIndex: 'additionalLocation' },
    { testId: 'C5509', description: 'Search for Current Stage', filterIndex: 'currentStage' },
    { testId: 'C5510', description: 'Search for Posted Date', filterIndex: 'postedDate' },
    { testId: 'C5511', description: 'Search for Recruiting Manager', filterIndex: 'recruitingManager' },
    { testId: 'C5512', description: 'Search for Sort By', filterIndex: 'sortBy' },
    { testId: 'C5514', description: 'Search for None', filterIndex: 'none' },
];


test.describe('Job Tracking Search Filters', () => {
    for (const testCase of testCases) {
        test(`[${testCase.testId}] ${testCase.description}`, async ({ jobsTrackingPage, jobsSearchFiltersData }) => {
            await jobsTrackingPage.applySearchFilters(jobsSearchFiltersData, testCase.filterIndex);
            expect(Number(await jobsTrackingPage.resultsFound.textContent())).toBeGreaterThan(0);
        });
    }
});