import axios from 'axios'

const API_URL = 'http://localhost:5000/api/tweets'

// Fetch Tweets by user

export const fetchTweetsData = async () => {
  try {
    const response = await axios.get(`${API_URL}/tweets/tweets-monthly`)
    return response.data
  } catch (error) {
    console.error('Error fetching user tweets:', error)
    throw error
  }
}
export const fetchUserTweets = async (screenName) => {
  try {
    const response = await axios.get(`${API_URL}/${screenName}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user tweets:', error)
    throw error
  }
}
// Fetch all tweets by tweetId
export const fetchTweetHierarchy = async (tweetId) => {
  try {
    const response = await axios.get(`${API_URL}/${tweetId}/hira`)
    return response.data
  } catch (error) {
    console.error('Error fetching tweet hierarchy:', error)
    throw error
  }
}

// Fetch tweet details by tweetId
export const fetchTweetDetails = async (tweetId) => {
  try {
    const response = await axios.get(`${API_URL}/${tweetId}/details`)
    return response.data
  } catch (error) {
    console.error('Error fetching tweet details:', error)
    throw error
  }
}
// Fetch trending tweets
export const fetchTrendingTweets = async () => {
  try {
    const response = await axios.get(`${API_URL}/tweets/trending-tweets-retweets`)
    return response.data
  } catch (error) {
    console.error('Error fetching trending tweets', error)
    throw error
  }
}

export const fetchTrendingTweetsByFav = async () => {
  try {
    const response = await axios.get(`${API_URL}/tweets/trending-tweets-fav`)
    return response.data
  } catch (error) {
    console.error('Error fetching trending tweets', error)
    throw error
  }
}

export const fetchTotalTweets = async () => {
  try {
    const response = await axios.get(`${API_URL}/tweets/total-tweets`)
    return response.data
  } catch (error) {
    console.error('Error fetching total tweets', error)
    throw error
  }
}

export const fetchTotalRetweets = async () => {
  try {
    const response = await axios.get(`${API_URL}/tweets/total-retweets`)
    return response.data
  } catch (error) {
    console.error('Error fetching total retweets', error)
    throw error
  }
}
