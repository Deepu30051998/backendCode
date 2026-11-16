class ServiceFactory {
  static #userService;

  static getUserService() {
    return this.#userService;
  }

  static setUserService(svc) {
    this.#userService = svc;
  }
}

module.exports = { ServiceFactory };

