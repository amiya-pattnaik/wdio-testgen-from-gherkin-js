#!/usr/bin/env node

const program = require('./src/cli');
program.parse(process.argv);

// Make sure this file has executable permission: chmod +x testgen.js
