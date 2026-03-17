import express from "express";
import { createProduct,createReview,getProducts,getProductById,deleteProduct} from "../controllers/product.controller.js";
import upload from "../middlewares/upload.js";
import { userProtect } from "../middlewares/userProtect.js";
import { admin } from "../middlewares/adminProtect.js";
const router = express.Router();


router.post("/products",admin,upload.single("image"),createProduct)
router.post("/products/:id/reviews",userProtect,createReview)
router.get("/products",getProducts)
router.get("/products/:id",getProductById)
router.delete("/products/:id",userProtect,admin,deleteProduct)

export default router;