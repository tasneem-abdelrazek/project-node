

import { Router } from "express"
import { createNewPost, getAllPosts, updatePost, deletePost } from "./postController.js"
import verifyToken from "../../Middlewares/verifyToken.js"

const PostRoutes = Router()

// Create new post 
PostRoutes.post("/posts", verifyToken, createNewPost)

// Get all posts 
PostRoutes.get("/posts", getAllPosts)

// Update post
PostRoutes.put("/posts/:id", verifyToken, updatePost)

// Delete post
PostRoutes.delete("/posts/:id", verifyToken, deletePost)

export default PostRoutes
