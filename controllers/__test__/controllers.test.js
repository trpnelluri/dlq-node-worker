'use strict'

const controller = require('../controller')
const loggerUtils = require('../../sharedLib/common/logger-utils');
const processDLQ = require('../../services-utils/dlq-execute-command')

const mockRequest = () => {
    const req = {}
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
    return req
}

const mockResponse = () => {
    const res = {}
    res.send = jest.fn().mockReturnValue(res)
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}

jest.mock('../../sharedLib/common/logger-utils', () => ({
    customLogger: jest.fn((pgsLogFileName, EventName, logParams) => ({
        info: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        clear: jest.fn()
    }))
}));

const EventName = 'Controller';

describe("Check method \'default\' ", () => {
    test('should 200 and return Welcome message', async () => {
        let req = mockRequest();
        req.params.id = 1;
        const res = mockResponse();
        await controller.default(req, res);
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send.mock.calls.length).toBe(1);
        expect(res.send).toHaveBeenCalledWith('Welcome to Unissant');
    });
  
});


describe("Check method \'processAuditDLQ\' ", () => {
    test('should 200 and return Welcome message', async () => {

        processDLQ.executeDLQCommand.mockResolvedValue({});
        // processDLQ.executeDLQCommand.mockImplementation(
        //     (res, logger, sourceQueue, targetQueue) => {
        //         queryCallback = callback;
        //     }
        // );

        let req = mockRequest();
        //req.params.id = 1;
        const res = mockResponse();
        await controller.processAuditDLQ(req, res);
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send.mock.calls.length).toBe(1);
        expect(loggerUtils.customLogger).toBeCalledTimes(1);
        expect(loggerUtils.customLogger).toBeCalledWith(
            EventName,
            expect.anything()
        );
    });
  
});
