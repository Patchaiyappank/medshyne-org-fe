import React from 'react'
import Navbar from '../component/navbar.js';
import Sidebar from '../component/sidebar.js';
import Group from '../component/group.js';
// import Consulting from './consulting/Consultinghistory.js';
import StudentDetails from '../studentlist/StudentDetails.js'


const StudentForm = () => {
  return (
    <div>
            <Navbar />
            <Sidebar />
            <Group/>
            <StudentDetails/>
          
            
    </div>
  )
}

export default StudentForm