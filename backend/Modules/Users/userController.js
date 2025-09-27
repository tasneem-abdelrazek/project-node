import bcrypt from "bcryptjs"
import usersCollection from "../../Database/Models/userModel.js"
import verifyToken from "../../Middlewares/verifyToken.js"

// Create new user (by Admin)
const createNewUser = async (req, res) => {
  try {
    const { name, email, password, role = "user", profilePicURL } = req.body
    const creator = req.user.userId

    if (!name || !email || !password) {
      return res.status(400).send({ error: "Name, email and password are required" })
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8)

    const defaultProfilePic = "https://uyjtpceeqsxyeynxtsfw.supabase.co/storage/v1/object/public/Profile-Imgs/profile-1.png"

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role, // admin can set user or admin
      emailVerified: true, // directly verified since Admin is creating
      profilePicURL: profilePicURL || defaultProfilePic,
      creator,
      createdAt: new Date()
    }

    const userRef = await usersCollection.add(newUser)

    res.status(201).send({
      message: "User created successfully",
      userId: userRef.id,
      user: newUser
    })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}


// Get All Users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const snapshot = await usersCollection.get()
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.status(200).send(users)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

// Get Single User (Self or Admin)
const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params

    // check self or admin
    if (req.user.userId !== id && req.user.role !== "admin") {
      return res.status(403).send({ error: "Forbidden: Not allowed" })
    }

    const doc = await usersCollection.doc(id).get()
    if (!doc.exists) return res.status(404).send({ error: "User not found" })

    res.status(200).send({ id: doc.id, ...doc.data() })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

// Update User (Self or Admin)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params

    if (req.user.userId !== id && req.user.role !== "admin") {
      return res.status(403).send({ error: "Forbidden: Not allowed" })
    }

    const { name, email, password, role } = req.body
    const updates = {}

    if (name) updates.name = name
    if (email) updates.email = email
    if (password) updates.password = bcrypt.hashSync(password, 8)

    // only admin can update role
    if (role && req.user.role === "admin") {
      updates.role = role
    }

    await usersCollection.doc(id).update(updates)
    res.status(200).send({ message: "User updated successfully" })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

// Delete User (Self or Admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    if (req.user.userId !== id && req.user.role !== "admin") {
      return res.status(403).send({ error: "Forbidden: Not allowed" })
    }

    await usersCollection.doc(id).delete()
    res.status(200).send({ message: "User deleted successfully" })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export { createNewUser, getAllUsers, getSingleUser, updateUser, deleteUser }