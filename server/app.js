const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(express.json()); // Middleware to parse incoming JSON requests
app.use(cors()); // Middleware to enable Cross-Origin Resource Sharing (CORS)

// Routes setup
const hashtagRoutes = require("./routes/hashtags");
const tweetRoutes = require("./routes/tweetRoutes");
const userRoutes = require("./routes/userRoutes");
// Define API routes and associate them with the appropriate route files
app.use("/api/hashtags", hashtagRoutes); // Hashtag-related routes under /api/hashtags
app.use("/api/users", userRoutes); // User-related routes under /api/users
app.use("/api/tweets", tweetRoutes); // Tweet-related routes under /api/tweets

module.exports = app;
