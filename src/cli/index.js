#!/usr/bin/env node

const progam = require('../index.js');

/**
 * The main entry for the application
 */
progam(process.argv).then(() => {
    debugger;
    process.exit(0);
}).catch((err) => {
    process.exit(1);
});
