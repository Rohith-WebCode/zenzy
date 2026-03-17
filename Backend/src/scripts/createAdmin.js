import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

dotenv.config({ path: "../../.env" });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await User.create({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created successfully");
    process.exit();

  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();