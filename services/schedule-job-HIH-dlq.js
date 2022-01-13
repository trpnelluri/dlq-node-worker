'use strict';

const schedule = require('node-schedule');
const processDLQMessage = require('./receive-and-process-dlq-messages');
const populateCronSchedule = require('../sharedLib/common/build-schedule-for-job')
const loggerUtils = require('../sharedLib/common/logger-utils');

const EventName = 'DLQ-SCHEDULER'
const logger = loggerUtils.customLogger( EventName, {});

/*
The follwoing function is used to schedule a cron job to poll the HIH Notifications DLQ based on the 
schedule provided in the configuration and will process the messages placed in the dlq.
*/
async function scheduleProcessHIHDlq () {
    let cronScheduleData = await populateCronSchedule.populateScheduleJobTriggerParam(logger)
    logger.info(`cronSchedule: ${cronScheduleData}`)
    let arrayCronScheduleData = cronScheduleData.split('^')
    let cronSchedule = arrayCronScheduleData[0]
    let msgForLogger = arrayCronScheduleData[1]
 
    schedule.scheduleJob(cronSchedule, () =>{
        logger.debug(`Task is running every ${msgForLogger} ${new Date()} `)
        processDLQMessage.receiveMsgFromDLQ()
    });
}

module.exports = {
    scheduleProcessHIHDlq,
};