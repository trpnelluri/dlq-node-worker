'use strict'

const exec = require('shelljs').exec;

exports.executeDLQCommand = async function(res, logger, sourceQueue, targetQueue){
    const cliDLQCommand = `npx replay-aws-dlq ${sourceQueue} ${targetQueue}`
    logger.info(`executeDLQCommand, cliDLQCommand: ${cliDLQCommand}`)
    // eslint-disable-next-line no-unused-vars
    const curlProfileRefXMLdlq = exec(cliDLQCommand, function(error, stdout, stderr) {
        logger.info(`executeDLQCommand, error: ${error} stdout: ${stdout} stderr: ${stderr}`)
        if (error) {
            logger.error(`executeDLQCommand, Error in moving the message from DLQ to main Queue: ${stderr}`)
            res.send({
                status: '500',
                message: stderr
            })
        } else {
            logger.info('executeDLQCommand, Successfullly moved the message from dlq to main queue')
            let strIndex = stdout.indexOf('message')
            strIndex = strIndex - 1
            let noOfMessagesMoved = stdout.slice(9, strIndex)
            res.send({
                status: '200',
                message: `${noOfMessagesMoved} message(s) from dlq to ${targetQueue} moved successfully`
            })
        }
    })
}