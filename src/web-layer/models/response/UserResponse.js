class UserResponse {
  constructor(user) {
    if (!user) return;
    this.id = user.getId();
    this._id = user.getRefId() || user.getId();
    this.phone_no = user.getPhone();
    this.pass = user.getPass();
    this.status = user.getStatus();
    this.ref_id = user.getRefId();
    this.email = user.getEmail();
    this.DOB = user.getDob();
    this.block = user.getBlock();
    this.address = user.getAddress();
    this.createdAt = user.getCreatedAt();
    this.updatedAt = user.getUpdatedAt();

    // View backwards-compatibility
    this.order = [
      {
        _id: user.getRefId(),
        email: user.getEmail(),
        DOB: user.getDob(),
        block: user.getBlock(),
        address: user.getAddress(),
      },
    ];
  }
}

module.exports = { UserResponse };

