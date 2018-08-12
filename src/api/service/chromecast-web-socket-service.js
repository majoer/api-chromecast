const WebSocket = require('ws');
const log = require('node-log')(__filename);

class ChromecastWebSocketService {

  constructor(config) {

    this.server = new WebSocket.Server({
      port: 4001,
    });

    this.server.on('listening', () => {
      log('Ready for connections');
    });

    this.server.on('connection', (webSocket, req) => {
      log(`${req.connection.remoteAddress}: New webSocket connection`);

      webSocket.on('open', () => {
        log(`${req.connection.remoteAddress}: Websocket is ready`);
      });

      webSocket.on('message', (data) => {
        log(`${req.connection.remoteAddress}: Got message ${data}`);
      });
    });
  }

  broadcast(message, payload) {
    this.server.clients.forEach(client => {
      if (!client.readyState === WebSocket.OPEN) {
        return;
      }

      if (payload) {
        client.send(`${message}:${JSON.stringify(payload)}`);
      } else {
        client.send(`${message}`);
      }
    });
  }
}

ChromecastWebSocketService.Event = {
  NEW_CHROMECAST: 'NEW_CHROMECAST',
  STATUS_PLAYER: 'STATUS_PLAYER',
  STATUS_CLIENT: 'STATUS_CLIENT'
}

module.exports = ChromecastWebSocketService;

