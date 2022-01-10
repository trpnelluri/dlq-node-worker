'use strict';

//const express = require('express');
const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
const https = require('https')
const IdServiceShared = require('../sharedLib/common/id-service');

let sqs = new AWS.SQS({ apiVersion: '2012-11-05' })


function startAuditTransSqsService (SOURCE_SQS_URL, TARGET_SQS_URL) {

    //const SOURCE_SQS_URL = process.env.audit_trans_sqs_url;
    //const TARGET_SQS_URL = process.env.audit_trans_sqs_url;
    const pollingWaitTime = process.env.audit_consumer_polling_wait_time_ms;

    //let SOURCE_SQS_URL = 'https://sqs.us-east-1.amazonaws.com/026933153449/audit-trans-deadletter.fifo'
    //let TARGET_SQS_URL = 'https://sqs.us-east-1.amazonaws.com/026933153449/audit_trans_test.fifo'

    //let TARGET_SQS_URL = 'https://sqs.us-east-1.amazonaws.com/026933153449/audit-trans-deadletter.fifo'
    //let SOURCE_SQS_URL = 'https://sqs.us-east-1.amazonaws.com/026933153449/audit_trans_test.fifo'
      
    console.info(`Audit_Trans_Consumer Started, SQSURL is: ${SOURCE_SQS_URL} pollingWaitTime: ${pollingWaitTime}ms}`);

    const consumer = Consumer.create({
        queueUrl: SOURCE_SQS_URL,
        attributeNames: [
            'All'
        ],
        messageAttributeNames: [
            'All'
        ],
        batchSize: 1,
        pollingWaitTimeMs: pollingWaitTime, //5 seconds and it's configurable
        handleMessage: async (message) => {
            console.info('Message from queue : ' + JSON.stringify(message));
            let messageDataobj = JSON.parse(message.Body);
            let msgBody = JSON.stringify(messageDataobj);
            let messageGroupId = message.Attributes.MessageGroupId;
            let messageDeduplicationId = IdServiceShared.getInstance().getId();
            console.log(`New messageDeduplicationId: ${messageDeduplicationId}`)

            const SQS_DLQ_PARAMS = {
                MessageBody: msgBody,
                QueueUrl: TARGET_SQS_URL,
                MessageGroupId: messageGroupId,
                MessageDeduplicationId: messageDeduplicationId,
            }
            console.log(`SQS_DLQ_PARAMS: ${JSON.stringify(SQS_DLQ_PARAMS)}`)
            sqs.sendMessage(SQS_DLQ_PARAMS, function(err, data) {
                if (err) { // an error occurred
                    console.log(err, err.stack);
                } else {
                    console.log(`sendMessage data: ${JSON.stringify(data)}`);
                }           // successful response
            });
        },
        sqs: new AWS.SQS({
            httpOptions: {
                agent: new https.Agent({
                    keepAlive: true
                })
            }
        })
    });

    consumer.on('error', (err) => {
        console.error(`Error in Audit Trans Consumer: ${err.message}`);
    });
  
    consumer.on('processing_error', (err) => {
        console.error(`processing_error in Audit Trans Consumer: ${err.stack}`);
    });

    consumer.on('timeout_error', (err) => {
        console.error(`timeout_error in Audit Trans Consumer: ${err.stack}`);
    });

    consumer.on('message_processed', (err) => {
        console.info('message_processed Successfully in Audit Trans Consumer');
    });

    consumer.on('empty', (err) => {
        console.info('All messages moved to target queue successfully. Stopping the consumer');
        consumer.stop();
        setTimeout(process.exit, 5000);
    });
  
    consumer.start();
    
    process.on('SIGINT', () => {
        console.info('SIGINT Received, stopping Audit Trans consumer');
        consumer.stop();
        setTimeout(process.exit, 10000);
    });

}

module.exports = {
    startAuditTransSqsService,
};