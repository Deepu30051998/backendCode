"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponse = void 0;
class UserResponse {
    id;
    phone;
    status;
    refId;
    email;
    dob;
    address;
    block;
    createdAt;
    updatedAt;
    constructor(user) {
        this.id = user.getId();
        this.phone = user.getPhone();
        this.status = user.getStatus();
        this.refId = user.getRefId();
        this.email = user.getEmail();
        this.dob = user.getDob();
        this.address = user.getAddress();
        this.block = user.getBlock();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
    }
}
exports.UserResponse = UserResponse;
