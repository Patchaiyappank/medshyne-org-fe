import React, { useState ,useEffect, useContext} from "react";
import "./StaffDetails.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { BsUpload } from "react-icons/bs";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useNavigate,useLocation } from "react-router-dom";
import upload from "../photos/export.png";
import success from "../photos/success.png";
import defaultAvatar from "../photos/blankprofile.webp"
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { MyContext } from '../ProjectContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const StaffDetailsForm = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const {getLoginCredentials,setLoginCredentials} = useContext(MyContext);
  const [mobileNumber, setMobileNumber] = useState("");
  const [healthReport, setHealthReport] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [pastHealthReport, setPastHealthReport] = useState(null);
  const [currentHealthReport, setCurrentHealthReport] = useState(null);
  const [pastUploadStatus, setPastUploadStatus] = useState("");
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
  const [dob, setDob] = useState(null);
  const [bloodGroup, setBloodGroup] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [allergies, setAllergies] = useState(null);
  const [disease, setDisease] = useState(null);
  const [define1, setDefine1] = useState(null);
  const [define2, setDefine2] = useState(null);
  const [hcr, setHcr] = useState(null);
  const [getDDLDepartment,setDDLDepartment] = useState([]);
  const [getDDLDesignation,setDDLDesignation] = useState([]);
  const[organizationname,setOrganization_name]=useState("");
  const [idNumber, setIdNumber] = useState("");
  const [error, setError] = useState('');
  const {state} = useLocation();
  const {id_number} = state;
  const {mode} = state;
  const staffInduvidualID = Number(id_number);
  const [file, setFile] = useState();
  const [file1, setFile1] = useState();
  const [errorMessage1, setErrorMessage1] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [valid1, setValid1] = useState(true);
   const [organization_name, setOrganizationName]=useState([]);
  const [valid2, setValid2] = useState(true);
  const [valid, setValid] = useState(true);
  const [currentFile, setCurrentFile] = useState(null);
const [pastFile, setPastFile] = useState(null);
const [currentErrorMessage, setCurrentErrorMessage] = useState('');
const [pastErrorMessage, setPastErrorMessage] = useState('');
const [isSubmitted, setIsSubmitted] = useState(false);


 // alert('mode : '+ mode);
  const pageMode = mode;
  const [errors, setErrors] = useState({});
  
  const validateFields = () => {
    const newErrors = {};
  
    // Assuming 'in' country code requires 10 digits
    const requiredLength = 10; 
  
    if (NewPassword && CurrentPassword && NewPassword !== CurrentPassword) {
      newErrors.passwordMismatch = 'New Password and Confirm Password do not match';
    }
  
    if (!NewPassword) newErrors.newPassword = 'New Password is required';
    if (!CurrentPassword) newErrors.currentPassword = 'Current Password is required';
    if (!bloodGroup) newErrors.bloodGroup = 'Blood Group is required';
    if (!dob) newErrors.dob = 'Date of Birth is required';
    if (!selectedDepartment) newErrors.department = 'Department is required';
    if (!selectedDesignation) newErrors.designation = 'Designation is required';
    
    if (!mobileNumber || mobileNumber.length < requiredLength) {
      newErrors.mobileNumber = ` please enter a valid Mobile Number`;
    }
  
    if (!name) newErrors.name = 'Name is required';
    if (!idNumber) newErrors.idNumber = 'ID Number is required';
    if (!address) newErrors.address = 'Address is required';
    if (!className) newErrors.className = 'Class is required';
    if (!division) newErrors.division = 'Division is required';
    if (!selectedGender) newErrors.gender = 'Gender is required';
    if (!pinCode) newErrors.pinCode = 'Pin Code is required';
    if (!state1) newErrors.state = 'State is required';
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
// const [selectOrganization, setSelectOrganization] = useState(() => {
//   return getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
// });


const [selectOrganization, setSelectOrganization] = useState(() => {
  const storedOrganization = sessionStorage.getItem('organization');
  return storedOrganization ? storedOrganization : getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
});

useEffect(() => {
  sessionStorage.setItem('organization', selectOrganization);
}, [selectOrganization]);


// const [selectOrganization, setSelectOrganization] = useState(getLoginCredentials[0].organization_name);

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

  const handleCurrentFile = (e) => {
    const file = e.target.files[0];
    console.log("Current Health Report file:", file);
    setCurrentHealthReport(file);
  };
  
  

  const restrictNumberInput = (e) => {
    e.target.value = e.target.value.replace(/^\s+/, "");
    e.target.value = e.target.value.replace(/[0-9]/g, "");
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


  const handleFile = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
  
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      reader.onload = () => {
        const base64Data = reader.result;
        if (selectedFile.size <= 2 * 1024 * 1024) {
          setFile(base64Data);
          setCurrentErrorMessage('');
        } else {
          setFile(null);
          setCurrentErrorMessage('File size exceeds 2MB limit');
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setCurrentErrorMessage('Only PDF, JPG, JPEG, and PNG file types are allowed.');
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
          setPastErrorMessage('');
        } else {
          setFile1(null);
          setPastErrorMessage('File size exceeds 2MB limit');
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile1(null);
      setPastErrorMessage('Only PDF, JPG, JPEG, and PNG file types are allowed.');
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
   organization_name: selectOrganization,
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
const response = await fetch(`${baseApiUrl}/staffdetails`, {
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
    fetch(`${baseApiUrl}/get_staffprofile_by_id?id_number=${staffInduvidualID}`, options)
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
          setMobileNumber(result.mobile_number);
          setFile(result.current_health_report);
          setFile1(result.past_health_report);
  
          let extractedDate = String(result.dob).split('T')[0];
          setDob(extractedDate);
          setDefine1(result.allergies_define);
          setDefine2(result.any_disease_define);
        }
      })
      .catch(error => console.log(error));
  
    fetch(`${baseApiUrl}/designation_dropdown?organization_name=${selectOrganization}`, {mode: 'cors'})
      .then(response => response.json())
      .then(data12 => {
        console.log('DROPDOWN LIST : ', data12.data);
        setDDLDesignation(data12.data);
      })
      .catch(error => console.log(error));
     
    fetch(`${baseApiUrl}/department_dropdown?organization_name=${selectOrganization}`, {mode: 'cors'})
      .then(response => response.json())
      .then(data12 => {
        console.log('DROPDOWN LIST : ', data12.data);
        setDDLDepartment(data12.data);
      })
      .catch(error => console.log(error));
  }, []);
  

  const handleSubmit = async () => {
    setIsSubmitted(true); // Set to true to trigger error display
  
    const isValid = validateFields();
  
    if (!isValid) {
      return;
    }
  
    if (pageMode === 'new') {
      await insertData();
      navigate("/Staff");
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
        organization_name: organizationname,
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
  
      await fetch(`${baseApiUrl}/updatestaff`, options);
      alert('Data Submitted');
      navigate("/Staff");
    }
  };
  
  const handleInputChange = (e, setter) => {
    setter(e.target.value);
    // Optionally validate the field here if needed
  };
  
  
const handleFileIconClick = () => {
  document.getElementById('fileInput').click();
};


const handleFileIconClick1= () => {
  document.getElementById('fileInput1').click();
};

  const handleBackButtonClick = () => {
    navigate("/Staff"); 
  };

  useEffect(() => {
    console.log('Page Mode:', pageMode);
    console.log('Location State:', state);
  }, [pageMode, state]);
  

  


  const handleRemoveProfilePicture = () => {
    // Reset the profile picture state
    setProfile(null);
    // Reset the input field value
    const inputField = document.getElementById("profilePicture");
    if (inputField) {
      inputField.value = null;
    }
  };

  
  const addErrorBorder = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add('error-border');
    }
  };
  
  const removeErrorBorder = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove("error-border");
    }
  };

  const handleChange2 = (value) => {
    setMobileNumber(value);
    setValid2(validatePhoneNumber1(value));
    setValid2(value.trim() !== '');
  };

  const validatePhoneNumber1 = (phoneNumber) => {
    const phoneNumberPattern1 = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern1.test(phoneNumber);
  };



  return (
    <div className="staff-main">
 <button style={{fontSize:'12px',color:' #0089FF'}}
        type="button"
      
        className="btn btn-outline-primary staffdetails-button-style"
        onClick={handleBackButtonClick}
      
      >Back
      </button>
      <br></br>
    <div  className="container"  >
      
      <div className="row  mt-4 ms-3">
        <div className="col-lg-8 col-md-12 col-sm-12 m-auto">
          <div className="row">
            <form>
              <div className="card Studentdetailsmain_card-1">
                <div
                  className="card-body"
                  
                >
                  <h5 style={{marginTop:"-10px",fontWeight:'600'}} className="ms-3">
        {pageMode === 'edit' ? 'Edit Staff Details' : 'Add Staff Details'}
      </h5>
                  <div className="col-sm-12">
                  <div
  className="row"
>
  <div className="d-flex align-items-center">
    <div className="me-3 mt-2 text-center">
      <img
        src={profile|| defaultAvatar}
        alt="uploaded"
        className="rounded-circle"
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      />
    </div>
    <div style={{ paddingRight:'40px',borderRight: "1px solid #d3d3d361" }}   className="text-center mb-4">
  <label htmlFor="upload-button" className="btn btn-outline-primary uploadd-button">
    Upload Photo
  </label>
  <input 
    type="file"
    id="upload-button"
    style={{ display: "none" }}
    onChange={handleProfilePictureChange}
  />
  {pageMode === 'edit' && (
    <div style={{ marginTop: '-10px' }} className="ms-1 bluebutton">
      <button
        className="btn btn-link p-0"
        onClick={handleRemoveProfilePicture}
       
        style={{ color: "#001D6C" }}
      >
        remove
      </button>
    </div>
  )}
</div>
<div className="row">
                      <div className="col-sm-3 Staffdetailsfirst form-group ms-4">
                        <label className={`form-label  ${errors.name && isSubmitted  ? 'error-label' : ''}`} htmlFor="name">
                          Name*
                        </label>
                        <input
                          type="text"
                          placeholder="Name"
                          className={`form-control defaultchange ${errors.name ? 'error-input' : ''}`}
                          value={name}
                          onChange={(e) => handleInputChange(e, setName)}
                          id="name"
                        />
                      </div>
                      </div>
    <div className="col-sm-3 Staffdetailssecond form-group">
      <label className={`form-label ${errors.idNumber  && isSubmitted  ? 'error-label' : ''}`} id="staffidnumber">
        ID Number*
      </label>
      <input
        type="text"
        placeholder="ID Number"
        className="form-control defaultchange"
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
        readOnly={pageMode === 'edit'}
      />
      
    </div>
  </div>
</div>
<hr style={{border:"1px solid #DDE1E6"}}></hr>

                    <div className="row">
                    <div className="col-md-6 Staffdetailsform form-group">
  <label className={`form-label ${errors.newPassword  && isSubmitted  || errors.passwordMismatch ? 'error-label' : ''}`} id="newpass">New Password*</label>
  <div className="position-relative">
    <input
      type="password"
      placeholder="New password"
      className={`form-control defaultchange ${errors.newPassword || errors.passwordMismatch ? 'error-border' : ''}`}
      value={NewPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />
    {errors.newPassword && <small className="form-text erorpassword">{errors.newPassword}</small>}
    {errors.passwordMismatch && <small className="form-text erorpassword">{errors.passwordMismatch}</small>}
  </div>
</div>

<div className="col-md-6 Staffdetailsform form-group">
  <label className={`form-label ${errors.currentPassword  && isSubmitted  || errors.passwordMismatch ? 'error-label' : ''}`} id="confirmpass">Confirm Password*</label>
  <div className="position-relative">
    <input
      type="password"
      placeholder="Confirm password"
      className={`form-control defaultchange ${errors.currentPassword || errors.passwordMismatch ? 'error-border' : ''}`}
      value={CurrentPassword}
      onChange={(e) => setCurrentPassword(e.target.value)}
    />
    {errors.currentPassword && <small className="form-text erorpassword">{errors.currentPassword}</small>}
    {errors.passwordMismatch && <small className="form-text erorpassword ">{errors.passwordMismatch}</small>}
  </div>
</div>

                    </div>

                    <div className="row  " >
                      <div className="col-sm-8 StaffdetailsformAddress form-group">
                        <label  className={`form-label ${errors.address && isSubmitted  ? 'error-label' : ''}`} >Address*</label>
                        <input
                        id="staffaddress"
                          type="text"
                          placeholder="Address"
                          className="form-control defaultchange"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                      <div className="col-sm-4 mt-1 form-group ">
                        <label  className={`form-label defaultchange  ${errors.gender ? 'error-label' : ''}`} id="staffgender">
                          Gender*
                        </label>
                      
                          <select
                        
                            className="staffdetailsform-gender form-select defaultchange"
                            value={selectedGender}
                            onChange={(e) => setSelectedGender(e.target.value)}
                          >
                            <option disabled selected></option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Others</option>
                          </select>
                       
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-3 StaffdetailState form-group">
                        <label  className={`form-label ${errors.state  && isSubmitted  ? 'error-label' : ''}`} id="staffstate">State*</label>
                        <input
                          type="text"
                          placeholder="State"
                          className="form-control defaultchange "
                          value={state1}
                          onChange={(e) => setState1(e.target.value)}
                          onInput={restrictNumberInput}
                        />
                      </div>
                      <div className="col-sm-3 StaffdetailState form-group">
                        <label  className={`form-label ${errors.name  && isSubmitted  ? 'error-label' : ''}`} id="staffpin">Pincode*</label>
                        <input
                          type="text"
                          placeholder="Pincode"
                          className="form-control defaultchange"
                          onInput={handlePininput}
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                        
                          required
                        />
                      </div>
                      <div className="col-sm-3 StaffdetailState form-group">
                        <label  className={`form-label ${errors.className  && isSubmitted  ? 'error-label' : ''}`} >Class*</label>
                        <select
                      
                          placeholder="Class"
                          className=" classesstaff form-select form-control defaultchange"
                          id="staffclass"
                          value={className}

                          onChange={(e) => setClassName(e.target.value)}
                        >
                          <option disabled selected>
       
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
    </select>
                      </div>
                      <div className="col-sm-3   form-group">
                        <label  className={`form-label ${errors.division ? 'error-label' : ''}`} >Division*</label>
                        <select
                          type="text"
                          placeholder="Division"
                          id="staffdivision"
                          className=" classesstaff form-select form-control form-selct defaultchange"
                          value={division}
                         onChange={(e) => setDivision(e.target.value)}
                      
                       
                          
                        >
                          <option disabled selected>
       
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

    </select>
                      </div>
                    </div>
                    <div className="row">
      <div className="col-md-6 form-group">
        <label
          className={`form-label ${errors.dob && isSubmitted ? 'error-label' : ''}`}
          id="staffdob"
        >
          Date Of Birth*
        </label>
        <div className="position-relative">
          <DatePicker  style={{width:'120%'}}
            selected={dob} // Ensure it's null initially
            onChange={(date) => {
              setDob(date);
              setErrors((prev) => ({ ...prev, dob: false })); // Clear error when a date is selected
            }}
            placeholderText="MM/dd/yyyy"
            className={`form-control defaultchange staffdetailsdob  ${errors.dob && isSubmitted ? 'error-input' : ''}`}
            dateFormat="MM/dd/yyyy" // Set the format you prefer
          />
        </div>
      </div>
                      <div className="col-sm-6 col-md-6 Staffdetailsform form-group">
                        <label  className={`form-label ${errors.bloodGroup && isSubmitted  ? 'error-label' : ''}`}>Blood Group*</label>
                        <input
                          type="text"
                          placeholder="Blood group"
                          className="form-control defaultchange"
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                        />
                      </div>
                      <div className="row">
                      <div className="col-sm-6 col-md-6">
                        <label  className={`form-label ${errors.department ? 'error-label' : ''}`} htmlFor="inputState" >
                          Department*
                        </label>
                        <div className="staffdetailsdepartmentgender">
                          <select
                            id="inputState"
                            className="form-select defaultchange"
                            value={selectedDepartment}
                            onChange={(e) =>
                              setSelectedDepartment(e.target.value)
                            }
                          >
                            <option selected></option>
                            {getDDLDepartment.map((item,index)=>  <option key="index" > {item} </option>)}
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 ">
                        <label  className={`form-label ms-3 ${errors.designation ? 'error-label' : ''}`} htmlFor="inputState" >
                          Designation*
                        </label>
                        <div className=" ms-2">
                          <select
                            id="inputState"
                            className="form-select defaultchange staffdetailsdesigantiongender"
                            value={selectedDesignation}
                            onChange={(e) =>
                              setSelectedDesignation(e.target.value)
                            }
                          >
                            <option selected></option>
                            {getDDLDesignation.map((item,index)=>  <option key="index" > {item} </option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
      <div className="col-sm">
        <label className="radio control-label form-label ms-1">Allergies</label>
        <br />
        <div className="form-check form-check-inline ms-1">
    <input
        className="form-check-input visually-hidden"
        type="radio"
        name="allergiesRadioOptions"
        id="allergiesYes"
        value="yes"
        onChange={() => setAllergies("yes")}
        checked={ allergies === "yes"}// Ensure this is correctly bound
    />
    <label
        className="form-check-label tick-label white form-label mb-1"
        htmlFor="allergiesYes"
    >
        Yes
    </label>
</div>

<div className="form-check form-check-inline">
    <input
        className="form-check-input visually-hidden"
        type="radio"
        name="allergiesRadioOptions"
        id="allergiesNo"
        value="no"
        onChange={() => setAllergies("no")}
        checked={allergies === "no"}
    />
    <label className="form-check-label tick-label white form-label mb-1" htmlFor="allergiesNo">
        No
    </label>
</div>
      </div>

      <div className="col-sm ms-5">
        <label className="radio control-label form-label">Any Disease</label>
        <br />
        <div className="form-check form-check-inline">
    <input
        className="form-check-input visually-hidden"
        type="radio"
        name="diseaseRadioOptions"
        id="diseaseYes"
        value="yes"
        onChange={() => setDisease("yes")}
        checked={disease === "yes"}
    />
    <label className="form-check-label tick-label white form-label mb-1" htmlFor="diseaseYes">
        Yes
    </label>
</div>
<div className="form-check form-check-inline">
    <input
        className="form-check-input visually-hidden"
        type="radio"
        name="diseaseRadioOptions"
        id="diseaseNo"
        value="no"
        onChange={() => setDisease("no")}
        checked={disease === "no"}
    />
    <label className="form-check-label tick-label white form-label mb-1" htmlFor="diseaseNo">
        No
    </label>
</div>
</div>
    </div>

                    <div className="row mt-1">
                      <div className="col-sm-6 col-md-6 Staffdetailsform form-group">
                        <label className="form-label ms-1">Define</label>
                        <textarea
                          type="text"
                          placeholder="Type your message..."
                          className="form-control defaultchange"
                          value={define1}
                          onChange={(e) => setDefine1(e.target.value)}
                        />
                      </div>
                      <div   className="col-sm-6 col-md-6  Staffdetailsform Staffdetailsformnext form-group">
                        <label className="form-label ms-3">Define</label>
                        <textarea
                          type="text"
                          placeholder="Type your message..."
                          className="form-control defaultchange"
                          value={define2}
                          onChange={(e) => setDefine2(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
    <label style={{color:'#21272A',fontSize:'13px'}} className={`staff-signuplabel ${file ? 'success-label' : ''}`}>
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
    {currentErrorMessage && <div className="text-danger mt-2"  style={{fontSize:'12px'}}>{currentErrorMessage}</div>}
</div>

<div className="col-md-6">
    <label style={{color:'#21272A',fontSize:'13px', marginLeft: '4px'}} className={`staff-signuplabel ${file1 ? 'success-label' : ''}`}>
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
    {pastErrorMessage && <div className="text-danger mt-2 " style={{fontSize:'12px'}}>{pastErrorMessage}</div>}
</div>


<div className="row">
  <div className="col-sm-6 col-md-6 form-group ">
    <label className={`mobile-control-label form-label mt-3 ms-2 ${errors.mobileNumber ? 'error-label' : ''}`}>
      Mobile Number*
    </label>
    <br />
    <div>
     
      {/* <PhoneInput style={{zIndex:1}}
               
               containerClass='staff-dummycls staff-mobilephone'
               className="staffr-org-phone"
               country={"in"}

               value={mobileNumber}
               onChange={handleChange2}
               inputProps={{
                 required: true,
               }}
             /> */}
            <PhoneInput 
  country={'in'}
  value={mobileNumber}
  // Pass the correct value here
  style={{marginTop:'5px',zIndex:1, marginTop:'-20px'}}
  onChange={handleChange2}
  inputProps={{
    required: true,
  }}
  inputStyle={{ 
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)", 
      border: "none", 
      borderRadius: '8px' 
  }}/>
      {errors.mobileNumber && <p className= "error-message ms-1">{errors.mobileNumber}</p>}
    </div>
  </div>


              <div className="col-sm-6 mt-2 col-md-6">
  <label style={{ marginLeft: '25px' }} className="radio-control-label form-label mt-3 ">
    HCR
  </label>
  <div style={{ marginLeft: '25px' }} className="staff-radio-button">
    <div>
      <input
        className="form-check-input visually-hidden"
        type="radio"
        name="hcrOptions"
        id="hcrYes"
        value="yes"
        onChange={() => setHcr("yes")}
        checked={hcr === "yes"}  
      />
      <label className="form-check-label tick-label white form-label" htmlFor="hcrYes">
        Yes
      </label>
    </div>
    <div className="staff-No-radio-button">
      <input
        className="form-check-input visually-hidden"
        type="radio"
        name="hcrOptions"
        id="hcrNo"
        value="no"
        onChange={() => setHcr("no")}
        checked={hcr === "no"} 
      />
      <label className="form-check-label tick-label white form-label" htmlFor="hcrNo">
        No
      </label>
    </div>
  </div>
</div>




                     
                    </div>
                    <div className="col-sm-12 d-flex justify-content-end">
  <button
    type="button"
    className="btn btn-primary submit-button"
    onClick={handleSubmit}
  >
    Submit
  </button>
</div>

                  </div>
                </div>

                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <br></br>
    </div>

     
   
  );
};

export default StaffDetailsForm;