## As of 11/21 -- MS3

## Firebase Setup for Google Authentication

### Prerequisites

1. Install Node.js and npm 
2. Create a Firebase project at Firebase Console

### Step 1: Enable Google Authentication in Firebase

1. Go to Firebase Console
2. Select the project
3. Navigate to Authentication, then Sign-in method
4. Enable Google as a sign-in provider
5. Add the domain to the authorized domains list

### Step 2: Get Firebase Admin SDK Credentials

1. In Firebase Console, go to Project Settings
2. Navigate to Service Accounts** tab
3. Click Generate New Private Key
4. Save the JSON file 

### Step 3: Configure Environment Variables

1. Create a `.env` file in the backend directory
2. Copy contents from `.env.example`:
3. Open the service account JSON file downloaded in Step 2
4. Fill in the Firebase credentials in the `.env` file:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

### Step 4: Install Dependencies

```bash
cd backend
npm install
```

### Step 5: Run the Server

```bash
npm run dev
```
---

## As of 11/12: MS2

### Authentication

- `POST /auth/signup` - Register user
- `POST /auth/login` - Login
- `POST /auth/google` - Google OAuth
- `GET /auth/me` - Get current user

### Users & Rankings

- `GET /users/rankings` - Get rankings by collection size
- `GET /users/:userId` - Get user profile
- `PUT /users/:userId` - Update profile

### Collections

- `GET /collections/:userId` - Get user's collection
- `GET /collections/:userId/by-series` - Collection by series
- `POST /collections/:userId/figures` - Add figure
- `DELETE /collections/:userId/figures/:figureId` - Remove figure
- `PUT /collections/:userId/reorder` - Reorder collection
- `GET /collections/figures/all` - Get all figures
- `GET /collections/figures/series/:seriesName` - Get figures by series

### Posts, Likes, Comments

- `GET /posts/user/:userId` - Get user's posts
- `GET /posts/:postId` - Get post
- `POST /posts` - Create post
- `PUT /posts/:postId/reveal` - Toggle reveal
- `DELETE /posts/:postId` - Delete post
- `POST /posts/:postId/like` - Toggle like
- `GET /posts/:postId/likes` - Get likes
- `GET /posts/:postId/comments` - Get comments
- `POST /posts/:postId/comments` - Add comment
- `DELETE /comments/:commentId` - Delete comment

## Figure Library

82 figures across 3 series (as of 11/12):

- **Skull Panda**: sp-001 to sp-039 (39 total)
  - The Paradox: 13 figures
  - Warmth: 13 figures
  - The Sound: 13 figures
- **Hirono**: hr-001 to hr-036 (36 total)
  - Reshape: 10 figures
  - Echo: 13 figures
  - Shelter: 13 figures
- **Labubu**: lb-001 to lb-007 (7 total)
  - Exciting Macaron: 7 figures
