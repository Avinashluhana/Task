const express = require("express");
const router = express.Router();
const {
  getHashtags,
  getTweetHashtags,
  getTrendingHashtags,
  getTotalHashtags,
} = require("../controllers/hashtagsController");

// API endpoint to get hashtags used by a given user (by their screen name)
router.get("/:screenName", getHashtags);

// Route to get hashtags associated with a specific tweet by tweetId
router.get("/:tweetId/hashtags", getTweetHashtags);

// Route to get currently trending hashtags
router.get("/hashtags/trending", getTrendingHashtags);

// Route to get the total number of hashtags used across all tweets
router.get("/hashtags/total-hashtags", getTotalHashtags);

module.exports = router;
