import { IEnvironmentConfig } from './Config';

export const development: IEnvironmentConfig = {
  app: {
    port: 7500
  },
  mongodb: {
    url: 'mongodb://127.0.0.1:27017/task15'
  },
  authentication: {
    secretKey: 'dev-secret-jwt-key',
    tokenExpiryInSecs: 43200
  }
};
