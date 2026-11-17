"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.production = void 0;
exports.production = {
    app: {
        port: 7500
    },
    mongodb: {
        url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/task15'
    },
    authentication: {
        secretKey: process.env.JWT_SECRET || 'prod-secret-jwt-key',
        tokenExpiryInSecs: 43200
    }
};
