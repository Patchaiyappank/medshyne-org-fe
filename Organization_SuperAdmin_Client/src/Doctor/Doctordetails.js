import React, { useState, useRef ,useEffect} from 'react';
import { Container, Card, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import one from '../assest/1.png';
import two from '../assest/2.png';
import three from '../assest/3.png';
import identityIcon from '../assest/identity.png';
import calendar from '../assest/calender.png';
import uploadIcon from '../assest/upload.png';
import saveimage from '../assest/doctorsuccess.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@fontsource/inter';
import './customStyle.css';

import { useLocation, useNavigate } from 'react-router-dom';


const CardComponent = () => {
  const [content, setContent] = useState('personal');
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    doctor_name: '',
    dob: null, 
    email: '',
    mobile_no: '',
    gender: '',
    address: '',
    state: '',
    pincode: '',
    license_number: '',
    dr_bachelor: '',
    dr_master: '',
    dr_specialization: '',
    work_experience: '',
    document_upload: null,
    image_upload: null,
   
  });
 

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const identityInputRef = useRef(null);
  const uploadInputRef = useRef(null);
  const location = useLocation();
  const dateInputRef = useRef(null);
  const navigate = useNavigate();
  const doctorId = location.state?.id;
     

  useEffect(() => {
    if (doctorId) {
      fetchDoctorDetails(doctorId);
    }
  }, [doctorId]);


  

  const fetchDoctorDetails = async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:5000/admin_doctor_viewbyid?doctor_id=${doctorId}`);
      const contentType = response.headers.get("content-type");
  
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const result = await response.json();
  
        if (response.ok) {
          const doctorData = result.result[0];
          
          // Decode base64 strings if they are provided
          const documentBase64 = doctorData.document_upload ? `data:${doctorData.document_upload_type};base64,${doctorData.document_upload}` : null;
          const imageBase64 = doctorData.image_upload ? `data:${doctorData.image_upload_type};base64,${doctorData.image_upload}` : null;
  
          // Split qualifications
          const qualifications = doctorData.doctor_qualification ? doctorData.doctor_qualification.split(',') : [];
          const bachelorQualification = qualifications.length > 0 ? qualifications[0] : '';
          const masterQualification = qualifications.length > 1 ? qualifications[1] : '';
  
          setFormData({
            doctor_name: doctorData.doctor_name,
            dob: doctorData.dob ? new Date(doctorData.dob).toISOString().split('T')[0] : '',
            email: doctorData.email,
            mobile_no: doctorData.mobile_no,
            gender: doctorData.gender,
            address: doctorData.address,
            state: doctorData.state || '',
            pincode: doctorData.pincode || '',
            license_number: doctorData.license_number,
            dr_bachelor: bachelorQualification,
            dr_master: masterQualification,
            dr_specialization: doctorData.dr_specialization,
            work_experience: doctorData.work_experience,
            document_upload: documentBase64,
            image_upload: imageBase64,
            
          });
        } else {
          console.error('Failed to fetch doctor details:', result.message);
        }
      } else {
        const text = await response.text();
        console.error('Response is not JSON:', text);
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };
  console.log(formData.gender); // Check the value in the console




  


  const handleButtonClick = (type) => {
    setContent(type);
  };
  const handleSaveClick = async () => {
    const {
      doctor_name, dob, email, mobile_no, gender, address,
      state, pincode, license_number, dr_bachelor, dr_master, dr_specialization,
      work_experience, document_upload, image_upload,
    } = formData;
  
    // Convert files to base64 if they are instances of File
    const documentBase64 = document_upload instanceof File ? await toBase64(document_upload) : document_upload;
    const imageBase64 = image_upload instanceof File ? await toBase64(image_upload) : image_upload;
  
    let formattedDob = '';
  if (dob instanceof Date) {
    formattedDob = dob.toISOString().split('T')[0]; // YYYY-MM-DD
  } else if (typeof dob === 'string') {
    formattedDob = dob; 
  }
  
    const data = {
    
      doctor_id: doctorId,
      doctor_name,
      dob: formattedDob,
      email,
      mobile_no,
      gender,
      address,
      state,
      pincode,
      license_number,
      dr_bachelor,
      dr_master,
      dr_specialization,
      work_experience,
      document_upload: documentBase64,
      image_upload: imageBase64,
    };
    console.log('Data to be sent:', data); 
  
    const endpoint = doctorId ? 'admin_update_doctor_profile' : 'admin_doctor_createaccount';
    const method = doctorId ? 'PUT' : 'POST';
  
    try {
      console.log('Sending data:', data); // Log the data being sent
      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      console.log('Response Status:', response.status); // Log response status
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }
  
      const result = await response.json();
      console.log('Success:', result);
      setShowPopup(true);
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to save data: ${error.message}`);
    }
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dob: date });
    setDatePickerOpen(false);
  };
  
  
    
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log('Base64 Result:', reader.result); // Log the result
        resolve(reader.result);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  
  
   
  const handleClosePopup = () => {
    setShowPopup(false);
    if (doctorId) {
      navigate('/doctor_list'); // navigate to the list of doctors
    }
  };

  const handleIconClickCalender = () => {
    setDatePickerOpen(true);
  };



  const handleIconClick = (type) => {
    if (type === 'identity') {
      identityInputRef.current.click();
    } else if (type === 'upload') {
      uploadInputRef.current.click();
    }
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    console.log('Selected file:', file?.name); // Add a check for file to avoid errors
    if (file) {
      setFormData({ ...formData, [type]: file });
    }
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  const renderContent = () => {
    switch (content) {
      case 'personal':
        return (
          <div>
            <h5 className="mb-2" style={{ whiteSpace: 'nowrap', marginLeft: '63px', fontSize: '18px',paddingBottom:'7px' }}>Personal Details</h5>
            <Row style={{ marginLeft: '60px' }} className="mb-3">
              <Col >
                <Form.Group controlId="formFirstName" className="custom-form-group">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32', }}>Doctor Name*</Form.Label>
                  <Form.Control name="doctor_name" value={formData.doctor_name} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px',padding:'7px' }} type="text" placeholder="Enter doctor name" />
                </Form.Group>
                <Form.Group controlId="formEmail" className="custom-form-group">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Email address</Form.Label>
                  <Form.Control name="email" value={formData.email} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px',padding:'7px' }} type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group controlId="formAddress" className="custom-form-group">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Address</Form.Label>
                  <Form.Control name="address" value={formData.address} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px',padding:'7px' }} type="text" placeholder="Enter address" />
                </Form.Group>
                <Form.Group controlId="formPincode" className="custom-form-group">
                  <Form.Label style={{fontSize: '13px', color: '#181C32' }}>Pincode</Form.Label>
                  <Form.Control name="pincode" value={formData.pincode} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px',padding:'7px' }} type="text" placeholder="Enter pincode" />
                </Form.Group>
              </Col>
              <Col >
              <Form.Group controlId="formGender" className="custom-form-group1">
  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Gender</Form.Label>
  <Form.Control
  as="select"
  name="gender"
  value={formData.gender}
  onChange={handleInputChange}
  style={{ maxWidth: '414px', fontSize: '13px', padding: '7px' }}
>
 
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Others">Others</option>
</Form.Control>

</Form.Group>

                <Form.Group controlId="formMobileNumber" className="custom-form-group1">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Mobile Number</Form.Label>
                  <Form.Control name="mobile_no" value={formData.mobile_no} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px',padding:'7px' }} type="text" placeholder="Enter mobile number" />
                </Form.Group>
                <Form.Group controlId="formDateOfBirth" className="custom-form-group1">
      <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Date of Birth</Form.Label>
      <div className="custom-date-input" style={{ position: 'relative' }}>
      <DatePicker
  selected={formData.dob}
  onChange={handleDateChange}
  dateFormat="yyyy-MM-dd"
  className="form-control widthsss"
  placeholderText="Select a date"
  open={datePickerOpen}
  onClickOutside={() => setDatePickerOpen(false)}
/>

        <img
          src={calendar}
          alt="calendar icon"
          onClick={handleIconClickCalender}
          style={{ position: 'absolute', right: '17%', top: '46%', transform: 'translateY(-50%)', width: '16px', height: '16px', cursor: 'pointer' }}
        />
      </div>
    </Form.Group>


                <Form.Group controlId="formState" className="custom-form-group1">
                  <Form.Label style={{fontSize: '14px', color: '#181C32' }}>State</Form.Label>
                  <Form.Control name="state" value={formData.state} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px' ,padding:'7px' }} type="text" placeholder="Enter state" />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-end mt-4 me-4">
              <Button style={{ paddingLeft: '20px', paddingRight: "20px", borderRadius: '20px' }} variant="primary" onClick={() => handleButtonClick('professional')}>
                Next Step
              </Button>
             
            </div>
            <br></br>
          </div>
        );
      case 'professional':
        return (
          <div>
            <h5 className="mb-4" style={{ marginLeft: '56px', fontSize: '18px', marginTop: '20px' }}>Professional Details</h5>
            <Row style={{ marginLeft: '60px' }} className="mb-3">
              <Col md={6}>
              <Form.Group controlId="formQualification" className="custom-form-group">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Doctor Qualification Bachelor’s*</Form.Label>
                  <Form.Control name="dr_bachelor" value={formData.dr_bachelor} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px',padding:'7px' }} type="text" placeholder="Enter qualification" />
                </Form.Group>
                <Form.Group controlId="formSpecialization" className="custom-form-group">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Doctor Specialization</Form.Label>
                  <Form.Control name="dr_specialization" value={formData.dr_specialization} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px',padding:'7px' }} type="text" placeholder="Enter specialization" />
                </Form.Group>
                <Form.Group controlId="formLicenseNumber" className="custom-form-group">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>License Number*</Form.Label>
                <Form.Control name="license_number" value={formData.license_number} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px',padding:'7px' }} type="text" placeholder="Enter license number" />
                </Form.Group>

                <Button style={{ paddingLeft: '25px', paddingRight: "25px", borderRadius: '20px' }} className="mt-5" variant="primary" onClick={() => handleButtonClick('personal')}>
                  Back
                </Button>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formMasterQualification" className="custom-form-group1">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Doctor Qualification Master’s*</Form.Label>
                  <Form.Control name="dr_master" value={formData.dr_master} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px',padding:'7px'}} type="text" placeholder="Enter qualification" />
                </Form.Group>
                <Form.Group controlId="formWorkExperiences"  className="custom-form-group1">
                  <Form.Label style={{fontSize: '13px', color: '#181C32' }}>Work Experiences</Form.Label>
                  <Form.Control name="work_experience" value={formData.work_experience} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px', padding:'7px' }} type="text" placeholder="Enter work experiences" />
                </Form.Group>
                <Form.Group controlId="formConfirmLicense"  className="custom-form-group1">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Confirm License Number*</Form.Label>
                  <Form.Control name="license_number" value={formData.license_number} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px',padding:'7px'}} type="text" placeholder="Confirm license number" />
                  </Form.Group>
                <div className="text-end mt-5 me-4">
                  <Button style={{ paddingLeft: '20px', paddingRight: "20px", borderRadius: '20px' }} variant="primary" onClick={() => handleButtonClick('services')}>
                    Next Step
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        );
        
        case 'services':
  return (
    <div className="text-start">
      <h5 className="mb-4" style={{ marginLeft: '80px', fontSize: '18px', marginTop: '20px' }}>Doctor Verification</h5>
      <Card style={{ width: '85%', margin: 'auto', backgroundColor: '#f0f0f0', border: '1px solid #f0f0f0', marginTop: '25px', borderRadius: '10px' }}>
        <Card.Body>
          <Row className="justify-content-center">
            <Col md={5} className="d-flex justify-content-center mb-3 mt-3 me-3">
              <Card style={{ width: '100%', height: 'auto', borderStyle: 'dashed', borderWidth: '2px', borderColor: '#0EBE7F', backgroundColor: '#C9FFDC', borderRadius: '10px' }}
                onClick={() => handleIconClick('identity')}>
                <Card.Body className="text-center">
                  <Card.Title style={{ fontSize: '14px', color: '#45A343' }}>Identity Verify</Card.Title>
                  <Card.Text style={{ color: '#242634', fontSize: '14px' }}>
                    Certificate or any other document which proves your identity
                  </Card.Text>
                  <img src={identityIcon} alt="Identity Icon" className="img-fluid" style={{ width: '50px', height: '50px' }} />
                  <input ref={identityInputRef} type="file" onChange={(e) => handleFileChange(e, 'document_upload')} style={{ display: 'none' }} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={5} className="d-flex justify-content-center mb-3 mt-3 ms-5">
              <Card style={{ width: '100%', height: 'auto', borderStyle: 'dashed', borderWidth: '2px', borderColor: '#2158FF', backgroundColor: '#DEE3FF', borderRadius: '10px' }}
                onClick={() => handleIconClick('upload')}>
                <Card.Body className="text-center">
                  <Card.Title style={{ fontSize: '14px', color: '#2158FF' }}>Upload Photo</Card.Title>
                  <Card.Text style={{ color: '#242634', fontSize: '14px' }}>
                    Certificate or any other document which proves your profession
                  </Card.Text>
                  {/* Show file name if available */}
                 
                  <img src={uploadIcon} alt="Upload Icon" className="img-fluid" style={{ width: '50px', height: '50px' }} />
                  <input ref={uploadInputRef} type="file" onChange={(e) => handleFileChange(e, 'image_upload')} style={{ display: 'none' }} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Row className="mt-4">
        <Col>
          <Button className='ms-5' style={{ paddingLeft: '20px', paddingRight: '20px', borderRadius: '20px' }} variant="primary" onClick={() => handleButtonClick('professional')}>
            Back
          </Button>
        </Col>
        <Col className="text-end">
          <Button className='me-5' style={{ paddingLeft: '20px', paddingRight: '20px', borderRadius: '20px' }} variant="primary" onClick={handleSaveClick}>
            Save
          </Button>
        </Col>
      </Row>
      <br></br>
    </div>
  );

      default:
        return null;
    }
  };

  return (
    <Container style={{ marginLeft: '14.5%' }} className="mt-4">
      <header className="my-2">
        <h3 style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}>Doctors</h3>
        <hr style={{color:' rgba(0, 0, 0, 0.2)'}}></hr>
      </header>
      <Card className="p-3 mt-5 shadow-sm " style={{ borderBottom: '4px solid #dee2e6', borderRadius: '20px', width: '90%', height: '70%', maxWidth: '1100px', margin: 'auto' }}>

        <Row className="mb-4 ms-4 d-flex justify-content-start cards ">
          <Col xs="auto" className="d-flex align-items-center mt-2">
            <div
              onClick={() => handleButtonClick('personal')}
              className="d-flex align-items-center "
              style={{
                cursor: 'pointer',
                color: content === 'personal' ? '#007bff' : '#939393',
                borderBottom: content === 'personal' ? '3px solid #007bff' : '3px solid #ccc',
                paddingBottom: '5px',
                marginRight: '20px',
              }}
            >
              <img
                src={one}
                alt="Personal Details"
                width="10"
                height="18"
                style={{
                  marginRight: '7px',
                  filter: content === 'personal' ? 'invert(31%) sepia(97%) saturate(6483%) hue-rotate(202deg) brightness(93%) contrast(104%)' : 'grayscale(100%)',
                }}
              />
              <span style={{ marginRight: '50px' }}>Personal Details</span>
            </div>
          </Col>
          <Col xs="auto" className="d-flex align-items-center mt-2">
            <div
              onClick={() => handleButtonClick('professional')}
              className="d-flex align-items-center"
              style={{
                cursor: 'pointer',
                color: content === 'professional' ? '#007bff' : '#939393',
                borderBottom: content === 'professional' ? '3px solid #007bff' : '3px solid #ccc',
                paddingBottom: '5px',
                marginRight: '20px',
              }}
            >
              <img
                src={two}
                alt="Professional Details"
                width="12"
                height="18"
                style={{
                  marginRight: '7px',
                  filter: content === 'professional' ? 'invert(31%) sepia(97%) saturate(6483%) hue-rotate(202deg) brightness(93%) contrast(104%)' : 'grayscale(100%)',
                }}
              />
              <span style={{ marginRight: '50px' }}>Professional Details</span>
            </div>
          </Col>
          <Col xs="auto" className="d-flex align-items-center mt-2">
            <div
              onClick={() => handleButtonClick('services')}
              className="d-flex align-items-center"
              style={{
                cursor: 'pointer',
                color: content === 'services' ? '#007bff' : '#939393',
                borderBottom: content === 'services' ? '3px solid #007bff' : '3px solid #ccc',
                paddingBottom: '5px',
                marginRight: '20px',
              }}
            >
              <img
                src={three}
                alt="Services"
                width="12"
                height="20"
                style={{
                  marginRight: '7px',
                  filter: content === 'services' ? 'invert(31%) sepia(97%) saturate(6483%) hue-rotate(202deg) brightness(93%) contrast(104%)' : 'grayscale(100%)',
                }}
              />
              <span style={{ marginRight: '50px' }}>Doctor Verification</span>
            </div>
          </Col>
        </Row>
        {renderContent()}
      </Card>

      <Modal className='total' show={showPopup} onHide={handleClosePopup}>
    <Modal.Body >
        <div className="modal-contentt">
            <img 
                src={saveimage}
                alt="Success" 
                className="modal-imagees" 
            />
            <p style={{color: '#777777', fontSize: '25px', marginTop: '10px'}}>
                Data saved successfully!
            </p>
        </div>
    
            <Button 
                variant="primary"
                style={{
                    width: '60%',
                    marginLeft: '20%',
                    marginBottom: '7%',
                    marginTop: '20px', // Adjusted to move the button down
                    borderRadius: '20px',
                    cursor: 'pointer'
                }} 
                onClick={handleClosePopup}
            >
                OK
            </Button>
        
    </Modal.Body>
</Modal>

  
    </Container>
  );
};

export default CardComponent;