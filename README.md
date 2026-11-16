# User Management System

> A full-stack MVC application built with Node.js, Express, MongoDB, and EJS for user onboarding, search, and account management.

![Node.js](https://img.shields.io/badge/Node.js-18+-43853D?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/View_Engine-EJS-B4CA65?style=flat)

---

## 📌 Overview

The **User Management System** is a modular web application designed to handle customer registration, profile lookups, account status updates, and lifecycle management. It employs a **Layered Architecture** (Routes &rarr; Controllers &rarr; Services &rarr; Data Access Layer &rarr; Models) to ensure clean separation of concerns, maintainability, and scalability.

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

The project follows a clean layered separation pattern inside the `src/` directory:

```text
backendCode/
├── package.json               # Dependencies and scripts
├── README.md                  # Project documentation
└── src/
    ├── server.js              # Application entry point & server initialization
    ├── connection.js          # MongoDB Mongoose database connection
    ├── controllers/           # HTTP request handlers & view rendering
    │   └── userController.js
    ├── data-access-layer/     # Database queries, aggregates & CRUD operations
    │   └── dblayer.js
    ├── models/                # Mongoose schemas (User & UserDetails)
    │   └── usersData.js
    ├── partials/              # Reusable EJS components (Navigation bar)
    │   └── nav.ejs
    ├── routes/                # Express routing definitions
    │   └── routes.js
    ├── services/              # Business logic layer
    │   └── services.js
    └── views/                 # EJS UI templates
        ├── addUser.ejs        # User registration form
        ├── allUsers.ejs       # All active customers list
        ├── login.ejs          # User login screen
        ├── updateUser.ejs     # Update user credentials & address
        ├── user.ejs           # Single user profile view
        └── usersList.ejs      # Search results view
```

### Layer Flow:
1. **Routes (`src/routes/`)**: Receives incoming requests and routes them to the appropriate controller.
2. **Controllers (`src/controllers/`)**: Parses input, invokes business services, and renders EJS views.
3. **Services (`src/services/`)**: Orchestrates business rules, data preparation, and status checks.
4. **Data Access Layer (`src/data-access-layer/`)**: Executes database queries, aggregations (`$match`, `$lookup`), and updates.
5. **Models (`src/models/`)**: Defines the relational schemas between `User` and `UserDetails`.

---

## 🛠️ Tech Stack

- **Runtime Environment**: [Node.js](https://nodejs.org/)
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

The application connects to MongoDB using the connection utility in `src/connection.js`.

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

