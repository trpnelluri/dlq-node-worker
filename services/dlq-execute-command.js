'use strict'

const exec = require('shelljs').exec;

exports.executeDLQCommand = async function(res, sourceQueue, targetQueue){
    const cliDLQCommand = `npx replay-aws-dlq ${sourceQueue} ${targetQueue}`
    console.log(`cliDLQCommand: ${cliDLQCommand}`)
    // eslint-disable-next-line no-unused-vars
    const curlProfileRefXMLdlq = exec(cliDLQCommand, function(error, stdout, stderr) {
        console.log(`profilestdout: ${stdout}`)
        res.send('audittransdlqstart world 345');
    })
}