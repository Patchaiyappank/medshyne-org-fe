import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image, Modal } from 'react-bootstrap';
import avatar from '../assest/Avatar.png';
import editIcon from '../assest/Editsss.png';
import './Staffdetails.css';
import '@fontsource/inter';
import Table from './StaffdetailsTable'; 
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const StaffDetails = () => {
  const [staff, setStaff] = useState(null);
  const [consulting, setConsulting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [documentContent, setDocumentContent] = useState(null);
  const [documentType, setDocumentType] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const IdNumber = location.state?.id_number;

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/superAdmin_consulting_staffprofile_by_id', {
          params: { id_number: IdNumber }
        });
  
        console.log(response.data); // Add this line to debug the API response
  
        if (response.data.Result === 'Success') {
          const staffData = response.data.staffArray[0];
          setStaff({
            ...staffData,
            currentHealthReport: response.data.staffArray[0].current_health_report,
            pastHealthReport: response.data.staffArray[0].past_health_report,
          });
          setConsulting(response.data.consultingArray);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchStaffDetails();
  }, [IdNumber]);
  

  const handleDelete = async () => {
    try {
      const response = await axios.put('http://localhost:5000/superAdmin_staff_delete_btn', null, {
        params: { id_number: IdNumber }
      });
      
      if (response.data.Result === 'Success') {
        alert('Staff deleted successfully');
        setStaff(null); 
      } else {
        alert('Failed to delete staff');
      }
    } catch (err) {
      alert('Failed to delete staff');
    }
  };

  const handleEditClick = () => {
    navigate('/AddStaff', { state: { id_number: IdNumber, mode: 'edit' } });
  };

  const handleShowDocument = (type) => {
    if (type === 'current' && staff?.currentHealthReport) {
      setDocumentContent(staff.currentHealthReport);
      setDocumentType('current');
    } else if (type === 'past' && staff?.pastHealthReport) {
      setDocumentContent(staff.pastHealthReport);
      setDocumentType('past');
    } else {
      alert('Document not available');
      return;
    }
    setShowModal(true);
  };
  

  const handleCloseModal = () => setShowModal(false);

  return (
    <Container style={{ backgroundColor: '#F5F5F5', marginLeft: '16%', width: '94%' }} className="mt-2">
      <Card className="p-2 shadow-sm" style={{ width: '98%', height: 'auto', border: 'none' }}>
        <Row className="align-items-center mt-1">
          <Col md={6} className="text-start">
            <h4 style={{ color: '#212121', fontSize: '20px' }} className="ms-5">Staff details</h4>
          </Col>
          <Col md={6} className="text-end">
            <Button
              onClick={handleEditClick}
              style={{ borderRadius: '20px', paddingRight: "10px", paddingLeft: "15px", height: '37px', paddingTop: '6px', fontSize: '12px' }}
              className="me-4"
            >
              <Image
                src={editIcon}
                alt="Edit"
                style={{ width: '12px', marginRight: '8px', marginBottom: '3px' }}
              />
              Edit Details
            </Button>
            <Button 
              onClick={handleDelete}
              style={{ backgroundColor: "#E51837", borderColor: '#E51837', borderRadius: '20px', paddingRight: "40px", paddingLeft: "40px", height: '35px', paddingTop: '6px', fontSize: '12px' }}
              className="me-2"
            >
              Delete
            </Button>
          </Col>
        </Row>
        <hr className='mt-2' style={{ color: 'rgba(0, 0, 0, 0.2)' }} />
        <Card.Body>
          <Row className='mb-2'>
            <Col md={4} className="d-flex flex-column">
              <div className="image-container staffdetailsimagee">
                <Image
                  src={staff?.profile || avatar} 
                  alt="Doctor"
                  className="img-fluid me-2"
                  style={{ maxWidth: '120%', width: '78%', height: '210px' }}
                />
                <Button className="upload-buttonstaffdetails">
                  Upload
                </Button>
              </div>
            </Col>
            <Col md={8}>
              {staff ? (
                <>
                  <Row style={{ color: '#B5B5C3', fontSize: '14px' }} className="text-d">
                    <Col sm={4}>Name</Col>
                    <Col sm={4}>ID Number</Col>
                    <Col sm={4}>Mobile Number</Col>
                  </Row>
                  <Row style={{ color: '#464E5F', fontWeight: '400', fontSize: '14px' }} className="mb-3">
                    <Col sm={4}><strong>{staff.name}</strong></Col>
                    <Col sm={4}><strong>{staff.id_number}</strong></Col>
                    <Col sm={4}><strong>{staff.mobile_number}</strong></Col>
                  </Row>
                  <Row style={{ color: '#B5B5C3', fontSize: '14px' }} className="text-mutedd">
                    <Col sm={4}>Gender</Col>
                    <Col sm={4}>Designation</Col>
                    <Col sm={4}>Department</Col>
                  </Row>
                  <Row style={{ color: '#464E5F', fontWeight: '400', fontSize: '14px' }} className="mb-3">
                    <Col sm={4}><strong>{staff.gender}</strong></Col>
                    <Col sm={4}><strong>{staff.desigantion}</strong></Col>
                    <Col sm={4}><strong>{staff.department}</strong></Col>
                  </Row>
                  <Row style={{ color: '#B5B5C3', fontSize: '14px' }} className="text-mutedd">
                    <Col sm={4}>Age</Col>
                    <Col sm={4}>Blood Group</Col>
                    <Col sm={4}>HCR</Col>
                  </Row>
                  <Row style={{ color: '#464E5F', fontWeight: '400', fontSize: '14px' }} className="mb-3">
                    <Col sm={4}><strong>{staff.age}</strong></Col>
                    <Col sm={4}><strong>{staff.blood_group}</strong></Col>
                    <Col sm={4}><strong>{staff.hcr}</strong></Col>
                  </Row>
                  <Row style={{ color: '#B5B5C3', fontSize: '14px' }} className="text-mutedd">
                    <Col sm={12}>Address</Col>
                  </Row>
                  <Row style={{ color: '#464E5F', fontWeight: '400', fontSize: '14px' }} className="mb-3">
                    <Col sm={12}><strong>{staff.address}</strong></Col>
                  </Row>
                </>
              ) : (
                <p>No staff data available</p>
              )}
            </Col>
          </Row>

          <Row style={{ border: "1px solid #F9F9F9", backgroundColor: "#F9F9F9", borderRadius: '10px' }} className="mt-3 me-3 ms-3">
            <Col className="mt-3" md={3}>
              <h6 style={{ color: '#B5B5C3', fontSize: '14px' }}>Allergies</h6>
              <p style={{ color: '#464E5F', fontWeight: '600', fontSize: '14px' }}>
                {staff?.allergies_define || 'No data'}
              </p>
            </Col>
            <Col className="mt-3" md={3}>
              <h6 style={{ color: '#B5B5C3', fontSize: '14px' }}>Disease</h6>
              <p style={{ color: '#464E5F', fontWeight: '600', fontSize: '14px' }}>
                {staff?.any_disease_define || 'No data'}
              </p>
            </Col>
            <Col style={{ paddingBottom: '20px' }} md={3}>
              <h6 className="mt-3" style={{ color: '#B5B5C3', fontSize: '14px' }}>Current Health Report</h6>
              <Button
                style={{ borderRadius: '20px', paddingRight: "24px", paddingLeft: "22px" }}
                className="btn btn-primary mt-2"
                onClick={() => handleShowDocument('current')}
              >
                View Document
              </Button>
            </Col>
            <Col md={3}>
              <h6 className="mt-3" style={{ color: '#B5B5C3', fontSize: '14px' }}>Past Health Report</h6>
              <Button
                style={{ borderRadius: '20px', paddingRight: "24px", paddingLeft: "22px" }}
                className="btn btn-primary mt-2"
                onClick={() => handleShowDocument('past')}
              >
                View Document
              </Button>
            </Col>
          </Row>

          <Table consultingData={consulting} />
        </Card.Body>
      </Card>

      {/* Modal for Document */}

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{documentType === 'current' ? 'Current Health Report' : 'Past Health Report'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {documentContent ? (
                <img
                  src={documentContent} // Assuming the content is a URL
                  alt="Health Report"
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : (
                <p>Loading document...</p>
              )}
            </Modal.Body>
          </Modal>
      
      <br />
    </Container>
  );
};

export default StaffDetails;