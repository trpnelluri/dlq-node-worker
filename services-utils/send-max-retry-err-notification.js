'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
let sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

const loggerUtils = require('../sharedLib/common/logger-utils');
const IdServiceShared = require('../sharedLib/common/id-service')
const EventName = 'Send_Max_Retry_Notifcation'
const notification_SQS_url = process.env.notification_queue_url

async function sendMaxRetryErrNotifcation (message, transId) {

    let msgObj = JSON.parse(message);
    const logParams = {globaltransid: transId};
    const logger = loggerUtils.customLogger( EventName, logParams);

    try {
        logger.info(`sendMaxRetryErrNotifcation message ${JSON.stringify(msgObj)} transId: ${transId}`)
        /*
        let notificationObj = {
            guid: guid,
            hih_oid: msgObj.hih_oid,
            request_type: 'OUTBOUND',
            email_alert_notification_type: process.env.maxretrynotification,
            environment_type: process.env.environment,
            esmd_claim_id: msgObj.esmd_claim_id,
            esmd_case_id: msgObj.esmd_case_id,
            submission_timestamp: msgObj.submission_timestamp,
        }
        */
        let notificationObj = {
            guid: 'NJH000007023455',
            hih_oid: 'message.hih_oid',
            request_type: 'OUTBOUND',
            email_alert_notification_type: process.env.maxretrynotification,
            environment_type: process.env.environment,
            esmd_claim_id: 'message.esmd_claim_id',
            esmd_case_id: 'message.esmd_case_id',
            submission_timestamp: 'message.submission_timestamp',
        }

        let msgBody = JSON.stringify(notificationObj)
        let messageGroupId = IdServiceShared.getInstance().getId();
        logger.info(`sendMaxRetryErrNotifcation messageGroupId: ${messageGroupId}`)

        const sendMsgParams = {
            MessageBody: msgBody,
            QueueUrl: notification_SQS_url,
            MessageGroupId: messageGroupId,
            MessageDeduplicationId: messageGroupId,
        }

        sqs.sendMessage(sendMsgParams, function(err, data) {
            if (err) { // an error occurred
                logger.error(`sendMaxRetryErrNotifcation sendMessage Error ${err.stack}`);
            } else {
                logger.info(`sendMaxRetryErrNotifcation sendMessage data: ${JSON.stringify(data)}`);
            }
        })
    } catch (err) {
        logger.error(`ERROR in sendMaxRetryErrNotifcation: ${err.stack}`);
    }
}

module.exports = {
    sendMaxRetryErrNotifcation,
};