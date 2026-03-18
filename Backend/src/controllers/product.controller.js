import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/productSchema.js";
import streamifier from "streamifier";

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, brand, stock, rating } =
      req.body;

    if (!name || !price || !description || !category || !brand || !stock) {
      return res.status(400).json({
        success: false,
        message: "product data required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image required",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
          timeout: 60000,
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const newProduct = await Product.create({
      name,
      price,
      description,
      category,
      brand,
      stock,
      image: result.secure_url,
    });
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      Product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || comment.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product",
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating = (
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length
    ).toFixed(1);

    await product.save();
    res.status(201).json({
      success: true,
      message: "Review added",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const brand = req.query.brand ? { brand: req.query.brand } : {};

    const price =
      req.query.minPrice || req.query.maxPrice
        ? {
            price: {
              ...(req.query.minPrice && { $gte: Number(req.query.minPrice) }),
              ...(req.query.maxPrice && { $lte: Number(req.query.maxPrice) }),
            },
          }
        : {};

    const sort =
      req.query.sort === "price_asc"
        ? { price: 1 }
        : req.query.sort === "price_desc"
          ? { price: -1 }
          : req.query.sort === "rating"
            ? { rating: -1 }
            : { createdAt: -1 };

    const query = { ...keyword, ...category, ...brand, ...price };

    const [products, total] = await Promise.all([
      Product.find(query)
        .select("name price image rating numReviews stock category brand")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getProductById = async(req,res) => {
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const product = await Product.findById(req.params.id);


    if(!product){
     return res.status(404).json({
        success:false,
        message:"Product not found"
      })
    }

      res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
      res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

export const deleteProduct = async(req,res) =>{
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
       return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const product = await Product.findByIdAndDelete(req.params.id)

    if(!product){
      return res.status(404).json({
        success:false,
        message:"Product not found"
      })
    }

   res.status(200).json({
    success:true,
    message:"Product deleted successfully",
   })

  } catch (error) {
      res.status(500).json({
      success: false,
      message: "Server error"
  })
  }
}

export const updateProduct = async(req,res) =>{
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }


    const product = await Product.findById(req.params.id);
    
    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }

   product.name = req.body.name || product.name
   product.price = req.body.price ?? product.price
   product.description = req.body.description || product.description;
   product.category = req.body.category || product.category;
   product.brand = req.body.brand || product.brand;
   product.stock = req.body.stock ?? product.stock

    if (req.file) {
          if (product.image?.length > 0) {
            const publicId = product.image[0]
              .split("/")
              .slice(-2)
              .join("/")
              .split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          }

          const result = await uploadToCloudinary(req.file.buffer, "products");
          product.image = [result.secure_url]; 
        }

    const updatedProduct = await product.save();

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
       success: false, 
      message: "Server error" 
    });
  }
}