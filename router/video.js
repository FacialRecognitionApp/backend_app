// Load all packages
const express = require("express");
const path = require("path");
const Busboy = require("busboy");
const uploadFile = require("../utils/upload_s3");
const { Client } = require('pg');
const config = require('../config');
const check_user_existed = require("./middleware/check_user_existed");

// Create router and database client, connect to database
const router = express.Router();
const client = new Client(config.connection);
client.connect();

// Load all database schema
const VIDEO = require('./schema/video');
const VIDEO_TYPE = require('./schema/video_type');

/**
 * Example GET api for testing
 */
router.get("/", (req, res) => {
	res.send("Hi api!");
});

/**
 * API for get all the video type questions
 */
router.get("/get_video_question_type", async (req, res) => {
	try {
		let sql = `SELECT *
					FROM ${VIDEO_TYPE.table_name}`;
		let result = (await client.query(sql)).rows;
		res.status(200).json({ success: true, message: 'Get video question type successful', data: result });
	} catch (e) {
		res.status(500).json({ success: false, message: 'Can not find video question types' });
	}
});

/**
 * API for upload video to aws,
 * and insert relating data to database
 */
router.post("/upload_file", check_user_existed, async (req, res) => {

	// Set up busboy, and use it to upload video
	const busboy = new Busboy({ headers: req.headers });
	busboy.on("file", async (fieldname, file, filename, encoding, mimetype) => {
		try {

			// Check if video type id is given on req
			if (!req.query.video_type_id)
				return res.json({ success: false, message: 'Please give the video type id' });

			// Set upload file name
			const video_type_id = req.query.video_type_id
			const user_id = req.query.user_id;
			const upload_name = Date.now() + path.extname(filename).toLocaleLowerCase();

			// Upload file
			console.log("Start upload");
			let upload_result = await uploadFile(file, upload_name);
			let url = upload_result.Location;
			console.log("Upload done!");

			// Insert record to database
			let sql = `INSERT INTO ${VIDEO.table_name} (${VIDEO.video_name}, 
						${VIDEO.video_url}, ${VIDEO.user_id}, ${VIDEO.video_type_id})
						VALUES ('${upload_name}', '${url}', ${user_id}, ${video_type_id})
						RETURNING *`;
			let result = await client.query(sql);
			if (result.rowCount !== 1)
				throw 'fail';

			return res.status(201).json({ success: true, message: 'Video upload successful', url: url });
		} catch (err) {
			res.status(500).json({ success: false, message: 'Sorry, video can not be upload' });
		}

	});
	req.pipe(busboy);

});

module.exports = router;
