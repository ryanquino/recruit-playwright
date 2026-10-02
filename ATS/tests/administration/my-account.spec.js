// @ts-check
const { test, expect } = require('../fixtures/administration-fixture.js');

test.describe.serial('Groups Test (Add and Delete)', () => {
    test('[C683] My Groups - Add a Group', async ({ myAccountPage, myAccountData }) => {  
        await myAccountPage.addAGroup(myAccountData);
        await expect(await myAccountPage.getLocatorOfNewlyAddedGroup(myAccountData.name)).toBeVisible();
    });

    test('[C685] My Groups - Delete a Group', async ({ myAccountPage, myAccountData }) => {  
        await myAccountPage.deleteGroup(myAccountData.name);
        await expect(await myAccountPage.getLocatorOfNewlyAddedGroup(myAccountData.name)).not.toBeVisible();
    });
});

 test.describe('My Accounts test', () => {
    test('[C682] My Groups', async ({ myAccountPage }) => {
        expect(await myAccountPage.getMyGroupTableCount()).toBe(true);
    });

    test('[C684] My Groups - Edit Group', async ({myAccountPage, myAccountData}) => {  
        await myAccountPage.editGroup(myAccountData.updatedName);
        await expect(await myAccountPage.getLocatorOfNewlyAddedGroup(myAccountData.updatedName)).toBeVisible();
    });

    test('[C686] CX Link', async ({ myAccountPage }) => {  
        await expect(await myAccountPage.getCXUrlAfterRedirection()).toBeTruthy();
    });
    test('[C687] Log in/out', async ({ myAccountPage }) => {  
        await expect(await myAccountPage.logout()).toBeVisible();
    });
    test('[C14533] My Account - Update my Profile - Language', async ({ myAccountPage }) => {  
        await myAccountPage.updateLangauge('13');
        await expect(await myAccountPage.germanHeading).toBeVisible();
        await myAccountPage.updateLangauge('15');
        await expect(await myAccountPage.germanHeading).not.toBeVisible();
    });
});
