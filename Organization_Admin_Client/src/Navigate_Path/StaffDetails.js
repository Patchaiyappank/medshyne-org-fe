import React from 'react'
import Navbar from '../component/navbar.js';
import Sidebar from '../component/sidebar.js';
// import Consulting from './consulting/Consultinghistory.js';
//import StudentViewPage from './studentlist/StudentViewPage.js';
import StaffView from '../stafflist/StaffView.js'

const StaffDetails = () => {
  return (
    <div>
            <Navbar />
            <Sidebar />
            <StaffView/>
          
            
    </div>
  )
}

export default StaffDetails;
