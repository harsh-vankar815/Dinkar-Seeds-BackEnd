const Gallery = require("../models/Gallery");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    // saving img path in db
    const newImage = new Gallery({
      src: req.file.path,
      alt: req.body.alt || "Gallery Image",
      uploadedBy: req.user._id,
    });

    await newImage.save();
    res
      .status(201)
      .json({
        success: true,
        data: newImage,
        message: "Image uploaded successfully",
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, images });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    // PRODUCTION (Cloudinary Delete)
    if (process.env.NODE_ENV === "production") {
      // URL se Public ID nikalna (e.g., dinkar_seeds/gallery/filename)
      const publicId = image.src.split('/').slice(-3).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
      await Gallery.findByIdAndDelete(req.params.id);
    } 
    // DEVELOPMENT (Local File Delete)
    else {
      const filePath = path.join(__dirname, "..", image.src.replace(/^\/+/, ""));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await Gallery.findByIdAndDelete(req.params.id);
    }

    res.status(200).json({ success: true, message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};