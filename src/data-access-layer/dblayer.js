const { User, UserDetails } = require("../models/usersData");

async function findUser(pnum) {
  const user = await User.aggregate([
    { $match: { phone_no: pnum } },
    {
      $lookup: {
        from: "userdetails",
        localField: "ref_id",
        foreignField: "_id",
        as: "order",
      },
    },
  ]);
  return user;
}

async function createUser(body) {
  await UserDetails.create({
    email: body.email,
    DOB: body.dob,
    address: {
      city: body.city,
      district: body.district,
      state: body.state,
      country: body.country,
    },
  });
}

async function createUserDetails(body, id) {
  await User.create({
    phone_no: body.pnumber,
    pass: body.pass,
    status: true,
    ref_id: id,
  });
}

async function findUser(id) {
  return UserDetails.find({ _id: id });
}

async function findUserBy(pnum) {
  const data = User.find({ phone_no: pnum });
  return data;
}

async function blockuser(id, value) {
  UserDetails.updateOne({ _id: id }, { block: value });
}

async function showUsers() {
  const data = await User.aggregate([
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
  return data;
}

async function showPhone(pnum) {
  const data = await User.aggregate([
    { $match: { phone_no: pnum } },
    {
      $lookup: {
        from: "userdetails",
        localField: "ref_id",
        foreignField: "_id",
        as: "order",
      },
    },
  ]);
  return data;
}

async function deleteUser(id) {
  await User.updateOne({ ref_id: id }, { status: false });
}

async function updateUserss(ref_id, updateFields, filter, updateUser) {
  await UserDetails.updateOne({ _id: ref_id }, { $set: updateFields });
  await User.updateOne(filter, { $set: updateUser });
}

module.exports = {
  findUser,
  createUser,
  createUserDetails,
  blockuser,
  showUsers,
  showPhone,
  deleteUser,
  findUserBy,
  updateUserss,
};
