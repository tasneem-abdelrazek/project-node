
import commentCollection from "../../Database/Models/commentModel.js";
import admin from "firebase-admin";

// Add a comment to a post
export const addComment = async (req, res) => {
	try {
		const { postId, content } = req.body;
		const userId = req.user.userId;
		const newComment = {
			postId,
			userId,
			content,
			// createdAt: admin.firestore.FieldValue.serverTimestamp(),
			// updatedAt: admin.firestore.FieldValue.serverTimestamp(),
		};
		const docRef = await commentCollection.add(newComment);
		res.status(201).json({ msg:"new comment",id: docRef.id, ...newComment });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Edit a comment (owner only)
export const editComment = async (req, res) => {
	try {
		const { id } = req.params;
		const { content } = req.body;
		const userId = req.user.userId; // Use userId from JWT
		const commentDoc = await commentCollection.doc(id).get();
		if (!commentDoc.exists) return res.status(404).json({ error: "Comment not found" });
		const comment = commentDoc.data();
		if (comment.userId !== userId) return res.status(403).json({ error: "Not authorized" });
		await commentCollection.doc(id).update({
			content,
			updatedAt: admin.firestore.FieldValue.serverTimestamp(),
		});
		res.json({ message: "Comment updated" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Delete a comment (owner only)
export const deleteComment = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.userId; // Use userId from JWT
		const commentDoc = await commentCollection.doc(id).get();
		if (!commentDoc.exists) return res.status(404).json({ error: "Comment not found" });
		const comment = commentDoc.data();
		if (comment.userId !== userId) return res.status(403).json({ error: "Not authorized" });
		await commentCollection.doc(id).delete();
		res.json({ message: "Comment deleted" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Delete any comment (Admins)
export const adminDeleteComment = async (req, res) => {
	try {
		const { id } = req.params;
		await commentCollection.doc(id).delete();
		res.json({ message: "Comment deleted by admin" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
