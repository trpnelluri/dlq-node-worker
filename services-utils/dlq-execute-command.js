'use strict'

const exec = require('shelljs').exec;

exports.executeDLQCommand = async function(res, logger, sourceQueue, targetQueue){
    try {
        const cliDLQCommand = `npx replay-aws-dlq ${sourceQueue} ${targetQueue}`
        logger.info(`executeDLQCommand, cliDLQCommand: ${cliDLQCommand}`)
        // eslint-disable-next-line no-unused-vars
        const curlProfileRefXMLdlq = exec(cliDLQCommand, function(error, stdout, stderr) {
            logger.info(`executeDLQCommand, error: ${error} stdout: ${stdout} stderr: ${stderr}`)
            if (stderr) {
                logger.error(`executeDLQCommand, Error in moving the message from DLQ to main Queue: ${stderr}`)
                res.send({
                    status: '500',
                    message: stderr
                })
            } else {
                logger.info('executeDLQCommand, Successfullly moved the message from dlq to main queue')
                let noOfMsgIndex = stdout.indexOf('replayed')
                let noOfMsgs = noOfMsgIndex + 9
                let strIndex = stdout.indexOf('message(s)')
                strIndex = strIndex - 1
                let noOfMessagesMoved = stdout.slice(noOfMsgs, strIndex)
                logger.info(`executeDLQCommand, noOfMsgIndex: ${noOfMsgIndex} noOfMsgs:${noOfMsgs} strIndex:${strIndex} noOfMessagesMoved: ${noOfMessagesMoved}`)
                res.send({
                    status: '200',
                    message: `${noOfMessagesMoved} message(s) from dlq to ${targetQueue} moved successfully`
                })

            }
        })
    } catch(err) {
        logger.error(`executeDLQCommand, Moving message Failed ${err}`)
    }
    
}