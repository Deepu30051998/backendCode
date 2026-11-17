"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBManager = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logs_1 = require("../logs");
class MongoDBManager {
    url;
    constructor(url) {
        this.url = url;
    }
    async connect() {
        try {
            await mongoose_1.default.connect(this.url);
            logs_1.logger.info('MongoDB connected successfully');
        }
        catch (err) {
            logs_1.logger.error('MongoDB connection failed', err);
            process.exit(1);
        }
    }
}
exports.MongoDBManager = MongoDBManager;
