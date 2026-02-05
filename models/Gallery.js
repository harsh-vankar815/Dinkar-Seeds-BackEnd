const mongoose = require("mongoose");

const gallerySchema = mongoose.Schema({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "Gallery Image",
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Gallery", gallerySchema);
