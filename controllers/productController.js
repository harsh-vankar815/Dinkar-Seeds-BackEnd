const Product = require("../models/Product")


// Create new product or add new product
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            ...req.body,
            createdBy: req.user.id,
        })

        res.status(201).json({
            success: true,
            product,
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message:err.message,
        })
    }
}

// get all products (public)
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true}).sort({
            createdAt: -1,
        })
        res.json({
            success: true,
            count: products.length,
            products,
        })
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
}

// get single product
exports.getSingleProduct = async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return res.status(404).json({ message: "Product not found"})
    }
    res.json(product)
}


// update product (admin)
exports.updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return res.status(404).json({ message: "Product not found"})
    }
    Object.assign(product, req.body)
    await product.save()

    res.json({
        success: true,
        product
    })
}


// delete product
exports.deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: "Product not found"})
    }

    // // soft delete
    product.isActive = false;
    await product.save()

    res.json({
        success: true,
        message: "Product deleted successfully"
    })
}