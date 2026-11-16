const { ServiceFactory } = require("../../service-layer/ServiceFactory");
const { CreateUserRequest } = require("../models/request/CreateUserRequest");
const { UpdateUserRequest } = require("../models/request/UpdateUserRequest");
const { UserResponse } = require("../models/response/UserResponse");

class UserController {
  #getUserService() {
    return ServiceFactory.getUserService();
  }

  loginPage(req, res) {
    res.render("login");
  }

  async verifyUser(req, res, next) {
    try {
      const userPhone = req.query.pnumber;
      const userPass = req.query.pass;
      const user = await this.#getUserService().authenticate(userPhone, userPass);
      if (user) {
        next();
      } else {
        res.render("addUser");
      }
    } catch (err) {
      next(err);
    }
  }

  async showUser(req, res, next) {
    try {
      const users = await this.#getUserService().getUserWithDetails(req.query.pnumber);
      const responses = users.map((u) => new UserResponse(u));
      res.render("user", { userData: responses });
    } catch (err) {
      next(err);
    }
  }

  async createUser(req, res, next) {
    try {
      const request = new CreateUserRequest(req.body);
      await this.#getUserService().registerUser(request);
      res.render("login");
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const request = new UpdateUserRequest(req.body);
      await this.#getUserService().updateUser(request);
      res.render("login");
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await this.#getUserService().deleteUser(req.query._id);
      res.render("login");
    } catch (err) {
      next(err);
    }
  }

  async blockUser(req, res, next) {
    try {
      await this.#getUserService().toggleBlockUser(req.query._id);
      res.render("login");
    } catch (err) {
      next(err);
    }
  }

  updatePage(req, res) {
    res.render("updateUser");
  }

  async allUsers(req, res, next) {
    try {
      const users = await this.#getUserService().getAllUsers();
      const responses = users.map((u) => new UserResponse(u));
      res.render("allUsers", { data: responses });
    } catch (err) {
      next(err);
    }
  }

  async showPhone(req, res, next) {
    try {
      const users = await this.#getUserService().getUserWithDetails(req.query.phone_no);
      const responses = users.map((u) => new UserResponse(u));
      res.render("usersList", { data: responses });
    } catch (err) {
      next(err);
    }
  }
}

function mountUserRoutes(app) {
  const ctrl = new UserController();

  app.get("/", (req, res, next) => ctrl.loginPage(req, res, next));
  app.get(
    "/user",
    (req, res, next) => ctrl.verifyUser(req, res, next),
    (req, res, next) => ctrl.showUser(req, res, next)
  );
  app.post("/user", (req, res, next) => ctrl.createUser(req, res, next));
  app.post("/update", (req, res, next) => ctrl.updateUser(req, res, next));
  app.get("/userDelete", (req, res, next) => ctrl.deleteUser(req, res, next));
  app.get("/userBlock", (req, res, next) => ctrl.blockUser(req, res, next));
  app.get("/userUpdate", (req, res, next) => ctrl.updatePage(req, res, next));
  app.get("/allUsers", (req, res, next) => ctrl.allUsers(req, res, next));
  app.get("/showByPhoneNo", (req, res, next) => ctrl.showPhone(req, res, next));
}

module.exports = { UserController, mountUserRoutes };
