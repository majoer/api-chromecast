// const Scanner = require('castv2-player').Scanner();
const log = require('node-log')(__filename);
const Chromecast = require('chromecast');
const { ChromecastMedia, ChromecastQueueMedia } = require('chromecast');
const ChromecastWebSocketService = require('./chromecast-web-socket-service');
const Event = ChromecastWebSocketService.Event;

const chromecastWebSocketService = new ChromecastWebSocketService();

const OPTIONS_SCANNER = {
  maxMatches: 5,
  scanInterval: 10000
};

class ChromecastService {

  constructor() {
    this.chromecasts = [];

    // this.scanner = new Scanner((chromecast) => {
    //   log(`Found device ${chromecast.name}`);

    //   this.chromecasts.push(new Chromecast(chromecast));
    //   chromecastWebSocketService.broadcast(Event.NEW_CHROMECAST, this.getChromecastDevices());
    // }, OPTIONS_SCANNER);

    const chromecast = new Chromecast({
      id: 'f554ce3b0527a9ccf8958e40f6e21c69',
      name: 'Stue',
      host: '192.168.1.50',
      port: 8009,
      type: 'Chromecast'
    });

    chromecast.on('status-player', (status) => chromecastWebSocketService.broadcast(Event.STATUS_PLAYER, status));
    chromecast.on('status-client', (status) => chromecastWebSocketService.broadcast(Event.STATUS_CLIENT, status));

    this.chromecasts.push(chromecast);

  }

  getClientStatus(chromecastName) {
    return this.getChromecastMediaPlayer(chromecastName).then(chromecast => chromecast.getClientStatus());
  }

  getPlayerStatus(chromecastName) {
    return this.getChromecastMediaPlayer(chromecastName).then(chromecast => chromecast.getPlayerStatus());
  }

  load(chromecastName, chromecastMediaRequest) {
    return this.getChromecastMediaPlayer(chromecastName).then(chromecast => chromecast.load(new ChromecastMedia({
      contentId: chromecastMediaRequest.url,
      metadata: {
        title: chromecastMediaRequest.title
      }
    })));
  }

  queueGet(chromecastName) {
    return this.getChromecastMediaPlayer(chromecastName).then(chromecast => {
      return chromecast.getPlayerStatus(chromecastMediaList).then(playerStatus => playerStatus.items);
    });
  }

  queueLoad(chromecastName, chromecastMediaRequest) {
    return this.getChromecastMediaPlayer(chromecastName).then(chromecast => chromecast.queueLoad(new ChromecastMedia({
      contentId: chromecastMediaRequest.url,
      metadata: {
        title: chromecastMediaRequest.title
      }
    })));
  }

  queueInsert(chromecastName, chromecastMediaListRequest) {
    return this.getChromecastMediaPlayer(chromecastName).then(chromecast => {
      const media = chromecastMediaListRequest.items.map(item => new ChromecastQueueMedia({
        media: {
          contentId: item.url,
          metadata: {
            title: item.title
          }
        }
      }));

      log('Queue insert', JSON.stringify(media, null, 4));

      return chromecast.queueInsert(media);
    });
  }

  queueReorder(chromecastName, itemIds) {
    return this.getChromecastMediaPlayer(chromecastName).then(chromecast => {
      return chromecast.queueReorder(itemIds);
    });
  }

  queueRemove(chromecastName, items) {
    return this.getChromecastMediaPlayer(chromecastName).then(chromecast => {
      log('Queue remove', items);
      return chromecast.queueRemove(items);
    });
  }

  play(chromecastName) {
    return this.getChromecastMediaPlayer(chromecastName).then(chromecast => chromecast.play());
  }

  pause(chromecastName) {
    return this.getChromecastMediaPlayer(chromecastName).then(chromecast => chromecast.pause());
  }

  stop(chromecastName) {

  }

  seek(chromecastName, newTimeInSeconds) {
    return this.getChromecastMediaPlayer(chromecastName).then(chromecast => chromecast.seek(newTimeInSeconds));
  }

  stepForwards(chromecastName) {

  }

  stepBackwards(chromecastName) {

  }

  setVolume(chromecastName, volume) {
    return this.getChromecastMediaPlayer(chromecastName).then(chromecast => chromecast.setVolume(volume));
  }

  mute(chromecastName) {
    return this.getChromecastMediaPlayer(chromecastName).then(chromecast => chromecast.mute());
  }

  unmute(chromecastName) {
    return this.getChromecastMediaPlayer(chromecastName).then(chromecast => chromecast.unmute());
  }

  getPlaylist(chromecastName) {
    return this.getChromecastMediaPlayer(chromecastName).then(mediaPlayer => {
      log(`Getting playlist for ${chromecastName}`);

      return mediaPlayer.getPlaylist(mediaPlayer.getCurrentPlaylistId());
    });
  }

  addToPlaylist(chromecastName, url) {
    return this.getChromecastMediaPlayer(chromecastName).then(mediaPlayer => {
      log(`Adding ${url} to ${chromecastName}`);

      return mediaPlayer.playUrlPromise(url)
    });
  }

  getChromecasts() {
    return this.chromecasts.map(chromecast => chromecast.options);
  }

  getChromecast(chromecastName) {
    return this.getChromecasts().find(device => device.name === chromecastName);
  }

  getChromecastMediaPlayer(chromecastName) {
    return new Promise((resolve, reject) => {
      const chromecast = this.chromecasts.find(chromecast => chromecast.options.name === chromecastName);
      if (chromecast) {
        if (chromecast.connected) {
          resolve(chromecast);
        } else {
          reject(`Not yet connected to chromecast ${chromecastName}`);
        }
      } else {
        reject(`Could not find chromecast with name ${chromecastName}`);
      }
    });
  }
}

module.exports = ChromecastService;
