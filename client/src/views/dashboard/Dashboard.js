import React, { useEffect, useState } from 'react'
import { fetchAllUsers } from '../../api/userApi'
import {
  CAvatar,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { cilPeople } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import WidgetsDropdown from '../widgets/Widgets'
import TweetTrafficChart from '../charts/TweetChart'
import TrendingUserChart from '../charts/TrendingUserChart'

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchAllUsers()

        // Flatten the data before setting the state
        const flattenedUsers = data.users.map((user) => ({
          ...user,
          followers: user.followers.low,
          following: user.following.low,
        }))

        setUsers(flattenedUsers)
        setLoading(false)
      } catch (error) {
        console.error('Error loading users:', error)
        setLoading(false)
      }
    }

    getUsers()
  }, [])

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Get current users for the current page
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardBody>
              <br />
              <h3>All Users</h3>

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Country
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Followers</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Followings
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {loading ? (
                    <tr>
                      <CTableDataCell colSpan="5" className="text-center">
                        <CSpinner size="sm" />
                      </CTableDataCell>
                    </tr>
                  ) : (
                    currentUsers.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell className="text-center">
                          <CAvatar size="md" src={item.profile_image_url} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.screen_name}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div>{item.location}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div>{item.followers}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div>{item.following}</div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>

              {/* Pagination */}
              <CPagination align="center" className="mt-3">
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                >
                  Prev
                </CPaginationItem>
                {[...Array(Math.ceil(users.length / usersPerPage))].map((_, index) => (
                  <CPaginationItem
                    key={index + 1}
                    active={currentPage === index + 1}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                  onClick={() => paginate(currentPage + 1)}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <TweetTrafficChart />
      <TrendingUserChart />
    </>
  )
}

export default Dashboard
