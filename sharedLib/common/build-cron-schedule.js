'use strict'

const triggerType = process.env.cronjobtriggertype //seconds or minutes
const runOnWeekEnds = process.env.cronrunonweekends //yes or no
const cronTriggerTimeMins = process.env.crontriggertimeinmins
const cronTriggerTimeSecs = process.env.crontriggertimeinsecs
/*
NOTE: Cron job Schedule Propety is '* * * * * *'
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
async function populateCronJobTriggerParam ( logger ){
    return new Promise((resolve, reject) => {
        try {
            logger.info(`triggerType: ${triggerType} runOnWeekEnds: ${runOnWeekEnds} cronTriggerTimeMins: ${cronTriggerTimeMins} cronTriggerTimeSecs: ${cronTriggerTimeSecs} `)
            let cronParam = ''
            let msgForLogger = ''
            if (triggerType.toLowerCase() === 'seconds') {
                cronParam = `*/${cronTriggerTimeSecs} * * * * *`
                msgForLogger = `${cronTriggerTimeSecs} Secs`
            } else {
                cronParam = `*/${cronTriggerTimeMins} * * * *`
                msgForLogger = `${cronTriggerTimeMins} Mins`
            }
            logger.debug(`cronParam: ${cronParam}`)
            if ( runOnWeekEnds.toLowerCase() === 'no') {
                cronParam = cronParam.replace(/.$/, '1-5')
                msgForLogger = `${msgForLogger} on Weekdays.`
            }
            let returnParam = `${cronParam}^${msgForLogger}`
            logger.info(`cronParam: ${cronParam} msgForLogger: ${msgForLogger}`)
            resolve(returnParam)
    
        } catch(err) {
            logger.error(`ERROR in populateCronJobTriggerParam: ${err.stack}`);
            reject(err);
        }
    })
}

module.exports = {
    populateCronJobTriggerParam,
}