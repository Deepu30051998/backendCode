"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
require("reflect-metadata");
require("class-transformer");
const path = __importStar(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routing_controllers_1 = require("routing-controllers");
const Config_1 = require("./config/Config");
const logs_1 = require("./logs");
const MongoDBManager_1 = require("./db-layer/MongoDBManager");
const DataAccessLayerFactory_1 = require("./db-layer/DataAccessLayerFactory");
const MongoUserDBManager_1 = require("./db-layer/implementations/MongoUserDBManager");
const ServiceFactory_1 = require("./service-layer/ServiceFactory");
const UserService_1 = require("./service-layer/implementations/UserService");
const UserController_1 = require("./web-layer/controllers/UserController");
const WebViewController_1 = require("./web-layer/controllers/WebViewController");
const CustomErrorHandler_1 = require("./web-layer/middlewares/CustomErrorHandler");
const AuthorizationChecker_1 = require("./web-layer/middlewares/AuthorizationChecker");
class App {
    app;
    routingControllersOptions;
    constructor() {
        this.app = (0, express_1.default)();
        this.setup();
        this.config();
    }
    setup() {
        const mongoUrl = Config_1.Config.getInstance().getMongoUrl();
        logs_1.logger.info('Initializing MongoDB connection: %s', mongoUrl);
        new MongoDBManager_1.MongoDBManager(mongoUrl).connect();
        DataAccessLayerFactory_1.DataAccessLayerFactory.setUserDBManager(new MongoUserDBManager_1.MongoUserDBManager());
        ServiceFactory_1.ServiceFactory.setUserService(new UserService_1.UserService());
    }
    config() {
        this.app.use(express_1.default.json({ limit: '1mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)());
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(process.cwd(), 'src/views'));
        (0, WebViewController_1.mountWebRoutes)(this.app);
        const authChecker = new AuthorizationChecker_1.AuthorizationChecker();
        this.routingControllersOptions = {
            cors: true,
            routePrefix: '/',
            controllers: [UserController_1.UserController],
            middlewares: [CustomErrorHandler_1.CustomErrorHandler],
            defaultErrorHandler: false,
            validation: {
                whitelist: true,
                skipMissingProperties: false,
            },
            authorizationChecker: authChecker.check.bind(authChecker),
            currentUserChecker: authChecker.getCurrentUserClaims.bind(authChecker),
        };
        (0, routing_controllers_1.useExpressServer)(this.app, this.routingControllersOptions);
    }
    getRoutingControllersOptions() {
        return this.routingControllersOptions;
    }
}
exports.App = App;
