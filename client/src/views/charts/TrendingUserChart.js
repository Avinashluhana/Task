import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react'
import { fetchMostMentionedUser } from '../../api/userApi' // Your API call to fetch data

const TrendingUserChart = () => {
  const [usersData, setUsersData] = useState([])

  // Fetch trending users and mentions count
  useEffect(() => {
    const getTrendingUsersData = async () => {
      try {
        const response = await fetchMostMentionedUser() // Fetch trending users
        if (!Array.isArray(response)) {
          throw new Error('Invalid response format')
        }

        // Sort the response to get the users with highest mentions first
        const sortedUsers = response.sort((a, b) => b.mostMentionsCount - a.mostMentionsCount)
        const topUsers = sortedUsers.slice(0, 5) // Get top 5 users

        setUsersData(topUsers) // Set data for the chart
      } catch (error) {
        console.error('Error fetching trending user data:', error)
      }
    }

    getTrendingUsersData()
  }, [])

  // Prepare the data for the chart
  const barChartData = usersData.map((user) => ({
    name: user.username, // Usernames for x-axis
    mentions: user.mostMentionsCount, // Mention counts for y-axis
  }))

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Top Trending Users by Mentions</CCardHeader>
          <CCardBody>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar
                  dataKey="mentions"
                  fill="#41B883"
                  barSize={50}
                  label={{ position: 'top', fontSize: 14, fill: '#fff' }}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default TrendingUserChart
