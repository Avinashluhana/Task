import React from 'react'
import { CCard, CCardBody, CCardHeader, CCardFooter, CSpinner } from '@coreui/react'
import { FaHashtag, FaLink, FaRetweet, FaHeart } from 'react-icons/fa'

const RecentTweets = ({ tweets, loading }) => {
  const tweetList = tweets || [] // Default to an empty array if undefined

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div className="tweets-container">
      {tweetList.length === 0 ? (
        <div className="no-tweets-message text-center">
          <p>No tweets found.</p>
        </div>
      ) : (
        tweetList.map((tweet, index) => (
          <CCard key={index} className="tweet-card mb-4 shadow-sm rounded">
            <CCardHeader className="tweet-card-header bg-dark text-white">
              <h5>Tweet {index + 1}</h5>
            </CCardHeader>
            <CCardBody className="tweet-card-body text-muted">
              {/* Display Tweet Text */}
              <p className="tweet-text">{tweet.tweet ? tweet.tweet : 'No tweet text available.'}</p>

              {/* Display Hashtags */}
              {tweet.hashtags && tweet.hashtags.length > 0 && (
                <div className="tweet-hashtags">
                  <FaHashtag /> <strong>Hashtags:</strong> {tweet.hashtags.join(', ')}
                </div>
              )}

              {/* Display Links */}
              {tweet.link && (
                <div className="tweet-links">
                  <FaLink /> <strong>Link:</strong>
                  <a href={tweet.link} target="_blank" rel="noopener noreferrer">
                    {tweet.link}
                  </a>
                </div>
              )}

              {/* Display Favorites */}
              {tweet.favorites ? (
                <div className="tweet-favorites">
                  <FaHeart /> <strong>Favorites:</strong>{' '}
                  {tweet.favorites.low || tweet.favorites.high
                    ? Number(tweet.favorites.low || 0) + Number(tweet.favorites.high || 0)
                    : '0'}
                </div>
              ) : null}

              {/* Display Retweets */}
              {tweet.retweets ? (
                <div className="tweet-retweets">
                  <FaRetweet /> <strong>Retweets:</strong>{' '}
                  {tweet.retweets.low || tweet.retweets.high
                    ? Number(tweet.retweets.low || 0) + Number(tweet.retweets.high || 0)
                    : '0'}
                </div>
              ) : null}
            </CCardBody>
          </CCard>
        ))
      )}
    </div>
  )
}

export default RecentTweets
