import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
  name:{
    type:String,
    required: true,
    trim: true,
  },
  price:{
    type:Number,
    required: true,
  },
  description:{
    type:String,
    required: true,
    trim: true,
  },
  category:{
    type:String,
    required: true,
    trim: true,
  },
  brand:{
    type:String,
    required: true,
    trim: true,
  },
  stock:{
    type:Number,
    required: true,
  },
  image:{
    type:[String],
    required: true,
    trim: true,
  },
  rating: {
  type: Number,
  default: 0
},
},
  {timestamps:true}
);


export default mongoose.model("Product",productSchema);