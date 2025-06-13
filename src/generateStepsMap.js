const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { Parser, AstBuilder, GherkinClassicTokenMatcher } = require('@cucumber/gherkin');
const { IdGenerator } = require('@cucumber/messages');

const { selectorAliases, selectorFallbacks } = require('./config');
const { generateShortName, extractQuotedText } = require('./utils');

const parser = new Parser(new AstBuilder(IdGenerator.uuid()), new GherkinClassicTokenMatcher());

// Default folders relative to project root
const defaultFeaturesPath = path.join(process.cwd(), 'features');
const defaultOutputPath = path.join(process.cwd(), 'stepMaps');

function toLogicalSelectorName(stepText) {
  const patterns = [
    { regex: /username|user name|email/i, name: 'userNameField' },
    { regex: /password/i, name: 'passwordField' },
    { regex: /login|submit/i, name: 'loginButton' },
    { regex: /dropdown.*country|country.*dropdown/i, name: 'countryDropdown' },
    { regex: /checkbox/i, name: 'termsCheckbox' },
    { regex: /link/i, name: 'link' },
    { regex: /title/i, name: 'pageTitle' },
    { regex: /url/i, name: 'currentUrl' },
    { regex: /welcome message/i, name: 'welcomeBanner' },
    { regex: /profile picture/i, name: 'avatar' },
  ];
  const found = patterns.find(p => p.regex.test(stepText));
  return found ? found.name : generateShortName(stepText);
}

function inferActionAndSelector(stepText) {
  const text = stepText.toLowerCase();
  const selectorName = toLogicalSelectorName(stepText);
  let action = 'unknown';
  let note = '';

  if (/enters?|types?|provides?|inputs?|fills?(\s+in|\s+the|\s+with)?|sets?/.test(text)) {
    action = 'setValue';
    note = extractQuotedText(stepText);
  } else if (/clicks|click|presses|taps/.test(text)) {
    action = 'click';
  } else if (/hovers/.test(text)) {
    action = 'hover';
  } else if (/uploads/.test(text)) {
    action = 'uploadFile';
    note = extractQuotedText(stepText);
  } else if (/selects|chooses/.test(text)) {
    action = 'selectDropdown';
    note = extractQuotedText(stepText);
  } else if (/scrolls? to/.test(text)) {
    action = 'scrollTo';
  } else if (/clears?/.test(text)) {
    action = 'clearText';
  } else if (/waits? for.*visible/.test(text)) {
    action = 'waitForVisible';
  } else if (/should see|sees/.test(text)) {
    action = 'assertVisible';
  } else if (/should have text/.test(text)) {
    action = 'assertText';
    note = extractQuotedText(stepText);
  } else if (/should be enabled/.test(text)) {
    action = 'assertEnabled';
  } else if (/should be disabled/.test(text)) {
    action = 'assertDisabled';
  } else if (/title should be/.test(text)) {
    action = 'assertTitle';
    note = extractQuotedText(stepText);
  } else if (/url should contain/.test(text)) {
    action = 'assertUrlContains';
    note = extractQuotedText(stepText);
  }

  const selector = selectorAliases[selectorName] || `[data-testid="${selectorName}"]`;
  const fallbackSelector = selectorFallbacks[selectorName] || '';

  return { action, selectorName, selector, fallbackSelector, note };
}

function generateStepMap(featurePath, outputPath, force) {
  const content = fs.readFileSync(featurePath, 'utf-8');
  const gherkinDocument = parser.parse(content);
  const feature = gherkinDocument.feature;
  if (!feature) return;

  const featureName = path.basename(featurePath, '.feature');
  const stepMap = {};

  for (const child of feature.children || []) {
    if (!child.scenario) continue;
    const scenario = child.scenario;
    stepMap[scenario.name] = [];
    for (const step of scenario.steps || []) {
      const entry = inferActionAndSelector(step.text);
      stepMap[scenario.name].push(entry);
    }
  }

  const outPath = path.join(outputPath, `${featureName}.stepMap.json`);
  if (!force && fs.existsSync(outPath)) {
    console.warn(`⚠️ Skipping ${featureName} (already exists)`);
    return;
  }

  fs.writeFileSync(outPath, JSON.stringify(stepMap, null, 2), 'utf-8');
  console.log(`✅ Generated step map: ${featureName}.stepMap.json`);
}

// CLI-compatible wrapper (still works fine)
function processSteps(opts) {
  const featuresPath = defaultFeaturesPath;
  const outputPath = defaultOutputPath;
  const force = opts.force || false;

  if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

  const files = opts.all
    ? fs.readdirSync(featuresPath).filter(f => f.endsWith('.feature'))
    : opts.file || [];

  if (!files.length) {
    console.error('❌ Please provide --all or --file <file>');
    process.exit(1);
  }

  files.forEach(file => {
    const fullPath = path.join(featuresPath, file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ File not found: ${file}`);
    } else {
      generateStepMap(fullPath, outputPath, force);
    }
  });

  if (opts.watch) {
    chokidar.watch(featuresPath, { ignoreInitial: true }).on('all', (event, filepath) => {
      if (filepath.endsWith('.feature')) {
        console.log(`🔁 Detected change: ${event} - ${filepath}`);
        generateStepMap(filepath, outputPath, true);
      }
    });
    console.log('👀 Watching for feature changes...');
  }
}

// ✅ Programmatic entrypoint
function generateStepMaps({ featuresPath = defaultFeaturesPath, outputPath = defaultOutputPath, force = true, watch = false }) {
  if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

  const files = fs.readdirSync(featuresPath).filter(f => f.endsWith('.feature'));

  for (const file of files) {
    const fullPath = path.join(featuresPath, file);
    generateStepMap(fullPath, outputPath, force);
  }

  if (watch) {
    chokidar.watch(featuresPath, { ignoreInitial: true }).on('all', (event, filepath) => {
      if (filepath.endsWith('.feature')) {
        console.log(`🔁 Detected change: ${event} - ${filepath}`);
        generateStepMap(filepath, outputPath, true);
      }
    });
    console.log('👀 Watching for feature changes...');
  }
}

module.exports = {
  processSteps,
  generateStepMaps
};
