'use strict';

const Controller = require('../../controllers/controller');

const getSpy = jest.fn();

jest.doMock('express', () => {
    return {
        Router() {
            return {
                get: getSpy,
            }
        }
    }
});

describe('should test all the routes in process-dlq-node-worker', () => {
    require('../route');
    test('should test get defult route', () => {
        expect(getSpy).toHaveBeenCalledWith('/', Controller.default);
    });

    test('should test get processAuditDLQ route', () => {
        expect(getSpy).toHaveBeenCalledWith('/esmd-dlk-audit-queue', Controller.processAuditDLQ);
    });

    test('should test get processEmailDLQ route', () => {
        expect(getSpy).toHaveBeenCalledWith('/esmd-dlk-email-queue', Controller.processEmailDLQ);
    });

    test('should test get processEporStatusDLQ route', () => {
        expect(getSpy).toHaveBeenCalledWith('/esmd-dlk-epor-status', Controller.processEporStatusDLQ);
    });

    test('should test get processMetadataDLQ route', () => {
        expect(getSpy).toHaveBeenCalledWith('/esmd-dlk-metadata-processor', Controller.processMetadataDLQ);
    });

    test('should test get processPayloadProcessDLQ route', () => {
        expect(getSpy).toHaveBeenCalledWith('/esmd-dlk-payload-processor', Controller.processPayloadProcessDLQ);
    });

    test('should test get processTransactionDLQ route', () => {
        expect(getSpy).toHaveBeenCalledWith('/esmd-dlk-transaction-queue', Controller.processTransactionDLQ);
    });

    test('should test get processHIHNotificationsDLQ route', () => {
        expect(getSpy).toHaveBeenCalledWith('/esmd-dlk-hih-notifications', Controller.processHIHNotificationsDLQ);
    });
});