class DBManagerFactory {
  static #userDBManager;

  static getUserDBManager() {
    return this.#userDBManager;
  }

  static setUserDBManager(mgr) {
    this.#userDBManager = mgr;
  }
}

module.exports = { DBManagerFactory };

