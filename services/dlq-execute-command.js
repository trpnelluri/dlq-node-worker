'use strict'

const exec = require('shelljs').exec;

exports.executeDLQCommand = async function(res, sourceQueue, targetQueue){
    const processDLQCommand = `npx replay-aws-dlq ${sourceQueue} ${targetQueue}`
    console.log(`processDLQCommand: ${processDLQCommand}`)
    // eslint-disable-next-line no-unused-vars
    const curlProfileRefXMLdlq = exec(processDLQCommand, function(error, profilestdout, stderr) {
        //console.log(`curlProfileRefXML: ${curlProfileRefXMLdlq} stderr: ${stderr}`)
        console.log(`profilestdout: ${profilestdout}`)
        res.send('audittransdlqstart world 345');
    })

}