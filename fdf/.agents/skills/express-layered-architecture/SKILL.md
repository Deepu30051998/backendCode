---
name: express-layered-architecture
description: >-
  Use this skill when the user asks to scaffold, implement, or set up a new
  Express.js + MongoDB backend project following the 3-layer architecture
  (Web Layer → Service Layer → DB Layer) with ServiceFactory, DBManagerFactory,
  Config Singleton, JWT auth, and RBAC. Also use it when adding a new domain/feature
  to an existing project that follows this architecture.
---

# Express Layered Architecture Skill

This skill teaches you how to scaffold and implement a Node.js + Express.js + MongoDB
backend using a strict 3-layer architecture pattern. Read the full reference before writing any code.

## Architecture Reference

Read this file first — it contains the complete pattern with code examples:
[Full Architecture Reference](./references/architecture.md)

---

## How to Implement

### Step 1 — Understand the Request

Ask yourself (or the user):
- Are we **scaffolding a brand new project** from scratch?
- Or are we **adding a new domain/feature** to an existing project?

### Step 2 — Scaffold a New Project

If starting from scratch, create this folder structure **exactly**:

```
src/
├── server.js
├── app.js
├── logs.js
├── config/
│   ├── Config.js
│   ├── development.js
│   └── production.js
├── common/
│   └── utils/
│       ├── Constants.js
│       └── Utility.js
├── web-layer/
│   ├── controllers/
│   ├── middlewares/
│   │   ├── AuthorizationMiddleware.js
│   │   └── ErrorHandler.js
│   └── models/
│       ├── request/
│       └── response/
├── service-layer/
│   ├── ServiceFactory.js
│   ├── interfaces/
│   ├── implementations/
│   └── models/
└── db-layer/
    ├── DataAccessLayerFactory.js
    ├── MongoDBManager.js
    ├── interfaces/
    ├── implementations/
    └── schemas/
```

Then wire in this order inside `app.js`:
1. Connect MongoDB
2. Register DB managers (`DBManagerFactory.set...`)
3. Register services (`ServiceFactory.set...`)
4. Configure Express middleware
5. Mount controller routes

### Step 3 — Add a New Domain / Feature

For every new domain (e.g., `Order`, `User`, `Product`), create these files **in this order**:

1. `db-layer/schemas/<Domain>Schema.js` — Mongoose schema
2. `db-layer/interfaces/I<Domain>DBManager.js` — DB interface
3. `db-layer/implementations/Mongo<Domain>DBManager.js` — Mongo implementation
4. `service-layer/models/<Domain>.js` — Domain model class
5. `service-layer/interfaces/I<Domain>Service.js` — Service interface
6. `service-layer/implementations/<Domain>Service.js` — Business logic
7. `web-layer/models/request/Create<Domain>Request.js` — Request DTO
8. `web-layer/models/response/<Domain>Response.js` — Response DTO
9. `web-layer/controllers/<Domain>Controller.js` — Route handler

Then register in `app.js`:
```js
DBManagerFactory.set<Domain>DBManager(new Mongo<Domain>DBManager());
ServiceFactory.set<Domain>Service(new <Domain>Service());
```
And mount the router in `app.js → config()`.

### Step 4 — Verify Structure

After implementing, check:
- [ ] No controller directly imports a DB manager or Mongoose schema
- [ ] No service does `new SomeDBManager()` inside a method (only in `app.js`)
- [ ] All DB manager methods return domain model instances, never raw Mongoose docs
- [ ] `Config.getInstance()` is used everywhere — no raw `process.env` in business code
- [ ] All routes that need auth are wrapped with `authMiddleware`

### Step 5 — Validation

Run the app and confirm:
```bash
node src/server.js
# Should print: Express server listening on port XXXX
```

Test a protected route returns 401 without a token, and 200 with a valid JWT.

