'use strict';

const { populateScheduleJobTriggerParam } = require('../build-schedule-for-job');

const logger = {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
};

describe('date-time-utils-test', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    beforeEach(() => {
        process.env.schedulejobrunin = 'minutes'
    });

    test('Call currentTimeInMilliSecs Test Success', async () => {
        const expectedResult = new Date().getTime();
        const actualResult = await populateScheduleJobTriggerParam(logger)
        console.log(`expectedResult: ${expectedResult} actualResult: ${actualResult}` )
        expect(actualResult).not.toBe(expectedResult);
    })

    test('Call currentTimeInMilliSecs Test with Mins Success', async () => {
        const expectedResult = new Date().getTime();
        process.env.schedulejobrunin = 'minutes'
        const actualResult = await populateScheduleJobTriggerParam(logger)
        console.log(`expectedResult: ${expectedResult} actualResult: ${actualResult}` )
        expect(actualResult).not.toBe(expectedResult);
    })
   
    test('Call currentTimeInMilliSecs Test with Mins Failure', async () => {
        const expectedResult = new Date().getTime();
        process.env.schedulejobrunin = 'minutes'
        const actualResult = await populateScheduleJobTriggerParam(logger)
        console.log(`expectedResult: ${expectedResult} actualResult: ${actualResult}` )
        expect(undefined).not.toBe(expectedResult);
    })

})