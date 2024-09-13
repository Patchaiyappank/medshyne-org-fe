import React from 'react'
import Navbar from '../component/navbar.js';
import Sidebar from '../component/sidebar.js';
import Group from '../component/group.js';
import StudentList from '../studentlist/StudentList.js'

const Student = () => {
  return (
    <div>
            <Navbar />
            <Sidebar />
            <Group/>
            <StudentList/>
            
    </div>
  )
}

export default Student