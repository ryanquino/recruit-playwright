const EMBED_SCRIPT_SRC = 'https://qa-recruiting-cx.silkroad-eng.com/bundles/silkroadjobs?v=NqgH2hEj3DJhWI34sw_oIT4Bwh9tNbKoeO6mQF1gFE41';
const EMBED_DOMAIN = 'https://qa-recruiting-cx.silkroad-eng.com';
const EMBED_CUSTOMER_CODE = 'playwrightqa';

// [C899]-[C911] Embedded Candidate Apply: the real "Embedded External/
// Internal CX Portal" mechanism is this JS snippet (document.writes an
// iframe pointing at the portal with ?embedded=true appended). Live-
// verified (2026-08-26) via page.setContent() — zero new files, zero CI
// changes, no webServer needed. The iframe content itself is a real
// cross-origin origin (qa-recruiting-cx.silkroad-eng.com); only the host
// page is about:blank, which this widget doesn't appear to care about
// (no CORS/cookie/referrer-dependent behavior observed).
//
// Uses the "playwrightqa" tenant (same one every other CX test in this
// repo uses) rather than a different demo tenant — confirmed the embed
// snippet works with any customercode, and this one reaches the exact
// same named test jobs ("Playwright CX Test Quick Apply" /
// "Playwright Internal Job Posting") as the direct-site tests, so the
// existing ApplicationFormPage/ApplicationFormValidationPage locators and
// navigation methods work unmodified against it.
function embedHtml(portalCode) {
    return `<!DOCTYPE html><html><head></head><body>
<script src="${EMBED_SCRIPT_SRC}"
    type="text/javascript"
    id="silkroad-cx-snippet"
    data-customercode="${EMBED_CUSTOMER_CODE}"
    data-portalcode="${portalCode}"
    data-action="cxEmbedded"
    data-domain="${EMBED_DOMAIN}"></script>
</body></html>`;
}

// Returns the embedded widget's iframe as a Playwright Frame. A Frame
// exposes the same locator/getByRole/getByLabel/waitForLoadState API as
// Page, so ApplicationFormPage and its subclasses work unmodified when
// constructed with this Frame in place of a Page.
async function getEmbeddedFrame(page, portalCode) {
    await page.setContent(embedHtml(portalCode));
    const iframeHandle = await page.waitForSelector('iframe');
    return iframeHandle.contentFrame();
}

module.exports = { getEmbeddedFrame };
