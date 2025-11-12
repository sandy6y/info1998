import { Router, Request, Response } from "express";
import {
    Post,
    CreatePostRequest,
    Comment,
    CreateCommentRequest,
    Like
} from "@full-stack/types";

const router: Router = Router();

// ===== POST ROUTES =====

/**
 * GET /posts/user/:userId
 * Get all posts from a specific user
 * Used to display user's figure posts on their profile
 */
router.get("/user/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        // This is what we did for MS2: Implement get user posts logic
        const mockPosts: Post[] = [
            {
                id: "post-001",
                userId,
                figureId: "sp-001",
                imageUrl: "https://placeholder-url.com/post-image-1.jpg",
                caption: "My first Skull Panda!",
                isRevealed: true,
                likeCount: 15,
                commentCount: 3,
                createdAt: "2024-03-01T00:00:00Z"
            },
            {
                id: "post-002",
                userId,
                figureId: "hr-002",
                imageUrl: "https://placeholder-url.com/post-image-2.jpg",
                caption: "Cherry blossom edition",
                isRevealed: false,
                likeCount: 8,
                commentCount: 1,
                createdAt: "2024-03-10T00:00:00Z"
            }
        ];

        res.json(mockPosts);
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

        // This is what we did for MS2: Implement get post logic
        const mockPost: Post = {
            id: postId,
            userId: "user-001",
            figureId: "sp-001",
            imageUrl: "https://placeholder-url.com/post-image.jpg",
            caption: "My favorite figure!",
            isRevealed: true,
            likeCount: 20,
            commentCount: 5,
            createdAt: "2024-03-01T00:00:00Z"
        };

        res.json(mockPost);
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
        const { figureId, imageUrl, caption } = req.body;

        // This is what we did for MS2: Implement create post logic
        const newPost: Post = {
            id: `post-${Date.now()}`,
            userId: "user-001", // Should come from authenticated user
            figureId,
            imageUrl,
            caption,
            isRevealed: false, // Starts as not greyed-out
            likeCount: 0,
            commentCount: 0,
            createdAt: new Date().toISOString()
        };

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

        // This is what we did for MS2: Implement reveal toggle logic
        const updatedPost: Post = {
            id: postId,
            userId: "user-001",
            figureId: "sp-001",
            imageUrl: "https://placeholder-url.com/post-image.jpg",
            caption: "Now revealed!",
            isRevealed: true, // Changed to revealed
            likeCount: 10,
            commentCount: 2,
            createdAt: "2024-03-01T00:00:00Z"
        };

        res.json(updatedPost);
    } catch (error) {
        console.error("Reveal post error:", error);
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

        // This is what we did for MS2: Implement delete post logic
        res.json({
            message: "Post deleted successfully",
            postId
        });
    } catch (error) {
        console.error("Delete post error:", error);
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

        // This is what we did for MS2: Implement like toggle logic
        const mockResponse = {
            postId,
            liked: true, // true if just liked, false if unliked
            likeCount: 21
        };

        res.json(mockResponse);
    } catch (error) {
        console.error("Toggle like error:", error);
        res.status(500).json({ error: "Failed to toggle like" });
    }
});

/**
 * GET /posts/:postId/likes
 * Get all users who liked a post
 */
router.get("/:postId/likes", async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        // This is what we did for MS2: Implement get likes logic
        const mockLikes: Like[] = [
            {
                id: "like-001",
                postId,
                userId: "user-002",
                createdAt: "2024-03-02T00:00:00Z"
            },
            {
                id: "like-002",
                postId,
                userId: "user-003",
                createdAt: "2024-03-03T00:00:00Z"
            }
        ];

        res.json(mockLikes);
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

        // This is what we did for MS2: Implement get comments logic
        const mockComments: Comment[] = [
            {
                id: "comment-001",
                postId,
                userId: "user-002",
                userName: "Collector Friend",
                userProfilePicUrl: "https://placeholder-url.com/user2.jpg",
                content: "Amazing figure! Where did you get it?",
                createdAt: "2024-03-02T00:00:00Z"
            },
            {
                id: "comment-002",
                postId,
                userId: "user-003",
                userName: "Figure Fan",
                content: "I want this one too!",
                createdAt: "2024-03-03T00:00:00Z"
            }
        ];

        res.json(mockComments);
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
        const { content } = req.body;

        // This is what we did for MS2: Implement create comment logic
        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            postId,
            userId: "user-001", // Should come from authenticated user
            userName: "Current User",
            userProfilePicUrl: "https://placeholder-url.com/user.jpg",
            content,
            createdAt: new Date().toISOString()
        };

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

        // This is what we did for MS2: Implement delete comment logic
        res.json({
            message: "Comment deleted successfully",
            commentId
        });
    } catch (error) {
        console.error("Delete comment error:", error);
        res.status(500).json({ error: "Failed to delete comment" });
    }
});

export default router;
