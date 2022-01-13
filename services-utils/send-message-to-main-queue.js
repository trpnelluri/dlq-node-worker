'use strict'

const AWS = require('aws-sdk')
const loggerUtils = require('../sharedLib/common/logger-utils');
const IdServiceShared = require('../sharedLib/common/id-service')

AWS.config.update({ region: 'us-east-1' })
let sqs = new AWS.SQS({ apiVersion: '2012-11-05' })
const EventName = 'Send_Message'
const logger = loggerUtils.customLogger( EventName, {});

let targetQueueQRL = process.env.main_hih_notifications_queue
const targetDLQQRL = process.env.dlq_2_hih_notifications_queue
const msgMaxRetries = process.env.hihnotificationmaxretries
const msgFirstAttempt = 1

async function sendMsgToMainQueue (message, sourceQueueURL) {

    return new Promise((resolve, reject) => {

        try {

            logger.info(`sendMsgToMainQueue targetQueueQRL ${targetQueueQRL} targetDLQQRL: ${targetDLQQRL} msgMaxRetries: ${msgMaxRetries} msgFirstAttempt: ${msgFirstAttempt} `)
            let messageId = message.MessageId;
            let receiptHandle = message.ReceiptHandle;
            let messageDeduplicationId = message.Attributes.MessageDeduplicationId
            logger.info(`sendMsgToMainQueue data.messageId: ${messageId} receiptHandle: ${receiptHandle} messageDeduplicationId: ${messageDeduplicationId} `)
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
            logger.info(`sendMsgToMainQueue nbReplay: ${nbReplay} New messageDeduplicationId: ${messageDeduplicationId}`)
        
            if ( nbReplay > msgMaxRetries ) {
                targetQueueQRL = targetDLQQRL
                nbReplay = 0
                //Need To send an email notification to operations team
            }
            logger.debug(`targetQueueQRL: ${targetQueueQRL}`)
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
            logger.info(`sendMsgToMainQueue sendMsgParams: ${JSON.stringify(sendMsgParams)}`)
                            
            sqs.sendMessage(sendMsgParams, function(err, data) {
                if (err) { // an error occurred
                    logger.error(`sendMessage Error ${err.stack}`);
                } else {
                    logger.info(`sendMessage data: ${JSON.stringify(data)}`);
                    let deleteMsgParams = {
                        QueueUrl: sourceQueueURL,
                        ReceiptHandle: receiptHandle
                    }
                    sqs.deleteMessage(deleteMsgParams, function(error, data) {
                        if (error) {
                            logger.error(`Error in deleting Queue message, incase of moving file from dlq to main queue:  ${JSON.stringify(error, null, 2)}`);
                            let response = {
                                status: 'failure',
                                message: 'deleting message from dlq'
                            }
                            reject(response)
                        } else {
                            logger.info(`deleteMessage deleted message from dlq data: ${JSON.stringify(data)}`);
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
            logger.error(`ERROR in sendMsgToMainQueue: ${err.stack}`);
            reject(err);
        }
    })
}

module.exports = {
    sendMsgToMainQueue,
};