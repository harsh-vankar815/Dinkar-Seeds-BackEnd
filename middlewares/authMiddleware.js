const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user)
      return res.status(401).json({ message: "User no longer exists" });

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    // Agar token expire ho gaya ho
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Access token expired" });
    }
    // Baki kisi bhi error ke liye
    return res.status(401).json({ message: "Token is invalid" });
  }
};


exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Admin access only"
    })
  }
}