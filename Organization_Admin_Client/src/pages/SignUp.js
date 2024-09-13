import React, { useState,useContext, useEffect } from "react";
import { Link, useHistory  } from "react-router-dom";
import logo from "../photos/regwomen.jpg";
import button from "../photos/button.png";
import upload from "../photos/export.png";
import success from "../photos/success.png";
import "../styles/SignUp.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { MyContext } from "../ProjectContext";
import { useNavigate } from "react-router-dom";

const SignUp = () => {

  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const { userObj, setUserObj } = useContext(MyContext);
  const [file, setFile] = useState();
  const [show, setShow] = useState(true);
const navigate = useNavigate();
const [isClicked, setIsClicked] = useState(false);
  const [phoneNumber1, setPhoneNumber1] = useState("");
  const [valid1, setValid1] = useState(true);
  const [valid2, setValid2] = useState(true);
  const [valid, setValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage1, setErrorMessage1] = useState("");
  const [errorMesage, setErrorMesage] = useState("");
  const [orgname, setorgname] = useState('');
  const [orgtype, setorgtype] = useState('');
  const [mail, setmail] = useState('');
  const [orgphone, setorgphone] = useState('');
  const [Addresss, setAddresss] = useState('');
  const [States, setStates] = useState('');
  const [pin, setpin] = useState('');
  const [gst, setgst] = useState('');
  const [student, setstudent] = useState('');
  const [staff, setstaff] = useState('');
  const [regnumber, setregnumber] = useState('');
  const [uploaddoc, setuploaddoc] = useState('');
  const [city, setcity] = useState('');
  const [hear, sethear] = useState('');
  const [name, setname] = useState('');
  const [designation, setdesignation] = useState('');
  const [mail1, setmail1]= useState('');
  const [phoneNumber2, setPhoneNumber2] = useState("");

  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOption1, setSelectedOption1] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showCustomInput1, setShowCustomInput1] = useState(false);
  const [showCustomInput2, setShowCustomInput2] = useState(false);

  const handleMailChange = (e) => {
  const verify = e.target.value.toLowerCase();
  setmail(verify);

  // Validate email
  if (!verify.includes('@') || !verify.includes('.com')) {
    setErrorMessage('Email must include "@" and ".com"');
  } else {
    setErrorMessage('');
  }
  }

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    if (e.target.value === 'Others') {
      setorgtype('');
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setorgtype(e.target.value); // Set the selected value for School, College, and Industry
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setpin(value);
    }
  };

  const handleOptionChange1 = (e) => {
    setSelectedOption1(e.target.value);
    if (e.target.value === 'Others') {
      setorgtype('');
      setShowCustomInput1(true);
    } else {
      setShowCustomInput1(false);
      sethear(e.target.value); // Set the selected value for School, College, and Industry
    }
  };

  const handleOptionChange2 = (e) => {
    setSelectedOption2(e.target.value);
    if (e.target.value === 'Others') {
      setorgtype('');
      setShowCustomInput2(true);
    } else {
      setShowCustomInput2(false);
      setStates(e.target.value); // Set the selected value for School, College, and Industry
    }
  };
  
  const checkFields = () => {
    if (orgname.trim()) removeErrorBorder('OrgInput');
  else addErrorBorder('OrgInput');

  if (orgtype.trim()) removeErrorBorder('OrgtypeInput');
  else addErrorBorder('OrgtypeInput');

  if (mail.trim() && mail.includes('@') && mail.endsWith('.com')) removeErrorBorder('emailInput');
  else addErrorBorder('emailInput');

  if (orgphone.trim()) removeErrorBorder('OrgphoneInput');
  else addErrorBorder('OrgphoneInput');

  if (Addresss.trim()) removeErrorBorder('addressInput');
  else addErrorBorder('addressInput');
  
  if (city.trim()) removeErrorBorder('cityInput');
  else addErrorBorder('cityInput');
  
  if (States.trim()) removeErrorBorder('stateInput');
  else addErrorBorder('stateInput');

  if (pin.trim()) removeErrorBorder('pinInput');
  else addErrorBorder('pinInput');

  if (gst.trim()) removeErrorBorder('gstInput');
  else addErrorBorder('gstInput');

  if (student.trim()) removeErrorBorder('studInput');
  else addErrorBorder('studInput');

  if (staff.trim()) removeErrorBorder('staffInput');
  else addErrorBorder('staffInput');

  if (regnumber.trim()) removeErrorBorder('orgregInput');
  else addErrorBorder('orgregInput');

  // if (uploaddoc.trim()) removeErrorBorder('fileUpdateInput');
  // else addErrorBorder('fileUpdateInput');

  if (hear.trim()) removeErrorBorder('hearInput');
  else addErrorBorder('hearInput');

  };
  


  const addErrorBorder = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add('text-danger');
    }
  };
  
  const removeErrorBorder = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove('text-danger');
    }
  };
  

  const handleMailChange1 = (e) => {
    const verify = e.target.value.toLowerCase();
    setmail1(verify);

    // Validate email
    if (!verify.includes('@') || !verify.includes('.com')) {
      setErrorMessage('Email must include "@" and ".com"');
    } else {
      setErrorMessage('');
    }
  };

  const handleFile = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    
    // Define allowed file types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  
    // Check if the selected file type is allowed
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      reader.onload = () => {
        const base64Data = reader.result;
        if (selectedFile.size <= 2 * 1024 * 1024) { // Check if file size is within 2MB
          setFile(base64Data);
          setErrorMessage1('');
        } else {
          setFile(null);
          setErrorMessage1('File size exceeds 2MB limit');
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setErrorMessage1('Only PDF, JPG, JPEG, and png file types are allowed.');
    }
  };
  

  const handleFileIconClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleChange1 = (value) => {
    console.log("Phone Input 1 Value:", value);
    setPhoneNumber1(value);
    setValid1(validatePhoneNumber(value));
    setValid1(value.trim() !== '');
    
  };

  const handleChange2 = (value) => {
    setPhoneNumber2(value);
    setValid2(validatePhoneNumber1(value));
    setValid2(value.trim() !== '');
  };


  const validatePhoneNumber = (phoneNumber1) => {
    // Remove any non-digit characters (optional, depending on your requirements)
    const cleanedPhoneNumber = phoneNumber1.replace(/\D/g, '');
    
    // Check if the phone number has at least 10 digits
    if (cleanedPhoneNumber.length < 12) {
      return false; // Phone number is invalid
    }
  
    // Validate the phone number using the pattern
    const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern.test(phoneNumber1);
  };

  const validatePhoneNumber1 = (phoneNumber2) => {
    // Allow empty phone numbers
    if (!phoneNumber2) {
      return true;
    }
    const cleanedPhoneNumber = phoneNumber2.replace(/\D/g, '');
    
    // Check if the phone number has at least 10 digits
    if (cleanedPhoneNumber.length < 12) {
      return false; // Phone number is invalid
    }
  
    // Validate the phone number using the pattern
    const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern.test(phoneNumber2);
  };

  const handleCityChange = (e) => {
    const value = e.target.value;

    // Only allow letters
    if (/^[A-Za-z\s]*$/.test(value)) {
      setcity(value);
    }
  };


 
  const toggleHideBlockContainer = () => {
    setShow(!show);
  };
  
  const handleSubmit1 = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('orgname', orgname);
      formData.append('orgtype', orgtype);
      formData.append('mail', mail);
      formData.append('phoneNumber1', phoneNumber1);
      formData.append('Addresss', Addresss);
      formData.append('States', States);
      formData.append('pin', pin);
      formData.append('gst', gst);
      formData.append('student', student);
      formData.append('staff', staff);
      formData.append('regnumber', regnumber);
      formData.append('file', file);
      formData.append('city', city);
      formData.append('hear', hear);
      formData.append('name', name);
      formData.append('designation', designation);
      formData.append('mail1', mail1);
      formData.append('phoneNumber2', phoneNumber2);
    


      const formArray = [];
      formArray.push(orgname);
      formArray.push(orgtype);
      formArray.push(mail);
      formArray.push(phoneNumber1)
      formArray.push(Addresss);
      formArray.push(States);
      formArray.push(pin);
      formArray.push(gst);
      formArray.push(student);
      formArray.push(staff);
      formArray.push(regnumber);
      formArray.push(file);
      formArray.push(city);
      formArray.push(hear);
      formArray.push(name);
      formArray.push(designation);
      formArray.push(mail1);
      formArray.push(phoneNumber2)
      
      setUserObj([...formArray,userObj]);
      console.log('form data',userObj);
      console.log('Organization from user object', userObj[3]);
      const userData = {
        organization_name:orgname,
        organization_type:orgtype,
        email_id:mail,
        oraganization_mobile_no:phoneNumber1,
        address:Addresss,
        state:States,
        pincode:pin,
        gst_number:gst,
        count_of_student:student,
        count_of_staff:staff,
        organization_register_no:regnumber,
        upload_doc:file,
        city:city,
        how_hear_us:hear,
        contact_name:name,
        designation:designation,
        contact_email_id:mail1,
        contact_mobile_no:phoneNumber2
      }
     
  } catch (error) {
    console.error('Error:', error);
    setErrorMessage('Please enter all mandatory fields(*)');
  }
  };

  const handleValidation = async (e) => {
    e.preventDefault();
    const userDatas = {
      email_id: mail,
      organization_mobile_no: phoneNumber1,
    };
  
    try {
      // API call using fetch
      const response = await fetch(`${baseApiUrl}/check_email_mobileNumber`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDatas)
      });
  
   
  
      // Parsing the JSON response
      const responseData = await response.json();
  
      // Checking response status
      if (responseData.result == 'failure') {
        setErrorMessage(responseData.error);
        return;
      } else {
        alert(responseData.message);
        navigate('/otp', {
          state:
          {
            mobile:phoneNumber1,
          }
        });
      }
  
      console.log('API Response:', responseData);
      console.log('Organization mobile number from response:', responseData.oraganization_mobile_no);
    } catch (error) {
      // Handle errors here
      console.error('There was an error with the fetch operation:', error);
      setErrorMesage('An error occurred. Please try again later.');
    }
  };
  


  const handleFormSubmit = (e) => {
  checkFields(e);
  setIsClicked(true);
  setErrorMessage('');
  if (orgname.trim() && orgtype.trim() && mail.trim() && phoneNumber1.trim() && 
  Addresss.trim() && States.trim() && city.trim() && pin.trim() && gst.trim() && student.trim() && staff.trim() 
  && regnumber.trim() && hear.trim())
 {

  if (!validatePhoneNumber(phoneNumber1)) {
    setErrorMessage('Please enter a valid organization mobile number.');
    return; // Prevent submission if phone number is invalid
  }

  if (!validatePhoneNumber1(phoneNumber2)) {
    setErrorMessage('Please enter a valid contact mobile number.');
    return; // Prevent submission if phone number is invalid
  }

  if (!file) {
    setErrorMessage('Please upload a document before proceeding.');
    return ;
  }

  
   
  handleSubmit1(e);
  handleValidation(e);
  
  }

  };


  const handleGstChange = (e) => {
    const value = e.target.value;

    // Allow input only if the length is 15 or fewer characters
    if (value.length <= 15) {
      setgst(value);
    }
  };

  const handleStudentChange = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/[^0-9]/g, '');
    if (numericInput.length <= 7) {
      setstudent(numericInput);
    }
  };

  const handleStaffChange = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/[^0-9]/g, '');
    if (numericInput.length <= 7) {
      setstaff(numericInput);
    }
  };

  return (
    <div className="register-main-container">
      <div className="register-left-container">
        <img src={logo} alt="Login"  className="register-left-image" />
      </div>
      <div className="register-rightmain-container">
      <div className="register-rightsubmain-container">
      <div className="register-right-container">  
        <form>
              <h1 className="w-100 mt-5 fs-4 fw-bold">Self Register</h1>
              <p className="w-100 register-text">Please Give Your Organization Details</p>
              {errorMessage && <p className="text-danger mt-3 mb-n4">{errorMessage}</p>}
              <br/>
              <div className="w-100 d-md-flex d-sm-block mt-2">
                <div  className="w-md-50 w-sm-100">
                  <label className="register-label-field" id="OrgInput">Organization Name*</label>
                  <br />
                  <input
                    type="text"
                    value={orgname}
                    placeholder="Enter organization name"
                    className="register-orgname-field"
                    required
                    onChange={(e) => setorgname(e.target.value)}
                  />
                </div>
                <div  className="w-md-50 w-sm-100 signup-orgtype-container">
                  <label className="register-label-field" id="OrgtypeInput">Organization Type*</label>
                  <br />
                  <select className="register-orgtype-field-1 form-select colorchange" required value={selectedOption} onChange={handleOptionChange}>
                    <option value="" disabled selected>Select</option>  
                    <option value="School">School</option>
                    <option value="College">College</option>
                    <option value="Others">Others</option>
                  </select>
                  
        {showCustomInput && (
            <input className="register-input-field-others"
              type="text"
              placeholder="Please specify here..."
              onChange={(e) => setorgtype(e.target.value)}
                  value={orgtype}
            />
        )}
                </div>
              </div>      
            <div className="w-100 d-md-flex d-sm-block">
              <div className="w-md-50 w-sm-100">
                <label className="register-label-field"  id="emailInput">Email-ID*</label>
          <br/>
                <input
             className="register-input-field"
                  type="text"
                  value={mail}
                  placeholder="Enter Email id"
                  required
                  onChange={handleMailChange}
                />
              </div>
              <div  className="w-md-50 w-sm-100">
                <label  className={`register-label-field ${phoneNumber1 && 'text-dark'}`}  id="OrgphoneInput">
                  Organization Mobile Number*
                </label>
                <PhoneInput style={{zIndex:1}}
               
                      containerClass='reg-dummycls reg-mobilephone'
                      className="register-org-phone"
                      country={"in"}

                      value={phoneNumber1}
                      onChange={handleChange1}
                      inputProps={{
                        required: true,
                      }}
                    />
                {!valid && (
                  <p className="text-danger">
                    Please Enter a Valid Phone Number.
                  </p>
                )}
              </div>
            </div>
            <div className="w-100 d-md-flex d-sm-block">
              <div className="w-md-50 w-sm-100">
                <label className="register-label-field" id="studInput">Count of Students*</label>
                <br/>
                <input
                type="text"
                className="register-input-field"
                value={student}
                placeholder="Enter count of students"
                required
                onChange={handleStudentChange}
              />
              </div>

              <div className="w-md-50 w-sm-100">
                <label className="register-label-field" id="staffInput">Count of Staffs*</label>
                <br />
                <input
                className="register-input-field"
                type="text"
                onChange={handleStaffChange}
                value={staff}
                placeholder="Enter count of Staffs"
                required
              
              />
           
              </div>
            </div>

            <div className="w-md-100 w-sm-100">
              <label  className="signup-label-field"  id="gstInput"> GST Number*</label>
              <br />
              <input
                 className="signup-input-field"
                type="text"
                value={gst}
                placeholder="Enter GST number"
                required
                onChange={handleGstChange}
              />
            </div>

            <div className="w-100 d-md-flex d-sm-block">
              <div className="w-md-50 w-sm-100">
                <label className="register-label-field" id="orgregInput">
                  Organization Registration Number*
                </label>
                <br/> 
                <input
                className="register-input-field"
                  type="text"
                  value={regnumber}
                  placeholder="Enter organization registration number"
                  required
                  onChange={(e) => setregnumber(e.target.value)}
                />
              </div>
                   <div className="w-md-50 w-sm-100">
         <label
        className={`register-label-field ${isClicked && !file ? 'error-label' : 'success-label'}`}
        id="fileUpdateInput"
     >
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
      <div className="w-100 register-signup-uploadicon-container pos-relative" >
        <img
          src={upload}
          onClick={handleFileIconClick}
          className="register-imagelink-button pos-absolute"
        />
        {!file && (
          <span className="register-placeholder-text" id="fileInput">Upload file</span>
        )}
      </div>
      {file && (
        <span className="register-image-upload">
          <span className="register-upload-icon">
            <img
              src={success}
              alt="Upload Successfully"
              className="register-upload-image"
            />
          </span>
          <span className="register-upload-success">Upload Successful</span>
        </span>
      )}
    </form>
  </div>
  {errorMessage1 && <p className="signup-error-message text-danger mt-1 mb-n3">{errorMessage1}</p>}
  <br/>
</div>

         
    </div>

            <div  className="w-md-100 w-sm-100 mt-n4">
              <label className="signup-label-field" id="addressInput">Address*</label>
              <br />
              <input
              
  className="signup-input-field"
  type="text"
  value={Addresss}
  placeholder="Enter Address"
  required
  onChange={(e) => setAddresss(e.target.value)}
/>
            </div>
            <div className="w-100 d-md-flex d-sm-block">
            <div className="w-md-50 w-sm-100">
                <label className="register-label-field" id="cityInput">City*</label>
                <br />
                <input
                   className="register-input-field"
                  type="text"
                  value={city}
                  placeholder="Enter City"
                  required
                  onChange={handleCityChange}
                />
              </div>

              <div className="w-md-50 w-sm-100">
                <label className="register-label-field "  id="stateInput">State*</label>
                <br />      
<select
  className="register-orgtype-field form-select colorchange"  value={selectedOption2} onChange={handleOptionChange2}

>

  <option value="" disabled selected>Select State</option> 
  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
<option value="Andhra Pradesh">Andhra Pradesh</option>
<option value="Arunachal Pradesh">Arunachal Pradesh</option>
<option value="Assam">Assam</option>
<option value="Bihar">Bihar</option>
<option value="Chandigarh">Chandigarh</option>
<option value="Chhattisgarh">Chhattisgarh</option>
<option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
<option value="Delhi">Delhi</option>
<option value="Goa">Goa</option>
<option value="Gujarat">Gujarat</option>
<option value="Haryana">Haryana</option>
<option value="Himachal Pradesh">Himachal Pradesh</option>
<option value="Jharkhand">Jharkhand</option>
<option value="Karnataka">Karnataka</option>
<option value="Kerala">Kerala</option>
<option value="Lakshadweep">Lakshadweep</option>
<option value="Madhya Pradesh">Madhya Pradesh</option>
<option value="Maharashtra">Maharashtra</option>
<option value="Manipur">Manipur</option>
<option value="Meghalaya">Meghalaya</option>
<option value="Mizoram">Mizoram</option>
<option value="Nagaland">Nagaland</option>
<option value="Odisha">Odisha</option>
<option value="Puducherry">Puducherry</option>
<option value="Punjab">Punjab</option>
<option value="Rajasthan">Rajasthan</option>
<option value="Sikkim">Sikkim</option>
<option value="Tamil Nadu">Tamil Nadu</option>
<option value="Telangana">Telangana</option>
<option value="Tripura">Tripura</option>
<option value="Uttar Pradesh">Uttar Pradesh</option>
<option value="Uttarakhand">Uttarakhand</option>
<option value="West Bengal">West Bengal</option>

  <option value="Others">Others</option>
</select>
              </div>
            </div>



            <div className="w-100 d-md-flex d-sm-block">
            <div className="w-md-50 w-sm-100">
                <label className="register-label-field" id="pinInput">Pincode*</label>
                <br />
                <input
                   className="register-input-field"
                  type="text"
                  value={pin}
                  placeholder="Enter Pincode"
                  required
                  onChange={handlePinChange}
                />
              </div>

              <div className="w-md-50 w-sm-100">
                <label className="register-label-field" id="hearInput">How Did You Hear About Us*</label>
                <br />
                <select className="register-orgtype-field form-select colorchange" required value={selectedOption1} onChange={handleOptionChange1}>
                  <option value="" disabled selected>Select</option>
                  <option value="Youtube">Youtube</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Friend">Friend</option>
                   <option value="Marketing person">Marketing person</option>
                   <option value="Others">Others</option>
                </select>
                  {/* Render input field only if 'Others' is selected */}
                  {showCustomInput1 && (
         <input className="register-input-field-others"
           type="text"
           placeholder="Please specify here..."
           onChange={(e) => sethear(e.target.value)}
                value={hear}
         />
     )}
              </div>
            </div>
       
        </form>
        <img
          src={button}
          alt="Login"
          onClick={toggleHideBlockContainer}
          className="register-hide-button"
        />
        
            <div className="register-contact-field">
              <h1 className="w-100 mt-4 fs-3 fw-bold">Contact Person</h1>
              <p className="w-100 register-text">Please Enter Contact Person Details</p>
            </div>
            {show && (
              <div className="mt-0">
            <div >
              <label  className="mt-4 signup-label-field" id="contact-name">Name</label>
              <br />
              <input
                className="signup-input-field"
                type="text"
                value={name}
                onChange={(e) => setname(e.target.value)}
                placeholder="Enter Name"
                required
              />
            </div>
            <div>
              <label  className=" mt-2 signup-label-field" id="contact-designation">Designation</label>
              <br />
              <input
                 className="signup-input-field"
                type="text"
                value={designation}
                onChange={(e) => setdesignation(e.target.value)}
                placeholder="Enter Designation"
                required
              />
            </div>
            <div className="w-100 d-md-flex d-sm-block">
              <div  className="w-md-50 w-sm-100">
                <label className="signup-label-field"  id="contact-emailInput">Email-id</label>
                <br />
                <input
                  className="register-input-field"
                  type="text"
                  value={mail1}
                  onChange={handleMailChange1}
                  placeholder="Enter Email-id"
                  required
                />
                 
              </div>
              <div  className="w-md-50 w-sm-100">
                <label className="register-label-field" id="contact-mobile">Mobile Number</label>
                <br />
                <div className="w-100">
                <PhoneInput
                          containerClass="reg-dummycls reg-mobilephone"
                          className="register-org-phone"
                          country={"in"}
                          value={phoneNumber2}
                          onChange={handleChange2}
                          inputProps={{
                            required: true,
                          }}
                        />
                  {!valid && (
                    <p className="error-message">
                      Please enter a valid phone number.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
   
        {errorMessage && <p className="text-danger mt-2 mb-n4">{errorMessage}</p>}
        <br/>
        <br/>
        <button id="nextButton" type="submit" className=" w-100 register-next-button" onClick={handleFormSubmit} >
            Next
            </button>
      </div>
      </div> {/* force over flow */}
      </div> {/* Scroll div*/}
      
    </div>
  );
};

export default SignUp;