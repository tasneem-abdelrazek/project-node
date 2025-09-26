import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { v2 as cloudinary } from "cloudinary"
import usersCollection from "../../Database/Models/userModel.js"

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_123"
const EMAIL_SECRET = process.env.EMAIL_SECRET || "email_secret_123"

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

// Signup
const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body
    const hashedPassword = bcrypt.hashSync(password, 8)
    const profileImage = req.file ? req.file.path : null

    // generate email token
    const emailToken = jwt.sign({ email }, EMAIL_SECRET )
    const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${emailToken}`

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: "user",
      emailVerified: false,
      profileImage,
      createdAt: new Date(),
      emailToken
    }

    const userRef = await usersCollection.add(newUser)

    res.status(201).send({
      message: "User Created. Please verify your email.",
      userId: userRef.id,
      verificationLink, 
      user: newUser
    })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query
    if (!token) return res.status(400).send({ error: "Token is missing" })

    const decoded = jwt.verify(token, EMAIL_SECRET)
    const email = decoded.email

    const userSnapshot = await usersCollection.where("email", "==", email).get()
    if (userSnapshot.empty) return res.status(400).send({ error: "User not found" })

    const userDoc = userSnapshot.docs[0]
    await usersCollection.doc(userDoc.id).update({ emailVerified: true, emailToken: null })

    res.status(200).send({ message: "Email verified successfully" })
  } catch (err) {
    res.status(400).send({ error: "Invalid or expired token" })
  }
}

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const userSnapshot = await usersCollection.where("email", "==", email).get()
    if (userSnapshot.empty) return res.status(400).send({ error: "Email or password is incorrect" })

    const userDoc = userSnapshot.docs[0]
    const user = userDoc.data()

    const passwordIsValid = bcrypt.compareSync(password, user.password)
    if (!passwordIsValid) return res.status(400).send({ error: "Email or password is incorrect" })

    if (!user.emailVerified) return res.status(403).send({ error: "Please verify your email first" })

    // generate JWT
    const token = jwt.sign({ userId: userDoc.id, role: user.role }, JWT_SECRET )

    res.status(200).send({ message: "Login successful", token, userId: userDoc.id, user })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export { signup, login, verifyEmail }


