import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Image } from "react-bootstrap";
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list";
import avatar from "../images/defimg.png";
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import upload from "../assest/export.png";
import success from "../assest/success.png";
import "./AddOrganization.css";
import { Link, useNavigate, useLocation } from 'react-router-dom';


const AddOrganization = () => {





  const [profile, setProfile] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orgname, setOrgName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const [errorMessage3, setErrorMessage3] = useState("");
  const [orgemail, setOrgEmail] = useState("");
  const [orgtype, setOrgType] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [orgRegNumber, setOrgRegNumber] = useState("");
  const [countStudents, setCountStudents] = useState("");
  const [countStaffs, setCountStaffs] = useState("");
  const [state, setState] = useState("");
  const [RMcode, setRMCode] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [pincode, setPincode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage1, setErrorMessage1] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [RMname, setRMname] = useState("");
  const [RMid, setRMid] = useState("");
  const [rmNames, setRMNames] = useState([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const location = useLocation();
  const { mode } = location.state || {};
 const {  id } = location.state || {};

  const pageMode = mode;
const org_id =id;

  const navigate = useNavigate();

  useEffect(() => {
    if (pageMode === "edit") {
      const fetchData = async () => {
        try {
          const userData = {
            id: org_id,
          };
  
          // API call using fetch
          const response = await fetch('http://localhost:5000/superAdmin_edit_organization_submit_btn', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
  
          // Parsing the JSON response
          const responseData = await response.json();
  
          // Set data into state only if response is ok
          if (response.ok) {
            setOrgName(responseData.organization_name || ""); 
            setOrgType(responseData.organization_type || "");
            setOrgEmail(responseData.email_id || "");
            setPhoneNumber(responseData.organization_mobile_no || "");
            setAddress(responseData.address || "");
            setState(responseData.state || "");
            setPincode(responseData.pincode || "");
            setGstNumber(responseData.gst_number || "");
            setCountStudents(responseData.count_of_student || 0);
            setCountStaffs(responseData.count_of_staff || 0);
            setOrgRegNumber(responseData.organisation_register_no || "");
            setFile(responseData.upload_doc || null);
            setCity(responseData.city || "");
            setUsername(responseData.username || "");
            setPassword(responseData.password || "");
            setconfirmPassword(responseData.password || "");
            setProfile(responseData.profile || null);
            setRMCode(responseData.RM_CODE || "");
            setRMname(responseData.r_m_name || "");
            setRMid(responseData.r_m_id || "");
  
            // Alert the user that data was updated successfully
            alert("Data fetched successfully");
          } else {
            setErrorMessage(responseData.message || "Error fetching data.");
          }
        } catch (error) {
          console.error('Error:', error);
          setErrorMessage('Network error, please try again later.');
        }
      };
  
      // Call the async function
      fetchData();
    }
  }, [pageMode, org_id, navigate]);
  
  


  useEffect(() => {
    axios.get('http://localhost:5000/dropdown_r_m_names')
      .then(response => {
        setRMNames(response.data);
      })
      .catch(error => {
        console.error('Error fetching RM names:', error);
      });
  }, []);


  const handleFileIconClick = () => {
    document.getElementById('fileInput').click();
  };

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
          setErrorMessage1("File size exceeds 2MB");
          setFile(null);
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setErrorMessage1("Invalid file type, expected pdf, jpeg, jpg, png");
      setFile(null);
    }
  };

  const handleChange = (value) => {
    setPhoneNumber(value);
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

  const validatePhoneNumber = (phoneNumber) => {
    // Remove any non-digit characters (optional, depending on your requirements)
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    // Check if the phone number has at least 10 digits
    if (cleanedPhoneNumber.length < 12) {
      return false; // Phone number is invalid
    }
  
    // Validate the phone number using the pattern
    const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern.test(phoneNumber);
  };



const checkFields = () => {
  const errors = {};

  if (!orgname) errors.orgname = "Organization Name is required";
  if (!orgtype) errors.orgtype = "Organization Type is required";
  if (!orgemail) errors.orgemail = "Invalid Email ID";
  if (!validatePhoneNumber(phoneNumber)) errors.phoneNumber = "Invalid Phone Number";
  if (!gstNumber) errors.gstNumber = "GST Number is required";
  if (!orgRegNumber) errors.orgRegNumber = "Organization Registration Number is required";
  if (!countStudents) errors.countStudents = "Valid Count of Students is required";
  if (!countStaffs) errors.countStaffs = "Valid Count of Staffs is required";
  if (!address) errors.address = "Address is required";
  if (!city) errors.city = "City is required";
  if (!state) errors.state = "State is required";
  if (!username) errors.username = "Username is required";
  if (!password) errors.password = "Password is required";
  if (!confirmPassword) errors.confirmPassword = "Confirm Password is required";
  if (!pincode) errors.pincode = "Invalid Pincode";
  if (!file) errors.file = "Document upload is required";
  if (!RMname) errors.RMname = "RM name is required";
  if (!RMid) errors.RMid = "RM id is required";
  if (!RMcode) errors.RMcode = "RM code is required";

  setFormErrors(errors);

  if (Object.keys(errors).length === 0) {
    // Proceed with form submission
    console.log("Form submitted successfully");
  }
}

 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const userData = {
        profile: profile,
        organization_name: orgname,
        organization_type: orgtype,
        email_id: orgemail,
        organization_mobile_no: phoneNumber,  // Corrected key
        address: address,
        state: state,
        pincode: pincode,
        gst_number: gstNumber,
        count_of_student: countStudents,
        count_of_staff: countStaffs,
        organisation_register_no: orgRegNumber,  // Corrected key
        upload_doc: file,
        city: city,
        username: username,
        password: password,
        r_m_name: RMname,
        r_m_id: RMid,
        RM_CODE: RMcode,
      };
  
      // API call using fetch
      const response = await fetch('http://localhost:5000/superAdmin_add_organization', {  // Corrected URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
  
      // Parsing the JSON response
      const responseData = await response.json();
  
      // Checking response status
      if (!response.ok) {
        setErrorMessage(responseData.message);
      } else {
        alert(responseData.message);
        navigate('/Onboard_List');
      }
  
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Network error, Please try again later');
    }
  };
  

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  alert(org_id);
    try {
      const userData = {
    id:org_id,
        profile: profile,
        organization_name: orgname,
        organization_type: orgtype,
        email_id: orgemail,
        organization_mobile_no: phoneNumber,  // Corrected key
        address: address,
        state: state,
        pincode: pincode,
        gst_number: gstNumber,
        count_of_student: countStudents,
        count_of_staff: countStaffs,
        organisation_register_no: orgRegNumber,  // Corrected key
        upload_doc: file,
        city: city,
        username: username,
        password: password,
        r_m_name: RMname,
        r_m_id: RMid,
        RM_CODE: RMcode,
      };
  
      // API call using fetch
      const response = await fetch('http://localhost:5000/superAdmin_edit_organization_submit_btn', {  // Corrected URL
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
  
      // Parsing the JSON response
      const responseData = await response.json();
  
      // Checking response status
      if (!response.ok) {
        setErrorMessage(responseData.message);
      } else {
        alert("Datas updated successfully");
        navigate('/OrganizationHeader');
      }
  
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Network error, Please try again later');
    }
  };



// const handleMailChange = (e) => {
//   const verify = e.target.value.toLowerCase();
//   setOrgEmail(verify);

//   // Validate email
//   if (!verify.includes('@') || !verify.includes('.com')) {
//     setErrorMessage3('Email must include "@" and ".com"');
//   } else {
//     setErrorMessage3('');
//   }
//   }



const handleMailChange = (e) => {
  const verify = e.target.value.toLowerCase();
  setOrgEmail(verify);

  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(verify)) {
    setErrorMessage3('Invalid Mail Format');
  } else {
    setErrorMessage3('');
  }
}




  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    // Call checkFields to perform any additional field validation
    checkFields(e);
  
    // Ensure all required fields are filled
    if (
      orgname.trim() && 
      orgtype.trim() && 
      phoneNumber.trim() && 
      orgemail.trim() && 
      gstNumber.trim() && 
      orgRegNumber.trim() &&
      // countStudents.trim() && 
      // countStaffs.trim() && 
      city.trim() && 
      state.trim() && 
      username.trim() && 
      confirmPassword.trim() && 
      password.trim() && 
      address.trim() &&
      RMname.trim() &&
      RMid.trim() &&
      RMcode.trim()

      // pincode.trim()
    ) {
      // Validate phone number
      if (!validatePhoneNumber(phoneNumber)) {
        setErrorMessage('Please enter a valid organization mobile number.');
        return; // Stop form submission
      }
  
      // Validate file upload
      if (!file) {
        setErrorMessage('Please upload a document before proceeding.');
        return; // Stop form submission
      }
  
      // Validate password
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
      if (!passwordPattern.test(password)) {
        setErrorMessage('Password must contain at least one uppercase letter, lowercase letter, special character, and be at least 8 characters long.');
        return; // Stop form submission
      }
  
      // Check if passwords match
      if (password !== confirmPassword) {
        setErrorMessage("Passwords don't match.");
        return; // Stop form submission
      }


      if(pageMode === 'new')
      {
        handleSubmit(e);
      }
      else if(pageMode === 'edit')
      {
        handleEditSubmit(e);
      }    
    }
  };
  


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div fluid className="addorganization-main-container">
      <div className="row align-items-center mb-4">
        <div className="col-12">
          <h1 className="add-organization-head">Onboarding Organization</h1>
          <hr className="addOrgan-hr" />
        </div>
      </div>

      <div className="addorganization-content-container">
        <div className="row align-items-center">
          <Col md={12}>
          <h3 className="add-organization-head3">
  {pageMode === "new" ? "Add Organization" : "Edit Organization"}
</h3>

          </Col>
          <hr className="addOrgan-hr1" />
          {errorMessage && <p className="text-danger fs-6 mt-3 mb-n4">{errorMessage}</p>}
        </div>

        <Row className="mt-3">
          <Col md={4} className="addOrgan-image-container text-center">
            <div className="profile-pic">
              <img
                src={profile || avatar}
                alt="Profile"
                className="img-fluid rounded"
              />
              <Button variant="primary" className="addOrgan-upload-button" onClick={() => document.getElementById('profileInput').click()}>
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

          <Col>
            <Form>
              <Row className=" mt-3">
                <Form.Group as={Col} md={8} className="mb-3">
                  <Form.Label id="OrgInput" className={formErrors.orgname ? "text-danger" : "text-dark"}>
                    Organization Name*
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="addOrgan-input"
                    value={orgname}
                    onChange={(e) => {
    if (e.target.value.length <= 30) {
      setOrgName(e.target.value);
    }
  }}
                  />
                </Form.Group>
                
                <Form.Group as={Col} md={4}>
                  <Form.Label id="orgtype"
                   className={formErrors.orgtype ? "text-danger" : "text-dark"}>
                    Organization Type*
                  </Form.Label>
                  <Form.Select
                  value={orgtype}
  defaultValue="Placeholder"
  className="addOrgan-select"
  onChange={(e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "Others") {
      setIsOtherSelected(true);   // Show input field if "Others" is selected
      setOrgType("");              // Clear orgType for "Others"
    } else {
      setIsOtherSelected(false);  // Hide input field for predefined options
      setOrgType(selectedValue);  // Set orgType to selected value
    }
  }}
>
                    <option >Placeholder</option>
                    <option>School</option>
                    <option>College</option>
                    <option>Others</option>
                  </Form.Select>
                  {isOtherSelected && (
  <Form.Control
    className="addOrgan-input mt-2"
    type="text"
    placeholder="Enter Organization Type"
    value={orgtype}
    onChange={(e) => setOrgType(e.target.value)} // Set custom value for "Others"
  />
)}
                </Form.Group>
              </Row>

              <Row className="">
                <Form.Group as={Col} md={6} className="mb-3">
                  <Form.Label id="emailInput" className={formErrors.orgemail ? "text-danger" : "text-dark"}>Email-id*</Form.Label>
                  <Form.Control
                    type="email"
                    
                    className="addOrgan-input"
                    value={orgemail}
                    onChange={handleMailChange}
                  />
                   {errorMessage3 && <p className="addOrgan-error text-danger mt-3 mb-n4">{errorMessage3}</p>}
                </Form.Group>
                <Form.Group as={Col} md={6}>
                  <Form.Label className={formErrors.phoneNumber ? "text-danger" : "text-dark"} id="OrgphoneInput">
                    Organization Mobile Number*
                  </Form.Label>
                  <PhoneInput style={{zIndex:1}}
               
                      containerClass='addOrgan-mobile addOrgan-mobilephone'
                      className="addOrgan-org-phone"
                      country={"in"}

                      value={phoneNumber}
                      onChange={handleChange}
                      inputProps={{
                        required: true,
                      }}
                    />
                </Form.Group>
              </Row>

              <Row className="">
                <Form.Group as={Col} md={6} className="mb-3">
                  <Form.Label id="gstNumber" className={formErrors.gstNumber ? "text-danger" : "text-dark"}>GST Number*</Form.Label>
                  <Form.Control
                    type="text"
                 
                    className="addOrgan-input"
                    value={gstNumber}
                    // onChange={(e) => setGstNumber(e.target.value)}
                    onChange={(e) => {
      const inputValue = e.target.value;

      // Allow only up to 15 digits
      if (inputValue.length <= 15) {
        setGstNumber(inputValue);
      
      }
    }}
                  />
                </Form.Group>

                <Form.Group as={Col} md={6} >
                  <Form.Label className={formErrors.RMcode ? "text-danger" : "text-dark"}>RM Code*</Form.Label>
                  <Form.Control
                    type="text"
                value={RMcode}
             
                onChange={(e) => {
    if (e.target.value.length <= 15) {
      setRMCode(e.target.value);
    }
  }}
                    className="addOrgan-input"
                  />
                </Form.Group>
              </Row>
            </Form>
          </Col>
        </Row>

        <Row>
          <Form>
            <Row className=" mt-2">
              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label className={formErrors.countStudents ? "text-danger" : "text-dark"}>Count of Students*</Form.Label>
                <Form.Control
                  type="text"
              
                  className="addOrgan-input"
                  value={countStudents}
                  onChange={(e) => {
  const value = e.target.value;
  const digitsOnly = value.replace(/\D/g, ''); // Remove non-digits
  if (digitsOnly.length <= 7) {
    setCountStudents(digitsOnly);
  }
}}
                />
              </Form.Group>
              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label className={formErrors.orgRegNumber ? "text-danger" : "text-dark"}>Organization Registration Number*</Form.Label>
                <Form.Control
                  type="text"
               
                  className="addOrgan-input"
                  value={orgRegNumber}
                  
                    onChange={(e) => {
    if (e.target.value.length <= 15) {
      setOrgRegNumber(e.target.value);
    }
  }}
                />
              </Form.Group>
              
              <Form.Group as={Col} md={4}>
  <label className={formErrors.file ? "text-danger" : "text-dark"} id="fileUpdateInput">
    Upload Document*
  </label>
  <br />
  <div className="w-100 d-flex">
    <form className="w-100 upload-file">
      <input
        hidden
        id="fileInput"
        className={`file-22 ${file ? '' : 'error-border'}`}
        type="file"
        name="file"
        onChange={handleFile}
        required
      />
      <div className="w-100 addOrgan-uploadicon-container position-relative">
        <img
          src={upload} // Replace with your upload icon
          onClick={handleFileIconClick}
          className="addOrgan-imagelink-button position-absolute"
          alt="Upload"
        />
        {!file && (
          <span className="addOrgan-placeholder-text" id="fileInput">Upload file</span>
        )}
      </div>
      {file && (
        <span className="addOrgan-image-upload">
          <span className="addOrgan-upload-icon">
            <img
              src={success} // Replace with success icon
              alt="Upload Successfully"
              className="addOrgan-upload-image"
            />
          </span>
          <span className="addOrgan-upload-success">Upload Successful</span>
        </span>
      )}
    </form>
  </div>
  {!file && errorMessage1 && (
    <p className="signup-error-message text-danger mt-1 mb-n3">{errorMessage1}</p>
  )}
  <br />
</Form.Group>

            </Row>

            <Row className="">
              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label className={formErrors.countStaffs ? "text-danger" : "text-dark"}>Count of Staffs*</Form.Label>
                <Form.Control
                  type="text"
             
                  className="addOrgan-input"
                  value={countStaffs}
                  onChange={(e) => {
  const value = e.target.value;
  const digitsOnly = value.replace(/\D/g, ''); // Remove non-digits
  if (digitsOnly.length <= 7) {
    setCountStaffs(digitsOnly);
  }
}}
                />
              </Form.Group>
              <Form.Group as={Col} md={8} className="mb-3">
                <Form.Label className={formErrors.address ? "text-danger" : "text-dark"}>Address*</Form.Label>
                <Form.Control
                  type="text"
                
                  className="addOrgan-input"
                  value={address}
                  
                  onChange={(e) => {
    if (e.target.value.length <= 40) {
      setAddress(e.target.value);
    }
  }}
                />
              </Form.Group>
            </Row>
            <Row className="mb-4">
              <Form.Group as={Col} md={4} >
                <Form.Label className={formErrors.city ? "text-danger" : "text-dark"}>City*</Form.Label>
                <Form.Control
                  type="text"
             
                  className="addOrgan-input"
                  value={city}
                  onChange={(e) => {
  const value = e.target.value;
  const filteredValue = value.replace(/[0-9]/g, ''); // Remove digits
  setCity(filteredValue);
}}
                />
              </Form.Group>
              <Form.Group as={Col} md={4} >
                <Form.Label className={formErrors.state ? "text-danger" : "text-dark"}>State*</Form.Label>
                <Form.Control
                  type="text"
               
                  className="addOrgan-input"
                  value={state}
                  onChange={(e) => {
  const value = e.target.value;
  const filteredValue = value.replace(/[0-9]/g, ''); // Remove digits
  setState(filteredValue);}}
                />
              </Form.Group>

              <Form.Group as={Col} md={4}>
                <Form.Label className={formErrors.pincode ? "text-danger" : "text-dark"}>Pincode*</Form.Label>
                <Form.Control
                  type="text"
             
                  className="addOrgan-input"
                  value={pincode}
                  onChange={(e) => {
  const value = e.target.value;
  const digitsOnly = value.replace(/\D/g, ''); // Remove non-digits
  if (digitsOnly.length <= 6) {
    setPincode(digitsOnly);
  }
}}
                />
              </Form.Group>
            </Row>
            <Row className="">
              <Form.Group as={Col} md={4} >
                <Form.Label className={formErrors.username ? "text-danger" : "text-dark"}>User Name*</Form.Label>
                <Form.Control
                  type="text"
             
                  className="addOrgan-input"
                  value={username}
                  onChange={(e) => {
  const value = e.target.value;
  const filteredValue = value.replace(/[0-9]/g, ''); // Remove digits
  const finalValue = filteredValue.slice(0, 10); // Limit to 10 characters
  setUsername(finalValue);
}}

                />
              </Form.Group>
              <Form.Group as={Col} md={4}>
      <Form.Label className={formErrors.password ? "text-danger" : "text-dark"}>New Password*</Form.Label>
      <div className="addOrgan-password-wrapper">
        <Form.Control
          type={showPassword ? "text" : "password"} // Toggle between text and password
          className="addOrgan-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="link" onClick={togglePasswordVisibility} className="addOrgan-eye-icon">
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </Button>
      </div>
    </Form.Group>

              <Form.Group as={Col} md={4}>
                <Form.Label className={formErrors.confirmPassword ? "text-danger" : "text-dark"}>Confirm Password*</Form.Label>
                <Form.Control
                  type="password"
             
                  className="addOrgan-input"
                  value={confirmPassword}
                  onChange={(e) => setconfirmPassword(e.target.value)}
 
                />
              </Form.Group>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <h3 className="mb-2 add-organization-head3">Assign RM</h3>
              </Col>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label className={formErrors.RMname ? "text-danger" : "text-dark"}>RM Name*</Form.Label>
                <br></br>
                <select  id="rmNames" value={RMname} className="addOrgan-input-select" onChange={(e) => setRMname(e.target.value)}>
  <option value="" hidden>Select a Regional Manager</option>
  {rmNames.map(rm => (
    <option key={rm.r_m_name} value={rm.r_m_name}>
      {rm.r_m_name}
    </option>
  ))}
</select>

               
              </Form.Group>

              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label className={formErrors.RMid ? "text-danger" : "text-dark"}>RM ID*</Form.Label>
               <br></br>
                <select id="rmNames" value={RMid} className="addOrgan-input-select"  onChange={(e) => setRMid(e.target.value)}>
  <option value="" hidden>Select a RM ID</option>
  {rmNames.map(rm => (
    <option key={rm.r_m_id} value={rm.r_m_id}>
      {rm.r_m_id}
    
    </option>
  ))}
</select>

              </Form.Group>
              <Form.Group as={Col} md={4} className="mb-3">
              <Col className="text-end">
                <Button variant="primary" type="submit" className="addOrgan-savebtn" onClick={handleFormSubmit}>
                  Save
                </Button>
              </Col>
              </Form.Group>
            </Row>

            <Row>
            <Col>   {errorMessage && <p className="text-danger fs-6 mt-3 mb-n4">{errorMessage}</p>}</Col>
              
            </Row>
          </Form>
        </Row>
      </div>
    </div>
  );
};

export default AddOrganization;

