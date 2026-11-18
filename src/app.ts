import 'reflect-metadata'
import 'class-transformer'
import * as path from 'path'
import express from 'express'
import cors from 'cors'
import { useExpressServer, RoutingControllersOptions } from 'routing-controllers'
import { Config } from './config/Config'
import { logger } from './logs'
import { MongoDBManager } from './db-layer/MongoDBManager'
import { DataAccessLayerFactory } from './db-layer/DataAccessLayerFactory'
import { MongoUserDBManager } from './db-layer/implementations/MongoUserDBManager'
import { ServiceFactory } from './service-layer/ServiceFactory'
import { UserService } from './service-layer/implementations/UserService'
import { UserController } from './web-layer/controllers/UserController'
import { mountWebRoutes } from './web-layer/controllers/WebViewController'
import { CustomErrorHandler } from './web-layer/middlewares/CustomErrorHandler'
import { AuthorizationChecker } from './web-layer/middlewares/AuthorizationChecker'
import { Constants } from './common/utils/Constants'

export class App {
  public app: express.Application
  private routingControllersOptions: RoutingControllersOptions

  constructor() {
    this.app = express()
    this.setup()
    this.config()
  }

  private setup(): void {
    const mongoUrl = Config.getInstance().getMongoUrl()
    logger.info('Initializing MongoDB connection: %s', mongoUrl)
    new MongoDBManager(mongoUrl).connect()
    DataAccessLayerFactory.setUserDBManager(new MongoUserDBManager())
    ServiceFactory.setUserService(new UserService())
  }

  private config(): void {
    this.app.use(express.json({ limit: '1mb' }))
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cors())
    this.app.set('view engine', 'ejs')
    this.app.set('views', path.join(process.cwd(), 'src/views'))
    mountWebRoutes(this.app)
    const authChecker = new AuthorizationChecker()
    this.routingControllersOptions = {
      cors: true,
      routePrefix: Constants.ROUTER_PREFIX,
      controllers: [UserController],
      middlewares: [CustomErrorHandler],
      defaultErrorHandler: false,
      validation: {
        whitelist: false,
        skipMissingProperties: true,
      },
      authorizationChecker: authChecker.check.bind(authChecker),
      currentUserChecker: authChecker.getCurrentUserClaims.bind(authChecker),
    }
    useExpressServer(this.app, this.routingControllersOptions)
  }

  public getRoutingControllersOptions(): RoutingControllersOptions {
    return this.routingControllersOptions
  }
}
