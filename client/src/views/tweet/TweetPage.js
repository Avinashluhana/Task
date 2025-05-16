import React, { useState, useEffect } from 'react'
import TweetList from '../../components/TweetList'
import { CContainer, CRow, CCol } from '@coreui/react'

const TweetsPage = () => {
  return (
    <CContainer fluid>
      <CRow>
        <CCol xs={12}>
          <h3>Tweets with replies</h3>
          <TweetList />
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default TweetsPage
