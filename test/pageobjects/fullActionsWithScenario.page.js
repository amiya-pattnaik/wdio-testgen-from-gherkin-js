const Page = require('./page');

/**
 * Page Object for fullActionsWithScenario
 */
class FullActionsWithScenarioPage extends Page {

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

  get usernameField() {
    return $('#usernameField');
  }

  get someElement() {
    return $('#someElement');
  }

  get updateButton() {
    return $('#updateButton');
  }

  get saveButton() {
    return $('#saveButton');
  }

  get deleteButton() {
    return $('#deleteButton');
  }

  get submitButton() {
    return $('#submitButton');
  }


  async performAllBasicBrowserActions() {
    // Unknown action: openUrl
    await this.usernameInput.setValue('john');
    await this.passwordInput.setValue('doe123');
    await this.loginButton.click();
    await expect(this.welcomeMessage).toHaveText('Welcome Tom!');
  }

  async formValidationWithInputClearing() {
    // Unknown action: openUrl
    await this.usernameInput.setValue('wronguser');
    await this.usernameField.clearValue();
    await this.usernameInput.setValue('admin');
    await expect(this.someElement).toHaveText('Username updated');
  }

  async elementVisibilityAndEnabledChecks() {
    // Unknown action: openUrl
    await expect(this.updateButton).toBeDisplayed();
    await expect(this.saveButton).toBeEnabled();
    await expect(this.deleteButton).toBeDisabled();
  }

  async pageTitleAndURLAssertions() {
    // Unknown action: openUrl
    await expect(browser).toHaveTitle('User Settings');
    await expect(browser).toHaveUrl(expect.stringContaining('/settings'));
  }

  async customWaitAndScrolling() {
    // Unknown action: openUrl
    await this.submitButton.scrollIntoView();
    await this.someElement.waitForDisplayed();
  }

  open() {
    return super.open('login'); // update your page specific endpoint URL. For Example 'login'
  }
}

module.exports = new FullActionsWithScenarioPage();