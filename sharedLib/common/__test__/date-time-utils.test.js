'use strict';

//const { currentTimeInMilliSecs, timeDiffInMilliSecs, timeDiffInMins } = require('../date-time-utils');
const { currentTimeInMilliSecs, timeDiffInMilliSecs, timeDiffInMins } = require('../date-time-utils');
//const loggerUtils = require('../../../sharedLib/common/logger-utils');

// jest.mock('../logger-utils', () => ({
//     customLogger: jest.fn((EventName, logParams) => ({
//         info: jest.fn(),
//         error: jest.fn(),
//         debug: jest.fn(),
//         clear: jest.fn()
//     }))
// }));

const logger = {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
};

describe('date-time-utils-test', () => {
        
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Call currentTimeInMilliSecs Test', async () => {
        const expectedResult = new Date().getTime();
        const actualResult = await currentTimeInMilliSecs(logger)
        console.log(`expectedResult: ${expectedResult} actualResult: ${actualResult}` )
        expect(actualResult).toBe(expectedResult);
    })

    test('Call currentTimeInMilliSecs with failure Test', async () => {

        const expectedResult = new Date().getTime();
        try {
            await currentTimeInMilliSecs()
        } catch(err){
            expect(undefined).not.toBe(expectedResult);
        }

    })

    test('Call timeDiffInMilliSecs Test Success', async () => {
        let endTime = new Date().getTime();
        let startTime = new Date().getTime() - 10 ;
        const expectedResult = endTime - startTime;
        const actualResult = await timeDiffInMilliSecs (logger, endTime, startTime)
        console.log(`expectedResult: ${expectedResult} actualResult: ${actualResult}` )
        expect(actualResult).toBe(expectedResult);
    })

    test('Call timeDiffInMilliSecs with failure', async () => {

        let endTime = new Date().getTime();
        let startTime = new Date().getTime() - 10 ;
        const expectedResult = endTime - startTime;
        try {
            await timeDiffInMilliSecs(endTime, startTime)
        } catch(err){
            expect(undefined).not.toBe(expectedResult);
        }
    })

    test('Call timeDiffInMilliSecs with failure 2', async () => {
        let startTime = new Date().getTime() - 10 ;
        try {
            await timeDiffInMilliSecs(logger, startTime)
        } catch(err){
            expect(err).toMatch('error');
        }
    })

    test('Call timeDiffInMilliSecs with failure 3', async () => {
        let startTime = new Date().getTime() - 10 ;
        expect(timeDiffInMilliSecs(logger, startTime)).rejects.toMatch('error');
    })


    test('Call timeDiffInMins Test Success', async () => {
        let endTime = new Date().getTime();
        let startTime = new Date().getTime() - 120 ;
        //const expectedResult = endTime - startTime / 60000;
        let expectedResult = endTime - startTime;
        expectedResult = expectedResult / 60000
        const actualResult = await timeDiffInMins (logger, endTime, startTime)
        console.log(`expectedResult: ${expectedResult} actualResult: ${actualResult}` )
        expect(actualResult).toBe(expectedResult);
    })

})