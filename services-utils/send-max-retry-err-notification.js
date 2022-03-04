'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
let sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

const loggerUtils = require('../sharedLib/common/logger-utils');
const PostgresDBSevice = require('../sharedLib/db/postgre-sql-pool');
const { getRequiredDataFromDB } = require('../sharedLib/common/get-required-data-from-db');
PostgresDBSevice.connectToPostgresDB()
const IdServiceShared = require('../sharedLib/common/id-service')

const EventName = 'SEND_MAX_RETRY_NOTIFICATION'
const notification_SQS_url = process.env.notification_queue_url

async function sendMaxRetryErrNotifcation (message, transId) {

    let msgObj = JSON.parse(message);
    const logParams = {globaltransid: transId};
    const logger = loggerUtils.customLogger( EventName, logParams);

    try {
        const notificationType = process.env.maxretrynotification.toUpperCase()
        logger.info(`sendMaxRetryErrNotifcation, message ${JSON.stringify(msgObj)} transId: ${transId} notificationType: ${notificationType}`)
        const valsToReplace = [transId]
        const requiredEnvData = {
            refsql: process.env.ref_sql_to_get_notification_data
        }
        const requiredDataObj = await getRequiredDataFromDB (logParams, valsToReplace, requiredEnvData, PostgresDBSevice)
        logger.info(`sendMaxRetryErrNotifcation, requiredDataObj: ${requiredDataObj.length}`)
        let hihOid = ''
        let esmdClaimId = ''
        let esmdCaseId = ''
        let subTimestamp = ''
        let notificationObj = new Object;
        if ( requiredDataObj.length ) {
            const notificationData = requiredDataObj[0]
            if ( notificationData.hih_oid !== undefined && notificationData.hih_oid !== null && notificationData.hih_oid !== 'null' ) {
                hihOid = notificationData.hih_oid
            }
            if ( notificationData.esmd_claim_id !== undefined && notificationData.esmd_claim_id !== null && notificationData.esmd_claim_id !== 'null') {
                esmdClaimId = notificationData.esmd_claim_id
            }
            if ( notificationData.esmd_case_id !== undefined && notificationData.esmd_case_id !== null && notificationData.esmd_case_id !== 'null' ) {
                esmdCaseId = notificationData.esmd_case_id
            }
            if ( notificationData.submission_timestamp !== undefined && notificationData.submission_timestamp !== null && notificationData.submission_timestamp !== 'null' ) {
                subTimestamp = notificationData.submission_timestamp
            }
            notificationObj.guid = transId
            notificationObj.hih_oid = hihOid
            notificationObj.request_type = 'OUTBOUND'
            notificationObj.email_alert_notification_type = notificationType
            notificationObj.environment_type = process.env.environment
            notificationObj.esmd_claim_id = esmdClaimId
            notificationObj.esmd_case_id = esmdCaseId
            notificationObj.submission_timestamp = subTimestamp
        } else {
            logger.info(`sendMaxRetryErrNotifcation, Data not available in esMD: ${transId}`)
            notificationObj.guid = transId
            notificationObj.hih_oid = hihOid
            notificationObj.request_type = 'OUTBOUND'
            notificationObj.email_alert_notification_type = notificationType
            notificationObj.environment_type = process.env.environment
            notificationObj.esmd_claim_id = esmdClaimId
            notificationObj.esmd_case_id = esmdCaseId
            notificationObj.submission_timestamp = new Date();
        }
        let msgBody = JSON.stringify(notificationObj)
        let messageGroupId = IdServiceShared.getInstance().getId();
        const sendMsgParams = {
            MessageBody: msgBody,
            QueueUrl: notification_SQS_url,
            MessageGroupId: messageGroupId,
            MessageDeduplicationId: messageGroupId,
        }
        logger.info(`sendMaxRetryErrNotifcation, messageGroupId: ${messageGroupId} sendMsgParams: ${JSON.stringify(sendMsgParams)}`)
        sqs.sendMessage(sendMsgParams, function(err, data) {
            if (err) { // an error occurred
                logger.error(`sendMaxRetryErrNotifcation, sendMessage Error ${err.stack}`);
            } else {
                logger.info(`sendMaxRetryErrNotifcation, sendMessage data: ${JSON.stringify(data)}`);
            }
        })
    } catch (err) {
        logger.error(`sendMaxRetryErrNotifcation, ERROR: ${err.stack}`);
    }
}

module.exports = {
    sendMaxRetryErrNotifcation,
};