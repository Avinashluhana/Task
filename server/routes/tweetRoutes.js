const express = require("express");
const {
  getAllTweets,
  getTweetsByUser,
  getRetweets,
  getMentions,
  getLinksInTweets,
  getTweetHierarchy,
  getTweetDetails,
  getTweetsWithRetweets,
  getTrendingTweetsByFav,
  getMonthlyTweets,
  getTotalRetweets,
  getTotalTweets,
} = require("../controllers/tweetController");
const router = express.Router();

// Route to get all tweets
router.get("/tweets", getAllTweets);

// Route to get tweets by a specific user (by screen name)
router.get("/:screenName", getTweetsByUser);

// Route to get retweets of a specific user's tweets
router.get("/:screenName/retweets", getRetweets);

// Route to get mentions of a specific user
router.get("/:screenName/mentions", getMentions);

// Route to get the hierarchy of replies for a specific tweet (thread)
router.get("/:tweetId/hira", getTweetHierarchy);

// Route to get detailed information about a specific tweet
router.get("/:tweetId/details", getTweetDetails);

// Route to get all links contained in tweets (like URLs or hashtags)
router.get("/links", getLinksInTweets);

// New route to get all tweets with replies (no parameters provided, likely fetches tweets with replies data)
router.get("/replies", (req, res) => {
  getAllTweetsWithReplies(req, res);
});

// Route to get trending tweets sorted by the number of favorites (likes)
router.get("/tweets/trending-tweets-fav", getTrendingTweetsByFav);

// Route to get tweets sorted by retweets, showing popular ones
router.get("/tweets/trending-tweets-retweets", getTweetsWithRetweets);

// Route to get monthly data about tweets (e.g., stats per month)
router.get("/tweets/tweets-monthly", getMonthlyTweets);

// Route to total tweets
router.get("/tweets/total-tweets", getTotalTweets);

// Route to total retweets
router.get("/tweets/total-retweets", getTotalRetweets);

module.exports = router;
