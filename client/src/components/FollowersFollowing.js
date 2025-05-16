import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { FaUsers } from 'react-icons/fa'

const FollowersFollowing = ({ followers, following }) => {
  return (
    <CCard className="shadow-lg rounded">
      <CCardHeader className="bg-dark text-white">
        <h5>
          <FaUsers /> Followers & Following
        </h5>
      </CCardHeader>
      <CCardBody className="text-muted">
        <div>
          <strong>Followers:</strong> {followers}
        </div>
        <div>
          <strong>Following:</strong> {following}
        </div>
      </CCardBody>
    </CCard>
  )
}

export default FollowersFollowing
