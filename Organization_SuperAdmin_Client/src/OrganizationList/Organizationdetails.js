import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Image, Spinner, Modal } from 'react-bootstrap';
import './Organizationdetails.css';
import orgo from '../assest/Avatar 2.png';
import editIcon from '../assest/Editsss.png';
import stopAccessIcon from '../assest/access_stop.png';
import giveAccessIcon from '../assest/tick-circle.png'; 
import recoverIcon from '../assest/Recover.png';
import { useLocation, useNavigate } from 'react-router-dom';

const OrganizationDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [organizationData, setOrganizationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isApproved, setIsApproved] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');

  const organizationId = location.state?.id;

  useEffect(() => {
    if (organizationId) {
      axios.get(`http://localhost:5000/superAdmin_view_organization_details/${organizationId}`)
        .then((response) => {
          const data = response.data;
          setOrganizationData(data);
          setIsDeleted(data.organization.is_deleted === 1);
          setIsApproved(data.organization.is_approved);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching organization details:', error);
          setLoading(false);
        });
    } else {
      console.error('No organizationId found');
      setLoading(false);
    }
  }, [organizationId]);

  const handleGiveAccess = () => {
    axios.put('http://localhost:5000/superAdmin_organizaion_give_access_bts', {
      id: organizationId,
      org_access_bts: 1 // Give access
    })
    .then(response => {
      alert(response.data.message);
      setIsApproved(1);
    })
    .catch(error => {
      console.error('Error giving access:', error);
    });
  };

  const handleStopAccess = () => {
    axios.put('http://localhost:5000/superAdmin_organizaion_is_deleted_bts', {
      id: organizationId,
      org_access_bts: 0 // Stop access
    })
    .then(response => {
      alert(response.data.message);
      setIsApproved(0);
    })
    .catch(error => {
      console.error('Error stopping access:', error);
    });
  };

  const handleDeleteOrRecover = () => {
    const newDeletedStatus = isDeleted ? 0 : 1;

    axios.put('http://localhost:5000/superAdmin_organizaion_is_deleted_bts', {
      id: organizationId
    })
    .then(response => {
      alert(response.data.message);
      setIsDeleted(newDeletedStatus);
    })
    .catch(error => {
      console.error('Error updating delete status:', error);
    });
  };

  
const handleStudentClick = () => {
  navigate('/Studentlist');
};


const handleInventoryClick = () => {
  navigate('/inventory');
};

const handleStaffClick = () => {
  navigate('/Stafflist');
};

const handleConsultationClick = () => {
  navigate('/DashboardConsultingTable');
};

  const handleViewDocument = () => {
    if (organizationData?.organization?.upload_doc) {
      setDocumentUrl(organizationData.organization.upload_doc);
      setShowModal(true);
    } else {
      alert('No document available');
    }
  };

  const handleEditClick = () => {
    alert(`You are editing details for Organization ID: ${organizationId}`);
    navigate('/AddOrganization', { state: { id: organizationId, mode: 'edit' } });
  };
  

  const handleCloseModal = () => setShowModal(false);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (!organizationData) {
    return <p>No data available</p>;
  }

  const { total_student, total_staff, Medicine_inventory, consultations } = organizationData;
  const { organization_name, id, r_m_name, Date, gst_number, organization_mobile_no, organisation_register_no, address, contact_name, designation, contact_mobile_no, contact_email_id, profile } = organizationData.organization || {};

  return (
    <>
      <h4 style={{marginLeft:'17%'}} className="text-dark pt-3 fw-bold">Organization Details</h4>
      <hr />
      <Container style={{ marginTop: "-5px",marginLeft:'15%',width:'85%'}}  fluid className="p-1">
        <Card style={{ border: 'none', height: "100%", width: '97%' }} className='shadow-sm ms-3'>
          <Card.Body>
            <Row style={{ marginTop: '-13px', paddingTop: '15px', paddingBottom: '5px' }} className="mb-2">
              <Col className='ms-5'>
                <h5>{organization_name}</h5>
              </Col>
              <Col className="text-end">
              <Button
              onClick={handleEditClick}
              style={{ borderRadius: '20px', paddingRight: "10px", paddingLeft: "15px", height: '30px', paddingTop: '6px', fontSize: '12px' }}
              className="mb-2 me-3"
            >
              <Image
                src={editIcon}
                alt="Edit"
                style={{ width: '12px', marginRight: '8px', marginBottom: '3px' }}
              />
              Edit Details
            </Button>
                <Button
                  onClick={handleDeleteOrRecover}
                
                    style={{backgroundColor: isDeleted ? '#B931FC' : '#FF0C0C', borderRadius: '20px', paddingRight: "10px", paddingLeft: "15px", height: '30px', paddingTop: '5px', fontSize: '12px' ,border:'none'}}
               
                  className="me-2 mb-2"
                >
                  <Image src={isDeleted ? recoverIcon : stopAccessIcon} alt={isDeleted ? 'Recover' : 'Delete'} width={20} height={20} className="me-2 mb-1" />
                  {isDeleted ? 'Recover' : 'Delete'}
                </Button>
                <Button
                  onClick={isApproved ? handleStopAccess : handleGiveAccess}
                  style={{
                    backgroundColor: isApproved === 1 ? '#FF0C0C' : '#28A745',
                     borderRadius: '20px', paddingRight: "10px", paddingLeft: "15px", height: '30px', paddingTop: '5px', fontSize: '12px' ,border:'none'
                  }}
                  className="mb-2"
                >
                  <Image src={isApproved === 1 ? stopAccessIcon : giveAccessIcon} alt={isApproved === 1 ? 'Stop Access' : 'Give Access'} width={20} height={20} className="me-2 mb-1" />
                  {isApproved === 1 ? 'Stop Access' : 'Give Access'}
                </Button>
              </Col>
            </Row>
            <hr style={{ marginTop: "-10px" }} />
            <Row className='mt-4'>
              <Col xs={12} md={3} className="mb-4 text-center">
                <div className="image-container orgprofile">
                  <Image
                    style={{ borderRadius: '20px', width: "220px" }}
                    className="org-image"
                    src={profile || orgo}
                    fluid
                    alt="Organization Profile"
                  />
                </div>
              </Col>
              <Col xs={12} md={9}>
                  <Row>
                  {[
                    { title: 'Pending Days', text: '27/30' },
                    { title: 'Total Revenue', text: '300K' },
                    { title: 'Medicine Inventory', text: Medicine_inventory, onClick: handleInventoryClick},
                    { title: 'Consultations', text: consultations, onClick: handleConsultationClick },
                    { title: 'Count of Students', text: total_student, onClick: handleStudentClick },
                    { title: 'Count of Staffs', text: total_staff, onClick: handleStaffClick }
                  ].map((info, index) => (
                    <Col xs={12} sm={6} md={4} className="mb-3" key={index}>
                      <Card style={{  border: "none", cursor:'pointer',width: "90%", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }} className="info-card shadow ms-2" onClick={info.onClick}>
                        <Card.Body>
                          <Card.Title style={{ fontSize: '14px' }}>{info.title}</Card.Title>
                          <Card.Text style={{ fontSize: "23px", fontWeight: 'bolder' }}>{info.text}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
            <div style={{marginLeft:'2.5%'}} className=" width">
              <Row style={{ color: '#B5B5C3', fontWeight: '500', fontSize: '14px' }}>
                <Col sm={6} md={2} className="text-nowrap">Organization Name</Col>
                <Col sm={6} md={2}>Organization ID</Col>
                <Col sm={6} md={2}>Regional Manager</Col>
                <Col sm={6} md={2}>Date Added</Col>
              </Row>
              <Row style={{ color: '#464E5F', fontWeight: '600', fontSize: '14px' }}>
                <Col sm={6} md={2} className="text-nowrap">{organization_name}</Col>
                <Col sm={6} md={2}>{id}</Col>
                <Col sm={6} md={2}>{r_m_name}</Col>
                <Col sm={6} md={2}>{Date}</Col>
              </Row>
              <Row style={{ color: '#B5B5C3', fontWeight: '500', fontSize: '14px' }} className='mt-3'>
                <Col sm={6} md={2} className="text-nowrap">Upload Documents</Col>
                <Col sm={6} md={2}>GST Number</Col>
                <Col sm={6} md={2}>Mobile Number</Col>
                <Col sm={6} md={2} className="text-nowrap">Organization Registration Number</Col>
              </Row>
              <Row style={{ color: '#464E5F', fontWeight: '600', fontSize: '14px' }}>
                <Col style={{ fontWeight: '500',marginTop:'-4px' }} sm={6} md={2}>
                  <Button style={{textDecoration:'none',backgroundColor:'white',border:'none',marginRight:'-5%'}}
                    className=" text-primary "
                    onClick={handleViewDocument}
                  >
                    View
                  </Button>
                </Col>
                <Col sm={6} md={2}>{gst_number}</Col>
                <Col sm={6} md={2}>{organization_mobile_no}</Col>
                <Col sm={6} md={2}>{organisation_register_no}</Col>
              </Row>
              <Row style={{ color: '#B5B5C3', fontWeight: '500', fontSize: '14px' }} className='mt-3'>
                <Col md={12}>Address</Col>
              </Row>
              <Row style={{ color: '#464E5F', fontWeight: '600', fontSize: '14px' }}>
                <Col md={12}>{address}</Col>
              </Row>
              <Row style={{ color: '#333333', fontWeight: '700', fontSize: '14px' }} className="mt-3">
                <Col md={12}>Contact Person</Col>
              </Row>
              <Row style={{ color: '#B5B5C3', fontWeight: '500', fontSize: '14px' }} className="mt-3 gx-3">
                <Col sm={6} md={2}>Name</Col>
                <Col sm={6} md={2}>Designation</Col>
                <Col sm={6} md={2}>Mobile Number</Col>
                <Col sm={6} md={2}>Email ID</Col>
              </Row>
              <Row style={{ color: '#464E5F', fontWeight: '600', fontSize: '14px' }}>
                <Col sm={6} md={2}>{contact_name}</Col>
                <Col sm={6} md={2}>{designation}</Col>
                <Col sm={6} md={2}>{contact_mobile_no}</Col>
                <Col sm={6} md={2} className="text-nowrap">{contact_email_id}</Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Modal for Document */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {documentUrl ? (
            <img
              src={documentUrl} // Assuming the document is an image URL
              alt="Uploaded Document"
              style={{ width: '100%', height: 'auto' }}
            />
          ) : (
            <p>No document available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrganizationDetails;