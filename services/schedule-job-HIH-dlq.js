'use strict';

const schedule = require('node-schedule');
const processDLQMessage = require('./receive-and-process-dlq-messages');
const scheduleJobConfig = require('../sharedLib/common/build-schedule-for-job')
const loggerUtils = require('../sharedLib/common/logger-utils');

const EventName = 'Scheduler'
const logger = loggerUtils.customLogger( EventName, {});

/*
The follwoing function is used to schedule the job to poll the HIH Notifications DLQ based on the 
schedule provided in the configuration and will process the messages placed in the dlq.
*/
async function scheduleProcessHIHDlq () {
    let scheduleJobConfigData = await scheduleJobConfig.populateScheduleJobTriggerParam(logger)
    logger.info(`scheduleJobConfigData: ${scheduleJobConfigData}`)
    let arrScheduleJobConfigData = scheduleJobConfigData.split('^')
    let jobSchedule = arrScheduleJobConfigData[0]
    let msgForLogger = arrScheduleJobConfigData[1]
 
    schedule.scheduleJob(jobSchedule, () =>{
        logger.debug(`Task is running every ${msgForLogger} ${new Date()} `)
        processDLQMessage.receiveMsgFromDLQ()
    });
}

module.exports = {
    scheduleProcessHIHDlq,
};