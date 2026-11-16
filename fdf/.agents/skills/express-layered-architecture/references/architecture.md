# Full Architecture Reference

## The 3-Layer Rule

```
Web Layer  →  Service Layer  →  DB Layer
```

- **Web Layer** only talks to **Service Layer** (via `ServiceFactory`)
- **Service Layer** only talks to **DB Layer** (via `DBManagerFactory`)
- **DB Layer** talks to MongoDB and external providers
- **No layer skips another layer. Ever.**

---

## 1. Config Singleton — `src/config/Config.js`

The single source of truth for all environment configuration.
Never call `process.env` directly in controllers, services, or DB managers.

```js
// src/config/Config.js
const { development } = require('./development');
const { production } = require('./production');

class Config {
  static #instance;

  #port;
  #mongoUrl;
  #jwtSecret;
  #jwtExpirySeconds;

  constructor() {
    const env = process.env.NODE_ENV || 'development';
    const data = env === 'production' ? production : development;
    this.#port = parseInt(process.env.PORT || data.app.port || 3000);
    this.#mongoUrl = process.env.MONGO_URL || data.mongodb.url;
    this.#jwtSecret = data.authentication.secretKey;
    this.#jwtExpirySeconds = data.authentication.tokenExpiryInSecs || 43200;
  }

  static getInstance() {
    if (!this.#instance) this.#instance = new Config();
    return this.#instance;
  }

  getPort()             { return this.#port; }
  getMongoUrl()         { return this.#mongoUrl; }
  getJwtSecret()        { return this.#jwtSecret; }
  getJwtExpiry()        { return this.#jwtExpirySeconds; }
  isProduction()        { return process.env.NODE_ENV === 'production'; }
  isDevelopment()       { return process.env.NODE_ENV === 'development'; }
}

module.exports = { Config };
```

```js
// src/config/development.js
module.exports.development = {
  app: { port: 3000 },
  mongodb: { url: 'mongodb://localhost:27017/myapp_dev' },
  authentication: { secretKey: 'dev-secret-key', tokenExpiryInSecs: 43200 }
};
```

```js
// src/config/production.js
module.exports.production = {
  app: { port: 8080 },
  mongodb: { url: '' }, // overridden by MONGO_URL env var
  authentication: { secretKey: '', tokenExpiryInSecs: 43200 } // overridden by env var
};
```

---

## 2. MongoDB Connection — `src/db-layer/MongoDBManager.js`

```js
// src/db-layer/MongoDBManager.js
const mongoose = require('mongoose');
const { logger } = require('../logs');

class MongoDBManager {
  #url;

  constructor(url) {
    this.#url = url;
  }

  connect() {
    mongoose.connect(this.#url)
      .then(() => logger.info('MongoDB connected'))
      .catch(err => { logger.error('MongoDB connection failed', err); process.exit(1); });
  }
}

module.exports = { MongoDBManager };
```

---

## 3. DB Manager Factory — `src/db-layer/DataAccessLayerFactory.js`

One static registry for all DB managers. Only `app.js` calls `set*()`.
Everything else calls `get*()`.

```js
// src/db-layer/DataAccessLayerFactory.js
class DBManagerFactory {
  // Add one static field per domain
  static #orderDBManager;
  static #userDBManager;
  // static #productDBManager;

  static getOrderDBManager()    { return this.#orderDBManager; }
  static setOrderDBManager(mgr) { this.#orderDBManager = mgr; }

  static getUserDBManager()     { return this.#userDBManager; }
  static setUserDBManager(mgr)  { this.#userDBManager = mgr; }

  // Add more as needed...
}

module.exports = { DBManagerFactory };
```

---

## 4. Service Factory — `src/service-layer/ServiceFactory.js`

Same pattern as DBManagerFactory but for services.

```js
// src/service-layer/ServiceFactory.js
class ServiceFactory {
  static #orderService;
  static #authService;
  static #userService;

  static getOrderService()     { return this.#orderService; }
  static setOrderService(svc)  { this.#orderService = svc; }

  static getAuthService()      { return this.#authService; }
  static setAuthService(svc)   { this.#authService = svc; }

  static getUserService()      { return this.#userService; }
  static setUserService(svc)   { this.#userService = svc; }

  // Add more as needed...
}

module.exports = { ServiceFactory };
```

---

## 5. Mongoose Schema (DB Layer)

```js
// src/db-layer/schemas/OrderSchema.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  status:       { type: String, default: 'pending', enum: ['pending', 'confirmed', 'completed', 'cancelled'] },
  total:        { type: Number, required: true },
  items: [{
    name:  { type: String },
    qty:   { type: Number },
    price: { type: Number }
  }]
}, { timestamps: true });

module.exports = { OrderSchema: mongoose.model('Order', orderSchema) };
```

---

## 6. DB Manager Interface (DB Layer)

```js
// src/db-layer/interfaces/IOrderDBManager.js
class IOrderDBManager {
  async save(data)                       { throw new Error('Not implemented'); }
  async findById(id)                     { throw new Error('Not implemented'); }
  async findByRestaurantId(restaurantId) { throw new Error('Not implemented'); }
  async updateStatus(id, status)         { throw new Error('Not implemented'); }
}

module.exports = { IOrderDBManager };
```

---

## 7. Mongo DB Manager Implementation (DB Layer)

**Key rule:** Always convert Mongoose documents → Domain models using a `#toModel()` method.
Never return a raw Mongoose doc to the service layer.

```js
// src/db-layer/implementations/MongoOrderDBManager.js
const { OrderSchema } = require('../schemas/OrderSchema');
const { Order } = require('../../service-layer/models/Order');

class MongoOrderDBManager {
  async save(data) {
    const doc = await OrderSchema.create(data);
    return this.#toModel(doc);
  }

  async findById(id) {
    const doc = await OrderSchema.findById(id).lean();
    return doc ? this.#toModel(doc) : null;
  }

  async findByRestaurantId(restaurantId) {
    const docs = await OrderSchema.find({ restaurantId }).lean();
    return docs.map(d => this.#toModel(d));
  }

  async updateStatus(id, status) {
    const doc = await OrderSchema.findByIdAndUpdate(id, { status }, { new: true }).lean();
    return doc ? this.#toModel(doc) : null;
  }

  #toModel(doc) {
    return new Order({
      id:           doc._id.toString(),
      restaurantId: doc.restaurantId,
      status:       doc.status,
      total:        doc.total,
      items:        doc.items,
      createdAt:    doc.createdAt,
      updatedAt:    doc.updatedAt
    });
  }
}

module.exports = { MongoOrderDBManager };
```

---

## 8. Domain Model (Service Layer)

Use private fields with explicit getters/setters. No public properties.

```js
// src/service-layer/models/Order.js
class Order {
  #id; #restaurantId; #status; #total; #items; #createdAt;

  constructor({ id, restaurantId, status, total, items, createdAt }) {
    this.#id           = id;
    this.#restaurantId = restaurantId;
    this.#status       = status;
    this.#total        = total;
    this.#items        = items;
    this.#createdAt    = createdAt;
  }

  getId()           { return this.#id; }
  getRestaurantId() { return this.#restaurantId; }
  getStatus()       { return this.#status; }
  getTotal()        { return this.#total; }
  getItems()        { return this.#items; }
  getCreatedAt()    { return this.#createdAt; }
  setStatus(s)      { this.#status = s; }
}

module.exports = { Order };
```

---

## 9. Service Interface (Service Layer)

```js
// src/service-layer/interfaces/IOrderService.js
class IOrderService {
  async createOrder(data)           { throw new Error('Not implemented'); }
  async getOrderById(id)            { throw new Error('Not implemented'); }
  async getOrdersByRestaurant(rId)  { throw new Error('Not implemented'); }
  async updateOrderStatus(id, s)    { throw new Error('Not implemented'); }
}

module.exports = { IOrderService };
```

---

## 10. Service Implementation (Service Layer)

```js
// src/service-layer/implementations/OrderService.js
const { DBManagerFactory } = require('../../db-layer/DataAccessLayerFactory');

class OrderService {
  #orderDBManager;

  constructor() {
    this.#orderDBManager = DBManagerFactory.getOrderDBManager();
  }

  async createOrder(data) {
    // Business logic / validation here
    if (!data.restaurantId) throw new Error('restaurantId is required');
    return await this.#orderDBManager.save(data);
  }

  async getOrderById(id) {
    const order = await this.#orderDBManager.findById(id);
    if (!order) throw new Error('Order not found');
    return order;
  }

  async getOrdersByRestaurant(restaurantId) {
    return await this.#orderDBManager.findByRestaurantId(restaurantId);
  }

  async updateOrderStatus(id, status) {
    return await this.#orderDBManager.updateStatus(id, status);
  }
}

module.exports = { OrderService };
```

---

## 11. Request / Response DTOs (Web Layer)

```js
// src/web-layer/models/request/CreateOrderRequest.js
class CreateOrderRequest {
  constructor(body) {
    this.restaurantId = body.restaurantId;
    this.items        = body.items;
    this.tableId      = body.tableId;
  }
}
module.exports = { CreateOrderRequest };
```

```js
// src/web-layer/models/response/OrderResponse.js
class OrderResponse {
  constructor(order) {
    this.id           = order.getId();
    this.restaurantId = order.getRestaurantId();
    this.status       = order.getStatus();
    this.total        = order.getTotal();
    this.items        = order.getItems();
    this.createdAt    = order.getCreatedAt();
  }
}
module.exports = { OrderResponse };
```

---

## 12. Controller (Web Layer)

```js
// src/web-layer/controllers/OrderController.js
const express = require('express');
const { ServiceFactory } = require('../../service-layer/ServiceFactory');
const { CreateOrderRequest } = require('../models/request/CreateOrderRequest');
const { OrderResponse } = require('../models/response/OrderResponse');
const { authMiddleware } = require('../middlewares/AuthorizationMiddleware');

const router = express.Router();

class OrderController {
  #orderService;

  constructor() {
    this.#orderService = ServiceFactory.getOrderService();
  }

  async create(req, res, next) {
    try {
      const request = new CreateOrderRequest(req.body);
      const order = await this.#orderService.createOrder(request);
      res.status(201).json(new OrderResponse(order));
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const order = await this.#orderService.getOrderById(req.params.id);
      res.json(new OrderResponse(order));
    } catch (err) { next(err); }
  }

  async getByRestaurant(req, res, next) {
    try {
      const orders = await this.#orderService.getOrdersByRestaurant(req.params.restaurantId);
      res.json(orders.map(o => new OrderResponse(o)));
    } catch (err) { next(err); }
  }
}

function mountOrderRoutes(app) {
  const ctrl = new OrderController();
  app.post('/api/orders',                           authMiddleware, (q, r, n) => ctrl.create(q, r, n));
  app.get('/api/orders/:id',                        authMiddleware, (q, r, n) => ctrl.getById(q, r, n));
  app.get('/api/orders/restaurant/:restaurantId',   authMiddleware, (q, r, n) => ctrl.getByRestaurant(q, r, n));
}

module.exports = { mountOrderRoutes };
```

---

## 13. Auth Middleware (Web Layer)

```js
// src/web-layer/middlewares/AuthorizationMiddleware.js
const jwt = require('jwt-simple');
const { Config } = require('../../config/Config');
const { ServiceFactory } = require('../../service-layer/ServiceFactory');

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers['authorization'] || req.headers['Authorization'];
    if (!header) return res.status(401).json({ message: 'Authorization header missing' });

    const token = header.replace('Bearer', '').trim();
    const decoded = jwt.decode(token, Config.getInstance().getJwtSecret());

    const user = await ServiceFactory.getAuthService().getUser(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requirePermission(...requiredPerms) {
  return async (req, res, next) => {
    try {
      const perms = await ServiceFactory.getPermissionService()
        .getPermissionsForUser(req.user.getId());
      const hasAccess = requiredPerms.some(p => perms.includes(p));
      if (!hasAccess) return res.status(403).json({ message: 'Forbidden' });
      next();
    } catch (err) { next(err); }
  };
}

module.exports = { authMiddleware, requirePermission };
```

---

## 14. Error Handler Middleware (Web Layer)

```js
// src/web-layer/middlewares/ErrorHandler.js
function errorHandler(err, req, res, next) {
  const status = err.status || err.httpCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}

module.exports = { errorHandler };
```

---

## 15. App Bootstrap — `src/app.js`

This is the **composition root**. It is the ONLY file that:
- Instantiates DB managers
- Instantiates services
- Calls `DBManagerFactory.set*()` and `ServiceFactory.set*()`

```js
// src/app.js
const express = require('express');
const cors = require('cors');
const { Config } = require('./config/Config');
const { MongoDBManager } = require('./db-layer/MongoDBManager');
const { DBManagerFactory } = require('./db-layer/DataAccessLayerFactory');
const { ServiceFactory } = require('./service-layer/ServiceFactory');

// DB Manager imports
const { MongoOrderDBManager } = require('./db-layer/implementations/MongoOrderDBManager');
const { MongoUserDBManager }  = require('./db-layer/implementations/MongoUserDBManager');

// Service imports
const { OrderService } = require('./service-layer/implementations/OrderService');
const { AuthService }  = require('./service-layer/implementations/AuthService');
const { UserService }  = require('./service-layer/implementations/UserService');

// Controller / route mounts
const { mountOrderRoutes } = require('./web-layer/controllers/OrderController');

// Middleware
const { errorHandler } = require('./web-layer/middlewares/ErrorHandler');

class App {
  constructor() {
    this.app = express();
    this.setup();   // Step 1: Wire DB + services
    this.config();  // Step 2: Express middleware + routes
  }

  setup() {
    // 1. Connect to MongoDB
    new MongoDBManager(Config.getInstance().getMongoUrl()).connect();

    // 2. Register DB Managers
    DBManagerFactory.setOrderDBManager(new MongoOrderDBManager());
    DBManagerFactory.setUserDBManager(new MongoUserDBManager());

    // 3. Register Services
    ServiceFactory.setAuthService(new AuthService());
    ServiceFactory.setUserService(new UserService());
    ServiceFactory.setOrderService(new OrderService());
  }

  config() {
    this.app.use(express.json({ limit: '1mb' }));
    this.app.use(cors());

    // Mount routes
    mountOrderRoutes(this.app);

    // Error handler MUST be last
    this.app.use(errorHandler);
  }
}

module.exports = { App };
```

---

## 16. Entry Point — `src/server.js`

```js
// src/server.js
const { App } = require('./app');
const { Config } = require('./config/Config');
const { logger } = require('./logs');

try {
  const { app } = new App();
  const port = Config.getInstance().getPort();
  app.listen(port, () => logger.info(`Server listening on port ${port}`));
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}
```

---

## 17. Logger — `src/logs.js`

```js
// src/logs.js
const winston = require('winston');

exports.logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) =>
      `${timestamp} [${level.toUpperCase()}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`)
  ),
  transports: [new winston.transports.Console()]
});
```

---

## External Provider Pattern

For payment gateways, SMS, WhatsApp, cloud storage — use the same interface + implementation pattern. Register the provider in `DBManagerFactory` (providers live in the DB layer since they deal with I/O).

```js
// db-layer/interfaces/IPaymentProvider.js
class IPaymentProvider {
  async createOrder(amount, currency) { throw new Error('Not implemented'); }
  async verifyPayment(paymentId)      { throw new Error('Not implemented'); }
  async refund(paymentId, amount)     { throw new Error('Not implemented'); }
}
module.exports = { IPaymentProvider };

// db-layer/implementations/RazorpayProvider.js
const Razorpay = require('razorpay');
const { Config } = require('../../config/Config');

class RazorpayProvider {
  #client;
  constructor() {
    this.#client = new Razorpay({
      key_id:     Config.getInstance().getPaymentKey(),
      key_secret: Config.getInstance().getPaymentSecret()
    });
  }
  async createOrder(amount, currency = 'INR') {
    return this.#client.orders.create({ amount: amount * 100, currency });
  }
  async verifyPayment(paymentId) {
    return this.#client.payments.fetch(paymentId);
  }
}
module.exports = { RazorpayProvider };
```

---

## Checklist for a New Domain

For every new feature/domain, create these files:

| # | File | Layer |
|---|------|-------|
| 1 | `db-layer/schemas/<Domain>Schema.js` | DB |
| 2 | `db-layer/interfaces/I<Domain>DBManager.js` | DB |
| 3 | `db-layer/implementations/Mongo<Domain>DBManager.js` | DB |
| 4 | `service-layer/models/<Domain>.js` | Service |
| 5 | `service-layer/interfaces/I<Domain>Service.js` | Service |
| 6 | `service-layer/implementations/<Domain>Service.js` | Service |
| 7 | `web-layer/models/request/Create<Domain>Request.js` | Web |
| 8 | `web-layer/models/response/<Domain>Response.js` | Web |
| 9 | `web-layer/controllers/<Domain>Controller.js` | Web |

Then in `app.js`:
```js
// In setup():
DBManagerFactory.set<Domain>DBManager(new Mongo<Domain>DBManager());
ServiceFactory.set<Domain>Service(new <Domain>Service());

// In config():
mount<Domain>Routes(this.app);
```

