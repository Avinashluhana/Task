import axios from 'axios'

const API_URL = 'http://localhost:5000/api/users'

// Get all users
export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error('Error fetching users', error)
    throw error
  }
}

// Fetch user profilea
export const fetchUserProfile = async (screenName) => {
  try {
    const response = await axios.get(`${API_URL}/${screenName}`)
    return response.data // Return the user profile data
  } catch (error) {
    console.error(`Error fetching user profile for ${screenName}:`, error)
    throw error
  }
}

// Fetch user stats (Total tweets, retweets, likes)
export const fetchUserStats = async (screenName) => {
  try {
    const response = await axios.get(`${API_URL}/${screenName}/stats`)
    return response.data
  } catch (error) {
    console.error('Error fetching user stats:', error)
    throw error
  }
}

// Fetch user followers and followings
export const fetchUserFollowRelations = async (screenName) => {
  try {
    const response = await axios.get(`${API_URL}/${screenName}/relations/following-followers`)
    return response.data.relations // Return the relations array
  } catch (error) {
    console.error(`Error fetching follow relations for ${screenName}:`, error)
    throw error
  }
}
// Fetch user mentions (Tweets where user is mentioned)
export const fetchUserMentions = async (screenName) => {
  try {
    const response = await axios.get(`${API_URL}/${screenName}/mentions`)
    return response.data
  } catch (error) {
    console.error(`Error fetching mentions for ${screenName}:`, error)
    throw error
  }
}

// Fetch Most Trending Users
export const fetchTrendingUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/trending-user`)
    return response.data
  } catch (error) {
    console.error(`Error fetching follow relations for ${screenName}:`, error)
    throw error
  }
}

// Fetch Most mentioned Users
export const fetchMostMentionedUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/most-mentioned`)
    return response.data // Return the relations array
  } catch (error) {
    console.error(`Error fetching follow relations for ${screenName}:`, error)
    throw error
  }
}

// Fetch user total followers and followings stats
export const fetchUserFollowStats = async (screenName) => {
  try {
    const response = await axios.get(`${API_URL}/${screenName}/follow-stats`)
    return response.data // Return the total followers and followings data
  } catch (error) {
    console.error(`Error fetching follow stats for ${screenName}:`, error)
    throw error
  }
}
