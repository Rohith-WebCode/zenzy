import express from "express";
import { createProduct, createReview } from "../controllers/product.controller.js";
import upload from "../middlewares/upload.js";
import { userProtect } from "../middlewares/userProtect.js";
const router = express.Router();


router.post("/products",upload.single("image"),createProduct)
router.post("/products/:id/reviews",userProtect,createReview)


export default router;