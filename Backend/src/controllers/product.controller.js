import cloudinary from "../config/cloudinary.js"
import Product from "../models/productSchema.js"
import streamifier from "streamifier";



export const createProduct = async(req,res)=>{
    try {
        
        const {name,price,description,category,brand,stock,rating} = req.body
   
        if(!name || !price || !description || !category || !brand || !stock){
            return res.status(400).json({
                success:false,
                message:"product data required"
            })
        }

         if(!req.file){
            return res.status(400).json({
                success:false,
                message:"Image required"
            })
         }
          
                const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                    folder: "products",
                    timeout: 60000,
                    transformation: [
                        { width: 800, height: 800, crop: "limit" },
                        { quality: "auto" },
                        { fetch_format: "auto" }
                    ]
                    },
                    (error, result) => {
                    if (result) resolve(result);
                    else reject(error);
                    }
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
            image:result.secure_url,
        })
        res.status(201).json({
            success:true,
            message: "Product created successfully",
            Product:newProduct
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}


export const createReview  = async(req,res)=>{
    try {
        const {rating , comment} = req.body

        if(!rating || rating < 1 || rating > 5){
            return res.status(400).json({
               success:false,
               message:"Rating must be between 1 and 5"
            })
        }

        if(!comment || comment.trim() === ""){
            return res.status(400).json({
                success:false,
                message:"Comment is required"
            })
        }

        const product = await Product.findById(req.params.id)

        if(!product){
             return res.status(404).json({message:"Product not found"})
        }

        const alreadyReviewed = product.reviews.find(
            (r)=> r.user.toString() === req.user._id.toString()
        )

        if(alreadyReviewed){
              return res.status(400).json({
              success: false,
               message: "You already reviewed this product",
            });
        }

        const review  = {
            user:req.user._id,
            name:req.user.name,
            rating:Number(rating),
            comment 
        }
        
        product.reviews.push(review)

        product.numReviews  = product.reviews.length

        product.rating = (
            product.reviews.reduce((acc, item) => acc + item.rating, 0) /
            product.reviews.length
            ).toFixed(1);


        await product.save()
            res.status(201).json({
            success:true,
            message:"Review added"
        })

    } catch (error) {
        res.status(500).json({message:"Server error"})
    }
}