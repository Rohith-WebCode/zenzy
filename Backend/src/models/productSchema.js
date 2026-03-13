import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: [String],
      required: true,
    },
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);