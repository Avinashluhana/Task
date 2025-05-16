const app = require("./app"); // Import the Express app from app.js
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from the .env file

const port = process.env.PORT || 5000; // Use port from .env or default to 5000

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
