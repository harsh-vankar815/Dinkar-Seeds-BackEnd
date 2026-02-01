const Product = require("../models/Product");

// Create new product or add new product
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      price: Number(req.body.price),
      discount: Number(req.body.discount),
      createdBy: req.user.id,
    };

    if (req.body.details)
  productData.details = JSON.parse(req.body.details);

if (req.body.specifications)
  productData.specifications = JSON.parse(req.body.specifications);

    if (req.file) {
      productData.img = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// get all products (public)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get single product
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    // Agar ID ka format galat hai (CastError)
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// update product (admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const updatedData = {
      ...req.body,
      price: Number(req.body.price),
      discount: Number(req.body.discount),
    };

     // parse nested objects
    if (req.body.details)
      updatedData.details = JSON.parse(req.body.details);

    if (req.body.specifications)
      updatedData.specifications = JSON.parse(req.body.specifications);

    if (req.file) {
      updatedData.img = `/uploads/products/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json({
      success: true,
      updatedProduct,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // // soft delete
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
