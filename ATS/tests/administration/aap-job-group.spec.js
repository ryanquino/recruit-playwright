// @ts-check
const { test, expect } = require('../fixtures/administration-fixture.js');

const eeoCategoriesWithIds = [
  { category: "Administrative Support Workers", testrailId: "C565" },
  { category: "Craft Workers", testrailId: "C567" },
  { category: "Laborers", testrailId: "C569" },
  { category: "Officials & Managers: Executive/Senior Level", testrailId: "C571" },
  { category: "Operatives", testrailId: "C573" },
  { category: "Professionals", testrailId: "C575" },
  { category: "Sales", testrailId: "C577" },
  { category: "Service Workers", testrailId: "C579" },
  { category: "Technicians", testrailId: "C581" }
];

test.describe('Add and verify AAP Job Group for different EEO categories', () => {
  for (const { category, testrailId } of eeoCategoriesWithIds) {
    test(`[${testrailId}] Add and verify AAP Job Group for ${category}`, async ({ aapJobGroupPage }) => {
      // Add a new AAP Job Group
      await aapJobGroupPage.selectEEOCategory(category);
      await aapJobGroupPage.addAAPJobGroup();

      // Check success toast message
      await expect(aapJobGroupPage.successMessage).toBeVisible();

      // Reselect the same category to verify the new job group
      await aapJobGroupPage.selectEEOCategory(category);
      await expect(aapJobGroupPage.newAAPJobGroup).toBeVisible();
    });
  }
});

