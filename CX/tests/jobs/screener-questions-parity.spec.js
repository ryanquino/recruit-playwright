// @ts-check
const { test, expect } = require('../fixtures/screener-questions-parity-fixture');
const ScreenerQuestionsPage = require('../../pages/jobs/screener-questions.page');

// Screener-questions OpenSearch enabled/disabled parity, for job 173194 on
// playwrightqa/CorporateCareerPortal2 (see CX/test-data/jobs/screener-
// questions-parity.json). The screener-questions endpoint is a public JSON
// API (Indeed's screener-questions schema), not a rendered form — see
// ScreenerQuestionsPage.fetch() — so these are direct HTTP/JSON comparisons
// rather than browser-driven UI tests, same shape as rss-feed.spec.js.
//
// Submission Parity and Knockout/Qualification Parity (the other two rows
// of the source test-design table) are NOT implemented here — see the
// test.fixme() stubs at the bottom for why: they need a generic
// screener-question-filling method (all 6 types + conditional show/hide) in
// application-form.page.js that doesn't exist yet (today it only fills 2
// hardcoded select-type questions for one job), plus a way to read screener
// answers and a computed disposition back from the ATS candidate profile,
// which no existing page object supports and which isn't confirmed to even
// be exposed in the ATS UI.
test.describe('Screener-questions — OpenSearch parity (job 173194, playwrightqa/CorporateCareerPortal2)', () => {
    test('Full Screener Parity — question set (ids, order, type, text) matches between hosts', async ({ screenerQuestionsPage, screenerQuestionsParityData, openSearchEnabledBaseUrl, openSearchDisabledBaseUrl }) => {
        // Note: live-verified 2026-09-15, "SecondaryPhoneNumber" was missing
        // its "type":"text" field on enabled (present on disabled) — the
        // only question, of 53, with an omitted type on either host. Re-
        // checked 2026-09-16: no longer reproducing, both hosts now agree.
        // Leaving this test as a real (non-skipped) assertion in case it
        // recurs.
        const [enabled, disabled] = await Promise.all([
            screenerQuestionsPage.fetch(openSearchEnabledBaseUrl, screenerQuestionsParityData.screenerPath),
            screenerQuestionsPage.fetch(openSearchDisabledBaseUrl, screenerQuestionsParityData.screenerPath),
        ]);

        expect.soft(enabled.status, `${enabled.url} returned HTTP ${enabled.status}`).toBe(200);
        expect.soft(disabled.status, `${disabled.url} returned HTTP ${disabled.status}`).toBe(200);

        const enabledIds = enabled.questions.map(q => q.id);
        const disabledIds = disabled.questions.map(q => q.id);
        expect(enabledIds.length, 'no screener questions returned on the enabled host').toBeGreaterThan(0);

        // Same questions, same order — a reordered or missing/extra question
        // would show up as a diff here.
        expect(enabledIds, 'question id set/order differs between hosts').toEqual(disabledIds);

        const byIdEnabled = ScreenerQuestionsPage.byId(enabled.questions);
        const byIdDisabled = ScreenerQuestionsPage.byId(disabled.questions);
        for (const id of enabledIds) {
            expect.soft(byIdEnabled[id].type, `"${id}" has type "${byIdEnabled[id].type}" on enabled but "${byIdDisabled[id].type}" on disabled`).toBe(byIdDisabled[id].type);
            expect.soft(byIdEnabled[id].question, `"${id}" question text differs between hosts`).toBe(byIdDisabled[id].question);
        }
    });

    test('Full Screener Parity — question options match between hosts', async ({ screenerQuestionsPage, screenerQuestionsParityData, openSearchEnabledBaseUrl, openSearchDisabledBaseUrl }) => {
        // Note: live-verified 2026-09-15, 3 option-set mismatches were found
        // on job 173194 — NamePrefix option *values* (numeric codes "1".."5"
        // on enabled vs. the label text itself on disabled), SecurityClearance
        // (3 options incl. "N/A" on enabled vs. 2 on disabled), and cqe_542
        // (3 of 5 options had a leading-space discrepancy between hosts).
        // Re-checked 2026-09-16: none of these reproduce anymore, both hosts
        // now agree exactly. Leaving this test as a real (non-skipped)
        // assertion in case any of them recur.
        const [enabled, disabled] = await Promise.all([
            screenerQuestionsPage.fetch(openSearchEnabledBaseUrl, screenerQuestionsParityData.screenerPath),
            screenerQuestionsPage.fetch(openSearchDisabledBaseUrl, screenerQuestionsParityData.screenerPath),
        ]);

        const byIdEnabled = ScreenerQuestionsPage.byId(enabled.questions);
        const byIdDisabled = ScreenerQuestionsPage.byId(disabled.questions);
        const idsWithOptions = enabled.questions.filter(q => q.options).map(q => q.id);
        expect(idsWithOptions.length, 'no options-bearing questions found to compare').toBeGreaterThan(0);

        for (const id of idsWithOptions) {
            expect.soft(byIdEnabled[id].options, `"${id}" options differ between hosts`).toEqual(byIdDisabled[id].options);
        }
    });

    test('Conditional Logic Parity — conditional question rules match between hosts', async ({ screenerQuestionsPage, screenerQuestionsParityData, openSearchEnabledBaseUrl, openSearchDisabledBaseUrl }) => {
        const [enabled, disabled] = await Promise.all([
            screenerQuestionsPage.fetch(openSearchEnabledBaseUrl, screenerQuestionsParityData.screenerPath),
            screenerQuestionsPage.fetch(openSearchDisabledBaseUrl, screenerQuestionsParityData.screenerPath),
        ]);

        // Live-verified 2026-09-15: job 173194 has 3 conditional questions
        // (referrerFirstName/LastName/EmailAddress, shown when OriginalSource
        // == "Employee Referral") — same trigger question and value on both
        // hosts as of today.
        const conditionalEnabled = ScreenerQuestionsPage.getConditionalQuestions(enabled.questions);
        const conditionalDisabled = ScreenerQuestionsPage.getConditionalQuestions(disabled.questions);
        expect(conditionalEnabled.length, 'no conditional questions found on the enabled host to compare').toBeGreaterThan(0);

        const byIdDisabled = ScreenerQuestionsPage.byId(conditionalDisabled);
        for (const q of conditionalEnabled) {
            expect.soft(byIdDisabled[q.id], `"${q.id}" is conditional on enabled but not present/conditional on disabled`).toBeTruthy();
            if (byIdDisabled[q.id]) {
                expect.soft(q.condition, `"${q.id}" condition differs between hosts`).toEqual(byIdDisabled[q.id].condition);
            }
        }

        expect.soft(conditionalDisabled.map(q => q.id).sort(), 'set of conditional questions differs between hosts').toEqual(conditionalEnabled.map(q => q.id).sort());
    });

    test('Validation Parity — required-field and format/range rules match between hosts', async ({ screenerQuestionsPage, screenerQuestionsParityData, openSearchEnabledBaseUrl, openSearchDisabledBaseUrl }) => {
        // Note: live-verified 2026-09-15, referrerFirstName/referrerLastName
        // were required:true on disabled but not marked required on enabled,
        // for job 173194. Re-checked 2026-09-16: no longer reproducing, both
        // hosts now agree. Leaving this test as a real (non-skipped)
        // assertion in case it recurs.
        const [enabled, disabled] = await Promise.all([
            screenerQuestionsPage.fetch(openSearchEnabledBaseUrl, screenerQuestionsParityData.screenerPath),
            screenerQuestionsPage.fetch(openSearchDisabledBaseUrl, screenerQuestionsParityData.screenerPath),
        ]);

        const enabledIds = enabled.questions.map(q => q.id);
        const byIdEnabled = ScreenerQuestionsPage.byId(enabled.questions);
        const byIdDisabled = ScreenerQuestionsPage.byId(disabled.questions);

        for (const id of enabledIds) {
            if (!byIdDisabled[id]) continue;

            const requiredEnabled = !!byIdEnabled[id].required;
            const requiredDisabled = !!byIdDisabled[id].required;
            expect.soft(requiredEnabled, `"${id}" required flag differs — enabled=${requiredEnabled}, disabled=${requiredDisabled}`).toBe(requiredDisabled);

            // Numeric/date range and format constraints (e.g.
            // RelevantWorkExperience's integer + max:100, DateAvailable's
            // dd/MM/yyyy format, Attachment_*'s max:1 file count).
            expect.soft(byIdEnabled[id].format, `"${id}" format differs between hosts`).toBe(byIdDisabled[id].format);
            expect.soft(byIdEnabled[id].max, `"${id}" max differs between hosts`).toBe(byIdDisabled[id].max);
        }
    });

    // Needs a generic screener-question-filling method (detect each rendered
    // question's type — select/text/textarea/multiselect/date/file — and
    // fill it accordingly, including conditionally-shown questions) in
    // application-form.page.js. Today that file only fills 2 hardcoded
    // select-type questions (#cqe_530, #cqe_534) for one specific job, via
    // submitAllFieldsConfiguredApplication() — used by [C817]/[C4325]/[C818]
    // in application-form-ats-verification.spec.js.
    test.fixme('Submission Parity — submitted screener answers land identically in ATS', async () => {
        // See file header and comment above for what's missing.
    });

    // Needs a way to read a candidate's screener answers and resulting
    // qualified/knocked-out/flagged disposition back from the ATS candidate
    // profile (candidate-resume-profile.page.js only exposes a manually-set
    // disposition via changeDisposition()/getDispositionValue() — nothing
    // reads a screener-driven auto-disposition, and it's unconfirmed the ATS
    // UI surfaces one at all for this schema).
    test.fixme('Knockout/Qualification Parity — disposition from screener answers matches between hosts', async () => {
        // See file header and comment above for what's missing.
    });
});
