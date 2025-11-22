import express from "express";
const router = express.Router();
import { registerUser } from "../controllers/user.controller.js";

router.post('/auth/signup',registerUser)


export default router;
