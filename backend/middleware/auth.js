const jwt = require("jsonwebtoken");
const env = require("../config/env");

const auth = (req, res, next) => {
  const token = req.cookies[env.cookieName];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = auth;
