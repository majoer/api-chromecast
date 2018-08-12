const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), 'dev.env') });
const log = require('node-log')(__filename);

const Api = require('../api/api');

log('Starting MediaApi (dev)');
const api = new Api();

api.start();
