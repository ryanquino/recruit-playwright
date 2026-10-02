class ScreenerQuestionsPage {
    /**
     * @param {import('@playwright/test').APIRequestContext} request
     */
    constructor(request) {
        this.request = request;
    }

    /**
     * Fetches a job's screener-question definition. This is a plain JSON API
     * endpoint (Indeed's screener-questions schema, schemaVersion "1.0") —
     * not a rendered HTML page — served publicly (no login required,
     * live-verified 2026-09-15), so this is a direct `request.get()` fetch
     * rather than a page navigation, matching RssFeedPage's approach for the
     * other JSON/XML feed endpoints in this suite.
     *
     * @param {string} baseUrl
     * @param {string} screenerPath e.g. "/playwrightqa/CorporateCareerPortal2/screener-questions/173194"
     */
    async fetch(baseUrl, screenerPath) {
        const url = `${baseUrl.replace(/\/$/, '')}${screenerPath}`;
        const response = await this.request.get(url);
        const status = response.status();

        let body;
        try {
            body = await response.json();
        } catch (error) {
            throw new Error(`Failed to parse screener-questions JSON from ${url} (HTTP ${status}): ${error.message}`);
        }

        return {
            url,
            status,
            schemaVersion: body.schemaVersion,
            questions: (body.screenerQuestions && body.screenerQuestions.questions) || [],
            demographicQuestions: (body.demographicQuestions && body.demographicQuestions.questions) || [],
        };
    }

    /** Question objects keyed by id, for by-id comparison across two fetches. */
    static byId(questions) {
        return Object.fromEntries(questions.map(q => [q.id, q]));
    }

    /** Questions that are only shown when another question's answer matches (e.g. referrer fields shown when OriginalSource is "Employee Referral"). */
    static getConditionalQuestions(questions) {
        return questions.filter(q => q.condition);
    }

    /** Questions explicitly marked required in the schema. */
    static getRequiredQuestions(questions) {
        return questions.filter(q => q.required);
    }
}

module.exports = ScreenerQuestionsPage;
