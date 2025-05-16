import React, { useState, useEffect } from 'react'
import {
  fetchUserProfile,
  fetchUserStats,
  fetchUserMentions,
  fetchUserFollowStats,
} from '../../api/userApi'
import { fetchUserTweets } from '../../api/tweets'
import {
  CRow,
  CCol,
  CContainer,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormInput, // Use CFormInput for the search bar
  CSpinner,
} from '@coreui/react'
import { FaUsers } from 'react-icons/fa'

import UserProfileCard from '../../components/UserProfileCard'
import UserActivityStats from '../../components/UserActivityStats'
import FollowersFollowing from '../../components/FollowersFollowing'
import RecentTweets from '../../components/RecentTweets'

const UserPage = () => {
  const [screenName, setScreenName] = useState('')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [userTweets, setUserTweets] = useState([])
  const [mentions, setMentions] = useState([])
  const [followStats, setFollowStats] = useState([])
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSearch = (e) => {
    setScreenName(e.target.value)
  }

  const handleSearchSubmit = () => {
    if (screenName) {
      setLoading(true)
      fetchUserProfileData(screenName)
      fetchUserStatsData(screenName)
      fetchUserTweetsData(screenName)
      fetchMentionsData(screenName)
      fetchUserFollowStatsData(screenName)
    }
  }

  // General error handler for different errors
  const handleError = (message) => {
    setErrorMessage(message)
    setLoading(false)
    setShowErrorModal(true)
  }

  const fetchUserProfileData = async (screenName) => {
    try {
      const data = await fetchUserProfile(screenName)
      if (!data || !data.screen_name) {
        handleError('User not found')
        return
      }
      setUserData(data)
      setLoading(false)
    } catch (error) {
      handleError('User not found')
    }
  }

  const fetchUserStatsData = async (screenName) => {
    try {
      const stats = await fetchUserStats(screenName)
      setUserStats(stats)
    } catch (error) {
      handleError('Error loading user stats')
    }
  }

  const fetchUserTweetsData = async (screenName) => {
    try {
      const tweets = await fetchUserTweets(screenName)
      if (!tweets || tweets.length === 0) {
        handleError('No tweets have been posted by this user')
        return
      }
      setUserTweets(tweets)
    } catch (error) {
      handleError('No tweets posted by this User')
    }
  }

  const fetchMentionsData = async (screenName) => {
    try {
      const mentionsData = await fetchUserMentions(screenName)
      if (!mentionsData || mentionsData.length === 0) {
        handleError('User is not mentioned in any tweet')
        return
      }
      setMentions(mentionsData)
    } catch (error) {
      handleError('Error loading user mentions')
    }
  }

  const fetchUserFollowStatsData = async (screenName) => {
    try {
      const followStats = await fetchUserFollowStats(screenName)
      setFollowStats(followStats)
    } catch (error) {
      handleError('Error loading user follow stats')
    }
  }

  const handleCloseModal = () => setShowErrorModal(false)

  useEffect(() => {
    if (error === 'User not found') {
      setShowErrorModal(true)
    }
  }, [error])

  if (loading) {
    return <div>Searching...</div>
  }

  const totalTweets = (userStats?.totalTweets?.low || 0) + (userStats?.totalTweets?.high || 0)
  const totalRetweets = (userStats?.totalRetweets?.low || 0) + (userStats?.totalRetweets?.high || 0)
  const totalLikes = (userStats?.totalLikes?.low || 0) + (userStats?.totalLikes?.high || 0)
  const totalReplies = (userStats?.totalReplies?.low || 0) + (userStats?.totalReplies?.high || 0)

  return (
    <CContainer fluid className="mt-4">
      <CRow>
        <CCol xs={12} md={6}>
          <div className="d-flex">
            <CFormInput
              type="text"
              placeholder="Search user by screen name"
              value={screenName}
              onChange={handleSearch}
              className="mb-4"
            />
            <CButton
              color="primary"
              onClick={handleSearchSubmit}
              disabled={loading || !screenName.trim()}
              className="ms-2 w-50 h-50"
            >
              {loading ? <CSpinner size="md" /> : 'Search User'}
            </CButton>
          </div>
        </CCol>
      </CRow>

      {/* User Profile */}
      <CRow>
        <CCol xs={12} md={4}>
          <UserProfileCard user={userData} />
        </CCol>
        <CCol xs={12} md={8}>
          <CRow>
            <CCol sm={6}>
              <FollowersFollowing
                followers={followStats.followers}
                following={followStats.following}
              />
            </CCol>
            <CCol sm={6}>
              <UserActivityStats
                totalTweets={totalTweets}
                totalRetweets={totalRetweets}
                totalLikes={totalLikes}
                totalReplies={totalReplies}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>

      {/* Tweets Section */}
      <h3>User's Tweets</h3>

      <CRow>
        <CCol sm={12}>
          <RecentTweets tweets={userTweets} />
        </CCol>
      </CRow>

      {/* Mentions Section */}
      <h3>Tweets in which user mentioned</h3>
      <CRow>
        <CCol sm={12}>
          <RecentTweets tweets={mentions} />
        </CCol>
      </CRow>

      {/* Error Modal */}
      <CModal visible={showErrorModal} onClose={handleCloseModal}>
        <CModalHeader>
          <h5>{errorMessage}</h5>
        </CModalHeader>
        <CModalBody>
          <p>{errorMessage}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default UserPage
