'use strict'

async function currentTimeInMilliSecs (logger) {
    return new Promise((resolve, reject) => {
        try {
            let currentTime = new Date();
            let getCurrentTimeInMilliSecs = currentTime.getTime();
            logger.info(`date-time-utils - currentTimeInMilliSecs: ${getCurrentTimeInMilliSecs}`);
            resolve(getCurrentTimeInMilliSecs)

        } catch (err) {
            logger.error(`ERROR in currentTimeInMilliSecs: ${err.stack}`);
            reject(err);
        }
    })
}

async function timeDiffInMilliSecs (logger, endTime, startTime) {
    return new Promise((resolve, reject) => {
        try {
            let timeDiffInMilliSecs = endTime - startTime;
            logger.info(`date-time-utils - timeDiffInMilliSecs: ${timeDiffInMilliSecs}`);
            resolve(timeDiffInMilliSecs)

        } catch (err) {
            logger.error(`ERROR in timeDiffInMilliSecs: ${err.stack}`);
            reject(err);
        }
    })
}

async function timeDiffInMins (logger, endTime, startTime) {
    return new Promise((resolve, reject) => {
        try {
            let timeDiffInMins = endTime - startTime;
            timeDiffInMins = timeDiffInMins / 60000
            logger.info(`date-time-utils - timeDiffInMins: ${timeDiffInMins}`);
            resolve(timeDiffInMins)
        } catch (err) {
            logger.error(`ERROR in timeDiffInMins: ${err.stack}`);
            reject(err);
        }
    })
}

module.exports = {
    currentTimeInMilliSecs,
    timeDiffInMilliSecs,
    timeDiffInMins,
};