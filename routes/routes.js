const express = require("express");
const router = express.Router();
const { User, UserDetails } = require("../models/usersData");

const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.render("login");
});

async function user(req, res, next) {
  const userPhone = req.query.pnumber;
  const userPass = req.query.pass;

  const userFound = await User.findOne({
    phone_no: { $eq: userPhone },
    pass: { $eq: userPass },
    status: true,
  });

  if (userFound) {
    next();
  } else {
    res.render("addUser");
  }
}

router.get("/user", user, async (req, res) => {
  const userLogged = req.query.pnumber;
  const detail = await User.find({ phone_no: userLogged });

  const details = await UserDetails.find({ _id: detail[0].ref_id });
  res.render("user", { userData: details });
});

router.post("/user", async (req, res) => {
  const body = req.body;
  const user = await UserDetails.create({
    email: body.email,
    DOB: body.dob,
    address: {
      city: body.city,
      district: body.district,
      state: body.state,
      country: body.country,
    },
  });

  await User.create({
    phone_no: body.pnumber,
    pass: body.pass,
    status: true,
    ref_id: user._id,
  });

  res.render("login");
});

router.post("/update", async (req, res) => {
  const body = req.body;
  const filter = { phone_no: body.pnumber };
  const userdata = await User.find({ phone_no: body.pnumber });
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

  await UserDetails.updateOne({ _id: data.ref_id }, { $set: updateFields });

  await User.updateOne(filter, { $set: updateUser });

  res.render("login");
});

router.get("/userDelete", async (req, res) => {
  await User.updateOne({ ref_id: req.query._id }, { status: false });
  res.render("login");
});

router.get("/userUpdate", async (req, res) => {
  res.render("updateUser");
});

router.get("/users", async (req, res) => {
  const dataUserDetails = await UserDetails.find();
  const dataUser = await User.find({ status: true });
  const data = dataUser.map((userDetails) => {
    return dataUserDetails.find((user) => user._id.equals(userDetails.ref_id));
  });

  res.render("usersList", { data: data });
});
router.get("/allUsers", async (req, res) => {
  const userPhoneNoData = await User.find({ status: true });

  const dataUserDetails = await UserDetails.find();

  const data = userPhoneNoData.map((userDetails) => {
    return dataUserDetails.find((user) => user._id.equals(userDetails.ref_id));
  });

  const Data = data.map((userDetails) => {
    const matchingUser = userPhoneNoData.find((user) =>
      user.ref_id.equals(userDetails._id)
    );
    return {
      ...userDetails.toObject(),
      phone_no: matchingUser,
    };
  });

  res.render("allUsers", { data: Data });
});

router.get("/showByPhoneNo", async (req, res) => {
  const val = await User.find({ phone_no: req.query.phone_no, status: true });

  const data = await UserDetails.find({
    _id: val[0].ref_id,
  });
  res.render("usersList", { data: data });
});

module.exports = router;
