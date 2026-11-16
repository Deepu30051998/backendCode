const mongoose = require("mongoose");
const { logger } = require("../logs");

class MongoDBManager {
  #url;

  constructor(url) {
    this.#url = url;
  }

  connect() {
    mongoose
      .connect(this.#url)
      .then(() => logger.info("MongoDB connected"))
      .catch((err) => {
        logger.error("MongoDB connection failed", err);
        process.exit(1);
      });
  }
}

module.exports = { MongoDBManager };

