// @ts-check
const { test, expect } = require('../fixtures/administration-fixture');

// Every test below reads/writes the SAME "Manage Job List" settings form
// for portalId=2577 (Rich Text, Group By, Order By, Results Per Page all
// live on one page and one Save button) — live-verified (2026-08-27) that
// running the Rich Text and Display Options blocks concurrently (this
// config's fullyParallel default) races two workers' Save clicks against
// each other and corrupts both tests' assertions. Wrapping the whole file
// in one outer .serial() forces everything onto a single worker in
// declaration order so no two tests touch the shared form at once.
test.describe.serial('Manage Job List', () => {

// [C178]/[C179] Manage Job List - Rich Text Field Options. Live-verified
// (2026-08-27) against /playwrightqa/admin/JobBoards/JobList?portalId=2577:
// the TinyMCE editor's iframe is named "Admin_JobList__RichText_ifr", "Show
// Rich Text" already defaults to "Above Search Filters" on this portal, and
// saved text renders on the candidate-facing Job List page
// (playwrightqa/CorporateCareerPortal) — same page/session, no separate
// login needed since the candidate portal itself requires none. Restores
// the field to empty after each test — shared portal content, same
// convention as career-portal-job-details-hide-search-bar.spec.js's C163 restore.
test.describe('Manage Job List - Rich Text', () => {
    test.afterEach(async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        // The test body navigates away to the candidate-facing Job List
        // page to verify the saved text renders — go back to the admin
        // settings page first, since clearRichText() needs the TinyMCE
        // editor to be on-screen.
        await careerPortalJobListPage.goToJobListPage(careerPortalJobListData.portalId);
        await careerPortalJobListPage.clearRichText();
    });

    test('[C178] List of jobs are displaying in the portal', async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        await expect(careerPortalJobListPage.pageHeading).toBeVisible();
        const text = `${careerPortalJobListData.richTextSample} ${Date.now()}`;
        await careerPortalJobListPage.setRichText(text);

        await careerPortalJobListPage.page.goto(`${careerPortalJobListPage.cxAdminBaseUrl}/playwrightqa/CorporateCareerPortal`);
        await careerPortalJobListPage.page.waitForLoadState('domcontentloaded');
        await expect(careerPortalJobListPage.page.getByText(text)).toBeVisible();
    });

    test('[C179] Show Rich Text Above Search Filters', async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        const text = `${careerPortalJobListData.richTextSample} ${Date.now()}`;
        await careerPortalJobListPage.setRichText(text);
        await careerPortalJobListPage.setRichTextPosition('Above Search Filters');

        await careerPortalJobListPage.page.goto(`${careerPortalJobListPage.cxAdminBaseUrl}/playwrightqa/CorporateCareerPortal`);
        await careerPortalJobListPage.page.waitForLoadState('domcontentloaded');
        const richTextBox = await careerPortalJobListPage.page.getByText(text).boundingBox();
        const searchBoxBounds = await careerPortalJobListPage.page.getByRole('searchbox', { name: 'Job Search' }).boundingBox();
        if (!richTextBox || !searchBoxBounds) {
            throw new Error('Unable to locate rich text or search box elements for position verification');
        }
        expect(richTextBox.y).toBeLessThan(searchBoxBounds.y);
    });

    // [C180] Mirrors [C179] but flips the "Show Rich Text" dropdown to its
    // other option and asserts the opposite y-ordering against the same
    // Job Search searchbox — same page, same already-verified locators.
    test('[C180] Show Rich Text Below Search Filters', async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        const text = `${careerPortalJobListData.richTextSample} ${Date.now()}`;
        await careerPortalJobListPage.setRichText(text);
        await careerPortalJobListPage.setRichTextPosition('Below Search Filters');

        await careerPortalJobListPage.page.goto(`${careerPortalJobListPage.cxAdminBaseUrl}/playwrightqa/CorporateCareerPortal`);
        await careerPortalJobListPage.page.waitForLoadState('domcontentloaded');
        // Wait for the rich text to actually render before measuring — on the
        // slower CI runner boundingBox() was called before the element existed
        // and hung until the 60s test timeout.
        await expect(careerPortalJobListPage.page.getByText(text)).toBeVisible();
        const richTextBox = await careerPortalJobListPage.page.getByText(text).boundingBox();
        const searchBoxBounds = await careerPortalJobListPage.page.getByRole('searchbox', { name: 'Job Search' }).boundingBox();
        if (!richTextBox || !searchBoxBounds) {
            throw new Error('Unable to locate rich text or search box elements for position verification');
        }
        expect(richTextBox.y).toBeGreaterThan(searchBoxBounds.y);
    });

    // [C181] Clears the field via the same clearRichText() the afterEach
    // hook already uses for teardown, and asserts the candidate-facing
    // page shows no leftover rich text content.
    test('[C181] Delete all Rich Text', async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        const text = `${careerPortalJobListData.richTextSample} ${Date.now()}`;
        await careerPortalJobListPage.setRichText(text);
        await careerPortalJobListPage.clearRichText();

        await careerPortalJobListPage.page.goto(`${careerPortalJobListPage.cxAdminBaseUrl}/playwrightqa/CorporateCareerPortal`);
        await careerPortalJobListPage.page.waitForLoadState('domcontentloaded');
        await expect(careerPortalJobListPage.page.getByText(text)).not.toBeVisible();
    });
});

// [C182]-[C188] Manage Job List - Display Options (Group By / Order By).
// Live-verified (2026-08-27) against portalId=2577: the "Group By"/"Order
// By"/"Results Per Page" <select> elements are real (getByLabel resolves
// them), but Order By and Results Per Page only take effect once Group By
// is "Nothing" — confirmed via the page's own help text and a failing
// round-trip assertion when Group By was left on "Category". setOrderBy()/
// setResultsPerPage() force that precondition. Assertion is a round-trip
// check on the value setOption() actually applied (avoids "Category" vs.
// "Category (display hierarchy)" substring collisions), plus a
// candidate-facing check.
test.describe('Manage Job List - Display Options - Group/Order By', () => {
    test.afterEach(async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        await careerPortalJobListPage.goToJobListPage(careerPortalJobListData.portalId);
        await careerPortalJobListPage.setGroupBy(careerPortalJobListData.groupByOptions.nothing);
    });

    test('[C182] Select Display Options for Job List - Group By - Nothing', async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        await careerPortalJobListPage.setGroupBy(careerPortalJobListData.groupByOptions.category);
        const value = await careerPortalJobListPage.setGroupBy(careerPortalJobListData.groupByOptions.nothing);
        await expect(careerPortalJobListPage.groupByDropdown).toHaveValue(value);

        await careerPortalJobListPage.goToCandidateJobListPage();
        await expect(careerPortalJobListPage.candidateJobListings.first()).toBeVisible();
    });

    test('[C183] Select Display Options for Job List - Group By - Category', async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        const value = await careerPortalJobListPage.setGroupBy(careerPortalJobListData.groupByOptions.category);
        await expect(careerPortalJobListPage.groupByDropdown).toHaveValue(value);

        await careerPortalJobListPage.goToCandidateJobListPage();
        await expect(careerPortalJobListPage.candidateJobListings.first()).toBeVisible();
    });

    test('[C184] Select Display Options for Job List - Group By - Category (display hierarchy)', async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        const value = await careerPortalJobListPage.setGroupBy(careerPortalJobListData.groupByOptions.categoryHierarchy);
        await expect(careerPortalJobListPage.groupByDropdown).toHaveValue(value);

        await careerPortalJobListPage.goToCandidateJobListPage();
        await expect(careerPortalJobListPage.candidateJobListings.first()).toBeVisible();
    });

    test('[C185] Select Display Options for Job List - Order By - Posting Date ASC', async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        const value = await careerPortalJobListPage.setOrderBy(careerPortalJobListData.orderByOptions.postingDateAsc);
        await expect(careerPortalJobListPage.orderByDropdown).toHaveValue(value);

        await careerPortalJobListPage.goToCandidateJobListPage();
        await expect(careerPortalJobListPage.candidateJobListings.first()).toBeVisible();
    });

    test('[C186] Select Display Options for Job List - Order By - Posting Date DESC', async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        const value = await careerPortalJobListPage.setOrderBy(careerPortalJobListData.orderByOptions.postingDateDesc);
        await expect(careerPortalJobListPage.orderByDropdown).toHaveValue(value);

        await careerPortalJobListPage.goToCandidateJobListPage();
        await expect(careerPortalJobListPage.candidateJobListings.first()).toBeVisible();
    });

    test('[C187] Select Display Options for Job List - Order By - Job Title ASC', async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        const value = await careerPortalJobListPage.setOrderBy(careerPortalJobListData.orderByOptions.jobTitleAsc);
        await expect(careerPortalJobListPage.orderByDropdown).toHaveValue(value);

        await careerPortalJobListPage.goToCandidateJobListPage();
        const titles = await careerPortalJobListPage.candidateJobListings.locator('h3').allTextContents();
        const sorted = [...titles].sort((a, b) => a.localeCompare(b));
        expect(titles).toEqual(sorted);
    });

    test('[C188] Select Display Options for Job List - Order By - Job Title DESC', async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        const value = await careerPortalJobListPage.setOrderBy(careerPortalJobListData.orderByOptions.jobTitleDesc);
        await expect(careerPortalJobListPage.orderByDropdown).toHaveValue(value);

        await careerPortalJobListPage.goToCandidateJobListPage();
        const titles = await careerPortalJobListPage.candidateJobListings.locator('h3').allTextContents();
        const sorted = [...titles].sort((a, b) => b.localeCompare(a));
        expect(titles).toEqual(sorted);
    });
});

// [C189] Manage Job List - Display Options - Results Per Page. Same
// Group-By-must-be-Nothing precondition as the block above; the count
// assertion against candidateJobListings is the one relatively low-risk
// signal here since that locator is already used by jobs-list.page.js for
// job cards on this same career site.
test.describe('Manage Job List - Display Options - Results Per Page', () => {
    test.afterEach(async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        await careerPortalJobListPage.goToJobListPage(careerPortalJobListData.portalId);
        await careerPortalJobListPage.setResultsPerPage(careerPortalJobListData.resultsPerPageOptions.twentyFive);
    });

    test('[C189] Select Display Options for Job List - Results Per Page - 10', async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        const value = await careerPortalJobListPage.setResultsPerPage(careerPortalJobListData.resultsPerPageOptions.ten);
        await expect(careerPortalJobListPage.resultsPerPageDropdown).toHaveValue(value);

        await careerPortalJobListPage.goToCandidateJobListPage();
        const count = await careerPortalJobListPage.candidateJobListings.count();
        expect(count).toBeLessThanOrEqual(10);
    });

    // [C190] Mirrors [C189] with the other option — round-trip check only,
    // since 25 is already >= the portal's actual job count so a candidate-
    // facing count assertion wouldn't distinguish it from the unset state.
    test('[C190] Select Display Options for Job List - Results Per Page - 25', async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        const value = await careerPortalJobListPage.setResultsPerPage(careerPortalJobListData.resultsPerPageOptions.twentyFive);
        await expect(careerPortalJobListPage.resultsPerPageDropdown).toHaveValue(value);

        await careerPortalJobListPage.goToCandidateJobListPage();
        const count = await careerPortalJobListPage.candidateJobListings.count();
        expect(count).toBeLessThanOrEqual(25);
    });
});

// [C191]-[C196] Manage Job List - Job Location Details / Job Search
// Filters. Live-verified (2026-08-27) via full-page aria snapshot: the
// Job Location Format <select> and the four role=switch toggles are real.
// This portal's default location format is already "City, State Code",
// so [C191] switches to a distinct value (City, Country Code) to get a
// meaningful round-trip, then afterEach restores the state-inclusive
// default — same "restore shared portal setting" convention as the Rich
// Text block. The four switches default to checked/on; [C193]-[C196] each
// toggle to unchecked/off and restore.
test.describe('Manage Job List - Job Location Details & Search Filters', () => {
    test.afterEach(async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        await careerPortalJobListPage.goToJobListPage(careerPortalJobListData.portalId);
        await careerPortalJobListPage.setJobLocationFormat(careerPortalJobListData.jobLocationFormatOptions.cityState);
        await careerPortalJobListPage.setCollapseSearchFilters(true);
        await careerPortalJobListPage.setSearchByLocation(true);
        await careerPortalJobListPage.setSearchByCategory(true);
        await careerPortalJobListPage.setSearchByPositionType(true);
        await careerPortalJobListPage.setDisplayLocationCount(false);
    });

    test('[C191] Select Job Location Details - Job Location Format', async ({ careerPortalJobListPage, careerPortalJobListData }) => {
        const value = await careerPortalJobListPage.setJobLocationFormat(careerPortalJobListData.jobLocationFormatOptions.cityCountryCode);
        await expect(careerPortalJobListPage.jobLocationFormatDropdown).toHaveValue(value);
    });

    test('[C192] Enable Job Location Details - Display count of additional locations', async ({ careerPortalJobListPage }) => {
        await careerPortalJobListPage.setDisplayLocationCount(true);
        await expect(careerPortalJobListPage.displayLocationCountSwitch).toHaveAttribute('aria-checked', 'true');
    });

    test('[C193] Enable Job Search Filters - Collapse search filter section by default', { tag: '@smoke' }, async ({ careerPortalJobListPage }) => {
        await careerPortalJobListPage.setCollapseSearchFilters(false);
        await expect(careerPortalJobListPage.collapseSearchFiltersSwitch).toHaveAttribute('aria-checked', 'false');
    });

    test('[C194] Enable Job Search Filters - Search jobs by location', async ({ careerPortalJobListPage }) => {
        await careerPortalJobListPage.setSearchByLocation(false);
        await expect(careerPortalJobListPage.searchByLocationSwitch).toHaveAttribute('aria-checked', 'false');
    });

    test('[C195] Enable Job Search Filters - Search jobs by category', async ({ careerPortalJobListPage }) => {
        await careerPortalJobListPage.setSearchByCategory(false);
        await expect(careerPortalJobListPage.searchByCategorySwitch).toHaveAttribute('aria-checked', 'false');
    });

    test('[C196] Enable Job Search Filters - Search jobs by position type', async ({ careerPortalJobListPage }) => {
        await careerPortalJobListPage.setSearchByPositionType(false);
        await expect(careerPortalJobListPage.searchByPositionTypeSwitch).toHaveAttribute('aria-checked', 'false');
    });
});

}); // end outer .serial('Manage Job List')
