import express from "express";
import { createProduct } from "../controllers/product.controller.js";
import upload from "../middlewares/upload.js";
const router = express.Router();


router.post("/products",upload.single("image"),createProduct)


export default router;