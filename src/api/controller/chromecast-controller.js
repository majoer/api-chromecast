const _ = require('lodash');

const log = require('node-log')(__filename);
const { ErrorCode } = require('chromecast');
const ChromecastService = require('../service/chromecast-service');
const ChromecastMediaRequest = require('../domain/request/ChromecastMediaRequest');
const ChromecastMediaListRequest = require('../domain/request/ChromecastMediaListRequest');

const chromecastService = new ChromecastService();

module.exports = (app) => {

  log('Registering endpoint GET /chromecasts');
  app.get('/chromecasts/', (req, res) => {
    const devices = chromecastService.getChromecasts();

    res.send(devices);
  });

  log('Registering endpoint GET /chromecasts/:chromecast');
  app.get('/chromecasts/:chromecast', (req, res) => {
    const device = chromecastService.getChromecast(req.params.chromecast);

    if (device) {
      res.send(device);
    } else {
      res.sendStatus(404);
    }
  });

  log('Registering endpoint GET /chromecasts/:chromecast/client-status');
  app.get('/chromecasts/:chromecast/client-status', (req, res) => {
    chromecastService.getClientStatus(req.params.chromecast).then((clientStatus) => {
      res.send(clientStatus);
    }).catch((err) => {
      log(err);
      res.sendStatus(500);
    });
  });

  log('Registering endpoint GET /chromecasts/:chromecast/player-status');
  app.get('/chromecasts/:chromecast/player-status', (req, res) => {
    log('getPlayerStatus:begin');

    chromecastService.getPlayerStatus(req.params.chromecast).then((playerStatus) => {
      log('getPlayerStatus:complete');

      res.send(playerStatus);
    }).catch((err) => {
      log(err);

      if (ErrorCode.CHROMECAST.NOTHING_IS_PLAYING.is(err.code)) {
        res.status(404).send(err);
      } else {
        res.status(500).send(err);
      }
    });
  });

  log('Registering endpoint POST /chromecasts/:chromecast/load');
  app.post('/chromecasts/:chromecast/load', (req, res) => {

    let chromecastMedia;
    try {
      chromecastMedia = new ChromecastMediaRequest(req.body);
    } catch (err) {
      log(err);
      res.sendStatus(400);
      return;
    }

    chromecastService.load(req.params.chromecast, chromecastMedia).then((playerStatus) => {
      res.send(playerStatus);
    }).catch((err) => {
      log(err);
      res.sendStatus(500);
    });
  });

  log('Registering endpoint POST /chromecasts/:chromecast/play');
  app.post('/chromecasts/:chromecast/play', (req, res) => {
    chromecastService.play(req.params.chromecast).then((playerStatus) => {
      res.send(playerStatus);
    }).catch((err) => {
      log(err);
      res.sendStatus(500);
    });
  });

  log('Registering endpoint POST /chromecasts/:chromecast/pause');
  app.post('/chromecasts/:chromecast/pause', (req, res) => {
    chromecastService.pause(req.params.chromecast).then((playerStatus) => {
      res.send(playerStatus);
    }).catch((err) => {
      log(err);
      res.sendStatus(500);
    });
  });

  log('Registering endpoint POST /chromecasts/:chromecast/stop');
  app.post('/chromecasts/:chromecast/stop', (req, res) => {
    chromecastService.stop(req.params.chromecast).then((playerStatus) => {
      res.send(playerStatus);
    }).catch((err) => {
      log(err);
      res.sendStatus(500);
    });
  });

  log('Registering endpoint POST /chromecasts/:chromecast/seek');
  app.post('/chromecasts/:chromecast/seek', (req, res) => {
    const timeInSeconds = req.body.timeInSeconds;
    if (timeInSeconds === undefined || timeInSeconds === null || timeInSeconds < 0) {
      res.sendStatus(400);
      return;
    }

    chromecastService.seek(req.params.chromecast, timeInSeconds).then((playerStatus) => {
      res.send(playerStatus);
    }).catch((err) => {
      log(err);
      res.sendStatus(500);
    });
  });

  log('Registering endpoint POST /chromecasts/:chromecast/step-forwards');
  app.post('/chromecasts/:chromecast/step-forward', (req, res) => {
    chromecastService.stepForwards(req.params.chromecast).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      log(err);
      res.sendStatus(500);
    });
  });

  log('Registering endpoint POST /chromecasts/:chromecast/step-backwards');
  app.post('/chromecasts/:chromecast/step-backwards', (req, res) => {
    chromecastService.stepBackwards(req.params.chromecast).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      log(err);
      res.sendStatus(500);
    });
  });

  log('Registering endpoint GET /chromecasts/:chromecast/volume');
  app.get('/chromecasts/:chromecast/volume', (req, res) => {
    chromecastService.getVolume(req.params.chromecast).then((clientStatus) => {
      res.sendStatus(clientStatus);
    }).catch((err) => {
      log(err);
      res.sendStatus(500);
    });
  });

  log('Registering endpoint POST /chromecasts/:chromecast/volume');
  app.post('/chromecasts/:chromecast/volume', (req, res) => {
    const level = req.body.level;
    if (level === undefined || level === null || level < 0 || level > 1) {
      res.sendStatus(400);
      return;
    }

    chromecastService.setVolume(req.params.chromecast, req.body).then((volume) => {
      res.send(volume);
    }).catch((err) => {
      log(err);
      res.sendStatus(500);
    });
  });

  log('Registering endpoint GET /chromecasts/:chromecast/mute');
  app.get('/chromecasts/:chromecast/mute', (req, res) => {
    chromecastService.isMuted(req.params.chromecast).then((clientStatus) => {
      res.send(clientStatus);
    }).catch((err) => {
      log(err);
      res.sendStatus(500);
    });
  });

  log('Registering endpoint POST /chromecasts/:chromecast/mute');
  app.post('/chromecasts/:chromecast/mute', (req, res) => {
    chromecastService.mute(req.params.chromecast).then((clientStatus) => {
      res.send(clientStatus);
    }).catch((err) => {
      log(err);
      res.sendStatus(500);
    });
  });

  log('Registering endpoint POST /chromecasts/:chromecast/unmute');
  app.post('/chromecasts/:chromecast/unmute', (req, res) => {
    chromecastService.unmute(req.params.chromecast).then((clientStatus) => {
      res.send(clientStatus);
    }).catch((err) => {
      log(err);
      res.sendStatus(500);
    });
  });

  log('Registering endpoint GET /chromecasts/:chromecast/queue');
  app.get('/chromecasts/:chromecast/queue', (req, res) => {
    chromecastService.queueGet(req.params.chromecast, mediaList).then(queue => {
      res.send(queue);
    }).catch((err) => {
      log(err);
      res.sendStatus(500);
    });
  });

  log('Registering endpoint POST /chromecasts/:chromecast/queue');
  app.post('/chromecasts/:chromecast/queue', (req, res) => {
    let mediaList;

    try {
      mediaList = new ChromecastMediaListRequest(req.body);
    } catch (err) {
      log(err);
      res.sendStatus(400);
      return;
    }

    if (req.query.load) {
      chromecastService.queueLoad(req.params.chromecast, mediaList).then(playerStatus => {
        res.send(playerStatus);
      }).catch((err) => {
        log(err);
        res.sendStatus(500);
      });
    } else {
      chromecastService.queueInsert(req.params.chromecast, mediaList).then(playerStatus => {
        res.send(playerStatus);
      }).catch((err) => {
        log(err);
        res.sendStatus(500);
      });
    }
  });

  log('Registering endpoint PUT /chromecasts/:chromecast/queue');
  app.put('/chromecasts/:chromecast/queue', (req, res) => {
    if (req.query.reorder) {
      if (!_.isArray(req.body)) {
        res.send(400);
        return;
      } else {

        chromecastService.queueReorder(req.params.chromecast, req.body).then(playerStatus => {
          res.send(playerStatus)
        }).catch(err => {
          log(err);
          res.sendStatus(500);
        });
      }
    } else {
      res.send(200);
    }
  });

  log('Registering endpoint DELETE /chromecasts/:chromecast/queue');
  app.delete('/chromecasts/:chromecast/queue', (req, res) => {
    if (!_.isArray(req.body) || !_.every(req.body, _.isNumber)) {
      res.sendStatus(400);
      return;
    }

    chromecastService.queueRemove(req.params.chromecast, req.body).then(playerStatus => {
      res.send(playerStatus)
    }).catch(err => {
      log(err);
      res.sendStatus(500);
    });
  });
};
