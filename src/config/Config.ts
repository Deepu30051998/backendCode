import { development } from './development';
import { production } from './production';

export interface IAppConfig {
  port: number;
}

export interface IMongoConfig {
  url: string;
}

export interface IAuthConfig {
  secretKey: string;
  tokenExpiryInSecs: number;
}

export interface IEnvironmentConfig {
  app: IAppConfig;
  mongodb: IMongoConfig;
  authentication: IAuthConfig;
}

export class Config {
  private static instance: Config;

  private readonly port: number;
  private readonly mongoUrl: string;
  private readonly jwtSecret: string;
  private readonly jwtExpirySeconds: number;

  private constructor() {
    const env = process.env.NODE_ENV || 'development';
    const data: IEnvironmentConfig = env === 'production' ? production : development;

    this.port = parseInt(process.env.PORT || `${data.app.port}` || '7500', 10);
    this.mongoUrl = process.env.MONGO_URL || data.mongodb.url;
    this.jwtSecret = process.env.JWT_SECRET || data.authentication.secretKey;
    this.jwtExpirySeconds = data.authentication.tokenExpiryInSecs || 43200;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public getPort(): number {
    return this.port;
  }

  public getMongoUrl(): string {
    return this.mongoUrl;
  }

  public getJwtSecret(): string {
    return this.jwtSecret;
  }

  public getJwtExpiry(): number {
    return this.jwtExpirySeconds;
  }

  public isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  public isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }
}
