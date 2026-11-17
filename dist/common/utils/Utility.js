"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utility = void 0;
class Utility {
    static isEmpty(val) {
        return val === null || val === undefined || (typeof val === 'string' && val.trim().length === 0);
    }
    static isNotEmpty(val) {
        return !this.isEmpty(val);
    }
}
exports.Utility = Utility;
