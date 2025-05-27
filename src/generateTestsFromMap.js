// stepMapJson-to-page/spec generator logic

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { generateShortName, buildActionLine } = require('./utils');
const { stepMapDir, pageObjectDir, specDir, basePagePath } = require('./config');

function ensureBasePageClass() {
  if (!fs.existsSync(basePagePath)) {
    const content = `const { browser, $ } = require('@wdio/globals');

class Page {
  open(path) {
    return browser.url(` + '`' + `https://the-internet.herokuapp.com/${path}` + '`' + `);
  }

  async trySelector(primary, fallbacks) {
    try {
      const el = await $(primary);
      if (await el.isExisting() && await el.isDisplayed()) {
        console.log(\`✅ Using primary selector: \${primary}\`);
        return el;
      }
    } catch (e) {
      console.warn(\`⚠️ Failed to find element with primary selector: \${primary}\`);
    }
    for (const sel of fallbacks) {
      try {
        const fallback = await $(sel);
        if (await fallback.isExisting() && await fallback.isDisplayed()) {
          console.log(\`↪️ Using fallback selector: \${sel}\`);
          return fallback;
        }
      } catch {}
    }
    throw new Error(\`❌ All selectors failed:\nPrimary: \${primary}\nFallbacks: \${fallbacks.join(', ')}\`);
  }
}

module.exports = Page;`;
    fs.writeFileSync(basePagePath, content, 'utf-8');
    console.log('✅ Created base Page class with open() and trySelector()');
  }
}

function extractPathSegment(stepMap, fallback) {
  for (const steps of Object.values(stepMap)) {
    for (const step of steps) {
      if (/navigate|go to|open/i.test(step.note || '')) {
        const doc = require('compromise')(step.note);
        const nouns = doc.nouns().out('array');
        if (nouns.length > 0) {
          return nouns[0].toLowerCase().replace(/\s+/g, '-');
        }
      }
    }
  }
  return fallback.toLowerCase().replace(/\s+/g, '-');
}

function generateCodeFromStepMap(file, stepMap, opts) {
  const baseName = path.basename(file, '.stepMap.json');
  const pageClassName = `${baseName.charAt(0).toUpperCase()}${baseName.slice(1)}Page`;
  const usedSelectors = new Map();
  const scenarioMethods = [];

  for (const steps of Object.values(stepMap)) {
    for (const step of steps) {
      const methodName = generateShortName(step.selectorName);
      if (!usedSelectors.has(methodName)) {
        usedSelectors.set(methodName, {
          methodName,
          selector: step.selector,
          fallback: step.fallbackSelector
        });
      }
    }
  }

  const defaultPath = extractPathSegment(stepMap, baseName);

  const pageLines = [
    `const Page = require('./page');`,
    `class ${pageClassName} extends Page {`
  ];

  for (const { methodName, selector, fallback } of usedSelectors.values()) {
    const fallbackArray = fallback ? fallback.split(',').map(sel => `'${sel.trim()}'`).join(', ') : '';
    pageLines.push(`  get ${methodName}() {`);
    pageLines.push(`    return this.trySelector('${selector}', [${fallbackArray}]);`);
    pageLines.push('  }');
  }

  for (const [scenarioName, steps] of Object.entries(stepMap)) {
    const scenarioMethodName = generateShortName(scenarioName);
    scenarioMethods.push(scenarioMethodName);
    pageLines.push(`  async ${scenarioMethodName}() {`);
    for (const step of steps) {
      const methodName = generateShortName(step.selectorName);
      const actionLine = buildActionLine(`this.${methodName}`, step.action, step.note);
      if (actionLine) pageLines.push(`    ${actionLine}`);
    }
    pageLines.push('  }');
  }

  pageLines.push(`  open(pathSegment = '${defaultPath}') {`);
  pageLines.push('    return super.open(pathSegment);');
  pageLines.push('  }');
  pageLines.push('}');
  pageLines.push(`module.exports = new ${pageClassName}();`);
  fs.writeFileSync(path.join(pageObjectDir, `${baseName}.page.js`), pageLines.join('\n'), 'utf-8');

  const testLines = [
    `const { expect } = require('@wdio/globals');`,
    `const ${pageClassName} = require('../pageobjects/${baseName}.page');`,
    `describe('${baseName.replace(/-/g, ' ')} feature tests', () => {`
  ];

  for (const [scenarioName, steps] of Object.entries(stepMap)) {
    const scenarioMethodName = generateShortName(scenarioName);
    testLines.push(`  it('${scenarioMethodName}', async () => {`);
    testLines.push(`    await ${pageClassName}.open();`);
    for (const step of steps) {
      const methodName = generateShortName(step.selectorName);
      const actionLine = buildActionLine(`${pageClassName}.${methodName}`, step.action, step.note);
      if (actionLine) testLines.push(`    ${actionLine}`);
    }
    testLines.push(`    // Or simply use:`);
    testLines.push(`    // await ${pageClassName}.${scenarioMethodName}();`);
    testLines.push('  });');
  }

  testLines.push('});');
  fs.writeFileSync(path.join(specDir, `${baseName}.spec.js`), testLines.join('\n'), 'utf-8');

  if (!opts.dryRun) {
    console.log(`✅ Generated: ${baseName}.page.js + ${baseName}.spec.js`);
  } else {
    console.log(`[dry-run] Would write: ${path.join(pageObjectDir, `${baseName}.page.js`)}`);
    console.log(`[dry-run] Would write: ${path.join(specDir, `${baseName}.spec.js`)}`);
  }
}

function processTests(opts) {
  if (!fs.existsSync(pageObjectDir)) fs.mkdirSync(pageObjectDir, { recursive: true });
  if (!fs.existsSync(specDir)) fs.mkdirSync(specDir, { recursive: true });

  ensureBasePageClass();

  const files = opts.all
    ? fs.readdirSync(stepMapDir).filter(f => f.endsWith('.stepMap.json'))
    : opts.file || [];

  if (!files.length) {
    console.error('❌ Please provide --all or --file <file>');
    process.exit(1);
  }

  files.forEach(file => {
    const fullPath = path.join(stepMapDir, file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ Step map not found: ${file}`);
      return;
    }
    const stepMap = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    generateCodeFromStepMap(file, stepMap, opts);
  });

  if (opts.watch) {
    chokidar.watch(stepMapDir, { ignoreInitial: true }).on('all', (event, filepath) => {
      if (filepath.endsWith('.stepMap.json')) {
        console.log(`🔁 Detected change: ${event} - ${filepath}`);
        processTests({ ...opts, file: [path.basename(filepath)] });
      }
    });
    console.log('👀 Watching for step map changes...');
  }
}

module.exports = { processTests };
