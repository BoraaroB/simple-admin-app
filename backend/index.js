const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const constants = require('./constants/constants');

const config = require('./config');
const logger = require('./lib/logger');
const errorMiddleware = require('./middleware/error.middleware');
const loggerMiddleware = require('./middleware/logger.middleware');

const router = require('./router');
const userService = require('./services/user.service');

const server = express();

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

/**
 * _start 
 * call _start function for initialization server
 */
const _start = async () => {
  try {
    // setting cors
    server
      .use(cors())
      .use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', ' GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
        next();
      });
    logger.info(null, `***** Starting server *****`)
    server.use(bodyParser.json());

    server.use(loggerMiddleware.logRequest);

    // loading all routes from modules
    await router.load(server)
    logger.info(null, `***** All modules loaded *****`);

    // handle error response middleware
    server.use(errorMiddleware);

    // connection to DB
    await _connectToDB();

    const PORT = config.NODE_PORT
    // start server on port
    server.listen(PORT, () => {
      logger.info(null, `***** Server running on port ${PORT} *****`);
      _init();
    })
  } catch (err) {
    logger.error(null, `----- ERROR starting server -----`, err)
  }

}

/**
 * _init function initializes a default admin user if the DB is empty
 */
const _init = async () => {
  try {
    const users = await userService.findAll({ password: 0 });
    if (!users || users.length === 0) {
      const adminUser = {
        email: constants.INIT_ADMIN.ADMIN_EMAIL,
        password: constants.INIT_ADMIN.ADMIN_PASSWORD,
        confirmPassword: constants.INIT_ADMIN.ADMIN_PASSWORD,
        role: constants.INIT_ADMIN.ADMIN_ROLE,
      }
      await userService.create(adminUser, adminUser)
      logger.info(null, `Successfully created admin user`);
    }
    return;
  } catch (err) {
    logger.error(null, `----- Error inserting initial admin user -----`, err)
  }
}

/**
 * _connectToDB connection to DB
 */
const _connectToDB = async () => {
  try {
    logger.info(null, `***** Try connect to DB... *****`);
    await mongoose.connect(`${config.DB_HOST}/${config.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 4 });
    logger.info(null, `***** Successfully connected to database *****`);
  } catch (err) {
    logger.error(null, `----- ERROR connecting to database -----`, err)
  }
}

_start();

