const xml2js = require('xml2js');

class RssFeedPage {
    constructor(request) {
        this.request = request;
    }

    /**
     * @param {string} baseUrl
     * @param {string} feedPath e.g. "/playwrightqa/CorporateCareerPortal/rss"
     */
    async fetch(baseUrl, feedPath) {
        const url = `${baseUrl.replace(/\/$/, '')}${feedPath}`;
        const response = await this.request.get(url);
        const body = await response.text();

        let parsed;
        try {
            parsed = await xml2js.parseStringPromise(body, { explicitArray: false, trim: false });
        } catch (error) {
            // A non-2xx status here (network blip, WAF/maintenance page) is
            // still worth surfacing as a status mismatch rather than a hard
            // throw where the response body happens to still be valid XML
            // (this app renders some errors as valid RSS/HTML, live-verified
            // 2026-09-09) — so only the genuinely unparseable case throws,
            // with the HTTP status folded into the message for context.
            throw new Error(`Failed to parse XML from ${url} (HTTP ${response.status()}): ${error.message}`);
        }

        return {
            url,
            status: response.status(),
            version: parsed.rss && parsed.rss.$ && parsed.rss.$.version,
            channel: parsed.rss && parsed.rss.channel,
        };
    }

    static getItems(channel) {
        if (!channel || !channel.item) return [];
        return Array.isArray(channel.item) ? channel.item : [channel.item];
    }

    static hasEmbeddedNewline(text) {
        return /[\r\n]/.test(text);
    }

    /** A location with no region rendering as "City,, Country" (empty middle segment). */
    static hasDoubleComma(text) {
        return /,\s*,/.test(text);
    }

    /**
     * The numeric job ID from a job-detail URL, absolute or relative
     * ("https://host/tenant/portal/jobs/171794" or "/tenant/portal/jobs/171794"
     * both -> "171794"). The stable join key between an RSS <link>/portal
     * card href and a sitemap link — host- and path-prefix-independent.
     */
    static extractJobId(url) {
        const match = /\/jobs\/(\d+)(?:[/?#]|$)/.exec(url || '');
        return match ? match[1] : null;
    }

    /**
     * The tenant/portal path segment of a job-detail URL, e.g.
     * "https://host/playwrightqa/CorporateCareerPortal/jobs/171794" ->
     * "playwrightqa/CorporateCareerPortal". Used by [RS-07] to confirm a
     * feed's items all point back to that same feed's own portal (no
     * cross-portal leakage).
     */
    static extractPortalPath(url) {
        const match = /^https?:\/\/[^/]+\/(.+)\/jobs\/\d+/.exec(url || '');
        return match ? match[1] : null;
    }

    /** Strip HTML tags and collapse whitespace — for comparing RSS's <jobDescription> against the job's own JSON-LD description without false-failing on markup-only differences. */
    static normalizeText(html) {
        return (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
}

module.exports = RssFeedPage;
