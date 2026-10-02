/**
 * The real, machine-readable /sitemap.xml (sitemaps.org protocol) — a
 * completely different artifact from SitemapPage's candidate-facing HTML
 * "Sitemap" page (same word, unrelated feature; that page lives at
 * /playwrightqa/CorporateCareerPortal/sitemap, no .xml).
 *
 * Live-verified (2026-09-11): the root /sitemap.xml is a <sitemapindex>
 * listing one child <urlset> per TENANT (not per portal) — e.g.
 * sitemap_qarecruiting01.xml — and a tenant's child sitemap can list URLs
 * from more than one of that tenant's portals (qarecruiting01's sitemap
 * mixes HourlyCareerPortal and BrazilianPortugeseCareerPortal entries).
 * Individual <url> entries carry no <lastmod> in this env (only the
 * top-level <sitemapindex>'s per-child <lastmod> does).
 */
class SitemapXmlPage {
    constructor(request) {
        this.request = request;
    }

    /** @param {string} baseUrl */
    async fetchIndex(baseUrl) {
        const url = `${baseUrl.replace(/\/$/, '')}/sitemap.xml`;
        const response = await this.request.get(url);
        const body = await response.text();
        const sitemaps = [...body.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>)?\s*<\/sitemap>/g)]
            .map(m => ({ loc: m[1], lastmod: m[2] || null }));
        return { url, status: response.status(), body, sitemaps };
    }

    /** @param {string} childSitemapUrl absolute URL, typically one of fetchIndex()'s sitemaps[].loc */
    async fetchChildSitemap(childSitemapUrl) {
        const response = await this.request.get(childSitemapUrl);
        const body = await response.text();
        const urls = [...body.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>)?\s*<\/url>/g)]
            .map(m => ({ loc: m[1], lastmod: m[2] || null }));
        return { url: childSitemapUrl, status: response.status(), body, urls };
    }

    /**
     * Fetch the index, find the tenant's own child sitemap by matching its
     * filename ("sitemap_<tenant>.xml"), then fetch it. Returns null (not a
     * throw) if the tenant has no child sitemap listed in the index at all
     * — that's itself a finding worth a test surfacing, not a crash.
     */
    async fetchTenantSitemap(baseUrl, tenant) {
        const index = await this.fetchIndex(baseUrl);
        const match = index.sitemaps.find(s => new RegExp(`/sitemap_${tenant}\\.xml(?:\\?|$)`, 'i').test(s.loc));
        if (!match) return null;
        return this.fetchChildSitemap(match.loc);
    }

    /** URLs in a fetched child sitemap that belong to one specific tenant/portal path, e.g. "qarecruiting01/HourlyCareerPortal". */
    static filterByPortal(urls, tenantPortalPath) {
        return urls.filter(u => u.loc.includes(`/${tenantPortalPath}/`));
    }

    /** The numeric job ID from a sitemap <loc> job-detail URL. */
    static extractJobId(url) {
        const match = /\/jobs\/(\d+)(?:[/?#]|$)/.exec(url || '');
        return match ? match[1] : null;
    }

    /**
     * The tenant segment of a sitemap <loc> URL, e.g.
     * "https://host/qarecruiting01/HourlyCareerPortal/jobs/171794" -> "qarecruiting01".
     */
    static extractTenant(url) {
        const match = /^https?:\/\/[^/]+\/([^/]+)\//.exec(url || '');
        return match ? match[1] : null;
    }

    /**
     * sitemaps.org protocol compliance checks that don't depend on job
     * content: root element, and the 50,000-URL-per-file limit
     * (https://www.sitemaps.org/protocol.html). W3C-datetime validation for
     * <lastmod> only applies to entries that actually carry one — this env
     * doesn't emit per-URL lastmod (see class header), so that check is a
     * no-op here rather than a hard requirement.
     */
    static validateUrlset(body, urls) {
        const problems = [];
        if (!/<urlset[\s>]/.test(body)) problems.push('root element is not <urlset>');
        if (!body.includes('sitemaps.org/schemas/sitemap')) problems.push('missing the sitemaps.org namespace declaration');
        if (urls.length > 50000) problems.push(`${urls.length} URLs exceeds the sitemaps.org 50,000-URL-per-file limit`);
        const w3cDatetime = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z))?$/;
        for (const entry of urls) {
            if (entry.lastmod && !w3cDatetime.test(entry.lastmod)) {
                problems.push(`"${entry.loc}" has a non-W3C-datetime lastmod: "${entry.lastmod}"`);
            }
        }
        return problems;
    }
}

module.exports = SitemapXmlPage;
