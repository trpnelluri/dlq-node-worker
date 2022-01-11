'use strict'

const AWS = require('aws-sdk')

AWS.config.update({ region: 'us-east-1' })
// Create the SQS service object
let sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

let sourceQueueURL = process.env.dlq_hih_notifications_queue
let targetQueueQRL = process.env.main_hih_notifications_queue

function receivemsg () {
    
    let params = {
        AttributeNames: ['All'],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: ['All'],
        QueueUrl: sourceQueueURL, //DLQ1
        VisibilityTimeout:15
    }

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
    
}

module.exports = {
    receivemsg,
};