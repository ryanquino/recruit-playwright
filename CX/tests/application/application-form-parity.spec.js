// @ts-check
const { test, expect } = require('../fixtures/application-form-parity-fixture');
const ApplicationFormPage = require('../../pages/application/application-form.page');

// Configured Application Form OpenSearch enabled/disabled parity, for all
// three entry points the form is reachable through (see CX/test-data/
// application/application-form-parity.json for each variant's target
// job/portal). Job-Specific uses job 173194 on playwrightqa/
// CorporateCareerPortal2 — the same job screener-questions-parity.spec.js
// compares. The Configured Apply form is a rendered, 2-page HTML form (not
// a JSON API like screener-questions), so this reads the DOM's actual
// field set via ApplicationFormPage's getFull*FormSchema() methods (page 1,
// then minimal-fill-and-advance to read page 2) rather than fetching an
// endpoint. None of these ever reach the final Finish button, so no
// application is ever actually submitted.
// Note: live-verified 2026-09-21, real mismatches were found per variant
// (none filed as tickets). Re-checked 2026-09-23: none of them reproduce
// anymore — both hosts now agree on all counts below, and all 6 tests in
// this file pass. Left as historical record rather than deleted, in case
// any of these recur:
//   - All three variants (same PrimaryPhoneNumber/SecondaryPhoneNumber
//     fields): placeholder text differed — enabled showed the field's own
//     label repeated as its placeholder ("Primary Phone"/"Secondary
//     Phone"), disabled showed an example number format ("(201) 555-0123").
//   - Job-Specific & Fee Agency (same underlying form): "RelocationPreference"
//     dropdown was missing 3 options on the enabled host that were present
//     on disabled — "Armed Forces Americas (AA)" (US-AA), "Armed Forces
//     Europe (AE)" (US-AE), "Armed Forces Pacific (AP)" (US-AP).
//   - Open Submission: "OtherRelocationPreference" field was present on the
//     enabled host but missing from disabled entirely; separately,
//     "AlternateAuthorizedCountriesToWork"'s label differed between hosts —
//     "Additional countries the Candidate is authorized to work in"
//     (enabled) vs. "Countries the Candidate is authorized to work in"
//     (disabled, missing "Additional").
//
// A "reading order differs" finding reported earlier turned out to be a
// false positive in this suite itself, not a real product issue — order was
// numbered independently per page (0-based on page 1, then again 0-based on
// page 2), so sorting the two pages' fields combined interleaved page-2
// fields into the middle of page-1's sequence. Fixed in
// readBothPagesFieldSchema() (rebase page 2's order past the end of page
// 1's); re-verified 2026-09-21 that no real order mismatch exists on any of
// the three variants once fixed.
const FORM_VARIANTS = [
    {
        name: 'Job-Specific (job 173194)',
        getSchemaOnHost: (applicationFormPage, data, baseUrl) =>
            applicationFormPage.getFullConfiguredFormSchema(baseUrl, data.jobSpecific.portalPath, data.jobSpecific.jobId, data.profile),
    },
    {
        name: 'Open Submission',
        getSchemaOnHost: (applicationFormPage, data, baseUrl) =>
            applicationFormPage.getFullOpenSubmissionFormSchema(baseUrl, data.openSubmission.portalPath, data.profile),
    },
    {
        name: 'Fee Agency',
        getSchemaOnHost: (applicationFormPage, data, baseUrl) =>
            applicationFormPage.getFullFeeAgencyConfiguredFormSchema(baseUrl, data.feeAgency.portalPath, data.feeAgency.email, data.feeAgency.jobTitle, data.profile),
    },
];

for (const variant of FORM_VARIANTS) {
    test.describe(`Configured Application Form — OpenSearch parity — ${variant.name}`, () => {
        test('field schema (id, order, label, type, required, placeholder, default value) matches between hosts across both pages', async ({ applicationFormPage, applicationFormParityData, openSearchEnabledBaseUrl, openSearchDisabledBaseUrl }) => {
            test.setTimeout(150_000);

            const enabledFields = await variant.getSchemaOnHost(applicationFormPage, applicationFormParityData, openSearchEnabledBaseUrl);
            const disabledFields = await variant.getSchemaOnHost(applicationFormPage, applicationFormParityData, openSearchDisabledBaseUrl);

            const byIdEnabled = ApplicationFormPage.byId(enabledFields);
            const byIdDisabled = ApplicationFormPage.byId(disabledFields);
            const enabledIds = Object.keys(byIdEnabled);
            const disabledIds = Object.keys(byIdDisabled);
            expect(enabledIds.length, 'no fields found on the enabled host to compare').toBeGreaterThan(0);

            // Same field set — a field present on one host but not the other
            // would show up here even if everything else about it matches.
            const onlyEnabled = enabledIds.filter(id => !disabledIds.includes(id)).sort();
            const onlyDisabled = disabledIds.filter(id => !enabledIds.includes(id)).sort();
            expect.soft(onlyEnabled, `field(s) present on enabled but missing from disabled: ${onlyEnabled.join(', ')}`).toEqual([]);
            expect.soft(onlyDisabled, `field(s) present on disabled but missing from enabled: ${onlyDisabled.join(', ')}`).toEqual([]);

            // Reading order — restricted to fields present on both hosts, so
            // a field already flagged as missing above (which would shift
            // every field after it by one) doesn't cascade into a false
            // "reordered" report for everything downstream of it.
            const commonIdSet = new Set(enabledIds.filter(id => disabledIds.includes(id)));
            const enabledOrderSequence = enabledFields.filter(f => commonIdSet.has(f.id)).sort((a, b) => a.order - b.order).map(f => f.id);
            const disabledOrderSequence = disabledFields.filter(f => commonIdSet.has(f.id)).sort((a, b) => a.order - b.order).map(f => f.id);
            expect.soft(enabledOrderSequence, 'reading order of fields present on both hosts differs').toEqual(disabledOrderSequence);

            for (const id of commonIdSet) {
                expect.soft(byIdEnabled[id].type, `"${id}" type differs — enabled="${byIdEnabled[id].type}" disabled="${byIdDisabled[id].type}"`).toBe(byIdDisabled[id].type);
                expect.soft(byIdEnabled[id].label, `"${id}" label differs — enabled="${byIdEnabled[id].label}" disabled="${byIdDisabled[id].label}"`).toBe(byIdDisabled[id].label);
                expect.soft(byIdEnabled[id].required, `"${id}" required flag differs — enabled=${byIdEnabled[id].required} disabled=${byIdDisabled[id].required}`).toBe(byIdDisabled[id].required);
                expect.soft(byIdEnabled[id].placeholder, `"${id}" placeholder differs — enabled="${byIdEnabled[id].placeholder}" disabled="${byIdDisabled[id].placeholder}"`).toBe(byIdDisabled[id].placeholder);
                // Non-<select> fields only — selects carry their content in
                // .options (checked by the dedicated test below) instead.
                if (!byIdEnabled[id].options) {
                    expect.soft(byIdEnabled[id].defaultValue, `"${id}" default value differs — enabled="${byIdEnabled[id].defaultValue}" disabled="${byIdDisabled[id].defaultValue}"`).toBe(byIdDisabled[id].defaultValue);
                }
            }
        });

        test('dropdown option sets match between hosts', async ({ applicationFormPage, applicationFormParityData, openSearchEnabledBaseUrl, openSearchDisabledBaseUrl }) => {
            test.setTimeout(150_000);

            const enabledFields = await variant.getSchemaOnHost(applicationFormPage, applicationFormParityData, openSearchEnabledBaseUrl);
            const disabledFields = await variant.getSchemaOnHost(applicationFormPage, applicationFormParityData, openSearchDisabledBaseUrl);

            const byIdEnabled = ApplicationFormPage.byId(enabledFields);
            const byIdDisabled = ApplicationFormPage.byId(disabledFields);
            const idsWithOptions = enabledFields.filter(f => f.options).map(f => f.id);
            expect(idsWithOptions.length, 'no options-bearing fields found on the enabled host to compare').toBeGreaterThan(0);

            for (const id of idsWithOptions) {
                if (!byIdDisabled[id]) continue; // already flagged as missing by the field-set test above
                expect.soft(byIdEnabled[id].options, `"${id}" options differ between hosts`).toEqual(byIdDisabled[id].options);
            }
        });
    });
}
