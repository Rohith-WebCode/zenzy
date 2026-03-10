import express from "express";
const router = express.Router();
import { registerUser, userLogin,logoutUser,getMe,updateUser } from "../controllers/user.controller.js";
import { userProtect } from "../middlewares/userProtect.js";

router.post('/auth/signup',registerUser)
router.post('/auth/login',userLogin)
router.post('/auth/logout',logoutUser)
router.get('/me', userProtect, getMe);
router.put('/update', userProtect,updateUser);

export default router;
