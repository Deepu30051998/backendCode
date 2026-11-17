"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    id;
    phone;
    pass;
    status;
    refId;
    email;
    dob;
    address;
    block;
    createdAt;
    updatedAt;
    constructor(data) {
        this.id = data.id || null;
        this.phone = data.phone;
        this.pass = data.pass;
        this.status = data.status !== undefined ? data.status : true;
        this.refId = data.refId || null;
        this.email = data.email;
        this.dob = data.dob;
        this.address = data.address || {};
        this.block = data.block !== undefined ? data.block : false;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
    getId() {
        return this.id;
    }
    getPhone() {
        return this.phone;
    }
    getPass() {
        return this.pass;
    }
    getStatus() {
        return this.status;
    }
    getRefId() {
        return this.refId;
    }
    getEmail() {
        return this.email;
    }
    getDob() {
        return this.dob;
    }
    getAddress() {
        return this.address;
    }
    getBlock() {
        return this.block;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    setBlock(block) {
        this.block = block;
    }
    setStatus(status) {
        this.status = status;
    }
}
exports.User = User;
