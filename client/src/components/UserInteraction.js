import React from 'react'

const UserInteraction = ({ userData }) => {
  return (
    <div>
      <h5>Replies: {userData.repliesCount}</h5>
      <h5>Mentions: {userData.mentionsCount}</h5>
    </div>
  )
}

export default UserInteraction
