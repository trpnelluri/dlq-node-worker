'use strict'

const AWS = require('aws-sdk')
const loggerUtils = require('../sharedLib/common/logger-utils');
const maxRetryErrNotification = require('../services-utils/send-max-retry-err-notification')
const IdServiceShared = require('../sharedLib/common/id-service')

AWS.config.update({ region: 'us-east-1' })
let sqs = new AWS.SQS({ apiVersion: '2012-11-05' })
const EventName = 'SEND_MESSAGE'


let targetQueueQRL = process.env.main_hih_notifications_queue
const targetDLQQRL = process.env.dlq_2_hih_notifications_queue
const msgFirstAttempt = 1

async function sendMsgToMainQueue (message, transId, sourceQueueURL, sendMsgToSecDLQ) {

    return new Promise((resolve, reject) => {
        let logParams = {globaltransid: transId}
        const logger = loggerUtils.customLogger( EventName, logParams);

        try {

            logger.info(`sendMsgToMainQueue, targetQueueQRL ${targetQueueQRL} targetDLQQRL: ${targetDLQQRL} sendMsgToSecDLQ: ${sendMsgToSecDLQ} msgFirstAttempt: ${msgFirstAttempt} `)
            let messageId = message.MessageId;
            let receiptHandle = message.ReceiptHandle;
            let messageDeduplicationId = message.Attributes.MessageDeduplicationId
            logger.info(`sendMsgToMainQueue, data.messageId: ${messageId} receiptHandle: ${receiptHandle} messageDeduplicationId: ${messageDeduplicationId} `)
            let nbReplay;
            if ( message.MessageAttributes !== undefined ) {
                nbReplay = parseInt(message.MessageAttributes['sqs-dlq-replay-nb']['StringValue'])
                nbReplay += 1
            } else {
                nbReplay = msgFirstAttempt
            }
            let messageGroupId = message.Attributes.MessageGroupId;
            let msgBody = message.Body
            messageDeduplicationId = IdServiceShared.getInstance().getId();
            logger.info(`sendMsgToMainQueue, nbReplay: ${nbReplay} New messageDeduplicationId: ${messageDeduplicationId}`)
        
            if ( sendMsgToSecDLQ ) {
                targetQueueQRL = targetDLQQRL
                nbReplay = 0
                maxRetryErrNotification.sendMaxRetryErrNotifcation(msgBody, transId) //WIP: Sending Email Notification Ops team.
            }
            logger.debug(`sendMsgToMainQueue, targetQueueQRL: ${targetQueueQRL}`)
            const sendMsgParams = {
                MessageBody: msgBody,
                QueueUrl: targetQueueQRL,
                MessageGroupId: messageGroupId,
                MessageDeduplicationId: messageDeduplicationId,
                MessageAttributes: {
                    'sqs-dlq-replay-nb': {
                        DataType: 'String',
                        StringValue: nbReplay.toString()
                    }
                }
            }
            logger.info(`sendMsgToMainQueue, sendMsgParams: ${JSON.stringify(sendMsgParams)}`)
                            
            sqs.sendMessage(sendMsgParams, function(err, data) {
                if (err) { // an error occurred
                    logger.error(`sendMsgToMainQueue, sendMessage Error ${err.stack}`);
                } else {
                    logger.info(`sendMsgToMainQueue, sendMessage data: ${JSON.stringify(data)}`);
                    let deleteMsgParams = {
                        QueueUrl: sourceQueueURL,
                        ReceiptHandle: receiptHandle
                    }
                    sqs.deleteMessage(deleteMsgParams, function(error, data) {
                        if (error) {
                            logger.error(`sendMsgToMainQueue, Error in deleteMessage incase of moving file from dlq to main queue:  ${JSON.stringify(error, null, 2)}`);
                            let response = {
                                status: 'failure',
                                message: 'deleting message from dlq'
                            }
                            reject(response)
                        } else {
                            logger.info(`sendMsgToMainQueue, deleteMessage deleted message from dlq data: ${JSON.stringify(data)}`);
                            let response = {
                                status: 'success',
                                message: data
                            }
                            resolve(response)
                        }
                    });
                                
                }
            })
        }catch (err) {
            logger.error(`sendMsgToMainQueue, ERROR: ${err.stack}`);
            reject(err);
        }
    })
}

module.exports = {
    sendMsgToMainQueue,
};