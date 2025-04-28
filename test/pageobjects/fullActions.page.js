const path = require('path');
const Page = require('./page');

/**
 * Page Object for fullActions
 */
class FullActionsPage extends Page {

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

  get userAvatar() {
    return $('#userAvatar');
  }

  get editProfileBtn() {
    return $('#editProfileBtn');
  }

  get countryDropdown() {
    return $('#countryDropdown');
  }

  get resumeUpload() {
    return $('#resumeUpload');
  }

  get footerSection() {
    return $('#footerSection');
  }

  get logoutBtn() {
    return $('#logoutBtn');
  }


  async userInteractsWithAllUIElements() {
    // Unknown action: openUrl
    await this.usernameInput.setValue('tomsmith');
    await this.passwordInput.setValue('SuperSecretPassword!');
    await this.loginButton.click();
    await expect(this.welcomeMessage).toHaveText('Welcome Tom!');
    await this.userAvatar.moveTo();
    await this.editProfileBtn.doubleClick();
    await this.countryDropdown.selectByVisibleText('India');
    const filePath = path.join(__dirname, '../uploads/resume.pdf');
    const remoteFilePath = await browser.uploadFile(filePath);
    await this.resumeUpload.setValue(remoteFilePath);
    await this.footerSection.scrollIntoView();
    await expect(this.logoutBtn).toBeDisplayed();
  }

  open() {
    return super.open('login'); // update your page specific endpoint URL. For Example 'login'
  }
}

module.exports = new FullActionsPage();