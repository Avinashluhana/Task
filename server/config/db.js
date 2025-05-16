const neo4j = require("neo4j-driver");

// Load environment variables
require("dotenv").config();

// Neo4j driver setup using environment variables
const driver = neo4j.driver(
  process.env.NEO4J_URI, 
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD), 
  {
    maxTransactionRetryTime: 30000, // Timeout in ms for retries
    maxTransactionRetryCount: 3, // Retry on failures
  }
);

module.exports = driver;
