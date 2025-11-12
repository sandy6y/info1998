import path from "path";
import express, { Express } from "express";
import cors from "cors";
import { WeatherResponse } from "@full-stack/types";
import fetch from "node-fetch";

// Import route handlers
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import collectionRoutes from "./routes/collectionRoutes";
import postRoutes from "./routes/postRoutes";

const app: Express = express();

const hostname = "0.0.0.0";
const port = 8080;

app.use(cors());
app.use(express.json());

// ===== POPMART COLLECTION API ROUTES =====

// Authentication routes
// POST /auth/signup - Register new user
// POST /auth/login - Login with email/password
// POST /auth/google - Login with Google OAuth
// GET /auth/me - Get current user
app.use("/auth", authRoutes);

// User routes
// GET /users/rankings - Get all users ranked by collection size
// GET /users/:userId - Get user profile
// PUT /users/:userId - Update user profile
app.use("/users", userRoutes);

// Collection routes
// GET /collections/:userId - Get user's collection
// GET /collections/:userId/by-series - Get collection organized by series
// POST /collections/:userId/figures - Add figure to collection
// DELETE /collections/:userId/figures/:figureId - Remove figure from collection
// PUT /collections/:userId/reorder - Reorder figures in collection
// GET /figures/all - Get all available figures
// GET /figures/series/:seriesName - Get figures by series
app.use("/collections", collectionRoutes);

// Post routes (includes likes and comments)
// GET /posts/user/:userId - Get all posts from a user
// GET /posts/:postId - Get specific post
// POST /posts - Create new post
// PUT /posts/:postId/reveal - Toggle reveal status
// DELETE /posts/:postId - Delete post
// POST /posts/:postId/like - Toggle like on post
// GET /posts/:postId/likes - Get all likes for post
// GET /posts/:postId/comments - Get all comments for post
// POST /posts/:postId/comments - Add comment to post
// DELETE /comments/:commentId - Delete comment
app.use("/posts", postRoutes);

// ====== (below are template) =====

type WeatherData = {
    latitude: number;
    longitude: number;
    timezone: string;
    timezone_abbreviation: string;
    current: {
        time: string;
        interval: number;
        precipitation: number;
    };
};

app.get("/weather", async (req, res) => {
    console.log("GET /api/weather was called");
    try {
        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=40.7411&longitude=73.9897&current=precipitation&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=America%2FNew_York&forecast_days=1"
        );
        const data = (await response.json()) as WeatherData;
        const output: WeatherResponse = {
            raining: data.current.precipitation > 0.5,
        };
        res.json(output);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Popmart Collection API is running" });
});

app.listen(port, hostname, () => {
    console.log(`Server listening on http://${hostname}:${port}`);
    console.log("Popmart Collection API ready!");
});
