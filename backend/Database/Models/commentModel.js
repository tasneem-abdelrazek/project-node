
import db from "../dbConnection.js";

// Firestore collection for comments
const commentCollection = db.collection("comments");

// Example comment document structure:
// {
//   postId: string, // ID of the post this comment belongs to
//   userId: string, // ID of the user who wrote the comment
//   content: string, // Comment text
//   createdAt: Timestamp,
//   updatedAt: Timestamp
// }

export default commentCollection;
