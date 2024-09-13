import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import PhoneInput from 'react-phone-input-2';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-input-2/lib/style.css';
import './Addstaff.css'; 
// import { MyContext } from '../ProjectContext';
import upload from "../assest/export.png";
import success from "../assest/success.png"; 
//  import upload from "../assest/export.png";
//  import success from "../assest/success.png"; // Custom CSS for additional styling

const AddStaff = () => {
    const [dob, setDob] = useState(null);
    const [phone, setPhone] = useState('');
//   const {getLoginCredentials,setLoginCredentials} = useContext(MyContext);

    const [file, setFile] = useState();
    const [file1, setFile1] = useState();
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    const [mobileNumber, setMobileNumber] = useState("");
    const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [state1, setState1] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [CurrentPassword, setCurrentPassword] = useState("");
  const [pinCode, setPinCode] = useState(null);
  const [className, setClassName] = useState(null);
  const [division, setDivision] = useState(null);
  const [age, setAge] = useState(null);
  const {state} = useLocation();
  const {id_number} = state;
  const {mode} = state;
  const staffInduvidualID = Number(id_number);
  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: false,
    confirmPassword: false,
    passwordMatch: false
  });
  const defaultOrganizationName = 'demo12 school';
  
  
  const [bloodGroup, setBloodGroup] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [allergies, setAllergies] = useState(null);
  const [disease, setDisease] = useState(null);
  const [define1, setDefine1] = useState(null);
  const [define2, setDefine2] = useState(null);
  const [hcr, setHcr] = useState(null);
   const [getDDLDepartment] = useState([]);
  const [getDDLDesignation] = useState([]);
  const[organizationname,setOrganization_name]=useState("");
  const [idNumber, setIdNumber] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const pageMode = mode;
  const [DDLDepartment, setDDLDepartment] = useState([]);
  const [DDLDesignation, setDDLDesignation] = useState([]);

  const [errors, setErrors] = useState({
    name: false,
    idNumber: false,
    mobileNumber: false,
    address: false,
    selectedGender: false,
    state1: false,
    pinCode: false,
    className: false,
    division: false,
    dob: false,
    bloodGroup: false,
    selectedDepartment: false,
    selectedDesignation: false,
  });

  
  

  const handleChange2 = (value) => {
    setMobileNumber(value);
  };
  


    const handleProfilePictureChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfile(e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);

            // Reset the input field value
            event.target.value = null;
        }
    };

    const handleFileIconClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileIconClick1 = () => {
        document.getElementById('fileInput1').click();
    };

    // const [selectOrganization, setSelectOrganization] = useState(() => {
    //   return getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
    // });

    const handleFile = (event) => {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

        if (selectedFile && allowedTypes.includes(selectedFile.type)) {
            reader.onload = () => {
                const base64Data = reader.result;
                if (selectedFile.size <= 2 * 1024 * 1024) { // Check if file size is within 2MB
                    setFile(base64Data);
                } else {
                    setFile(null);
                }
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFile(null);
        }
    };

    const handleFile1 = (event) => {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

        if (selectedFile && allowedTypes.includes(selectedFile.type)) {
            reader.onload = () => {
                const base64Data = reader.result;
                if (selectedFile.size <= 2 * 1024 * 1024) { // Check if file size is within 2MB
                    setFile1(base64Data);
                } else {
                    setFile1(null);
                }
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFile1(null);
        }
    };

    let options = {
      method:"GET",
      headers:{
        "Content-Type": "application/json;"
      }
    };
  
    const  insertData = async ()=>{
      const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const month = `${d.getMonth() + 1}`.padStart(2, "0");
        const day = `${d.getDate()}`.padStart(2, "0");
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
      };
  
    let putData = {
     organization_name:defaultOrganizationName,
      profile:profile,
      name:name,
      password:NewPassword,
      password:CurrentPassword,
      address:address,
      gender:selectedGender,
      state:state1,
      pincode:pinCode,
      classes:className,
      division:division,
      age:0,
      dob:formatDate(dob), 
      blood_group:bloodGroup,
      designation:selectedDesignation,
      department:selectedDepartment, 
      allergies: allergies=="yes"?1:0, 
      allergies_define:define1,
      any_disease:disease=="yes"?1:0,
      any_disease_define:define2,
      mobile_number:mobileNumber, 
      hcr:hcr=="yes"?1:0, 
      id_number:idNumber,
    
      id:staffInduvidualID ,
       current_health_report:file,
        past_health_report:file1
    }
  const response = await fetch('http://localhost:5000/superAdmin_addStaff', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(putData)
  });
  
  console.log('JSON STRINGIFY DATA : ', JSON.stringify(putData));
  
  
  const data = await response.json();
  if (response.ok) {
  
    console.log('Data submitted successfully:', data);
  
  } else {
  
    console.error('Failed to submit data:', data);
  
  }
  
  }
   
  
    useEffect(() => {
      fetch(`http://localhost:5000/get_staffprofile_by_id?id_number=${staffInduvidualID}`, options)
        .then(response => response.json())
        .then(data12 => {
          if (data12.result && data12.result.length > 0) {
            const result = data12.result[0];
            
            // Set state based on API response
            setAllergies(result.allergies === 1 ? "yes" : "no");
            setDisease(result.any_disease === 1 ? "yes" : "no");
    
            // Correctly set the HCR state
            const hcrValue = result.hcr === 1 ? "yes" : "no";
            console.log("HCR Value from API:", hcrValue);
            setHcr(hcrValue);
    
            // Set other states
            setProfile(result.profile);
            setDivision(result.division);
            setPinCode(result.pincode);
            setSelectedGender(result.gender);
            setSelectedDepartment(result.department);
            setSelectedDesignation(result.designation);
            setBloodGroup(result.blood_group);
            setClassName(result.classes);
            setAddress(result.address);
            setIdNumber(result.id_number);
            setName(result.name);
            setState1(result.state);
            setMobileNumber(result.mobile_number || "");
            setFile(result.current_health_report);
            setFile1(result.past_health_report);
    
            let extractedDate = String(result.dob).split('T')[0];
            setDob(extractedDate);
            setDefine1(result.allergies_define);
            setDefine2(result.any_disease_define);
          }
        })
        .catch(error => console.log(error));
    
    }, []);

    useEffect(() => {
      const fetchDropdownData = async () => {
          try {
              // Fetch designations
              const designationResponse = await fetch(`http://localhost:5000/designation_dropdown?organization_name=${encodeURIComponent(defaultOrganizationName)}`, { mode: 'cors' });
              const designationData = await designationResponse.json();
              if (designationData.Result === "Success") {
                  console.log('DROPDOWN LIST (Designations): ', designationData.data);
                  setDDLDesignation(designationData.data);
              } else {
                  console.error('Failed to fetch designations:', designationData.message);
              }

              // Fetch departments
              const departmentResponse = await fetch(`http://localhost:5000/department_dropdown?organization_name=${encodeURIComponent(defaultOrganizationName)}`, { mode: 'cors' });
              const departmentData = await departmentResponse.json();
              if (departmentData.Result === "Success") {
                  console.log('DROPDOWN LIST (Departments): ', departmentData.data);
                  setDDLDepartment(departmentData.data);
              } else {
                  console.error('Failed to fetch departments:', departmentData.message);
              }
          } catch (error) {
              console.error('Error fetching dropdown data:', error);
          }
      };

      fetchDropdownData();
  }, []);


    const handleDelete = async () => {
      if (window.confirm("Are you sure you want to delete this staff member?")) {
          try {
              const response = await fetch('http://localhost:5000/superAdmin_staff_delete_btn?id_number=' + staffInduvidualID, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });
              const result = await response.json();
              if (response.ok) {
                  console.log("Delete successful:", result);
                  alert("Staff member deleted successfully.");
                  navigate("/Main4"); // Navigate to another page or refresh
              } else {
                  console.error("Delete failed:", result);
                  alert("Failed to delete staff member.");
              }
          } catch (error) {
              console.error("Error during delete:", error);
              alert("An error occurred while trying to delete the staff member.");
          }
      }
  };

    
  
    const validateForm = () => {
      const newErrors = {};
    
      // Check if required fields are empty
      newErrors.name = !name;
      newErrors.idNumber = !idNumber;
      newErrors.mobileNumber = !mobileNumber;
      newErrors.address = !address;
      newErrors.selectedGender = !selectedGender;
      newErrors.state1 = !state1;
      newErrors.pinCode = !pinCode;
      newErrors.className = !className;
      newErrors.division = !division;
      newErrors.dob = !dob;
      newErrors.bloodGroup = !bloodGroup;
      newErrors.selectedDepartment = !selectedDepartment;
      newErrors.selectedDesignation = !selectedDesignation;
    
      // Password validation
      const passwordErrors = {};
      passwordErrors.newPassword = !NewPassword;
      passwordErrors.confirmPassword = !CurrentPassword;
      passwordErrors.passwordMatch = NewPassword !== CurrentPassword;
    
      setErrors(newErrors);
      setPasswordErrors(passwordErrors);
    
      // Return true if there are no errors
      return Object.values(newErrors).every((error) => !error) &&
             !Object.values(passwordErrors).includes(true);
    };
    
    
    const handleSubmit = async () => {
      setIsSubmitted(true); // Set to true to trigger error display
    
      if (validateForm()) {
        if (pageMode === 'new') {
          await insertData();
          navigate("/Main4");
        } else if (pageMode === 'edit') {
          const putData = {
            profile,
            name,
            password: NewPassword,
            address,
            gender: selectedGender,
            state: state1,
            pincode: pinCode,
            classes: className,
            division,
            age: 0,
            dob,
            blood_group: bloodGroup,
            designation: selectedDesignation,
            department: selectedDepartment,
            allergies: allergies === "yes" ? 1 : 0,
            allergies_define: define1,
            any_disease: disease === "yes" ? 1 : 0,
            any_disease_define: define2,
            mobile_number: mobileNumber,
            hcr: hcr === "yes" ? 1 : 0,
            id_number: idNumber,
            id: staffInduvidualID,
            organization_name:defaultOrganizationName,
            current_health_report: file,
            past_health_report: file1

          };
    
          console.log(putData);
    
          const options = {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(putData)
          };
    
          await fetch('http://localhost:5000/superAdmin_updateStaff_by_id', options);
          alert('Data Submitted');
          navigate("/Main4");
        }
      }
    };
    
    useEffect(() => {
      console.log('Page Mode:', pageMode);
      console.log('Location State:', state);
    }, [pageMode, state]);
    
  
    
    const handleInputChange = (e, setter) => {
      setter(e.target.value);
      // Optionally validate the field here if needed
    };

    return (
        <div className="container my-4">
            <div className="card   totalcard  p-4">
                <Row className="align-items-center mt-1">
                    <Col md={6} className="text-start">
                        <h4 style={{ color: '#212121', fontSize: '20px' }} className="ms-5">Add Satff</h4>
                    </Col>
                    <Col md={6} className="text-end">
                        <Button style={{ backgroundColor: "#E51837", borderColor: '#E51837', borderRadius: '20px', paddingRight: "40px", paddingLeft: "40px", height: '35px', paddingTop: '6px', fontSize: '12px' }}  onClick={handleDelete}  className="me-2">
                            Delete
                        </Button>
                    </Col>
                </Row>
                <hr />

                {/* Profile Pic and Main Form */}
                <Row>
                    <Col md={3} className="text-center">
                        <div className="profile-pic">
                            <img
                                src={profile || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="img-fluid rounded"
                            />
                            <Button variant="primary" className="mt-2 upload-btn" onClick={() => document.getElementById('profileInput').click()}>
                                Upload
                            </Button>
                            <input
                                hidden
                                id="profileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                            />
                        </div>
                    </Col>
                    <Col md={9}>
                        {/* Name, ID Number, Mobile Number */}
                        <Row>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                <Form.Label 
  style={{ 
    color: errors.name ? 'red' : '#21272A',
    fontSize: '13px',
    fontWeight: '500' 
  }}>
  Name*
</Form.Label>
                                    <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}} type="text"  value={name}
                          onChange={(e) => handleInputChange(e, setName)}
                          id="name"/>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3 AddstaffIdnumber">
                                <Form.Label 
  style={{ 
    color: errors.idNumber ? 'red' : '#21272A',
    fontSize: '13px',
    fontWeight: '500' 
  }}>
  ID Number*
</Form.Label>
                                    <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}} type="text" value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
        />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3 AddStaffmobile">
                                <Form.Label 
  style={{ 
    color: errors.mobileNumber ? 'red' : '#21272A',
    fontSize: '13px',
    fontWeight: '500' 
  }}>
  Mobile Number*
</Form.Label>
                                    <PhoneInput
  country={'in'}
  value={mobileNumber} // Pass the correct value here
  onChange={handleChange2}
  inputProps={{
    required: true,
  }}
  inputStyle={{ 
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)", 
      border: "none", 
      borderRadius: '8px' 
  }}
/>

                                </Form.Group>
                            </Col>
                        </Row>

                        {/* New Password, Confirm Password */}
                        <Row>
  <Col md={6}>
    <Form.Group className="mb-3 AddStaffpassword">
      <Form.Label 
        style={{ 
          color: passwordErrors.newPassword || passwordErrors.passwordMatch ? 'red' : '#21272A',
          fontSize: '13px',
          fontWeight: '500' 
        }}
      >
        New Password*
      </Form.Label>
      <Form.Control 
        style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}
        type="password" 
      
        value={NewPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      {passwordErrors.passwordMatch && <div style={{color: 'red', fontSize: '12px'}}>Passwords does not match</div>}
    </Form.Group>
  </Col>
  <Col md={6}>
    <Form.Group className="mb-3 Addstaffconpass">
      <Form.Label 
        style={{ 
          color: passwordErrors.confirmPassword || passwordErrors.passwordMatch ? 'red' : '#21272A',
          fontSize: '13px',
          fontWeight: '500' 
        }}
      >
        Confirm Password*
      </Form.Label>
      <Form.Control 
        style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}
        type="password" 
        
        value={CurrentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      
      {passwordErrors.passwordMatch && <div style={{color: 'red', fontSize: '12px'}}>Passwords does not match</div>}
    </Form.Group>
  </Col>
</Row>

                        {/* Address, Gender */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                <Form.Label 
  style={{ 
    color: errors.address ? 'red' : '#21272A',
    fontSize: '13px',
    fontWeight: '500' 
  }}>
  State*
</Form.Label>
                                    <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}  type="text" value={address}
                          onChange={(e) => setAddress(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                <Form.Label 
  style={{ 
    color: errors.selectedGender ? 'red' : '#21272A',
    fontSize: '13px',
    fontWeight: '500' 
  }}>
  Gender*
</Form.Label>
                                    <Form.Select value={selectedGender}
                            onChange={(e) => setSelectedGender(e.target.value)}
                          
                                 style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}  
                                        as="select">
                                        <option>Select Gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {/* State, Pincode, Class, Date of Birth */}
                <Row>
                    <Col md={2}>
                        <Form.Group className="mb-3">
                        <Form.Label 
  style={{ 
    color: errors.state1 ? 'red' : '#21272A',
    fontSize: '13px',
    fontWeight: '500' 
  }}>
State*
</Form.Label>
                            <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}   type="text"  value={state1}
                          onChange={(e) => setState1(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group className="mb-3">
                        <Form.Label 
  style={{ 
    color: errors.pinCode ? 'red' : '#21272A',
    fontSize: '13px',
    fontWeight: '500' 
  }}>
  Pincode*
</Form.Label>
                            <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}   type="text" value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)} />
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group className="mb-3">
                        <Form.Label 
  style={{ 
    color: errors.className ? 'red' : '#21272A',
    fontSize: '13px',
    fontWeight: '500' 
  }}>
  Class*
</Form.Label> 
                            <Form.Select  value={className}

onChange={(e) => {
  setClassName(e.target.value);
 // Clear error when user types
}}
                          
                                style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}  
                                as="select">
                                  <option disabled selected>
        Choose...
      </option>
                                   
                                   
                                <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
      <option>6</option>
      <option>7</option>
      <option>8</option>
      <option>9</option>
      <option>10</option>
      <option>11</option>
      <option>12</option>
                                {/* Add more classes here */}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group className="mb-3">
                        <Form.Label 
  style={{ 
    color: errors.division ? 'red' : '#21272A',
    fontSize: '13px',
    fontWeight: '500' 
  }}>
  Division*
</Form.Label>
                            <Form.Select   value={division}
                         onChange={(e) => setDivision(e.target.value)}  style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}  
                                as="select">
                                   <option disabled selected>
        Choose...
      </option>
                                <option>A</option>
      <option>B</option>
      <option>C</option>
      <option>D</option>
      <option>E</option>
      <option>F</option>
      <option>G</option>
      <option>H</option>
      <option>I</option>
      <option>J</option>
      <option>K</option>
      <option>L</option>
      <option>M</option>
      <option>N</option>
      <option>O</option>
      <option>P</option>
      <option>Q</option>
      <option>A1</option>
      <option>A2</option>
      <option>B1</option>
      <option>B2</option>
                                {/* Add more divisions here */}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col >
                        <Form.Group className="mb-3">
                        <Form.Label 
  style={{ 
    color: errors.dob  ? 'red' : '#21272A',
    fontSize: '13px',
    fontWeight: '500' 
  }}>
  Date of Birth*
</Form.Label>

                            <br></br>
                            <DatePicker 
                                selected={dob}
                                onChange={(date) => setDob(date)}
                                dateFormat="MMMM d, yyyy"
                                className="form-control datepickerstaffadd "
                                placeholderText="Select Date"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Blood Group, Department, Designation */}
                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                        <Form.Label 
  style={{ 
    color: errors.bloodGroup ? 'red' : '#21272A',
    fontSize: '13px',
    fontWeight: '500' 
  }}>
  bloodGroup*
</Form.Label>
                            <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}   type="text" placeholder="Placeholder"  value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                        <Form.Label 
  style={{ 
    color: errors.selectedDepartment? 'red' : '#21272A',
    fontSize: '13px',
    fontWeight: '500' 
  }}>
  Department*
</Form.Label>

<Form.Select value={selectedDepartment}
                            onChange={(e) =>
                              setSelectedDepartment(e.target.value)}
                                style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}  
                                as="select">
                                
                            <option selected>Choose...</option>
                            {DDLDepartment.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                                {/* Add more departments here */}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                        <Form.Label 
  style={{ 
    color: errors.selectedDesignation? 'red' : '#21272A',
    fontSize: '13px',
    fontWeight: '500' 
  }}>
  Desigantion*
</Form.Label>
<Form.Select  value={selectedDesignation}
                            onChange={(e) =>
                              setSelectedDesignation(e.target.value)
                            }
                                style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}  
                                as="select">
                               <option selected>Choose...</option>
                               {DDLDesignation.map(desig => (
                        <option key={desig} value={desig}>{desig}</option>
                    ))}
               
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
          <Col md={4}>
          <Form.Group className="mb-3 custom-radio">
  <Form.Label style={{color:'#697077',fontSize:'13px',fontWeight:'500'}}>Allergies</Form.Label>
  <br></br>
  <div className="d-inline  ">
    <Form.Check 
      inline
      label="Yes"
      name="allergies"
      type="radio"
      id="allergies-yes"
      value="yes"
        onChange={() => setAllergies("yes")}
        checked={ allergies === null ? 0 : 1}// Ensure this is correctly bound
      
    />
    <Form.Check
      inline
      label="No"
      name="allergies"
      type="radio"   
      id="allergies-no"
      value="no"
        onChange={() => setAllergies("no")}
        checked={allergies === "no"}
    />
  </div>
</Form.Group>

          </Col>
          <Col md={4}>
          <Form.Group className="mb-3 custom-radio">
  <Form.Label style={{color:'#697077',fontSize:'13px',fontWeight:'500'}}>Any Disease</Form.Label>
  <br></br>
  <div className="">
    <Form.Check
      inline
      label="Yes"
      name="disease"
      type="radio"
      id="disease-yes"
      value="yes"
        onChange={() => setDisease("yes")}
        checked={disease === "yes"}
    />
    <Form.Check
      inline
      label="No"
      name="disease"
      type="radio"
      id="disease-no"
      value="no"
        onChange={() => setDisease("no")}
        checked={disease === "no"}
    
    />
  </div>
</Form.Group>
          </Col>
          <Col md={4}>
          
    <label style={{color:'#21272A',fontSize:'13px'}} >
        Current Health Report
    </label>
    <div className="d-flex align-items-center borderrstaf">
        <form className="w-100">
            <input
                hidden
                id="fileInput"
                className="signupinput22"
                type="file"
                name="file"
                onChange={handleFile}
                required
            />
            <div className="p-2 d-flex align-items-center rounded">
                <span className="flex-grow-1">
                    {file ? (
                        <>
                            <img
                                 src={success}
                                alt="Upload Successfully"
                                className="me-2 success-icon"
                                style={{ width: '20px', height: '20px' }}
                            />
                            <span style={{ color: '#697077', fontSize: '13px', marginLeft: '-5px' }} className="success-text">
                                Upload Successful
                            </span>
                        </>
                    ) : (
                        <span style={{ color: '#697077', fontSize: '13px', marginLeft: '5px' }} className="upload-text">
                            Upload file
                        </span>
                    )}
                </span>
                <img
                    
                    src={upload}
                    onClick={handleFileIconClick}
                    className="signup-icon ms-2"
                    style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                />
            </div>
        </form>
    </div>
    

          </Col>
        </Row>

        {/* Past Health Report */}
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label style={{color:'#697077',fontSize:'13px',fontWeight:'500'}}>Define</Form.Label>
              <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}  as="textarea" placeholder="Type your message..."  value={define1}
                          onChange={(e) => setDefine1(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3 ">
              <Form.Label style={{color:'#697077',fontSize:'13px',fontWeight:'500'}}>Define</Form.Label>
              <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}  as="textarea" placeholder="Type your message..."  value={define2}
                          onChange={(e) => setDefine2(e.target.value)} />
            </Form.Group>
          </Col>
          <Col className='mt-4' md={4}>
          <label style={{color:'#21272A',fontSize:'13px', marginLeft: '4px'}}>
        Past Health Report
    </label>
    <div style={{marginLeft:'4px'}} className="d-flex align-items-center borderrstafff">
        <form className="w-100">
            <input
                hidden
                id="fileInput1"
                className="signupinput22"
                type="file"
                name="file1"
                onChange={handleFile1}
                required
            />
            <div className="p-2 d-flex align-items-center rounded">
                <span className="flex-grow-1">
                    {file1 ? (
                        <>
                            <img
                                src={success}
                                alt="Upload Successfully"
                                className="me-2 success-icon"
                                style={{ width: '20px', height: '20px' }}
                            />
                            <span style={{ color: '#697077', fontSize: '13px', marginLeft: '-5px' }} className="success-text">
                                Upload Successful
                            </span>
                        </>
                    ) : (
                        <span style={{ color: '#697077', fontSize: '13px', marginLeft: '5px' }} className="upload-text">
                            Upload file
                        </span>
                    )}
                </span>
                <img
                    src={upload}
                    onClick={handleFileIconClick1}
                    className="signup-icon ms-2"
                    style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                />
            </div>
        </form>
    </div>
   

          </Col>
        </Row>

        {/* HCR and Save Button in the Same Row */}
        <Row className="align-items-center">
          <Col md={4} className="custom-radio">
          <Form.Group className="mb-3 custom-radio">
  <Form.Label style={{color:'#21272A',fontSize:'13px',fontWeight:'500'}}>HCR</Form.Label>
  <br></br>
  <div className="d-inline">
    <Form.Check
      inline
      label="Yes"
      name="hcr"
      type="radio"
      id="hcr-yes"
      value="yes"
        onChange={() => setHcr("yes")}
        checked={hcr === "yes"}  
      
    />
    <Form.Check
      inline
      label="No"
      name="hcr"
      type="radio"
      id="hcr-no"
      value="no"
      onChange={() => setHcr("no")}
      checked={hcr === "no"}
    />
  </div>
</Form.Group>
          </Col>
          <Col md={8} className="text-end">
            <Button style={{ width: '30%' }} variant="primary" onClick={handleSubmit}>Save</Button>
          </Col>
        </Row>
      </div>
    </div>
               
    );
};

export default AddStaff;