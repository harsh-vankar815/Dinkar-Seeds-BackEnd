const express = require("express");
const router = express.Router();
const {
  login,
  register,
  refreshToken,
  logout,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;
