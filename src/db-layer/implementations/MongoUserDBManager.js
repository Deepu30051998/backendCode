const { UserSchema, UserDetailsSchema } = require("../schemas/UserSchema");
const { User } = require("../../service-layer/models/User");

class MongoUserDBManager {
  async save(userData, detailsData) {
    const detailsDoc = await UserDetailsSchema.create({
      email: detailsData.email,
      DOB: detailsData.dob,
      address: {
        city: detailsData.city,
        district: detailsData.district,
        state: detailsData.state,
        country: detailsData.country,
      },
    });

    const userDoc = await UserSchema.create({
      phone_no: userData.phone,
      pass: userData.pass,
      status: true,
      ref_id: detailsDoc._id,
    });

    return this.#toModel(userDoc, detailsDoc);
  }

  async findByPhone(phone) {
    const doc = await UserSchema.findOne({ phone_no: phone }).lean();
    return doc ? this.#toModel(doc) : null;
  }

  async findWithDetailsByPhone(phone) {
    const docs = await UserSchema.aggregate([
      { $match: { phone_no: phone } },
      {
        $lookup: {
          from: "userdetails",
          localField: "ref_id",
          foreignField: "_id",
          as: "order",
        },
      },
    ]);
    return docs.map((d) => this.#toModel(d));
  }

  async findDetailsById(id) {
    return await UserDetailsSchema.findById(id).lean();
  }

  async findAllActive() {
    const docs = await UserSchema.aggregate([
      { $match: { status: true } },
      {
        $lookup: {
          from: "userdetails",
          localField: "ref_id",
          foreignField: "_id",
          as: "order",
        },
      },
    ]);
    return docs.map((d) => this.#toModel(d));
  }

  async updateStatus(refId, status) {
    await UserSchema.updateOne({ ref_id: refId }, { status });
  }

  async updateBlock(id, isBlocked) {
    await UserDetailsSchema.updateOne({ _id: id }, { block: isBlocked });
  }

  async updateUserAndDetails(refId, userDetailsFields, filter, userFields) {
    if (Object.keys(userDetailsFields).length > 0) {
      await UserDetailsSchema.updateOne({ _id: refId }, { $set: userDetailsFields });
    }
    if (Object.keys(userFields).length > 0) {
      await UserSchema.updateOne(filter, { $set: userFields });
    }
  }

  #toModel(userDoc, detailsDoc = null) {
    const details = detailsDoc || (userDoc.order && userDoc.order[0]) || {};
    return new User({
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

module.exports = { MongoUserDBManager };

