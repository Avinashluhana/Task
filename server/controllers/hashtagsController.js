const driver = require("../config/db"); // Import the driver from the config file

// Controller function to get top hashtags for a user
const getHashtags = async (req, res) => {
  const { screenName } = req.params;

  const query = `
    MATCH (u:User {screen_name: $screenName})<-[:MENTIONS]-(t:Tweet)-[:TAGS]->(h:Hashtag)
    RETURN h.name as hashtag
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query, { screenName });
    const hashtags = result.records.map((record) => ({
      hashtag: record.get("hashtag"),
    }));
    res.status(200).json(hashtags);
  } catch (error) {
    console.error("Error fetching hashtags:", error);
    res.status(500).json({ error: "Error fetching hashtags" });
  } finally {
    await session.close();
  }
};
// Get hashtags related to a tweet
const getTweetHashtags = async (req, res) => {
  const { tweetId } = req.params;

  const query = `
      MATCH (t:Tweet {id: $tweetId})-[:TAGS]->(h:Hashtag)
      RETURN t.id, t.content, COLLECT(h.name) AS hashtags;
    `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });
  try {
    const result = await session.run(query, { tweetId });

    if (result.records.length > 0) {
      const hashtags = result.records[0].get("hashtags");
      res.status(200).json({ tweetId, hashtags });
    } else {
      res.status(404).json({ error: "No hashtags found for tweet" });
    }
  } catch (error) {
    console.error("Error fetching tweet hashtags:", error);
    res.status(500).json({ error: "Error fetching tweet hashtags" });
  } finally {
    await session.close();
  }
};

const getTrendingHashtags = async (req, res) => {
  const query = `
    MATCH (tweet:Tweet)-[:TAGS]->(hashtag:Hashtag)
    WHERE hashtag.name IS NOT NULL
    WITH hashtag.name AS hashtag, COUNT(tweet) AS tweetCount
    ORDER BY tweetCount DESC
    LIMIT 5
    RETURN hashtag, tweetCount
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });
  try {
    const result = await session.run(query);

    const hashtags = result.records.map((record) => ({
      hashtag: record.get("hashtag"),
      tweetCount: record.get("tweetCount").toInt(),
    }));
    res.status(200).json(hashtags);
  } catch (error) {
    console.error("Error fetching trending hashtags:", error);
    res.status(500).json({ error: "Error fetching trending hashtags" });
  } finally {
    await session.close();
  }
};
// Controller function to get the total number of hashtags
const getTotalHashtags = async (req, res) => {
  const query = `
    MATCH (t:Tweet)-[:TAGS]->(h:Hashtag)
    RETURN COUNT(h) AS totalHashtags
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query);

    // If hashtags are found, return the count
    if (result.records.length > 0) {
      const totalHashtags = result.records[0].get("totalHashtags").toInt(); // Extract and convert the result to an integer
      res.status(200).json({ totalHashtags });
    } else {
      res.status(404).json({ error: "No hashtags found" });
    }
  } catch (error) {
    console.error("Error fetching total hashtags:", error);
    res.status(500).json({ error: "Error fetching total hashtags" });
  } finally {
    await session.close();
  }
};

module.exports = {
  getHashtags,
  getTweetHashtags,
  getTrendingHashtags,
  getTotalHashtags,
};
