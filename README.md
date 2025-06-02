![npm](https://img.shields.io/npm/v/wdio-testgen-from-gherkin-js)
![downloads](https://img.shields.io/npm/dm/wdio-testgen-from-gherkin-js)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://webdriver.io/)
[![Automation Level](https://img.shields.io/badge/automation-100%25-success)](https://webdriver.io/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.x-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with ❤️](https://img.shields.io/badge/made%20with-%E2%9D%A4-red)](#)

# 🤖 wdio-testgen-from-gherkin-js (WebdriverIO Test Generator from Gherkin JavaScript)

> CLI and Node.js tool to auto-generate WebdriverIO Page Object classes and Mocha test specs from Gherkin `.feature` files using NLP for selector and method inference.

## 🚀 What It Does

1. **Step Map Generation**  
   Parses `.feature` files into structured `.stepMap.json` with fields like `action`, `selectorName`, `selector`, `fallbackSelector`, and `note`.

2. **Test Code Generation**  
   Uses step maps to generate:
   - 🧩 WebdriverIO Page Object Model (POM) classes
   - 🧪 Mocha test spec files

---

## 📦 Installation

### Option 1: Clone for local development
```bash

git clone https://github.com/amiya-pattnaik/wdio-testgen-from-gherkin-js.git
cd wdio-testgen-from-gherkin-js
npm install

```

### Option 2: Install from NPM

```
npm install wdio-testgen-from-gherkin-js

```

---

## 🧭 Directory Structure

```
project-root/
├── features/                   # Gherkin .feature files (user input / source file)
├── stepMaps/                   # Auto-generated .stepMap.json files
├── test/                 
│   ├── pageobjects/            # Auto-generated WebdriverIO tests Page Object Model classes
│   └── specs/                  # Auto-generated Mocha test specs
├── src/
│   ├── cli.js                  # Main CLI logic
│   ├── generateStepsMap.js     # Feature-to-stepMap generator
│   ├── generateTestsFromMap.js # stepMap-to-page/spec generator
│   ├── utils.js                # Helper methods
│   └── config.js               # Paths, fallback selectors, aliases
│   └── __tests__/              # Unit tests (Vitest)
├── testgen.js                  # CLI entry point
│── wdio.config.js              # WebdriverIO configuration
├── package.json                # Scripts and dependencies
├── selector-aliases.json       # Optional user-defined selector overrides the primary selector
```
---
## 🚀 CLI Usage

### Option A: Use with npx

```bash
# Step 1: Generate stepMap.json from the .feature files
npx testgen steps --all
npx testgen steps --file login.feature

# Step 2: Generate test code (Page Objects and Mocha Specs) from stepMap.json
npx testgen tests --all
npx testgen tests --file login.stepMap.json
npm run testgen:tests -- --file login.stepMap.json --dry-run

# Step 3: Execute tests and generate Allure reoprt
npx testgen:run
npx testgen:run -- --report         # Run tests + generate report
npx testgen:run -- --report-only    # Just show last test run report
```
> Note: npx testgen requires npm link and optional tsx installed globally.
> This links the CLI executable (bin.testgen) to your system's global path (/usr/local/bin/testgen on macOS/Linux).
```bash
npm install -g
npm link
```

### Option B: Use with npm scripts
```bash
# Step 1: Generate stepMap.json from the .feature files
npm run testgen:steps -- --all                 
npm run testgen:steps -- --file login.feature

# Step 2: Generate Page Objects and Mocha Specs from stepMap.json
npm run testgen:tests -- --all
npm run testgen:tests -- --file login.stepMap.json
npm run testgen:tests -- --file login.stepMap.json --dry-run

# Step 3: Execute tests and generate Allure reoprt
npm run testgen:run
npm run testgen:run -- --report         # Run tests + generate report
npm run testgen:run -- --report-only    # Just show last test run report
```

### Option C: Use as a global CLI command

#### One-time setup:
```bash
npm install -g
npm install -g tsx         # Required for CLI to run with node shebang
chmod +x testgen.js        # Make CLI executable (Mac/Linux)
npm link                   # If fails, try: sudo npm link
```
#### Now run from anywhere:
> ⚠️ Requires global tsx installed (npm install -g tsx)

```bash
testgen steps --all
testgen tests --file login.stepMap.json
testgen run --report        # ⬅️ Runs tests and generate allure report
testgen run --report-only   # ⬅️ Generate report without rerunning testsbash
```

## 📜 Programmatic API Usage

You can use `wdio-testgen-from-gherkin-js` package both as a CLI tool and as a Node.js module in custom scripts.

In your project workking directory like any other NPM modules install this package as `npm install wdio-testgen-from-gherkin-js`

Example: generate-tests.js

```js
const { generateStepMaps, generateTestSpecs } = require('wdio-testgen-from-gherkin-js');

// Generate stepMap JSON files from .feature files
generateStepMaps({
  featuresPath: './features',      // path to your .feature files. Make sure features folder exist and has .feature files
  outputPath: './stepMaps',        // where to write stepMap JSONs
  watch: false,
  force: true
});

// Generate Page Object classes and Mocha test specs
generateTestSpecs({
  stepMapDir: './stepMaps',        // location of generated stepMaps
  outputDir: './test',             // base directory to create pageobjects/ and specs/
  dryRun: false,
  watch: false
});
```
#### Output Structure:

```
test/
├── pageobjects/
│   └── login.page.js
└── specs/
    └── login.spec.js
```
---

## ⚙️ Available Commands & Flags

#### `testgen steps`
| Flag         | Description                              |
|--------------|------------------------------------------|
| `--all`      | Parse all feature files                  |
| `--file`     | Parse specific feature file(s)           |
| `--watch`    | Watch for changes                        |
| `--verbose`  | Print detailed logs                      |
|`--dry-run`   | Show files that would be created         |
| `--force`    | Overwrite existing stepMap files         |

#### `testgen tests`
| Flag         | Description                              |
|--------------|------------------------------------------|
| `--all`      | Generate tests for all step maps         |
| `--file`     | Generate tests for specific step maps    |
| `--watch`    | Watch and regenerate on change           |
| `--verbose`  | Print detailed logs                      |
| `--dry-run`  | Show files that would be created         |
| `--force`    | Overwrite existing test files            |

#### `testgen run`
| Flag           | Description                                      |
|----------------|--------------------------------------------------|
| `--report`     | Generate Allure report after test run            |
| `--report-only`| Generate only Allure report (skip running tests) |
---

## 📁 Minimal Example

### `features/login.feature`
```gherkin
Feature: Login
  Scenario: Successful login
    Given I open the login page
    When I enter "admin" into the username field
    And I enter "adminpass" into the password field
    And I click the login button
    Then I should see the dashboard
```

### Generated: `stepMaps/login.stepMap.json`
```json
{
  "Successful login": [
    {
      "action": "setValue",
      "selectorName": "userNameField",
      "selector": "[data-testid=\"userNameField\"]",
      "fallbackSelector": "#username, input[name=\"username\"]",
      "note": "admin"
    },
    {
      "action": "setValue",
      "selectorName": "passwordField",
      "selector": "[data-testid=\"passwordField\"]",
      "fallbackSelector": "#password, input[type=\"password\"]",
      "note": "adminpass"
    },
    {
      "action": "click",
      "selectorName": "loginButton",
      "selector": "[data-testid=\"loginButton\"]",
      "fallbackSelector": "#login, button[type=\"submit\"]",
      "note": ""
    },
    {
      "action": "assertVisible",
      "selectorName": "dashboard",
      "selector": "[data-testid=\"dashboard\"]",
      "fallbackSelector": "",
      "note": ""
    }
  ]
}
```

> Note: Additionally, ensure that you update the relevant selector for the DOM element of your application under test after generating your JSON file. This will serve as your foundation, and your page objects and test spec files will be constructed based on this data.

### Generated: `test/pageobjects/page.js`
```js
iconst { browser, $ } = require('@wdio/globals');

class Page {
  open(path) {
    return browser.url(`https://the-internet.herokuapp.com/[object Object]`);
  }

  async trySelector(primary, fallbacks) {
    try {
      const el = await $(primary);
      if (await el.isExisting() && await el.isDisplayed()) {
        console.log(`✅ Using primary selector: ${primary}`);
        return el;
      }
    } catch (e) {
      console.warn(`⚠️ Failed to find element with primary selector: ${primary}`);
    }
    for (const sel of fallbacks) {
      try {
        const fallback = await $(sel);
        if (await fallback.isExisting() && await fallback.isDisplayed()) {
          console.log(`↪️ Using fallback selector: ${sel}`);
          return fallback;
        }
      } catch {}
    }
    throw new Error(`❌ All selectors failed:\nPrimary: ${primary}\nFallbacks: ${fallbacks.join(', ')}`);
  }
}

module.exports = Page;
```

### Generated: `test/pageobjects/login.page.js`
```js
import Page from './page';

class LoginPage extends Page {
  get userNameField() {
    return this.trySelector('[data-testid="userNameField"]', ['#username', 'input[name="username"]']);
  }

  get passwordField() {
    return this.trySelector('[data-testid="passwordField"]', ['#password', 'input[type="password"]']);
  }

  get loginButton() {
    return this.trySelector('[data-testid="loginButton"]', ['#login', 'button[type="submit"]']);
  }

  get dashboard() {
    return this.trySelector('[data-testid="dashboard"]', []);
  }

  async successfulLogin() {
    await (await this.userNameField).setValue('admin');
    await (await this.passwordField).setValue('adminpass');
    await (await this.loginButton).click();
    await expect(await this.dashboard).toBeDisplayed();
  }

  open(pathSegment: string = 'login') {
    return super.open(pathSegment);
  }
}

export default new LoginPage();
```

### Generated: `test/specs/login.spec.js`
```js
import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page';

describe('login feature tests', () => {
  it('successfulLogin', async () => {
    await LoginPage.open();
    await (await LoginPage.userNameField).setValue('admin');
    await (await LoginPage.passwordField).setValue('adminpass');
    await (await LoginPage.loginButton).click();
    await expect(await LoginPage.dashboard).toBeDisplayed();

    // Or simply use:
    // await LoginPage.successfulLogin();
  });
});
```
> Note: It is recommended to examine the generated code and implement any required adjustments to meet your needs, such as invoking methods from test spec files to the page class, incorporating reusable methods, renaming selector name, method name (if any) and managing your test data etc.

---

## ✅ Features Implemented

### 🔁 1. **Two-Step Test Generation Flow**

- **Step 1**: Parse `.feature` files and generate scenario-wise `stepMap.json`.
- **Step 2**: Use `stepMap.json` to auto-generate:
  - WebdriverIO Page Object classes.
  - Mocha test spec files.


### 🧠 2. **AI/NLP-Driven Selector Name Inference**

- Uses the `compromise` NLP library to generate meaningful selector, method names based on verbs/nouns in step text.
- Example:  
  `"When user clicks login"` → `selectorName: "clicklogin"`

### 🧠 3. **Logical Selector + Fallback Selector with priority**

- Applies regex-based matching to map common UI elements to logical names:
  - e.g., `username` → `userNameField`
  - `login` → `loginButton`

- Logical names are mapped to selector and fallbackSelector:
  ```json
  {
    "selector": "[data-testid=\"loginButton\"]",
    "fallbackSelector": "#login, button[type=\"submit\"]",
  }
  ```
  > <span style="color: green;">The `fallbackSelector` is a palce holder for containing more than one alternative selector. At the run time if the primary selector (i.e. "selector": "[data-testid=\"loginButton\"]") fails to locate the element, it will log `⚠️ Failed to find element with primary selector`, and then it will pick one of the alternative selctor mentioned in the `fallbackSelector`. If it finds the right selector it will log `↪️ Using fallback selector`. If none of the alternative selector found, then it will trrow error `❌ All selectors failed`.</span>

### 🔄 4. **User-Defined Selector Aliases (Optional)**

- Optional file: `selector-aliases.json`. When implemented it overrides the default primary selector ("selector": "#login-username",) of the generated .stepMap.json. If you don't need the selector-aliases.json then either you rename it or delete it from the root.
```json
{
  "userNameField": "#login-username",
  "loginButton": "#login-btn"
}
```
`Priority Order:`

  1. Selector aliases (selector-aliases.json), if exists it will take the first priority over the regex-based default `selector` generated by tool.
  2. Fallback selector

### 🧪 5. **Action Inference Engine**

Automatically extracts values from steps:
```gherkin
When user enters "admin" in the username field
```
`→ action: "setValue", note: "admin"`

| Gherkin Step Example    | Action | Notes  |
| ----------------------- | -------| ------ |
| When user enters "admin"  | setValue  | "admin" |
| When user clicks login    | Click     |
| Then user should see the welcome message     | assertVisible    |
| Then title should be "Dashboard"    | assertTitle     | "Dashboard" |
| Then url should contain "success"   | assertUrlContains    |

#### 🧠 **Supported Actions Example**

Supports a wide range of actions: `setValue`, `click`, `selectDropdown`, `uploadFile`, `hover`, `clearText`, s`crollTo`, `assertVisible`, `assertText`, `assertEnabled`, `assertDisabled`, `assertTitle`, `assertUrlContains`, etc.

| Action    | Description |
| -------- | ------- |
| setValue         | Sets input value    |
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

> <span style="color: green;">Please be advised that any unrecognized actions have been commented out in the generated code for your review. Should you wish to include any additional actions, kindly refer to the source code (src\\) and incorporate the necessary actions, which is quite straightforward. You may utilize any WebdriverIO commands as needed.</span>

---

## 🧰 Troubleshooting

**Error:** `command not found: testgen`  
✅ Run `npm link` again inside the project root.

**Error:** `env: tsx: No such file or directory`  
✅ Install `tsx` globally: `npm install -g tsx`

**Error:** `ENOENT: no such file or directory, open 'package.json'`  
✅ You’re running `npm run` outside the project — run from root.

---

## 🔗 Related
- TS version: [`wdio-testgen-from-gherkin-ts`](https://www.npmjs.com/package/wdio-testgen-from-gherkin-ts)
- TS version: This repo/package

## 📢 Releases and Feedback
Check out the [Releases](https://github.com/amiya-pattnaik/wdio-testgen-from-gherkin-js/releases) tab for version history and improvements.

Want to discuss features or share feedback? Use [GitHub Discussions](https://github.com/amiya-pattnaik/wdio-testgen-from-gherkin-js/discussions) or open an issue.

## 🧑 Author
**Amiya Pattanaik**

For issues, enhancements or feature requests, [open an issue](https://github.com/amiya-pattnaik/wdio-testgen-from-gherkin-js/issues).
