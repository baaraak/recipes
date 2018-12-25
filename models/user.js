'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _constants = require('../config/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String
}, {
  timestamps: true
});

/**
 * User Methods
 */
UserSchema.methods = {
  generateToken: function generateToken() {
    return _jsonwebtoken2.default.sign({ _id: this._id }, _constants2.default.security.sessionSecret, {
      expiresIn: _constants2.default.security.sessionExpiration
    });
  }
};

var UserModel = _mongoose2.default.model('User', UserSchema);

exports.default = UserModel;