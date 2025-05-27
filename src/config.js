// Paths, fallback selectors, aliases

const fs = require('fs');
const path = require('path');

const rootDir = __dirname.includes('src') ? path.resolve(__dirname, '..') : __dirname;

const featureDir = path.join(rootDir, 'features');
const stepMapDir = path.join(rootDir, 'stepMaps');
const testDir = path.join(rootDir, 'test');
const pageObjectDir = path.join(testDir, 'pageobjects');
const specDir = path.join(testDir, 'specs');
const basePagePath = path.join(pageObjectDir, 'page.js');

const aliasPath = path.join(rootDir, 'selector-aliases.json');
const selectorAliases = fs.existsSync(aliasPath)
  ? JSON.parse(fs.readFileSync(aliasPath, 'utf-8'))
  : {};

const selectorFallbacks = {
  userNameField: '#username, input[name="username"]',
  passwordField: '#password, input[type="password"]',
  loginButton: '#login, button[type="submit"]',
  countryDropdown: '#country, select[name="country"]',
  termsCheckbox: '#terms, input[type="checkbox"]',
  link: 'a',
  pageTitle: 'h1, title',
  currentUrl: 'window.location.href',
  welcomeBanner: '#welcome-message, .welcome',
  avatar: 'img.profile-picture'
};

module.exports = {
  featureDir,
  stepMapDir,
  testDir,
  pageObjectDir,
  specDir,
  basePagePath,
  selectorAliases,
  selectorFallbacks
};
