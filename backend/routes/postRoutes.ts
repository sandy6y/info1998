import { Router, Request, Response } from "express";
import {
    Post,
    CreatePostRequest,
    Comment,
    CreateCommentRequest,
    Like
} from "@full-stack/types";
import {
    getUserPosts,
    getPostById,
    createPost,
    togglePostReveal,
    deletePost,
    togglePostLike,
    getPostLikes,
    getPostComments,
    addComment,
    deleteComment
} from "../services/postService";

const router: Router = Router();

// ===== POST ROUTES =====

/**
 * GET /posts
 * Get all posts from all users (for the main feed)
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const { db } = await import("../firebaseConfig");
        const postsCollection = db.collection("posts");
        const usersCollection = db.collection("users");
        const { figureLibrary } = await import("../figureData");

        const snapshot = await postsCollection.orderBy("createdAt", "desc").limit(50).get();

        if (snapshot.empty) {
            return res.json([]);
        }

        const posts = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const postData = doc.data();

                // Get user data
                let userData;
                try {
                    const userDoc = await usersCollection.doc(postData.userId).get();
                    userData = userDoc.data();
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }

                // Get figure data
                const figure = figureLibrary[postData.figureId];

                return {
                    id: doc.id,
                    ...postData,
                    userDisplayName: userData?.displayName || "Unknown User",
                    userProfilePic: userData?.photoURL || undefined,
                    figureSeries: figure?.series || "Unknown",
                    figureOrder: parseInt((postData.figureId || "").split('-').pop() || "0"),
                    likesCount: postData.likesCount || 0,
                    commentsCount: postData.commentsCount || 0
                };
            })
        );

        res.json(posts);
    } catch (error) {
        console.error("Get all posts error:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

/**
 * GET /posts/user/:userId
 * Get all posts from a specific user
 * Used to display user's figure posts on their profile
 */
router.get("/user/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const posts = await getUserPosts(userId);
        res.json(posts);
    } catch (error) {
        console.error("Get user posts error:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

/**
 * GET /posts/:postId
 * Get a specific post by ID
 */
router.get("/:postId", async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const post = await getPostById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json(post);
    } catch (error) {
        console.error("Get post error:", error);
        res.status(404).json({ error: "Post not found" });
    }
});

/**
 * POST /posts
 * Create a new post with a figure image
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const { userId, figureId, imageUrl, caption, isRevealed } = req.body;

        const newPost = await createPost({
            userId,
            figureId,
            imageUrl,
            caption,
            isRevealed: isRevealed || false
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Create post error:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
});

/**
 * PUT /posts/:postId/reveal
 * Toggle the reveal status of a post
 * Implements the reveal feature - posts start grey and reveal image when clicked
 */
router.put("/:postId/reveal", async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const updatedPost = await togglePostReveal(postId);
        res.json(updatedPost);
    } catch (error: any) {
        console.error("Reveal post error:", error);
        if (error.message === "Post not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: "Failed to reveal post" });
    }
});

/**
 * DELETE /posts/:postId
 * Delete a post
 */
router.delete("/:postId", async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        await deletePost(postId);
        res.json({
            message: "Post deleted successfully",
            postId
        });
    } catch (error: any) {
        console.error("Delete post error:", error);
        if (error.message === "Post not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: "Failed to delete post" });
    }
});

// ===== LIKE ROUTES =====

/**
 * POST /posts/:postId/like
 * Toggle like on a post (like if not liked, unlike if already liked)
 */
router.post("/:postId/like", async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        const result = await togglePostLike(postId, userId);
        res.json(result);
    } catch (error: any) {
        console.error("Toggle like error:", error);
        if (error.message === "Post not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: "Failed to toggle like" });
    }
});

/**
 * GET /posts/user/:userId/likes
 * Get all post IDs that a user has liked
 */
router.get("/user/:userId/likes", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { db } = await import("../firebaseConfig");
        const likesCollection = db.collection("likes");

        const snapshot = await likesCollection
            .where("userId", "==", userId)
            .get();

        const likedPostIds = snapshot.docs.map(doc => doc.data().postId);
        res.json(likedPostIds);
    } catch (error) {
        console.error("Get user likes error:", error);
        res.status(500).json({ error: "Failed to fetch user likes" });
    }
});

/**
 * GET /posts/:postId/likes
 * Get all users who liked a post
 */
router.get("/:postId/likes", async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const likes = await getPostLikes(postId);
        res.json(likes);
    } catch (error) {
        console.error("Get likes error:", error);
        res.status(500).json({ error: "Failed to fetch likes" });
    }
});

// ===== COMMENT ROUTES =====

/**
 * GET /posts/:postId/comments
 * Get all comments for a post
 */
router.get("/:postId/comments", async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const comments = await getPostComments(postId);
        res.json(comments);
    } catch (error) {
        console.error("Get comments error:", error);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
});

/**
 * POST /posts/:postId/comments
 * Add a comment to a post
 */
router.post("/:postId/comments", async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { userId, text } = req.body;

        const newComment = await addComment({
            postId,
            userId,
            text
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error("Create comment error:", error);
        res.status(500).json({ error: "Failed to create comment" });
    }
});

/**
 * DELETE /comments/:commentId
 * Delete a comment
 */
router.delete("/comments/:commentId", async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;

        await deleteComment(commentId);
        res.json({
            message: "Comment deleted successfully",
            commentId
        });
    } catch (error: any) {
        console.error("Delete comment error:", error);
        if (error.message === "Comment not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: "Failed to delete comment" });
    }
});

export default router;
