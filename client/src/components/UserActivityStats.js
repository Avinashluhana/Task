import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { FaRetweet, FaRegHeart, FaReply } from 'react-icons/fa'

const UserActivityStats = ({ totalTweets, totalRetweets, totalLikes, totalReplies }) => {
  return (
    <CCard className="shadow-lg rounded">
      <CCardHeader className="bg-secondary text-white">
        <h5>Activity Stats</h5>
      </CCardHeader>
      <CCardBody className="text-muted">
        <div>
          <strong>Total Tweets:</strong> {totalTweets}
        </div>
        <div>
          <strong>
            <FaRetweet /> Retweets:
          </strong>
          {totalRetweets}
        </div>
        <div>
          <strong>
            <FaReply /> Replies:
          </strong>
          {totalReplies}
        </div>
        <div>
          <strong>
            <FaRegHeart /> Favorites:
          </strong>
          {totalLikes}
        </div>
      </CCardBody>
    </CCard>
  )
}

export default UserActivityStats
