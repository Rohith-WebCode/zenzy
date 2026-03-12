import Product from "../models/productSchema"



export const createProduct = async(req,res)=>{
    try {
        const {name,price,description,category,brand,stock,image,rating} = req.body
        
        if(!name || !price || !description || !category || !brand || !stock || !image){
            return res.status(400).json({
                success:false,
                message:"product data required"
            })
        }

        const newProduct = await Product.create({
            name,
            price,
            description,
            category,
            brand,
            stock,
            image,
            rating
        })

        await newProduct.save()
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