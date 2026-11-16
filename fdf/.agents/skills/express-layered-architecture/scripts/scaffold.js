#!/usr/bin/env node
/**
 * scaffold.js
 * Usage: node .agents/skills/express-layered-architecture/scripts/scaffold.js <DomainName>
 * Example: node scaffold.js Order
 *
 * Creates all 9 files for a new domain following the 3-layer architecture.
 */

const fs = require('fs');
const path = require('path');

const domain = process.argv[2];
if (!domain) {
  console.error('Usage: node scaffold.js <DomainName>  (e.g. node scaffold.js Order)');
  process.exit(1);
}

const D = domain;                        // e.g. "Order"
const d = domain.charAt(0).toLowerCase() + domain.slice(1); // e.g. "order"

const SRC = path.resolve(process.cwd(), 'src');

const files = [
  // ── DB LAYER ──────────────────────────────────────────────────────────────
  {
    path: `db-layer/schemas/${D}Schema.js`,
    content: `const mongoose = require('mongoose');

const ${d}Schema = new mongoose.Schema({
  // TODO: define fields
}, { timestamps: true });

module.exports = { ${D}Schema: mongoose.model('${D}', ${d}Schema) };
`
  },
  {
    path: `db-layer/interfaces/I${D}DBManager.js`,
    content: `class I${D}DBManager {
  async save(data)       { throw new Error('Not implemented'); }
  async findById(id)     { throw new Error('Not implemented'); }
  async findAll()        { throw new Error('Not implemented'); }
  async deleteById(id)   { throw new Error('Not implemented'); }
}

module.exports = { I${D}DBManager };
`
  },
  {
    path: `db-layer/implementations/Mongo${D}DBManager.js`,
    content: `const { ${D}Schema } = require('../schemas/${D}Schema');
const { ${D} } = require('../../service-layer/models/${D}');

class Mongo${D}DBManager {
  async save(data) {
    const doc = await ${D}Schema.create(data);
    return this.#toModel(doc);
  }

  async findById(id) {
    const doc = await ${D}Schema.findById(id).lean();
    return doc ? this.#toModel(doc) : null;
  }

  async findAll() {
    const docs = await ${D}Schema.find({}).lean();
    return docs.map(d => this.#toModel(d));
  }

  async deleteById(id) {
    await ${D}Schema.findByIdAndDelete(id);
  }

  #toModel(doc) {
    return new ${D}({
      id:        doc._id.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      // TODO: map remaining fields
    });
  }
}

module.exports = { Mongo${D}DBManager };
`
  },

  // ── SERVICE LAYER ─────────────────────────────────────────────────────────
  {
    path: `service-layer/models/${D}.js`,
    content: `class ${D} {
  #id; #createdAt; #updatedAt;
  // TODO: add private fields

  constructor({ id, createdAt, updatedAt }) {
    this.#id        = id;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
    // TODO: assign remaining fields
  }

  getId()         { return this.#id; }
  getCreatedAt()  { return this.#createdAt; }
  getUpdatedAt()  { return this.#updatedAt; }
  // TODO: add getters/setters for remaining fields
}

module.exports = { ${D} };
`
  },
  {
    path: `service-layer/interfaces/I${D}Service.js`,
    content: `class I${D}Service {
  async create(data)    { throw new Error('Not implemented'); }
  async getById(id)     { throw new Error('Not implemented'); }
  async getAll()        { throw new Error('Not implemented'); }
  async deleteById(id)  { throw new Error('Not implemented'); }
}

module.exports = { I${D}Service };
`
  },
  {
    path: `service-layer/implementations/${D}Service.js`,
    content: `const { DBManagerFactory } = require('../../db-layer/DataAccessLayerFactory');

class ${D}Service {
  #${d}DBManager;

  constructor() {
    this.#${d}DBManager = DBManagerFactory.get${D}DBManager();
  }

  async create(data) {
    // TODO: add business logic / validation
    return await this.#${d}DBManager.save(data);
  }

  async getById(id) {
    const item = await this.#${d}DBManager.findById(id);
    if (!item) throw Object.assign(new Error('${D} not found'), { status: 404 });
    return item;
  }

  async getAll() {
    return await this.#${d}DBManager.findAll();
  }

  async deleteById(id) {
    await this.#${d}DBManager.deleteById(id);
  }
}

module.exports = { ${D}Service };
`
  },

  // ── WEB LAYER ─────────────────────────────────────────────────────────────
  {
    path: `web-layer/models/request/Create${D}Request.js`,
    content: `class Create${D}Request {
  constructor(body) {
    // TODO: destructure and assign fields from body
    // this.name = body.name;
  }
}

module.exports = { Create${D}Request };
`
  },
  {
    path: `web-layer/models/response/${D}Response.js`,
    content: `class ${D}Response {
  constructor(item) {
    this.id        = item.getId();
    this.createdAt = item.getCreatedAt();
    // TODO: map remaining fields from domain model getters
  }
}

module.exports = { ${D}Response };
`
  },
  {
    path: `web-layer/controllers/${D}Controller.js`,
    content: `const { ServiceFactory } = require('../../service-layer/ServiceFactory');
const { Create${D}Request } = require('../models/request/Create${D}Request');
const { ${D}Response } = require('../models/response/${D}Response');
const { authMiddleware } = require('../middlewares/AuthorizationMiddleware');

class ${D}Controller {
  #${d}Service;

  constructor() {
    this.#${d}Service = ServiceFactory.get${D}Service();
  }

  async create(req, res, next) {
    try {
      const request = new Create${D}Request(req.body);
      const item = await this.#${d}Service.create(request);
      res.status(201).json(new ${D}Response(item));
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const item = await this.#${d}Service.getById(req.params.id);
      res.json(new ${D}Response(item));
    } catch (err) { next(err); }
  }

  async getAll(req, res, next) {
    try {
      const items = await this.#${d}Service.getAll();
      res.json(items.map(i => new ${D}Response(i)));
    } catch (err) { next(err); }
  }

  async deleteById(req, res, next) {
    try {
      await this.#${d}Service.deleteById(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  }
}

function mount${D}Routes(app) {
  const ctrl = new ${D}Controller();
  app.post('/api/${d}s',         authMiddleware, (q, r, n) => ctrl.create(q, r, n));
  app.get('/api/${d}s',          authMiddleware, (q, r, n) => ctrl.getAll(q, r, n));
  app.get('/api/${d}s/:id',      authMiddleware, (q, r, n) => ctrl.getById(q, r, n));
  app.delete('/api/${d}s/:id',   authMiddleware, (q, r, n) => ctrl.deleteById(q, r, n));
}

module.exports = { mount${D}Routes };
`
  }
];

// ── Write all files ──────────────────────────────────────────────────────────
let created = 0;
for (const file of files) {
  const fullPath = path.join(SRC, file.path);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(fullPath)) {
    console.log(`  [SKIP] Already exists: src/${file.path}`);
  } else {
    fs.writeFileSync(fullPath, file.content, 'utf8');
    console.log(`  [CREATE] src/${file.path}`);
    created++;
  }
}

console.log(`\n✅ Scaffolded ${created} file(s) for domain "${D}".`);
console.log('\nNext steps:');
console.log(`  1. Add fields to src/db-layer/schemas/${D}Schema.js`);
console.log(`  2. Add fields to src/service-layer/models/${D}.js`);
console.log(`  3. Map fields in Mongo${D}DBManager.js → #toModel()`);
console.log(`  4. Add business logic in ${D}Service.js`);
console.log(`  5. In src/app.js → setup(), add:`);
console.log(`       DBManagerFactory.set${D}DBManager(new Mongo${D}DBManager());`);
console.log(`       ServiceFactory.set${D}Service(new ${D}Service());`);
console.log(`  6. In src/app.js → config(), add:`);
console.log(`       mount${D}Routes(this.app);`);

