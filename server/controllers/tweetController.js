const driver = require("../config/db");
const screenName = "neo4j";
const getAllTweets = async (req, res) => {
  const query = `MATCH (t:Tweet) RETURN t LIMIT 50`;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query);

    const tweets = result.records.map((record) => {
      return record.get("t").properties;
    });

    res.status(200).json(tweets);
  } catch (error) {
    console.error("Error fetching all tweets:", error);
    res.status(500).json({ error: "Error fetching all tweets" });
  } finally {
    session.close();
  }
};

// Controller function to get tweets by a user
const getTweetsByUser = async (req, res) => {
  const { screenName } = req.params;

  const query = `
    MATCH (u:User {screen_name: $screenName})-[:POSTS]->(t:Tweet)
    RETURN t.text as tweet, t.favorites as favorites, t.retweets as retweets LIMIT 5
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query, { screenName });
    const tweets = result.records.map((record) => ({
      tweet: record.get("tweet"),
      favorites: record.get("favorites"),
      retweets: record.get("retweets"),
    }));

    if (tweets.length === 0) {
      return res.status(404).json({ message: "No tweets found for this user" });
    }

    res.status(200).json(tweets);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    res.status(500).json({ error: "Error fetching tweets" });
  } finally {
    session.close();
  }
};

const getRetweets = async (req, res) => {

  // Cypher query to fetch retweets with more than 0 retweets, ordered by most retweets
  const query = `
    MATCH (u:User {screen_name: $screenName})-[:POSTED]->(t:Tweet)
    WHERE t.retweets > 0
    RETURN t.tweet AS tweet, t.retweets AS retweets, t.favorites AS favorites
    ORDER BY t.retweets DESC
    LIMIT 10
  `;

  // Create a session to interact with the Neo4j database
  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query, { screenName });

    // Map through the result records and structure them
    const retweets = result.records.map((record) => ({
      tweet: record.get("tweet"),
      favorites: record.get("favorites"),
      retweets: record.get("retweets"),
    }));

    res.status(200).json(retweets);
  } catch (error) {
    // Log and handle any errors that occur during the query execution
    console.error("Error fetching retweets:", error);
    res.status(500).json({ error: "Error fetching retweets" });
  } finally {
    session.close();
  }
};

const getMentions = async (req, res) => {

  const query = `
      MATCH (u:User {screen_name: $screenName})<-[:MENTIONS]-(t:Tweet)
      RETURN t.text AS tweet, t.favorites AS favorites, t.retweets AS retweets
    `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query, { screenName });
    const mentions = result.records.map((record) => ({
      tweet: record.get("tweet"),
      favorites: record.get("favorites"),
      retweets: record.get("retweets"),
    }));
    res.status(200).json(mentions);
  } catch (error) {
    console.error("Error fetching mentions:", error);
    res.status(500).json({ error: "Error fetching mentions" });
  } finally {
    session.close();
  }
};
// Get all links contained in tweets
const getLinksInTweets = async (req, res) => {
  const query = `
      MATCH (t:Tweet)-[:CONTAINS]->(l:Link)
      RETURN t.id, t.content, l.url AS link;
    `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });
  try {
    const result = await session.run(query);

    if (result.records.length > 0) {
      const links = result.records.map((record) => ({
        tweetId: record.get("t.id"),
        content: record.get("t.content"),
        link: record.get("link"),
      }));
      res.status(200).json({ links });
    } else {
      res.status(404).json({ error: "No links found in tweets" });
    }
  } catch (error) {
    console.error("Error fetching links in tweets:", error);
    res.status(500).json({ error: "Error fetching links in tweets" });
  } finally {
    session.close();
  }
};

const getTweetHierarchy = async (req, res) => {
  // Define the Cypher query to fetch tweet hierarchy and replies
  const query = `
      MATCH (t:Tweet)
      OPTIONAL MATCH (t)-[:REPLY_TO]->(reply:Tweet)
      OPTIONAL MATCH (t)-[:TAGS]->(hashtag:Hashtag) // Match hashtags related to the tweet
      RETURN t AS rootTweet,
             collect(reply.text) AS replyTexts,
             count(reply) AS replyCount,
             collect(hashtag.name) AS hashtags // Collect hashtag names
       ORDER BY replyCount DESC
      LIMIT 5
    `;

  // Create a session to connect to the Neo4j database
  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    // Run the query in the Neo4j session
    const result = await session.run(query);

    // Extract tweets and their replies from the result
    const tweets = result.records.map((record) => {
      return {
        tweet: record.get("rootTweet").properties, // Root tweet
        replyTexts: record.get("replyTexts"), // Array of reply texts
        replyCount: record.get("replyCount"), // Count of replies
        hashtags: record.get("hashtags"), // Array of hashtag names
      };
    });

    // Return the response with the fetched data
    res.status(200).json(tweets);
  } catch (error) {
    // Log error if something goes wrong
    console.error("Error fetching tweet hierarchy:", error);
    res.status(500).json({ error: "Error fetching tweet hierarchy" });
  } finally {
    // Close the Neo4j session
    session.close();
  }
};

//   // Extract the tweetId from the request parameters
//   const tweetId = req.params.tweetId; // Example: /tweet/:tweetId/hira

//   // Define the Cypher query to fetch tweet hierarchy and replies
//   const query = `
//     MATCH (t:Tweet {id_str: $tweetId})
//     OPTIONAL MATCH (t)-[:REPLY_TO]->(reply:Tweet)
//     OPTIONAL MATCH (t)-[:CONTAINS]->(link:Link)
//     OPTIONAL MATCH (t)-[:TAGS]->(hashtag:Hashtag)
//     OPTIONAL MATCH (t)-[:USING]->(source:Source)
//     RETURN t AS rootTweet,
//            collect(reply.text) AS replyTexts,
//            count(reply) AS replyCount,
//            collect(link.url) AS links,
//            collect(hashtag.name) AS hashtags,
//            collect(source.name) AS sources
//     ORDER BY replyCount DESC
//     LIMIT 5
//   `;

//   // Create a session to connect to the Neo4j database
//   const session = driver.session({ database: process.env.NEO4J_DATABASE });

//   try {
//     // Run the query in the Neo4j session
//     const result = await session.run(query, { tweetId });

//     // Extract tweets and their related information from the result
//     const tweets = result.records.map((record) => {
//       return {
//         tweet: record.get("rootTweet").properties, // Root tweet properties
//         replyTexts: record.get("replyTexts"), // Array of reply texts
//         replyCount: record.get("replyCount"), // Count of replies
//         links: record.get("links"), // Associated links
//         hashtags: record.get("hashtags"), // Associated hashtags
//         sources: record.get("sources"), // Associated sources
//       };
//     });

//     // Return the response with the fetched data
//     res.status(200).json(tweets);
//   } catch (error) {
//     // Log error if something goes wrong
//     console.error("Error fetching tweet hierarchy:", error);
//     res.status(500).json({ error: "Error fetching tweet hierarchy" });
//   } finally {
//     // Close the Neo4j session
//     session.close();
//   }
// };

const getTweetDetails = async (req, res) => {
  // Extract the tweetId from the request parameters
  const tweetId = req.params.tweetId;

  // Check if the tweetId is provided
  if (!tweetId) {
    return res.status(400).json({ error: "tweetId is required" });
  }

  // Define the Cypher query to fetch tweet details based on tweetId
  const query = `
    MATCH (t:Tweet {id_str: $tweetId})
    OPTIONAL MATCH (t)-[:CONTAINS]->(link:Link)
    OPTIONAL MATCH (t)-[:TAGS]->(hashtag:Hashtag)
    OPTIONAL MATCH (t)-[:USING]->(source:Source)
    RETURN t.text AS tweetText,
           collect(link.url) AS links,
           collect(hashtag.name) AS hashtags,
           collect(source.name) AS sources
  `;

  // Create a session to connect to the Neo4j database
  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    // Run the query in the Neo4j session, passing tweetId as a parameter
    const result = await session.run(query, { tweetId });

    // If no tweet found, return a 404 error
    if (result.records.length === 0) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    // Map the result to a usable format
    const tweetData = result.records.map((record) => {
      return {
        tweetText: record.get("tweetText"),
        links: record.get("links"),
        hashtags: record.get("hashtags"),
        sources: record.get("sources"),
      };
    });

    // Send back the response with the fetched data
    res.status(200).json(tweetData);
  } catch (error) {
    // Log the error and send a 500 error response
    console.error("Error fetching tweet details:", error);
    res.status(500).json({ error: "Error fetching tweet details" });
  } finally {
    // Always close the Neo4j session
    session.close();
  }
};
// Controller to get top retweeted tweets
const getTrendingTweetsByFav = async (req, res) => {
  const query = `
    MATCH (tweet:Tweet)
    WITH tweet, tweet.favorites AS favoriteCount
    WHERE favoriteCount > 0
    ORDER BY favoriteCount DESC
    LIMIT 3
    RETURN tweet.text AS tweet, favoriteCount
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query);
    const trendingTweets = result.records.map((record) => ({
      tweet: record.get("tweet"),
      favoriteCount: record.get("favoriteCount"),
    }));
    res.status(200).json(trendingTweets);
  } catch (error) {
    console.error("Error fetching trending tweets by favorites:", error);
    res
      .status(500)
      .json({ error: "Error fetching trending tweets by favorites" });
  } finally {
    session.close();
  }
};
// Controller to get tweets with more than 0 retweets
const getTweetsWithRetweets = async (req, res) => {
  const query = `
    MATCH (tweet:Tweet)-[:RETWEETS]->(rt:Tweet)
    WITH tweet, COUNT(rt) AS retweetCount
    WHERE retweetCount > 0
    ORDER BY retweetCount DESC
    LIMIT 3
    RETURN tweet.text AS tweet, retweetCount
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query);
    const tweets = result.records.map((record) => ({
      tweet: record.get("tweet"),
      retweetCount: record.get("retweetCount").toInt(),
    }));
    res.status(200).json(tweets);
  } catch (error) {
    console.error("Error fetching tweets with retweets:", error);
    res.status(500).json({ error: "Error fetching tweets with retweets" });
  } finally {
    session.close();
  }
};
const getMonthlyTweets = async (req, res) => {
  const query = `
    MATCH (t:Tweet)
    WHERE t.created_at IS NOT NULL
    WITH t, t.created_at.year AS year, t.created_at.month AS month
    RETURN month AS Month, COUNT(t) AS TweetCount
    ORDER BY month
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query);

    const monthlyTweets = result.records.map((record) => ({
      month: record.get("Month"),
      tweetCount: record.get("TweetCount").toNumber(),
    }));

    res.status(200).json(monthlyTweets);
  } catch (error) {
    console.error("Error fetching monthly tweets data:", error);
    res.status(500).json({ error: "Error fetching monthly tweets data" });
  } finally {
    session.close();
  }
};

const getTotalTweets = async (req, res) => {
  const query = `
    MATCH (t:Tweet)
    RETURN COUNT(t) AS totalTweets
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query);

    // If tweets are found, return the count
    if (result.records.length > 0) {
      const totalTweets = result.records[0].get("totalTweets").toInt(); // Extract and convert the result to an integer
      res.status(200).json({ totalTweets });
    } else {
      res.status(404).json({ error: "No tweets found" });
    }
  } catch (error) {
    console.error("Error fetching total tweets:", error);
    res.status(500).json({ error: "Error fetching total tweets" });
  } finally {
    session.close();
  }
};
// Controller function to get the total number of retweets
const getTotalRetweets = async (req, res) => {
  const query = `
    MATCH (t:Tweet)-[:RETWEETS]->(rt:Tweet)
    RETURN COUNT(rt) AS totalRetweets
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(query);

    // If there are results, we return the count of total retweets
    if (result.records.length > 0) {
      const totalRetweets = result.records[0].get("totalRetweets").toInt(); // Extract and convert the result to an integer
      res.status(200).json({ totalRetweets });
    } else {
      res.status(404).json({ error: "No retweets found in the database" });
    }
  } catch (error) {
    console.error("Error fetching total retweets:", error);
    res.status(500).json({ error: "Error fetching total retweets" });
  } finally {
    session.close();
  }
};

module.exports = {
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
};
