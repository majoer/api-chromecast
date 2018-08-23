const log = require('node-log')(__filename);
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const matscastController = require('./controller/chromecast-controller');

const INTERFACE = process.env.EXPRESS_INTERFACE;
const PORT = process.env.EXPRESS_PORT;

class Api {

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  start() {
    matscastController(this.app);

    log(`Listening on ${INTERFACE}:${PORT}`);
    this.app.listen(PORT, INTERFACE);
  }

}

module.exports = Api;
