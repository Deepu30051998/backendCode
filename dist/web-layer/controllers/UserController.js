"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const routing_controllers_1 = require("routing-controllers");
const Constants_1 = require("../../common/utils/Constants");
const ServiceFactory_1 = require("../../service-layer/ServiceFactory");
const UserRequestModel_1 = require("../models/request/UserRequestModel");
const UserResponse_1 = require("../models/response/UserResponse");
const ApiResponse_1 = require("../models/response/ApiResponse");
const Config_1 = require("../../config/Config");
const jwt = require('jwt-simple');
let UserController = class UserController {
    userService;
    constructor() {
        this.userService = ServiceFactory_1.ServiceFactory.getUserService();
    }
    async register(req) {
        const user = await this.userService.registerUser(req);
        return ApiResponse_1.ApiResponse.ok(new UserResponse_1.UserResponse(user), 'User registered successfully');
    }
    async login(req) {
        const user = await this.userService.authenticate(req.phone, req.pass);
        if (!user) {
            return ApiResponse_1.ApiResponse.fail('Invalid phone number or password');
        }
        const payload = {
            id: user.getId(),
            phone: user.getPhone(),
            exp: Math.floor(Date.now() / 1000) + Config_1.Config.getInstance().getJwtExpiry(),
        };
        const token = jwt.encode(payload, Config_1.Config.getInstance().getJwtSecret());
        return ApiResponse_1.ApiResponse.ok({
            token,
            user: new UserResponse_1.UserResponse(user),
        }, 'Login successful');
    }
    async getAllUsers() {
        const users = await this.userService.getAllUsers();
        return ApiResponse_1.ApiResponse.ok(users.map((u) => new UserResponse_1.UserResponse(u)));
    }
    async getUserByPhone(phone) {
        const users = await this.userService.getUserWithDetails(phone);
        return ApiResponse_1.ApiResponse.ok(users.map((u) => new UserResponse_1.UserResponse(u)));
    }
    async updateUser(req) {
        const result = await this.userService.updateUser(req);
        if (!result) {
            return ApiResponse_1.ApiResponse.fail('User not found or update failed');
        }
        return ApiResponse_1.ApiResponse.ok(true, 'User updated successfully');
    }
    async deleteUser(refId) {
        await this.userService.deleteUser(refId);
        return ApiResponse_1.ApiResponse.ok(true, 'User deleted successfully');
    }
    async toggleBlockUser(refId) {
        const newState = await this.userService.toggleBlockUser(refId);
        if (newState === null) {
            return ApiResponse_1.ApiResponse.fail('User details not found');
        }
        return ApiResponse_1.ApiResponse.ok({ isBlocked: newState }, 'User block state toggled');
    }
};
exports.UserController = UserController;
__decorate([
    (0, routing_controllers_1.Post)('/register'),
    __param(0, (0, routing_controllers_1.Body)({ required: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserRequestModel_1.UserRequestModel]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, routing_controllers_1.Post)('/login'),
    __param(0, (0, routing_controllers_1.Body)({ required: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserRequestModel_1.UserRequestModel]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, routing_controllers_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, routing_controllers_1.Get)('/by-phone'),
    __param(0, (0, routing_controllers_1.QueryParam)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserByPhone", null);
__decorate([
    (0, routing_controllers_1.Put)('/'),
    __param(0, (0, routing_controllers_1.Body)({ required: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserRequestModel_1.UserRequestModel]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, routing_controllers_1.Delete)('/:refId'),
    __param(0, (0, routing_controllers_1.Param)('refId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, routing_controllers_1.Post)('/toggle-block/:refId'),
    __param(0, (0, routing_controllers_1.Param)('refId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "toggleBlockUser", null);
exports.UserController = UserController = __decorate([
    (0, routing_controllers_1.JsonController)(Constants_1.Constants.ROUTER_PREFIX + '/users'),
    __metadata("design:paramtypes", [])
], UserController);
