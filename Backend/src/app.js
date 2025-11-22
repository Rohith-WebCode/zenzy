import express from 'express'
import dotenv from "dotenv";
import cors from "cors"
import cookieParser  from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js"
const app = express()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => res.send('Hello World!'))


app.use('/api',authRoutes)


export default app; 