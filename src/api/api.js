const log = require('node-log')(__filename);
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const matscastController = require('./controller/chromecast-controller');

const PORT = process.env.EXRESS_PORT;

class Api {

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  start() {
    matscastController(this.app);

    log(`Listening on 0.0.0.0:${PORT}`);
    this.app.listen(PORT, '0.0.0.0');
  }

}

module.exports = Api;
