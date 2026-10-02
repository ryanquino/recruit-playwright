// @ts-check
const { test, expect } = require('../fixtures/jobs-fixture');

function isAscending(values) {
    const nonEmpty = values.map((v) => v.trim()).filter((v) => v.length > 0);
    // numeric: true — Tracking Code values are numeric (e.g. "9", "10"); a
    // plain string sort would put "10" before "9".
    const sorted = [...nonEmpty].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }));
    return JSON.stringify(nonEmpty) === JSON.stringify(sorted);
}

const sortableColumns = [
    { header: 'Internal Job Title', headerLocatorKey: 'internalJobTitleColumnHeader' },
    { header: 'Tracking Code', headerLocatorKey: 'trackingCodeColumnHeader' },
    { header: 'Location', headerLocatorKey: 'locationColumnHeader' },
    { header: 'Posting Status', headerLocatorKey: 'postingStatusColumnHeader' },
];

test.describe('Job Tracking - sorting results columns', () => {
    test('[C207] sorting results - columns', async ({ jobsTrackingPage }) => {
        await jobsTrackingPage.resetToDefaultView();
        for (const column of sortableColumns) {
            await jobsTrackingPage.sortByColumnHeader(jobsTrackingPage[column.headerLocatorKey]);
            const values = await jobsTrackingPage.getColumnValues(column.header);
            expect(isAscending(values), `${column.header} column is not sorted ascending: ${JSON.stringify(values)}`).toBeTruthy();
        }
    });
});
