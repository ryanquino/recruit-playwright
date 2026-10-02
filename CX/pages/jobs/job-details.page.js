class JobDetailsPage {
    constructor(page) {
        this.page = page;

        // Job detail section locators
        this.jobTitleHeading = this.page.locator('#Jobs_JobDetail_TitleText');
        // "Basic" (non-Configured) Job Details page template's own location
        // text — distinct from the Configured template's
        // #ConfigurablePageDetail__DisplayLocation below.
        this.jobLocationText = this.page.locator('#Jobs_JobDetail_LocationText');
        this.categorySection = this.page.locator('#ConfigurablePageDetail__DisplayCategory');
        this.jobLocationSection = this.page.locator('#ConfigurablePageDetail__DisplayLocation');
        this.trackingCodeSection = this.page.locator('#ConfigurablePageDetail__TrackingCode');
        this.positionTypeSection = this.page.locator('#ConfigurablePageDetail__DisplayPosition');
        this.jobDescriptionSection = this.page.locator('#ConfigurablePageDetail__JobDescription');
        this.requiredSkillsSection = this.page.locator('#ConfigurablePageDetail__RequiredSkills');
        this.requiredExperienceSection = this.page.locator('#ConfigurablePageDetail__RequiredExperience');
        this.additionalLocationsSection = this.page.locator('#ConfigurablePageDetail__DisplayAdditionalLocations');
        this.allLocationsSection = this.page.locator('#ConfigurablePageDetail__DisplayAllLocations');
        this.industrySection = this.page.locator('#ConfigurablePageDetail__DisplayIndustry');
        this.jobDurationSection = this.page.locator('#ConfigurablePageDetail__DisplayJobDuration');
        this.jobLevelSection = this.page.locator('#ConfigurablePageDetail__DisplayJobLevel');
        this.levelOfEducationSection = this.page.locator('#ConfigurablePageDetail__DisplayLevelOfEducation');
        this.maximumSalarySection = this.page.locator('#ConfigurablePageDetail__DisplayMaxSalary');
        this.minimumSalarySection = this.page.locator('#ConfigurablePageDetail__DisplayMinSalary');
        this.postedDateSection = this.page.locator('#ConfigurablePageDetail__PostingDate');
        this.salaryCurrencySection = this.page.locator('#ConfigurablePageDetail__SalaryCurrencyCode');
        this.salaryRangeSection = this.page.locator('#ConfigurablePageDetail__DisplaySalaryRange');
        this.salaryTypeSection = this.page.locator('#ConfigurablePageDetail__DisplaySalaryType');
        this.travelRequirementsSection = this.page.locator('#ConfigurablePageDetail__DisplayTravelRequirements');
        this.yearsOfExperienceSection = this.page.locator('#ConfigurablePageDetail__DisplayYearsOfExperience');
        this.exemptionStatusSection = this.page.locator('#ConfigurablePageDetail__worldco_exempstatus');
        this.jobGradeSection = this.page.locator('#ConfigurablePageDetail__worldco_jobgrade');
        this.customFieldTextSection = this.page.locator('#ConfigurablePageDetail__customfieldtext');
        this.customFieldTextareaSection = this.page.locator('#ConfigurablePageDetail__customfieldtextarea');
        this.customFieldDropdownSection = this.page.locator('#ConfigurablePageDetail__customfielddropdown');
        this.customFieldMultiselectSection = this.page.locator('#ConfigurablePageDetail__customfieldmultiselect');
        this.hiringManagerSection = this.page.locator('#ConfigurablePageDetail__HiringManager');
        this.companyLocationSection = this.page.locator('#ConfigurablePageDetail__DisplayCompanyLocation');
        // Live-verified 2026-09-23: this custom "Rich Text" field type's id
        // has a per-instance generated suffix (unlike every other section's
        // fixed name) — pinned to this specific field ("Playwright Rich
        // Text Field") as it exists today; re-verify if it's ever recreated.
        this.richTextSection = this.page.locator('#ConfigurablePageDetail__CXRichText_dda5c1129127');

        // [C163] "Search jobs by keywords" bar, toggled via
        // CareerPortalJobDetailsPage.setHideJobSearchBar()
        this.keywordSearchField = page.getByRole('searchbox', { name: 'Job Search' });

        // Shown instead of the job detail sections above when a job id no
        // longer resolves to a live posting (e.g. deactivated/closed).
        this.jobNotFoundMessage = this.page.getByText('We apologize for the inconvenience, but we cannot find this position.', { exact: false });

        // Job list panels — the same markup navigateToJobDetails() clicks.
        this.jobPanels = this.page.locator('a.sr-panel');

        // [TC-31348] Live-verified 2026-09-30 (MCPortal on luceeqa01): a
        // <div id="indeedApplyButton"> injected with Indeed's
        // awi-bootstrap.js, not a <button> — no role to target. Only
        // rendered when the portal's Indeed Integrations are enabled.
        this.applyWithIndeedButton = this.page.locator('#indeedApplyButton');
    }

    async goToCareerPortal(portalPath) {
        await this.page.goto(portalPath);
        await this.page.waitForLoadState('domcontentloaded');
    }

    // Opens the first job on the job list ("any job") and returns its title
    // and id, so the caller can confirm it landed on that job's details and
    // come back to the same job later via navigateToJobById().
    async navigateToFirstJobDetails() {
        const firstPanel = this.jobPanels.first();
        const jobTitle = (await firstPanel.locator('.sr-panel__title').textContent()).trim();
        const jobId = (await firstPanel.getAttribute('href')).match(/\/jobs\/(\d+)/)[1];
        await firstPanel.click();
        await this.page.waitForLoadState('domcontentloaded');
        return { jobTitle, jobId };
    }

    async navigateToJobDetails(jobTitle) {
        await this.page.click(`a.sr-panel:has(.sr-panel__title:has-text("${jobTitle.replace(/"/g, '\\"')}"))`);
        await this.page.waitForLoadState('domcontentloaded');
    }

    // Searches the candidate portal for a job by keyword/title, then opens
    // its details. Retries the search (with reloads) until the job panel
    // appears — OpenSearch indexes create/edit changes asynchronously, so a
    // freshly created/edited job may not show up on the first search.
    async searchAndOpenJobDetails(jobTitle, { retries = 6, intervalMs = 15000 } = {}) {
        const panel = this.page.locator(`a.sr-panel:has(.sr-panel__title:has-text("${jobTitle.replace(/"/g, '\\"')}"))`);
        for (let attempt = 0; attempt < retries; attempt++) {
            const searchField = this.page.getByRole('searchbox', { name: 'Job Search' });
            await searchField.click();
            await searchField.fill(jobTitle);
            await this.page.getByRole('button', { name: 'search' }).first().click();
            await this.page.waitForLoadState('domcontentloaded');
            if (await panel.first().isVisible().catch(() => false)) {
                break;
            }
            // Not indexed yet — wait and reload the portal before retrying.
            await this.page.waitForTimeout(intervalMs);
            await this.page.reload();
            await this.page.waitForLoadState('domcontentloaded');
        }
        await panel.first().click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    getJobTitleHeading() {
        return this.jobTitleHeading;
    }

    // Navigates straight to a job's CX detail page by id, bypassing the
    // portal's own job search/panels — needed for a deactivated job, which
    // no longer surfaces through search.
    async navigateToJobById(portalPath, jobId) {
        await this.page.goto(`${portalPath}/jobs/${jobId}`);
        await this.page.waitForLoadState('domcontentloaded');
    }

    /** Same as navigateToJobById(), but against an explicit host — for OpenSearch enabled/disabled parity tests. */
    async navigateToJobByIdOnHost(baseUrl, portalPath, jobId) {
        await this.page.goto(`${baseUrl.replace(/\/$/, '')}/${portalPath}/jobs/${jobId}`);
        await this.page.waitForLoadState('domcontentloaded');
    }

    // Polls a just-deactivated job's own CX detail page for the "position
    // not found" message. Live-verified (2026-09-14): deactivating a job in
    // ATS doesn't hide it from CX instantly — the same async-indexing delay
    // documented elsewhere in this suite (searchAndOpenJobDetails() above,
    // job-details.spec.js's OpenSearch waits) applies here too.
    async waitForJobNotFound(portalPath, jobId, { retries = 6, intervalMs = 15000 } = {}) {
        for (let attempt = 0; attempt < retries; attempt++) {
            await this.navigateToJobById(portalPath, jobId);
            if (await this.jobNotFoundMessage.isVisible().catch(() => false)) {
                return;
            }
            await this.page.waitForTimeout(intervalMs);
        }
        // Final attempt — let the caller's own assertion report the failure
        // with a clear expected/actual diff instead of a generic timeout here.
        await this.navigateToJobById(portalPath, jobId);
    }

    async isApplyButtonVisibleAndClickable() {
        await this.page.waitForLoadState('domcontentloaded');
        // Live-verified (2026-09-15): jobs on this env can be reached via
        // either the classic Quick Apply flow ("#Jobs_JobDetail_ApplyLink")
        // or the Configured/Multiform apply flow
        // ("#Jobs_JobDetail_Multiform_ApplyLink") — even jobs previously
        // reached only through the classic id (e.g. "Playwright CX Test
        // Quick Apply") now render with the Multiform id instead. Only one
        // of the two exists on a given job's page, so check whichever is
        // actually present rather than assuming the classic id.
        const applyButton = this.page.locator('#Jobs_JobDetail_ApplyLink, #Jobs_JobDetail_Multiform_ApplyLink');
        const isVisible = await applyButton.isVisible();
        const isEnabled = await applyButton.isEnabled();
        return isVisible && isEnabled;
    }

    /**
     * The page's schema.org JobPosting JSON-LD block — live-verified
     * (2026-09-11) present and populated on the bare default layout (job
     * 164552, Corporate Career Portal), independent of the "Configured Job
     * Details Page" template this env is missing (see [C164]'s fixme note).
     * A server-rendered, structured ground truth for a job's real category/
     * location/tracking code — used by rss-feed.spec.js to verify feed
     * content against the job itself instead of a second host.
     * Returns null if the job has no JSON-LD block, rather than throwing —
     * callers should treat that as a finding to surface, not a crash.
     */
    async getStructuredData() {
        const script = this.page.locator('script[type="application/ld+json"]').first();
        if (await script.count() === 0) return null;
        const raw = await script.textContent();
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

}

module.exports = JobDetailsPage;