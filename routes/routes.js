const express = require("express");
const router = express.Router();
const { User } = require("../models/usersData");

const {
  loginUser,
  addUser,
  postUser,
  update,
  deleteUser,
  blockUser,
  Update,
  allUser,
  showPhone,
} = require("../controllers/userController");

const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", loginUser);

async function user(req, res, next) {
  const userPhone = req.query.pnumber;
  const userPass = req.query.pass;

  const userFound = await User.findOne({
    phone_no: userPhone,
    pass: userPass,
    status: true,
  });

  if (userFound) {
    next();
  } else {
    res.render("addUser");
  }
}

router.get("/user", user, addUser);

router.post("/user", postUser);

router.post("/update", update);

router.get("/userDelete", deleteUser);

router.get("/userBlock", blockUser);

router.get("/userUpdate", Update);

router.get("/allUsers", allUser);

router.get("/showByPhoneNo", showPhone);

module.exports = router;
