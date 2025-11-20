import dotenv from "dotenv";
import connectDB  from "./src/config/db.js"
import app from "./src/app.js"
dotenv.config();
connectDB()



app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});