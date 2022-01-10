'use strict'

//const exec = require('shelljs').exec;
const processDLQ = require('../services/dlq-execute-command')

exports.hello = (req, res) => {
    res.send('Welcome to Unissant');
};

exports.processAuditDLQ = (req, res) => {
    console.log(`processAuditDLQ req.headers: ${JSON.stringify(req.headers)}`)
    let sourceQueue = process.env.dlq_audit_queue
    let targetQueue = process.env.main_audit_queue
    console.log(`processAuditDLQ sourceQueue: ${sourceQueue} targetQueue: ${targetQueue}`)
    processDLQ.executeDLQCommand(res, sourceQueue, targetQueue)
};

exports.processEmailDLQ = (req, res) => {
    console.log(`processEmailDLQ req.headers: ${JSON.stringify(req.headers)}`)
    let sourceQueue = process.env.dlq_email_queue
    let targetQueue = process.env.main_email_queue
    console.log(`processEmailDLQ sourceQueue: ${sourceQueue} targetQueue: ${targetQueue}`)
    processDLQ.executeDLQCommand(res, sourceQueue, targetQueue)
};

exports.processEporStatusDLQ = (req, res) => {
    console.log(`processEporStatusDLQ req.headers: ${JSON.stringify(req.headers)}`)
    let sourceQueue = process.env.dlq_epor_status_queue
    let targetQueue = process.env.main_epor_status_queue
    console.log(`processEporStatusDLQ sourceQueue: ${sourceQueue} targetQueue: ${targetQueue}`)
    processDLQ.executeDLQCommand(res, sourceQueue, targetQueue)
};

exports.processMetadataDLQ = (req, res) => {
    console.log(`processMetadataDLQ req.headers: ${JSON.stringify(req.headers)}`)
    let sourceQueue = process.env.dlq_metadata_processor_queue
    let targetQueue = process.env.main_metadata_processor_queue
    console.log(`processMetadataDLQ sourceQueue: ${sourceQueue} targetQueue: ${targetQueue}`)
    processDLQ.executeDLQCommand(res, sourceQueue, targetQueue)
};

exports.processPayloadProcessDLQ = (req, res) => {
    console.log(`processPayloadProcessDLQ req.headers: ${JSON.stringify(req.headers)}`)
    let sourceQueue = process.env.dlq_payload_processor_queue
    let targetQueue = process.env.main_payload_processor_queue
    console.log(`processPayloadProcessDLQ sourceQueue: ${sourceQueue} targetQueue: ${targetQueue}`)
    processDLQ.executeDLQCommand(res, sourceQueue, targetQueue)
};

exports.processTransactionDLQ = (req, res) => {
    console.log(`processTransactionDLQ req.headers: ${JSON.stringify(req.headers)}`)
    let sourceQueue = process.env.dlq_transaction_queue
    let targetQueue = process.env.main_transaction_queue
    console.log(`processTransactionDLQ sourceQueue: ${sourceQueue} targetQueue: ${targetQueue}`)
    processDLQ.executeDLQCommand(res, sourceQueue, targetQueue)
};

/*
exports.processdlq = (req, res) => {
    console.log(`req.headers: ${JSON.stringify(req.headers)}`)
    //const dlqtest = require('../services/dlq-process-service-test')
    //dlqtest.receivemsg();
    //const dlqtestConsumer = require('../services/dlq-process-service')
    let SOURCE_SQS_URL = 'https://sqs.us-east-1.amazonaws.com/026933153449/audit_trans_test.fifo'
    let TARGET_SQS_URL = 'https://sqs.us-east-1.amazonaws.com/026933153449/audit-trans-deadletter.fifo'
    //dlqtestConsumer.startAuditTransSqsService(SOURCE_SQS_URL, TARGET_SQS_URL);
    //res.send('audittransdlqstart world 123');

    const curlCommand = `npx replay-aws-dlq ${SOURCE_SQS_URL} ${TARGET_SQS_URL}`

    const curlProfileRefXMLdlq = exec(curlCommand, function(error, profilestdout, stderr) {
        console.log(`curlProfileRefXML: ${curlProfileRefXMLdlq}`)
        console.log(`profilestdout: ${profilestdout}`)
        res.send('audittransdlqstart world 345');
    })
};


exports.processdlqConsumer = (req, res) => {
    console.log(`req.headers: ${JSON.stringify(req.headers)}`)

    //const dlqtestConsumer = require('../services/dlq-process-service')
    let SOURCE_SQS_URL = 'https://sqs.us-east-1.amazonaws.com/026933153449/audit-trans-deadletter.fifo'
    let TARGET_SQS_URL = 'https://sqs.us-east-1.amazonaws.com/026933153449/audit_trans_test.fifo'

    const curlCommand = `npx replay-aws-dlq ${SOURCE_SQS_URL} ${TARGET_SQS_URL}`

    const curlProfileRefXML = exec(curlCommand, function(error, profilestdout, stderr) {
        console.log(`curlProfileRefXML: ${curlProfileRefXML}`)
        console.log(`profilestdout: ${profilestdout}`)
        res.send('audittransdlqstart world 123');
    })
    //dlqtestConsumer.startAuditTransSqsService(SOURCE_SQS_URL, TARGET_SQS_URL);
    
};
*/


