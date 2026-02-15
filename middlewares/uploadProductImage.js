const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

let storage;

if (process.env.NODE_ENV === "production") {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "dinkar_seeds/uploads/products",
      resource_type: "auto",
      public_id: (req, file) =>
        `${Date.now()}-${file.originalname.split(".")[0]}`,
    },
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const rootDir = path.join(__dirname, "..", "uploads/products");
      if (!fs.existsSync(rootDir)) {
        fs.mkdirSync(rootDir, { recursive: true });
      }
      cb(null, rootDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
}

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

module.exports = multer({ storage, fileFilter });
