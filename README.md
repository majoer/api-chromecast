# API - Chromecast

Api wrapper for
 https://github.com/majoer/chromecast

## NPM Scripts
- `npm start` - Starts the development server
- `npm run start-production` - Starts the production server

## Endpoints
- GET /chromecasts
- GET /chromecasts
- GET /chromecasts/:chromecast
- GET /chromecasts/:chromecast/client-status
- GET /chromecasts/:chromecast/player-status
- POST /chromecasts/:chromecast/load
- POST /chromecasts/:chromecast/play
- POST /chromecasts/:chromecast/pause
- POST /chromecasts/:chromecast/stop
- POST /chromecasts/:chromecast/seek
- POST /chromecasts/:chromecast/step-forwards
- POST /chromecasts/:chromecast/step-backwards
- GET /chromecasts/:chromecast/volume
- POST /chromecasts/:chromecast/volume
- GET /chromecasts/:chromecast/mute
- POST /chromecasts/:chromecast/mute
- POST /chromecasts/:chromecast/unmute
- GET /chromecasts/:chromecast/queue
- POST /chromecasts/:chromecast/queue
- PUT /chromecasts/:chromecast/queue
- DELETE /chromecasts/:chromecast/queue

## Websoket

#### Events from server
  - NEW_CHROMECAST - Triggered on every new connected Chromecast
  - STATUS_PLAYER - Forwarded from internal player
  - STATUS_CLIENT - Forwarded from internal client
