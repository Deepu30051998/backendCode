import { User, UserDetails } from "./models/DBUser.js";

class MongoUserDBManager {
  constructor(userModel = User, userDetailsModel = UserDetails) {
    this.userModel = userModel;
    this.userDetailsModel = userDetailsModel;
  }

  async findUserWithDetailsByPhone(phone) {
    return await this.userModel.aggregate([
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
  }

  async findDetailsById(id) {
    return await this.userDetailsModel.findById(id);
  }

  async findByPhone(phone) {
    return await this.userModel.find({ phone_no: phone });
  }

  async createUserDetails(details) {
    return await this.userDetailsModel.create({
      email: details.email,
      DOB: details.dob,
      address: {
        city: details.city,
        district: details.district,
        state: details.state,
        country: details.country,
      },
    });
  }

  async createUser(userData, userDetailsId) {
    return await this.userModel.create({
      phone_no: userData.pnumber,
      pass: userData.pass,
      status: true,
      ref_id: userDetailsId,
    });
  }

  async blockUser(id, isBlocked) {
    return await this.userDetailsModel.updateOne({ _id: id }, { block: isBlocked });
  }

  async findAllActiveUsers() {
    return await this.userModel.aggregate([
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
  }

  async deleteUserByRefId(refId) {
    return await this.userModel.updateOne({ ref_id: refId }, { status: false });
  }

  async updateUserAndDetails(refId, userDetailsFields, filter, userFields) {
    if (Object.keys(userDetailsFields).length > 0) {
      await this.userDetailsModel.updateOne({ _id: refId }, { $set: userDetailsFields });
    }
    if (Object.keys(userFields).length > 0) {
      await this.userModel.updateOne(filter, { $set: userFields });
    }
  }
}

const mongoUserDBManager = new MongoUserDBManager();

export { MongoUserDBManager };
export default mongoUserDBManager;
