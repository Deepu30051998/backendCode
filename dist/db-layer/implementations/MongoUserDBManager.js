"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUserDBManager = void 0;
const DBUserSchema_1 = require("../models/DBUserSchema");
const User_1 = require("../../service-layer/models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const DBConstant_1 = require("../models/DBConstant");
class MongoUserDBManager {
    DBUserDetails;
    DBUsers;
    constructor() {
        this.DBUserDetails = mongoose_1.default.model(DBConstant_1.DBConstants.UserDetailsCollection, DBUserSchema_1.DBUserDetailsSchema);
        this.DBUsers = mongoose_1.default.model(DBConstant_1.DBConstants.UsersCollection, DBUserSchema_1.DBUserSchema);
    }
    async save(userData, detailsData) {
        const detailsDoc = await this.DBUserDetails.create({
            email: detailsData.email,
            DOB: detailsData.dob,
            address: {
                city: detailsData.city,
                district: detailsData.district,
                state: detailsData.state,
                country: detailsData.country,
            },
        });
        const userDoc = await this.DBUsers.create({
            phone_no: userData.phone,
            pass: userData.pass,
            status: true,
            ref_id: detailsDoc._id,
        });
        return this.toModel(userDoc.toObject(), detailsDoc.toObject());
    }
    async findByPhone(phone) {
        const doc = await this.DBUsers.findOne({ phone_no: phone }).lean();
        return doc ? this.toModel(doc) : null;
    }
    async findWithDetailsByPhone(phone) {
        const docs = await this.DBUsers.aggregate([
            { $match: { phone_no: phone } },
            {
                $lookup: {
                    from: 'userdetails',
                    localField: 'ref_id',
                    foreignField: '_id',
                    as: 'order',
                },
            },
        ]);
        return docs.map((d) => this.toModel(d));
    }
    async findDetailsById(id) {
        return await this.DBUserDetails.findById(id).lean();
    }
    async findAllActive() {
        const docs = await this.DBUsers.aggregate([
            { $match: { status: true } },
            {
                $lookup: {
                    from: 'userdetails',
                    localField: 'ref_id',
                    foreignField: '_id',
                    as: 'order',
                },
            },
        ]);
        return docs.map((d) => this.toModel(d));
    }
    async updateStatus(refId, status) {
        return await this.DBUsers.updateOne({ ref_id: refId }, { status });
    }
    async updateBlock(id, isBlocked) {
        return await this.DBUserDetails.updateOne({ _id: id }, { block: isBlocked });
    }
    async updateUserAndDetails(refId, userDetailsFields, filter, userFields) {
        if (Object.keys(userDetailsFields).length > 0) {
            await this.DBUserDetails.updateOne({ _id: refId }, { $set: userDetailsFields });
        }
        if (Object.keys(userFields).length > 0) {
            await this.DBUsers.updateOne(filter, { $set: userFields });
        }
    }
    toModel(userDoc, detailsDoc = null) {
        const details = detailsDoc || (userDoc.order && userDoc.order[0]) || {};
        return new User_1.User({
            id: userDoc._id ? userDoc._id.toString() : null,
            phone: userDoc.phone_no,
            pass: userDoc.pass,
            status: userDoc.status,
            refId: userDoc.ref_id
                ? userDoc.ref_id.toString()
                : details._id
                    ? details._id.toString()
                    : null,
            email: details.email,
            dob: details.DOB,
            address: details.address || {},
            block: details.block !== undefined ? details.block : false,
            createdAt: userDoc.createdAt,
            updatedAt: userDoc.updatedAt,
        });
    }
}
exports.MongoUserDBManager = MongoUserDBManager;
