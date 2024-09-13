import React from 'react'
import Navbar from '../component/navbar.js';
import Sidebar from '../component/sidebar.js';
import StudentView from '../studentlist/StudentViewPage.js'

const StudentDetails = () => {
  return (
    <div>
            <Navbar />
            <Sidebar />
           <StudentView/>
                      
    </div>
  )
}

export default StudentDetails;