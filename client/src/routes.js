import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const TweetPage = React.lazy(() => import('./views/tweet/TweetPage'))
const TrendingPage = React.lazy(() => import('./views/Trend/TrendingDetails'))

const User = React.lazy(() => import('./views/user/UserPage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/user', name: 'User', element: User },
  { path: '/tweet', name: 'Tweet', element: TweetPage },
  { path: '/trends', name: 'Trend', element: TrendingPage },
]

export default routes
