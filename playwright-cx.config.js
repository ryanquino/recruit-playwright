// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

const testRailOptions = {
  embedAnnotationsAsProperties: true,
  outputFile: './test-results/junit-report.xml'  // Output location for the JUnit report
};

module.exports = defineConfig({
  timeout: 60000,
  testDir: './CX/tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* 1 worker on CI — several application-form spec files (application-
   * form-ats-verification.spec.js, fee-agency-apply.spec.js, fee-agency-
   * localization.spec.js, application-form-localization.spec.js) each log
   * into the same shared ATS backend account and read back a Candidate
   * Pool search result (getTableRowCount()/getRecordedSourceForSubmitted
   * Candidate()/candidateExistsForEmail()). A per-file describe.serial()
   * only guarantees order WITHIN that file — it does nothing to stop a
   * *different* file's serial block from landing on another worker at the
   * same time under workers: 2, and that's exactly what raced (live-
   * verified 2026-09-07: run 34125520012 failed [C10]/[5551], both mid-
   * search reads, while 2 workers were active). Single-worker removes the
   * race at its source for every one of those files simultaneously, so
   * none of them need file-wide (or cross-test) serial() just to dodge
   * concurrency — describe.serial() stays reserved for tests with a real
   * step-dependency. Trade-off: roughly doubles CI wall-clock time. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'], 
    ['html', { outputFolder: 'test-results', open: 'never' }],
    ['junit', testRailOptions]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.CX_BASE_URL || 'https://qa-recruiting-cx.silkroad-eng.com/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // rss-freshness.spec.js creates and deactivates a real job in the
      // shared QA ATS and takes ~10+ minutes — opt-in only, via
      // --project=rss-freshness, never swept into a general run.
      testIgnore: /rss-freshness\.spec\.js/,
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        // Playwright's bundled Firefox disables the built-in PDF.js
        // viewer by default (likely to keep automation predictable —
        // PDF.js taking over navigations/downloads could otherwise
        // interfere with tests). Live-verified 2026-09-25: with this
        // default, application-form-ats-verification.spec.js's [C5552]
        // PDF preview embed renders at 0x0 (invisible) even though its
        // src is correct — but a real end user's Firefox (which has
        // PDF.js enabled by default) renders it fine. Re-enabling it here
        // makes the automated browser match real user behavior instead
        // of testing against an automation-only default.
        launchOptions: { firefoxUserPrefs: { 'pdfjs.disabled': false } },
      },
      testIgnore: /rss-freshness\.spec\.js/,
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: /rss-freshness\.spec\.js/,
    },

    {
      name: 'msedge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      testIgnore: /rss-freshness\.spec\.js/,
    },

    /* Sitemap coverage only — the candidate-facing HTML "Sitemap" page
     * suite (tagged [Sitemap]) and the real /sitemap.xml suite (tagged
     * [SM-XX], from CX_OpenSearch_Automation_Test_Plan's "Sitemap.xml"
     * area) — so this project runs just that subset via
     * --project=sitemap, for triggering from CI without pulling in the
     * full ~165-test chromium project. */
    {
      name: 'sitemap',
      use: { ...devices['Desktop Chrome'] },
      grep: /\[(SM-\d+|Sitemap)\]/,
    },

    /* CX_OpenSearch_Automation_Test_Plan "RSS Feed" cases only — every test
     * this suite added is tagged [RS-XX] in its name, so this project runs
     * just that subset via --project=rss-feed, for triggering from CI
     * without pulling in the full ~165-test chromium project. Excludes
     * [RS-03]/[RS-04] — see the `rss-freshness` project below. */
    {
      name: 'rss-feed',
      use: { ...devices['Desktop Chrome'] },
      grep: /\[RS-(?!03|04)\d+\]/,
    },

    /* Smoke subset only — tests tagged { tag: '@smoke' } (Playwright
     * appends the tag to the test title, e.g. "... @smoke"), so this
     * project runs just that subset via --project=smoke, for triggering
     * from the dedicated "CX Smoke Test" workflow without pulling in the
     * full ~165-test chromium project. */
    {
      name: 'smoke',
      use: { ...devices['Desktop Chrome'] },
      grep: /@smoke/,
      testIgnore: /rss-freshness\.spec\.js/,
    },

    /* [RS-03]/[RS-04] ("Freshness") only — see rss-freshness.spec.js's
     * header. Deliberately its own project: it creates and later
     * deactivates a real job in the shared QA ATS and polls for up to
     * ~7 minutes per phase, so it must never run as part of a normal
     * `chromium`/`rss-feed` trigger. Run explicitly via
     * --project=rss-freshness. Requires ATS_BASE_URL/USERNAME/PASSWORD
     * (same env vars the CI workflow already provides).
     *
     * [RS-03] and [RS-04] each create/clean up their own job — they're
     * independent of each other, so cx-tests.yml runs this project with
     * --workers=2 (global CI workers is 1, for unrelated suites that
     * share a candidate-pool search result — doesn't apply here) so they
     * run concurrently rather than one waiting out the other's ~5min
     * poll serially. */
    {
      name: 'rss-freshness',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /rss-freshness\.spec\.js/,
      timeout: 10 * 60_000,
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
