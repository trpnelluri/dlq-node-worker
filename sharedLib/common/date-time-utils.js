'use strict'

exports.currentTimeInMilliSecs = async function () {
    let currentTime = new Date();
    let getCurrentTimeInMilliSecs = currentTime.getTime();
    console.log(`date-time-utils - getCurrentTimeInMilliSecs is: ${getCurrentTimeInMilliSecs}`);
    return getCurrentTimeInMilliSecs;
};

exports.processTimeInMilliSecs = async function (endTime, startTime) {
    let processTimeInMillSecs = endTime - startTime;
    console.log(`date-time-utils - processTime in mins is: ${processTimeInMillSecs}`);
    return processTimeInMillSecs;
};

exports.processTimeInMins = async function (endTime, startTime) {
    let processTimeInMins = endTime - startTime;
    processTimeInMins = processTimeInMins / 60000
    console.log(`date-time-utils - processTime in mins is: ${processTimeInMins}`);
    return processTimeInMins;
};