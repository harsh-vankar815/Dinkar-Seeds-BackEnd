const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middlewares/authMiddleware");
const {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} = require("../controllers/productController");
const uploadProductImage = require("../middlewares/uploadProductImage");

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

router.post("/", protect, isAdmin, uploadProductImage.single("img"), createProduct);
router.put("/:id", protect, isAdmin, uploadProductImage.single("img"), updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router;
