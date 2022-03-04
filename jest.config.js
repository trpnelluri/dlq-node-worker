'use strict';

// vars for the unit-tests...
process.env.LOG_LEVEL = 'verbose';
process.env.JEST_REPORT_FILE = './coverage/mocha.json';

module.exports = {
    name: 'auditworker',
    globals: {
        window: {}
    },
    collectCoverage: true,
    coverageThreshold: {
        global: {
            functions: 80,
            lines: 80,
            statements: -20
        }
    },
    collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**',
        '!**/coverage*/**',
        '!sharedLib/aws/*',
        '!controllers/*',
        '!sharedLib/common/logger-utils.js',
        '!sharedLib/common/get-required-data-from-db.js',
        '!services-utils/*',
        '!services/*',
        '!app.js',
        '!**/*.config.js',
        '!**/*.init.js'
    ],
    coverageReporters: ['json', 'lcov', 'html', 'text'],
    testEnvironment: 'node',
    testResultsProcessor: 'jest-junit',
    verbose: true,
    silent: true
};