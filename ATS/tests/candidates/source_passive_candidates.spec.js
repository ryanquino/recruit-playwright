// @ts-check
const { test, expect } = require('../fixtures/candidates-fixture');

const filters = [
  { testrailid: '[C14107]', name: 'jobTitle', getValue: /** @param {any} data */ data => data.job_title },
  { testrailid: '[C14108]', name: 'skills', getValue: /** @param {any} data */ data => data.skills },
  { testrailid: '[C14109]', name: 'location', getValue: /** @param {any} data */ data => data.location },
  { testrailid: '[C14111]', name: 'education', getValue: /** @param {any} data */ data => data.degree_required, getOptions: /** @param {any} data */ data => ({ schoolName: data.school_name }) },
  { testrailid: '[C14113]', name: 'companies', getValue: /** @param {any} data */ data => data.companies, getOptions: /** @param {any} data */ data => ({ excludedCompany: data.excluded_companies }) },
  { testrailid: '[C14114]', name: 'industry', getValue: /** @param {any} data */ data => data.industries },
  { testrailid: '[C14115]', name: 'highlights', getValue: /** @param {any} data */ data => data.highlights },
];

test.describe('redirect to source passive candidates and apply filters', () => {
  filters.forEach(({ testrailid, name, getValue, getOptions }) => {
    test(`${testrailid} Source Passive Candidates - ${name.charAt(0).toUpperCase() + name.slice(1)}`, async ({ sourcePassiveCandidatesPage, sourcePassiveCandidateData }) => {
      if (testrailid === '[C14114]') {
        test.skip(); // skipped for now since we hid the industry filter on source passive candidates page
      }
      const value = getValue(sourcePassiveCandidateData);
      const options = getOptions ? getOptions(sourcePassiveCandidateData) : undefined;

      await sourcePassiveCandidatesPage.applyCandidateFilter(name, value, options);
      await expect(await sourcePassiveCandidatesPage.getResult()).toBeVisible({ timeout: 40000 });
      await expect(await sourcePassiveCandidatesPage.searchQuerySummary).toContainText(value);
    });
  });
});

test('[C14117] Source Passive Candidates - Source candidates through job', async ({ sourcePassiveCandidatesPage, sourcePassiveCandidateData }) => {
    await sourcePassiveCandidatesPage.goToSourcePassiveCandidatesPageFromJobs(sourcePassiveCandidateData.testJob);
    await sourcePassiveCandidatesPage.waitForLoadingSpinner();
    await expect(sourcePassiveCandidatesPage.sourcePassiveCandidatePageHeading).toBeVisible();         
});
