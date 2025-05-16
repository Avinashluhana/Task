const express = require("express");
const {
  getAllUsers,
  getUserProfile,
  getUserMentions,
  getUserFollowRelations,
  getUserSources,
  getUserTweetRelations,
  getUserStats,
  getTrendingHashtags,
  getTrendingUsersByFollowers,
  getUserFollowStats,
  getMostMentionedUsers,
} = require("../controllers/userController");
const router = express.Router();

// Route to get all users
router.get("/", getAllUsers);

// Route to get the profile of a specific user by their screen name
router.get("/:screenName", getUserProfile);

// Route to get mentions of a user by their screen name
router.get("/:screenName/mentions", getUserMentions);

// Route to get a user's following and followers relationships
router.get(
  "/:screenName/relations/following-followers",
  getUserFollowRelations
);

// Route to get a user's tweet sources (e.g., mobile, web)
router.get("/:screenName/relations/sources", getUserSources);

// Route to get a user's tweet relations (whether posted or retweeted)
router.get("/:screenName/relations/tweets", getUserTweetRelations);

// Route to get a user's overall statistics (e.g., followers, tweet count)
router.get("/:screenName/stats", getUserStats);

// Route to get trending hashtags that a user is associated with
router.get("/:screenName/trending-hashtags", getTrendingHashtags);

// Route to get trending users based on their followers count
router.get("/users/trending-user/", getTrendingUsersByFollowers);

// Route to get the most mentioned users in the system
router.get("/users/most-mentioned/", getMostMentionedUsers);

// Route to get a user's follow stats (e.g., number of followers/following)
router.get("/:screenName/follow-stats", getUserFollowStats);

module.exports = router;
