import React from 'react'
import Navbar from '../component/navbar.js';
import Sidebar from '../component/sidebar.js';
import Group from '../component/group.js';
import StaffDetails from '../stafflist/StaffDetails.js';

const StaffForm = () => {
  return (
    <div>
            <Navbar />
            <Sidebar />
            <Group/>
            <StaffDetails/>
            
    </div>
  )
}

export default StaffForm