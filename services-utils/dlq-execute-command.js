'use strict'

const exec = require('shelljs').exec;

exports.executeDLQCommand = async function(res, logger, sourceQueue, targetQueue){
    const cliDLQCommand = `npx replay-aws-dlq ${sourceQueue} ${targetQueue}`
    logger.info(`cliDLQCommand: ${cliDLQCommand}`)
    // eslint-disable-next-line no-unused-vars
    const curlProfileRefXMLdlq = exec(cliDLQCommand, function(error, stdout, stderr) {
        logger.info(`error: ${error} stdout: ${stdout} stderr: ${stderr}`)
        if (error) {
            logger.error(`Error in moving the message from DLQ to main Queue: ${stderr}`)
            res.send({
                status: '500',
                message: stderr
            })
        } else {
            logger.info('Successfullly moved the message from dlq to main queue')
            let noOfMessagesMoved = stdout.slice(9, 11)
            res.send({
                status: '200',
                message: `${noOfMessagesMoved} messages from dlq to ${targetQueue} moved successfully`
            })
        }
    })
}