const app = require('./app');
const http = require('http');
const conf = require('config');
const log = require('./utils/logger');
// const fs = require('fs');

const server = http.createServer(app);

log.info(`NODE_ENV is ${process.env.NODE_ENV}`);

server.listen(conf.port);
log.warn(`Server is now running at http://localhost:${conf.port}.`);
