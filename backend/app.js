import dotenv from "dotenv"
import express from "express"
import authRoutes from "./Modules/Auth/authRoutes.js";


dotenv.config()
 

const app = express();
app.use(express.json())
app.use(authRoutes)




app.listen(3000, () => {
    console.log("Server is running on port 3000")
})