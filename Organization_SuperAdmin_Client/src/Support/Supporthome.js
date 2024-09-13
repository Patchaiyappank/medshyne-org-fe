import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Image, Modal, Form } from 'react-bootstrap';
import supportticktes from '../images/supportticktes.png';
import supportprofile from '../images/supportprofile.jpg';
import supportAssigneesprofile from '../images/supportAssigneesprofil.jpg';
import supportAssignees from '../images/supportAssignees.jpg';
import supportAssigneesedit from '../images/supportedit.jpg';
import './Support.css';
import Supportticktes from './Supportticktes'; // Import the Supportticktes component
import SupportAssignees from './Supportassignees'; // Import the SupportAssignees component

const SupportHome = () => {
  const [totalTickets, setTotalTickets] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [recentTicket, setRecentTicket] = useState(null);
  const [visibleTickets, setVisibleTickets] = useState(4);
  const [visibleAssignees, setVisibleAssignees] = useState(4);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [assigneeForm, setAssigneeForm] = useState({ name: '', email: '', employeeId: '' });
  const [showSupportTickets, setShowSupportTickets] = useState(false);
  const [showSupportAssignees, setShowSupportAssignees] = useState(false);

  const getStatusButtonColor = (status) => {
    switch (status) {
      case 'IN PROGRESS':
        return {
          color: '#FFD739',
          backgroundColor: 'rgba(255, 215, 57, 0.1)',
          border: 'none',
          fontSize: '10px',
          borderRadius: '17px',
          fontWeight: '700',
          minWidth: '50px',
        };
      case 'open':
        return {
          color: '#E51837',
          backgroundColor: 'rgba(229, 24, 55, 0.1)',
          border: 'none',
          minWidth: '50px',
          borderRadius: '17px',
          fontSize: '10px',
          fontWeight: '700'
        };
      case 'solved':
        return {
          color: '#45C49C',
          backgroundColor: '#EBF9F5',
          border: 'none',
          minWidth: '50px',
          borderRadius: '17px',
          fontSize: '10px',
          fontWeight: '700'
        };
      default:
        return {};
    }
  };

  useEffect(() => {
    const fetchTotalTickets = async () => {
      try {
        const response = await fetch('http://localhost:5000/total_ticket');
        const data = await response.json();
        if (data.Result === "Success") {
          setTotalTickets(data.total_ticket);
        }
      } catch (error) {
        console.error('Error fetching total tickets:', error);
      }
    };

    fetchTotalTickets();
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:5000/view_all_ticket_details');
        const data = await response.json();
        if (data.Result === "Success") {
          setTickets(data.result.map(ticket => ({
            id: ticket.ticket_id,
            description: ticket.subject,
            status: ticket.ticket_status,
            name: ticket.name,
            submitted: ticket.submitted,
          })));
        } else {
          console.error('Error fetching tickets:', data.message);
          setTickets([]);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setTickets([]);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const response = await fetch('http://localhost:5000/viewall_support_assignee');
        const data = await response.json();
        if (data.Result === "Success") {
          setAssignees(data.result.map(assignee => ({
            id: assignee.id_number,
            supportAssigneesprofile,
            supportAssigneesedit,
            name: assignee.name,
            email: assignee.email_id,
            employeeId: assignee.id_number,
            supp_id: assignee.supp_id,
          })));
        } else {
          console.error('Error fetching assignees:', data.message);
          setAssignees([]);
        }
      } catch (error) {
        console.error('Error fetching assignees:', error);
        setAssignees([]);
      }
    };

    fetchAssignees();
  }, []);

  useEffect(() => {
    const fetchRecentTicket = async () => {
      try {
        const response = await fetch('http://localhost:5000/view_recent_ticket_details');
        const data = await response.json();
        if (data.Result === "Success") {
          const ticket = data.result[0];
          setRecentTicket({
            organizationName: ticket.organization_name,
            schoolName: ticket.name,
            user: ticket.name,
            submitted: new Date(ticket.submitted).toLocaleDateString(),
            subject: ticket.subject,
            issue: ticket.issue
          });
        } else {
          console.error('Error fetching recent ticket:', data.message);
          setRecentTicket(null);
        }
      } catch (error) {
        console.error('Error fetching recent ticket:', error);
        setRecentTicket(null);
      }
    };

    fetchRecentTicket();
  }, []);

  const handleViewAllTickets = () => {
    setShowSupportTickets(true);
    setShowSupportAssignees(false);
  };
  
  const handleViewAllAssignees = () => {
    setShowSupportTickets(false);
    setShowSupportAssignees(true);
  };
  
  const handleLoadMoreTickets = () => {
    setVisibleTickets((prevVisibleTickets) => Math.min(prevVisibleTickets + 4, tickets.length));
  };

  const handleLoadMoreAssignees = () => {
    setVisibleAssignees((prevVisibleAssignees) => Math.min(prevVisibleAssignees + 4, assignees.length));
  };

  const handleEditAssignee = (assignee) => {
    setSelectedAssignee(assignee);
    setAssigneeForm({ name: assignee.name, email: assignee.email, employeeId: assignee.employeeId });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAssignee(null);
  };

  const handleDeleteAssignee = async () => {
    try {
      const response = await fetch('http://localhost:5000/superAdmin_assignee_delete_bts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supp_id: selectedAssignee.supp_id }),
      });

      const result = await response.text();

      if (response.ok) {
        setAssignees((prevAssignees) => prevAssignees.filter((a) => a.supp_id !== selectedAssignee.supp_id));
        handleCloseModal();
      } else {
        console.error('Error deleting assignee:', result);
      }
    } catch (error) {
      console.error('Error deleting assignee:', error);
    }
  };

  const handleSaveAssignee = async () => {
    try {
      const response = await fetch('http://localhost:5000/update_support_assignee', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_number: selectedAssignee.id,
          name: assigneeForm.name,
        }),
      });

      const data = await response.json();
      if (data.Result === "Success") {
        setAssignees((prevAssignees) =>
          prevAssignees.map((assignee) =>
            assignee.id === selectedAssignee.id
              ? { ...assignee, name: assigneeForm.name, email: assigneeForm.email }
              : assignee
          )
        );
        handleCloseModal();
      } else {
        console.error('Error updating assignee:', data.message);
      }
    } catch (error) {
      console.error('Error updating assignee:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAssigneeForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  return (
    <Container>
      {showSupportTickets ? (
        <Supportticktes /> // Render the Supportticktes component when the button is clicked
      ) : showSupportAssignees ? (
        <SupportAssignees /> // Render the SupportAssignees component when the button is clicked
      ) : (
        <Row className="mt-3">
          <Col md={4}>
            <Card className="" style={{border:'none' }}>
              <Card.Body className="d-flex ">
                <img style={{ width: '17%', height: '15%' }} src={supportticktes} alt="Support Tickets" />
                <div>
                  <h7 style={{ color: '#7E92A2',marginLeft:'8px' }}>Total Tickets</h7>
                  <h2 style={{ fontWeight: '700', marginLeft: '10%',marginTop:'-5PX' }}>{totalTickets}</h2>
                </div>
              </Card.Body>
              <hr style={{color:' rgba(0, 0, 0, 0.2)',marginTop:'-3%'}}></hr>
              <div className="d-flex justify-content-between px-4">
                <p style={{fontSize:'12px'}}  className="mb-0"><strong>Ticket List</strong></p>
                <p className="mb-0" style={{ color: '#0089FF', cursor: 'pointer',fontSize:'12px' }} onClick={handleViewAllTickets}>View All</p>
              </div>
              <Card.Body>
                <ListGroup variant="flush mb-3">
                  {Array.isArray(tickets) && tickets.slice(0, visibleTickets).map((ticket) => (
                    <ListGroup.Item key={ticket.id} style={{ border: 'none', padding: '5px 0' }}>
                      <div className="d-flex align-items-center">
                        <div className="me-2 ">
                          <img src={supportprofile} style={{ width: '30px', borderRadius: '5%',marginTop:'-0px' }} alt="Profile" />
                        </div>
                        <div className="d-flex flex-column flex-grow-1 me-2 mt-1 ">
                          <strong style={{ fontSize: '10px' }}>{ticket.description}</strong>
                          <small style={{ color: '#7E92A2', fontSize: '12px' }}>{ticket.name}</small>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <Button style={{ ...getStatusButtonColor(ticket.status),marginTop:'10px'}}>{ticket.status}</Button>
                          <small style={{ color: '#7E92A2', fontSize: '10px' }}>{ticket.submitted}</small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Button
                  onClick={handleLoadMoreTickets}
                  style={{fontSize:'12px', marginLeft: '30%', padding:'10px' ,backgroundColor: 'white', color: 'black', borderRadius: '20px', borderColor: '#EAEEF4',fontWeight:'500',marginTop:'-5%' }}
                  disabled={visibleTickets >= tickets.length}
                >
                  Load More
                </Button>
              </Card.Body>
            </Card>
          </Col>
       
          <Col md={4}>
            <Card className="mb-4" style={{border:'none',fontSize:'12px'}}>
              <Card.Body className="d-flex" >
                <img style={{ width: '17%', height: '17%'}} src={supportAssignees} alt="Support Assignees" />
                <div>
                  <h6 style={{ color: '#7E92A2' ,marginLeft:'7px'}}>Total Assignees</h6>
                  <h2 style={{ fontWeight: '700', marginLeft: '7%',marginTop:'-9%' }}>{assignees.length}</h2>
                </div>
              </Card.Body>
              <hr style={{color:' rgba(0, 0, 0, 0.1)',marginTop:'-3%'}}></hr>
              <div className="d-flex justify-content-between px-4">
                <p className="mb-0"><strong>Assignee List</strong></p>
                <p className="mb-0" style={{ color: '#0089FF', cursor: 'pointer',fontSize:'12px' }} onClick={handleViewAllAssignees}>View All</p>
              </div>
              <Card.Body>
                <ListGroup variant="flush">
                  {assignees.slice(0, visibleAssignees).map((assignee) => (
                    <div key={assignee.id} className="d-flex" style={{ borderBottom: 'none' }}>
                      <div className="d-flex align-items-center w-100">
                        <div className="mb-4">
                          <Image src={assignee.supportAssigneesprofile} style={{ marginRight: '10%', width: '30px', borderRadius: '15%' }} alt="Profile" />
                        </div>
                        <div className="d-flex flex-column justify-content-center mb-4 px-3" style={{ width: '60%' }}>
                          <strong>{assignee.name}</strong>
                          <small style={{ color: '#7E92A2', marginLeft: '-2%', fontSize: '11px' }}>{assignee.email}</small>
                        </div>
                        <div className="d-flex flex-column align-items-end" style={{ width: '30%' }}>
                          <Image src={assignee.supportAssigneesedit} style={{ width: '30px', borderRadius: '15%',marginTop:'-15px' }} alt="Edit" onClick={() => handleEditAssignee(assignee)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </ListGroup>
                <Button
                  onClick={handleLoadMoreAssignees}
                  style={{ marginLeft: '30%',  padding: '10px 10px', backgroundColor: 'white', color: 'black', borderRadius: '20px', borderColor: '#EAEEF4',fontWeight:'500' ,fontSize:'12px'}}
                  disabled={visibleAssignees >= assignees.length}
                >
                  Load More
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="recentcard" style={{ border: 'none', height: '94%',fontSize:'12px' }}>
              <Card.Body className="scrollable-content">
                <div className="d-flex justify-content-between mb-3">
                  <p className="mb-0 mt-3"><strong>Recent Ticket</strong></p>
                  <Button
                    style={{
                      backgroundColor: 'white',
                      color: '#061B2E',
                      borderRadius: '20px',
                      borderColor: '#EAEEF4',
                      fontSize:'12px',
                      fontWeight:'700px'
                    }}
                  >
                    See Details
                  </Button>
                </div>
                {recentTicket ? (
                  <>
                    <small style={{ color: '#7E92A2' }}>Organization Name</small>
                    <p style={{ fontWeight: 'bolder' }}>{recentTicket.organizationName}</p>
                    <small style={{ color: '#7E92A2' }}>User</small>
                    <p style={{ fontWeight: 'bolder' }}>{recentTicket.user}</p>
                    <small style={{ color: '#7E92A2' }}>Submitted</small>
                    <p style={{ fontWeight: 'bolder' }}>{recentTicket.submitted}</p>
                    <small style={{ color: '#7E92A2' }}>Subject</small>
                    <p style={{ fontWeight: 'bolder' }}>{recentTicket.subject}</p>
                    <small style={{ color: '#7E92A2' }}>Ticket Issue</small>
                    <p>{recentTicket.issue}</p>
                  </>
                ) : (
                  <p>No recent ticket details available</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      <Modal show={showModal} onHide={handleCloseModal} style={{marginBottom:'-5%',fontSize:'12px'}}>
        <Modal.Header  closeButton>
          <Modal.Title style={{color:'#7E92A2',fontSize:'15px'}}>Edit Assignee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAssignee && (
            <>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label style={{fontWeight:'700'}}>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={assigneeForm.name}
                    style={{fontWeight:'500'}}
                    onChange={handleFormChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{fontWeight:'700'}}>Employee Id</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={selectedAssignee.id}
                    style={{fontWeight:'500'}}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Form>
            </>
          )}
          <Button
            onClick={handleDeleteAssignee}
            style={{ width: '45%', height: '50px', backgroundColor: '#FFFFFF', color: '#F94D63 ', border: 'none', borderRadius: '5px',fontWeight:'500'}}
          >
            Delete
          </Button>
          <Button
            onClick={handleSaveAssignee}
            style={{ width: '45%', height: '50px', backgroundColor: '#0089FF', color: '#FFFFFF', border: 'none', borderRadius: '25px' }}
          >
            Save
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SupportHome;
