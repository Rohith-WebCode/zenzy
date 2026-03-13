import express from 'express'
import dotenv from "dotenv";
import cors from "cors"
import cookieParser  from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js"
import productRoutes from "./routes/product.Routes.js"
const app = express()



app.use(cookieParser());
// app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => res.send('Hello World!'))


app.use('/api',authRoutes)
app.use('/api',productRoutes)


export default app; 