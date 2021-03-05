// Load all packages
const express = require("express");
const path = require("path");
const Busboy = require("busboy");
const uploadFile = require("../utils/upload_s3");
const { Client } = require('pg');
const config = require('../config');

// Create router and database client, connect to database
const router = express.Router();
const client = new Client(config.connection);
client.connect();

// Load all database schema
const USER = require('./schema/user');
const VIDEO = require('./schema/video');

/**
 * Example GET api for testing
 */
router.get("/", (req, res) => {
	res.send("Hi api!");
});

/**
 * API for upload video to aws,
 * and insert relating data to database
 */
router.post("/upload_file", async (req, res) => {

	// Check if user_id is given on query
	if (!req.query.user_id)
		return res.json({ success: false, message: 'Please give your correct user id' });

	// Check if this user_id is existed in database
	let user_id = parseInt(req.query.user_id);
	let search_sql = `SELECT *
						FROM ${USER.table_name}
						WHERE ${USER.user_id} = ${user_id}`;
	let search_result = await client.query(search_sql);

	// Send json back if the given user is not existed
	if (search_result.rowCount !== 1)
		return res.json({ success: false, message: 'Sorry, user is not existed' });

	// Set up busboy, and use it to upload video
	const busboy = new Busboy({ headers: req.headers });
	busboy.on("file", async (fieldname, file, filename, encoding, mimetype) => {
		try {

			// Set upload file name
			const upload_name = Date.now() + path.extname(filename).toLocaleLowerCase();

			// Upload file
			console.log("Start upload");
			let upload_result = await uploadFile(file, upload_name);
			let url = upload_result.Location;
			console.log("Upload done!");

			// Insert record to database
			let sql = `INSERT INTO ${VIDEO.table_name} (${VIDEO.video_name}, ${VIDEO.video_url}, ${VIDEO.user_id})
						VALUES ('${upload_name}', '${url}', ${user_id})
						RETURNING *`;
			let result = await client.query(sql);
			if (result.rowCount !== 1)
				throw 'fail';

		} catch (err) {
			res.json({ success: false, message: 'Sorry, video can not be upload' });
		}
		res.json({ success: true, message: 'Video upload successful' });
	});
	req.pipe(busboy);
});

module.exports = router;
