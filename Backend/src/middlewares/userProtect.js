import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const userProtect = async (req, res, next) => {
  // console.log(req.cookies.token);
  try {
    const token = req.cookies.token;
    // console.log(token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
