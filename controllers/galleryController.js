const Gallery = require("../models/Gallery");
const fs = require("fs");
const path = require("path");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    // saving img path in db
    const newImage = new Gallery({
      src: `/uploads/gallery/${req.file.filename}`,
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

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const filePath = path.join(__dirname, "..", image.src.replace(/^\/+/, ""));

    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("Error while deleting file", err);
      }

      await Gallery.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Image successfully deleted from gallery and server",
      });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
