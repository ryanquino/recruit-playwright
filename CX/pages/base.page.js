class BasePage {
    constructor(page) {
        this.page = page;

        // Locators
        this.usernameInput = page.locator('#login');
        this.passwordInput = page.getByLabel('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.loginErrorMessage = page.locator('div[class*="error"]');
        this.openJobsHeading = page.getByRole('heading', { name: 'Open Jobs' });
    }

    async login(username = process.env.USERNAME, password = process.env.PASSWORD) {
        const credentials = {
            username: username,
            password: password
        };
        await this.usernameInput.fill(credentials.username);
        await this.usernameInput.press('Tab');
        await this.passwordInput.fill(credentials.password);
        await this.loginButton.click();
        await this.page.waitForLoadState('load');
    }

}

module.exports = BasePage;
