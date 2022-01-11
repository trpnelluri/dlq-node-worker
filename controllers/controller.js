'use strict'

const processDLQ = require('../services/dlq-execute-command')
const processReceiveMessage = require('../services/receive-and-process-dlq-messages')

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

exports.processHIHNotificationsDLQ = (req, res) => {
    console.log(`processHIHNotificationsDLQ req.headers: ${JSON.stringify(req.headers)}`)
    let sourceQueue = process.env.dlq_2_hih_notifications_queue
    let targetQueue = process.env.main_hih_notifications_queue
    console.log(`processHIHNotificationsDLQ sourceQueue: ${sourceQueue} targetQueue: ${targetQueue}`)
    processDLQ.executeDLQCommand(res, sourceQueue, targetQueue)
};


exports.processHIHNotificationsDLQ1 = (req, res) => {
    console.log(`processHIHNotificationsDLQ req.headers: ${JSON.stringify(req.headers)}`)
    let sourceQueue = process.env.dlq_hih_notifications_queue
    let targetQueue = process.env.main_hih_notifications_queue
    console.log(`processHIHNotificationsDLQ1 sourceQueue: ${sourceQueue} targetQueue: ${targetQueue}`)
    //processDLQ.executeDLQCommand(res, sourceQueue, targetQueue)
    processReceiveMessage.receiveMsgFromDLQ();
};
