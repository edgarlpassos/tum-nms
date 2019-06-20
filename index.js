const sls = require('serverless-http');
const server = require('./server');
const binaryMimeTypes = require('./binaryMimeTypes');

module.exports.server = sls(server, { binary: binaryMimeTypes });
