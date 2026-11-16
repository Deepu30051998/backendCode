const { Config } = require("../../config/Config");
const { ServiceFactory } = require("../../service-layer/ServiceFactory");

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers["authorization"] || req.headers["Authorization"];
    if (!header) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = header.replace("Bearer", "").trim();
    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Pass downstream
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { authMiddleware };

