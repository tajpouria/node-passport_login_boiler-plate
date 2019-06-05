const expressLayouts = require('express-ejs-layouts');
const express = require('express');
const winston = require('winston');
const config = require('config');
const mongoose = require('mongoose');

const index = require('./routes');
const users = require('./routes/users');

const app = express();
winston.add(winston.transports.File, { filename: 'logfile.log' });
// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
// DB config
const db = config.get('database.mongodb.uri');
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => winston.info(`Successfully connected to ${db}...`))
  .catch(({ message }) => new Error(message));
// error handling
process.on('uncaughtException', err => {
  winston.error(err.message, err);
  return process.exit(1);
});
process.on('unhandledRejection', err => {
  winston.error(err.message, err);
  return process.exit(1);
});
// middlewares
app.use(express.urlencoded({ extended: false }));
// routes
app.use('/', index);
app.use('/users', users);

const port = process.env.PORT || 4000;
app.listen(port, winston.info(`Listening on port ${port}...`));
