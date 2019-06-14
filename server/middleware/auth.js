const jwt = require("jsonwebtoken");
const db = require("../models");

// ensures authentication and also attaches decodedToken to req object
module.exports = async function ensureAuthentication(req, res, next) {
  try {
    const token = req.get("Authorization").split(" ")[1]; // Get token from Authorization header
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.username) {
      const foundUser = await db.models.User.findOne({
        email: decodedToken.email
      });
      if (foundUser) {
        req.isAuthenticated = true;
        req.decodedToken = decodedToken;
        next();
      } else {
        req.isAuthenticated = false;
        next();
      }
    }
  } catch (err) {
    req.isAuthenticated = false;
    next();
  }
};
