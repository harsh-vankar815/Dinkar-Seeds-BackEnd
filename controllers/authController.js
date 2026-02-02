const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const NODE_ENV = process.env.NODE_ENV;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;

// google auth
exports.googleAuthSuccess = (req, res) => {
  const user = req.user;

  if (!user) {
    res.clearCookie("refreshToken");
    return res.redirect(`${process.env.CLIENT_URL}/login`);
  }

  const refreshToken = generateRefreshToken(user);
  // const accessToken = generateAccessToken(user)

  // saving securely refresh token in httpOnly cookies
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : "lax",
    // sameSite: "None", // Required for cross-site (Render/Cloud)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // redirect to frontned profile page
  res.redirect(
    `${process.env.CLIENT_URL}/auth/success`
  );
};

// register api
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // basic validate
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // password matching
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // checking email is already registered or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // removing password from response
    const userObject = user.toObject();
    delete userObject.password;

    res
      .status(201)
      .json({ user: userObject, message: "Registration successful" });
  } catch (err) {
    console.log(`Register error: ${err}`);
    res.status(500).json({ message: "Server Error" });
  }
};

// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validating
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // getting user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // comparing password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is wrong" });
    }

    // generating token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // httpOnly Cookies for more secure authentication
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production", // Sirf production (HTTPS) par true hoga
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successfull",
      success: true,
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(`Login error: ${err}`);
    res.status(500).json({ message: "Server error" });
  }
};

// refresh token api
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken, user });
  } catch (err) {
    console.error(`refresh token error: ${err}`);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

// logout api , clearing cookies
exports.logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: NODE_ENV === "production" ? "none" : "lax",
  });

  res.json({ success: true, message: "Logged out successfully" });
};
