'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
let sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

const dateTimeUtils = require('../sharedLib/common/date-time-utils');
const sendMsgToMainQueue = require('../services-utils/send-message-to-main-queue')

const sourceQueueURL = process.env.dlq_hih_notifications_queue
//const visibilityTimeout = process.env.visibilitytimeout
//const hihNotifyReprocessTimeInMins = process.env.hihnotificationreprocesstime
const maxNumberOfMessages = process.env.messagesbatchsize
const visibilityTimeout = 120
const hihNotifyReprocessTimeInMins = 3

console.log(`sourceQueueURL: ${sourceQueueURL} visibilityTimeout: ${visibilityTimeout} hihNotifyReprocessTimeInMins: ${hihNotifyReprocessTimeInMins}`)

async function receiveMsgFromDLQ () {
    
    let params = {
        AttributeNames: ['All'],
        MaxNumberOfMessages: maxNumberOfMessages,
        MessageAttributeNames: ['All'],
        QueueUrl: sourceQueueURL //DLQ1
        //VisibilityTimeout:visibilityTimeout
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
                    let response = await sendMsgToMainQueue.sendMsgToMainQueue(Messages[i], sourceQueueURL)
                    console.log(`response: ${JSON.stringify(response)}`)
                } else {
                    console.log(`${msgReceivedTimeDiff} is less than ${hihNotifyReprocessTimeInMins}`)
                }
            }
        }
    } else {
        console.log('mesages not available to process')
    }
     
}

module.exports = {
    receiveMsgFromDLQ,
};