import { db } from "../firebaseConfig";
import { User, UserProfile, UserRanking } from "@full-stack/types";

const usersCollection = db.collection("users");

/**
 * Create or update a user in Firestore
 */
export async function createOrUpdateUser(user: User): Promise<User> {
    await usersCollection.doc(user.id).set(user, { merge: true });
    return user;
}

/**
 * Get a user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
    const doc = await usersCollection.doc(userId).get();
    if (!doc.exists) {
        return null;
    }
    return doc.data() as User;
}

/**
 * Get user profile with collection count
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const userDoc = await usersCollection.doc(userId).get();
    if (!userDoc.exists) {
        return null;
    }

    const user = userDoc.data() as User;

    // Get user's collections
    const collectionsSnapshot = await db
        .collection("collections")
        .where("userId", "==", userId)
        .get();

    const collections = collectionsSnapshot.docs.map(doc => doc.data());
    const collectionCount = collections.reduce(
        (sum, col: any) => sum + (col.figures?.length || 0),
        0
    );

    return {
        ...user,
        collectionCount,
        collections: collections as any[]
    };
}

/**
 * Update user profile (displayName, photoURL)
 */
export async function updateUserProfile(
    userId: string,
    updates: Partial<Pick<User, "displayName" | "photoURL">>
): Promise<User | null> {
    const userRef = usersCollection.doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
        return null;
    }

    await userRef.update(updates);
    const updated = await userRef.get();
    return updated.data() as User;
}

/**
 * Get all users ranked by collection size
 */
export async function getUserRankings(): Promise<UserRanking[]> {
    // Get all users
    const usersSnapshot = await usersCollection.get();
    const users = usersSnapshot.docs.map(doc => doc.data() as User);

    // Get collection counts for each user
    const userCounts = await Promise.all(
        users.map(async (user) => {
            const collectionsSnapshot = await db
                .collection("collections")
                .where("userId", "==", user.id)
                .get();

            const collectionCount = collectionsSnapshot.docs.reduce(
                (sum, doc) => {
                    const data = doc.data();
                    return sum + (data.figures?.length || 0);
                },
                0
            );

            return { user, collectionCount };
        })
    );

    // Sort by collection count descending
    userCounts.sort((a, b) => b.collectionCount - a.collectionCount);

    // Add ranks
    return userCounts.map((item, index) => ({
        rank: index + 1,
        user: item.user,
        collectionCount: item.collectionCount
    }));
}
