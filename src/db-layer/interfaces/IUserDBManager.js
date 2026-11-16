class IUserDBManager {
  async save(userData, detailsData) {
    throw new Error("Not implemented");
  }
  async findByPhone(phone) {
    throw new Error("Not implemented");
  }
  async findWithDetailsByPhone(phone) {
    throw new Error("Not implemented");
  }
  async findDetailsById(id) {
    throw new Error("Not implemented");
  }
  async findAllActive() {
    throw new Error("Not implemented");
  }
  async updateStatus(id, status) {
    throw new Error("Not implemented");
  }
  async updateBlock(id, isBlocked) {
    throw new Error("Not implemented");
  }
  async updateUserAndDetails(refId, userDetailsFields, filter, userFields) {
    throw new Error("Not implemented");
  }
}

module.exports = { IUserDBManager };

