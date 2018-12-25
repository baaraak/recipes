'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _constants = require('./config/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Use native promises
_mongoose2.default.Promise = global.Promise;

// Connect to our mongo database;
_mongoose2.default.connect(_constants2.default.mongo.uri);
_mongoose2.default.connection.on('error', function (err) {
  throw err;
});