class ChromecastMediaRequest {

  constructor(body) {
    if (!body.url || !body.title) {
      throw new TypeError('arg[0] must have properties url and title');
    }

    this.url = new URL(body.url);
    this.title = body.title;
  }
}

module.exports = ChromecastMediaRequest;
