const path = require("path");
const express = require("express");
const { Config } = require("./config/Config");
const { MongoDBManager } = require("./db-layer/MongoDBManager");
const { DBManagerFactory } = require("./db-layer/DataAccessLayerFactory");
const { ServiceFactory } = require("./service-layer/ServiceFactory");

const { MongoUserDBManager } = require("./db-layer/implementations/MongoUserDBManager");

// Service imports
const { UserService } = require("./service-layer/implementations/UserService");

// Controller / route mounts
const { mountUserRoutes } = require("./web-layer/controllers/UserController");

// Middleware
const { errorHandler } = require("./web-layer/middlewares/ErrorHandler");

class App {
  constructor() {
    this.app = express();
    this.setup();
    this.config();
  }

  setup() {
    // 1. Connect to MongoDB
    new MongoDBManager(Config.getInstance().getMongoUrl()).connect();

    // 2. Register DB Managers
    DBManagerFactory.setUserDBManager(new MongoUserDBManager());

    // 3. Register Services
    ServiceFactory.setUserService(new UserService());
  }

  config() {
    this.app.use(express.json({ limit: "1mb" }));
    this.app.use(express.urlencoded({ extended: true }));

    // Views configuration for EJS
    this.app.set("view engine", "ejs");
    this.app.set("views", path.join(__dirname, "views"));

    // Mount routes
    mountUserRoutes(this.app);

    // Error handler MUST be last
    this.app.use(errorHandler);
  }
}

module.exports = { App };

