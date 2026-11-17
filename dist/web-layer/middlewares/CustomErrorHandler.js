"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomErrorHandler = void 0;
const routing_controllers_1 = require("routing-controllers");
const logs_1 = require("../../logs");
let CustomErrorHandler = class CustomErrorHandler {
    error(error, req, res, next) {
        logs_1.logger.error('ErrorHandler', 'Unhandled error occurred: %s', error.message || error);
        const status = error.httpCode || error.status || 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Internal Server Error',
            errors: error.errors || undefined,
        });
    }
};
exports.CustomErrorHandler = CustomErrorHandler;
exports.CustomErrorHandler = CustomErrorHandler = __decorate([
    (0, routing_controllers_1.Middleware)({ type: 'after' })
], CustomErrorHandler);
