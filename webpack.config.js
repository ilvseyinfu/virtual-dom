'use strict';

const path    = require('path');
const process = require('process');
const args    = require('minimist')(process.argv.slice(2));

var env = args.env || process.env.WEBPACK_ENV || 'dev';

module.exports = require('./config/webpack/' + env);
