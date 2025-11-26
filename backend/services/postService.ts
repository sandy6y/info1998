import { db } from "../firebaseConfig";
import { figureLibrary } from "../figureData";

const postsCollection = db.collection("posts");
const likesCollection = db.collection("likes");
const commentsCollection = db.collection("comments");
const usersCollection = db.collection("users");

/**
 * Get all posts from a user
 */
export async function getUserPosts(userId: string) {
    try {
        const snapshot = await postsCollection
            .where("userId", "==", userId)
            .get();

        // If no posts, return empty array
        if (snapshot.empty) {
            return [];
        }

        // Enrich posts with user data and figure data
        const posts = await Promise.all(
            snapshot.docs.map(async (doc) => {
                try {
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
                        figureOrder: parseInt((postData.figureId || "").split('-').pop() || "0")
                    };
                } catch (err) {
                    console.error("Error enriching post:", err);
                    // Return basic post data if enrichment fails
                    return {
                        id: doc.id,
                        ...doc.data(),
                        userDisplayName: "Unknown User",
                        figureSeries: "Unknown",
                        figureOrder: 0
                    };
                }
            })
        );

        return posts;
    } catch (error) {
        console.error("Error in getUserPosts:", error);
        throw error;
    }
}

/**
 * Get a specific post
 */
export async function getPostById(postId: string) {
    const doc = await postsCollection.doc(postId).get();
    if (!doc.exists) {
        return null;
    }
    return { id: doc.id, ...doc.data() };
}

/**
 * Create a new post
 */
export async function createPost(postData: {
    userId: string;
    figureId: string;
    imageUrl?: string;
    caption?: string;
    isRevealed: boolean;
}) {
    const now = new Date().toISOString();
    const post = {
        ...postData,
        createdAt: now,
        updatedAt: now,
        likesCount: 0,
        commentsCount: 0
    };

    const docRef = await postsCollection.add(post);
    return { id: docRef.id, ...post };
}

/**
 * Toggle reveal status of a post
 */
export async function togglePostReveal(postId: string) {
    const postRef = postsCollection.doc(postId);
    const doc = await postRef.get();

    if (!doc.exists) {
        throw new Error("Post not found");
    }

    const data = doc.data();
    const newRevealStatus = !data?.isRevealed;

    await postRef.update({
        isRevealed: newRevealStatus,
        updatedAt: new Date().toISOString()
    });

    return { id: postId, ...data, isRevealed: newRevealStatus };
}

/**
 * Delete a post
 */
export async function deletePost(postId: string) {
    const postRef = postsCollection.doc(postId);
    const doc = await postRef.get();

    if (!doc.exists) {
        throw new Error("Post not found");
    }

    // Delete associated likes
    const likesSnapshot = await likesCollection
        .where("postId", "==", postId)
        .get();
    const likeBatch = db.batch();
    likesSnapshot.docs.forEach(doc => likeBatch.delete(doc.ref));
    await likeBatch.commit();

    // Delete associated comments
    const commentsSnapshot = await commentsCollection
        .where("postId", "==", postId)
        .get();
    const commentBatch = db.batch();
    commentsSnapshot.docs.forEach(doc => commentBatch.delete(doc.ref));
    await commentBatch.commit();

    // Delete the post
    await postRef.delete();

    return { success: true };
}

/**
 * Toggle like on a post
 */
export async function togglePostLike(postId: string, userId: string) {
    const likeId = `${userId}_${postId}`;
    const likeRef = likesCollection.doc(likeId);
    const doc = await likeRef.get();

    const postRef = postsCollection.doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
        throw new Error("Post not found");
    }

    if (doc.exists) {
        // Unlike
        await likeRef.delete();
        await postRef.update({
            likesCount: (postDoc.data()?.likesCount || 1) - 1
        });
        return { liked: false };
    } else {
        // Like
        await likeRef.set({
            postId,
            userId,
            createdAt: new Date().toISOString()
        });
        await postRef.update({
            likesCount: (postDoc.data()?.likesCount || 0) + 1
        });
        return { liked: true };
    }
}

/**
 * Get all likes for a post
 */
export async function getPostLikes(postId: string) {
    const snapshot = await likesCollection
        .where("postId", "==", postId)
        .get();

    return snapshot.docs.map(doc => doc.data());
}

/**
 * Get all comments for a post
 */
export async function getPostComments(postId: string) {
    const snapshot = await commentsCollection
        .where("postId", "==", postId)
        .orderBy("createdAt", "asc")
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Add a comment to a post
 */
export async function addComment(commentData: {
    postId: string;
    userId: string;
    text: string;
}) {
    const now = new Date().toISOString();
    const comment = {
        ...commentData,
        createdAt: now
    };

    const docRef = await commentsCollection.add(comment);

    // Update post's comment count
    const postRef = postsCollection.doc(commentData.postId);
    const postDoc = await postRef.get();
    if (postDoc.exists) {
        await postRef.update({
            commentsCount: (postDoc.data()?.commentsCount || 0) + 1
        });
    }

    return { id: docRef.id, ...comment };
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string) {
    const commentRef = commentsCollection.doc(commentId);
    const doc = await commentRef.get();

    if (!doc.exists) {
        throw new Error("Comment not found");
    }

    const data = doc.data();
    const postId = data?.postId;

    await commentRef.delete();

    // Update post's comment count
    if (postId) {
        const postRef = postsCollection.doc(postId);
        const postDoc = await postRef.get();
        if (postDoc.exists) {
            await postRef.update({
                commentsCount: Math.max((postDoc.data()?.commentsCount || 1) - 1, 0)
            });
        }
    }

    return { success: true };
}
