const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
      cb(new Error("Please upload an image"));
    }
    cb(null, true);
  },
});

// get profile
router.get("/me", protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// update profile
router.put("/update", protect, upload.single("image"), async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;
    console.log(req.file)

    const updateData = {
      firstName,
      lastName,
      bio,
    };

    if (req.file) {
      updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
