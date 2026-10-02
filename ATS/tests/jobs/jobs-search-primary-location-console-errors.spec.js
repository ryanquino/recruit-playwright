// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

test.describe('Jobs Advanced Search - Primary Location Filter', () => {
    test('[C105637] Primary Location filter produces no console errors', async ({ jobsTrackingPage, jobsSearchFiltersData }) => {
        const consoleErrors = [];
        jobsTrackingPage.page.on('console', (msg) => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
        });
        jobsTrackingPage.page.on('pageerror', (err) => {
            consoleErrors.push(err.message);
        });

        await jobsTrackingPage.applySearchFilters(jobsSearchFiltersData, 'primaryLocation');

        expect(consoleErrors, `Console errors found: ${JSON.stringify(consoleErrors)}`).toHaveLength(0);
    });
});
