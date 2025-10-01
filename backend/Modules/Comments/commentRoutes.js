
import express from "express";
import verifyToken from "../../Middlewares/verifyToken.js";
import checkRole from "../../Middlewares/checkRole.js";
import {
	addComment,
	editComment,
	deleteComment,
	adminDeleteComment
} from "./commentController.js";

const commentRouter = express.Router();

// Add a comment to a post (authenticated users)
commentRouter.post("/", verifyToken, addComment);

// Edit a comment (owner only)
commentRouter.put("/:id", verifyToken, editComment);

// Delete a comment (owner only)
commentRouter.delete("/:id", verifyToken, deleteComment);

// Delete any comment (Admins only)
commentRouter.delete("/admin/:id", verifyToken, checkRole(["admin"]), adminDeleteComment);

export default commentRouter;
