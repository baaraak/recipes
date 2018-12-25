'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Default configurations applied to all environments
var defaultConfig = {
  env: process.env.NODE_ENV,
  get envs() {
    return {
      development: process.env.NODE_ENV === 'development',
      production: process.env.NODE_ENV === 'production'
    };
  },

  root: _path2.default.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 3001,
  ip: process.env.IP || '0.0.0.0',
  apiPrefix: '/api/v1/',

  /**
   * MongoDB configuration options
   */
  mongo: {
    seed: true,
    options: {
      db: {
        safe: true
      }
    }
  },

  /**
   * Security configuation options regarding sessions, authentication and hashing
   */
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'i-am-the-secret-key',
    sessionExpiration: process.env.SESSION_EXPIRATION || 60 * 60 * 24 * 7, // 1 week
    saltRounds: process.env.SALT_ROUNDS || 12
  }
};

// Environment specific overrides
var environmentConfigs = {
  development: {
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb://root123:root123@ds243344.mlab.com:43344/platot'
    },
    security: {
      saltRounds: 4
    }
  },
  production: {
    mongo: {
      seed: false,
      uri: process.env.MONGO_URI
    }
  }
};

// Recursively merge configurations
exports.default = (0, _merge2.default)(defaultConfig, environmentConfigs[process.env.NODE_ENV] || {});