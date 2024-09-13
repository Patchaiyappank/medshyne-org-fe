import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, } from 'react-bootstrap';
import SettingsRecovery from './SettingsRecovery';
import Profile from './profilescreen';
import './Settings.css'

const SettingsPage = () => {
  const [activeComponent, setActiveComponent] = useState('home');
 

  const handleToggleComponent = (component) => {
    setActiveComponent(component);
  };

  useEffect(() => {
    setActiveComponent('profile');
  }, []);

  const buttonStyle = (component) => ({
    width: '30%',
    backgroundColor: activeComponent === component ? '#0089FF' : '#F5F5F5',
    color: activeComponent === component ? 'white' : '#4D4D4D',
    border: 'none',
    fontWeight: '700',
    height:'33px'
  });

 

  return (
    <div className= "Setting-container" style={{ backgroundColor: '#F5F5F5' ,paddingTop:'1%'}}>
      <Row className="align-items-center" style={{backgroundColor:'whitesmoke'}}>
        <Col>
          <h4 className='mt-3 ps-4 fs-3 fw-bold'>Settings</h4>
        </Col>
        {activeComponent === 'home' && (
          <Col>
           
          </Col>
        )}
      </Row>
      <hr style={{color:' rgba(0, 0, 0, 0.1)', marginTop:'0%',fontSize:'10px'}}></hr>
      <Row>
        <Col>
          <Row className=" ms-0 ">
            <Col  md={5}>
              <Button
              
                onClick={() => handleToggleComponent('landingpage')}
                style={buttonStyle('landingpage')  }
                className="mb-2 settingbtn"
              >
                Landingpage
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

            {activeComponent === 'landingpage'}
            {activeComponent === 'recovery'  && <SettingsRecovery/>}
            {activeComponent === 'profile' && <Profile/>}
          
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage;
