'use strict'

const loggerUtils = require('./logger-utils');

const EventName = 'GET_REQUIRED_DATA_FROM_DB'

async function getRequiredDataFromDB(logParams, valsToReplace, requiredEnvData, PostgresDBSevice){
    const logger = loggerUtils.customLogger( EventName, logParams);
    return new Promise((resolve, reject) => {
        const sqlToGetRequiredInfo = requiredEnvData.refsql
        logger.info(`getRequiredDataFromDB, sqlToGetRequiredInfo: ${sqlToGetRequiredInfo} valuesToRlace: ${JSON.stringify(valsToReplace)}`)
        PostgresDBSevice.getRequiredRefData(sqlToGetRequiredInfo, valsToReplace, logParams, (err, isDataAvailable, requiredDataObj) => {
            logger.info( `getRequiredDataFromDB, generateBatchFile: ${isDataAvailable}`);
            if (err) {
                logger.error(`getRequiredDataFromDB, ERROR: getRequiredRefData: ${err.stack}`);
            } else {
                resolve(requiredDataObj)
            }
        });
    }).catch((error) => {
        logger.error(`getRequiredDataFromDB, ERROR catch: ${error}` )
        throw new Error(`getRequiredDataFromDB, Error getting the required data from database ${error.stack}`);
    });
}
module.exports = {
    getRequiredDataFromDB,
}