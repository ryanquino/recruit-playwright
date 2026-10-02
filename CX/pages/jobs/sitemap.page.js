class SitemapPage {
    constructor(page) {
        this.page = page;

        this.heading = page.getByRole('heading', { name: 'Sitemap', level: 1 });
        // Live-verified (2026-09-09): the sitemap's own link list lives in
        // #mainContent (a single <section class="sr-job-detail__description">
        // with a nested <ul>). The header/nav "Jobs"/"My Account" links sit
        // outside #mainContent, so this selector picks up only the sitemap's
        // own entries, not the banner duplicates.
        this.links = page.locator('#mainContent a[href]');
    }

    async goto() {
        await this.page.goto('playwrightqa/CorporateCareerPortal/sitemap');
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * All links listed on the sitemap page, deduped by href (some entries,
     * e.g. "Home" and "Jobs", point at the same URL).
     * @returns {Promise<{text: string, href: string}[]>}
     */
    async getAllLinks() {
        const rawLinks = await this.links.evaluateAll(anchors =>
            anchors.map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))
        );

        const seen = new Set();
        return rawLinks.filter(link => {
            if (!link.href || seen.has(link.href)) return false;
            seen.add(link.href);
            return true;
        });
    }

    /**
     * The numeric job ID from a job-detail URL ("/tenant/portal/jobs/171794" -> "171794").
     * The stable join key against the portal's own job list — see
     * jobs-list.page.js's getAllResultCardsAcrossPages().
     */
    static extractJobId(url) {
        const match = /\/jobs\/(\d+)(?:[/?#]|$)/.exec(url || '');
        return match ? match[1] : null;
    }
}

module.exports = SitemapPage;
