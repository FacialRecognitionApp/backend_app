const express = require('express');
const app = express();
const config = require('./config');
const PORT = config.DEFAULT_PORT;

// Load all the router
const video = require('./router/video');

// Set all router to app
app.use('/video', video);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));