const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const constants = require('./constants/constants');

const errorMiddleware = require('./middleware/error.middleware');

const router = require('./router');

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

    // start server on port
    server.listen(process.env.NODE_PORT, () => {
      console.log(`***** Server running on port ${process.env.NODE_PORT} *****`);
    })
  } catch (err) {
    console.error(`----- ERROR starting server -----`, err)
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

