import React from 'react'
import Navbar from '../component/navbar.js';
import Sidebar from '../component/sidebar.js';
import Group from '../component/group.js';
import ClassesList from '../classlist/Class.js'

const Classes = () => {
  return (
    <div>
            <Navbar />
            <Sidebar />
            <Group/>
            <ClassesList/>
            
    </div>
  )
}

export default Classes