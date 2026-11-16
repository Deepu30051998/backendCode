class IUserService {
  async registerUser(request) {
    throw new Error("Not implemented");
  }
  async getUserByPhone(phone) {
    throw new Error("Not implemented");
  }
  async getUserWithDetails(phone) {
    throw new Error("Not implemented");
  }
  async getAllUsers() {
    throw new Error("Not implemented");
  }
  async updateUser(request) {
    throw new Error("Not implemented");
  }
  async deleteUser(refId) {
    throw new Error("Not implemented");
  }
  async toggleBlockUser(refId) {
    throw new Error("Not implemented");
  }
  async authenticate(phone, pass) {
    throw new Error("Not implemented");
  }
}

module.exports = { IUserService };

