'use strict'

const awsParamEnv = require('aws-param-env');
const loggerUtils = require('../common/logger-utils');
const environment = process.env.environment || 'dev';
const parameterStore = process.env.PATH_PERAMETER_STORE;
const EventName = 'AWS_Parameter_Store'
const configPath = parameterStore + environment + '/dlqworker/config/'

/*
The following function is used to load all the enviornment variables from AWS parameterstore to Config file.
*/
function loadEnvVariablesFromAWSParamStore() {
    try {
        awsParamEnv.load(`${configPath}`, { region: 'us-east-1' });
        let logParams = {};
        const logger = loggerUtils.customLogger( EventName, logParams);
        logger.info('Env variables loaded successfully from AWS Parameter Store.');
    } catch (err) {
        console.error('ERROR loading the env variables from AWS Parameter Store.' + err.stack)
    }
}

module.exports = {
    loadEnvVariablesFromAWSParamStore,
};