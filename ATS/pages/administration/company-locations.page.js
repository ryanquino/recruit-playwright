const BasePage = require('../base.page.js');

class CompanyLocationsPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        this.administrationNavLocator = this.page.getByLabel('Administration', { exact: true });
        this.companyLocationsNavLocator = this.page.getByLabel('Company Locations');
        this.createButton = this.page.getByRole('button', { name: 'Create' });
        this.locationNameField = this.page.locator('#sLocName');
        this.locationCodeField = this.page.locator('#sLocCode');
        this.locationCountryDropdown = this.page.locator('#sCountry');
        this.addAllLocationButton = this.page.locator('#addAllOptionsButton');
        this.saveButton = this.page.locator('#saveBtn');
        this.locationsTable = this.page.locator('table.rival-table');
        this.viewAllLocationsLink = this.page.getByRole('link', { name: 'View All Locations' });

    }

    async navigateToCompanyLocationsPage() {
        await this.administrationNavLocator.click();
        await this.companyLocationsNavLocator.click();
        await this.page.waitForLoadState('load');
    }

    async createCompanyLocation(location){
        await this.createButton.click();
        await this.locationNameField.fill(location.locationName);
        await this.locationCodeField.fill(location.locationCode);
        await this.locationCountryDropdown.selectOption(location.country);
        await this.addAllLocationButton.click();
        await this.saveButton.click();
    }

    getLocationRow(locationName) {
        return this.locationsTable.locator('td a', { hasText: locationName });
    }

    async displayLocation(){
        await this.viewAllLocationsLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}

module.exports = CompanyLocationsPage;
