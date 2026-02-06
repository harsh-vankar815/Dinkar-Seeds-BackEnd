const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 1. Root directory se absolute path banayein
    const rootDir = path.join(__dirname, "..", "uploads/gallery");

    // 2. Agar folder nahi hai, to create karein (recursive true nested folders ke liye)
    if (!fs.existsSync(rootDir)) {
      fs.mkdirSync(rootDir, { recursive: true });
    }

    cb(null, rootDir);
  },
  filename: (req, file, cb) => {
    cb(null, `gallery-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    return cb(new Error("Only images allowed"), false);
  }
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
