const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing"})
  }

  try {
    const decode = jwt.verify(token, JWT_SECRET)
    req.user = await User.findById(decode.id).select("-password")
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid"})
  }
};
