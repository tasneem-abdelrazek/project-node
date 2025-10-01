import dotenv from "dotenv"
import express from "express"
import authRoutes from "./Modules/Auth/authRoutes.js";
import userRoutes from "./Modules/Users/userRoutes.js";
import PostRoutes from "./Modules/Posts/postRoutes.js";
import commentRouter from "./Modules/Comments/commentRoutes.js";


dotenv.config()
 

const app = express();
app.use(express.json())
app.use(authRoutes)
app.use(userRoutes)
app.use(PostRoutes)
app.use("/comments", commentRouter);




app.listen(3000, () => {
    console.log("Server is running on port 3000")
})