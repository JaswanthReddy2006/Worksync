const express = require('express');
const app = express();
const cors = require('cors'); 

app.use(cors());
app.use(express.json());
const userRouter = require('./routes/userRoutes.js');
const logger = require('./middleware/logger.js');
app.use('/api/users', userRouter);
module.exports = app;

