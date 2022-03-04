'use strict'

/**
 *  This is an esMD postgreSQL connection service to insert the data into appropriate tables in postgre-sql database.
 * 
 *  @author Siva Nelluri
 *	@date 03/02/2021
 *	@version 1.0.0
 * 
*/

const { Pool } = require('pg');
const { getDBConnDetails } = require('../aws/db-conn-details-from-ssm');
const loggerUtils = require('../common/logger-utils');

let pool;
let count = 0;
const EventName = 'POSTGRES_DB_SERVICE'

/*
The following function is used to establish the connection to the postgreSQL database from Audit worker and the connection details will
from AWS Secrect Manager serveice.
*/
const connectToPostgresDB = () => {
    let logParams = {};
    const logger = loggerUtils.customLogger(EventName, logParams);
    logger.info(`connectToPostgresDB, process.env.SM_PGS_DB_AUTH: ${process.env.SM_PGS_DB_AUTH}`)
        
    try{
        const params = {
            SecretId: process.env.SM_PGS_DB_AUTH,
        };
        getDBConnDetails(params, logger, (err, dbConnDetails) => {
            if (err) {
                logger.error(`connectToPostgresDB, Error while getting the getDBConnDetails from secret manager service: ${err.stack}`);
            } else {
                dbConnDetails = JSON.parse(dbConnDetails);
                const idleTimeout = process.env.pgs_idle_time_out;
                const connTimeout = process.env.pgs_conn_time_out;
                logger.info(`connectToPostgresDB, idleTimeout: ${idleTimeout} connTimeout: ${connTimeout}`);
    
                pool = new Pool({
                    user: dbConnDetails.username,
                    host: dbConnDetails.host,
                    //host:'localhost',
                    database: dbConnDetails.dbname,
                    password: dbConnDetails.password,
                    port: dbConnDetails.port,
                    idleTimeoutMillis: idleTimeout, // 30 sec
                    connectionTimeoutMillis: connTimeout, // 5 sec
                    max: 20,
                });
            }
    
            pool.on('connect', (client) => {
                logger.debug('connectToPostgresDB, connect');
            });
    
            pool.on('acquire', (client) => {
                count += 1;
                logger.debug(`connectToPostgresDB, acquire count : ${count}`);
            });
    
            pool.on('error', (error) => {
                logger.error(`connectToPostgresDB, connection Error: ${error}`);
            });

        });

    } catch(err) {
        logger.error(`connectToPostgresDB, ERROR: ${err.stack}`);
    }
}

/*
The follwoing function is used to get the reference data from esmd_data.audt_evnt_actn_rfrnc table to based on audt_evnt_actn_name
*/
const getRequiredRefData = async function (query, valsToReplace, logParams, callback, poolData = undefined) {
    const logger = loggerUtils.customLogger( EventName, logParams);
    logger.info(`getRequiredRefData, Query to execute: ${query} valuesToReplace: ${valsToReplace}`);
    try {
        const client = await pool.connect();
        const newClient = poolData || client ;
        let rowsFound = false;
       
        newClient.query(query, valsToReplace, (err, res) => {
            if (err) {
                logger.error(`getRequiredRefData, Error getting ref data: ${err.stack}`);
                callback(err, 0);
            } else {
                logger.info(`getRequiredRefData, res result to send: ${JSON.stringify(res)} res.rowCount: ${res.rowCount}`);
                client.release();
                count -= 1;
                logger.debug(`getRequiredRefData, client connections count: ${count}`);
                if ( res.rowCount > 0 ) {
                    rowsFound = true
                }
                callback(null, rowsFound, res.rows)
            }
        });

    } catch(err) {
        logger.error(`getRequiredRefData, Catch block error: ${err.stack}`);
        callback(err, 0);
    }
};


module.exports = {
    connectToPostgresDB,
    getRequiredRefData
}