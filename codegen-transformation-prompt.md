# Playwright Codegen to Framework Transformation Prompt

You are an expert test automation engineer. Your task is to transform a raw Playwright codegen file into a properly structured test following the existing framework patterns.

## Framework Structure Overview

This project uses:
- **Page Object Model (POM)** - UI elements and actions are encapsulated in page classes
- **Fixtures** - Reusable test setup and page object initialization
- **Test Data** - External JSON files for test data
- **Base Page** - Common functionality like login inherited by all pages

## Project Organization

```
ATS/
├── pages/
│   ├── base.page.js (login, common locators)
│   └── [feature]/
│       └── feature-name.page.js
├── tests/
│   ├── fixtures/
│   │   ├── base-fixture.js (handles login)
│   │   └── [feature]-fixture.js (extends base, adds page fixtures)
│   └── [feature]/
│       └── feature-name.spec.js
└── test-data/
    └── [feature]/
        └── feature-data.json
```

## Transformation Rules

### 1. Analyze the Codegen File
- Identify the feature/module being tested (e.g., candidates, jobs, administration)
- Extract unique actions and workflows
- Identify test data (hardcoded values, form inputs)
- Determine if login is required

### 2. Create Page Object Class

**File**: `ATS/pages/[feature]/[feature-name].page.js`

**Structure**:
```javascript
const BasePage = require('../base.page.js');

class FeatureNamePage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        // Define all locators as properties
        this.elementLocator = this.page.locator('selector');
        this.buttonLocator = this.page.getByRole('button', { name: 'Text' });
    }

    // Navigation method
    async navigateToFeature() {
        await this.page.goto('/path');
        await this.page.waitForLoadState('load');
    }

    // Action methods (one per user action)
    async performAction(data) {
        await this.elementLocator.click();
        await this.elementLocator.fill(data);
    }

    // Reusable helper methods
    async fillField(label, value) {
        const field = this.page.getByLabel(label);
        await field.click();
        await field.fill(value);
    }
}

module.exports = FeatureNamePage;
```

**Locator Guidelines**:
- Use semantic locators: `getByRole()`, `getByLabel()`, `getByText()`
- Avoid CSS selectors when possible
- Store all locators as class properties in constructor
- Use descriptive names ending with `Locator` (e.g., `saveButtonLocator`)

### 3. Create or Update Fixture

**File**: `ATS/tests/fixtures/[feature]-fixture.js`

**Structure**:
```javascript
const { test: baseFixture, expect } = require('./base-fixture');
const FeatureNamePage = require('../../pages/[feature]/feature-name.page');

// Import test data
const featureData = require('../../test-data/[feature]/feature-data.json');

const test = baseFixture.extend({
    // Page fixture
    featureNamePage: async ({ basePage }, use) => {
        const page = new FeatureNamePage(basePage.page);
        await page.navigateToFeature();
        await use(page);
    },

    // Data fixture
    featureData: featureData,
});

module.exports = { test, expect };
```

**Notes**:
- Always extend from `base-fixture` (provides login)
- Page fixtures initialize the page object and navigate
- Data fixtures provide test data as simple values

### 4. Create Test File

**File**: `ATS/tests/[feature]/[feature-name].spec.js`

**Structure**:
```javascript
const { test, expect } = require('../fixtures/[feature]-fixture');

test('[CaseID] Test description', async ({ featureNamePage, featureData }) => {
    await featureNamePage.performAction(featureData.field);
    await expect(featureNamePage.elementLocator).toBeVisible();
});

test.describe.serial('Related tests', () => {
    test('[CaseID] First test', async ({ featureNamePage }) => {
        // Test steps
    });

    test('[CaseID] Second test', async ({ featureNamePage }) => {
        // Test steps that depend on first test
    });
});
```

**Test Guidelines**:
- Use TestRail case IDs: `[C123]` in test names
- Use descriptive test names
- Use `test.describe.serial()` for dependent tests
- Keep tests focused and atomic
- Use fixtures for page objects and data

### 5. Create Test Data File

**File**: `ATS/test-data/[feature]/[feature-name].json`

**Structure**:
```json
{
    "field_name": "value",
    "nested_object": {
        "property": "value"
    },
    "array_data": ["item1", "item2"]
}
```

**Guidelines**:
- Extract all hardcoded values from codegen
- Use snake_case for keys
- Group related data in nested objects
- Use meaningful names

### 6. Login Handling

**DO NOT** include login steps in tests. The `base-fixture` handles login automatically:

```javascript
// base-fixture.js already does this:
basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await page.goto('/');
    await basePage.login(); // Uses env variables
    await use(basePage);
}
```

**Remove from codegen**:
- `page.goto('/')` (unless navigating to specific feature page)
- Login form interactions
- Any authentication steps

### 6a. Base URL Handling

The `baseURL` is configured in `.env` and `playwright.config.js`. All navigation should use relative paths instead of full URLs.

**Remove from codegen**:
- Full URLs like `page.goto('https://playwrightqa-openhire.silkroad-eng.com/some-path')`

**Replace with**:
- Relative paths: `page.goto('/some-path')`
- Or use navigation methods that click through the UI (preferred)

### 7. Common Patterns

**Navigation**:
```javascript
async navigateToFeature() {
    await this.featureNavLocator.click();
    await this.subFeatureNavLocator.click();
    await this.page.waitForLoadState('load');
}
```

**Form Filling**:
```javascript
async fillForm(data) {
    await this.fillField('Field Label', data.field_value);
    await this.dropdownLocator.selectOption(data.option);
    await this.checkboxLocator.check();
}
```

**File Upload**:
```javascript
async uploadFile(filename) {
    const filePath = this.path.join(__dirname, '../../test-data/files/' + filename);
    await this.uploadInputLocator.setInputFiles(filePath);
}
```

**Waiting**:
```javascript
await this.page.waitForLoadState('load');
await this.page.waitForLoadState('networkidle');
await this.page.waitForSelector('selector', { state: 'visible' });
```

**Assertions in Tests**:
```javascript
await expect(page.elementLocator).toBeVisible();
await expect(page.elementLocator).toHaveText('Expected text');
await expect(page.elementLocator).toBeChecked();
```

### 8. Cleanup Methods

If test creates data, add cleanup:
```javascript
async cleanup() {
    // Navigate to list
    // Find created item
    // Delete it
}
```

Call in test:
```javascript
test('[C123] Create item', async ({ featurePage }) => {
    await featurePage.createItem();
    await expect(featurePage.successMessage).toBeVisible();
    await featurePage.cleanup();
});
```

## Transformation Checklist

- [ ] Identify feature/module name
- [ ] Extract all locators to page object constructor
- [ ] Convert actions to page object methods
- [ ] Extract test data to JSON file
- [ ] Remove login steps (handled by base-fixture)
- [ ] Create or update fixture file
- [ ] Create test file with proper structure
- [ ] Add TestRail case ID to test name
- [ ] Use semantic locators (getByRole, getByLabel, getByText)
- [ ] Add proper waits (waitForLoadState, waitForSelector)
- [ ] Add assertions using expect()
- [ ] Add cleanup if test creates data
- [ ] Ensure all files follow naming conventions

## Output Format

Provide the transformed code in this order:

1. **Page Object** (`ATS/pages/[feature]/[feature-name].page.js`)
2. **Fixture** (`ATS/tests/fixtures/[feature]-fixture.js`) - only if new
3. **Test File** (`ATS/tests/[feature]/[feature-name].spec.js`)
4. **Test Data** (`ATS/test-data/[feature]/[feature-name].json`)

For each file, provide:
- Full file path
- Complete code
- Brief explanation of key decisions

## Example Transformation

**Input (Codegen)**:
```javascript
test('test', async ({ page }) => {
  await page.goto('https://example.com/');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByLabel('Candidates').click();
  await page.getByLabel('Upload').click();
  await page.locator('input[type="file"]').setInputFiles('resume.pdf');
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
});
```

**Output**:

**1. Page Object** (`ATS/pages/candidates/upload-candidates.page.js`):
```javascript
const BasePage = require('../base.page.js');

class UploadCandidatesPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.path = require('path');

        this.candidatesNavLocator = this.page.getByLabel('Candidates');
        this.uploadNavLocator = this.page.getByLabel('Upload');
        this.uploadInputLocator = this.page.locator('input[type="file"]');
        this.uploadButtonLocator = this.page.getByRole('button', { name: 'Upload' });
        this.saveButtonLocator = this.page.getByRole('button', { name: 'Save' });
    }

    async navigateToUpload() {
        await this.candidatesNavLocator.click();
        await this.uploadNavLocator.click();
        await this.page.waitForLoadState('load');
    }

    async uploadResume(filename) {
        const filePath = this.path.join(__dirname, '../../test-data/files/' + filename);
        await this.uploadInputLocator.setInputFiles(filePath);
        await this.uploadButtonLocator.click();
    }

    async saveResume() {
        await this.saveButtonLocator.click();
    }
}

module.exports = UploadCandidatesPage;
```

**2. Fixture** (`ATS/tests/fixtures/candidates-fixture.js`):
```javascript
const { test: baseFixture, expect } = require('./base-fixture');
const UploadCandidatesPage = require('../../pages/candidates/upload-candidates.page');

const test = baseFixture.extend({
    uploadCandidatesPage: async ({ basePage }, use) => {
        const page = new UploadCandidatesPage(basePage.page);
        await page.navigateToUpload();
        await use(page);
    },
});

module.exports = { test, expect };
```

**3. Test File** (`ATS/tests/candidates/upload-candidates.spec.js`):
```javascript
const { test, expect } = require('../fixtures/candidates-fixture');

test('[C001] Upload candidate resume', async ({ uploadCandidatesPage }) => {
    await uploadCandidatesPage.uploadResume('resume.pdf');
    await uploadCandidatesPage.saveResume();
    await expect(uploadCandidatesPage.page.getByText('successfully added')).toBeVisible();
});
```

**Key Decisions**:
- Removed login steps (handled by base-fixture)
- Created navigation method for reusability
- Separated upload and save into distinct methods
- Used semantic locators (getByLabel, getByRole)
- Added file path handling for test data files
- Added proper waits after navigation

---

## Now Transform the Provided Codegen File

Apply all the rules above to transform the codegen file into the proper framework structure. Ensure all code follows the existing patterns and conventions.
