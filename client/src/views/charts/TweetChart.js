import React, { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { fetchTweetsData } from '../../api/tweets'
import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react'

const TweetChart = () => {
  const [tweetsData, setTweetsData] = useState([])

  useEffect(() => {
    const fetchAndProcessTweets = async () => {
      try {
        const response = await fetchTweetsData()

        if (!response || !Array.isArray(response)) {
          throw new Error('Invalid tweet data')
        }

        // Format the data to match the expected chart format
        const formattedData = response.map((item) => ({
          month: `Month ${item.month.low}`, // Month as Month 1, Month 2, etc.
          TotalTweets: item.tweetCount,
        }))

        // Set the formatted data for chart rendering
        setTweetsData(formattedData)
      } catch (error) {
        console.error('Error fetching tweets data:', error)
      }
    }

    fetchAndProcessTweets()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4" style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
          <CCardHeader>
            <h4>Monthly Tweet Statistics</h4>
          </CCardHeader>
          <CCardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tweetsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="TotalTweets" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default TweetChart
