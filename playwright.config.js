// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

/* Run maximized: viewport: null lets the page fill the real browser window
 * and --start-maximized opens that window at full screen size. Headless has
 * no screen to maximize to (it falls back to 800x600), so --window-size sets
 * 1920x1200 there; headed, the OS clamps it to the screen. Playwright
 * rejects deviceScaleFactor/isMobile alongside a null viewport, so they are
 * stripped from the device preset. */
const { deviceScaleFactor, isMobile, ...desktopChrome } = devices['Desktop Chrome'];

const testRailOptions = {
  embedAnnotationsAsProperties: true,
  outputFile: './test-results/junit-report.xml'  // Output location for the JUnit report
};

module.exports = defineConfig({
  timeout: 60000,
  testDir: './ATS/tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
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
    baseURL: process.env.BASE_URL || 'https://playwrightqa-openhire.silkroad-eng.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...desktopChrome,
        viewport: null,
        launchOptions: { args: ['--start-maximized', '--window-size=1920,1200'] },
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

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
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
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

