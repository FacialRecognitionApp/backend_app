// Load all packages
const express = require('express');
const { Client } = require('pg');
const config = require('../config');
const check_user_existed = require("./middleware/check_user_existed");

// Create router and database client, connect to database
const router = express.Router();
const client = new Client(config.connection);
client.connect();

// Load all database schema
const SURVEY_ANSWER = require('./schema/survey_answer');
const SURVEY_QUESTION = require('./schema/survey_question');
const SURVEY_QUESTION_TYPE = require('./schema/survey_question_type');
const SURVEY_RATING = require('./schema/survey_rating');
const SURVEY_RATING_QUESTION = require('./schema/survey_rating_question');

/**
 * Example GET api for testing
 */
router.get('/', (req, res) => {
    res.send("Hi api!");
});

/**
 * This API get all the question detail,
 * like question id, content and type
 */
router.get('/survey_questions', async (req, res) => {
    try {
        let result = await get_survey_questions();
        res.status(200).json({ success: true, message: 'Get question list successful', data: result });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Can not find questions' });
    }
});

/**
 * This API is used for updating 
 * user's survey answer to database
 */
router.post('/survey_answer', check_user_existed, async (req, res) => {
    try {
        let survey_answer = req.body.survey_answer;
        let user_id = req.body.user_id;

        let result = await update_question_answer(survey_answer, user_id);
        if (result) {
            res.status(201).json({ success: true, message: 'Update answer successful' });
        } else {
            throw 'fail';
        }
    } catch (e) {
        res.status(500).json({ success: false, message: 'Sorry, can not update your answers' });
    }
});

/**
 * This function is used for getting all
 * the survey question records on database.
 * If the question type 'then', then get_rating_questions
 * will be called in order to get all the rating question
 * from database.
 */
const get_survey_questions = async () => {
    let sql = `SELECT q.${SURVEY_QUESTION.survey_question_id},
                        q.${SURVEY_QUESTION.question_content}, q.${SURVEY_QUESTION.question_type_id},
                        t.${SURVEY_QUESTION_TYPE.type_name}
                FROM ${SURVEY_QUESTION.table_name} q
                JOIN ${SURVEY_QUESTION_TYPE.table_name} t
                ON q.${SURVEY_QUESTION.question_type_id} = t.${SURVEY_QUESTION_TYPE.question_type_id}`;

    let result = (await client.query(sql)).rows;
    for (let i = 0; i < result.length; i++) {
        if (result[i].question_type_id === SURVEY_QUESTION.question_type.rating) {
            result[i].rating_questions = await get_rating_questions(result[i].survey_question_id);
        }
    }

    return result;
}

/**
 * This function is used for get all
 * the rating question records from 
 * database.
 */
const get_rating_questions = async (survey_question_id) => {

    let sql = `SELECT r.${SURVEY_RATING_QUESTION.rating_question_id}, r.${SURVEY_RATING_QUESTION.rating_question_content}
                FROM ${SURVEY_RATING_QUESTION.table_name} r
                JOIN ${SURVEY_QUESTION.table_name} q
                ON r.${SURVEY_RATING_QUESTION.survey_question_id} = q.${SURVEY_QUESTION.survey_question_id}
                WHERE q.${SURVEY_QUESTION.survey_question_id} = ${survey_question_id}`;
    let result = (await client.query(sql)).rows;
    return result;
}

/**
 * This method is used for insert survey answer
 * records to database. If the question type is 'rating',
 * then update_rating_answer will be called in order
 * to insert rating answer records.
 */
const update_question_answer = async (survey_answer, user_id) => {
    let sub_result;
    let sql = `INSERT INTO ${SURVEY_ANSWER.table_name} (${SURVEY_ANSWER.user_id}, 
                ${SURVEY_ANSWER.survey_question_id}, ${SURVEY_ANSWER.answer_content})
                VALUES `;
    for (let i = 0; i < survey_answer.length; i++) {
        if (survey_answer[i].question_type_id === SURVEY_QUESTION.question_type.rating) {
            sub_result = await update_rating_answer(survey_answer[i].answer_content, user_id);
        } else {
            let sql_fragment = `(${user_id}, ${survey_answer[i].survey_question_id}, '${survey_answer[i].answer_content}'),`;
            sql += sql_fragment;
        }
    }
    sql = sql.slice(0, -1) + ' RETURNING *';

    let result = await client.query(sql);
    return (result.rowCount > 0) && sub_result;
}

/**
 * This function is used for
 * inserting all the rating answers
 * to the database.
 */
const update_rating_answer = async (answer_content, user_id) => {
    let sql = `INSERT INTO ${SURVEY_RATING.table_name} (${SURVEY_RATING.rating}, 
                ${SURVEY_RATING.rating_question_id}, ${SURVEY_RATING.user_id})
                VALUES `;
    answer_content.forEach(item => {
        let sql_fragment = `(${item.rating}, ${item.rating_question_id}, ${user_id}),`;
        sql += sql_fragment
    });
    sql = sql.slice(0, -1) + ' RETURNING *';

    let result = await client.query(sql);
    return result.rowCount > 0;
}

module.exports = router;