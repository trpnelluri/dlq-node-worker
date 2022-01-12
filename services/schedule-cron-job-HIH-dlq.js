'use strict';

const cron = require('node-cron');
const processDLQMessage = require('./receive-and-process-dlq-messages');
const populateCronSchedule = require('../sharedLib/common/build-cron-schedule')
const loggerUtils = require('../sharedLib/common/logger-utils');

const EventName = 'DLQ-SCHEDULER'
const logger = loggerUtils.customLogger( EventName, {});

/*
The follwoing function is used to schedule a cron job to poll the HIH Notifications DLQ based on the 
schedule provided in the configuration and will process the messages placed in the dlq.
*/
async function scheduleHIHDlqCron () {
    let cronScheduleData = await populateCronSchedule.populateCronJobTriggerParam(logger)
    logger.info(`cronSchedule: ${cronScheduleData}`)
    let arrayCronScheduleData = cronScheduleData.split('^')
    let cronSchedule = arrayCronScheduleData[0]
    let msgForLogger = arrayCronScheduleData[1]
    cron.schedule(cronSchedule, () =>{
        logger.debug(`Task is running every ${msgForLogger} ${new Date()} `)
        processDLQMessage.receiveMsgFromDLQ()
    });
}

module.exports = {
    scheduleHIHDlqCron,
};