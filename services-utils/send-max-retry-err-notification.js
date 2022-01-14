'use strict'

const loggerUtils = require('../sharedLib/common/logger-utils');

const EventName = 'Send_Max_Retry_Notifcation'

async function sendMaxRetryErrNotifcation (message) {

    

    const logparams = {}
    const logger = loggerUtils.customLogger( EventName, logparams);
    try {

        logger.error('ERROR in timeDiffInMins');
            
    } catch (err) {
        logger.error(`ERROR in timeDiffInMins: ${err.stack}`);
            
    }
   
}

module.exports = {
    sendMaxRetryErrNotifcation,
};