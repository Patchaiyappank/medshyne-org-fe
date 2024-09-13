import React from 'react';
 import Designation from '../designation/designation.js';
 import Sidee from '../designation/Sidee.js';
 import Navbar from '../component/navbar.js';
 import Sidebar from '../component/sidebar.js';
 import Group from '../component/group.js';

function Designations() {
  return (
    <div className='app'> 
            <Navbar />
            <Sidebar />
            <Group />
            <Designation /> 
    </div>
  );
}

export default Designations;
