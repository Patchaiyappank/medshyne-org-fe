import React, { useState, useEffect } from 'react';
import EmploysDepartmentList from './EmploysDepartmentList.js';
import EmploysDesignations from './EmploysDesignations.js';
import EmploysList from './EmploysList.js';
import { useLocation } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';

const EmploysManagenmenthead = () => {
  const location = useLocation();
  const [activeComponent, setActiveComponent] = useState('EmploysDepartmentList');

  useEffect(() => {
    // Check if the mode is 'Employ' in the state
    if (location.state?.mode === 'Employ') {
      setActiveComponent('EmploysList');
    }
  }, [location.state]);

  const handleToggleComponent = (component) => {
    setActiveComponent(component);
  };



  const buttonStyle = (component) => ({
    width: '30%',
    backgroundColor: activeComponent === component ? '#0089FF' : 'transparent',
    color: activeComponent === component ? 'white' : '#4D4D4D',
    border: 'none',
    fontWeight: '500',
    height: '40px',
    textAlign: 'center',
    fontSize: '13px',
    marginBottom: '10px',
  });

  return (
    <Container style={{ marginTop: '-5px',marginRight:'20px',width:'84.2%' }}>
      <Row className="align-items-center">
        <Col>
          <h4 className='mt-4 ps-3 fs-4 fw-bold'>Employees Management</h4>
        </Col>
      </Row>
      <hr style={{ color: 'rgba(0, 0, 0, 0.1)' }} />
      <Row>
        <Col>
          <Row className="mt-2 ms-2 me-2">
            <Col md={4}>
              <Button
                onClick={() => handleToggleComponent('EmploysDepartmentList')}
                style={buttonStyle('EmploysDepartmentList')}
              >
                Departments
              </Button>

              <Button
                onClick={() => handleToggleComponent('EmploysDesignations')}
                style={buttonStyle('EmploysDesignations')}
              >
                Designations
              </Button>

              <Button
                onClick={() => handleToggleComponent('EmploysList')}
                style={buttonStyle('EmploysList')}
              >
                Employees
              </Button>
            </Col>

            <Col md={12}>
              {activeComponent === 'EmploysDepartmentList' && <EmploysDepartmentList />}
              {activeComponent === 'EmploysDesignations' && <EmploysDesignations />}
              {activeComponent === 'EmploysList' && <EmploysList />}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default EmploysManagenmenthead;
