// Load all packages
const { Client } = require('pg');
const config = require('../../config');

// Create router and database client, connect to database
const client = new Client(config.connection);
client.connect();

// Load all database schema
const USER = require('../schema/user');

/**
 * Middleware function to check if user_id is given by request,
 * or it is existed in database
 */
module.exports = async (req, res, next) => {
    try {
        // Check if user_id is given on query
        if (!req.query.user_id && !req.body.user_id)
            return res.status(400).json({ success: false, message: 'Please give your correct user id' });

        // Check if this user_id is existed in database
        let user_id = parseInt(req.query.user_id ? req.query.user_id : req.body.user_id);
        let search_sql = `SELECT *
                            FROM ${USER.table_name}
                            WHERE ${USER.user_id} = ${user_id}`;
        let search_result = await client.query(search_sql);

        // Send json back if the given user is not existed
        if (search_result.rowCount !== 1)
            return res.status(404).json({ success: false, message: 'Sorry, user is not existed' });

        next();
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Sorry, fail to find the user in database' });
    }
}