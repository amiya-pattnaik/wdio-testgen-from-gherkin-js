# 🤖 Gherkin To WebdriverIO Test Generator

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://webdriver.io/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Automation Level](https://img.shields.io/badge/automation-100%25-success)](https://webdriver.io/)
[![Made with ❤️](https://img.shields.io/badge/made%20with-%E2%9D%A4-red)](#)

Automatically generate WebdriverIO **Page Object classes** and **Mocha test specs** from Gherkin `.feature` files — reducing manual effort, improving consistency, and speeding up QA automation 🚀. It works in two main steps:

1. Generate Step Maps: Parses Gherkin feature files to produce structured .stepMap.json files.

2. Generate Tests: Uses the .stepMap.json to generate:
    - WebdriverIO-compatible Page Object Model (POM) classes.
    - Mocha-based test specs.

---

### 📌 Why Use This Tool?

🔹 Eliminate repetitive test coding  
🔹 Empower engineers to focus on logic, not syntax  
🔹 Generate consistent, readable test code with Page Object Model  
🔹 Integrate with AI/ML to create self-evolving test assets  
🔹 Boost engineering productivity

---

### Requirements
- Node.js
- WebdriverIO 8+
- Install dependencies: `npm install`

---

### 🛠️ How It Works
### ✅ Step 1: Gherkin to stepMap

Run the generator to generate stepMap JSON:
``npm run generate:stepmap``

Output:
`✅ Generated: login.stepMap.json`

Feature file:
```gherkin
Feature: This is my login functionality for testing
  Scenario: This is my successful login
    Given I open the login page
    When I enter username in the username field
    When I enter password in the password field
    And I click on the login button
    Then I should see "Welcome Tom!" in the welcome message
```

Translates into stepMaps/login.stepMap.json:
```JSON
{
  "This is my successful login": [
    {
      "action": "openUrl",
      "selectorName": "homepage",
      "selector": "#homepage",
      "note": "/"
    },
    {
      "action": "setText",
      "selectorName": "usernameInput",
      "selector": "#usernameInput",
      "note": "tomsmith"
    },
    {
      "action": "setText",
      "selectorName": "passwordInput",
      "selector": "#passwordInput",
      "note": "SuperSecretPassword!"
    },
    {
      "action": "click",
      "selectorName": "loginButton",
      "selector": "#loginButton",
      "note": ""
    },
    {
      "action": "assertText",
      "selectorName": "welcomeMessage",
      "selector": "#welcomeMessage",
      "note": "Welcome Tom!"
    }
  ]
}
```
> Note: Once your JSON file is generated make sure to update the correct selector from your application. This is your baseline and based on this information your pageobjects and test specs will be generated. Review the generated code and modify if needed or based on your requirements.


### ✅ Step 2: stepMap to Code

Run the generator to generate pageobjects and specs:
``npm run generate:tests``

Output:
`✅ Generated: login.page.js + login.spec.js`

📂 Directory Structure
```
project-root/
├── features/               # Gherkin feature files
├── stepMaps/               # Generated step maps (JSON)
├── test/
│   ├── pageobjects/        # Generated Page Object classes
│   └── specs/               # Generated test specs
├── generateStepMap.js      # StepMap generator script
├── generateTestsFromMap.js # PageObject + test spec generator script
└── README.md
```
---

### 🧠 Supported Actions

| Action    | Description |
| -------- | ------- |
| setText         | Sets input value    |
| click           | Clicks on the element     |
| hover           | Hovers over an element   |
| doubleClick     | Performs a double-click    |
| selectDropdown  | Selects dropdown option by visible text    |
| uploadFile      | Uploads a file     |
| scrollTo        | Scrolls element into view    |
| assertVisible   | Validates visibility of element    |
| assertText      | Checks element text    |
| clearText       | Clears input field     |
| assertEnabled   | Validates element is enabled    |
| assertDisabled  | Validates element is disabled    |
| assertTitle     | Validates page title    |
| assertUrlContains | Checks partial match on URL     |
| waitForVisible    | Waits until element is visible    |

> Note: Unrecognized actions are commented out in the generated code for review. If you want to add any additional action pease refer to the source code and add required actions. it is super easy!

---

### 🚀 Example Output

Base Page Class: page.js
```
const { browser } = require('@wdio/globals');

/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
module.exports = class Page {
  /**
   * Opens a sub page of the page
   * @param path path of the sub page (e.g. /path/to/page.html)
   */
  open(path) {
    return browser.url(`https://the-internet.herokuapp.com/${path}`);
  }
};
```

Page Object
```
const Page = require('./page');

/**
 * Page Object for login
 */
class LoginPage extends Page {

  get homepage() {return $('#homepage');}
  get usernameInput() {return $('#usernameInput');}
  get passwordInput() {return $('#passwordInput');}
  get loginButton() {return $('#loginButton');}
  get welcomeMessage() {return $('#welcomeMessage');}

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
```
Mocha Test

```
const { expect } = require('@wdio/globals');
const login = require('../pageobjects/login.page');

describe('login', () => {
  it('This is my successful login', async () => {
    await login.open();
    await login.thisIsMySuccessfulLogin();
  });
});
```
---
### Test execution

- To execute test on local, run `test:local` Please refer the package.json scripts. Additionally you can run your test on any cloud provider like saucelabs, browsestack, lambdatest by adding specific services. Please refer to the webdriverIO docs.

- To generate Allure report on local, run `allure:report`
---
### 💡 Tips

✅ You can integrate this with an AI-based selector generator to auto-fill stepMap.json files from feature files
🧰 Supports extension: add more action mappings in generateTestsFromMap.js
🪄 Produces clean, maintainable code with Page Object Model

🙌 Contributors
Built with ❤️ to solve real QA automation pain points and simplify the life of test engineers.

📄 License

MIT License — feel free to fork, use, improve, and contribute!
