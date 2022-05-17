// Note: I installed express@4.16.2 and Joi@13.1.0 to follow along with the videos

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const mongoose = require('mongoose');
const logger = require('./middleware/logger');
const tasks = require('./routes/tasks');
const tasksinmemory = require('./routes/tasksinmemory');
const users = require('./routes/users');
const auth = require('./routes/auth');
const cors = require('cors');
const express = require('express');
const app = express();

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

// Connect to DB
mongoose.connect('mongodb://localhost/task-manager')
    .then(() => console.log('Connected to Task Manager DB...'))
    .catch(err => console.error('Could not connect to Task Manager DB...', err));

// uses
app.use(express.json());
    // so the CORS thing doesn't block using frontend and backend together
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', '*');
//     res.header('Access-Control-Allow-Headers', '*');
//     next();
// });
app.use(cors());
app.use(function(req, res, next) {
    logger;
    next();
});
app.use('/api/tasks/inmemory', tasksinmemory);
app.use('/api/tasks', tasks);
app.use('/api/users', users);
app.use('/api/auth', auth);

// PORT
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));