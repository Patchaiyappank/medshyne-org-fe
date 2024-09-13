import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import avatar from '../assest/Avatar.png';
import editIcon from '../assest/Editsss.png';
import accessIcon from '../assest/tick-circle.png';
import stopAccessIcon from '../assest/access_stop.png';
import './Onedoctor.css';
import Barchart from './Barchart';
import '@fontsource/inter';
import { useLocation, useNavigate } from 'react-router-dom';

const DoctorDetails = () => {
  const [doctor, setDoctor] = useState(null);
  const [giveAccess, setGiveAccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const doctorId = location.state?.id;

  useEffect(() => {
    if (doctorId) {
      fetchDoctorDetails(doctorId);
    }
  }, [doctorId]);

  const fetchDoctorDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/admin_doctor_viewbyid?doctor_id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctor details');
      }
      const data = await response.json();
      if (data.Result === 'Success') {
        setDoctor(data.result[0]);
        setGiveAccess(data.result[0].give_access_bts === 1);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  const updateAccessStatus = async (newStatus) => {
    const requestBody = {
      doctor_id: doctorId,
      give_access_bts: newStatus,
    };

    try {
      const response = await fetch('http://localhost:5000/admin_doctor_give_access_bts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }

      const data = await response.json();
      if (data.Result === 'Success') {
        setGiveAccess(newStatus === 1);
      } else {
        console.error('Error updating access status:', data.message);
      }
    } catch (error) {
      console.error('Error updating access status:', error);
    }
  };

  const handleAccessButtonClick = () => {
    const newStatus = giveAccess ? 0 : 1;
    updateAccessStatus(newStatus);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64File = reader.result;

      const requestBody = {
        doctor_id: doctorId,
        profile: base64File,
      };

      try {
        const response = await fetch('http://localhost:5000/admin_doctor_profile_pic', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }

        const data = await response.json();
        if (data.Result === 'Success') {
          fetchDoctorDetails(doctorId);
          setSelectedFile(null);
        } else {
          console.error('Error updating profile picture:', data.message);
        }
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    };

    reader.readAsDataURL(selectedFile);
  }, [selectedFile, doctorId]);

  const handleEditClick = () => {
    if (doctorId) {
      alert(`Editing details for doctor with ID: ${doctorId}`);
      navigate('/Doctordetails', {
        state: { id: doctorId },
      });
    }
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <Container style={{marginLeft:'15.5%'}}  className="mt-2">
      <header className="my-2">
        <h3 style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }} >Doctors</h3>
        <hr style={{color:' rgba(0, 0, 0, 0.2)'}}></hr>
      </header>

      <Card className="p-2 shadow-sm" style={{ width: '98%', height: 'auto' ,border:'none'}}>
        <Row className="align-items-center mt-3">
          <Col md={6} className="text-start">
            <h4 style={{ color: '#212121', fontSize: '20px' }} className="ms-5">Doctor Details</h4>
          </Col>
          <Col md={6} className="text-end">
            <Button
              onClick={handleEditClick}
              style={{
                backgroundColor: '#0089FF',
                marginRight: '8px',
                borderRadius: '20px',
                borderColor: '#0089FF',
                fontSize: '12px'
              }}

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
              onClick={handleAccessButtonClick}
              style={{
                backgroundColor: giveAccess ? '#FF0000' : '#00AB4F',
                marginRight: '8px',
                borderRadius: '20px',
                borderColor: giveAccess ? '#FF0000' : '#00AB4F',
                fontSize: '12px'
              }}
              className="me-4"
             
            >
              <Image
                src={giveAccess ? stopAccessIcon : accessIcon}
                alt="Access"
                style={{ width: '20px', marginRight: '8px' }}
              />
              {giveAccess ? 'Stop Access to App' : 'Give Access to App'}
            </Button>
          </Col>
        </Row>
        <hr style={{color:' rgba(0, 0, 0, 0.2)'}}></hr>
        <Card.Body>
          <Row>
            <Col md={4} className="d-flex flex-column align-items-center">
              <div className=" detailsone image-container">
                <Image
                  src={doctor.profile || avatar}
                  alt="Doctor"
                  className="img-fluid"
                  style={{ maxWidth: '100%', height: '210px' }}
                              />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <Button
                 className="upload-button"
                  onClick={handleUploadClick}
                  style={{ marginBottom: '10px' ,fontSize:'13px'}}
                >
                  Upload
                </Button>
              </div>
            </Col>
            <Col md={8}>
              <Row className="text-muted ">
                <Col sm={4}>Name</Col>
                <Col sm={4}>License Number</Col>
                <Col sm={4}>Mobile Number</Col>
              </Row>
              <Row style={{color:'#464E5F',fontWeight:'400'}}  className=" mb-2">
                <Col sm={4}><strong>{doctor.doctor_name}</strong></Col>
                <Col sm={4}><strong>{doctor.license_number}</strong></Col>
                <Col sm={4}><strong>{doctor.mobile_no}</strong></Col>
              </Row>
              <Row className="text-muted ">
                <Col sm={4}>Gender</Col>
                <Col sm={4}>Doctor Qualification</Col>
                <Col sm={4}>Work Experience</Col>
              </Row>
              <Row style={{color:'#464E5F',fontWeight:'400'}} className=" mb-2">
                <Col sm={4}><strong>{doctor.gender}</strong></Col>
                <Col sm={4}><strong>{doctor.doctor_qualification}</strong></Col>
                <Col sm={4}><strong>{doctor.work_experience}</strong></Col>
              </Row>
              <Row className="text-muted ">
                <Col sm={4}>Date of Birth</Col>
                <Col sm={4}>Doctor Specialization</Col>
                <Col sm={4}>E-Mail ID</Col>
              </Row>
              <Row style={{color:'#464E5F',fontWeight:'400'}} className=" mb-2">
                <Col sm={4}><strong>{doctor.dob}</strong></Col>
                <Col sm={4}><strong>{doctor.dr_specialization}</strong></Col>
                <Col sm={4}><strong>{doctor.email}</strong></Col>
              </Row>
              <Row className="text-muted ">
                <Col sm={12}>Address</Col>
              </Row>
              <Row style={{color:'#464E5F',fontWeight:'400'}} className=" mb-2">
                <Col sm={12}><strong>{doctor.address}</strong></Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={4} sm={12}>
              <Card className="text-center shadow-sm mb-3 ms-4" style={{ width: '75%', borderRadius: '20px', height: '100px',border:'none' }}>

                <Card.Body>
                  <Card.Title className="text-start" style={{ fontSize: '16px',fontWeight:'550' }}>Consultation Attended</Card.Title>
                  <Card.Text>
                    <h2 style={{ fontWeight:'650' }} className="text-start">{doctor.consulting_attended}</h2>
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card className="text-center shadow-sm ms-4" style={{ width: '75%', borderRadius: '20px', height: '100px',border:'none' }}>

                <Card.Body>
                  <Card.Title className="text-start" style={{ fontSize: '16px' ,fontWeight:'550'}}>Consultation Canceled</Card.Title>
                  <Card.Text >
                    <h2 style={{ fontWeight:'650' }} className="text-start">{doctor.consulting_canceled}</h2>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={8} sm={12}>
              <Card className="shadow-sm" style={{ height: '220px', backgroundColor: '#F9F9F9',border:'none' }}>
              <Card.Body>
                  <Barchart doctorId={doctorId} /> {/* Pass doctorId to BarChart */}
                </Card.Body>

              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DoctorDetails;