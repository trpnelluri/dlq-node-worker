'use strict'

const controller = require('../controller')

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