'use strict'

const exec = require('shelljs').exec;

exports.executeDLQCommand = async function(res, sourceQueue, targetQueue){
    const cliDLQCommand = `npx replay-aws-dlq ${sourceQueue} ${targetQueue}`
    console.log(`cliDLQCommand: ${cliDLQCommand}`)
    // eslint-disable-next-line no-unused-vars
    const curlProfileRefXMLdlq = exec(cliDLQCommand, function(error, stdout, stderr) {
        console.log(`profilestdout: ${stdout}`)
        res.send('audittransdlqstart world 345');
        if (error) {
            console.error(`Error in moving the message from DLQ to main Queue: ${stderr}`)
            res.send({
                status: '500',
                message: stderr
            })
        } else {
            console.log('Successfullly moved the message from dlq to main queue')
            res.send({
                status: '200',
                message: stdout
            })
        }
    })
}