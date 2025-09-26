import { Router } from "express"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"
import {signup, login, verifyEmail } from "./authController.js"
import checkMail from "../../Middlewares/checkMail.js"

// Cloudinary + Multer
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({ cloudinary, params: { folder: "user_profiles", allowed_formats: ["jpg","png","jpeg"] } })
const upload = multer({ storage })



const authRoutes = Router()
// Routes
authRoutes.post("/signup", checkMail, upload.single("profileImage"), signup) // الصورة اختيارية
authRoutes.get("/verify-email", verifyEmail)
authRoutes.post("/login", login)

export default authRoutes

