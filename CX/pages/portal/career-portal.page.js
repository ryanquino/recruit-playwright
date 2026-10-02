class CareerPortalPage {
    constructor(page) {
        this.page = page;

        this.logoImage = page.getByRole('img', { name: 'Logo' });
        this.bannerImage = page.getByRole('img', { name: 'Banner' });
        this.jobsNavLink = page.getByRole('link', { name: 'Jobs', exact: true });
    }
}

module.exports = CareerPortalPage;
