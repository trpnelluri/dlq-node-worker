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
const EventName = 'DLQ-RECEIVE-MSG'
const logger = loggerUtils.customLogger( EventName, {});

async function receiveMsgFromDLQ () {

    try {
        logger.info(`receiveMsgFromDLQ sourceQueueURL: ${sourceQueueURL} hihNotifyReprocessTimeInMins: ${hihNotifyReprocessTimeInMins} maxNumberOfMessages: ${maxNumberOfMessages} `)
        let params = {
            AttributeNames: ['All'],
            MaxNumberOfMessages: maxNumberOfMessages,
            MessageAttributeNames: ['All'],
            QueueUrl: sourceQueueURL //DLQ1
        }

        logger.info(`receiveMsgFromDLQ params: ${JSON.stringify(params)}`)
        const { Messages } = await sqs.receiveMessage(params).promise();

        logger.debug(`receiveMsgFromDLQ Messages: ${Messages}`)
        if (Messages !== undefined && Messages !== null) {
            if ( Messages.length > 0 ) {
                logger.debug(`receiveMsgFromDLQ Messages.length: ${Messages.length}`)
                for (let i = 0; i < Messages.length; i++) {
                    logger.info(`receiveMsgFromDLQ message: ${JSON.stringify(Messages[i])}`)
                    let msgReceviedTime = Messages[i].Attributes.ApproximateFirstReceiveTimestamp
                    let currentTime = await dateTimeUtils.currentTimeInMilliSecs(logger)
                    const msgReceivedTimeDiff = await dateTimeUtils.timeDiffInMins(logger, currentTime, msgReceviedTime)
                    logger.info(`receiveMsgFromDLQ msgReceviedTime: ${msgReceviedTime} currentTime: ${currentTime} msgReceivedTimeDiff: ${msgReceivedTimeDiff} hihNotifyReprocessTimeInMins: ${hihNotifyReprocessTimeInMins}`);
                    if ( msgReceivedTimeDiff > hihNotifyReprocessTimeInMins ) {
                        let response = await sendMsgToMainQueue.sendMsgToMainQueue(Messages[i], sourceQueueURL)
                        logger.info(`receiveMsgFromDLQ response: ${JSON.stringify(response)}`)
                    } else {
                        logger.info(`receiveMsgFromDLQ ${msgReceivedTimeDiff} is less than ${hihNotifyReprocessTimeInMins}`)
                    }
                }
            }
        } else {
            logger.debug('receiveMsgFromDLQ Messages are not available in DLQ to process.')
        }

    }catch(err) {
        logger.error(`ERROR in receiveMsgFromDLQ: ${err.stack}`);
    }
     
}

module.exports = {
    receiveMsgFromDLQ,
};