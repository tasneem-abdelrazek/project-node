

import { Router } from "express"
import { createNewPost, getAllPosts, updatePost, deletePost } from "./postController.js"
import verifyToken from "../../Middlewares/verifyToken.js"
import checkRole from "../../Middlewares/checkRole.js"

const PostRoutes = Router()

// Create Post
PostRoutes.post("/posts", verifyToken, createNewPost);
// Get All Posts
PostRoutes.get("/posts", getAllPosts);
// Update Post
PostRoutes.put("/posts/:id", verifyToken, checkRole(["admin", "user"]), updatePost);
// Delete Post
PostRoutes.delete("/posts/:id", verifyToken, checkRole(["admin", "user"]), deletePost);


export default PostRoutes
