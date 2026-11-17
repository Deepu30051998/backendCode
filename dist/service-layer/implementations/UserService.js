"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const DataAccessLayerFactory_1 = require("../../db-layer/DataAccessLayerFactory");
class UserService {
    getUserDBManager() {
        return DataAccessLayerFactory_1.DataAccessLayerFactory.getUserDBManager();
    }
    async authenticate(phone, pass) {
        const user = await this.getUserDBManager().findByPhone(phone);
        if (user && user.getPass() === pass && user.getStatus() === true) {
            return user;
        }
        return null;
    }
    async getUserWithDetails(phone) {
        return await this.getUserDBManager().findWithDetailsByPhone(phone);
    }
    async getUserByPhone(phone) {
        return await this.getUserDBManager().findByPhone(phone);
    }
    async getAllUsers() {
        return await this.getUserDBManager().findAllActive();
    }
    async registerUser(request) {
        const userData = {
            phone: request.phone || request.pnumber,
            pass: request.pass,
        };
        const detailsData = {
            email: request.email,
            dob: request.dob,
            city: request.city,
            district: request.district,
            state: request.state,
            country: request.country,
        };
        return await this.getUserDBManager().save(userData, detailsData);
    }
    async updateUser(request) {
        const phone = request.phone || request.pnumber;
        const existing = await this.getUserWithDetails(phone);
        const user = existing && existing[0];
        if (!user)
            return false;
        const refId = user.getRefId();
        if (!refId)
            return false;
        const updateDetails = {};
        const updateUser = {};
        if (request.email)
            updateDetails.email = request.email;
        if (request.dob)
            updateDetails.DOB = request.dob;
        if (request.city)
            updateDetails['address.city'] = request.city;
        if (request.district)
            updateDetails['address.district'] = request.district;
        if (request.state)
            updateDetails['address.state'] = request.state;
        if (request.country)
            updateDetails['address.country'] = request.country;
        if (request.pass)
            updateUser.pass = request.pass;
        if (request.pnnumber || request.newPhone) {
            updateUser.phone_no = request.pnnumber || request.newPhone;
        }
        await this.getUserDBManager().updateUserAndDetails(refId, updateDetails, { phone_no: phone }, updateUser);
        return true;
    }
    async deleteUser(refId) {
        return await this.getUserDBManager().updateStatus(refId, false);
    }
    async toggleBlockUser(refId) {
        const details = await this.getUserDBManager().findDetailsById(refId);
        if (!details)
            return null;
        const newBlockState = !details.block;
        await this.getUserDBManager().updateBlock(refId, newBlockState);
        return newBlockState;
    }
}
exports.UserService = UserService;
