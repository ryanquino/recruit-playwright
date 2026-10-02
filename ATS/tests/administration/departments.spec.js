// @ts-check
const { test, expect } = require('../fixtures/administration-fixture.js');

test('[C618] Listing', async ({ departmentsPage, departmentsData }) => {
    const count = await departmentsPage.getDepartmentRowCount();
    expect(count).toBeGreaterThan(0);
});

test.describe.serial('Add new department and verify all departments are displayed', () => {
    test('[C619] Create/edit', async ({ departmentsPage, departmentsData }) => {
        //add department
        const number = departmentsData.number + Date.now();
        await departmentsPage.createDepartment(departmentsData, number);
        await expect(await departmentsPage.isAddedDepartmentExist(departmentsData.departmentName)).toBeVisible();
    });

    test('[C620] create/edit - Sceanrio 2', async ({ departmentsPage, departmentsData }) => {
        //update newly added department
        await departmentsPage.editDepartment(departmentsData.departmentName, departmentsData.updatedDepartmentName);
        await expect(await departmentsPage.isAddedDepartmentExist(departmentsData.updatedDepartmentName)).toBeVisible();
    });

    test('[C621] Deactivate', async ({ departmentsPage, departmentsData }) => {
        //deactivate newly added department
        await departmentsPage.deactivateDepartment(departmentsData.updatedDepartmentName);
        await expect(await departmentsPage.isAddedDepartmentExist(departmentsData.updatedDepartmentName)).not.toBeVisible();
    });
});


