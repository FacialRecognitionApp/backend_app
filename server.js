const express = require('express');
const app = express();
const config = require('./config');
const path = require('path');
const PORT = config.DEFAULT_PORT;

// Load all the router
const video = require('./router/video');
const survey = require('./router/survey');

// Load all the middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// Set all router to app
app.use('/video', video);
app.use('/survey', survey);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));