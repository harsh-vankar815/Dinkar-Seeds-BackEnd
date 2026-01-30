const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      require: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    img: {
      type: String,
      required: true,
    },
    details: {
      sowingTime: String,
      seedRate: String,
      maturity: String,
      yield: String,
    },
    specifications: {
      cropType: String,
      variety: String,
      climate: String,
      irrigation: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamp: true },
);

module.exports = mongoose.model("Product", productSchema);
