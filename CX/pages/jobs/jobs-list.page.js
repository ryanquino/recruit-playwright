class JobsListPage {
    constructor(page) {
        this.page = page;

        this.keywordSearchField = this.page.getByRole('searchbox', { name: 'Job Search' });
        this.searchIconButton = this.page.getByRole('button', { name: 'search' });
        // Live-verified (2026-09-15): this env's search-filters section now
        // auto-expands via JS shortly (~200ms) after page load, flipping the
        // toggle's accessible name from "Show search filters" to "Hide
        // search filters" — a fixed-name locator used to race that flip and
        // time out once the "Show" name no longer existed. Match either
        // state's name; ensureSearchFiltersExpanded() below decides whether
        // a click is still needed.
        this.showSearchFiltersLink = this.page.getByRole('link', { name: /search filters/i });
        this.locationDropdown = this.page.locator('#Jobs_JobSearch_LocationSelect-selectized');
        this.categoriesDropdown = this.page.locator('#Jobs_JobSearch_CategoriesSelect-selectized');
        this.positionTypeDropdown = this.page.locator('#Jobs_JobSearch_positionTypesSelect-selectized');
        this.createJobAlertLink = this.page.locator('a', { hasText: 'Create Job Alert' });
        this.jobAlertTitleField = this.page.getByLabel('Job Alert Title');
        this.emailAddressField = this.page.getByLabel('Email Address');
        this.createJobAlertButton = this.page.getByRole('button', { name: 'CREATE JOB ALERT' });
        this.flashMessageContainer = this.page.locator('#flashMessageContainer');
        this.flashMessageText = this.page.locator('#flashMessageText');
        this.jobPanelTitles = this.page.locator('a.sr-panel .sr-panel__title');
        this.nextPageButton = this.page.locator('#Jobs_PagedJobList_NextLink');
        this.prevPageButton = this.page.getByRole('button', { name: 'Prev' });
        this.pageIndicator = this.page.locator('text=/Page \\d+ of \\d+/').first();
        // Live-verified 2026-09-23: shown in place of results for a genuine
        // no-match search ("Can't find results that match" + a "NEW SEARCH"
        // link + a prompt to submit a resume/CV instead).
        this.noResultsMessage = this.page.getByText("Can't find results that match");
    }

    /** Navigate to a portal's job list — for RSS/sitemap completeness checks that need to drive more than one tenant portal (Corporate, Hourly, ...) from one page object. */
    async goto(tenantPortalPath) {
        await this.page.goto(tenantPortalPath);
        await this.page.waitForLoadState('domcontentloaded');
    }

    /** Same as goto(), but against an explicit host — for OpenSearch enabled/disabled parity tests that drive one page across two hosts within a single test. */
    async gotoOnHost(baseUrl, tenantPortalPath) {
        await this.page.goto(`${baseUrl.replace(/\/$/, '')}/${tenantPortalPath}`);
        await this.page.waitForLoadState('domcontentloaded');
    }

    /** Every job card on the current results page: title, location text, and href (the join key against RSS/sitemap — trackingCode is not reliably unique, see rss-feed.page.js). */
    async getAllResultCards() {
        return this.page.locator('a.sr-panel').evaluateAll(anchors =>
            anchors.map(a => ({
                title: a.querySelector('.sr-panel__title')?.textContent.trim() ?? '',
                location: a.querySelector('.sr-panel__location')?.textContent.trim() ?? '',
                href: a.getAttribute('href'),
            }))
        );
    }

    /**
     * Every job card across every page of results, not just the first.
     * Live-verified (2026-09-11): the default view paginates at 25 results
     * (a "Page X of Y" label + Next button), so a portal with more than 25
     * jobs (Hourly Career Portal: 50) silently truncates under
     * getAllResultCards() alone — every prior single-page consumer of that
     * method in this suite happened to be testing a portal at or under 25
     * jobs, which is why this went unnoticed until a completeness check
     * (comparing against the full RSS feed) needed the true total.
     * Live-verified (2026-09-11): on the last page the Next button stays in
     * the DOM (visible) but becomes disabled — it doesn't disappear — so
     * "does a Next button exist at all" (.count()) and "is it still
     * clickable" (.isEnabled()) are checked separately: a real failure from
     * .isEnabled() (page crash, network error) is left to propagate and
     * fail the test loudly, rather than being swallowed as "no more pages."
     */
    async getAllResultCardsAcrossPages() {
        const nextButton = this.page.getByRole('button', { name: 'Next' });
        const cards = [];
        const MAX_PAGES = 20;
        let sawLastPage = false;
        for (let i = 0; i < MAX_PAGES; i++) {
            cards.push(...await this.getAllResultCards());
            const hasNextButton = await nextButton.count() > 0;
            if (!hasNextButton || !await nextButton.isEnabled()) { sawLastPage = true; break; }
            const urlBeforeClick = this.page.url();
            try {
                await nextButton.click({ timeout: 10000 });
            } catch (error) {
                // Live-verified 2026-09-25 on WebKit: this races — isEnabled()
                // above can read true from a not-yet-fully-settled previous
                // page transition, and by the time this click actually
                // attempts the action, the button has already (correctly)
                // flipped disabled because that WAS the last page. Without
                // this, the click retries against a button that will never
                // become enabled again for the rest of the test timeout,
                // manifesting as confusing downstream failures (duplicate
                // jobs, missing sitemap entries) rather than the real cause.
                // Treat a click timeout the same as an upfront disabled
                // check: no further page to go to.
                sawLastPage = true;
                break;
            }
            // Same underlying race, different symptom: the click can
            // "succeed" (no exception) but land on a still-stale data-href
            // from before the previous transition fully settled, silently
            // re-submitting the SAME page — waitForLoadState('domcontentloaded')
            // alone doesn't catch this since it fires regardless of whether
            // the URL actually advanced, causing that page's cards to be
            // read twice on the next loop iteration. Confirm the URL
            // genuinely changed before trusting the click took effect.
            await this.page.waitForURL(url => url.toString() !== urlBeforeClick, { timeout: 10000 }).catch(() => {});
            await this.page.waitForLoadState('domcontentloaded');
        }
        // A silent truncation here would make every completeness check that
        // consumes this method (RSS, sitemap) falsely report real jobs as
        // "missing" — fail loudly instead of returning a partial list.
        if (!sawLastPage) {
            throw new Error(`getAllResultCardsAcrossPages() hit its ${MAX_PAGES}-page safety cap without the Next button reporting disabled — results are likely truncated. Raise MAX_PAGES if this portal genuinely has more than ${MAX_PAGES * 25} jobs.`);
        }
        return cards;
    }

    async getResultTitles() {
        const cards = await this.getAllResultCards();
        return cards.map(card => card.title);
    }

    async keywordSearch(keyword){
        await this.keywordSearchField.click();
        await this.keywordSearchField.fill(keyword);
        await this.searchIconButton.first().click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * The "Show/Hide search filters" toggle's accessible name auto-flips
     * shortly after page load (see the live-verified note on
     * showSearchFiltersLink above) as the site auto-expands the filters
     * section on its own. Poll its aria-expanded state for that transition
     * to settle (it's one-way: collapsed -> expanded, never observed to
     * revert) instead of clicking immediately, which used to race the
     * flip and either time out (name changed mid-wait) or, worse, click a
     * toggle that had just auto-expanded and collapse it back — which in
     * turn destabilized the layout underneath a still-open selectize
     * dropdown, causing the "element is not stable"/"intercepts pointer
     * events" failures seen downstream in locationSearch/categorySearch.
     */
    async ensureSearchFiltersExpanded() {
        const deadline = Date.now() + 2000;
        while (Date.now() < deadline && (await this.showSearchFiltersLink.getAttribute('aria-expanded')) !== 'true') {
            await this.page.waitForTimeout(100);
        }
        if ((await this.showSearchFiltersLink.getAttribute('aria-expanded')) !== 'true') {
            await this.showSearchFiltersLink.click();
        }
    }

    async locationSearch(country){
        await this.ensureSearchFiltersExpanded();
        await this.locationDropdown.click();
        await this.page.type('#Jobs_JobSearch_LocationSelect-selectized', country);
        await this.page.click('.selectize-dropdown-content .option[data-value="US"]');
        await this.searchIconButton.nth(1).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async categorySearch(category){
        await this.ensureSearchFiltersExpanded();
        await this.categoriesDropdown.click();
        await this.page.type('#Jobs_JobSearch_CategoriesSelect-selectized', category);
        await this.page.click('.selectize-dropdown-content .option[data-value="105"]');
        await this.searchIconButton.nth(1).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async positionTypeSearch(positionType){
        await this.ensureSearchFiltersExpanded();
        await this.positionTypeDropdown.click();
        await this.page.type('#Jobs_JobSearch_positionTypesSelect-selectized', positionType);
        // Live-verified (2026-09-03): unlike Location/Category, this
        // dropdown's data-value is a sanitized key ("FullTimeRegular"),
        // not the visible label ("Full-Time/Regular") — match on the
        // rendered option text instead.
        await this.page.locator('.selectize-dropdown-content .option', { hasText: positionType }).click();
        await this.searchIconButton.nth(1).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async isJobSearchSectionVisible(){
        return await this.page.locator('article.sr-search__section').first().isVisible();
    }

    // Walks every page of the job list (via #Jobs_PagedJobList_NextLink,
    // which self-disables on the last page) checking each page's job panels
    // for an exact title match, rather than using the keyword search box as
    // a shortcut — this needs a reliable exact-title check independent of
    // whatever the search box happens to match against (re-checked
    // 2026-09-23: it does filter correctly, but matches against broader job
    // content too — description/category, not just title — so it isn't a
    // safe substitute for an exact-title existence check here).
    async isJobTitleInList(jobTitle, { maxPages = 20 } = {}) {
        for (let page = 0; page < maxPages; page++) {
            await this.page.waitForLoadState('networkidle');
            const titles = await this.jobPanelTitles.allInnerTexts();
            if (titles.some(title => title.trim() === jobTitle)) return true;

            if (await this.nextPageButton.count() === 0) break;
            if (await this.nextPageButton.isDisabled()) break;
            await this.nextPageButton.click();
        }
        return false;
    }

    // [SC-064] Applies Category and Position Type together in a single
    // search, so both selections are sent as one request (AND/intersection),
    // rather than two sequential searches where the second would just
    // replace the first.
    async categoryAndPositionTypeSearch(category, categoryDataValue, positionType){
        await this.ensureSearchFiltersExpanded();
        await this.categoriesDropdown.click();
        await this.page.type('#Jobs_JobSearch_CategoriesSelect-selectized', category);
        await this.page.click(`.selectize-dropdown-content .option[data-value="${categoryDataValue}"]`);
        await this.positionTypeDropdown.click();
        await this.page.type('#Jobs_JobSearch_positionTypesSelect-selectized', positionType);
        await this.page.locator('.selectize-dropdown-content .option', { hasText: positionType }).click();
        await this.searchIconButton.nth(1).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async createJobAlert(jobAlertDetails){
        await this.createJobAlertLink.click();
        await this.jobAlertTitleField.fill(jobAlertDetails.jobTitle + " " + Date.now());
        await this.emailAddressField.fill(jobAlertDetails.emailAddress.replace('@', Date.now() + '@'));
        await this.page.selectOption('#Jobs_JobAlert_Frequency', { label: jobAlertDetails.frequency });
        await this.createJobAlertButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
    
}

module.exports = JobsListPage;