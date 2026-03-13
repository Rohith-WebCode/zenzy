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