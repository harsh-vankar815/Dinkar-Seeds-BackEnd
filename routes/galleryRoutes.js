const express = require('express')
const router  = express.Router()
const uploadGalleryImage = require('../middlewares/uploadGalleryImage')
const { protect, isAdmin } = require("../middlewares/authMiddleware");
const { getGallery, uploadImage, deleteImage } = require('../controllers/galleryController')

router.post("/upload", protect, isAdmin, uploadGalleryImage.single("src"), uploadImage)

router.get('/', getGallery)

router.delete('/:id', protect, isAdmin, deleteImage)

module.exports = router;