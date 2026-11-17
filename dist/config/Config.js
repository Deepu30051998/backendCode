"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
require("dotenv/config");
const development_1 = require("./development");
const production_1 = require("./production");
class Config {
    static instance;
    port;
    mongoUrl;
    jwtSecret;
    jwtExpirySeconds;
    constructor() {
        const env = process.env.NODE_ENV || 'development';
        const data = env === 'production' ? production_1.production : development_1.development;
        this.port = parseInt(process.env.PORT || `${data.app.port}` || '7500', 10);
        this.mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI || data.mongodb.url;
        this.jwtSecret = process.env.JWT_SECRET || data.authentication.secretKey;
        this.jwtExpirySeconds = data.authentication.tokenExpiryInSecs || 43200;
    }
    static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
    getPort() {
        return this.port;
    }
    getMongoUrl() {
        return this.mongoUrl;
    }
    getJwtSecret() {
        return this.jwtSecret;
    }
    getJwtExpiry() {
        return this.jwtExpirySeconds;
    }
    isProduction() {
        return process.env.NODE_ENV === 'production';
    }
    isDevelopment() {
        return process.env.NODE_ENV === 'development';
    }
}
exports.Config = Config;
