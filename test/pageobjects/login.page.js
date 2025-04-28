const Page = require('./page');

/**
 * Page Object for login
 */
class LoginPage extends Page {

  get homepage() {
    return $('#homepage');
  }

  get usernameInput() {
    return $('#usernameInput');
  }

  get passwordInput() {
    return $('#passwordInput');
  }

  get loginButton() {
    return $('#loginButton');
  }

  get welcomeMessage() {
    return $('#welcomeMessage');
  }


  async thisIsMySuccessfulLogin() {
    // Unknown action: openUrl
    await this.usernameInput.setValue('tomsmith');
    await this.passwordInput.setValue('SuperSecretPassword!');
    await this.loginButton.click();
    await expect(this.welcomeMessage).toHaveText('Welcome Tom!');
  }

  open() {
    return super.open('login'); // update your page specific endpoint URL. For Example 'login'
  }
}

module.exports = new LoginPage();