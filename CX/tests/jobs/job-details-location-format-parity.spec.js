// @ts-check
const { test, expect } = require('../fixtures/job-details-location-format-parity-fixture');
const JobsListPage = require('../../pages/jobs/jobs-list.page');
const JobDetailsPage = require('../../pages/jobs/job-details.page');

// Verifies the candidate-facing location display (OpenSearch-enabled host
// only) actually renders as configured, for every "Job Location Format"
// option — rather than comparing against the OpenSearch-disabled host (see
// job-details-location-format-parity.json's "locationComponents": job
// 171750's raw city/state/country values, live-verified 2026-09-23 by
// cycling every format and reading back what rendered).
//
// Two distinct admin settings are in play, each controlling a different
// candidate-facing surface:
// - "Manage Job List" (portalId 2577) → the job list/search results page's
//   own cards.
// - "Manage Job Details Page" (portalId 2577) → an individual job's own
//   Job Details page (element checked: <div id="Jobs_JobDetail_LocationText"
//   class="sr-job-detail__location">).
//
// Both settings are shared, portal-level admin state (same as
// career-portal-job-list.spec.js's "Manage Job List" settings) — live-
// verified (2026-09-23) that running these two tests concurrently across
// this config's default multi-browser-project fullyParallel execution races
// their Save clicks against each other. Wrapping this file in one outer
// .serial() forces both tests onto a single worker in declaration order,
// same fix as that file's.
/** @param {string} label */
function locationFormatKey(label) {
    // Dropdown labels carry an example suffix, e.g. "City, State Code -
    // (ex: Miami, FL)" — strip it down to the format description itself.
    return label.split(' - (ex:')[0].trim();
}

/** @type {Record<string, string[]>} */
const FORMAT_COMPONENT_KEYS = {
    'City': ['city'],
    'City, State Code': ['city', 'stateCode'],
    'City, Country Code': ['city', 'countryCode'],
    'City, State Name': ['city', 'stateName'],
    'City, Country Name': ['city', 'countryName'],
    'City, State Code, Country Code': ['city', 'stateCode', 'countryCode'],
    'City, State Name, Country Code': ['city', 'stateName', 'countryCode'],
    'City, State Code, Country Name': ['city', 'stateCode', 'countryName'],
    'City, State Name, Country Name': ['city', 'stateName', 'countryName'],
    // Job Details page's dropdown adds a "Default" option (value 0) the Job
    // List dropdown doesn't have — live-verified 2026-09-23: for job
    // 171750, it renders identically to "City, State Code".
    'Default': ['city', 'stateCode'],
};

/** @param {string} formatLabel @param {Record<string, string>} components */
function expectedLocationText(formatLabel, components) {
    const key = locationFormatKey(formatLabel);
    const componentKeys = FORMAT_COMPONENT_KEYS[key];
    if (!componentKeys) {
        throw new Error(`No expected-value mapping for Job Location Format option "${formatLabel}" — add one to FORMAT_COMPONENT_KEYS.`);
    }
    return componentKeys.map(k => components[k]).join(', ');
}

test.describe.serial('Job Location Format renders as configured (playwrightqa/CorporateCareerPortal, job 171750)', () => {

    test('Job List page — card location matches the configured format, for every format option', async ({ careerPortalJobListPage, jobData, page, openSearchEnabledBaseUrl }) => {
        test.setTimeout(180_000);
        const jobsListPage = new JobsListPage(page);

        const options = await careerPortalJobListPage.getJobLocationFormatOptions();
        expect(options.length, 'no Job Location Format options found to test').toBeGreaterThan(0);
        const originalOption = options.find(o => o.selected) || options[0];

        try {
            for (const option of options) {
                await careerPortalJobListPage.goToJobListPage(jobData.portalId);
                await careerPortalJobListPage.setJobLocationFormat(option.label);

                await jobsListPage.gotoOnHost(openSearchEnabledBaseUrl, jobData.portalPath);
                const cards = await jobsListPage.getAllResultCardsAcrossPages();
                const card = cards.find(c => c.href && c.href.includes(`/jobs/${jobData.jobId}`));
                expect(card, `job ${jobData.jobId} not found on the job list for format "${option.label}"`).toBeTruthy();

                const expected = expectedLocationText(option.label, jobData.locationComponents);
                expect.soft(card.location, `format "${option.label}": card shows "${card.location}", expected "${expected}"`).toBe(expected);
            }
        } finally {
            await careerPortalJobListPage.goToJobListPage(jobData.portalId);
            await careerPortalJobListPage.setJobLocationFormat(originalOption.label);
        }
    });

    test('Job Details page — location matches the configured format, for every format option', async ({ careerPortalJobDetailsPage, jobData, page, openSearchEnabledBaseUrl }) => {
        test.setTimeout(180_000);
        const jobDetailsPage = new JobDetailsPage(page);

        const options = await careerPortalJobDetailsPage.getJobLocationFormatOptions();
        expect(options.length, 'no Job Location Format options found to test').toBeGreaterThan(0);
        const originalOption = options.find(o => o.selected) || options[0];

        try {
            for (const option of options) {
                await careerPortalJobDetailsPage.goToJobDetailsPage(jobData.portalId);
                await careerPortalJobDetailsPage.setJobLocationFormat(option.label);

                await jobDetailsPage.navigateToJobByIdOnHost(openSearchEnabledBaseUrl, jobData.portalPath, jobData.jobId);
                const location = (await jobDetailsPage.jobLocationText.innerText()).trim();

                const expected = expectedLocationText(option.label, jobData.locationComponents);
                expect.soft(location, `format "${option.label}": location shows "${location}", expected "${expected}"`).toBe(expected);
            }
        } finally {
            await careerPortalJobDetailsPage.goToJobDetailsPage(jobData.portalId);
            await careerPortalJobDetailsPage.setJobLocationFormat(originalOption.label);
        }
    });
});
