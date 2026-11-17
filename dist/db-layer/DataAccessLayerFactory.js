"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataAccessLayerFactory = void 0;
class DataAccessLayerFactory {
    static userDBManager;
    static getUserDBManager() {
        return this.userDBManager;
    }
    static setUserDBManager(mgr) {
        this.userDBManager = mgr;
    }
}
exports.DataAccessLayerFactory = DataAccessLayerFactory;
