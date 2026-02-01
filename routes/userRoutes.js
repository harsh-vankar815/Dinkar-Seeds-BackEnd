const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middlewares/authMiddleware");
const uploadProfileImage = require('../middlewares/uploadProfileImage')

// get profile
router.get("/me", protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// update profile
router.put("/update", protect, uploadProfileImage.single("image"), async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;
    console.log(req.file)

    const updateData = {
      firstName,
      lastName,
      bio,
    };

    if (req.file) {
      updateData.image = `/uploads/profile/${req.file.filename}`;
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
