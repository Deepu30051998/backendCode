const {
  showUserService,
  createuserService,
  updateUserService,
  deleteUserService,
  showPhoneService,
  showAllUsersService,
  blockUserService
} = require("../services/services");

const loginUser = (req, res) => {
  res.render("login");
};

const addUser = async (req, res) => {
  const details = await showUserService(req.query.pnumber);
  res.render("user", { userData: details });
};

const postUser = async (req, res) => {
  const body = req.body;
  await createuserService(body);
  res.render("login");
};

const update = async (req, res) => {
  const body = req.body;
  await updateUserService(body);
  res.render("login");
};

const deleteUser = async (req, res) => {
  await deleteUserService(req.query._id);
  res.render("login");
};

const blockUser = async (req, res) => {
  await blockUserService(req.query._id)
  res.render("login");
};

const Update = async (req, res) => {
  res.render("updateUser");
};

const allUser = async (req, res) => {
  const Data = await showAllUsersService();

  res.render("allUsers", { data: Data });
};

const showPhone = async (req, res) => {
  const data = await showPhoneService(req.query.phone_no);
  res.render("usersList", { data: data });
};

module.exports = {
  loginUser,
  addUser,
  postUser,
  update,
  deleteUser,
  blockUser,
  Update,
  allUser,
  showPhone,
};
