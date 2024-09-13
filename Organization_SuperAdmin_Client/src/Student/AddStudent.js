import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import PhoneInput from 'react-phone-input-2';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-input-2/lib/style.css';
import './Addstudent.css'; 
import add from "../assest/add.png";
import { useNavigate, useLocation } from "react-router-dom";
import upload from "../assest/export.png";
import success from "../assest/success.png"; 
// import upload from "../photos/export.png";
// import { MyContext } from "../ProjectContext";
// import success from "../photos/success.png"; // Custom CSS for additional styling

const AddStudent = () => {
    const [dob, setDob] = useState(null);
    const [phone, setPhone] = useState('');
    const [file, setFile] = useState();
    const [file1, setFile1] = useState();
    const [profile, setProfile] = useState(null);
    const [persons, setPersons] = useState([{ name: '', relation: '', mobileNumber: '' }]); // Initialize with one row
    const [showAddPersonButton, setShowAddPersonButton] = useState(true);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [selectedGender, setSelectedGender] = useState(null);
    const [state1, setState1] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [className, setClassName] = useState(null);
    const [division, setDivision] = useState(null);
    // const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
    const navigate = useNavigate();
    // const { getLoginCredentials, setLoginCredentials } = useContext(MyContext);
    const [getDLDepartment, setDLDepartment] = useState([]);
    const [mobileNumber, setMobileNumber] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [allergies, setAllergies] = useState(null);
    const [disease, setDisease] = useState(null);
    const [define1, setDefine1] = useState(null);
    const [define2, setDefine2] = useState(null);
    const [hcr, setHcr] = useState(null);
    const [DDLDepartment, setDDLDepartment] = useState([]);
    // const [selectOrganization, setSelectOrganization] = useState(() => {
    //   return getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
    // });
    const [idNumber, setIdNumber] = useState("");
    const { state } = useLocation();
  const { id_number } = state;
  const { mode } = state;
  const studentInduvidualID = Number(id_number);
  const [errors, setErrors] = useState({
    name: false,
    idNumber: false,
    address: false,
    className: false,
    division: false,
    selectedGender: false,
    state1: false,
    pinCode: false,
    bloodGroup: false,
    selectedDepartment: false,
    dob: false,
    mobileNumber: false,
  });
  
  const validateFields = () => {
    const newErrors = {};
  
    // Check if required fields are empty
    newErrors.name = !name;
    newErrors.idNumber = !idNumber;
    newErrors.address = !address;
    newErrors.className = !className;
    newErrors.division = !division;
    newErrors.selectedGender = !selectedGender;
    newErrors.state1 = !state1;
    newErrors.pinCode = !pinCode;
    newErrors.bloodGroup = !bloodGroup;
    newErrors.selectedDepartment = !selectedDepartment;
    newErrors.dob = !dob;
   
  
    setErrors(newErrors);
    
    // Return true if no errors
    return !Object.values(newErrors).includes(true);
  };
  
  const defaultOrganizationName = 'demo12 school';
 
  const pageMode = mode;


  let options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json;",
    },
  };
  

  useEffect(() => {
    fetch(`http://localhost:5000/get_studentprofile_by_id?id_number=${studentInduvidualID}`, options)
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
            // setSelectOrganization(defaultOrganizationName)
  
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
  
    
  }, [studentInduvidualID]);


  useEffect(() => {
    const fetchDropdownData = async () => {
        try {
            // Fetch designations
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
  

const handleSubmit = async () => {
    if (validateFields()) {
      if (pageMode === "new") {
        await insertData();
        navigate("/Main6");
      } else if (pageMode === "edit") {
        // Include updated parents in the payload
        var currentdate = new Date();
        let convetedDate = currentdate.toISOString().split("T")[0] + " " + currentdate.toTimeString().split(" ")[0];
  
        let putData = {
          organization_name: defaultOrganizationName,
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
          id: studentInduvidualID,
          current_health_report: file,
          past_health_report: file1,
          parents: persons, // Updated parents array
          updated_at: convetedDate,
        };
  
        const options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(putData),
        };
  
        fetch(`http://localhost:5000/superAdmin_updatestudent_by_id?organization_name=${defaultOrganizationName}`, options)
          .then((response) => response.json())
          .then((data) => {
            console.log("Updated Data : ", data);
            alert("Data Submitted");
          })
          .catch((err) => {
            console.log(err, "ERRRRRRRROR");
          });
      }
    }
  };
  

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
      organization_name: defaultOrganizationName,
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
      const response = await fetch(`http://localhost:5000/superAdmin_addStudent?organization_name=${defaultOrganizationName}`, {
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

const handleChange = (index, field, value) => {
    const newPersons = persons.map((person, i) => {
      if (i === index) {
        return { ...person, [field]: value };
      }
      return person;
    });
    setPersons(newPersons);
  };
  
  const handleChange2 = (index, value) => {
    const newPersons = persons.map((person, i) => {
      if (i === index) {
        return { ...person, mobileNumber: value };
      }
      return person;
    });
    setPersons(newPersons);
  };
  

const handleDelete = async () => {
    if (!idNumber) {
        alert("ID Number is required to delete the record.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/superAdmin_student_delete_btn?id_number=${idNumber}`, {
            method: 'PUT', // Assuming PUT method is correct for your delete operation
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            alert("Student record deleted successfully.");
            navigate("/Main6"); // Redirect or update state accordingly
        } else {
            alert(`Failed to delete record: ${data.message}`);
        }
    } catch (error) {
        console.error("Error deleting student record:", error);
        alert("An error occurred while trying to delete the record.");
    }
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
    
    const handlePersonChange = (index, field, value) => {
        const updatedPersons = [...persons];
        updatedPersons[index][field] = value;
        setPersons(updatedPersons);
    };
      
    const labelStyle = (hasError) => ({
      color: hasError ? 'red' : '#21272A',
      fontSize: '13px',
      fontWeight: '500',
    });
    
    
    const handleAddPerson = () => {
        setPersons([...persons, { name: '', relation: '', mobileNumber: '' }]);
        setShowAddPersonButton(false); // Hide the button after adding a row
    };

    return (
        <div className="container my-4">
            <div className="card  totalcard p-4">
                <Row className="align-items-center mt-1">
                    <Col md={6} className="text-start">
                        <h4 style={{ color: '#212121', fontSize: '20px' }} className="ms-5"> {pageMode === 'edit' ? 'Edit Student Details' : 'Add Student Details'}</h4>
                    </Col>
                    <Col md={6} className="text-end">
                    <Button
    style={{
        backgroundColor: "#E51837",
        borderColor: '#E51837',
        borderRadius: '20px',
        paddingRight: "40px",
        paddingLeft: "40px",
        height: '35px',
        paddingTop: '6px',
        fontSize: '12px'
    }}
    className="me-2"
    onClick={handleDelete} // Add the click handler here
>
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
                                <Form.Label style={labelStyle(errors.name)}>Name*</Form.Label>
                                    <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}} type="text" placeholder="Placeholder"  value={name}
        onChange={(e) => setName(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3 AddstaffIdnumber">
                                <Form.Label style={labelStyle(errors.idNumber)}>ID Number*</Form.Label>
                                    <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}} type="text" placeholder="Placeholder"  value={idNumber}
    onChange={(e) => {
      setIdNumber(e.target.value);
     // Clear error when user types
    }}
  />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                        <Form.Group className="mb-3">
                        <Form.Label style={labelStyle(errors.className)}>Class</Form.Label>
                            <Form.Select   value={className}

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
                    <Col md={3}>
                        <Form.Group className="mb-3">
                        <Form.Label style={labelStyle(errors.division)}>Division</Form.Label>
                            <Form.Select       value={division}
      onChange={(e) => {
        setDivision(e.target.value);
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
                            </Form.Select>
                        </Form.Group>
                    </Col>
                           
                        </Row>

                        {/* New Password, Confirm Password */}
                        <Row>
                            <Col md={9}>
                                <Form.Group className="mb-3 AddStaffpassword">
                                <Form.Label style={labelStyle(errors.address)}>Address</Form.Label>
                                    <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}   type="text"value={address}
    
      onChange={(e) => {
        setAddress(e.target.value);
   // Clear error when user types
      }} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                <Form.Label style={labelStyle(errors.selectedGender)}>Gender</Form.Label>
                                    <Form.Select  value={selectedGender}
      onChange={(e) => {
        setSelectedGender(e.target.value);
       
      }}
                                        style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}  
                                        as="select">
                                        <option>Select Gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Address, Gender */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                <Form.Label style={labelStyle(errors.state1)}>State</Form.Label>
                                    <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}  type="text"  value={state1}
      onChange={(e) => {
        setState1(e.target.value);
         // Clear error when user types
      }} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3 AddStaffpassword">
                                    
<Form.Label style={labelStyle(errors.pinCode)}>Pincode</Form.Label>
                                    <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}   type="text"  value={pinCode}
      
      onChange={(e) => {
        setPinCode(e.target.value);
       
      }} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>

              

                {/* Blood Group, Department, Designation */}
                <Row>
                    <Col md={4}>
                    <Form.Group className="mb-3">
                    <Form.Label style={labelStyle(errors.bloodGroup)}>Blood Group</Form.Label>
                            <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}   type="text" value={bloodGroup}
    
      onChange={(e) => setBloodGroup(e.target.value)}
    />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                        <Form.Label style={labelStyle(errors.selectedDepartment)}>Department</Form.Label>
                            <Form.Select   value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
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
                    <Col >
                        <Form.Group className="mb-3">
                        <Form.Label style={labelStyle(errors.dob)}>Date of Birth</Form.Label>                   <br></br>
                            <DatePicker 
                               selected={dob}
                               onChange={(date) => {
                                 setDob(date);
                                
                               }}
                                dateFormat="MMMM d, yyyy"
                                className="form-control datepickerstaffadd "
                              
                            />
                        </Form.Group>
                    </Col>
                    
                </Row>
                <Row>
          <Col md={4}>
          <Form.Group className="mb-3 custom-radio">
  <Form.Label style={{color:'#697077',fontSize:'13px',fontWeight:'500'}}>Allergies</Form.Label>
  <br></br>
  <div className="d-inline ">
    <Form.Check 
      inline
      label="Yes"
      name="allergies"
      type="radio"
      id="allergies-yes"
      value="yes"
      onChange={() => setAllergies("yes")}
      checked={allergies === "yes"}
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
              <Form.Control style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}  as="textarea" placeholder="Type your message..." value={define2}
                           
                            onChange={(e) => setDefine2(e.target.value)}
                           />
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
                <h5 className=""
                      
                      >
                        Parents Contact Details
                      </h5>
                      <Row>
                            <Col md={12}>
                            {persons.map((person, index) => (
  <Row key={index} className="mb-3">
    <Col md={4}>
      <Form.Group className="mb-3">
        <Form.Label style={{color:'#21272A',fontSize:'13px',fontWeight:'500'}}>Name</Form.Label>
        <Form.Control
          style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}
          type="text"
          value={person.parentName}
          onChange={(e) => handleChange(index, "parentName", e.target.value)}
          required
        />
      </Form.Group>
    </Col>
    <Col md={4}>
      <Form.Group className="mb-3">
        <Form.Label style={{color:'#21272A',fontSize:'13px',fontWeight:'500'}}>Relation</Form.Label>
        <Form.Select
          onChange={(e) => handleChange(index, "relation", e.target.value)}
          value={person.relation}
          required
          style={{boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.1)",border:"none",borderRadius:'8px'}}
        >
          <option>Select Relation</option>
          <option>Mother</option>
          <option>Father</option>
          <option>Guardian</option>
        </Form.Select>
      </Form.Group>
    </Col>
    <Col md={4}>
      <Form.Group className="mb-3">
        <Form.Label style={labelStyle(errors.mobileNumber)}>Mobile Number*</Form.Label>
        <PhoneInput
          country={"in"}
          value={person.mobileNumber}
          onChange={(value) => handleChange2(index, value)}
          inputProps={{ required: true }}
          inputStyle={{ boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)", border: "none", borderRadius: '8px' }}
        />
      </Form.Group>
    </Col>
  </Row>
))}
                            
                            </Col>
                        </Row>
                        <Row className="mt-4">
                    <Col md={6} className="text-start">
                        {showAddPersonButton && (
                            <Button 
                                 
                                onClick={handleAddPerson}
                                style={{backgroundColor:"white",color:"#0089FF", borderColor:' #0089FF', borderRadius: '20px', paddingRight: "100px", paddingLeft: "100px", height: '35px', paddingTop: '6px', fontSize: '12px' }}
                            >   <img src={add}  alt="Add Person Icon" style={{ width: '17px', height: '17px', marginRight: '8px' }} ></img>
                                Add Person
                            </Button>
                        )}
                    </Col>
                    <Col md={6} className="text-end">
                        <Button 
                            style={{ backgroundColor: "#007BFF", color:"white", borderColor: '#007BFF' ,borderRadius: '20px',  paddingRight: "120px", paddingLeft: "120px",height: '35px',paddingTop: '6px', paddingTop: '6px', fontSize: '12px' }}
                            className="me-2" onClick={handleSubmit}
                        >
                            Save
                        </Button>
                    </Col>
                </Row>

   
        
      </div>
    </div>
               
    );
};

export default AddStudent;