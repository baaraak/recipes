import path from 'path';
import merge from 'lodash/merge';

// Default configurations applied to all environments
const defaultConfig = {
  env: process.env.NODE_ENV,
  get envs() {
    return {
      development: process.env.NODE_ENV === 'development',
      production: process.env.NODE_ENV === 'production',
    };
  },

  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 9000,
  ip: process.env.IP || '0.0.0.0',
  apiPrefix: '/api/v1/',

  /**
   * MongoDB configuration options
   */
  mongo: {
    seed: true,
    options: {
      db: {
        safe: true,
      },
    },
  },

  /**
   * Security configuation options regarding sessions, authentication and hashing
   */
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'i-am-the-secret-key',
    sessionExpiration: process.env.SESSION_EXPIRATION || 60 * 60 * 24 * 7, // 1 week
    saltRounds: process.env.SALT_ROUNDS || 12,
  },
};

// Environment specific overrides
const environmentConfigs = {
  development: {
    mongo: {
      uri:
        process.env.MONGO_URI ||
        'mongodb://root123:root123@ds129333.mlab.com:29333/tarely',
    },
    security: {
      saltRounds: 4,
    },
  },
  production: {
    mongo: {
      seed: false,
      uri: process.env.MONGO_URI,
    },
  },
};

// Recursively merge configurations
export default merge(
  defaultConfig,
  environmentConfigs[process.env.NODE_ENV] || {}
);
