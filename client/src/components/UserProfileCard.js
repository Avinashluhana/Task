import React from 'react'
import { CCard, CCardBody, CCardHeader, CImage } from '@coreui/react'

const UserProfileCard = ({ user }) => {
  if (!user) {
    return <div>Please search the name of user first...</div> // Show loading text if user data is not yet available
  }

  return (
    <CCard className="shadow-lg rounded">
      <CCardHeader className="bg-primary text-white">
        <h4>{user.name || 'User Name Not Available'}</h4>
        <p>@{user.screen_name || 'Username not available'}</p>
      </CCardHeader>
      <CCardBody className="text-muted">
        <CImage
          src={user.profile_image_url}
          alt="profile"
          className="img-fluid rounded-circle mb-3"
          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
        />
        <div>
          <strong>Location:</strong> {user.location || 'Location not available'}
        </div>
      </CCardBody>
    </CCard>
  )
}

export default UserProfileCard
