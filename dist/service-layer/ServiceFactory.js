"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceFactory = void 0;
class ServiceFactory {
    static userService;
    static getUserService() {
        return this.userService;
    }
    static setUserService(svc) {
        this.userService = svc;
    }
}
exports.ServiceFactory = ServiceFactory;
