const jwt = require("jsonwebtoken");

// ensures authentication and also attaches decodedToken to req object
module.exports = async function ensureAuthentication(req, res, next) {
  try {
    const token = req.get("Authorization").split(" ")[1]; // Get token from Authorization header
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.username) {
      req.isAuthenticated = true;
      req.decodedToken = decodedToken;
      next();
    } else {
      req.isAuthenticated = false;
      next();
    }
  } catch (err) {
    req.isAuthenticated = false;
    next();
  }
};
