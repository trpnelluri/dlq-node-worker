'use strict'

async function currentTimeInMilliSecs () {
    return new Promise((resolve, reject) => {
        try {
            let currentTime = new Date();
            let getCurrentTimeInMilliSecs = currentTime.getTime();
            console.log(`date-time-utils - currentTimeInMilliSecs: ${getCurrentTimeInMilliSecs}`);
            resolve(getCurrentTimeInMilliSecs)

        } catch (err) {
            console.error(`ERROR in currentTimeInMilliSecs: ${err.stack}`);
            reject(err);
        }
    })
}

async function processTimeInMilliSecs (endTime, startTime) {
    return new Promise((resolve, reject) => {
        try {
            let processTimeInMillSecs = endTime - startTime;
            console.log(`date-time-utils - processTimeInMilliSecs: ${processTimeInMillSecs}`);
            resolve(processTimeInMillSecs)

        } catch (err) {
            console.error(`ERROR in processTimeInMilliSecs: ${err.stack}`);
            reject(err);
        }
    })
}

async function processTimeInMins (endTime, startTime) {
    return new Promise((resolve, reject) => {
        try {
            let processTimeInMins = endTime - startTime;
            processTimeInMins = processTimeInMins / 60000
            console.log(`date-time-utils - processTimeInMins: ${processTimeInMins}`);
            resolve(processTimeInMins)
        } catch (err) {
            console.error(`ERROR in processTimeInMins: ${err.stack}`);
            reject(err);
        }
    })
}

module.exports = {
    currentTimeInMilliSecs,
    processTimeInMilliSecs,
    processTimeInMins,
};