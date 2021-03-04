const express = require('express');
const { Client } = require('pg');
const config = require('../config');

const router = express.Router();
const client = new Client(config.connection);
client.connect();

router.get('/', (req, res) => {
    res.send("Hi api!");
});

router.get('/survey_questions', async (req, res) => {
    try {
        let sql = `SELECT * FROM survey_question`;
        let result = (await client.query(sql)).rows;
        res.json({ success: true, data: result });
    } catch (e) {
        res.json({ success: false, message: 'Can not find questions' })
    }
});

module.exports = router;