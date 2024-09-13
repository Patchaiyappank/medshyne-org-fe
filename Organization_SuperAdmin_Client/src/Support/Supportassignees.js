import React, { useState, useEffect } from 'react';

import supportprofilee from '../images/supportAssigneesprofil.jpg';
import supportedit from '../images/supportedit.jpg';
import filterIcon from '../images/Vector.jpg'; // Add the path to your filter icon
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Navbar,
  Row,
} from 'react-bootstrap';

function SupportAssignees() {
  const [assignees, setAssignees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const assigneePerPage = 6;

  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newAssignee, setNewAssignee] = useState({
    name: '',
    employeeId: '',
  });
  const [selectedAssignee, setSelectedAssignee] = useState(null);

  // useEffect(() => {
  //   const fetchAssignees = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5000/viewall_support_assignee');
  //       const data = await response.json();
  //       if (data.Result === 'Success') {
  //         const fetchedAssignees = data.result.map((item, index) => ({
  //           id: index + 1,
  //           createdDate: new Date(item.doc),
  //           name: item.name,
  //           employeeId: item.id_number,
  //           ticketsAssigned: 0,
  //           email: item.email_id,
  //         }));
  //         setAssignees(fetchedAssignees);
  //       } else {
  //         console.error('Error fetching assignees:', data.message);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching assignees:', error);
  //     }
  //   };

  //   fetchAssignees();
  // }, []);
  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const response = await fetch('http://localhost:5000/viewall_support_assignee');
        const data = await response.json();
        if (data.Result === 'Success') {
          const fetchedAssignees = data.result.map((item, index) => ({
            id: index + 1,
            createdDate: new Date(item.doc),
            name: item.name,
            employeeId: item.id_number,
            ticketsAssigned: 0,
            email: item.email_id,
            supp_id: item.supp_id, // Ensure supp_id is correctly extracted
          }));
          setAssignees(fetchedAssignees);
        } else {
          console.error('Error fetching assignees:', data.message);
        }
      } catch (error) {
        console.error('Error fetching assignees:', error);
      }
    };
  
    fetchAssignees();
  }, []);

  const filteredAssignees = assignees.filter((assignee) =>
    String(assignee.employeeId).toLowerCase().includes(filter.toLowerCase())
  );
  

  const indexOfLastAssignee = currentPage * assigneePerPage;
  const indexOfFirstAssignee = indexOfLastAssignee - assigneePerPage;
  const currentAssignees = filteredAssignees.slice(indexOfFirstAssignee, indexOfLastAssignee);

  const handleAddAssignee = () => {
    setShowModal(true);
  };

 const handleSaveAssignee = async () => {
    try {
      const response = await fetch('http://localhost:5000/superAdmin_add_support_assignee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_number: newAssignee.employeeId,
          name: newAssignee.name,
          // Remove email_id if the server doesn't need it
        }),
      });
      
      const data = await response.json();
      
      if (data.message === 'Support executive added successfully') {
        const newAssigneeWithId = {
          ...newAssignee,
          id: data.id,  // Use the ID returned by the server
          createdDate: new Date(),
        };
        setAssignees([...assignees, newAssigneeWithId]);
        setShowModal(false);
      } else {
        console.error('Error adding assignee:', data.message);
        // Optionally handle errors, e.g., show a message to the user
      }
    } catch (error) {
      console.error('Error adding assignee:', error);
      // Optionally handle errors, e.g., show a message to the user
    }
  };


  const handleEditAssignee = (assignee) => {
    setSelectedAssignee(assignee);
    setShowEditModal(true)
  };

  const handleSaveEditAssignee = async () => {
    try {
      const response = await fetch('http://localhost:5000/update_support_assignee', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_number: selectedAssignee.employeeId,
          name: selectedAssignee.name,
          email_id: selectedAssignee.email,
        }),
      });
      
      const data = await response.json();
      
      if (data.Result === 'Success') {
        // Update the state with the new details
        const updatedAssignees = assignees.map((assignee) =>
          assignee.id === selectedAssignee.id ? selectedAssignee : assignee
        );
        setAssignees(updatedAssignees);
        setShowEditModal(false);
      } else {
        console.error('Error updating assignee:', data.message);
      }
    } catch (error) {
      console.error('Error updating assignee:', error);
    }
  };

  const handleDeleteAssignee = async () => {
    try {
      const response = await fetch('http://localhost:5000/superAdmin_assignee_delete_bts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supp_id: selectedAssignee.supp_id, // Use the supp_id from the selected assignee
        }),
      });
  
      const data = await response.text(); // Use .text() if the server response is plain text
  
      if (response.ok) {
        const updatedAssignees = assignees.filter((assignee) => assignee.id !== selectedAssignee.id);
        setAssignees(updatedAssignees);
        setShowEditModal(false);
      } else {
        console.error('Error deleting assignee:', data);
        // Optionally handle errors, e.g., show a message to the user
      }
    } catch (error) {
      console.error('Error deleting assignee:', error);
      // Optionally handle errors, e.g., show a message to the user
    }
  };
  

  const handleCloseModal = () => setShowModal(false);
  const handleCloseEditModal = () => setShowEditModal(false);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(filteredAssignees.length / assigneePerPage);

    const pageNumbers = [...Array(totalPages).keys()].map((number) => (
      <span
        key={number + 1}
        className={`pagination-number ${currentPage === number + 1 ? 'active' : ''}`}
        onClick={() => handlePageChange(number + 1)}
        style={{ cursor: 'pointer', margin: '0 5px' }}
      >
        {number + 1}
      </span>
    ));

    return pageNumbers;
  };

  return (
    <div className="App">
      <Navbar expand="lg">
        <Container className="d-flex align-items-center">
          <Navbar.Brand style={{fontSize:'12px'}}>
            Total: {' '}
            <span style={{ fontWeight: 'bold', color: 'black',fontSize:'12px' }}>
              {filteredAssignees.length} Assignees
            </span>
          </Navbar.Brand>
          <div className="d-flex ms-auto align-items-center">
            <Button
              style={{
              fontSize:'10px',
              width:'100%',
                borderRadius: '23px',
                backgroundColor: '#0089FF',
                border: 'none',
              
                color: 'white',
                marginRight: '30px',
                position: 'relative',
                padding:'10px',
                paddingRight:'27px'
              }}
              onClick={handleAddAssignee}
            >
              Add Assignee
              <span
                style={{
                  position: 'absolute',
                  right: '7px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  border: '1px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </span>
            </Button>

           
          </div>
        </Container>
      </Navbar>

      <Container className="mt-1 " style={{width:'95%'}}>
        <Row className="mb-4">
          {currentAssignees.map((assignee) => (
            <Col key={assignee.id} md={4} className="mb-4">
              <Card style={{border:'none'}}>
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <Badge bg="light" text="dark">
                      <i className="bi-person"></i>
                    </Badge>
                  </div>
                  <Row>
                    <Col xs={2}>
                      <img
                        src={supportprofilee}
                        style={{ width: '30px', borderRadius: '5%' }}
                        alt="Profile"
                      />
                    </Col>
                    <Col xs={7}>
                      <Card.Title className="mb-1" style={{ fontWeight: 'bolder',fontSize:'12px' }}>
                        {assignee.name}
                      </Card.Title>
                      <p style={{ color: '#7E92A2',fontSize:'12px'  }}>{assignee.email}</p>
                    </Col>
                    <Col xs={3}>
                      <img
                        src={supportedit}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px', cursor: 'pointer' }}
                        alt="Profile Icon"
                        onClick={() => handleEditAssignee(assignee)}
                      />
                    </Col>
                  </Row>
                  <hr style={{color:' rgba(0, 0, 0, 0.2)',marginTop:'2%'}}></hr>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col style={{ color: '#7E92A2',fontSize:'12px',marginTop:'-15px'  }}>
                          <strong>Employee ID:</strong>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={{ fontWeight: 'bolder',fontSize:'12px'  }}>{assignee.employeeId}</Col>
                      </Row>
                      <Row className="mt-2">
                        <Col style={{ color: '#7E92A2',fontSize:'12px'  }}>
                          <strong>Created Date:</strong>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col style={{ fontWeight: 'bolder',fontSize:'12px'  }}>
                          {assignee.createdDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      
         <div className="Support-pagination" style={{ textAlign: 'center', marginBottom: '5%', color: '#697077', fontWeight: '500' }}>
          <span
            className="Support-pagination-arrow"
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            style={{
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              marginRight: '10px',
              fontSize: '12px',
              color: currentPage === 1 ? '#697077' : '#697077',
            }}
          >
            <span className="Support-prevoius-arrow" style={{ padding: '10px' }}>&#8249;</span> Previous
          </span>
          <span style={{ fontSize: '12px' }} className="Support-pagination-pages">
            {renderPageNumbers()}
          </span>
          <span
            className="Support-pagination-arrow"
            onClick={() => currentPage < Math.ceil(filteredAssignees.length / assigneePerPage)  && setCurrentPage(currentPage + 1)}
            style={{
              cursor: currentPage === Math.ceil(filteredAssignees.length / assigneePerPage)  ? 'not-allowed' : 'pointer',
              marginLeft: '10px',
              fontSize: '12px',
              color: currentPage === Math.ceil(filteredAssignees.length / assigneePerPage)  ? '#697077' : '#697077',
            }}
          >
            Next <span className="Support-next-arrow" style={{ padding: '10px' }}>&#8250;</span>
          </span>
        </div>
      </Container>

      {/* Add Assignee Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header style={{fontSize:'12px'}} closeButton>
          <Modal.Title style={{ fontSize:'15px' ,color:'#7E92A2', fontWeight:'bolder'}}>Add Assignee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mt-0">
              <Form.Label style={{ fontSize:'12px', marginTop:'-10px',fontWeight:'bolder'}}>Name</Form.Label>
              <Form.Control
                type="text"
                value={newAssignee.name}
                onChange={(e) => setNewAssignee({ ...newAssignee, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label  style={{ fontSize:'12px', marginTop:'-10px',fontWeight:'bolder'}}>Employee ID</Form.Label>
              <Form.Control
                type="text"
                value={newAssignee.employeeId}
                onChange={(e) => setNewAssignee({ ...newAssignee, employeeId: e.target.value })}
              />
            </Form.Group>
          </Form>
       
       
          <Button  onClick={handleSaveAssignee}
           style={{width: '100%', height: '40px', backgroundColor: '#0089FF', color: '#FFFFFF', border: 'none', borderRadius: '25px',fontSize:'12px'}}>
            Submit
          </Button>
          </Modal.Body>
      </Modal>

      {/* Edit Assignee Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize:'15px' ,color:'#7E92A2', fontWeight:'bolder'}}>Edit Assignee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAssignee && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label  style={{ fontSize:'12px', marginTop:'-10px',fontWeight:'bolder'}}>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAssignee.name}
                  onChange={(e) =>
                    setSelectedAssignee({ ...selectedAssignee, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize:'12px', marginTop:'-10px',fontWeight:'bolder'}}>Employee ID</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAssignee.employeeId}
                  onChange={(e) =>
                    setSelectedAssignee({ ...selectedAssignee, employeeId: e.target.value })
                  }
                />
              </Form.Group>
              
            </Form>
          )}
          <Button
  onClick={handleDeleteAssignee}
  style={{ width: '45%', height: '40px', backgroundColor: '#FFFFFF', color: '#F94D63', border: 'none', borderRadius: '5px' }}
>
  Delete
</Button>

        
          <Button  onClick={handleSaveEditAssignee}
          style={{width: '45%', height: '40px', backgroundColor: '#0089FF', color: '#FFFFFF', border: 'none', borderRadius: '25px' }}>
            Save Changes
            
          </Button>
        </Modal.Body>
       
         
        
      </Modal>
    </div>
  );
}

export default SupportAssignees;
