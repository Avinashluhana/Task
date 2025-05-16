import React, { useEffect, useState } from 'react'
import { fetchAllUsers } from '../../api/userApi'
import { CWidgetStatsD, CRow, CCol, CWidgetStatsA } from '@coreui/react'
import { FaHashtag, FaUser } from 'react-icons/fa'
import { cibTwitter } from '@coreui/icons'
import { fetchTotalRetweets, fetchTotalTweets } from '../../api/tweets'
import { fetchTotalHashtags } from '../../api/hashtagApi'
import CIcon from '@coreui/icons-react'

const WidgetsDropdown = (props) => {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalTweets, setTotalTweets] = useState(0)
  const [totalRetweets, setTotalRetweets] = useState(0)
  const [totalHashtags, setTotalHashtags] = useState(0)

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const data = await fetchAllUsers()
        setTotalUsers(data.totalUsers)
      } catch (error) {
        console.error('Error fetching total users:', error)
      }
    }
    const fetchAllTweets = async () => {
      try {
        const data = await fetchTotalTweets()
        setTotalTweets(data.totalTweets)
      } catch (error) {
        console.error('Error fetching total tweets:', error)
      }
    }

    const fetchAllRetweets = async () => {
      try {
        const data = await fetchTotalRetweets()
        setTotalRetweets(data.totalRetweets)
      } catch (error) {
        console.error('Error fetching total retweets:', error)
      }
    }

    const fetchAllHashtags = async () => {
      try {
        const data = await fetchTotalHashtags()
        setTotalHashtags(data.totalHashtags)
      } catch (error) {
        console.error('Error fetching total hashtags:', error)
      }
    }
    fetchAllHashtags()
    fetchTotalUsers()
    fetchAllRetweets()
    fetchAllTweets()
  }, [])

  return (
    <CRow
      className={props.className}
      xs={{ gutter: 4 }}
      style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}
    >
      <CCol xs={12} sm={6} xl={4} xxl={4}>
        <CWidgetStatsA
          color="primary"
          value={<>{totalUsers}</>}
          title="Total Users"
          icon={<FaUser size={52} className="my-4 text-white" />}
          style={{ height: '200px' }}
        />
      </CCol>
      <CCol xs={12} sm={6} xl={4} xxl={4}>
        <CWidgetStatsD
          icon={<CIcon icon={cibTwitter} height={52} className="my-4 text-white" />}
          values={[
            { title: 'Total Tweets', value: <>{totalTweets}</> },
            { title: 'Retweets', value: <>{totalRetweets}</> },
          ]}
          style={{
            '--cui-card-cap-bg': '#00aced',
            height: '200px',
          }}
        />
      </CCol>
      <CCol xs={12} sm={6} xl={4} xxl={4}>
        <CWidgetStatsA
          color="warning"
          value={<>{totalHashtags}</>}
          title="Total Hashtags"
          icon={<FaHashtag size={52} className="my-4 text-white" />}
          style={{ height: '200px' }}
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
