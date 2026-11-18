# User Management System

> Enterprise-grade User Management REST API built with TypeScript, Node.js, Express, routing-controllers, and MongoDB (Mongoose).

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-43853D?style=flat&logo=node.js&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-3--Layer-blue?style=flat)
![routing-controllers](https://img.shields.io/badge/routing--controllers-0.11-green?style=flat)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-brightgreen?style=flat&logo=swagger)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)

---

## 📌 Overview

The **User Management System** is a pure JSON REST API backend built in accordance with the enterprise **3-Layer Architecture pattern** (`Web Layer → Service Layer → DB Layer`):

- **TypeScript Decorators**: Fully typed controllers powered by `routing-controllers` (`@JsonController`, `@Get`, `@Post`, `@Body`, `@QueryParam`, `@Param`).
- **Data Validation & DTOs**: Strict request validation using `class-validator` and `class-transformer`.
- **OpenAPI & Swagger Documentation**: Automatically generated OpenAPI 3.0 specification available at `/swagger/v1/swagger.json` with an interactive Swagger UI at `/swagger`.(`id`, `status: ObjectStatus`, `createdAt`, `lastModifiedAt`) via `ServiceObject`.
- **Single MongoDB Collection**: Unified `users` collection storing user credentials, lifecycle status, profile, and embedded address information.

---

## 🏗️ Architecture & Project Structure

```text
backendCode/
├── .gitignore
├── nodemon.json                          # Hot-reload configuration for compiled output
├── package.json                          # Dependencies & scripts
├── tsconfig.json                         # TypeScript compiler configuration
├── README.md                             # Project documentation
├── dist/                                 # Compiled JavaScript output
└── src/
    ├── server.ts                         # Bootstrap, Swagger UI setup & server listener
    ├── app.ts                            # Composition root (wires DB, factories, routing-controllers)
    ├── logs.ts                           # Winston application logger
    ├── config/
    │   ├── Config.ts                     # Singleton configuration manager
    │   ├── development.ts                # Development configuration
    │   └── production.ts                 # Production configuration
    ├── common/
    │   └── utils/
    │       ├── Constants.ts              # Route prefixes & constants
    │       └── Utility.ts                # Model mapping & enum parsing utilities
    ├── web-layer/
    │   ├── controllers/
    │   │   └── UserController.ts         # @JsonController REST API endpoints
    │   ├── middlewares/
    │   │   ├── AuthorizationChecker.ts   # JWT token extraction & verification
    │   │   └── CustomErrorHandler.ts     # Global exception handler
    │   └── models/
    │       ├── request/
    │       │   └── UserRequestModel.ts   # Request DTO (phone, pass, profile, address)
    │       └── response/
    │           ├── ApiResponse.ts        # Standardized API response envelope
    │           └── UserResponse.ts       # Public response DTO
    ├── service-layer/
    │   ├── ServiceFactory.ts             # Static registry factory for business services
    │   ├── interfaces/
    │   │   └── IUserService.ts           # Service layer interface contract
    │   ├── implementations/
    │   │   └── UserService.ts            # Domain business logic implementation
    │   └── models/
    │       ├── User.ts                   # Domain User & Address models
    │       ├── ServiceObject.ts          # Base class with id, status, timestamps
    │       └── ObjectStatus.ts           # Lifecycle status enum (Active, Disabled, Inactive, etc.)
    └── db-layer/
        ├── DataAccessLayerFactory.ts     # Static registry factory for DB managers
        ├── MongoDBManager.ts             # Mongoose connection lifecycle manager
        ├── interfaces/
        │   └── IUserDBManager.ts         # Database manager interface contract
        ├── implementations/
        │   └── MongoUserDBManager.ts     # MongoDB query implementation
        └── models/
            ├── DBConstant.ts             # Database collection constants
            └── DBUserSchema.ts           # Mongoose single-collection User schema
```

### Layer Flow Rules:
$$\text{Web Layer} \longrightarrow \text{Service Layer} \longrightarrow \text{DB Layer}$$

1. **Web Layer**: Interacts **only** with the Service Layer via `ServiceFactory.getUserService()`.
2. **Service Layer**: Interacts **only** with the DB Layer via `DataAccessLayerFactory.getUserDBManager()`. Operates on typed domain models (`User`).
3. **DB Layer**: Executes queries against MongoDB and returns domain model instances mapped via `Utility.getUser()`. Never exposes raw Mongoose documents to upper layers.
4. **App Composition Root (`app.ts`)**: Registers singletons into `DataAccessLayerFactory` and `ServiceFactory`.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally or via MongoDB Atlas

### 2. Environment Setup
Configure your database connection in `.env`:
```env
PORT=7500
NODE_ENV=development
MONGO_URL=""
JWT_SECRET=dev-secret-jwt-key
```

### 3. Build & Run
```bash
# Install dependencies
npm install

# Compile TypeScript to dist/
npm run build

# Start production server
npm run prod

# Or start development mode with hot-reloading
npm run dev
```

### 4. Interactive Swagger Documentation
Once the server starts, open your browser:
- **Swagger UI**: [http://localhost:7500/swagger](http://localhost:7500/swagger)
- **OpenAPI JSON Spec**: [http://localhost:7500/swagger/v1/swagger.json](http://localhost:7500/swagger/v1/swagger.json)
