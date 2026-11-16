class UpdateUserRequest {
  constructor(body = {}) {
    this.pnumber = body.pnumber;
    this.pnnumber = body.pnnumber;
    this.pass = body.pass;
    this.email = body.email;
    this.dob = body.dob;
    this.city = body.city;
    this.district = body.district;
    this.state = body.state;
    this.country = body.country;
  }
}

module.exports = { UpdateUserRequest };

