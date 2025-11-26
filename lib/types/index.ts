// Shared types across both frontend and backend!

export type WeatherResponse = {
    raining: boolean;
};

// ===== User Types =====
export interface User {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
    createdAt: string;
}

export interface UserProfile extends User {
    collectionCount: number;
    collections: UserCollection[];
}

// ===== Series & Figure Types =====
export type SeriesName = 'Skull Panda' | 'Hirono' | 'Labubu';

export interface Figure {
    id: string;
    name: string;
    series: SeriesName;
    imageUrl: string;
    description?: string;
}

export interface FigureLibrary {
    [key: string]: Figure;
}

// ===== Collection Types =====
export interface CollectedFigure {
    figureId: string;
    collectedAt: string;
    order: number;
    userImageUrl?: string; // User's uploaded image of their figure?
    isRevealed: boolean; // For the reveal feature
}

export interface UserCollection {
    userId: string;
    figures: CollectedFigure[];
    updatedAt: string;
}

export interface CollectionBySeries {
    series: SeriesName;
    figures: CollectedFigure[];
    count: number;
}

// ===== Post Types =====
export interface Post {
    id: string;
    userId: string;
    figureId: string;
    imageUrl: string;
    caption?: string;
    isRevealed: boolean;
    likeCount: number;
    commentCount: number;
    createdAt: string;
}

// ===== Like Types =====
export interface Like {
    id: string;
    postId: string;
    userId: string;
    createdAt: string;
}

// ===== Comment Types =====
export interface Comment {
    id: string;
    postId: string;
    userId: string;
    userName: string;
    userProfilePicUrl?: string;
    content: string;
    createdAt: string;
}

// ===== Ranking Types =====
export interface UserRanking {
    rank: number;
    user: User;
    collectionCount: number;
}

// ===== API Request/Response Types =====
export interface AuthSignupRequest {
    email: string;
    password: string;
    displayName: string;
}

export interface AuthLoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface GoogleAuthRequest {
    idToken: string;
}

export interface AddFigureRequest {
    figureId: string;
    userImageUrl?: string;
}

export interface ReorderCollectionRequest {
    figureOrders: { figureId: string; order: number }[];
}

export interface CreatePostRequest {
    figureId: string;
    imageUrl: string;
    caption?: string;
}

export interface CreateCommentRequest {
    content: string;
}
