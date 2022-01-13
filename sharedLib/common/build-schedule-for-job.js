'use strict'

const scheduleJobType = process.env.schedulejobrunin //seconds or minutes
const runOnWeekEnds = process.env.scheduletorunonweekends //yes or no
const jobScheduleTimeMins = process.env.schedulejobinmins
const jobScheduleTimeSecs = process.env.schedulejobinsecs
/*
NOTE: scheduleJob Propety is '* * * * * *'
Explanation: 
    1st star: seconds(Optional)
    2nd star: minute
    3rd star: hour
    4th star: day of month
    5th star: month
    6th star: day of week (0 is Sunday and 6 is Saturday)
    if you need more info please refer node-schedule npm
*/

/*
NOTE: The following function is used to build the schedule job based on the values provided 
    in parameter store configuration.
*/
async function populateScheduleJobTriggerParam ( logger ){
    return new Promise((resolve, reject) => {
        try {
            logger.info(`populateScheduleJobTriggerParam scheduleJobType: ${scheduleJobType} runOnWeekEnds: ${runOnWeekEnds} jobScheduleTimeMins: ${jobScheduleTimeMins} jobScheduleTimeSecs: ${jobScheduleTimeSecs} `)
            let scheduleParam = ''
            let msgForLogger = ''
            if (scheduleJobType.toLowerCase() === 'seconds') {
                scheduleParam = `*/${jobScheduleTimeSecs} * * * * *`
                msgForLogger = `${jobScheduleTimeSecs} Secs`
            } else {
                scheduleParam = `*/${jobScheduleTimeMins} * * * *`
                msgForLogger = `${jobScheduleTimeMins} Mins`
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