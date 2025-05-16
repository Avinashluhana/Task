import React, { useState, useEffect } from 'react'
import { fetchTrendingTweets, fetchTrendingTweetsByFav } from '../../api/tweets'
import { fetchMostMentionedUser, fetchTrendingUsers } from '../../api/userApi'
import { fetchTrendingHashtags } from '../../api/hashtagApi'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CSpinner,
  CCol,
  CRow,
  CCardGroup,
} from '@coreui/react'

const TrendingPage = () => {
  const [trendingTweets, setTrendingTweets] = useState([])
  const [trendingTweetsByFav, setTrendingTweetsByFav] = useState([])
  const [trendingUsers, setTrendingUsers] = useState([])
  const [mostMentionedUsers, setMostMentionedUsers] = useState([])

  const [trendingHashtags, setTrendingHashtags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTrendingData = async () => {
      try {
        const tweetsData = await fetchTrendingTweets()
        const usersData = await fetchTrendingUsers()
        const hashtagsData = await fetchTrendingHashtags()
        const trendingTweets = await fetchTrendingTweetsByFav()
        const mostMentionedUsersData = await fetchMostMentionedUser()

        setTrendingTweetsByFav(trendingTweets || [])
        setTrendingTweets(tweetsData || [])
        setTrendingUsers(usersData || [])
        setTrendingHashtags(hashtagsData || [])
        setMostMentionedUsers(mostMentionedUsersData || [])

        setLoading(false)
      } catch (error) {
        console.error('Error fetching trending data:', error)
        setLoading(false)
      }
    }

    loadTrendingData()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-5">Trending Data</h3>

      {/* Trending Tweets */}
      <section className="mb-5">
        <h4>Trending Tweets Based on Retweets</h4>
        {trendingTweets.length === 0 ? (
          <p>No trending tweets available</p>
        ) : (
          <CRow>
            {trendingTweets.map((tweet, index) => (
              <CCol sm="12" md="6" lg="4" key={index} className="mb-4">
                <CCard className="border-primary">
                  <CCardHeader className="bg-primary text-white">{tweet.text}</CCardHeader>
                  <CCardBody>
                    <p>
                      <strong>Retweets:</strong> {tweet.retweetCount}
                    </p>
                    <p>
                      <strong>Description:</strong> {tweet.tweet}
                    </p>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        )}
      </section>

      {/* Trending Tweets */}
      <section className="mb-5">
        <h4>Trending Tweets with the Most Favorites</h4>
        {trendingTweetsByFav.length === 0 ? (
          <p>No trending tweets available</p>
        ) : (
          <CRow>
            {trendingTweetsByFav.map((tweet, index) => (
              <CCol sm="12" md="6" lg="4" key={index} className="mb-4">
                <CCard className="border-primary">
                  <CCardHeader className="bg-primary text-white">{tweet.text}</CCardHeader>
                  <CCardBody>
                    <p>
                      <strong>Favorites:</strong> {tweet.favoriteCount.low}
                    </p>
                    <p>
                      <strong>Description:</strong> {tweet.tweet}
                    </p>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        )}
      </section>

      {/* Trending Users */}
      <section className="mb-5">
        <h4>Trending Users Based on Followers </h4>
        {trendingUsers.length === 0 ? (
          <p>No trending users available</p>
        ) : (
          <CRow>
            {trendingUsers.map((user, index) => (
              <CCol sm="12" md="6" lg="4" key={index} className="mb-4">
                <CCard className="border-success">
                  <CCardHeader className="bg-success text-white">{user.name}</CCardHeader>
                  <CCardBody>
                    <p>
                      <strong>User:</strong> {user.username}
                    </p>
                    <p>
                      <strong>Followers:</strong> {user.followersCount}
                    </p>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        )}
      </section>

      {/* Trending Users based on most mentions */}
      <section className="mb-5">
        <h4>Trending Users based on most mentions</h4>
        {mostMentionedUsers.length === 0 ? (
          <p>No trending users available</p>
        ) : (
          <CRow>
            {mostMentionedUsers.map((user, index) => (
              <CCol sm="12" md="6" lg="4" key={index} className="mb-4">
                <CCard className="border-success">
                  <CCardHeader className="bg-success text-white">{user.name}</CCardHeader>
                  <CCardBody>
                    <p>
                      <strong>User:</strong> {user.username}
                    </p>
                    <p>
                      <strong>Mentions:</strong> {user.mostMentionsCount}
                    </p>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        )}
      </section>

      {/* Trending Hashtags */}
      <section className="mb-5">
        <h4>Trending Hashtags</h4>
        {trendingHashtags.length === 0 ? (
          <p>No trending hashtags available</p>
        ) : (
          <CRow>
            {trendingHashtags.map((hashtag, index) => (
              <CCol sm="12" md="6" lg="4" key={index} className="mb-4">
                <CCard className="border-info">
                  <CCardHeader className="bg-info text-white">{hashtag.hashtag}</CCardHeader>
                  <CCardBody>
                    <p>
                      <strong>Tweet Count:</strong> {hashtag.tweetCount}
                    </p>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        )}
      </section>
    </div>
  )
}

export default TrendingPage
