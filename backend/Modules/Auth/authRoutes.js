import { Router } from "express"
import {signup, login, verifyEmail } from "./authController.js"
import checkMail from "../../Middlewares/checkMail.js"


const authRoutes = Router()
// Routes
authRoutes.post("/signup", checkMail, signup)
authRoutes.get("/verify-email", verifyEmail)
authRoutes.post("/login", login)

export default authRoutes
