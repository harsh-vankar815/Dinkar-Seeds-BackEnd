const express = require("express");
const router = express.Router();
const {
  login,
  register,
  refreshToken,
  logout,
  googleAuthSuccess,
} = require("../controllers/authController");
const passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    // prompt: "consent", // enable only for testing 
    session: false,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleAuthSuccess,
);

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;
