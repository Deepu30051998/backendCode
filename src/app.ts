import 'reflect-metadata';
import 'class-transformer';
import * as path from 'path';
import * as express from 'express';
import cors from 'cors';
import { useExpressServer, RoutingControllersOptions } from 'routing-controllers';

import { Config } from './config/Config';
import { logger } from './logs';

// DB Layer imports
import { MongoDBManager } from './db-layer/MongoDBManager';
import { DataAccessLayerFactory } from './db-layer/DataAccessLayerFactory';
import { MongoUserDBManager } from './db-layer/implementations/MongoUserDBManager';

// Service Layer imports
import { ServiceFactory } from './service-layer/ServiceFactory';
import { UserService } from './service-layer/implementations/UserService';

// Web Layer imports
import { UserController } from './web-layer/controllers/UserController';
import { mountWebRoutes } from './web-layer/controllers/WebViewController';
import { CustomErrorHandler } from './web-layer/middlewares/CustomErrorHandler';
import { AuthorizationChecker } from './web-layer/middlewares/AuthorizationChecker';

export class App {
  public app: express.Application;
  private routingControllersOptions: RoutingControllersOptions;

  constructor() {
    this.app = express();
    this.setup();
    this.config();
  }

  private setup(): void {
    const mongoUrl = Config.getInstance().getMongoUrl();
    logger.info('Initializing MongoDB connection: %s', mongoUrl);
    new MongoDBManager(mongoUrl).connect();

    // Register DB Managers into Factory
    DataAccessLayerFactory.setUserDBManager(new MongoUserDBManager());

    // Register Services into Factory
    ServiceFactory.setUserService(new UserService());
  }

  private config(): void {
    this.app.use(express.json({ limit: '1mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());

    // Configure EJS view engine for existing web templates
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(process.cwd(), 'src/views'));

    // Mount legacy web view routes
    mountWebRoutes(this.app);

    // Setup routing-controllers for REST API
    const authChecker = new AuthorizationChecker();
    this.routingControllersOptions = {
      cors: true,
      routePrefix: '/',
      controllers: [UserController],
      middlewares: [CustomErrorHandler],
      defaultErrorHandler: false,
      validation: {
        whitelist: true,
        skipMissingProperties: false,
      },
      authorizationChecker: authChecker.check.bind(authChecker),
      currentUserChecker: authChecker.getCurrentUserClaims.bind(authChecker),
    };

    useExpressServer(this.app, this.routingControllersOptions);
  }

  public getRoutingControllersOptions(): RoutingControllersOptions {
    return this.routingControllersOptions;
  }
}
