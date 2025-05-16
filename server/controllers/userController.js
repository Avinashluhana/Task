const driver = require("../config/db");
// get all the users data
const getAllUsers = async (req, res) => {
  // Total users query
  const query = `
    MATCH (u:User)
    RETURN COUNT(u) AS totalUsers
    LIMIT 1
  `;
  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query);

    // Retrieve the total number of users
    const totalUsers = result.records[0].get("totalUsers").toInt();

    // Fetch the user details
    const userQuery = `
      MATCH (u:User)
      RETURN u AS user
      LIMIT 50
    `;

    const userResult = await session.run(userQuery);

    const users = userResult.records.map((record) => {
      const user = record.get("user").properties;
      return {
        name: user.name,
        screen_name: user.screen_name,
        followers: user.followers,
        following: user.following,
        location: user.location,
        profile_image_url: user.profile_image_url,
        url: user.url,
        betweenness: user.betweenness,
      };
    });

    // Send both totalUsers and user data together
    res.status(200).json({ totalUsers, users });
  } catch (error) {
    // Handling different types of errors
    console.error("Error fetching users:", error);

    // If the error is related to the database (Neo4j)
    if (error.name === "Neo4jError") {
      res
        .status(500)
        .json({ error: "Internal server error while fetching user data." });
    }
  } finally {
    await session.close();
  }
};

// Controller function to get basic user profile
const getUserProfile = async (req, res) => {
  const { screenName } = req.params;

  const query = `
    MATCH (u:User {screen_name: $screenName})
    RETURN u.name AS name, u.screen_name AS screen_name, u.followers AS followers, u.following AS following, u.location AS location, u.profile_image_url AS profile_image_url
  `;
  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query, { screenName });
    if (result.records.length > 0) {
      const user = {
        name: result.records[0].get("name"),
        screen_name: result.records[0].get("screen_name"),
        followers: result.records[0].get("followers"),
        following: result.records[0].get("following"),
        location: result.records[0].get("location"),
        profile_image_url: result.records[0].get("profile_image_url"),
      };
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Error fetching user profile" });
  } finally {
    await session.close();
  }
};

const getUserMentions = async (req, res) => {
  const { screenName } = req.params;

  const query = `
      MATCH (u:User {screen_name: $screenName})<-[:MENTIONS]-(t:Tweet)
      RETURN t.text AS tweet, t.favorites AS favorites, t.retweets AS retweets LIMIT 5
    `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query, { screenName });

    const mentions = result.records.map((record) => {
      const favorites = record.get("favorites") || { low: 0, high: 0 };
      const retweets = record.get("retweets") || { low: 0, high: 0 };

      // If favorites and retweets are arrays, sum them up
      const favoritesCount = Array.isArray(favorites)
        ? favorites.reduce((a, b) => a + b, 0)
        : favorites.low + favorites.high;
      const retweetsCount = Array.isArray(retweets)
        ? retweets.reduce((a, b) => a + b, 0)
        : retweets.low + retweets.high;

      return {
        tweet: record.get("tweet"),
        favorites: favoritesCount,
        retweets: retweetsCount,
      };
    });

    res.status(200).json(mentions);
  } catch (error) {
    console.error("Error fetching mentions:", error);
    res.status(500).json({ error: "Error fetching mentions" });
  } finally {
    await session.close();
  }
};

// Get a user's following and followers relationships
const getUserFollowRelations = async (req, res) => {
  const { screenName } = req.params; // Extracting the screen name from the request parameters

  // Cypher query to get the user's following and followers relationships
  const query = `
    MATCH (u:User {screen_name: $screenName})
    OPTIONAL MATCH (u)-[:FOLLOWS]->(following:User)  // Fetching users followed by the specified user
    OPTIONAL MATCH (u)<-[:FOLLOWS]-(follower:User)  // Fetching users who follow the specified user
    RETURN COLLECT(DISTINCT following.name) AS following,  // Collecting the names of followed users
           COLLECT(DISTINCT follower.name) AS followers  // Collecting the names of followers
    LIMIT 10  // Limiting the result to 10 users for both followers and following
  `;

  // Starting a new session with the Neo4j database
  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query, { screenName });

    // Extracting the result from the query
    const records = result.records;

    // If results are available, extract the following and followers; otherwise, set them as empty arrays
    const followers = records.length > 0 ? records[0].get("followers") : [];
    const following = records.length > 0 ? records[0].get("following") : [];

    res.status(200).json({ followers, following });
  } catch (error) {
    // Handling errors and logging them to the console
    console.error("Error fetching followers and following:", error);

    res.status(500).json({ error: "Error fetching followers and following" });
  } finally {
    await session.close();
  }
};
// Get a user's tweet sources (mobile, web, etc.)
const getUserSources = async (req, res) => {
  const { screenName } = req.params;

  const query = `
    MATCH (u:User {screen_name: $screenName})-[:POSTS]->(t:Tweet)-[:USING]->(s:Source)
    RETURN u.screen_name, s.name AS source, COUNT(t) AS tweets_posted;
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });
  try {
    const result = await session.run(query, { screenName });

    if (result.records.length > 0) {
      const sources = result.records.map((record) => ({
        user: record.get("u.screen_name"),
        source: record.get("source"),
        tweetsPosted: record.get("tweets_posted"),
      }));
      res.status(200).json({ sources });
    } else {
      res.status(404).json({ error: "No sources found for user" });
    }
  } catch (error) {
    console.error("Error fetching tweet sources:", error);
    res.status(500).json({ error: "Error fetching tweet sources" });
  } finally {
    await session.close();
  }
};

// Get a user's tweet relations (posted or retweeted)
const getUserTweetRelations = async (req, res) => {
  const { screenName } = req.params;

  const query = `
    MATCH (u:User {screen_name: $screenName})-[:POSTS]->(t:Tweet)
    RETURN u.screen_name, t.id, t.content, 'POSTED' AS relation
    UNION
    MATCH (u:User {screen_name: $screenName})<-[:RETWEETS]-(t:Tweet)
    RETURN u.screen_name, t.id, t.content, 'RETWEETED' AS relation;
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });
  try {
    const result = await session.run(query, { screenName });

    if (result.records.length > 0) {
      const relations = result.records.map((record) => ({
        user: record.get("u.screen_name"),
        tweetId: record.get("t.id"),
        content: record.get("t.content"),
        relation: record.get("relation"),
      }));
      res.status(200).json({ relations });
    } else {
      res.status(404).json({ error: "No tweet relations found" });
    }
  } catch (error) {
    console.error("Error fetching user tweet relations:", error);
    res.status(500).json({ error: "Error fetching tweet relations" });
  } finally {
    await session.close();
  }
};

// Controller function to get stats like total tweets, retweets, and likes
const getUserStats = async (req, res) => {
  const { screenName } = req.params;

  const query = `
  MATCH (u:User {screen_name: $screenName})
  OPTIONAL MATCH (u)-[:POSTS]->(tweet:Tweet)
  OPTIONAL MATCH (tweet)-[:RETWEETS]->(rt:Tweet)
  OPTIONAL MATCH (tweet)-[:HAS_LIKED]->(like:User)
  OPTIONAL MATCH (tweet)-[:REPLY_TO]->(reply:Tweet)
  RETURN 
    COUNT(tweet) AS totalTweets,
    COUNT(rt) AS totalRetweets,
    COUNT(like) AS totalLikes,
    COUNT(reply) AS totalReplies
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query, { screenName });

    if (result.records.length > 0) {
      const stats = {
        totalTweets: result.records[0].get("totalTweets"),
        totalRetweets: result.records[0].get("totalRetweets"),
        totalLikes: result.records[0].get("totalLikes"),
        totalReplies: result.records[0].get("totalReplies"),
      };
      res.status(200).json(stats);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Error fetching user stats" });
  } finally {
    await session.close();
  }
};

const getTrendingHashtags = async (req, res) => {
  const { screenName } = req.params;

  const query = `
  MATCH (u:User {screen_name: $screenName})-[:POSTS]->(tweet:Tweet)-[:TAGS]->(hashtag:Hashtag)
  RETURN hashtag.text AS hashtag, COUNT(*) AS count
  ORDER BY count DESC
  LIMIT 10
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query, { screenName });

    if (result.records.length > 0) {
      const hashtags = result.records.map((record) => ({
        hashtag: record.get("hashtag"),
        count: record.get("count"),
      }));
      res.status(200).json(hashtags);
    } else {
      res.status(404).json({ error: "No hashtags found" });
    }
  } catch (error) {
    console.error("Error fetching trending hashtags:", error);
    res.status(500).json({ error: "Error fetching trending hashtags" });
  } finally {
    await session.close();
  }
};

// Trending Users based on followers
const getTrendingUsersByFollowers = async (req, res) => {
  const query = `
    MATCH (user:User)<-[:FOLLOWS]-(follower:User)
    WITH user, COUNT(follower) AS followersCount
    ORDER BY followersCount DESC
    LIMIT 3
    RETURN user.screen_name AS username, followersCount
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query);
    const trendingUsers = result.records.map((record) => ({
      username: record.get("username"),
      followersCount: record.get("followersCount").toInt(),
    }));
    res.status(200).json(trendingUsers);
  } catch (error) {
    console.error("Error fetching trending users based on followers:", error);
    res
      .status(500)
      .json({ error: "Error fetching trending users based on followers" });
  } finally {
    await session.close();
  }
};

const getUserFollowStats = async (req, res) => {
  const { screenName } = req.params;

  // Create a session to run the query
  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    // Query to fetch followers and following count
    const query = `
      MATCH (u:User)
      WHERE u.screen_name = $screenName
      RETURN u.followers AS Followers, u.following AS Following
    `;

    // Run the query and get the result
    const result = await session.run(query, { screenName });

    // Check if the result contains data
    if (result.records.length > 0) {
      const userDetails = result.records[0].toObject();
      res.status(200).json({
        followers: userDetails.Followers.low, // Handling Neo4j's low/high format for numbers
        following: userDetails.Following.low,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await session.close();
  }
};

const getMostMentionedUsers = async (req, res) => {
  const query = `
    MATCH (t:Tweet)-[:MENTIONS]->(mentionedUser:User)
    WITH mentionedUser, COUNT(*) AS mentionCount
    ORDER BY mentionCount DESC
    LIMIT 3
    RETURN mentionedUser.name AS username, mentionCount AS mostMentionCount
  `;
  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query);

    // Map the result to the required format
    const mostMentionedUsers = result.records.map((record) => {
      return {
        username: record.get("username"),
        mostMentionsCount: record.get("mostMentionCount").toInt(), // Ensure to use toInt for numerical fields
      };
    });

    // Send response in the desired format
    res.status(200).json(mostMentionedUsers);
  } catch (error) {
    console.error("Error fetching most mentioned users:", error);
    res.status(500).json({ error: "Error fetching most mentioned users" });
  } finally {
    await session.close();
  }
};

module.exports = {
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
};
