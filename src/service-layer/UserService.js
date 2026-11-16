import mongoUserDBManager, { MongoUserDBManager } from "../db-layer/MongoUserDBManager.js";

class UserService {
  constructor(dbManager = mongoUserDBManager) {
    this.dbManager = dbManager;
  }

  async showUserService(phone) {
    return await this.dbManager.findUserWithDetailsByPhone(phone);
  }

  async createUserService(body) {
    const userDetails = await this.dbManager.createUserDetails(body);
    return await this.dbManager.createUser(body, userDetails._id);
  }

  async updateUserService(body) {
    const filter = { phone_no: body.pnumber };
    const userData = await this.dbManager.findByPhone(body.pnumber);
    const data = userData[0];

    if (!data) return;

    const updateFields = {};
    const updateUser = {};

    if (body.email) updateFields.email = body.email;
    if (body.dob) updateFields.DOB = body.dob;
    if (body.city) updateFields["address.city"] = body.city;
    if (body.district) updateFields["address.district"] = body.district;
    if (body.country) updateFields["address.country"] = body.country;
    if (body.state) updateFields["address.state"] = body.state;

    if (body.pass) updateUser.pass = body.pass;
    if (body.pnnumber) updateUser.phone_no = body.pnnumber;

    await this.dbManager.updateUserAndDetails(data.ref_id, updateFields, filter, updateUser);
  }

  async deleteUserService(id) {
    return await this.dbManager.deleteUserByRefId(id);
  }

  async showPhoneService(phone) {
    return await this.dbManager.findUserWithDetailsByPhone(phone);
  }

  async showAllUsersService() {
    return await this.dbManager.findAllActiveUsers();
  }

  async blockUserService(id) {
    const userDetails = await this.dbManager.findDetailsById(id);
    if (!userDetails) return;
    const newBlockStatus = !userDetails.block;
    return await this.dbManager.blockUser(id, newBlockStatus);
  }
}

const userService = new UserService();

export { UserService };
export default userService;
