import { Router } from "express"
import { createNewUser, deleteUser, getAllUsers, updateUser, getSingleUser } from "./userController.js"

import verifyToken from "../../Middlewares/verifyToken.js"
import checkRole from "../../Middlewares/checkRole.js"
import checkMail from "../../Middlewares/checkMail.js"


const userRoutes = Router()


userRoutes.post("/users", checkMail , verifyToken, checkRole(["admin"]), createNewUser)

userRoutes.get("/users", verifyToken, checkRole(["admin"]), getAllUsers)

userRoutes.get("/users/:id", verifyToken, getSingleUser)

userRoutes.put("/users/:id", verifyToken, updateUser)

userRoutes.delete("/users/:id", verifyToken, deleteUser)




export default userRoutes