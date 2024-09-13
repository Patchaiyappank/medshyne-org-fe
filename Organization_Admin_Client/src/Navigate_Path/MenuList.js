import React, { useState,useContext,useEffect } from 'react';
import Navbar from '../component/navbar.js';
import Sidebar from '../component/sidebar.js';
import Home from '../component/home.js';
import Group from '../component/group.js';
import { MyContext } from '../ProjectContext.js';

function MenuList() {
  const [activeIcon, setActiveIcon] = useState('home');

  const handleIconClick = (icon) => {
    setActiveIcon(icon);
  };

  const { iconClick,setIconClick} = useContext(MyContext);
  useEffect(() => {
    console.log('Navigation context ',iconClick);
    setActiveIcon(iconClick);
  });
  return (
<div className="app-container">
      <Navbar />
      <Sidebar  />
      <div className="page-content">
       
        {activeIcon === 'group' && <Group /> }
        {activeIcon === 'group' && <Home />}
      
      </div>
    </div>
  );
}

export default MenuList;
