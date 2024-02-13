const {
  findUser,
  createUser,
  createUserDetails,
  findUser,
  blockuser,
  showUsers,
  showPhone,
  deleteUser,
  updateUserss,
} = require("../data-access-layer/dblayer");

async function showUserService(pnum) {
  const data = await findUser(pnum);
  return data;
}

async function createuserService(body) {
  const user = await createUser(body);
  await createUserDetails(body, user._id);
}

async function updateUserService(body) {
  const filter = { phone_no: body.pnumber };
  const userdata = await findUserBy(body.pnumber);
  const data = userdata[0];

  const updateFields = {};
  const updateUser = {};

  if (body.email !== undefined && body.email !== "") {
    updateFields.email = body.email;
  }

  if (body.dob !== undefined && body.dob !== "") {
    updateFields.DOB = body.dob;
  }

  if (body.city !== undefined && body.city !== "") {
    updateFields["address.city"] = body.city;
  }
  if (body.district !== undefined && body.district !== "") {
    updateFields["address.district"] = body.district;
  }
  if (body.country !== undefined && body.country !== "") {
    updateFields["address.country"] = body.country;
  }
  if (body.state !== undefined && body.state !== "") {
    updateFields["address.state"] = body.state;
  }

  if (body.pass !== undefined && body.pass !== "") {
    updateUser.pass = body.pass;
  }
  if (body.pnnumber !== undefined && body.pnnumber !== "") {
    updateUser.phone_no = body.pnnumber;
  }

  await updateUserss(data.ref_id, updateFields, filter, updateUser);
}

async function deleteUserService(id) {
  await deleteUser(id);
}

async function showPhoneService(pnum) {
  const data = showPhone(pnum);
  return data;
}

async function showAllUsersService() {
  const data = await showUsers();
  return data;
}

async function blockUserService(id) {
  const userDetails = await findUser(id);
  let value;
  if (userDetails[0].block) {
    value = false;
  } else {
    value = true;
  }
  await blockuser(id , value);
}

module.exports = {
  showUserService,
  createuserService,
  updateUserService,
  deleteUserService,
  showPhoneService,
  showAllUsersService,
  blockUserService,
};
