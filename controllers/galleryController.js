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

    if (process.env.NODE_ENV === "production") {
      // Cloudinary Delete: URL se public_id nikalna
      // dinkar_seeds/uploads/gallery/filename
      const parts = image.src.split('/');
      const filenameWithExtension = parts.pop(); // filename.jpg
      const filename = filenameWithExtension.split('.')[0]; // filename
      const folderPath = parts.slice(-3).join('/'); // dinkar_seeds/uploads/gallery
      const publicId = `${folderPath}/${filename}`;

      await cloudinary.uploader.destroy(publicId);
    } 
    else {
      // Local Delete: /uploads/gallery/ logic
      // __dirname se bahar nikal kar seedha root ke uploads folder tak pahunchna
      const absolutePath = path.join(process.cwd(), image.src); 
      
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      success: true, 
      message: "Image deleted successfully from database and storage" 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
