import React, { useState, useEffect } from 'react';
import SupportHome from './Supporthome.js';
import SupportTickets from './Supportticktes.js';
import SupportAssignees from './Supportassignees.js';
import { Button, Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import './Support.css';
import searchIcon from '../images/Supportsearch.jpg'; // Make sure to have the search icon image in the appropriate path

const SupportPage = () => {
  const [activeComponent, setActiveComponent] = useState('home');
  const [searchExpanded, setSearchExpanded] = useState(false);

  const handleToggleComponent = (component) => {
    setActiveComponent(component);
  };

  useEffect(() => {
    setActiveComponent('home');
  }, []);

  const buttonStyle = (component) => ({
    width: '28%',
    backgroundColor: activeComponent === component ? '#0089FF' : 'transparent',
    color: activeComponent === component ? 'white' : '#4D4D4D',
    border: 'none',
    height: '32px',
    fontWeight:'500',
    fontSize: '14px', // Adjust the font size as needed
  });
  
  const handleSearchIconClick = () => {
    setSearchExpanded(!searchExpanded);
  };

  return (
    <Container style={{  marginTop: '-5px',marginRight:'0px',width:'84.3%' }}>
      <Row className="align-items-center">
        <Col>
          <h1 className='mt-3 ps-3 fs-3 fw-bold '>Support</h1>
        </Col>
        {activeComponent === 'home' && (
          <Col>
            <InputGroup className="float-end" style={{ marginTop: '2%' }}>
              <Form.Control
                placeholder="Search"
                aria-label="Search"
                aria-describedby="search-icon"
                style={{
                  width: searchExpanded ? '200px' : '0px',
                  opacity: searchExpanded ? 1 : 0,
                  transition: 'width 0.5s, opacity 0.5s',
                  padding: searchExpanded ? '0.375rem 0.75rem' : '0',
                  borderRadius: '25px'
                }}
              />
              <InputGroup.Text id="search-icon" onClick={handleSearchIconClick}>
                <img src={searchIcon} alt="Search" width="40px" style={{ cursor: 'pointer' }} />
              </InputGroup.Text>
            </InputGroup>
          </Col>
        )}
      </Row>
      <hr  style={{color: '#0000003A', marginTop:'-1px', width:'100%', marginLeft:'-50px'}}></hr>
      <Row>
        <Col>
          <Row className="  mt-0 ms-2 me-2 ">
            <Col md={4}>
              <Button
                onClick={() => handleToggleComponent('home')}
                style={buttonStyle('home')}
                className="mb-2"
              >
                Home
              </Button>

              <Button
                onClick={() => handleToggleComponent('tickets')}
                style={buttonStyle('tickets')}
                className="mb-2"
              >
                Tickets
              </Button>

              <Button
                onClick={() => handleToggleComponent('assignees')}
                style={buttonStyle('assignees')}
                className="mb-2"
              >
                Assignees
              </Button>
            </Col>

            {activeComponent === 'home' && <SupportHome />}
            {activeComponent === 'tickets' && <SupportTickets />}
            {activeComponent === 'assignees' && <SupportAssignees />}
          
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SupportPage;