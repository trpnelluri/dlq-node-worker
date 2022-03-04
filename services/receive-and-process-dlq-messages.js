'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
let sqs = new AWS.SQS({ apiVersion: '2012-11-05' })
const loggerUtils = require('../sharedLib/common/logger-utils')
const dateTimeUtils = require('../sharedLib/common/date-time-utils');
const sendMsgToMainQueue = require('../services-utils/send-message-to-main-queue')

const sourceQueueURL = process.env.dlq_hih_notifications_queue
const hihNotifyReprocessTimeInMins = process.env.hihnotificationreprocesstime
const maxNumberOfMessages = process.env.messagesbatchsize
const msgMaxRetries = parseInt(process.env.hihnotificationmaxretries)
const EventName = 'RECEIVE_MESSAGE'
let logger = loggerUtils.customLogger( EventName, {});


logger.info(`RECEIVE_MESSAGE, sourceQueueURL: ${sourceQueueURL} hihNotifyReprocessTimeInMins: ${hihNotifyReprocessTimeInMins} maxNumberOfMessages: ${maxNumberOfMessages} msgMaxRetries: ${msgMaxRetries}`)

async function receiveMsgFromDLQ () {

    try {
        let params = {
            AttributeNames: ['All'],
            MaxNumberOfMessages: maxNumberOfMessages,
            MessageAttributeNames: ['All'],
            QueueUrl: sourceQueueURL //DLQ1
        }

        logger.debug(`receiveMsgFromDLQ, params: ${JSON.stringify(params)}`)
        const { Messages } = await sqs.receiveMessage(params).promise();

        logger.debug(`receiveMsgFromDLQ, Messages: ${Messages}`)
        if (Messages !== undefined && Messages !== null) {
            if ( Messages.length > 0 ) {
                logger.debug(`receiveMsgFromDLQ, Messages.length: ${Messages.length}`)
                for (let i = 0; i < Messages.length; i++) {
                    logger.info(`receiveMsgFromDLQ, message: ${JSON.stringify(Messages[i])}`)
                    let msgReceviedTime = Messages[i].Attributes.ApproximateFirstReceiveTimestamp
                    let payload = JSON.parse(Messages[i].Body);
                    let transId = payload.global_unique_id
                    let logParams = {globaltransid: transId}
                    logger = loggerUtils.customLogger( EventName, logParams)
                    let maxRetries = 0
                    let sendMsgToSecDLQ = false;
                    if ( Messages[i].MessageAttributes !== undefined ) {
                        maxRetries = parseInt(Messages[i].MessageAttributes['sqs-dlq-replay-nb']['StringValue'])
                        logger.info(`receiveMsgFromDLQ, maxRetries: ${maxRetries} msgMaxRetries from config: ${msgMaxRetries}`)
                        if ( maxRetries >= msgMaxRetries) {
                            sendMsgToSecDLQ = true
                        }
                    }
                    // TBD need to implement the email notification process based on this condition
                    let currentTime = await dateTimeUtils.currentTimeInMilliSecs(logger)
                    const msgReceivedTimeDiff = await dateTimeUtils.timeDiffInMins(logger, currentTime, msgReceviedTime)
                    logger.info(`receiveMsgFromDLQ, transId: ${transId} msgReceviedTime: ${msgReceviedTime} currentTime: ${currentTime} msgReceivedTimeDiff: ${msgReceivedTimeDiff}_
                     hihNotifyReprocessTimeInMins: ${hihNotifyReprocessTimeInMins} sendMsgToSecDLQ : ${sendMsgToSecDLQ} maxRetries: ${maxRetries}`);
                    if ( msgReceivedTimeDiff > hihNotifyReprocessTimeInMins || sendMsgToSecDLQ ) {
                        let response = await sendMsgToMainQueue.sendMsgToMainQueue(Messages[i], transId, sourceQueueURL, sendMsgToSecDLQ)
                        logger.info(`receiveMsgFromDLQ, response: ${JSON.stringify(response)}`)
                    } else {
                        logger.info(`receiveMsgFromDLQ, transId: ${transId} msgReceivedTimeDiff: ${msgReceivedTimeDiff} is less than hihNotifyReprocessTimeInMins: ${hihNotifyReprocessTimeInMins}`)
                    }
                }
            }
        } else {
            logger.debug('receiveMsgFromDLQ, Messages are not available in DLQ to process.')
        }

    }catch(err) {
        logger.error(`receiveMsgFromDLQ, ERROR: ${err.stack}`);
    }
     
}

module.exports = {
    receiveMsgFromDLQ,
};