// Load all packages
const express = require('express');
const validator = require("email-validator");
const { Client } = require('pg');
const config = require('../config');

// Create router and database client, connect to database
const router = express.Router();
const client = new Client(config.connection);
client.connect();

// Load all database schema
const USER = require('./schema/user');

/**
 * Example GET api for testing
 */
router.get('/', (req, res) => {
    res.send("Hi api!");
});

/**
 * API for creating new user
 * and insert record to database
 */
router.post('/create_new_user', async (req, res) => {
    try {
        // Initialize values
        let email = null;
        let submit_date = get_current_time();

        /**
         * Verify email string from request is valid,
         * if yes, then search if it is already in the database,
         * if no, then send a respond json back
         */
        if (req.body.email) {
            if (validator.validate(req.body.email)) {
                email = req.body.email;

                let search_sql = `SELECT *
                                    FROM ${USER.table_name}
                                    WHERE ${USER.email} = '${email}' `;
                let search_result = await client.query(search_sql);

                if (search_result.rowCount > 0) {
                    return res.json({ success: false, message: 'Sorry, this email address is already taken' });
                }
            } else {
                return res.json({ success: false, message: 'Please provide valid email address' });
            }
        }

        // Insert a new record to database
        let sql = `INSERT INTO ${USER.table_name} (${USER.email}, ${USER.submit_date})
                    VALUES ('${email}', '${submit_date}')
                    RETURNING *`;
        let result = await client.query(sql);

        // Return json respond based on the insert result
        if (result.rowCount === 1) {
            res.json({ success: true, message: 'Create user successful', user_id: result.rows[0].user_id });
        } else {
            throw 'fail';
        }

    } catch (e) {
        res.json({ success: false, message: 'Can not create new user' });
    }
});

/**
 * This method will return current date with time as string
 */
const get_current_time = () => {
    const date = new Date()

    let YYYY = date.getFullYear();
    let MM = date.getMonth() + 1;
    let DD = date.getDate();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();

    return (`${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`);
}

module.exports = router;