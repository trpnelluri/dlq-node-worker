'use strict'

const express = require('express');
// eslint-disable-next-line no-unused-vars
const config = require('dotenv').config({ path: './config/.env' });
const ParameterStoreData = require('./sharedLib/aws/parameter-store-service');
ParameterStoreData.loadEnvVariablesFromAWSParamStore();
const scheduleJobToProcessHIHDlq = require('./services/schedule-job-HIH-dlq')
const loggerUtils = require('./sharedLib/common/logger-utils');
const EventName = 'DLQ_WORKER_APP';
let logParams = {};
const logger = loggerUtils.customLogger( EventName, logParams);
const app = express();
app.use('/', require('./routes/route'));
const port = process.env.port || 8090;
app.listen(port, () => {
    logger.info(`app.listen, listining on port: ${port} Release Version: ${process.env.releaseversion}`);
    // The following function invoke the sqs message consumer service when ever the application starts.
    scheduleJobToProcessHIHDlq.scheduleProcessHIHDlq();
    logger.info('app.listen, scheduleProcessHIHDlq Job Started');
});