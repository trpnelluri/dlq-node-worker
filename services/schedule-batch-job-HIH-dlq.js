'use strict';

const cron = require('node-cron');
const processDLQMessage = require('../services/receive-and-process-dlq-messages');
const loggerUtils = require('../sharedLib/common/logger-utils');

//const cronTriggerTimeMins = process.env.crontriggertimeinmins
const cronTriggerTimeSecs = process.env.crontriggertimeinsecs
const EventName = 'DLQWORKERCONTROLLER'
let logParams = {};
const logger = loggerUtils.customLogger( EventName, logParams);

async function scheduleHIHDlqCron () {
    cron.schedule(`*/${cronTriggerTimeSecs} * * * * *`, () =>{
        logger.debug(`Task is running every ${cronTriggerTimeSecs} Secs ${new Date()} `)
        processDLQMessage.receiveMsgFromDLQ()
    });
}

module.exports = {
    scheduleHIHDlqCron,
};