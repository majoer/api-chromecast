const log = require('node-log')(__filename);
const Api = require('../api/api');

log('Starting MediaApi');
new Api().start();
