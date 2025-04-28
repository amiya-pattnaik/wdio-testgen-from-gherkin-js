
// generateTestsFromMap.js
const fs = require('fs');
const path = require('path');

const stepMapDir = path.join(__dirname, 'stepMaps');
const pageObjectsDir = path.join(__dirname, 'test/pageobjects');
const testsDir = path.join(__dirname, 'test/specs');
const basePagePath = path.join(pageObjectsDir, 'page.js');
const readmePath = path.join(__dirname, 'README.md');

if (!fs.existsSync(pageObjectsDir)) fs.mkdirSync(pageObjectsDir, { recursive: true });
if (!fs.existsSync(testsDir)) fs.mkdirSync(testsDir, { recursive: true });

// Generate base Page.js if not present
if (!fs.existsSync(basePagePath)) {
  const basePageContent = `
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
    return browser.url(\`https://the-internet.herokuapp.com/\${path}\`);
  }
};`;
  fs.writeFileSync(basePagePath, basePageContent.trim(), 'utf-8');
  console.log('✅ Generated: page.js (base page object)');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^./, (chr) => chr.toLowerCase());
}

// function escapeSelector(str) {
//   return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
// }

function escapeSelector(selector) {
  return selector.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}


function generatePageObjectClass(featureName, scenarios) {
  const className = capitalize(toCamelCase(featureName)) + 'Page';
  const selectors = new Map();
  const scenarioMethods = [];
  let usesPath = false;

  for (const scenarioName in scenarios) {
    const steps = scenarios[scenarioName];
    const methodName = toCamelCase(scenarioName);
    const methodLines = [];

    for (const step of steps) {
      const { selectorName, selector, action, note } = step;
      if (selectorName && selector && !selectors.has(selectorName)) {
        selectors.set(selectorName, escapeSelector(selector));
      }

      let line;
      switch (action) {
        case 'setText':
          line = `    await this.${selectorName}.setValue('${note}');`;
          break;
        case 'click':
          line = `    await this.${selectorName}.click();`;
          break;
        case 'hover':
          line = `    await this.${selectorName}.moveTo();`;
          break;
        case 'doubleClick':
          line = `    await this.${selectorName}.doubleClick();`;
          break;
        case 'selectDropdown':
          line = `    await this.${selectorName}.selectByVisibleText('${note}');`;
          break;
        case 'uploadFile':
          usesPath = true;
          line = `    const filePath = path.join(__dirname, '../uploads/${note}');
    const remoteFilePath = await browser.uploadFile(filePath);
    await this.${selectorName}.setValue(remoteFilePath);`;
          break;
        case 'scrollTo':
          line = `    await this.${selectorName}.scrollIntoView();`;
          break;
        case 'clearText':
          line = `    await this.${selectorName}.clearValue();`;
          break;
        case 'waitForVisible':
          line = `    await this.${selectorName}.waitForDisplayed();`;
          break;
        case 'assertVisible':
          line = `    await expect(this.${selectorName}).toBeDisplayed();`;
          break;
        case 'assertText':
          line = `    await expect(this.${selectorName}).toHaveText('${note}');`;
          break;
        case 'assertEnabled':
          line = `    await expect(this.${selectorName}).toBeEnabled();`;
          break;
        case 'assertDisabled':
          line = `    await expect(this.${selectorName}).toBeDisabled();`;
          break;
        case 'assertTitle':
          line = `    await expect(browser).toHaveTitle('${note}');`;
          break;
        case 'assertUrlContains':
          line = `    await expect(browser).toHaveUrl(expect.stringContaining('${note}'));`;
          break;
        default:
          line = `    // Unknown action: ${action}`;
      }

      methodLines.push(line);
    }

    scenarioMethods.push(`  async ${methodName}() {\n${methodLines.join('\n')}\n  }`);
  }

  const selectorGetters = Array.from(selectors.entries())
    .map(([name, selector]) => {
      return `  get ${name}() {\n    return $('${selector}');\n  }`;
    })
    .join('\n\n');

  return `${usesPath ? "const path = require('path');\n" : ''}const Page = require('./page');

/**
 * Page Object for ${featureName}
 */
class ${className} extends Page {
${selectorGetters.length > 0 ? '\n' + selectorGetters + '\n' : ''}

${scenarioMethods.join('\n\n')}

  open() {
    return super.open('login'); // update your page specific endpoint URL. For Example 'login'
  }
}

module.exports = new ${className}();`;
}

function generateTestFile(featureName, scenarios) {
  const className = toCamelCase(featureName);
  const pageObjectPath = `../pageobjects/${className}.page`;

  let testBody = '';
  for (const scenarioName in scenarios) {
    const methodName = toCamelCase(scenarioName);
    testBody += `  it('${scenarioName}', async () => {
    await ${className}.open();
    await ${className}.${methodName}();
  });\n\n`;
  }

  return `const { expect } = require('@wdio/globals');
const ${className} = require('${pageObjectPath}');

describe('${featureName}', () => {
${testBody}});`;
}

function generateTests() {
  const files = fs.readdirSync(stepMapDir);
  for (const file of files) {
    if (!file.endsWith('.stepMap.json')) continue;

    const content = fs.readFileSync(path.join(stepMapDir, file), 'utf-8');
    const scenarios = JSON.parse(content);
    const featureName = path.basename(file, '.stepMap.json');

    const pageObjCode = generatePageObjectClass(featureName, scenarios);
    const testCode = generateTestFile(featureName, scenarios);

    const className = toCamelCase(featureName);
    fs.writeFileSync(path.join(pageObjectsDir, `${className}.page.js`), pageObjCode, 'utf-8');
    //fs.writeFileSync(path.join(testsDir, `${className}.test.js`), testCode, 'utf-8');
    fs.writeFileSync(path.join(testsDir, `${className}.spec.js`), testCode, 'utf-8');

    //console.log(`✅ Generated: ${className}.page.js & ${className}.test.js`);
    console.log(`✅ Generated: ${className}.page.js & ${className}.spec.js`);
  }
}

generateTests();
