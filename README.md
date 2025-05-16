# Blockwall Task

## Project Description

This project is a full-stack application consisting of a **frontend** built with **React** and a **backend** using **Node.js** with **Express**. The application uses **Neo4j** as the database to manage tweets, user profiles, and mentions.

- **Frontend:** Built with **React** for dynamic user interfaces.
- **Backend:** Powered by **Node.js** with **Express** to handle API requests.
- **Database:** **Neo4j** is used for efficient graph-based storage and querying.

## Pages and Functionality

### 1. Dashboard

The **Dashboard** page displays a list of different users. Users can be found here by their screen names. These names can be used to search for users in the **User Page**.

On this page, you'll also find key statistics, like:

1. **Total Users**: The total number of users in the system.
2. **Total Tweets**: The total number of tweets across all users.
3. **Total Retweets**: The total number of retweets made by users.

### 2. User Page

On the **User Page**, you can search for a user by their screen name (e.g., `@neo4j`).

Once you search for a user, the page will display:

- User's tweets.
- Tweets in which the user has been mentioned.
- Followers & following stats.
- Activity stats like total tweets, retweets, replies, and favorites.

### 3. Trends Page

The **Trends Page** displays the currently trending hashtags, giving an overview of popular topics.

### 4. Tweets Page

The **Tweets Page** lists all the tweets and provides options to explore them in more detail, including likes, retweets, and mentions.

## Setup

### Prerequisites

- **Node.js** installed on your machine.
- **NPM** or **Yarn** for managing packages.

## Requirements

### Node.js Version

This project requires **Node.js** version **>=18.0.0**.

### Running the Frontend and Backend Together

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Avinashluhana/Task.git

   cd Task


   ```

# Install dependencies for both the frontend and backend by running the following command:

    ```bash
    npm run install-all
    ```

    This will:
    - Install dependencies for the **client** (frontend) in the `client/` folder
    - Install dependencies for the **server** (backend) in the `server/` folder
    - Install root dependencies

# Run the project using concurrently to start both the frontend and backend:

npm run start

## Application URLs

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:5000](http://localhost:5000)

### Backend

- Runs on port `5000`
- Handles API requests for managing users, tweets, and mentions.

### Frontend

- Runs on port `3000`
- Displays tweets, user profiles, and statistics.
