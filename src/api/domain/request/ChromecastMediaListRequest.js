const _ = require('lodash');
const ChromecastMediaRequest = require('./ChromecastMediaRequest');

class ChromecastMediaListRequest {

  constructor(body) {
    if (!body || !_.isArray(body)) {
      throw new TypeError('arg[0] must be an array');
    }

    this.items = body.map(item => new ChromecastMediaRequest(item));
  }
}

module.exports = ChromecastMediaListRequest;