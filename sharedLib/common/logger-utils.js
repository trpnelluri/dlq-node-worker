'use strict'
const winston = require('winston');
//const DailyRotateFile = require('winston-daily-rotate-file');
const moment = require('moment');
process.setMaxListeners(0);

const timestampMoment = () => moment().format('YYYY/MM/DD HH:mm:ss SSS');

const customLogger = (eventName, logParams) =>{
    //console.log('in logger utils', logFileName)
    return winston.createLogger({
    // error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
        level: process.env.logLevel || 'info', // configurable after setting is made at server level
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp({ format: timestampMoment }),
                    winston.format.printf((info) => `${info.timestamp},${info.level.toUpperCase()},${logParams.globaltransid || '-' },${eventName},-, ${info.message}`),
                ),
            }),
        ],
    })
};

module.exports = {
    customLogger,
}