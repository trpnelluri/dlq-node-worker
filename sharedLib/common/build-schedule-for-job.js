'use strict'

const scheduleJobType = process.env.schedulejobrunin || 'seconds'//seconds or minutes
const runOnWeekEnds = process.env.scheduletorunonweekends || 'no^1-5'//yes or no^days to run
const jobScheduleTimeMins = process.env.schedulejobinmins || '1'// time in mins the Job should trigger
const jobScheduleTimeSecs = process.env.schedulejobinsecs || '30'// time in secs the Job should trigger
const scheduleNightly = process.env.schedulenightly || 'no^6-19'//yes or no^hours to run
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
            let scheduleHours = '*'

            //Check to verify nightly run enable or not
            if ( scheduleNightly !== undefined ) {
                let arrScheNightly = scheduleNightly.split('^')
                let paramScheNightly = arrScheNightly[0].toLowerCase()
                let hoursToRun = arrScheNightly[1]
                if ( paramScheNightly === 'no') {
                    scheduleHours = hoursToRun
                    msgForLogger = 'Task disabled nightly and is running every'

                } else {
                    msgForLogger = 'Task is running every'
                }
            }
            //Check to schedule the job in seconds or minitues
            if (scheduleJobType.toLowerCase() === 'seconds') {
                scheduleParam = `*/${jobScheduleTimeSecs} * ${scheduleHours} * * *`
                msgForLogger = `${msgForLogger} ${jobScheduleTimeSecs} Secs`
            } else {
                scheduleParam = `*/${jobScheduleTimeMins} ${scheduleHours} * * *`
                msgForLogger = `${msgForLogger} ${jobScheduleTimeMins} Mins`
            }
            logger.debug(`scheduleParam: ${scheduleParam}`)

            //Check to verify run on weekends
            if ( runOnWeekEnds !== undefined ) {
                let arrRunOnWeekEnds = runOnWeekEnds.split('^')
                let paramRunOnWeekEnds = arrRunOnWeekEnds[0].toLowerCase()
                
                if ( paramRunOnWeekEnds === 'no') {
                    let daysToRun = arrRunOnWeekEnds[1]
                    scheduleParam = scheduleParam.replace(/.$/, daysToRun)
                    msgForLogger = `${msgForLogger} on Weekdays.`
                }
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