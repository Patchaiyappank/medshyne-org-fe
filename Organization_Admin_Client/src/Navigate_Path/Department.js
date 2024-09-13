import React from 'react';
import Depert from '../department/Depert.js';
import Navbar from '../component/navbar.js';
import Sidebar from '../component/sidebar.js';
import Group from '../component/group.js';
function Department() {
    return(
        <div>
          
            <Navbar />
            <Sidebar />
            <Group />
            <Depert />
    
        </div>
    )

    }
    
export default Department;    