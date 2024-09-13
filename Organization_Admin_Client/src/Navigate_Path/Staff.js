import React from 'react'
import Navbar from '../component/navbar.js';
import Sidebar from '../component/sidebar.js';
import Group from '../component/group.js';
import StaffList from '../stafflist/StaffList.js';
// import StaffDetails from './stafflist/StaffDetails.js';

const Staff = () => {
  return (
    <div>
            <Navbar />
            <Sidebar />
            <Group/>
            <StaffList/>
            {/* <StaffDetails/> */}
            
    </div>
  )
}

export default Staff