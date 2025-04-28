//
// // generateStepMap.js
//
// const fs = require('fs');
// const path = require('path');
// const { Parser, AstBuilder, GherkinClassicTokenMatcher } = require('@cucumber/gherkin');
// const { IdGenerator } = require('@cucumber/messages');
//
// const featureDir = path.join(__dirname, 'features');
// const stepMapDir = path.join(__dirname, 'stepMaps');
// if (!fs.existsSync(stepMapDir)) fs.mkdirSync(stepMapDir);
//
// const pseudoSelector = (selectorName) => `#${selectorName || 'some-id'}`;
//
// function mapStepText(text) {
//   const t = text.toLowerCase();
//
//   if (t.includes('open')) return { action: 'openUrl', selectorName: 'homepage', note: '/' };
//   if (t.includes('enter username')) return { action: 'setText', selectorName: 'usernameInput', note: 'tomsmith' };
//   if (t.includes('enter password')) return { action: 'setText', selectorName: 'passwordInput', note: 'SuperSecretPassword' };
//   if (t.includes('click') && t.includes('login')) return { action: 'click', selectorName: 'loginButton', note: '' };
//   if (t.includes('see') && t.includes('welcome')) return { action: 'assertText', selectorName: 'welcomeMessage', note: 'Welcome Tom!' };
//   if (t.includes('hover')) return { action: 'hover', selectorName: 'userAvatar', note: '' };
//   if (t.includes('double click') || t.includes('double-click')) return { action: 'doubleClick', selectorName: 'editProfileBtn', note: '' };
//   if ((t.includes('select') || t.includes('choose')) && t.includes('country')) return { action: 'selectDropdown', selectorName: 'countryDropdown', note: 'India' };
//   if (t.includes('upload') && t.includes('resume')) return { action: 'uploadFile', selectorName: 'resumeUpload', note: 'resume.pdf' };
//   if (t.includes('scroll') && t.includes('footer')) return { action: 'scrollTo', selectorName: 'footerSection', note: '' };
//   if (t.includes('logout') && t.includes('visible')) return { action: 'assertVisible', selectorName: 'logoutBtn', note: '' };
//
//   if (t.includes('enter') && t.includes('username')) return { action: 'setText', selectorName: 'usernameInput', note: extractQuotedText(text) };
//   if (t.includes('enter') && t.includes('password')) return { action: 'setText', selectorName: 'passwordInput', note: extractQuotedText(text) };
//   if (t.includes('enter') && t.includes('field')) return { action: 'setText', selectorName: extractFieldName(text), note: extractQuotedText(text) };
//   if (t.includes('clear') && t.includes('field')) return { action: 'clearText', selectorName: extractFieldName(text), note: '' };
//
//   if (t.includes('should be visible')) return { action: 'assertVisible', selectorName: extractFieldName(text), note: '' };
//   if (t.includes('should be enabled')) return { action: 'assertEnabled', selectorName: extractFieldName(text), note: '' };
//   if (t.includes('should be disabled')) return { action: 'assertDisabled', selectorName: extractFieldName(text), note: '' };
//   if (t.includes('title should be')) return { action: 'assertTitle', selectorName: '', note: extractQuotedText(text) };
//   if (t.includes('url should contain')) return { action: 'assertUrlContains', selectorName: '', note: extractQuotedText(text) };
//
//   if (t.includes('scroll to')) return { action: 'scrollTo', selectorName: extractFieldName(text), note: '' };
//   if (t.includes('wait for')) return { action: 'waitForVisible', selectorName: extractFieldName(text), note: '' };
//   if (t.includes('should see') && t.includes('message')) return { action: 'assertText', selectorName: extractFieldName(text), note: extractQuotedText(text) };
//
//   return null; // skip unknown steps
// }
//
// function extractQuotedText(text) {
//   const match = text.match(/"([^"]+)"/);
//   return match ? match[1] : '';
// }
//
// function extractFieldName(text) {
//   const match = text.match(/the (.*?) (field|button|section|message)/);
//   return match ? match[1].replace(/ /g, '') + match[2][0].toUpperCase() + match[2].slice(1) : 'someElement';
// }
//
// function extractStepsFromFeature(filePath) {
//   const content = fs.readFileSync(filePath, 'utf-8');
//   const builder = new AstBuilder(IdGenerator.uuid());
//   const matcher = new GherkinClassicTokenMatcher();
//   const parser = new Parser(builder, matcher);
//   const gherkinDocument = parser.parse(content);
//
//   const scenarios = {};
//   const feature = gherkinDocument.feature;
//
//   for (const child of feature.children) {
//     if (!child.scenario) continue;
//     const scenario = child.scenario;
//     const scenarioSteps = [];
//
//     for (const step of scenario.steps) {
//       const mapped = mapStepText(step.text);
//       if (!mapped) continue; // skip unknown steps
//       const selector = mapped.selectorName ? pseudoSelector(mapped.selectorName) : '';
//       scenarioSteps.push({
//         action: mapped.action,
//         selectorName: mapped.selectorName,
//         selector,
//         note: mapped.note
//       });
//     }
//
//     scenarios[scenario.name] = scenarioSteps;
//   }
//
//   return scenarios;
// }
//
// function generateStepMaps() {
//   const files = fs.readdirSync(featureDir);
//   for (const file of files) {
//     if (!file.endsWith('.feature')) continue;
//     const fullPath = path.join(featureDir, file);
//     const fileNameWithoutExt = path.basename(file, '.feature');
//     const scenarios = extractStepsFromFeature(fullPath);
//     const outputPath = path.join(stepMapDir, `${fileNameWithoutExt}.stepMap.json`);
//     fs.writeFileSync(outputPath, JSON.stringify(scenarios, null, 2), 'utf-8');
//     console.log(`✅ StepMap created: ${fileNameWithoutExt}.stepMap.json`);
//   }
// }
//
// generateStepMaps();


// generateStepMap.js

const fs = require('fs');
const path = require('path');
const { Parser, AstBuilder, GherkinClassicTokenMatcher } = require('@cucumber/gherkin');
const { IdGenerator } = require('@cucumber/messages');

const featureDir = path.join(__dirname, 'features');
const stepMapDir = path.join(__dirname, 'stepMaps');
if (!fs.existsSync(stepMapDir)) fs.mkdirSync(stepMapDir);

const pseudoSelector = (selectorName) => `#${selectorName || 'some-id'}`;

function mapStepText(text) {
  const t = text.toLowerCase();

  if (t.includes('open')) return { action: 'openUrl', selectorName: 'homepage', note: '/' };
  if (t.includes('enter username')) return { action: 'setText', selectorName: 'usernameInput', note: 'tomsmith' };
  if (t.includes('enter password')) return { action: 'setText', selectorName: 'passwordInput', note: 'SuperSecretPassword' };
  if (t.includes('click') && t.includes('login')) return { action: 'click', selectorName: 'loginButton', note: '' };
  if (t.includes('see') && t.includes('welcome')) return { action: 'assertText', selectorName: 'welcomeMessage', note: 'Welcome Tom!' };
  if (t.includes('hover')) return { action: 'hover', selectorName: 'userAvatar', note: '' };
  if (t.includes('double click') || t.includes('double-click')) return { action: 'doubleClick', selectorName: 'editProfileBtn', note: '' };
  if ((t.includes('select') || t.includes('choose')) && t.includes('country')) return { action: 'selectDropdown', selectorName: 'countryDropdown', note: 'India' };
  if (t.includes('upload') && t.includes('resume')) return { action: 'uploadFile', selectorName: 'resumeUpload', note: 'resume.pdf' };
  if (t.includes('scroll') && t.includes('footer')) return { action: 'scrollTo', selectorName: 'footerSection', note: '' };
  if (t.includes('logout') && t.includes('visible')) return { action: 'assertVisible', selectorName: 'logoutBtn', note: '' };

  if (t.includes('enter') && t.includes('username')) return { action: 'setText', selectorName: 'usernameInput', note: extractQuotedText(text) };
  if (t.includes('enter') && t.includes('password')) return { action: 'setText', selectorName: 'passwordInput', note: extractQuotedText(text) };
  if (t.includes('enter') && t.includes('field')) return { action: 'setText', selectorName: extractFieldName(text), note: extractQuotedText(text) };
  if (t.includes('clear') && t.includes('field')) return { action: 'clearText', selectorName: extractFieldName(text), note: '' };
  if (t.includes('should be visible')) return { action: 'assertVisible', selectorName: extractFieldName(text), note: '' };
  if (t.includes('should be enabled')) return { action: 'assertEnabled', selectorName: extractFieldName(text), note: '' };
  if (t.includes('should be disabled')) return { action: 'assertDisabled', selectorName: extractFieldName(text), note: '' };
  if (t.includes('title should be')) return { action: 'assertTitle', selectorName: '', note: extractQuotedText(text) };
  if (t.includes('url should contain')) return { action: 'assertUrlContains', selectorName: '', note: extractQuotedText(text) };
  if (t.includes('scroll to')) return { action: 'scrollTo', selectorName: extractFieldName(text), note: '' };
  if (t.includes('wait for')) return { action: 'waitForVisible', selectorName: extractFieldName(text), note: '' };
  if (t.includes('should see') && t.includes('message')) return { action: 'assertText', selectorName: extractFieldName(text), note: extractQuotedText(text) };

  return null; // skip unknown steps
}

function extractQuotedText(text) {
  const match = text.match(/"([^"]+)"/);
  return match ? match[1] : '';
}

function extractFieldName(text) {
  const match = text.match(/the (.*?) (field|button|section|message)/);
  return match ? match[1].replace(/ /g, '') + match[2][0].toUpperCase() + match[2].slice(1) : 'someElement';
}

function extractStepsFromFeature(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const builder = new AstBuilder(IdGenerator.uuid());
  const matcher = new GherkinClassicTokenMatcher();
  const parser = new Parser(builder, matcher);
  const gherkinDocument = parser.parse(content);

  const scenarios = {};
  const feature = gherkinDocument.feature;

  for (const child of feature.children) {
    if (!child.scenario) continue;
    const scenario = child.scenario;
    const scenarioSteps = [];

    for (const step of scenario.steps) {
      const mapped = mapStepText(step.text);
      if (!mapped || (mapped.selectorName === '' && mapped.selector === '')) continue;
      const selector = mapped.selectorName ? pseudoSelector(mapped.selectorName) : '';
      scenarioSteps.push({
        action: mapped.action,
        selectorName: mapped.selectorName,
        selector,
        note: mapped.note
      });
    }

    scenarios[scenario.name] = scenarioSteps;
  }

  return scenarios;
}

function generateStepMaps() {
  const files = fs.readdirSync(featureDir);
  for (const file of files) {
    if (!file.endsWith('.feature')) continue;
    const fullPath = path.join(featureDir, file);
    const fileNameWithoutExt = path.basename(file, '.feature');
    const scenarios = extractStepsFromFeature(fullPath);
    const outputPath = path.join(stepMapDir, `${fileNameWithoutExt}.stepMap.json`);
    fs.writeFileSync(outputPath, JSON.stringify(scenarios, null, 2), 'utf-8');
    console.log(`✅ StepMap created: ${fileNameWithoutExt}.stepMap.json`);
  }
}

generateStepMaps();
