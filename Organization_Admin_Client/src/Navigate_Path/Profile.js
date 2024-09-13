import React from 'react';
import Organization from '../organization.js';
import Navbar from '../component/navbar.js';
import Sidebar from '../component/sidebar.js';

function Profile() {
  return (
    <div className=''>
    <Navbar />
     <Sidebar />
  <Organization/>
    </div>
  );
}

export default Profile;
