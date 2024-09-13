import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, } from 'react-bootstrap';
import './SettingsRecovery.css'
import RecoveryOrganization from './RecoveryOrganization';
import RecoveryStaffs from './RecoveryStaffs';
import RecoveryStudents from './RecoveryStudents';


const SettingsPage = () => {
  const [activeComponent, setActiveComponent] = useState('home');
 

  const handleToggleComponent = (component) => {
    setActiveComponent(component);
  };

  useEffect(() => {
    setActiveComponent('Organization');
  }, []);


const buttonStyles = (component) => ({
    width: '30%',
    backgroundColor: 'transparent',
    color: activeComponent === component ? '#0089FF' : '#4D4D4D',
    border: 'none',
    fontWeight: '700',
    height: '25px',
    textDecoration: 'none', // Ensure no underline
   
    borderBottom: activeComponent === component ? '2px solid #0089FF' : 'none',
    borderRadius: '0',
    padding: '0',
    
  });
  
  
  
  return (
    <Container style={{ backgroundColor: '#F5F5F5',fontSize:'10px'  }}>
      <Row className="" style={{backgroundColor:'whitesmoke', marginTop:'.5%'}}>
       
        {activeComponent === 'home' && (
          <Col>
           
          </Col>
        )}
      </Row>
     
      <Row>
        <Col>
          <Row className=" ms-0 me-0 pt-0">
            <Col md={4}>
              <Button
                onClick={() => handleToggleComponent('Organization')}
                style={buttonStyles('Organization')}
                className="mb-2 setting-recovery-navigate "
              >
                Organization
              </Button>

              <Button
                onClick={() => handleToggleComponent('Staffs')}
                style={buttonStyles('Staffs')}
                className="mb-2 setting-recovery-navigate"
              >
               Staffs
              </Button>

              <Button
                onClick={() => handleToggleComponent('Students')}
                style={buttonStyles('Students')}
                className="mb-2 setting-recovery-navigate "
              >
                Students
              </Button>
            </Col>

            {activeComponent === 'Organization'&& <RecoveryOrganization/>}
            {activeComponent === 'Staffs' && <RecoveryStaffs/> }
            {activeComponent === 'Students' && <RecoveryStudents/>}
           
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsPage;
