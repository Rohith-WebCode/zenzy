import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  brand: String,
  stock: Number,
  image: String
});


export default mongoose.model("product",productSchema);