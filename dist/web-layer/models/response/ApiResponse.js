"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    success;
    message;
    data;
    constructor(success, message, data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    static ok(data, message) {
        return new ApiResponse(true, message, data);
    }
    static fail(message) {
        return new ApiResponse(false, message, null);
    }
}
exports.ApiResponse = ApiResponse;
