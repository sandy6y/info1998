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
