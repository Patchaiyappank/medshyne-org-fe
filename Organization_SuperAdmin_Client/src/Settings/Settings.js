// import React, { useState, useEffect } from 'react';
// import { Button, Container, Row, Col, } from 'react-bootstrap';
// import SettingsRecovery from './SettingsRecovery';
// import SettingsBlog from './SettingsBlog'
// import Profile from './profilescreen';
// import './Settings.css'

// const SettingsPage = () => {
//   const [activeComponent, setActiveComponent] = useState('home');
 

//   const handleToggleComponent = (component) => {
//     setActiveComponent(component);
//   };

//   useEffect(() => {
//     setActiveComponent('landingpage');
//   }, []);

//   const buttonStyle = (component) => ({
//     width: '30%',
//     backgroundColor: activeComponent === component ? '#0089FF' : '#F5F5F5',
//     color: activeComponent === component ? 'white' : '#4D4D4D',
//     border: 'none',
//     fontWeight: '700',
//     height:'33px'
//   });

 

//   return (
//     <div className= " Setting-container" style={{ backgroundColor: '#F5F5F5' ,paddingTop:'0%'}}>
//       <Row className="align-items-center" style={{backgroundColor:'whitesmoke'}}>
//         <Col>
//           <h4 className='mt-3 ps-4 fs-5 fw-bold'>Settings</h4>
//         </Col>
//         {activeComponent === 'home' && (
//           <Col>
           
//           </Col>
//         )}
//       </Row>
//       <hr style={{color:' rgba(0, 0, 0, 0.2)', marginTop:'0%',height:'1px'}} ></hr>
//       <Row>
//         <Col className='settingdetails'>
//           <Row className=" ms-0 pt-0 " >
//             <Col  md={6}>
//               <Button
              
//                 onClick={() => handleToggleComponent('landingpage')}
//                 style={buttonStyle('landingpage')  }
//                 className="mb-2 settingbtn "
//               >
//                 Landing page
//               </Button>
//               <Button
              
//               onClick={() => handleToggleComponent('blog')}
//               style={buttonStyle('blog')  }
//               className="mb-2 settingbtn "
//             >
//               Blog
//             </Button>

//               <Button
//                 onClick={() => handleToggleComponent('recovery')}
//                 style={buttonStyle('recovery')}
//                 className="mb-2 settingbtn"
//               >
//                 Recovery
//               </Button>

//               <Button
//                 onClick={() => handleToggleComponent('profile')}
//                 style={buttonStyle('profile')}
//                 className="mb-2 settingbtn"
//               >
//                 Profile
//               </Button>
              
//             </Col>

//             {activeComponent === 'landingpage'}
//             {activeComponent === 'Blog' && <SettingsBlog/>}
//             {activeComponent === 'recovery'  && <SettingsRecovery/>}
//             {activeComponent === 'profile' && <Profile/>}
          
//           </Row>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default SettingsPage;



import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import SettingsRecovery from './SettingsRecovery';
import SettingsBlog from './SettingsBlog';
import { useLocation, useNavigate } from 'react-router-dom';
import SettingsLandingpage from './SettingsLandingpage';
import Profile from '../Profile/profilescreen';
import './Settings.css';

const SettingsPage = () => {
  const [activeComponent, setActiveComponent] = useState('landingpage');
  const location = useLocation();
  const navigate = useNavigate();

  const handleToggleComponent = (component) => {
    setActiveComponent(component);
  };

  useEffect(() => {
    // Check if mode is 'profile' and set the active component
    if (location.state?.mode === 'profile') {
      setActiveComponent('profile');
    }
  }, [location.state]);

  const buttonStyle = (component) => ({
    marginRight: '10px',
    backgroundColor: activeComponent === component ? '#0089FF' : '#F5F5F5',
    color: activeComponent === component ? 'white' : '#4D4D4D',
    border: 'none',
    fontWeight: '700',
    height: '33px',
    borderRadius: '5px', // Optional: for rounded corners
    padding: '5px 20px', // Adjust padding to ensure the buttons are evenly sized
  });

  return (
    <div className="Setting-container" style={{ backgroundColor: '#F5F5F5', paddingTop: '0%' }}>
      <Row className="" style={{ backgroundColor: 'whitesmoke' }}>
        <Col>
          <h4 className='mt-3 ps-4 fs-5 fw-bold'>Settings</h4>
        </Col>
      </Row>
      <hr style={{ color: 'rgba(0, 0, 0, 0.2)', marginTop: '0%', height: '1px' }}></hr>
      <Row>
        <Col className='settingdetails'>
          <Row className="ms-1 pt-0">
            <Col md={12}>
              <Button
                onClick={() => handleToggleComponent('landingpage')}
                style={buttonStyle('landingpage')}
                className="mb-2 settingbtn"
              >
                Landing page
              </Button>
              <Button
                onClick={() => handleToggleComponent('blog')}
                style={buttonStyle('blog')}
                className="mb-2 settingbtn"
              >
                Blog
              </Button>
              <Button
                onClick={() => handleToggleComponent('recovery')}
                style={buttonStyle('recovery')}
                className="mb-2 settingbtn"
              >
                Recovery
              </Button>
              <Button
                onClick={() => handleToggleComponent('profile')}
                style={buttonStyle('profile')}
                className="mb-2 settingbtn"
              >
                Profile
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              {activeComponent === 'landingpage' && <SettingsLandingpage/> }
              {activeComponent === 'blog' && <SettingsBlog/>}
              {activeComponent === 'recovery' && <SettingsRecovery />}
              {activeComponent === 'profile' && <Profile />}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage;
