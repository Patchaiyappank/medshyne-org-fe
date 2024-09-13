import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink, useNavigate} from 'react-router-dom'; // Import NavLink instead of Link
import './Sidebar.css'; 
import '@fontsource/inter';
import medshyne from './assest/Artboard .png'; 
import homeIcon from './assest/home.png'; 
import inventoryIcon from './assest/box.png'; 
import supportIcon from './assest/headphone.png'; 
import employsIcon from './assest/people.png'; 
import organizationIcon from './assest/organization.png'; 
import regionalManagerIcon from './assest/regionalManagerIcon.png'; 
import settingsIcon from './assest/settings.png'; 
import doctorsicon from './assest/doctorsicon.png'; 
import Photodoctor from './assest/Photodoctor.png'; 

const Sidebar = () => {

const navigate = useNavigate();



const profileNavigate = () => {
  navigate('/settings', {
    state: { mode: 'profile' }
  });
};

  return (
    <div className="d-flex flex-column bg-white position-fixed sidebar-container" >
      {/* Logo */}
      <div className="p-3 text-white text-center">
        <img src={medshyne} alt="Logo" className='Sidebar-image-container' />
      </div>
      {/* Navigation */}
      <ul className="nav flex-column" style={{marginTop:'-10px', marginLeft:'10px'}}>
        <li className="nav-item sidebar-list">
          <NavLink className="nav-link" to="/Dashboard" exact activeClassName="active">
            <img src={homeIcon} alt="Home" className="me-3 icon" />
            <span>Home</span>
          </NavLink>
        </li>
        <li className="nav-item sidebar-list">
          <NavLink className="nav-link" to="/inventory" activeClassName="active">
            <img src={inventoryIcon} alt="Inventory" className="me-3 icon" />
            <span>Inventory</span>
          </NavLink>
        </li>
        <li className="nav-item sidebar-list">
          <NavLink className="nav-link" to="/SupportPage" activeClassName="active">
            <img src={supportIcon} alt="Support" className="me-3 icon" />
            <span>Support</span>
          </NavLink>
        </li>
        <li className="nav-item sidebar-list">
          <NavLink className="nav-link" to="/EmploysManagenmenthead" activeClassName="active">
            <img src={employsIcon} alt="Employs" className="me-3 icon" />
            <span>Employees</span> 
          </NavLink>
        </li>
        <li className="nav-item sidebar-list">
          <NavLink className="nav-link" to="/OrganizationHeader" activeClassName="active">
            <img src={organizationIcon} alt="Organization" className="me-3 icon" />
            <span>Organization</span>
          </NavLink>
        </li>
        <li className="nav-item sidebar-list">
          <NavLink className="nav-link" to="/regional" activeClassName="active">
            <img src={regionalManagerIcon} alt="Regional Manager" className="me-3 icon" />
            <span>Regional Manager</span>
          </NavLink>
        </li>
        <li className="nav-item sidebar-list">
          <NavLink className="nav-link" to="/DoctorList" activeClassName="active">
            <img src={doctorsicon} alt="Doctors" className="me-3 icon" />
            <span>Doctors</span>
          </NavLink>
        </li>
        <li className="nav-item sidebar-list">
          <NavLink className="nav-link" to="/settings" activeClassName="active">
            <img src={settingsIcon} alt="Settings" className="me-3 icon" />
            <span>Settings</span>
          </NavLink>
        </li>
      </ul>
      {/* Footer */}
      <div className="sidebar-footer">
        <img className='sidebar-footer-profile' src={Photodoctor} width={30} height={30} alt="Medshyne Logo" onClick={() => profileNavigate()}/>
        <p className='sidebar-footer-head'> Medshyne </p>
        <p className='sidebar-footer-mail'>Medshyne@example.com</p>
      </div>
    </div>
  );
};

export default Sidebar;