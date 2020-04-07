const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const constants = require('./constants/constants');

const errorMiddleware = require('./middleware/error.middleware');

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
    console.log(`***** Starting server *****`)
    server.use(bodyParser.json());

    // loading all routes from modules
    await router.load(server)
    console.log(`***** All modules loaded *****`);

    // handle error response middleware
    server.use(errorMiddleware);

    // connection to DB
    await _connectToDB();

    const PORT = process.env.NODE_PORT
    // start server on port
    server.listen(PORT, () => {
      console.log(`***** Server running on port ${PORT} *****`);
      _init();
    })
  } catch (err) {
    console.error(`----- ERROR starting server -----`, err)
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
      console.log(`Successfully created admin user`);
    }
    return;
  } catch (err) {
    console.error(`----- Error inserting initial admin user -----`, err)
  }
}

/**
 * _connectToDB connection to DB
 */
const _connectToDB = async () => {
  try {
    console.log(`***** Try connect to DB... *****`);
    await mongoose.connect(`${process.env.DB_HOST}/${process.env.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 4 });
    console.log(`***** Successfully connected to database *****`);
  } catch (err) {
    console.error(`----- ERROR connecting to database -----`, err)
  }
}

_start();

