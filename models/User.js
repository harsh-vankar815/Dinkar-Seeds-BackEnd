const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      // // Agar googleId nahi hai, toh password required hoga
      required: [
        function () {
          return !this.googleId;
        },
        "Password is required",
      ],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // 🔐 Security best practice
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    bio: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK-5-DUAn8F-Uj_pHNDRyprT6W7FV4WVEBtw&s"
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
