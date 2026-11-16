# User Management System

> A full-stack MVC application built with Node.js, Express, MongoDB, and EJS for user onboarding, search, and account management.

![Node.js](https://img.shields.io/badge/Node.js-18+-43853D?style=flat&logo=node.js&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-3--Layer-blue?style=flat)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/View_Engine-EJS-B4CA65?style=flat)

---

## 📌 Overview

The **User Management System** is a modular web application designed to handle customer registration, profile lookups, account status updates, and lifecycle management. It strictly adheres to the **3-Layer Architecture pattern** (`Web Layer → Service Layer → DB Layer`) using singleton configuration, static registry factories (`ServiceFactory`, `DBManagerFactory`), abstract interfaces, encapsulated domain models, and request/response DTOs.

---

## ✨ Features

- **🔐 User Login & Verification**: Authenticate users using phone number and credentials against active database records.
- **📝 User Registration**: Onboard new users with personal info (phone, email, date of birth) and detailed address properties (city, district, state, country).
- **🔍 Quick Search**: Search and view detailed customer profiles instantly by phone number.
- **👥 Customer Directory**: View an aggregated list of all active users and their associated profile details via MongoDB `$lookup` aggregation pipelines.
- **✏️ Profile Management**: Update existing customer contact information, passwords, and regional address details.
- **🚫 Account Blocking & Soft Deletion**: Toggle user account access (block/unblock) and perform soft deletions while preserving data integrity.

---

## 🏗️ Architecture & Project Structure

The project follows the strict 3-Layer Architecture specified in `fdf/.agents`:

```text
src/
├── server.js                        # Bootstrap & HTTP server listener
├── app.js                           # Composition root (wires DB, factories, routes)
├── logs.js                          # Unified application logger
├── config/
│   ├── Config.js                    # Singleton config (reads active environment)
│   ├── development.js               # Dev environment configuration
│   └── production.js                # Prod environment configuration
├── common/
│   └── utils/
│       ├── Constants.js             # Global constants & enums
│       └── Utility.js               # Helper utility functions
├── web-layer/
│   ├── controllers/
│   │   └── UserController.js        # Controller route handlers & view rendering
│   ├── middlewares/
│   │   ├── AuthorizationMiddleware.js
│   │   └── ErrorHandler.js          # Central error handling middleware
│   └── models/
│       ├── request/
│       │   ├── CreateUserRequest.js # Request DTO for registration
│       │   └── UpdateUserRequest.js # Request DTO for updates
│       └── response/
│           └── UserResponse.js      # Response DTO (safe for views & JSON)
├── service-layer/
│   ├── ServiceFactory.js            # Registry factory for business services
│   ├── interfaces/
│   │   └── IUserService.js          # Service layer contract
│   ├── implementations/
│   │   └── UserService.js           # Domain business logic implementation
│   └── models/
│       └── User.js                  # Domain model with private fields & getters
├── db-layer/
│   ├── DataAccessLayerFactory.js    # Registry factory for DB managers
│   ├── MongoDBManager.js            # MongoDB Mongoose connection manager
│   ├── interfaces/
│   │   └── IUserDBManager.js        # Database manager contract
│   ├── implementations/
│   │   └── MongoUserDBManager.js    # Mongo DB implementation (maps docs to domain model)
│   └── schemas/
│       └── UserSchema.js            # Mongoose schemas (User & UserDetails)
├── partials/                        # Reusable EJS components (Navigation bar)
│   └── nav.ejs
└── views/                           # EJS UI templates
    ├── addUser.ejs                  # User registration form
    ├── allUsers.ejs                 # All active customers list
    ├── login.ejs                    # User login screen
    ├── updateUser.ejs               # Update user credentials & address
    ├── user.ejs                     # Single user profile view
    └── usersList.ejs                # Search results view
```

### Layer Rules:
```
Web Layer  →  Service Layer  →  DB Layer
```
1. **Web Layer**: Talks **only** to the Service Layer via `ServiceFactory.getUserService()`. Uses Request DTOs to parse input and maps domain models to `UserResponse`.
2. **Service Layer**: Talks **only** to the DB Layer via `DBManagerFactory.getUserDBManager()`. Operates strictly on domain model `User` with private fields.
3. **DB Layer**: Executes MongoDB queries and aggregations. Converted via `#toModel()` to return domain model instances—never leaks raw Mongoose documents.
4. **App Composition Root (`app.js`)**: The only file that instantiates DB managers and services, registering them into `DBManagerFactory` and `ServiceFactory`.

---

## 🛠️ Tech Stack

- **Runtime Environment**: [Node.js](https://nodejs.org/) (CommonJS, Node 18+)
- **Web Framework**: [Express.js](https://expressjs.com/)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **View Engine**: [EJS (Embedded JavaScript Templates)](https://ejs.co/)
- **Middleware**: `body-parser`, `express-async-handler`

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on default port `27017`

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd backendCode
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database & Environment Configuration

The application connects to MongoDB using `MongoDBManager` in `src/db-layer/MongoDBManager.js` driven by `Config`.

- **Default Database**: `mongodb://127.0.0.1:27017/task15`
- **Default Port**: `7500`

If you are using environment variables, you can create a `.env` file in the root directory:

```env
PORT=7500
MONGO_URI=mongodb://127.0.0.1:27017/task15
```

### 4. Run the Application

#### Development Mode (with hot reloading via nodemon):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

Once started, open your browser and navigate to:
```text
http://localhost:7500
```

---

## 🗄️ Data Model Overview

The database uses a referenced two-collection schema design:

- **`User` Collection**: Stores access credentials, status flag, and a reference ID:
  - `phone_no` (String)
  - `pass` (String)
  - `status` (Boolean) - Soft-delete flag
  - `ref_id` (ObjectId, ref: `UserDetails`)
- **`UserDetails` Collection**: Stores profile and location details:
  - `email` (String)
  - `DOB` (String)
  - `block` (Boolean) - Account active/blocked toggle
  - `address` (Object: `city`, `district`, `state`, `country`)

