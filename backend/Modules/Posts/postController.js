
import postsCollection from "../../Database/Models/postModel.js"

// Create Post
const createNewPost = async (req, res) => {
  try {
    const defaultPostImg ="https://uyjtpceeqsxyeynxtsfw.supabase.co/storage/v1/object/public/Profile-Imgs/post.png"
    const { content, postImg } = req.body
    const creator = req.user.userId   

    const newPost = await postsCollection.add({
      creator,
      createdAt: new Date(),
      content,
      postImg: postImg || defaultPostImg
    })

    res.send({ id: newPost.id, message: "Post Created", newPost })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

// Get All Posts
const getAllPosts = async (req, res) => {
  try {
    const snapshot = await postsCollection.get()

    const posts = []
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() })
    })

    res.send(posts)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

// Update Post
const updatePost = async (req, res) => {
  try {
    const postRef = postsCollection.doc(req.params.id);
    const doc = await postRef.get();

    if (!doc.exists) {
      return res.status(404).send({ error: "Post not found" });
    }

    const post = doc.data();

    // If user is not admin, check ownership
    if (req.user.role !== "admin" && post.creator !== req.user.userId) {
      return res.status(403).send({ error: "Forbidden: You can only update your own posts" });
    }

    await postRef.update(req.body);
    res.send("Post Updated");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Delete Post
const deletePost = async (req, res) => {
  try {
    const postRef = postsCollection.doc(req.params.id);
    const doc = await postRef.get();

    if (!doc.exists) {
      return res.status(404).send({ error: "Post not found" });
    }

    const post = doc.data();

    // If user is not admin, check ownership
    if (req.user.role !== "admin" && post.creator !== req.user.userId) {
      return res.status(403).send({ error: "Forbidden: You can only delete your own posts" });
    }

    await postRef.delete();
    res.send("Post Deleted");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export { createNewPost, getAllPosts, updatePost, deletePost }
