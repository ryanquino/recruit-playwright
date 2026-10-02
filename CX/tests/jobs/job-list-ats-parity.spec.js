// @ts-check
const { test, expect } = require('../fixtures/job-list-ats-parity-fixture');
const RssFeedPage = require('../../pages/jobs/rss-feed.page');

// Job Search / List — OpenSearch enabled/disabled parity AND cross-checks
// against ATS ground truth, for playwrightqa/CorporateCareerPortal2
// (CX/test-data/jobs/job-list-ats-parity.json). Covers the test-design rows
// that were either uncovered or only partially covered (visibility-only, no
// result-content assertion) — see the conversation history for the full
// row-by-row audit. Deliberately EXCLUDES Combined Filters: already
// live-verified on the separate, unmerged
// automated-tests/opensearch-migration-sc063-064-065-074-079 branch
// ([SC-064]), not reimplemented here to avoid duplicate/diverging coverage
// of the same scenario.
test.describe('Job Search / List — ATS & OpenSearch parity', () => {
    // Default View: same job count/set on both hosts across full
    // pagination, PLUS a known ATS-open job (173194) must appear on both.
    // "No unexpected/hidden jobs appear" is already covered by
    // jobs-list.spec.js's "Deactivated Job Not Visible on CX" and "Non-Open
    // Jobs Not Visible on CX" (On Hold/Closed/Limited) — not duplicated here.
    test('Default view shows the same job set on both hosts, including a known ATS-open job', async ({ jobsListPage, jobListAtsParityData, openSearchEnabledBaseUrl, openSearchDisabledBaseUrl }) => {
        test.setTimeout(120_000);
        const { portalPath, defaultView } = jobListAtsParityData;
        const { jobTitle } = defaultView.knownOpenJob;

        await jobsListPage.gotoOnHost(openSearchEnabledBaseUrl, portalPath);
        const enabledCards = await jobsListPage.getAllResultCardsAcrossPages();

        await jobsListPage.gotoOnHost(openSearchDisabledBaseUrl, portalPath);
        const disabledCards = await jobsListPage.getAllResultCardsAcrossPages();

        expect(enabledCards.length, 'no jobs found on the enabled host to compare').toBeGreaterThan(0);
        expect.soft(enabledCards.map(c => c.title), 'known ATS-open job missing from the enabled host').toContain(jobTitle);
        expect.soft(disabledCards.map(c => c.title), 'known ATS-open job missing from the disabled host').toContain(jobTitle);

        const enabledIds = new Set(enabledCards.map(c => RssFeedPage.extractJobId(c.href)).filter(Boolean));
        const disabledIds = new Set(disabledCards.map(c => RssFeedPage.extractJobId(c.href)).filter(Boolean));
        const onlyEnabled = [...enabledIds].filter(id => !disabledIds.has(id));
        const onlyDisabled = [...disabledIds].filter(id => !enabledIds.has(id));
        expect.soft(onlyEnabled, `job(s) present on enabled but missing from disabled: ${onlyEnabled.join(', ')}`).toEqual([]);
        expect.soft(onlyDisabled, `job(s) present on disabled but missing from enabled: ${onlyDisabled.join(', ')}`).toEqual([]);
    });

    // Location filter: live-verified 2026-09-23, this is a genuine,
    // INTERMITTENT bug, not a one-time fluke — same session, same enabled
    // host, three checks minutes apart: (1) 43 results, 14 from 7 OTHER
    // countries (Mexico, France, Germany, China, UK, Denmark, Canada); (2)
    // 28 results, zero non-US entries; (3) back to the ~43/16-wrong state,
    // reproducing identically on BOTH hosts (symmetric — points at a
    // shared indexing/caching layer underneath both, not something
    // OpenSearch-enabled-specific). Not filed as a ticket yet. Left as a
    // real (non-skipped) assertion, expected to flap — a pass here means
    // "not reproducing at this exact moment," not "fixed." Verified
    // directly off each result card's own location text (no per-job
    // detail-page visits needed — location renders right on the list
    // card). Also checks both
    // hosts return the same job set for this filter.
    test('Location filter ("United States") excludes non-US jobs on both hosts', async ({ jobsListPage, jobListAtsParityData, openSearchEnabledBaseUrl, openSearchDisabledBaseUrl }) => {
        test.setTimeout(120_000);
        const { portalPath, locationFilter } = jobListAtsParityData;
        const { country, knownNonUsLocationMarkers } = locationFilter;

        await jobsListPage.gotoOnHost(openSearchEnabledBaseUrl, portalPath);
        await jobsListPage.locationSearch(country);
        const enabledCards = await jobsListPage.getAllResultCardsAcrossPages();

        await jobsListPage.gotoOnHost(openSearchDisabledBaseUrl, portalPath);
        await jobsListPage.locationSearch(country);
        const disabledCards = await jobsListPage.getAllResultCardsAcrossPages();

        expect(enabledCards.length, 'no results found for the United States location filter on the enabled host').toBeGreaterThan(0);
        expect(disabledCards.length, 'no results found for the United States location filter on the disabled host').toBeGreaterThan(0);

        for (const [name, cards] of [['enabled', enabledCards], ['disabled', disabledCards]]) {
            const wronglyIncluded = cards.filter(card => knownNonUsLocationMarkers.some(marker => card.location.includes(marker)));
            expect.soft(
                wronglyIncluded.map(c => `${c.title} (${c.location})`),
                `job(s) from a non-US location returned under the "United States" filter on the ${name} host`
            ).toEqual([]);
        }

        const enabledIds = new Set(enabledCards.map(c => RssFeedPage.extractJobId(c.href)).filter(Boolean));
        const disabledIds = new Set(disabledCards.map(c => RssFeedPage.extractJobId(c.href)).filter(Boolean));
        const onlyEnabled = [...enabledIds].filter(id => !disabledIds.has(id));
        const onlyDisabled = [...disabledIds].filter(id => !enabledIds.has(id));
        expect.soft(onlyEnabled, `job(s) present on enabled but missing from disabled for this filter: ${onlyEnabled.join(', ')}`).toEqual([]);
        expect.soft(onlyDisabled, `job(s) present on disabled but missing from enabled for this filter: ${onlyDisabled.join(', ')}`).toEqual([]);
    });

    // Category filter: only 4 results for "Human Resources" on this
    // portal — small enough to open every one, on both hosts, and confirm
    // its own Category section (source of truth, mirrors the job's real
    // ATS category) actually says "Human Resources", rather than just
    // checking the results section rendered (see [C8] in jobs-list.spec.js,
    // which only does the latter).
    test('Category filter ("Human Resources") returns only matching jobs on both hosts', async ({ jobsListPage, jobDetailsPage, jobListAtsParityData, openSearchEnabledBaseUrl, openSearchDisabledBaseUrl }) => {
        test.setTimeout(150_000);
        const { portalPath, categoryFilter } = jobListAtsParityData;
        const { category } = categoryFilter;

        for (const [name, baseUrl] of [['enabled', openSearchEnabledBaseUrl], ['disabled', openSearchDisabledBaseUrl]]) {
            await jobsListPage.gotoOnHost(baseUrl, portalPath);
            await jobsListPage.categorySearch(category);
            const cards = await jobsListPage.getAllResultCardsAcrossPages();
            expect(cards.length, `no results found for the "${category}" category filter on the ${name} host`).toBeGreaterThan(0);

            for (const card of cards) {
                const jobId = RssFeedPage.extractJobId(card.href);
                expect.soft(jobId, `could not extract a job id from href "${card.href}" on the ${name} host`).toBeTruthy();
                if (!jobId) continue;

                await jobDetailsPage.navigateToJobByIdOnHost(baseUrl, portalPath, jobId);
                await expect.soft(
                    jobDetailsPage.categorySection,
                    `"${card.title}" (job ${jobId}, ${name} host) does not show category "${category}"`
                ).toContainText(category);
            }
        }
    });

    // Position Type filter: this portal's filter only offers a single real
    // value ("Full-Time/Regular" — live-verified 2026-09-23, no other
    // option exists in the dropdown), so there's no "different type" job to
    // use as a negative/exclusion case — this only proves the positive
    // side. 43 results is too many to open every detail page on both hosts
    // without making this test slow, so a bounded sample is checked
    // instead (see sampleSize in the test data) — same trade-off
    // getAllResultCardsAcrossPages() itself accepts elsewhere in this
    // suite for large result sets.
    test('Position Type filter ("Full-Time/Regular") returns only matching jobs on both hosts (sampled)', async ({ jobsListPage, jobDetailsPage, jobListAtsParityData, openSearchEnabledBaseUrl, openSearchDisabledBaseUrl }) => {
        test.setTimeout(150_000);
        const { portalPath, positionTypeFilter } = jobListAtsParityData;
        const { positionType, sampleSize } = positionTypeFilter;

        for (const [name, baseUrl] of [['enabled', openSearchEnabledBaseUrl], ['disabled', openSearchDisabledBaseUrl]]) {
            await jobsListPage.gotoOnHost(baseUrl, portalPath);
            await jobsListPage.positionTypeSearch(positionType);
            const cards = await jobsListPage.getAllResultCardsAcrossPages();
            expect(cards.length, `no results found for the "${positionType}" position type filter on the ${name} host`).toBeGreaterThan(0);

            for (const card of cards.slice(0, sampleSize)) {
                const jobId = RssFeedPage.extractJobId(card.href);
                expect.soft(jobId, `could not extract a job id from href "${card.href}" on the ${name} host`).toBeTruthy();
                if (!jobId) continue;

                await jobDetailsPage.navigateToJobByIdOnHost(baseUrl, portalPath, jobId);
                await expect.soft(
                    jobDetailsPage.positionTypeSection,
                    `"${card.title}" (job ${jobId}, ${name} host) does not show position type "${positionType}"`
                ).toContainText(positionType);
            }
        }
    });

    // Keyword Search: previously believed broken (a prior investigation
    // found the enabled host's search returned the same unfiltered catalog
    // regardless of query — see the now-stale comment on
    // JobsListPage.isJobTitleInList()). Re-verified live 2026-09-23: it
    // filters correctly on both hosts today. Note a genuine behavioral
    // difference, not asserted as a parity failure here — the enabled host
    // matches against broader job content (description/category, not just
    // title), returning a few extra loosely-related jobs a plain-text
    // search on the disabled host doesn't; e.g. "Fee Agency" returns 3
    // results on enabled vs. exactly 1 (the title match) on disabled. Both
    // are "working" by the only claim being tested here — does it actually
    // narrow the result set and surface the expected job — so this checks
    // that on each host independently rather than requiring identical
    // result sets between them.
    test('Keyword search narrows the default result set and includes a known matching job, on both hosts', async ({ jobsListPage, jobListAtsParityData, openSearchEnabledBaseUrl, openSearchDisabledBaseUrl }) => {
        test.setTimeout(120_000);
        const { portalPath, keywordSearch: keywordSearchData } = jobListAtsParityData;
        const { keyword, expectedJobTitle } = keywordSearchData;

        for (const [name, baseUrl] of [['enabled', openSearchEnabledBaseUrl], ['disabled', openSearchDisabledBaseUrl]]) {
            await jobsListPage.gotoOnHost(baseUrl, portalPath);
            const baselineCards = await jobsListPage.getAllResultCardsAcrossPages();
            expect(baselineCards.length, `no jobs found in the default view on the ${name} host to compare against`).toBeGreaterThan(0);

            await jobsListPage.keywordSearch(keyword);
            const resultCards = await jobsListPage.getAllResultCardsAcrossPages();

            expect.soft(
                resultCards.length,
                `keyword "${keyword}" returned as many (or more) results as the unfiltered default view on the ${name} host — search does not appear to be filtering`
            ).toBeLessThan(baselineCards.length);
            expect.soft(
                resultCards.map(c => c.title),
                `known matching job "${expectedJobTitle}" missing from the ${name} host's results for keyword "${keyword}"`
            ).toContain(expectedJobTitle);
        }
    });

    // Pagination: walks every page via the already-hardened
    // getAllResultCardsAcrossPages() (fails loudly rather than silently
    // truncating) and confirms zero duplicate jobs (by href, since this
    // catalog has genuinely duplicate-titled jobs — see that method's own
    // comment) across the ENTIRE result set, not just two adjacent pages —
    // on both hosts. This does NOT reconcile the total against an ATS-side
    // published-job count — ATS's own Job Tracking search has no
    // "published to this CX portal" filter to make that comparison
    // meaningful (its filters are Job Title/Status/Location/etc., not
    // portal membership), so a true ATS count cross-check isn't
    // implemented here. What this does confirm: internal
    // completeness/uniqueness of the full paginated result set, on each
    // host, plus that both hosts agree on the set (already covered by the
    // Default View test above, so not re-asserted here to avoid
    // duplication).
    test('Pagination shows every job exactly once across all pages, no duplicates, on both hosts', async ({ jobsListPage, jobListAtsParityData, openSearchEnabledBaseUrl, openSearchDisabledBaseUrl }) => {
        test.setTimeout(120_000);
        const { portalPath } = jobListAtsParityData;

        for (const [name, baseUrl] of [['enabled', openSearchEnabledBaseUrl], ['disabled', openSearchDisabledBaseUrl]]) {
            await jobsListPage.gotoOnHost(baseUrl, portalPath);
            const cards = await jobsListPage.getAllResultCardsAcrossPages();
            expect(cards.length, `no jobs found across any page of the default view on the ${name} host`).toBeGreaterThan(0);

            const hrefs = cards.map(c => c.href);
            const uniqueHrefs = new Set(hrefs);
            const duplicates = hrefs.filter((href, i) => hrefs.indexOf(href) !== i);
            expect.soft(duplicates, `duplicate job(s) appeared across pages on the ${name} host: ${duplicates.join(', ')}`).toEqual([]);
            expect(uniqueHrefs.size, `duplicate count mismatch on the ${name} host`).toBe(cards.length);
        }
    });

    // Empty State: a nonsense search term should show the portal's own
    // "no results" state, not an error or a silently blank page — on both
    // hosts.
    test('Search with no matches shows the "no results" empty state on both hosts', async ({ jobsListPage, jobListAtsParityData, openSearchEnabledBaseUrl, openSearchDisabledBaseUrl }) => {
        const { portalPath, emptyState } = jobListAtsParityData;
        const { noMatchKeyword, noResultsMessage } = emptyState;

        for (const [name, baseUrl] of [['enabled', openSearchEnabledBaseUrl], ['disabled', openSearchDisabledBaseUrl]]) {
            await jobsListPage.gotoOnHost(baseUrl, portalPath);
            await jobsListPage.keywordSearch(noMatchKeyword);
            await expect(jobsListPage.noResultsMessage, `"no results" message did not appear on the ${name} host`).toContainText(noResultsMessage);
            expect(await jobsListPage.getAllResultCards(), `expected zero result cards on the ${name} host`).toEqual([]);
        }
    });
});
