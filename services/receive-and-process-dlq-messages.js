'use strict'

const AWS = require('aws-sdk')
const dateTimeUtils = require('../sharedLib/common/date-time-utils');
const IdServiceShared = require('../sharedLib/common/id-service')


AWS.config.update({ region: 'us-east-1' })
// Create the SQS service object
let sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

let sourceQueueURL = process.env.dlq_hih_notifications_queue
let targetQueueQRL = process.env.main_hih_notifications_queue
let targetDLQQRL = process.env.dlq_2_hih_notifications_queue
//const visibilityTimeout = process.env.visibilitytimeout
//const hihNotifyReprocessTimeInMins = process.env.hihnotificationreprocesstime
const visibilityTimeout = 120
const hihNotifyReprocessTimeInMins = 3
const msgMaxRetrys = 3
const msgFirstAttempt = 1

console.log(`sourceQueueURL: ${sourceQueueURL} targetQueueQRL ${targetQueueQRL} visibilityTimeout: ${visibilityTimeout} hihNotifyReprocessTimeInMins: ${hihNotifyReprocessTimeInMins}`)

async function receiveMsgFromDLQ () {
    
    let params = {
        AttributeNames: ['All'],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: ['All'],
        QueueUrl: sourceQueueURL, //DLQ1
        VisibilityTimeout:visibilityTimeout
    }

    const { Messages } = await sqs.receiveMessage(params).promise();

    console.log(`Messages: ${Messages}`)

    if (Messages !== undefined && Messages !== null) {
        if ( Messages.length > 0 ) {
            console.log(`Messages.length: ${Messages.length}`)

            for (let i = 0; i < Messages.length; i++) {
                console.log(`message: ${JSON.stringify(Messages[i])}`)
                let msgReceviedTime = Messages[i].Attributes.ApproximateFirstReceiveTimestamp
                console.log(`msgReceviedTime: ${msgReceviedTime}`);
    
                let currentTime = await dateTimeUtils.currentTimeInMilliSecs()
                console.log(`currentTime: ${currentTime}`);
    
                const msgReceivedTimeDiff = await dateTimeUtils.processTimeInMins(currentTime, msgReceviedTime)
                console.log(`msgReceivedTimeDiff: ${msgReceivedTimeDiff}`);

                if ( msgReceivedTimeDiff > hihNotifyReprocessTimeInMins ) {
                    console.log('Moving the message to Main queue')
                    let messageId = Messages[i].MessageId;
                    let receiptHandle = Messages[i].ReceiptHandle;
                    console.log(`data.messageId: ${messageId} receiptHandle: ${receiptHandle}`)
                    console.log(`data.MessageDeduplicationId: ${Messages[i].Attributes.MessageDeduplicationId}`)
                    //console.log (`data.Messages[0].MessageAttributes['sqs-dlq-replay-nb']: ${data.Messages[0].MessageAttributes['sqs-dlq-replay-nb']}`)
                    console.log(`msgMaxRetrys: ${msgMaxRetrys}`)

                    let nbReplay;
                    if ( Messages[i].MessageAttributes !== undefined ) {
                        nbReplay = parseInt(Messages[i].MessageAttributes['sqs-dlq-replay-nb']['StringValue'])
                        nbReplay += 1
                    } else {
                        nbReplay = msgFirstAttempt
                    }
                    console.log(`nbReplay: ${nbReplay}`)

                    let messageGroupId = Messages[i].Attributes.MessageGroupId;
                    let msgBody = Messages[i].Body
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
                                    console.log(`Error in deleting Queue message, incase of Virus file with 403 SPE satus:  ${JSON.stringify(error, null, 2)}`);
                                } else {
                                    console.log(`deleted data data: ${JSON.stringify(data)}`);
                                }
    
                            });
                            
                        }           // successful response
                    })
                } else {
                    console.log(`${msgReceivedTimeDiff} is less than ${hihNotifyReprocessTimeInMins}`)
                }
            }
        }
    } else {
        console.log('mesages not available to process')
    }
    

    /*
    sqs.receiveMessage(params, function (err, data) {
        if (err) {
            console.log('Receive Error', err)
        } else {
        // Make sure we have a message
            if (data.Messages !== null && data.Messages !== undefined) {
                console.log('messages to change available')
                console.log('data.Messages' + JSON.stringify(data.Messages))
                let messageId = data.Messages[0].MessageId;
                let receiptHandle = data.Messages[0].ReceiptHandle;
                console.log(`data.messageId: ${messageId} receiptHandle: ${receiptHandle}`)
                console.log(`data.MessageDeduplicationId: ${data.Messages[0].Attributes.MessageDeduplicationId}`)
                //console.log (`data.Messages[0].MessageAttributes['sqs-dlq-replay-nb']: ${data.Messages[0].MessageAttributes['sqs-dlq-replay-nb']}`)
                                
                let messageGroupId = data.Messages[0].Attributes.MessageGroupId;
                let msgBody = data.Messages[0].Body
                let messageDeduplicationId = data.Messages[0].Attributes.MessageDeduplicationId
                //console.log(`New messageDeduplicationId: ${messageDeduplicationId}`)
                console.log(`targetQueueQRL: ${targetQueueQRL}`)

                const SQS_DLQ_PARAMS = {
                    MessageBody: msgBody,
                    QueueUrl: targetQueueQRL,
                    MessageGroupId: messageGroupId,
                    MessageDeduplicationId: messageDeduplicationId,
                }
                console.log(`SQS_DLQ_PARAMS: ${SQS_DLQ_PARAMS}`)
                sqs.sendMessage(SQS_DLQ_PARAMS, function(err, data) {
                    if (err) { // an error occurred
                        console.log(err, err.stack);
                    } else {
                        console.log(`sendMessage data: ${JSON.stringify(data)}`);
                        let deleteParams = {
                            QueueUrl: sourceQueueURL,
                            ReceiptHandle: receiptHandle
                        }
                         
                        sqs.deleteMessage(deleteParams, function(error, data) {

                            if (error) {
                                console.log(`Error in deleting Queue message, incase of Virus file with 403 SPE satus:  ${JSON.stringify(error, null, 2)}`);
                            } else {
                                console.log(`deleted data data: ${JSON.stringify(data)}`);
                            }

                        });
                        
                    }           // successful response
                });
                
            } else {
                console.log('No messages to change')
            }
        }
    })
    */
    
}

module.exports = {
    receiveMsgFromDLQ,
};