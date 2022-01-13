'use strict'

const triggerType = process.env.cronjobtriggertype //seconds or minutes
const runOnWeekEnds = process.env.cronrunonweekends //yes or no
const cronTriggerTimeMins = process.env.crontriggertimeinmins
const cronTriggerTimeSecs = process.env.crontriggertimeinsecs
/*
NOTE: scheduleJob Propety is '* * * * * *'
Explanation: 
    1st star: seconds(Optional)
    2nd star: minute
    3rd star: hour
    4th star: day of month
    5th star: month
    6th star: day of week (0 is Sunday and 6 is Saturday)
    if you need more info please refer node-cron npm
*/

/*
NOTE: The following function is used to build the cron job schedule based on the values provided 
    in parameter store configuration.
*/
async function populateScheduleJobTriggerParam ( logger ){
    return new Promise((resolve, reject) => {
        try {
            logger.info(`populateScheduleJobTriggerParam triggerType: ${triggerType} runOnWeekEnds: ${runOnWeekEnds} cronTriggerTimeMins: ${cronTriggerTimeMins} cronTriggerTimeSecs: ${cronTriggerTimeSecs} `)
            let scheduleParam = ''
            let msgForLogger = ''
            if (triggerType.toLowerCase() === 'seconds') {
                scheduleParam = `*/${cronTriggerTimeSecs} * * * * *`
                msgForLogger = `${cronTriggerTimeSecs} Secs`
            } else {
                scheduleParam = `*/${cronTriggerTimeMins} * * * *`
                msgForLogger = `${cronTriggerTimeMins} Mins`
            }
            logger.debug(`scheduleParam: ${scheduleParam}`)
            if ( runOnWeekEnds.toLowerCase() === 'no') {
                scheduleParam = scheduleParam.replace(/.$/, '1-5')
                msgForLogger = `${msgForLogger} on Weekdays.`
            }
            let returnParam = `${scheduleParam}^${msgForLogger}`
            logger.info(`populateScheduleJobTriggerParam scheduleParam: ${scheduleParam} msgForLogger: ${msgForLogger}`)
            resolve(returnParam)
    
        } catch(err) {
            logger.error(`ERROR in populateScheduleJobTriggerParam: ${err.stack}`);
            reject(err);
        }
    })
}

module.exports = {
    populateScheduleJobTriggerParam,
}