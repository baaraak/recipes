'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = errorHandler;

var _constants = require('../config/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function errorHandler(err, req, res, next) {
  if (!err) {
    return res.sendStatus(500);
  }

  var error = {
    message: err.message || 'Internal Server Error.'
  };

  if (_constants2.default.envs.development) {
    error.stack = err.stack;
  }

  if (err.errors) {
    error.errors = {};
    var errors = err.errors;

    for (var type in errors) {
      if (type in errors) {
        error.errors[type] = errors[type].message;
      }
    }
  }

  res.status(err.status || 500).json(error);
}