import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <p>© 2025 Luhana. All rights reserved.</p>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
