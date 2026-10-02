# ATS & CX Playwright UI Tests

This repository contains UI tests for both ATS and CX projects, written using [Playwright](https://playwright.dev/). Playwright is an end-to-end testing framework that enables fast and reliable testing of web applications across all modern browsers.

## Project Overview

This project focuses on automating UI tests for two applications:
- **ATS**: located in `/ATS` folder
- **CX**: located in `/CX` folder

## Project Structure

```
├── ATS/                    # ATS application tests
│   ├── pages/             # Page Object Model files for ATS
│   ├── tests/             # Test files for ATS
│   ├── test-data/         # Test data files for ATS
│   └── scripts/           # ATS-specific utility scripts (if any)
├── CX/                     # CX application tests
│   ├── pages/             # Page Object Model files for CX
│   ├── tests/             # Test files for CX
│   └── test-data/         # Test data files for CX
├── scripts/                # Shared utility scripts
├── playwright.config.js    # Playwright configuration for ATS
├── playwright-cx.config.js # Playwright configuration for CX
└── .github/workflows/      # GitHub Actions workflows
    ├── ats-tests.yml      # ATS workflow
    └── cx-tests.yml       # CX workflow
```

## Prerequisites

1. **Clone the repository**:
   ```bash
   git clone https://github.com/silkroadeng/recruiting-playwright-ui-tests
   cd recruiting-playwright-ui-tests

2. **Install Node.js**:  

   Download and install Node.js from the official website:  
   [https://nodejs.org](https://nodejs.org)

   Verify the installation:
   ```bash
   node -v
   npm -v
## Setting up Environment Variables

1. **Create a `.env` file** in the root directory of your project:
   ```bash
   touch .env

2. **Add the required environment variables** to the `.env` file. For example:
   ```bash
   BASE_URL=
   CX_BASE_URL=
   USERNAME=
   PASSWORD=

## How to run tests

1. **Install dependencies**:
   ```bash
   npm install

2. **Run all tests**:
   ```bash
   npx playwright test

3. **Run tests in UI mode**
   ```bash
   npx playwright test --ui

## Running tests on GitHub Actions

The repository includes a workflow called **Playwright Tests** for running tests through GitHub Actions.

1. Navigate to the **Actions** tab in your GitHub repository.
2. Locate the **Playwright Tests** workflow.
3. Click **Run workflow**.
4. Select the branch from which you want to run the tests.
5. Optionally, specify an environment. By default, the environment is set to `Luceeqa01`, which is currently the only supported environment due to the test data being used.

## More Information

For detailed guidelines on writing tests, refer to the [Playwright Guidelines](https://silkroadtech.atlassian.net/wiki/spaces/OH/pages/613744650/Playwright+guidelines).


