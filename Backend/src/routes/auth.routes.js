import express from "express";
const router = express.Router();
import { registerUser, userLogin } from "../controllers/user.controller.js";

router.post('/auth/signup',registerUser)
router.post('/auth/login',userLogin)


export default router;
