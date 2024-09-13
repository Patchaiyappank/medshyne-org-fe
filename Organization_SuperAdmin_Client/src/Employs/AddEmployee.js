import React, { useState, useRef, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Modal, Dropdown } from 'react-bootstrap';
import one from '../assest/1.png';
import two from '../assest/2.png';
import three from '../assest/3.png';
import identityIcon from '../assest/identity.png';
import calendar from '../assest/calender.png';
import uploadIcon from '../assest/upload.png';
import saveimage from '../assest/saveimage.png';
import view from '../assest/View.png';
import edit from '../assest/edit.png';
import deletes from '../assest/deleted.png'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@fontsource/inter';
import './AddEmployee.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';


const AddEmploye = () => {
  const inputRef = useRef(null);
  const [emailError, setEmailError] = useState("");
  const [errors, setErrors] = useState({});
  const [employee, setEmployee] = useState(null);
  const location = useLocation();
  const [mobileError, setMobileError] = useState("");
  const [currentErrorMessage, setCurrentErrorMessage] = useState('');
  const { state } = useLocation();
  // const mode = location.state?.mode || 'add'; // Default to 'add' if no mode is provided
  const { mode = 'add', id_number } = location.state || {};
  // const id_number = 10;
  // const { id_number, mode } = location.state || {};
  console.log(`Received ID: ${id_number}`);
  const pageMode = mode;

  const [formData, setFormData] = useState({
    emp_name: '',
    gender: '',
    password: '',
    phone_number: '',
    state: '',
    e_mail: '',
    address: '',
    blood_group: '',
    dob: '',
    pin_code: '',
    department: '',
    designation: '',
    qualification: '',
    confirmPassword: '',
    view_access: false,
    edit_access: false,
    delete_access: false,
    home_page_access: false,
    inventory_page_access: false,
    support_page_access: false,
    organization_page_access: false,
    regional_manager_page_access: false,
    doctor_page_access: false,
    settings_page_access: false,
  });

  const handleButtonClicks = (buttonName) => {
    setFormData(prevState => ({
      ...prevState,
      [buttonName]: !prevState[buttonName]
    }));
  };

  const isSaveEnabled = Object.values(formData).some(value => value === true);

  const [showPopup, setShowPopup] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [content, setContent] = useState('personal');
  const [passwordError, setPasswordError] = useState("");
  const validateEmail = (e_mail) => {
    // Basic email validation pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(e_mail) && e_mail.endsWith('.com');
  };
  const handleEmailInput = (e) => {
    let value = e.target.value;
    value = value.trim().toLowerCase();

    // Email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }

    e.target.value = value;
  };
  const handlePhoneChange = (e) => {
    const { value } = e.target;

    // Update the phone number in the state
    setFormData({ ...formData, phone_number: value });

    // Basic validation example: Check if it's a valid mobile number (e.g., 10 digits)
    if (!/^\d{10}$/.test(value)) {
      setMobileError('Please enter a valid 10-digit mobile number.');
    } else {
      setMobileError('');
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handlePininput = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value.length > 6) {
      value = value.slice(0, 6);
    }
    value = value.replace(/^\s+/, "");
    e.target.value = value;
  };
  const handlepasswordInput = (e) => {
    let value = e.target.value;

    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
    } else {
      setPasswordError("");
    }

    e.target.value = value;
  };
  const handleDateChange = (date) => {
    setFormData({ ...formData, dob: date });
  };

  const handleIconClickCalender = () => {
    setDatePickerOpen(!datePickerOpen);
  };

  const handleButtonClick = (newContent) => {
    setContent(newContent);
  };

  // const handleView = () => {
  //   setFormData({ ...formData, view_access: true });
  // };

  const handleClosePopup = () => setShowPopup(false);

  const handleInputChanges = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };



  useEffect(() => {
    if (mode === 'edit' && id_number) {
      fetchEmployeeDetails(id_number);
    }
  }, [mode, id_number]);

  const fetchEmployeeDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/superAdmin_view_employee_by_id?emp_id=${id}`);

      console.log('API Response:', response.data);
      //  if (response.data && response.data.length > 0) {
      const employeeData = response.data;

      if (employeeData && employeeData.emp_id) { // Check for emp_id or other key field
        setFormData({
          ...formData,
          emp_name: employeeData.emp_name || '',
          phone_number: employeeData.phone_number || '',
          qualification: employeeData.qualification || '',
          e_mail: employeeData.e_mail || '',
          blood_group: employeeData.blood_group || '',
          gender: employeeData.gender || '',
          address: employeeData.address || '',
          dob: employeeData.formatted_dob || '',
          state: employeeData.state || '',
          pin_code: employeeData.pin_code || '',
          password: employeeData.password || '',
          confirmPassword: employeeData.password || '',
          department: employeeData.department || '',
          designation: employeeData.designation || '',
          view_access: employeeData.view_access || false,
          edit_access: employeeData.edit_access || false,
          delete_access: employeeData.delete_access || false,
          home_page_access: employeeData.home_page_access || false,
          inventory_page_access: employeeData.inventory_page_access || false,
          support_page_access: employeeData.support_page_access || false,
          organization_page_access: employeeData.organization_page_access || false,
          regional_manager_page_access: employeeData.regional_manager_page_access || false,
          doctor_page_access: employeeData.doctor_page_access || false,
          settings_page_access: employeeData.settings_page_access || false,
        });

      } else {
        console.warn('No employee data found for the given ID.');
        setCurrentErrorMessage('No employee details found.');
      }
    } catch (error) {
      console.error('Error fetching Employee details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setCurrentErrorMessage('Failed to load employee details. Please try again later.');
    }
  };


  const handleSubmits = async () => {

    if (mode === 'add') {

      try {

        const response = await fetch(`http://localhost:5000/superAdmin_add_employee`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('Employee added successfully!');
        navigate('/EmploysManagenmenthead', {
            state: { mode: 'Employ' }
          });
        } else {
          alert('An error occurred while adding the employee.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing the request.');
      }
      if (formData.password !== formData.confirmPassword) {
        setErrors('Passwords match, form can be submitted');
      } else {
        setErrors('');

        console.log('Passwords match, form can be submitted');
      }
    } else if (mode === 'edit' && id_number) {
      try {

        const response = await axios.put(`http://localhost:5000/superAdmin_edit_employee_by_id?emp_id=${id_number}`, formData);

        if (response.status === 200) {
          alert('Successfully updated');
          navigate('/EmploysManagenmenthead', {
            state: { mode: 'Employ' }
          });
        } else {
          alert('Failed to update employee.');
        }
      } catch (error) {
        console.error('There was an error updating the employee!', error);
        alert('Failed to update employee.');
      }

    }
  };






  const navigate = useNavigate();


  const clickBackEmployee = () => {
    navigate('/EmploysManagenmenthead');
  };

  const handleChangeOn = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setErrors('Passwords do not match!');
      } else {
        setErrors('');
      }
    }

  };

  //   const validates = () => {

  //     handleSubmits();
  // };


  const renderContent = () => {
    switch (content) {
      case 'personal':
        return (
          <div>
            <h5 className="mb-2" style={{ whiteSpace: 'nowrap', marginLeft: '63px', fontSize: '18px', paddingBottom: '7px' }}>Personal Details</h5>
            <Row style={{ marginLeft: '60px' }} className="mb-3">
              <Col >
                <Form.Group controlId="formFirstName" className="custom-form-group">
                  <Form.Label className={errors.emp_name ? "text-danger" : "text-dark"} style={{ fontSize: '13px', color: '#181C32' }}>Employe Name*</Form.Label>
                  <Form.Control name="emp_name" className='employee-input' spellCheck={false} value={formData.emp_name} onChange={handleInputChange} style={{ maxWidth: '370px', fontSize: '13px', color: '#697077', padding: '7px', border: '1px solid #ccc' }} type="text" placeholder="" tabIndex="-1" />
                </Form.Group>
                <Form.Group controlId="formEmail" className="custom-form-group">
                  <Form.Label className={errors.e_mail ? "text-danger" : "text-dark"} style={{ fontSize: '13px', color: '#181C32' }}>Email address*</Form.Label>
                  <Form.Control onInput={handleEmailInput} onChange={handleChangeOn} name="e_mail" className='employee-input' spellCheck={false} value={formData.e_mail} style={{ maxWidth: '370px', fontSize: '13px', color: '#697077', padding: '7px', border: '1px solid #ccc' }} type="email" placeholder="" />
                  {emailError && <p className="error text-danger">{emailError}</p>}
                </Form.Group>
                <Form.Group controlId="formAddress" className="custom-form-group">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Address*</Form.Label>
                  <Form.Control name="address" spellCheck={false} value={formData.address} onChange={handleInputChange} style={{ maxWidth: '370px', fontSize: '13px', color: '#697077', padding: '7px', border: '1px solid #ccc' }} type="text" placeholder="" />
                </Form.Group>
                <Form.Group controlId="formPincode" className="custom-form-group">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }} className={errors.pin_code ? "text-danger" : "text-dark"}>Pincode*</Form.Label>
                  <Form.Control name="pin_code" spellCheck={false} value={formData.pin_code} onChange={handleChangeOn} onInput={handlePininput} style={{ maxWidth: '370px', fontSize: '13px', color: '#697077', padding: '7px', border: '1px solid #ccc' }} type="text" placeholder="" />
                </Form.Group>
                <Button style={{ paddingLeft: '25px', paddingRight: "25px", borderRadius: '20px' }} className="mt-5" variant="primary" onClick={clickBackEmployee}>
                  Back
                </Button>
              </Col>
              <Col className='p-1'>
                {/* <Form.Group controlId="formGender" className="custom-form-group1">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32', }}>Gender</Form.Label>
                  <Form.Control name="gender" value={formData.gender} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px', color: '#C9C9C9',padding:'7px'}} type="text" placeholder="" />
                </Form.Group> */}
                <Form.Group controlId="formGender" className="custom-form-group1">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Gender*</Form.Label>
                  <Dropdown style={{ maxWidth: '377px', fontSize: '13px', color: '#C9C9C9', padding: '1px', marginLeft: '-28px' }}>
                    <Dropdown.Toggle
                      id="dropdown-gender"
                      style={{
                        maxWidth: '414px',
                        fontSize: '13px',
                        color: '#C9C9C9',
                        padding: '7px',
                        width: '383px',
                        height: '34px', // Ensure the dropdown takes the full width like a form control
                        textAlign: 'left', // Align the text to the left like a normal input
                        backgroundColor: '#fff', // Make sure the background color is white
                        border: '1px solid #ced4da', // Similar border as Form.Control
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><path d="M1 3.5l4 4 4-4" stroke="black" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "calc(100% - 10px) center", // Position the "v" symbol
                        backgroundSize: "12px", // Size of the "v" symbol
                        color: "#697077",
                        marginTop: '-4px',
                        marginBottom: '4px'
                      }}
                    >
                      {formData.gender}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleInputChange({ target: { name: 'gender', value: 'Male' } })}>
                        Male
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleInputChange({ target: { name: 'gender', value: 'Female' } })}>
                        Female
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleInputChange({ target: { name: 'gender', value: 'Other' } })}>
                        Other
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>

                <Form.Group controlId="formMobileNumber" className="custom-form-group1">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>blood_group</Form.Label>
                  <Form.Control name="blood_group" spellCheck={false} value={formData.blood_group} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px', color: '#697077', padding: '7px', border: '1px solid #ccc' }} type="text" placeholder="" />
                </Form.Group>
                <Form.Group controlId="formDateOfBirth" className="custom-form-group1">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Date of Birth*</Form.Label>
                  <div className="custom-date-input" style={{ position: 'relative' }}>
                    {/* <DatePicker
                      name="dob"

                      selected={formData.dob}
                      onInput={handleDateChange}
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
                  </div> */}
                <Form.Control name="dob" spellCheck={false} value={formData.dob} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px', color: '#697077', padding: '7px',border: '1px solid #ccc' }} type="text" placeholder="" />
                  </div>  
                </Form.Group>


                <Form.Group controlId="formState" className="custom-form-group1">
                  <Form.Label style={{ fontSize: '14px', color: '#181C32' }}>State*</Form.Label>
                  <Form.Control name="state" spellCheck={false} value={formData.state} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px', color: '#697077', padding: '7px', border: '1px solid #ccc' }} type="text" placeholder="" />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-end mt-4 me-4">
              <Button style={{ paddingLeft: '20px', marginTop: '-120px', paddingRight: "20px", borderRadius: '20px' }} variant="primary" onClick={() => handleButtonClick('professional')}>
                Next Step
              </Button>

            </div>
            <br></br>
          </div>
        );
      case 'professional':
        return (
          <div>
            <h5 className="mb-4" style={{ marginLeft: '56px', fontSize: '18px', marginTop: '20px' }}>Work Details</h5>
            <Row style={{ marginLeft: '60px' }} className="mb-3">
              <Col md={6}>

                <Form.Group controlId="formQualification" className="custom-form-group">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Department*</Form.Label>
                  <Dropdown style={{ maxWidth: '377px', fontSize: '13px', color: '#697077', padding: '1px', marginLeft: '-11px' }}>
                    <Dropdown.Toggle
                      id="dropdown-gender"
                      style={{
                        maxWidth: '414px',
                        fontSize: '13px',
                        color: '#C9C9C9',
                        padding: '7px',
                        width: '376px',
                        height: '34px', // Ensure the dropdown takes the full width like a form control
                        textAlign: 'left', // Align the text to the left like a normal input
                        backgroundColor: '#fff', // Make sure the background color is white
                        border: '1px solid #ced4da', // Similar border as Form.Control
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><path d="M1 3.5l4 4 4-4" stroke="black" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "calc(100% - 10px) center", // Position the "v" symbol
                        backgroundSize: "12px", // Size of the "v" symbol
                        color: "#697077"
                      }}
                    >
                      {formData.department}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleInputChange({ target: { name: 'department', value: 'maths' } })}>
                        Maths
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleInputChange({ target: { name: 'department', value: 'Science' } })}>
                        Science
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleInputChange({ target: { name: 'department', value: 'Other' } })}>
                        Other
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
                <Form.Group controlId="formSpecialization" className="custom-form-group">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Qualification</Form.Label>
                  <Form.Control name="qualification" spellCheck={false} value={formData.qualification} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px', color: '#697077', padding: '7px', border: '1px solid #ccc' }} type="text" placeholder="" />
                </Form.Group>
                <Form.Group controlId="formLicenseNumber" className="custom-form-group">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Mobile Number*</Form.Label>
                  <Form.Control name="phone_number" value={formData.phone_number} onChange={handlePhoneChange} style={{ maxWidth: '414px', fontSize: '13px', color: '#697077', padding: '7px', border: '1px solid #ccc' }} placeholder="" />
                  {mobileError && <p className="text-danger">{mobileError}</p>}
                </Form.Group>

                <Button style={{ paddingLeft: '25px', paddingRight: "25px", borderRadius: '20px' }} className="mt-5" variant="primary" onClick={() => handleButtonClick('personal')}>
                  Back
                </Button>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formQualification" className="custom-form-group">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32', marginLeft: '-27px' }}>Designation*</Form.Label>
                  <Dropdown style={{ maxWidth: '377px', fontSize: '13px', color: '#C9C9C9', padding: '1px', marginLeft: '-28px' }}>
                    <Dropdown.Toggle
                      id="dropdown-gender"
                      style={{
                        maxWidth: '414px',
                        fontSize: '13px',
                        color: '#C9C9C9',
                        padding: '7px',
                        width: '376px',
                        height: '34px',
                        textAlign: 'left',
                        backgroundColor: '#fff',
                        border: '1px solid #ced4da',
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><path d="M1 3.5l4 4 4-4" stroke="black" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "calc(100% - 10px) center", // Position the "v" symbol
                        backgroundSize: "12px", // Size of the "v" symbol
                        color: "#697077",
                      }}
                    >
                      {formData.designation}
                    </Dropdown.Toggle>
                    <Dropdown.Menu >
                      <Dropdown.Item onClick={() => handleInputChange({ target: { name: 'designation', value: 'staf' } })}>
                        Staff
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleInputChange({ target: { name: 'designation', value: 'Employee' } })}>
                        Employee
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleInputChange({ target: { name: 'designation', value: 'Other' } })}>
                        Other
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
                <Form.Group controlId="formWorkExperiences" className="custom-form-group1">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>New password*</Form.Label>
                  <Form.Control name="password" spellCheck={false} value={formData.password} onChange={handleChangeOn} onInput={handlepasswordInput} style={{ maxWidth: '414px', fontSize: '13px', color: '#697077', padding: '7px', border: '1px solid #ccc' }} type="text" placeholder="" />
                  {passwordError && <p className=" text-danger">{passwordError}</p>}
                </Form.Group>
                <Form.Group controlId="formConfirmLicense" className="custom-form-group1">
                  <Form.Label style={{ fontSize: '13px', color: '#181C32' }}>Confirm password*</Form.Label>
                  <Form.Control name="confirmPassword" spellCheck={false} value={formData.confirmPassword} onChange={handleInputChange} style={{ maxWidth: '414px', fontSize: '13px', color: '#697077', padding: '7px', border: '1px solid #ccc' }} type="text" placeholder="" />
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
            <h5 className="mb-4" style={{ marginLeft: '50px', fontSize: '18px', marginTop: '20px' }}>Give Access To Employe</h5>
            <Card style={{ width: '89%', height: '65%', paddingLeft: '23px', margin: 'auto', backgroundColor: '#f0f0f0', border: '1px solid #f0f0f0', marginTop: '15px', borderRadius: '10px' }}>
              <h5>Access level</h5>
              <div className='row p-3' >
                <div className='col-sm-3 custom-mobile-col mb-2'>
                  <button name='view_access' style={{ color: '#0089FF' }} onChange={handleInputChanges} className={`btn-header view_access-btn-header ${formData.view_access ? 'selected-view_access' : ''}`} onClick={() => handleButtonClicks('view_access')}>
                    <img src={view} width={30} height={30} style={{ marginRight: '55px', marginTop: '-7px' }} />
                    <p style={{ marginTop: '-25px', marginLeft: '50px' }}>View</p>
                  </button>
                </div>
                <div className='col-sm-3 custom-mobile-col'>
                  <button name='edit_access' onChange={handleInputChanges} className={`btn-header  edit_access-btn-header ${formData.edit_access ? 'selected-edit_access' : ''}`} onClick={() => handleButtonClicks('edit_access')} style={{ color: '#5D5FEF', border: '2px solid #5D5FEF' }}>
                    <img src={edit} width={30} height={30} style={{ marginRight: '25px', marginTop: '-7px' }} />
                    Edit
                  </button>
                </div>
                <div className='col-sm-3 custom-mobile-col'>
                  <button name='delete_access' onChange={handleInputChanges} className={`btn-header  delete_access-btn-header ${formData.delete_access ? 'selected-delete_access' : ''}`} onClick={() => handleButtonClicks('delete_access')} style={{ color: '#FF0000', border: '2px solid #FF0000' }} >
                    <img src={deletes} width={30} height={30} style={{ marginRight: '165px', marginTop: '-7px' }} />
                    <p style={{ marginLeft: '39px', marginTop: '-25px' }}>Delete</p></button>
                </div>
              </div>
              <h5> Options</h5>
              <div className='row'>
                <div className='col-sm-3 custom-mobile-col'>
                  <button name='home_page_access' onChange={handleInputChanges} className={`btn-footer  home_page_access-btn-footer ${formData.home_page_access ? 'selected-home_page_access' : ''}`} onClick={() => handleButtonClicks('home_page_access')} style={{ fontSize: '15px' }}>Home</button>
                </div>
                <div className='col-sm-3 custom-mobile-col'>
                  <button name='inventory_page_access' onChange={handleInputChanges} className={`btn-footer  inventory_page_access-btn-footer ${formData.inventory_page_access ? 'selected-inventory_page_access' : ''}`} onClick={() => handleButtonClicks('inventory_page_access')} style={{ width: '103%', marginLeft: '-15%', fontSize: '15px' }}>Inventory</button>
                </div>
                <div className='col-sm-3 custom-mobile-col'>
                  <button name='support_page_access' onChange={handleInputChanges} className={`btn-footer  support_page_access-btn-footer ${formData.support_page_access ? 'selected-support_page_access' : ''}`} onClick={() => handleButtonClicks('support_page_access')} style={{ width: '100%', marginLeft: '-14%', fontSize: '15px' }}>Support</button>
                </div>
                <div className='col-sm-3 custom-mobile-col'>
                  <button name='organization_page_access' onChange={handleInputChanges} className={`btn-footer  organization_page_access-btn-footer ${formData.organization_page_access ? 'selected-organization_page_access' : ''}`} onClick={() => handleButtonClicks('organization_page_access')} style={{ width: '115%', marginLeft: '-18%', fontSize: '15px' }}>Organization</button>
                </div>
              </div> <div className='row mt-4' style={{ marginBottom: '4%' }}>
                <div className='col-sm-3 custom-mobile-col'>
                  <button name='regional_manager_page_access' onChange={handleInputChanges} className={`btn-footer  regional_manager_page_access-btn-footer ${formData.regional_manager_page_access ? 'selected-regional_manager_page_access' : ''}`} onClick={() => handleButtonClicks('regional_manager_page_access')} style={{ width: '132%', fontSize: '15px' }}>Reginal&nbsp;manager</button>
                </div>
                <div className='col-sm-3 custom-mobile-col'>
                  <button name='doctor_page_access' onChange={handleInputChanges} className={`btn-footer  doctor_page_access-btn-footer ${formData.doctor_page_access ? 'selected-doctor_page_access' : ''}`} onClick={() => handleButtonClicks('doctor_page_access')} style={{ marginLeft: '30%', width: '94%', fontSize: '15px' }}>Doctors</button>
                </div>
                <div className='col-sm-3 custom-mobile-col'>
                  <button name='settings_page_access' onChange={handleInputChanges} className={`btn-footer  settings_page_access-btn-footer ${formData.settings_page_access ? 'selected-settings_page_access' : ''}`} onClick={() => handleButtonClicks('settings_page_access')} style={{ marginLeft: '30%', width: '90%', fontSize: '15px' }}>Setting</button>
                </div>
              </div>
            </Card>
            <Row className="mt-4">
              <Col>
                <Button className='ms-5' style={{ paddingLeft: '20px', paddingRight: '20px', borderRadius: '20px', marginTop: '-4px' }} variant="primary" onClick={() => handleButtonClick('professional')}>
                  Back
                </Button>
              </Col>
              <Col className="text-end">
                <Button className='me-5' style={{ paddingLeft: '20px', paddingRight: '20px', borderRadius: '20px', marginTop: '-4px' }} variant="primary" onClick={handleSubmits} >
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
    <Container style={{ paddingLeft: '75px' }} className="mt-4 employee-overall">
      <header className="my-2">
        <h3 style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold', paddingLeft: '20px' }}>{pageMode === 'add' ? 'Add  new' : 'Edit'}&nbsp;Employe</h3>
        <hr className='employee-hedline' style={{ color: ' rgba(0, 0, 0, 0.2)', marginTop: '3%' }}></hr>
      </header>
      <Card className="p-3 mt-4 shadow-sm employee-content" style={{ borderBottom: '4px solid #dee2e6', borderRadius: '20px', width: '93%', height: '500px', maxWidth: '1100px', marginLeft: '4%' }}>

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
              <span style={{ marginRight: '50px' }}>Employee Details</span>
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
              <span style={{ marginRight: '50px' }}>Work Details</span>
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
              <span style={{ marginRight: '50px' }}>Acess to Employee</span>
            </div>
          </Col>
        </Row>
        {renderContent()}
      </Card>


      <Modal show={showPopup} onHide={handleClosePopup}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Data saved successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClosePopup}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddEmploye;