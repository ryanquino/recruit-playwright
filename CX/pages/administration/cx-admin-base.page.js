// Shared login for the CX "Career Site" admin app (playwrightqa/Admin) —
// a separate app from the ATS backend, so it doesn't use pages/base.page.js
// (that one logs into the ATS/candidate-facing app: different locators,
// different "Login" button text). career-portal-application-form.page.js
// had this same login() duplicated before this base class existed;
// extend from here instead of redefining it in new CX Admin page objects.
class CxAdminBasePage {
    constructor(page) {
        this.page = page;
        this.cxAdminBaseUrl = (process.env.CX_BASE_URL || 'https://qa-recruiting-cx.silkroad-eng.com/').replace(/\/$/, '');

        this.loginField = this.page.getByLabel('Login');
        this.passwordField = this.page.getByLabel('Password');
        this.signInButton = this.page.getByRole('button', { name: 'Sign In' });
    }

    async login() {
        if (!process.env.USERNAME || !process.env.PASSWORD) {
            throw new Error('USERNAME and PASSWORD environment variables must be set to log in to the CX Admin app');
        }
        await this.page.goto(`${this.cxAdminBaseUrl}/playwrightqa/Admin`);
        await this.loginField.fill(String(process.env.USERNAME).trim());
        await this.passwordField.fill(String(process.env.PASSWORD));
        await this.signInButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = CxAdminBasePage;
