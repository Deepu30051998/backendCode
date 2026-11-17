# User Management System

> Enterprise-grade User Management System built with TypeScript, Node.js, Express, routing-controllers, MongoDB (Mongoose), and EJS, mirroring the PMS 3-Layer architecture.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-43853D?style=flat&logo=node.js&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-3--Layer-blue?style=flat)
![routing-controllers](https://img.shields.io/badge/routing--controllers-0.11-green?style=flat)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-brightgreen?style=flat&logo=swagger)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)

---

## 📌 Overview

The **User Management System** is built following the enterprise **3-Layer Architecture pattern** (`Web Layer → Service Layer → DB Layer`) established in `pms-backend`. It uses:
- **TypeScript** with strict type declarations and decorators (`@JsonController`, `@Get`, `@Post`, `@Put`, `@Delete`, `@Body`, `@QueryParam`, `@Authorized`).
- **Data Validation & DTOs**: `class-validator` and `class-transformer` for strict runtime request validation.
- **Interactive API Documentation**: Automatic OpenAPI specification generation at `/swagger/v1/swagger.json` and interactive Swagger UI at `/swagger`.
- **Hybrid View Support**: Supports both high-performance JSON REST endpoints and legacy EJS server-rendered templates (`views/`).

---

## 🏗️ Architecture & Project Structure

```text
backendCode/
├── .gitignore
├── nodemon.json                     # Hot reload configuration for compiled output
├── package.json                     # Dependencies & build scripts
├── tsconfig.json                    # TypeScript compiler options
├── README.md
├── dist/                            # Compiled JavaScript output
└── src/
    ├── server.ts                    # Bootstrap, Swagger UI setup & server listener
    ├── app.ts                       # Composition root (wires DB, factories, routing-controllers)
    ├── logs.ts                      # Winston application logger
    ├── config/
    │   ├── Config.ts                # Singleton config manager
    │   ├── development.ts           # Development configuration
    │   └── production.ts            # Production configuration
    ├── common/
    │   └── utils/
    │       ├── Constants.ts         # Route prefixes, header constants
    │       └── Utility.ts           # Helper utilities
    ├── web-layer/
    │   ├── controllers/
    │   │   ├── UserController.ts    # @JsonController REST API endpoints
    │   │   └── WebViewController.ts # EJS view rendering controller
    │   ├── middlewares/
    │   │   ├── AuthorizationChecker.ts # JWT token verification & claim extraction
    │   │   └── CustomErrorHandler.ts   # Global error handling middleware
    │   └── models/
    │       ├── request/
    │       │   ├── CreateUserRequest.ts # DTO with class-validator decorators
    │       │   ├── UpdateUserRequest.ts # DTO with class-validator decorators
    │       │   └── LoginRequest.ts      # Credentials DTO
    │       └── response/
    │           ├── ApiResponse.ts       # Standardized response envelope
    │           └── UserResponse.ts      # Public response DTO
    ├── service-layer/
    │   ├── ServiceFactory.ts        # Static registry factory for business services
    │   ├── interfaces/
    │   │   └── IUserService.ts      # Service layer contract
    │   ├── implementations/
    │   │   └── UserService.ts       # Domain business logic implementation
    │   └── models/
    │       └── User.ts              # Domain model
    ├── db-layer/
    │   ├── DataAccessLayerFactory.ts # Static registry factory for DB managers
    │   ├── MongoDBManager.ts        # MongoDB Mongoose connection manager
    │   ├── interfaces/
    │   │   └── IUserDBManager.ts    # Database manager contract
    │   ├── implementations/
    │   │   └── MongoUserDBManager.ts# Mongoose queries & doc-to-model mapping
    │   └── schemas/
    │       └── UserSchema.ts        # Mongoose schemas (User & UserDetails)
    ├── partials/                    # EJS partials (nav.ejs)
    └── views/                       # EJS UI templates
```

### Layer Flow Rules:
$$\text{Web Layer} \longrightarrow \text{Service Layer} \longrightarrow \text{DB Layer}$$
1. **Web Layer**: Talks **only** to the Service Layer via `ServiceFactory.getUserService()`.
2. **Service Layer**: Talks **only** to the DB Layer via `DataAccessLayerFactory.getUserDBManager()`. Operates on domain models (`User`).
3. **DB Layer**: Executes queries against MongoDB and returns domain model instances via `toModel()`. Never leaks raw Mongoose documents to upper layers.
4. **App Composition Root (`app.ts`)**: Initializes DB managers into `DataAccessLayerFactory` and services into `ServiceFactory`.

---

## 🚀 Getting Started

### 1. Build & Run
```bash
# Compile TypeScript to dist/
npm run build

# Start production server
npm run prod

# Or run live development mode (concurrently watches TypeScript and reloads with nodemon)
npm run dev
```

### 2. Swagger Documentation
Once the server is running, visit:
- **Swagger UI**: [http://localhost:7500/swagger](http://localhost:7500/swagger)
- **OpenAPI JSON Spec**: [http://localhost:7500/swagger/v1/swagger.json](http://localhost:7500/swagger/v1/swagger.json)
