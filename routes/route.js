'use strict'

const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

router.get('/', controller.hello);


router.get('/esmd-dlk-audit-queue', controller.processAuditDLQ);
router.get('/esmd-dlk-email-queue', controller.processEmailDLQ);
router.get('/esmd-dlk-epor-status', controller.processEporStatusDLQ);
router.get('/esmd-dlk-metadata-processor', controller.processMetadataDLQ);
router.get('/esmd-dlk-payload-processor', controller.processPayloadProcessDLQ);
router.get('/esmd-dlk-transaction-queue', controller.processTransactionDLQ);
router.get('/esmd-dlk-hih-notifications', controller.processHIHNotificationsDLQ);

//temp:
router.get('/esmd-dlk1-hih-notifications', controller.processHIHNotificationsDLQ1);

module.exports = router;