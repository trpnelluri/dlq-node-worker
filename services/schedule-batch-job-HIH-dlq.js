'use strict';

const cron = require('node-cron');

async function scheduleHIHDlqCron () {
    cron.schedule('*/30 * * * * *', () =>{
        console.log('Task is running every 30 Seconds ' + new Date())
    });
}

module.exports = {
    scheduleHIHDlqCron,
};