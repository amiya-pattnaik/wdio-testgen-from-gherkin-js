// index.js
const path = require('path');

const generateStepsMap = require(path.join(__dirname, 'src/generateStepsMap'));
const generateTestsFromMap = require(path.join(__dirname, 'src/generateTestsFromMap'));

module.exports = {
  processSteps: generateStepsMap.processSteps,
  generateStepMaps: generateStepsMap.generateStepMaps,
  generateTestSpecs: generateTestsFromMap.generateTestSpecs
};
