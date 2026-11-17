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
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const class_validator_1 = require("class-validator");
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
const routing_controllers_1 = require("routing-controllers");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const swaggerUi = __importStar(require("swagger-ui-express"));
const app_1 = require("./app");
const Config_1 = require("./config/Config");
const logs_1 = require("./logs");
const port = Config_1.Config.getInstance().getPort();
try {
    const backendApp = new app_1.App();
    const app = backendApp.app;
    handleSwaggerCodeGenerator(backendApp);
    app.listen(port, () => {
        logs_1.logger.info(`Express server listening on port ${port}`);
        logs_1.logger.info(`Swagger UI available at http://localhost:${port}/swagger`);
    });
}
catch (error) {
    const err = error;
    logs_1.logger.error('SERVER.TS caught exception while starting app: %s', err.message);
    throw error;
}
function handleSwaggerCodeGenerator(backendApp) {
    const app = backendApp.app;
    // Parse class-validator classes into JSON Schema
    const metadata = (0, class_validator_1.getFromContainer)(class_validator_1.MetadataStorage).validationMetadatas;
    const schemas = (0, class_validator_jsonschema_1.validationMetadatasToSchemas)(metadata);
    // Parse routing-controllers classes into OpenAPI spec
    const storage = (0, routing_controllers_1.getMetadataArgsStorage)();
    const spec = (0, routing_controllers_openapi_1.routingControllersToSpec)(storage, backendApp.getRoutingControllersOptions(), {
        components: {
            schemas: schemas,
            securitySchemes: {
                bearerAuth: {
                    scheme: 'bearer',
                    type: 'http',
                    bearerFormat: 'JWT',
                },
            },
        },
        info: {
            description: 'User Management System REST API documentation',
            title: 'User Management API',
            version: '1.0.0',
        },
    });
    // Swagger spec JSON file
    app.get('/swagger/v1/swagger.json', (_req, res) => {
        res.json(spec);
    });
    // Interactive Swagger UI
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(spec));
}
