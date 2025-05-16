import axios from 'axios'
const API_URL = 'http://localhost:5000/api/hashtags'

// Fetch trending hashtags
export const fetchTrendingHashtags = async () => {
  try {
    const response = await axios.get(`${API_URL}/hashtags/trending`)
    return response.data
  } catch (error) {
    console.error('Error fetching trending hashtags', error)
    throw error
  }
}

export const fetchTotalHashtags = async () => {
  try {
    const response = await axios.get(`${API_URL}/hashtags/total-hashtags`)
    return response.data
  } catch (error) {
    console.error('Error fetching trending hashtags', error)
    throw error
  }
}
