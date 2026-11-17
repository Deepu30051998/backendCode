import 'reflect-metadata';
import { getFromContainer, MetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';

import { App } from './app';
import { Config } from './config/Config';
import { logger } from './logs';

const port = Config.getInstance().getPort();

try {
  const backendApp = new App();
  const app = backendApp.app;

  handleSwaggerCodeGenerator(backendApp);

  app.listen(port, () => {
    logger.info(`Express server listening on port ${port}`);
    logger.info(`Swagger UI available at http://localhost:${port}/swagger`);
  });
} catch (error) {
  const err = error as Error;
  logger.error('SERVER.TS caught exception while starting app: %s', err.message);
  throw error;
}

function handleSwaggerCodeGenerator(backendApp: App): void {
  const app = backendApp.app;

  // Parse class-validator classes into JSON Schema
  const metadata = (getFromContainer(MetadataStorage) as any).validationMetadatas;
  const schemas = validationMetadatasToSchemas(metadata);

  // Parse routing-controllers classes into OpenAPI spec
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(storage, backendApp.getRoutingControllersOptions(), {
    components: {
      schemas: schemas as any,
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
