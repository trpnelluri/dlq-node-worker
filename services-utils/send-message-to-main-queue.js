'use strict'

const AWS = require('aws-sdk')
const IdServiceShared = require('../sharedLib/common/id-service')

AWS.config.update({ region: 'us-east-1' })
// Create the SQS service object
let sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

let sourceQueueURL = process.env.dlq_hih_notifications_queue
let targetQueueQRL = process.env.main_hih_notifications_queue
let targetDLQQRL = process.env.dlq_2_hih_notifications_queue
const msgMaxRetrys = 3
const msgFirstAttempt = 1

console.log(`sourceQueueURL: ${sourceQueueURL} targetQueueQRL ${targetQueueQRL} `)

async function sendMsgToMainQueue (message, sourceQueueURL) {

    return new Promise((resolve, reject) => {
        try {
            let messageId = message.MessageId;
            let receiptHandle = message.ReceiptHandle;
            console.log(`data.messageId: ${messageId} receiptHandle: ${receiptHandle}`)
            console.log(`data.MessageDeduplicationId: ${message.Attributes.MessageDeduplicationId}`)
            //console.log (`data.Messages[0].MessageAttributes['sqs-dlq-replay-nb']: ${data.Messages[0].MessageAttributes['sqs-dlq-replay-nb']}`)
            console.log(`msgMaxRetrys: ${msgMaxRetrys}`)
    
            let nbReplay;
            if ( message.MessageAttributes !== undefined ) {
                nbReplay = parseInt(message.MessageAttributes['sqs-dlq-replay-nb']['StringValue'])
                nbReplay += 1
            } else {
                nbReplay = msgFirstAttempt
            }
            console.log(`nbReplay: ${nbReplay}`)
    
            let messageGroupId = message.Attributes.MessageGroupId;
            let msgBody = message.Body
            let messageDeduplicationId = IdServiceShared.getInstance().getId();
            console.log(`New messageDeduplicationId: ${messageDeduplicationId}`)
        
            if ( nbReplay > msgMaxRetrys ) {
                targetQueueQRL = targetDLQQRL
                nbReplay = 0
            }
        
            console.log(`targetQueueQRL: ${targetQueueQRL}`)
        
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
            console.log(`sendMsgParams: ${JSON.stringify(sendMsgParams)}`)
                            
            sqs.sendMessage(sendMsgParams, function(err, data) {
                if (err) { // an error occurred
                    console.log(err, err.stack);
                } else {
                    console.log(`sendMessage data: ${JSON.stringify(data)}`);
                    let deleteMsgParams = {
                        QueueUrl: sourceQueueURL,
                        ReceiptHandle: receiptHandle
                    }
                    sqs.deleteMessage(deleteMsgParams, function(error, data) {
                        if (error) {
                            console.log(`Error in deleting Queue message, incase of moving file from dlq to main queue:  ${JSON.stringify(error, null, 2)}`);
                            let response = {
                                status: 'failure',
                                message: 'deleting message from dlq'
                            }
                            reject(response)
                        } else {
                            console.log(`deleted message from dlq data: ${JSON.stringify(data)}`);
                            let response = {
                                status: 'success',
                                message: data
                            }
                            resolve(response)
                        }
                    });
                                
                }           // successful response
            })

        }catch (err) {

            console.error(`ERROR in sendMsgToMainQueue: ${err.stack}`);
            reject(err);
        }
    })
}

module.exports = {
    sendMsgToMainQueue,
};