const { development } = require("./development");
const { production } = require("./production");

class Config {
  static #instance;

  #port;
  #mongoUrl;
  #jwtSecret;
  #jwtExpirySeconds;

  constructor() {
    const env = process.env.NODE_ENV || "development";
    const data = env === "production" ? production : development;
    this.#port = parseInt(process.env.PORT || data.app.port || 7500, 10);
    this.#mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI || data.mongodb.url;
    this.#jwtSecret = process.env.JWT_SECRET || data.authentication.secretKey;
    this.#jwtExpirySeconds = parseInt(
      process.env.JWT_EXPIRY || data.authentication.tokenExpiryInSecs || 43200,
      10
    );
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new Config();
    }
    return this.#instance;
  }

  getPort() {
    return this.#port;
  }

  getMongoUrl() {
    return this.#mongoUrl;
  }

  getJwtSecret() {
    return this.#jwtSecret;
  }

  getJwtExpiry() {
    return this.#jwtExpirySeconds;
  }

  isProduction() {
    return process.env.NODE_ENV === "production";
  }

  isDevelopment() {
    return process.env.NODE_ENV === "development";
  }
}

module.exports = { Config };

