import React, { useState, useEffect, useContext } from 'react';
import bell from '../assets/notification.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './navbar.css';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../ProjectContext';
import defaultimg from './avatar.jpg';

const Navbar = () => {
  const navigate = useNavigate();
  const { getLoginCredentials } = useContext(MyContext);
  const [loginCredentials, setLoginCredentialsState] = useState(() => {
    const storedCredentials = localStorage.getItem('loginCredentials');
    return storedCredentials ? JSON.parse(storedCredentials) : null;
  });

  useEffect(() => {
    if (getLoginCredentials && getLoginCredentials[0]) {
      setLoginCredentialsState(getLoginCredentials[0]);
      localStorage.setItem('loginCredentials', JSON.stringify(getLoginCredentials[0]));
    }
  }, [getLoginCredentials]);

  const profileClick = () => {
    navigate('/Profile');
  };

  return (
    <nav className="navbar">
      <div className="fixed-container">
        <div className="bell-icon">
          <img src={bell} alt="Notification Icon" />
        </div>

        {loginCredentials && (
          <div className="organization-name">
            <span id="org">{loginCredentials.organization_name}</span> <br />
            <span id="sch">{loginCredentials.organization_type}</span>
          </div>
        )}

        <div className="circle-image">
          <img
            src={loginCredentials?.profile || defaultimg}
            width={140}
            height={150}
            alt="profile"
            onClick={profileClick}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
