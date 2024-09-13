import React, { useState, useEffect, useContext } from "react";
// import "../stafflist/StaffDetails.css";
 import "../studentlist/StudentDetails.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom";
import upload from "../photos/export.png";
import success from "../photos/success.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import add from "./add.png";
import defaultAvatar from "../photos/blankprofile.webp"
import { MyContext } from "../ProjectContext";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the necessary CSS


const StudentDetailsForm = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const navigate = useNavigate();
  const { getLoginCredentials, setLoginCredentials } = useContext(MyContext);
  const [profile, setProfile] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [pastHealthReport, setPastHealthReport] = useState(null);
  const [currentHealthReport, setCurrentHealthReport] = useState(null);
  const [pastUploadStatus, setPastUploadStatus] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [state1, setState1] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [className, setClassName] = useState(null);
  const [division, setDivision] = useState(null);
  const [dob, setDob] = useState(null);
  const [bloodGroup, setBloodGroup] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [allergies, setAllergies] = useState(null);
  const [disease, setDisease] = useState(null);
  const [define1, setDefine1] = useState(null);
  const [define2, setDefine2] = useState(null);
  const [hcr, setHcr] = useState(null);

  const [currentFile, setCurrentFile] = useState(null);
const [pastFile, setPastFile] = useState(null);
const [currentErrorMessage, setCurrentErrorMessage] = useState('');
const [pastErrorMessage, setPastErrorMessage] = useState('');

  const [getDLDepartment, setDLDepartment] = useState([]);
  const [errors, setErrors] = useState({
    idNumber: false,
    name: false,
    address: false,
    gender: false,
    state1: false,
    pinCode: false,
    className: false,
    division: false,
    dob:false,
    department:false,
    mobileNumber:false
  });
 
  
  

  const [selectOrganization, setSelectOrganization] = useState(() => {
    return getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
  });
  const [idNumber, setIdNumber] = useState("");
  const [error, setError] = useState("");
  const { state } = useLocation();
  const { id_number } = state;
  const { mode } = state;
  const studentInduvidualID = Number(id_number);
  const [file, setFile] = useState();
  const [file1, setFile1] = useState();
  const [errorMessage1, setErrorMessage1] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [valid1, setValid1] = useState(true);
  const [valid2, setValid2] = useState(true);
  const [valid, setValid] = useState(true);
  const [parentName, setParentName] = useState("");
  const [relation, setRelation] = useState("");
  const [persons, setPersons] = useState([
    { studname: "", designation: "", mobileNumber: "", valid: true },
  ]);


  const validateFields = () => {
    const updatedErrors = {
      idNumber: !idNumber,
      name: !name,
      address: !address,
      gender: !selectedGender,
      state1: !state1,
      pinCode: !pinCode,
      className: !className,
      division: !division,
      dob: !dob,
      bloodGroup: !bloodGroup,
      department: !selectedDepartment,
      mobileNumber: !mobileNumber || !valid2, // Checks if mobile number is empty or invalid
    };
  
    setErrors(updatedErrors);
  
    // Return false if any field is invalid
    return !Object.values(updatedErrors).includes(true);
  };
  


  const handleChange2 = (index, value) => {
    const newPersons = persons.map((person, i) => {
      if (i === index) {
        return { ...person, mobileNumber: value };
      }
      return person;
    });
    setPersons(newPersons);
  
    // Assuming the country is "in" (India), which has a minimum length of 10 digits
    const isValidNumber = value.length >= 10; // Adjust this depending on the country code
    setValid2(isValidNumber);
  
    // Set the error state based on validity
    setErrors((prev) => ({
      ...prev,
      mobileNumber: !isValidNumber || value.trim() === "",
    }));
  };
  const handleAddPerson = () => {
    setPersons([
      ...persons,
      { studname: "", designation: "", mobileNumber: "", valid: true },
    ]);
  };

  const handleChange = (index, field, value) => {
    const newPersons = persons.map((person, i) => {
      if (i === index) {
        return { ...person, [field]: value };
      }
      return person;
    });
    setPersons(newPersons);
  };

  // alert('mode : '+ mode);
  const pageMode = mode;

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

  const handleRemoveProfilePicture = () => {
    // Reset the profile picture state
    setProfile(null);
    // Reset the input field value
    const inputField = document.getElementById("profilePicture");
    if (inputField) {
      inputField.value = null;
    }
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
    method: "GET",
    headers: {
      "Content-Type": "application/json;",
    },
  };

  useEffect(() => {
    fetch(`${baseApiUrl}/get_studentprofile_by_id?id_number=${studentInduvidualID}`, options)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data received from get_studentprofile_by_id: ", data);
        if (data.Result === "Success" && data.student) {
          const studentData = data.student;
          const parentData = data.parents;
  
          console.log("Student data: ", studentData);
  
          try {
            setProfile(studentData.profile);
            setDivision(studentData.division);
            setPinCode(studentData.pincode);
            setSelectedGender(studentData.gender);
            setSelectedDepartment(studentData.department);
            setBloodGroup(studentData.blood_group);
            setClassName(studentData.classes);
            setAllergies(studentData.allergies === 1 ? "yes" : "no");
            setDisease(studentData.any_disease === 1 ? "yes" : "no");
            setAddress(studentData.address);
            setIdNumber(studentData.id_number);
            setName(studentData.name);
            setHcr(studentData.hcr);
            setState1(studentData.state);
            setMobileNumber(studentData.mobile_number);
            setFile(studentData.current_health_report);
            setFile1(studentData.past_health_report);
  
            let tempDob = studentData.dob;
            let extractedDate = tempDob.split("T")[0];
            let dateArray = extractedDate.split("-");
            setDob(`${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`);
            setDefine1(studentData.allergies_define);
            setDefine2(studentData.any_disease_define);
            setSelectOrganization(selectOrganization.organization_name)
  
            // Set parent data
            if (parentData.length > 0) {
              const updatedPersons = parentData.map(parent => ({
                parentName: parent.name || '',
                relation: parent.relation || '',
                mobileNumber: parent.mobile_number || ''
              }));
              setPersons(updatedPersons);
            }
          } catch (excep) {
            console.log("Exception:", excep);
          }
        }
      })
      .catch((error) => console.log(error));
  
    fetch(`${baseApiUrl}/department_dropdown?organization_name=${selectOrganization}`, { mode: "cors" })
      .then((response) => response.json())
      .then((data12) => {
        console.log("DROPDOWN LIST: ", data12.data);
        setDLDepartment(data12.data);
      })
      .catch((error) => console.log(error));
  // }, [studentInduvidualID]);
    }, []);

  const handleSubmit = async () => {
    validateFields(); // Call validation function

    // Check if there are any errors
    const hasErrors = Object.values(errors).includes(true);
    if (hasErrors) {
        return; // Prevent submission if there are errors
    }

    // Prepare parent data in the required format
    const parents = persons.map((person) => ({
        parent_name: person.parentName,
        relation: person.relation,
        mobile_number: person.mobileNumber,
    }));

    if (pageMode === "new") {
        checkFields();

        if (name.trim() && idNumber.trim() && address.trim()) {
            await insertData();
            navigate("/Student");
        }
    }

    if (pageMode === "edit") {
        alert("edit data enabled");
        var currentdate = new Date();
        let convetedDate =
            currentdate.toISOString().split("T")[0] +
            " " +
            currentdate.toTimeString().split(" ")[0];

        let putData = {
            organization_name:selectOrganization,
            profile: profile,
            name: name,
            address: address,
            gender: selectedGender,
            state: state1,
            pincode: pinCode,
            classes: className,
            division: division,
            dob: dob,
            blood_group: bloodGroup,
            department: selectedDepartment,
            allergies: allergies === "yes" ? 1 : 0,
            allergies_define: define1,
            any_disease: disease === "yes" ? 1 : 0,
            any_disease_define: define2,
            mobile_number: mobileNumber,
            hcr: hcr,
            id_number: idNumber,
            id_number: studentInduvidualID,
            current_health_report: file,
            past_health_report: file1,
            parents: parents, // Include the parents array
            updated_at: convetedDate,
        };

        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...putData,
              organization_name: selectOrganization
          })
          
        };

        fetch(`${baseApiUrl}/updatestudent`, options)
            .then((response) => response.json())
            .then((data) => {
                console.log("Updated Data : ", data);
                alert("Data Submitted");
                navigate("/Student");
            })
            .catch((err) => {
                console.log(err, "ERRRRRRRROR");
            });
    }
};


  // const handleCurrentFile = (e) => {
  //   setCurrentHealthReport(e.target.files[0]);
  // };
  
  // const handlePastFile = (e) => {
  //   setPastHealthReport(e.target.files[0]);
  // };


  const insertData = async () => {
    console.log("insertDataActivated");

    const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const month = `${d.getMonth() + 1}`.padStart(2, "0");
        const day = `${d.getDate()}`.padStart(2, "0");
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    };

    // Prepare parent data in the required format
    const parents = persons.map((person) => ({
        parent_name: person.parentName || "", // Ensure these values are correctly populated
        relation: person.relation || "",
        mobile_number: person.mobileNumber || "",
    }));

    let putData = {
        organization_name: selectOrganization,
        profile: profile,
        name: name,
        address: address,
        gender: selectedGender,
        state: state1,
        pincode: pinCode,
        classes: className,
        division: division,
        dob: formatDate(dob),
        blood_group: bloodGroup,
        department: selectedDepartment,
        allergies: allergies === "yes" ? 1 : 0,
        allergies_define: define1,
        any_disease: disease === "yes" ? 1 : 0,
        any_disease_define: define2,
        hcr: hcr === "yes" ? 1 : 0,
        id_number: idNumber,
        current_health_report: file,
        past_health_report: file1,
        parents: parents, // Include the parents array
    };

    console.log("Request Payload: ", JSON.stringify(putData));

    try {
        const response = await fetch(`${baseApiUrl}/studentdetails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(putData),
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Data submitted successfully:", data);
        } else {
            console.error("Failed to submit data:", data);
        }
    } catch (error) {
        console.error("Error submitting data:", error);
    }
};



  const handleFileIconClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileIconClick1 = () => {
    document.getElementById("fileInput1").click();
  };

  const handleBackButtonClick = () => {
    navigate("/Student");
  };

  const checkFields = () => {
    if (name.trim()) removeErrorBorder("staffname");
    else addErrorBorder("staffname");

    if (idNumber.trim()) removeErrorBorder("staffidnumber");
    else addErrorBorder("staffidnumber");

    if (address.trim()) removeErrorBorder("staffaddress");
    else addErrorBorder("staffaddress");

    if (state1.trim()) removeErrorBorder("staffstate");
    else addErrorBorder("staffstate");
  };

  const addErrorBorder = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add("error-border");
    }
  };

  const removeErrorBorder = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove("error-border");
    }
  };


  const validatePhoneNumber1 = (phoneNumber) => {
    const phoneNumberPattern1 = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern1.test(phoneNumber);
  };

  const restrictNumberInput = (e) => {
    e.target.value = e.target.value.replace(/^\s+/, "");
    e.target.value = e.target.value.replace(/[0-9]/g, "");
  };
  const handleIdinput = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^\s+/, "");
    e.target.value = value;
  };
  const handleAddreAndDefineinput = (e) => {
    e.target.value = e.target.value.replace(/^\s+/, "");
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
  const handleClasInput = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    e.target.value = value;
  };
  const handleBloodInput = (e) => {
    let value = e.target.value;
    value = value.replace(/^\s+/, "");
    value = value.replace(/[^A-Za-z+-]/g, "");
    e.target.value = value;
  };
  const handleInputChange = (setter, field) => (e) => {
    setter(e.target.value);
    setErrors(prev => ({ ...prev, [field]: false }));
  };
  
  return (
    <div className="student-main">
      <button style={{fontSize:'13px'}}
        type="button"
      
        className="btn btn-outline-primary studentdetails-button-style"
        onClick={handleBackButtonClick}
      
      >Back
      </button>

      <div
        className="container mt-4 "
        
      >
        <div className="row">
          <div className="col-lg-8 col-md-12 col-sm-12 m-auto">
            <div className="row">
              <form>
                <div
                  className="card Studentdetailsmain_card-1"
                
                >
                  <div
                    className="card-body"
                    
                  >
                     <h4 style={{marginTop:"-10px",fontWeight:'600'}} className="ms-3">
        {pageMode === 'edit' ? 'Edit Student Details' : 'Add Student Details'}
      </h4>

                    <div className="col-sm-12">
                    <div
  className="row"
>

  <div className="d-flex align-items-center">
    <div className="me-3 mt-2 text-center">
      <img
        src={profile || defaultAvatar}
        alt="uploaded"
        className="rounded-circle"
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      />
    </div>
    <div style={{ paddingRight:'40px',borderRight: "1px solid #d3d3d361" }}   className="text-center mt-3">
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

<div className="col-sm-3 Studentdetailsfirst   form-group ms-2">
      <label className={`form-label ${errors.name ? 'error-label' : ''}`}     >
        Name*
      </label>
      <input
        type="text"
        placeholder="Name"
        className="form-control defaultchange"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
<div className="col-sm-3 Studentdetailsfirst form-group ms-5">
  <label
    className={`studentDetailschange form-label ${errors.idNumber ? 'error-label' : ''}`}
    id="staffidnumber"
  >
    ID Number*
  </label>
  <input
    id="idNumber"
    type="text"
    placeholder="ID Number"
    className={`form-control defaultchange ${errors.idNumber ? 'error-input' : ''}`}
    value={idNumber}
    onChange={(e) => {
      setIdNumber(e.target.value);
      setErrors(prev => ({ ...prev, idNumber: false })); // Clear error when user types
    }}
  />
</div>
  </div>
</div>
<hr style={{border:"1px solid #DDE1E6"}}></hr>

                      <div className="row ">
                      <div className="col-sm-8 StudentdetailsformAddress form-group">
    <label
      className={`studentDetailschange ms-1 form-label ${errors.address ? 'error-label' : ''}`}
      id="studentaddress"
    >
      Address*
    </label>
    <input
      type="text"
      placeholder="Address"
      className={`form-control defaultchange ${errors.address ? 'error-input' : ''}`}
      value={address}
      onInput={handleAddreAndDefineinput}
      onChange={(e) => {
        setAddress(e.target.value);
        setErrors(prev => ({ ...prev, address: false })); // Clear error when user types
      }}
    />
  </div>

  <div className="col-sm-4 form-group">
    <label
      className={`studentDetailschange form-label ${errors.gender? 'error-label' : ''}`}
      id="studentgender"
    >
      Gender*
    </label>
    <select
      className={`studentdetailsform-gender form-select defaultchange ${errors.selectedGender ? 'error-input' : ''}`}
      value={selectedGender}
      onChange={(e) => {
        setSelectedGender(e.target.value);
        setErrors(prev => ({ ...prev, selectedGender: false })); 
      }}
    >
      <option disabled selected>
        
      </option>
      <option>Male</option>
      <option>Female</option>
      <option>Other</option>
    </select>
  </div>
</div>


                      <div className="row">
                      <div className="col-sm-3 StudentdetailState form-group">
    <label
      className={`studentDetailschange ms-1 form-label ${errors.state1 ? 'error-label' : ''}`}
      id="studentstate"
    >
      State*
    </label>
    <input
      type="text"
      placeholder="State"
      className={`form-control defaultchange ${errors.state1 ? 'error-input' : ''}`}
      value={state1}
      onChange={(e) => {
        setState1(e.target.value);
        setErrors(prev => ({ ...prev, state1: false })); // Clear error when user types
      }}
      onInput={restrictNumberInput}
    />
  </div>
  <div className="col-sm-3 StudentdetailState form-group">
    <label
      className={`studentDetailschange form-label ${errors.pinCode ? 'error-label' : ''}`}
      id="studentpin"
    >
      Pincode*
    </label>
    <input
      type="text"
      placeholder="Pincode"
      className={`form-control defaultchange ${errors.pinCode ? 'error-input' : ''}`}
      value={pinCode}
      onInput={handlePininput}
      onChange={(e) => {
        setPinCode(e.target.value);
        setErrors(prev => ({ ...prev, pinCode: false })); // Clear error when user types
      }}
      required
    />
  </div>

 <div className="col-sm-3 StudentdetailState form-group">
    <label
      className={`studentDetailschange form-label ${errors.className ? 'error-label' : ''}`}
     
    >
      Class*
    </label>
    <select
      
      className={`classesstudent form-select defaultchange ${errors.className ? 'error-input' : ''}`}
      value={className}
 id="studentclass"
      onChange={(e) => {
        setClassName(e.target.value);
        setErrors(prev => ({ ...prev, className: false })); // Clear error when user types
      }}
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

  <div className="col-sm-3 StudentdetailState form-group">
    <label
      className={`studentDetailschange form-label ${errors.division ? 'error-label' : ''}`}
     
    >
      Division*
    </label>
    <select
      type="text"
      placeholder="Division"
       id="studentdivision"
      className={`classesstudent form-select defaultchange ${errors.division ? 'error-input' : ''}`}
      value={division}
      onChange={(e) => {
        setDivision(e.target.value);
        setErrors(prev => ({ ...prev, division: false })); // Clear error when user types
      }}
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
                      <div className="col-sm-6 Studentdetailsform col-md-4 form-group">
        <label
          className={`studentDetailschange ms-1 ${errors.dob ? 'error-label' : ''}`}
          id="studentdob"
        >
          Date Of Birth*
        </label>
        <DatePicker
          selected={dob}
          onChange={(date) => {
            setDob(date);
            setErrors((prev) => ({ ...prev, dob: false }));
          }}
          className={`form-control defaultchange ${errors.dob ? 'error-input' : ''}`}
          placeholderText="MM/dd/yyyy"
        />
      </div>



    <div className="col-sm-6 Studentdetailsform col-md-4 form-group">
    <label
      className={`studentDetailschange ${errors.bloodGroup ? 'error-label' : ''}`}
    >
      Blood Group*
    </label>
    <input
      type="text"
      placeholder="Blood group"
      className="form-control defaultchange"
      value={bloodGroup}
      onInput={handleBloodInput}
      onChange={(e) => setBloodGroup(e.target.value)}
    />
  </div>
  <div className="col-sm-6 col-md-4 form-group">
    <label
      htmlFor="inputState-department"
      className={`studentDetailschange form-label ${errors.selectedDepartment ? 'error-label' : ''}`}
    >  
      Department*
    </label>
    <div className="staffdetailsdepartmentgender">
      <select
        id="inputState-department"
        className="form-select defaultchange"
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
      >
        <option></option>
        {(Array.isArray(getDLDepartment) ? getDLDepartment : []).map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>
<div className="row ">
  <div className="col-sm ms-1">
    <label className="radio control-label form-label">Allergies</label>
    <br />
    <div className="form-check form-check-inline">
      <input
        className="form-check-input visually-hidden "
        type="radio"
        name="allergiesRadioOptions"
        id="allergiesYes"
        value="yes"
        onChange={() => setAllergies("yes")}
        checked={allergies === "yes"}
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
      <label
        className="form-check-label tick-label white form-label mb-2"
        htmlFor="allergiesNo"
      >
        No
      </label>
    </div>
  </div>

  <div className="col-sm ms-4 changestudent">
    <label className="radio control-label form-label"> Any Disease</label>
    <br />
    <div className="form-check form-check-inline ms-1">
      <input
        className="form-check-input visually-hidden"
        type="radio"
        name="diseaseRadioOptions"
        id="diseaseYes"
        value="yes"
        onChange={() => setDisease("yes")}
        checked={disease === "yes"}
      />
      <label
        className="form-check-label tick-label white form-label mb-1"
        htmlFor="diseaseYes"
      >
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
      <label
        className="form-check-label tick-label white form-label mb-2"
        htmlFor="diseaseNo"
      >
        No
      </label>
    </div>
  </div>
</div>

                      <div className="row">
                        <div className="col-sm-6 col-md-6  Staffdetailsform form-group">
                          <label className="studentDetailschange ms-1"
                          
                          >
                            Define
                          </label>
                          <textarea
                            type="text"
                            placeholder="Type your message..."
                            className="form-control defaultchange"
                            value={define1}
                            onInput={handleAddreAndDefineinput}
                            onChange={(e) => setDefine1(e.target.value)}
                          />
                        </div>
                        <div className="col-sm-6 col-md-6  Staffdetailsform form-group">
                          <label className="studentDetailschange"
                          
                          >
                            Define
                          </label>
                          <textarea
                            type="text"
                            placeholder="Type your message..."
                            className="form-control defaultchange"
                            value={define2}
                            onInput={handleAddreAndDefineinput}
                            onChange={(e) => setDefine2(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row">
  <div className="col-md-6">
    <label 
      style={{ color: '#21272A', fontSize: '13px' }} 
      className={`staff-signuplabel  ms-1 ${file ? 'success-label' : ''}`}
    >
      Current Health Report
    </label>
    <div className="d-flex align-items-center studentdetailsborderrstaf">
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
                <span
                  style={{ color: '#697077', fontSize: '13px', marginLeft: '-5px' }}
                  className="success-text"
                >
                  Upload Successful
                </span>
              </>
            ) : (
              <span
                style={{ color: '#697077', fontSize: '13px', marginLeft: '5px' }}
                className="upload-text"
              >
                Upload file
              </span>
            )}
          </span>
          <img
            src={upload}
            onClick={() => document.getElementById('fileInput').click()}
            className="signup-icon ms-2"
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
          />
        </div>
      </form>
    </div>
    {currentErrorMessage && <div style={{fontSize:'12px',color:'red'}} className=" mt-2">{currentErrorMessage}</div>}
  </div>

  <div className="col-md-6">
    <label
      style={{ color: '#21272A', fontSize: '13px', marginLeft: '4px' }}
      className={`staff-signuplabel ${file1? 'success-label' : ''}`}
    >
      Past Health Report
    </label>
    <div style={{ marginLeft: '2px' }} className="d-flex align-items-center borderrstafff">
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
                <span
                  style={{ color: '#697077', fontSize: '13px', marginLeft: '-5px' }}
                  className="success-text"
                >
                  Upload Successful
                </span>
              </>
            ) : (
              <span
                style={{ color: '#697077', fontSize: '13px', marginLeft: '5px' }}
                className="upload-text"
              >
                Upload file
              </span>
            )}
          </span>
          <img
            src={upload}
            onClick={() => document.getElementById('fileInput1').click()}
            className="signup-icon ms-2"
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
          />
        </div>
      </form>
    </div>
    {pastErrorMessage && <div style={{fontSize:'12px',color:'red'}} className=" mt-2">{pastErrorMessage}</div>}
  </div>
</div>

  
                      <h5 className="mt-3 ms-1"
                      
                      >
                        Parents Contact Details
                      </h5>

                      <div>
                        {persons.map((person, index) => (
                          <div key={index} className="person-form">
                            <div className="row">
                            <div className="col-sm-6 col-md-6 Studentdetailsform form-group">
        <label className="studentDetailschange ms-1">Name</label>
        <input
          className="form-control defaultchange ms-1"
          type="text"
          value={person.parentName}
          onChange={(e) => handleChange(index, "parentName", e.target.value)}
          placeholder="Enter Name"
          required
        />
      </div>
      <div className="col-sm-6 col-md-6 Studentdetailsform form-group">
        <label className="studentDetailschange ms-1">Relation</label>
        <input
          value={person.relation}
          type="text"
          className="form-control defaultchange"
          onChange={(e) => handleChange(index, "relation", e.target.value)}
          placeholder="Enter Relation"
          required
        />
      </div>

                            </div>
                            
                            <div className="row">
  <div className="col-sm-6 col-md-6 col-lg-6 form-group">
    <label
      className={`  ms-1  studentDetailschange ${errors.mobileNumber }`}
    >
      Mobile Number*
    </label>
    <br />
    <div>
      {/* <PhoneInput style={{borderRadius:"20px"}}
        containerClass="biginput phoneinputClasssignup"
        className={`mobilestaffff border defaultchange rounded-lg ml-1 ${errors.mobileNumber ? 'error-border' : ''}`}
        country={"in"}
        value={person.mobileNumber}
          onChange={(value) => handleChange2(index, value)}
        inputProps={{
          required: true,
        }}
      /> */}

<PhoneInput
  country={'in'}
  value={person.mobileNumber} 
  // Pass the correct value here
  style={{marginTop:'5px'}}
  onChange={(value) => handleChange2(index, value)}
  inputProps={{
    required: true,
  }}
  inputStyle={{ 
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)", 
      border: "none", 
      borderRadius: '8px' 
  }}/>
      {!valid2 && (
        <p className="error-message ms-1">
          Please enter a valid phone number.
        </p>
      )}
    </div>
  </div>

  <div className="col-sm-12 col-md-6 mb-3">
  <label>&nbsp;</label>
  <div className="">
    <button
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        width: "100%",
        zIndex: 1000,
        backgroundColor:'white',
        // Add other necessary styles
      }}
      className="studenttss-addperson ml-2"
      onClick={handleAddPerson}
    >
      <img
        src={add}
        className="add-studentparent"
        alt="Add person"
        style={{ marginRight: "10px" }} // Ensure image spacing
      />
      Add Person
    </button>
  </div>
</div>

                            </div>
                          </div>
                        ))}
                      </div>

                      <div  className="col-sm-12 ms-5" >
                      <button
    type="button"
    className="btn btn-primary submit-button  mt-3"
    onClick={handleSubmit}
  >
    Submit
  </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsForm;