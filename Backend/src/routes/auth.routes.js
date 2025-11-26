import express from "express";
const router = express.Router();
import { registerUser, userLogin,logoutUser } from "../controllers/user.controller.js";

router.post('/auth/signup',registerUser)
router.post('/auth/login',userLogin)
router.post('/auth/logout',logoutUser)


export default router;
