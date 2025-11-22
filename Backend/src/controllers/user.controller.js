import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser  = async(req,res)=>{

    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
           return res.status(400).json({
             success:false,
             message:"Name, email, and password are required"
           })
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(400).json({
                success:false,
                message:"Email already registered",
            })
        }

        const hashedPassword  = await bcrypt.hash(password,10);

        const newUser = await User.create({
            name,
            email, 
            password:hashedPassword,
            avatar:"https://res.cloudinary.com/dgrxeqayx/image/upload/v1763826800/user_nkqqfm.png"
        })

        await newUser.save()
       res.status(200).json({success:true,message:'User created successfully',user:newUser})
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Server error' });
    }

}