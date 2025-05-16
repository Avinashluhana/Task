import React, { useEffect, useState } from 'react'
import { fetchUserTweets, fetchTweetDetails, fetchTweetHierarchy } from '../api/tweets' // Import API functions
import { CCard, CCardBody, CCardHeader, CCardFooter, CSpinner, CRow, CCol } from '@coreui/react'
import { FaRetweet, FaRegHeart, FaLink, FaHashtag } from 'react-icons/fa'

const TweetList = () => {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const tweetData = await fetchTweetHierarchy('1371188670472941570')

        // Fetch tweet details for each tweet
        const detailedTweets = await Promise.all(
          tweetData.map(async (tweet) => {
            const tweetDetailsResponse = await fetchTweetDetails('1371188670472941570')
            return { ...tweet, details: tweetDetailsResponse }
          }),
        )

        setTweets(detailedTweets)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching tweets:', error)
        setLoading(false)
      }
    }

    fetchTweets()
  }, [])

  // Format the created_at object to a readable date string
  const formatDate = (dateObj) => {
    const { year, month, day, hour, minute, second } = dateObj
    const date = new Date(year.low, month.low - 1, day.low, hour.low, minute.low, second.low)
    return date.toLocaleString() // Converts to readable format
  }

  return (
    <div className="tweet-list-container">
      {loading ? (
        <div className="d-flex justify-content-center mt-5">
          <CSpinner color="primary" />
        </div>
      ) : (
        <CRow className="mt-4">
          {tweets.map((tweet, index) => (
            <CCol sm="12" md="6" lg="4" key={index} className="mb-4">
              <CCard className="tweet-card shadow-lg rounded tweet-card-hover">
                <CCardHeader className="tweet-card-header bg-dark text-white rounded-top">
                  <h5 className="tweet-user">@{tweet.user} Tweet</h5>
                  <span className="tweet-date text-muted">
                    {formatDate(tweet.tweet.created_at)}
                  </span>
                </CCardHeader>

                <CCardBody>
                  <p className="tweet-text">{tweet.tweet.text}</p>

                  {/* Replies Section */}
                  <div className="tweet-replies">
                    {tweet.replyCount.low > 0 ? (
                      <>
                        <p className="tweet-reply-count">
                          <FaRetweet /> <strong>{tweet.replyCount.low}</strong> replies:
                        </p>
                        <ul>
                          {tweet.replyTexts.map((reply, i) => (
                            <li key={i} className="reply-item">
                              {reply}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p>No replies yet</p>
                    )}
                  </div>

                  {/* Links Section */}
                  <div className="tweet-links">
                    {tweet.details[0].links.length > 0 ? (
                      <>
                        <p>
                          <FaLink /> <strong>Links:</strong>
                        </p>
                        <ul>
                          {tweet.details[0].links.map((link, index) => (
                            <li key={index}>
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-text"
                              >
                                {link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p>No links found</p>
                    )}
                  </div>

                  <div className="tweet-hashtags">
                    {Array.isArray(tweet.hashtags) && tweet.hashtags.length > 0 ? (
                      <>
                        <p>
                          <FaHashtag /> <strong>Hashtags:</strong>
                        </p>
                        <ul>
                          {tweet.hashtags.map((hashtag, index) => (
                            <li key={index}>#{hashtag}</li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p>No hashtags found</p>
                    )}
                  </div>

                  {/* Sources Section */}
                  <div className="tweet-sources">
                    {tweet.details[0].sources.length > 0 ? (
                      <>
                        <p>
                          <strong>Sources:</strong>
                        </p>
                        <ul>
                          {tweet.details[0].sources.map((source, index) => (
                            <li key={index}>{source}</li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p>No sources found</p>
                    )}
                  </div>
                </CCardBody>

                <CCardFooter className="tweet-card-footer bg-dark rounded-bottom">
                  <span className="tweet-favorites">
                    <FaRegHeart /> {tweet.tweet.favorites.low} favorites
                  </span>
                </CCardFooter>
              </CCard>
            </CCol>
          ))}
        </CRow>
      )}
    </div>
  )
}

export default TweetList
