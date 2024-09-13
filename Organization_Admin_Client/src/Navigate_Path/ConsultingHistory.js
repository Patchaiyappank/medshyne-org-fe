import React from 'react'
import Navbar from '../component/navbar.js';
import Sidebar from '../component/sidebar.js';
import Consulting from '../ConsultPage/Consultinghistory.js';


const ConsultingHistory = () => {
  return (
    <div>
            <Navbar />
            <Sidebar />
            <Consulting/>
                      
    </div>
  )
}

export default ConsultingHistory