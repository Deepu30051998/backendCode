class User {
  #id;
  #phone;
  #pass;
  #status;
  #refId;
  #email;
  #dob;
  #address;
  #block;
  #createdAt;
  #updatedAt;

  constructor({
    id,
    phone,
    pass,
    status,
    refId,
    email,
    dob,
    address,
    block,
    createdAt,
    updatedAt,
  }) {
    this.#id = id;
    this.#phone = phone;
    this.#pass = pass;
    this.#status = status !== undefined ? status : true;
    this.#refId = refId;
    this.#email = email;
    this.#dob = dob;
    this.#address = address || {};
    this.#block = block !== undefined ? block : false;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  getId() {
    return this.#id;
  }

  getPhone() {
    return this.#phone;
  }

  getPass() {
    return this.#pass;
  }

  getStatus() {
    return this.#status;
  }

  getRefId() {
    return this.#refId;
  }

  getEmail() {
    return this.#email;
  }

  getDob() {
    return this.#dob;
  }

  getAddress() {
    return this.#address;
  }

  getBlock() {
    return this.#block;
  }

  getCreatedAt() {
    return this.#createdAt;
  }

  getUpdatedAt() {
    return this.#updatedAt;
  }

  setBlock(block) {
    this.#block = block;
  }

  setStatus(status) {
    this.#status = status;
  }
}

module.exports = { User };

