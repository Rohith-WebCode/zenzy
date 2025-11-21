import express from 'express'
import dotenv from "dotenv";
import cors from "cors"
import cookieParser  from "cookie-parser";
import morgan from "morgan";
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))


app.get('/api',authRoutes)


export default app; 