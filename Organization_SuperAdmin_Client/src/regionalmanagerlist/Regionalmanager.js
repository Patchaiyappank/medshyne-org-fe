import React, { useEffect, useState } from "react";
import "./RegionalManager.css";
import avt from "../assest/defimg.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";


function AddRegionalManager({ initialEmail ="" }) {
  const [profileImg, setProfileImg] = useState();
  const { id } = useParams();
  const navigate = useNavigate();
  const [base64, setBase64] = useState("");
  const [errors, setErrors] = useState({});
  const { state } = useLocation();
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [currentErrorMessage, setCurrentErrorMessage] = useState("");
  const [salesExecutive, setSalesExecutive] = useState(null);
  const { mode = "add"} = location.state || {};
  const [touched, setTouched] = useState(false); 
  const [email, setEmail] = useState(initialEmail);
  const [errorMessage, setErrorMessage] = useState('');
  const [isValid, setIsValid] = useState(true);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [dobError, setDobError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");


  const pageMode = mode;
  

  const [formData, setFormData] = useState({
    profile: "",
    r_m_name: "",
    phone_number: "",
    qualification: "",
    e_mail: "",
    blood_group: "",
    gender: "",
    address: "",
    state: "",
    pincode: "",
    dob: "",
    password: "",
    confirmPassword: "",
    assign_area: "",
    assign_city: "",
    assign_state: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Track visibility

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, password: value });
    // Add password validation here if needed
  };

  const handlePhoneChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      phone_number: value,
    }));
  };

  const handleChangeOn = (e) => {
    const { name, value } = e.target;
    
    if (name === "dob") {
      const dobPattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
  
      if (!dobPattern.test(value)) {
        setDobError("Date of Birth must be YYYY-MM-DD.");
      } else {
        setDobError("");
      }
    }

    // Password validation
  if (name === "password") {
    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
    } else {
      setPasswordError("");
    }
  }

  // Confirm Password validation
  if (name === "confirmPassword" || (name === "password" && formData.confirmPassword !== "")) {
    if (formData.password !== value) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  }


    setFormData({
      ...formData,
      [name]: value,
    });

  };

  const handlePasswordChangeOn = (e) => {
    const { name, value } = e.target;
  

    // Password validation
    if (name === "password") {
      const hasUppercase = /[A-Z]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      
      if (value.length < 6 || !hasUppercase || !hasSpecialChar) {
        setPasswordError("Password must be at least 6 characters, one uppercase letter and one special character.");
      } else {
        setPasswordError("");
      }
    }

  // Confirm Password validation
  if (name === "confirmPassword" || (name === "password" && formData.confirmPassword !== "")) {
    if (formData.password !== value) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  }


    setFormData({
      ...formData,
      [name]: value,
    });

  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.r_m_name) tempErrors.r_m_name = "Name is required";
    if (!formData.phone_number)
      tempErrors.phone_number = "Mobile Number is required";
    if (!formData.e_mail) tempErrors.e_mail = "Email is required";
    if (!formData.gender) tempErrors.gender = "Gender is required";
    if (!formData.blood_group)
      tempErrors.blood_group = "blood group is required";
    if (!formData.qualification)
      tempErrors.qualification = "qualification is required";
    if (!formData.address) tempErrors.address = "Address is required";
    if (!formData.state) tempErrors.state = "required";
    if (!formData.pincode) tempErrors.pincode = "required";
    if (!formData.dob) tempErrors.dob = "DOB is required";
    if (!formData.password) tempErrors.password = "Password is required";
    if (!formData.confirmPassword) tempErrors.confirmPassword = "Confirm Password is required";
    if (!formData.assign_area)
      tempErrors.assign_area = "Assign Area is required";
    if (!formData.assign_city)
      tempErrors.assign_city = "Assign City is required";
    if (!formData.assign_state)
      tempErrors.assign_state = "Assign State is required";
    if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  useEffect(() => {
    if (mode === "edit" && id) {
      fetchRMDetails(id);
    }
  }, [mode, id]);

  const fetchRMDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/superAdmin_view_r_m_by_id/${id}`
      );
      const executiveData = response.data[0];
      setSalesExecutive(executiveData);
      setFormData({
        ...formData,
        profile: executiveData.profile || "",
        r_m_name: executiveData.r_m_name || "",
        phone_number: executiveData.phone_number || "",
        qualification: executiveData.qualification || "",
        e_mail: executiveData.e_mail || "",
        blood_group: executiveData.blood_group || "",
        gender: executiveData.gender || "",
        state: executiveData.state || "",
        pincode: executiveData.pincode || "",
        address: executiveData.address || "",
        assign_area: executiveData.assign_area || "",
        assign_city: executiveData.assign_city || "",
        assign_state: executiveData.assign_state || "",
        dob: executiveData.formate_dob || '',
        password: executiveData.password || '',
        confirmPassword: executiveData.password || '',
      });
    } catch (error) {
      console.error("Error fetching Regional Manager details:", error);
      setCurrentErrorMessage("Failed to load Regional Manager details.");
    }
  };

  const handleSubmit = async () => {
    
    if (!validate()) {
      return;
    }
    if (mode === "add") {
      try {
        const imageBase64 = formData.profile instanceof File ? await toBase64(formData.profile) : formData.profile;
        const updatedFormData = { ...formData, profile: imageBase64 };

        const response = await fetch(
          `http://localhost:5000/superAdmin_addRegionalManager`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFormData),
          }
        );
        console.log(updatedFormData);
        if (response.ok) {
          alert("Regional Manager added successfully!");
          navigate("/regional");
        } else {
          alert("An error occurred while adding the Regional Manager.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing the request.");
      }
      if (formData.password !== formData.confirmPassword) {
        setErrors("Passwords match, form can be submitted");
      } else {
        setErrors("");

        console.log("Passwords match, form can be submitted");
      }
    } else if (mode === "edit" && id) {
      try {
        const response = await axios.put(
          `http://localhost:5000/superAdmin_editRegionalManager/${id}`,
          formData
        );

        if (response.status === 200) {
          alert("Successfully Updated  Regional Manager");
          navigate(`/regional-manager/${id}`);
        } else {
          alert("Failed to update Regional Manager.");
        }
      } catch (error) {
        console.error(
          "There was an error updating the Regional Manager!",
          error
        );
        alert("Failed to update Regional Manager.");
      }
    }
  };

  const validates = () => {
    handleSubmit();
    // if (!file) {
    //   console.error("Please upload a document before proceeding.");
    //   alert("Please upload a document before proceeding.");
    //   return;
    // }

  };

  const handleFile = async (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      if (selectedFile.size <= 2 * 1024 * 1024) {
        try {
          const base64Data = await toBase64(selectedFile);
          setFile(base64Data); // Optionally store it in state
          setFormData({ ...formData, profile: base64Data }); // Store it in your form data
          setCurrentErrorMessage("");
        } catch (error) {
          console.error("Error converting file to Base64:", error);
        }
      } else {
        setFile(null);
        setCurrentErrorMessage("File size exceeds 2MB limit");
      }
    } else {
      setFile(null);
      setCurrentErrorMessage(
        "Only PDF, JPG, JPEG, and PNG file types are allowed."
      );
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // This method includes the "data:image/png;base64,..." prefix
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleClick = () => {
    document.getElementById("profile-input").click();
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

  const handleNameInput = (e) => {
    let value = e.target.value;
  
    // Trim leading whitespace
    value = value.replace(/^\s+/, "");
  
    // Check for invalid characters (only allow letters and spaces)
    if (/[^A-Za-z\s]/.test(value)) {
      setNameError("Only letters and spaces are allowed.");
    } else {
      setNameError("");
    }
  
    // Remove invalid characters
    value = value.replace(/[^A-Za-z\s]/g, "");
    
    setName(value); 
  };
  
  const handleEmailInput = (e) => {
    const email = e.target.value.toLowerCase();
    setFormData({ ...formData, e_mail: email });
    
    // Validate email
    if (!email.includes('@') || !email.includes('.com')) {
      setEmailError('Email must include "@" and ".com"');
    } else {
      setEmailError('');
    }
  };
  
  

  // const handleMailChange = (e) => {
  //   const verify = e.target.value.toLowerCase();
  //   setEmail(verify);
  
  //   // Validate email
  //   if (!verify.includes('@') || !verify.includes('.com')) {
  //     setErrorMessage3('Email must include "@" and ".com"');
  //   } else {
  //     setErrorMessage3('');
  //   }
  //   }
  

  const handlemobileInput = (value) => {
    if (value.replace(/\D/g, '').length !== 12) {
      setMobileError("Mobile Number must be exactly 10 digits.");
    } else {
      setMobileError("");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only perform the validation if the email has been changed
      if (email && email !== initialEmail) {
        axios.post('http://localhost:5000/check_duplicate', { email })
          .then(response => {
            setIsValid(true);
            setErrorMessage('');
            setEmailError('');
          })
          .catch(error => {
            console.error('API error:', error);
            if (error.response) {
              if (error.response.status === 409) {
                setIsValid(false);
                setErrorMessage('Email Already Exists');
                setEmailError('');
              } else {
                setIsValid(false);
                setErrorMessage('Error: ' + (error.response.data.error || 'An unexpected error occurred.'));
              }
            } else if (error.request) {
              setIsValid(false);
              setErrorMessage('No response from server.');
            } else {
              setIsValid(false);
              setErrorMessage('Request setup error: ' + error.message);
            }
          });
      } else {
        // Clear errors if the email matches the initial email
        setIsValid(true);
        setEmailError('');
        setErrorMessage('');
      }
    }, 500); // Debounce for 500ms
  
    return () => clearTimeout(timer);
  }, [email, initialEmail]); // Depend on both email and initialEmail
  

  return (
    <div
      className="overall-addRM"
      style={{ backgroundColor: "#F9F9F9", height: "100%" }}
    >
      <br />
      <h3 className="addRM">
        &nbsp;&nbsp;{pageMode === "add" ? "Add" : "Edit"} Regional manager{" "}
      </h3>
      <hr className="custom-hr2" />
  
      <div
        className="addRM-content"
        style={{ marginLeft: "21px", marginTop: "0px" }}
      >
        <div className="row mt-3">
          <div className="col-sm-12 custom-mobile-col">
            <div
              className="p-4 rmdetailhead"
              style={{ marginTop: "0px", marginLeft: "-20px", fontSize: "18px", color: "#212121" }}
            >
              Regional manager Details
            </div>
          </div>
        
          <hr className="custom-hr3" />
        </div>
        <div className="row mt-3">
          <div className="col-sm-4 custom-mobile-col">
            <div className="p-3 pic-avt">
              <div style={{ width: "75%", height: "75%" }}>
                <input
                  type="file"
                  onChange={handleFile}
                  id="profile-input"
                  style={{ display: "none" }} // Hide the file input
                />
                {formData.profile ? (
                  <img
                    src={typeof formData.profile === 'string' ? formData.profile : URL.createObjectURL(formData.profile)}
                    name="profile"
                    value={formData.profile}
                    alt="Uploaded file preview"
                    width={250}
                    height={220}
                    style={{ borderRadius: "25px" }}
                  />
                ) : (
                  <img
                    src={avt}
                    name="profile"
                    value={formData.profile}
                    alt="Uploaded file preview"
                    width={250}
                    height={250}
                    style={{ borderRadius: "25px" }}
                  />
                )}
                <button
                  onClick={handleClick}
                  className="pic-btn1"
                  style={{
                    width: "10%",
                    height: "40px",
                    position: "absolute",
                    backgroundColor: "#0089FF",
                    borderRadius: "30px",
                    marginLeft: "4.5%",
                    // marginBottom: "-20px",
                    marginTop: "-20px",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Upload
                </button>
                {currentErrorMessage && (
                  <p style={{ color: "red", marginTop: "10px" }}>
                    {currentErrorMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="col-sm-4 custom-mobile-col">
            <div className="p-3">
              <from>
              <label className={errors.r_m_name ? "text-danger" : "text-dark"}>
                RM Name*</label>
                <br />
                <input
                  value={formData.r_m_name}
                  name="r_m_name"
                  onInput={handleNameInput}
                  onChange={handleChangeOn}
                  placeholder=""
                  className="addRM-inputs"
                  type="text"
                  style={{ width: "300px" }}
                  required
                />
                {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
                <br />
                <br />
                <label
                  className={errors.qualification ? "text-danger" : "text-dark"}
                >
                  Qualification*
                </label>
                <br />
                <input
                  value={formData.qualification}
                  name="qualification"
                  onChange={handleChangeOn}
                  placeholder=""
                  className="addRM-inputs"
                  style={{ width: "300px" }}
                  required
                />{" "}
                <br />
                <br />
                <label
                  className={errors.blood_group ? "text-danger" : "text-dark"}
                >
                  Blood Group*
                </label>
                <br />
                
               <select
  value={formData.blood_group}
  className="custom-select inputStyle"
  name="blood_group"
  onChange={handleChangeOn}
  style={{
    width: "300px",
    height: "40px",
    padding: "0 30px 0 10px",  // Right padding space for custom arrow
    borderRadius: "10px",
    border: "1px solid #ECECECEE",
    backgroundColor: "#FFFFFF",
    outline: "none",
    appearance: "none", // Hide the default arrow
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><path d="M1 3.5l4 4 4-4" stroke="black" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "calc(100% - 10px) center", // Position the "v" symbol
    backgroundSize: "12px", // Size of the "v" symbol
    color: "#697077"
  }}
  id="options"
  required
>
  <option value="" disabled></option>
  <option value="A+">A+</option>
  <option value="A-">A-</option>
  <option value="B+">B+</option>
  <option value="B-">B-</option>
  <option value="O+">O+</option>
  <option value="O-">O-</option>
  <option value="AB+">AB+</option>
  <option value="AB-">AB-</option>
</select>
  
            
              </from>
            </div>
          </div>
          <div className="col-sm-4 custom-mobile-col">
            <div className="p-3">
              <from>
              <label className={errors.phone_number || mobileError ? "text-danger" : "text-dark"}>
  Mobile Number*
</label>
<br />
<PhoneInput
  placeholder=""
  className="inputStyle"
  country={"in"}
  name="phone_number"
  onInput={handlemobileInput}
  value={formData.phone_number}
  onChange={(value) => {
    handlePhoneChange(value);
    handlemobileInput(value);
  }}
  inputProps={{
    name: "phone_number",
    required: true,
    autoFocus: false,
  }}
  inputStyle={{
    width: "270px",
    height: "40px",
    borderRadius: "8px",
    outline: "none",
    paddingTop: "5px",
  }}
  buttonStyle={{
    border: "none",
    backgroundColor: "transparent",
  }}
  dropdownStyle={{
    borderRadius: "10px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  }}
/>
{mobileError && <p className="text-danger">{mobileError}</p>}
                <br />
                <label className={errors.e_mail || emailError ? "text-danger" : "text-dark"}>
  E-mail ID*
</label>
<br />

    <input
      value={formData.e_mail}
      name="e_mail"
      onBlur={() => setTouched(true)} // Set touched to true when input loses focus
      onChange={(e) => {
        const value = e.target.value;
        setFormData({ ...formData, e_mail: value });
        handleEmailInput(e); // Trigger email validation on input change
      }}
      placeholder=""
      className="addRM-inputs"
      type="email"
      style={{ width: "270px" }}
      required
    />
    {/* Show error only after input has been touched */}
    {emailError && <p className="text-danger" style={{ marginTop: "5px" }}>{emailError}</p>}


                <br />
                <br />
                <label className={errors.gender ? "text-danger" : "text-dark"}>
                  Gender*
                </label>
                <br />
                <select
                  value={formData.gender}
                  className="custom-select inputStyle"
                  name="gender"
                  onChange={handleChangeOn}
                  style={{
                    width: "270px",
    height: "40px",
    padding: "0 30px 0 10px",  // Right padding space for custom arrow
    borderRadius: "10px",
    border: "1px solid #ECECECEE",
    backgroundColor: "#FFFFFF",
    outline: "none",
    appearance: "none", // Hide the default arrow
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><path d="M1 3.5l4 4 4-4" stroke="black" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "calc(100% - 10px) center", // Position the "v" symbol
    backgroundSize: "12px", // Size of the "v" symbol
    color: "#697077"
                  }}
                  id="options"
                  required
                >
                  <option value="" disabled></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                </select>
              </from>
            </div>
          </div>
        </div>
        <from>
          <div className="row mt-5">
            <div className="col-sm-8 custom-mobile-col">
              <label className={errors.address ? "text-danger" : "text-dark"}>
                Address*
              </label>
              <br />
              <input
                value={formData.address}
                name="address"
                onChange={handleChangeOn}
                placeholder=""
                className="addRM-inputs addressleft"
                style={{ width: "630px" }}
                type=""
                required
              />
            </div>
            <div className="col-sm-4 custom-mobile-col">
              <div className="row">
                <div className="col-sm-3 custom-mobile-col">              
                  <label className={errors.state ? "text-danger" : "text-dark"}>
                    State*
                  </label>
                  <br />
                  <input
                    value={formData.state}
                    name="state"
                    onChange={handleChangeOn}
                    placeholder=""
                    className="addRM-inputs"
                    style={{ width: "135px" }}
                    type=""
                    required
                  />
                </div>
                <div
                  className="col-sm-3 custom-mobile-col pincodeleft"
                  style={{ marginLeft: "30px" }}
                >
                  <label
                    className={errors.pincode ? "text-danger" : "text-dark"}
                    style={{ marginLeft: "35px" }}
                  >
                    Pincode*
                  </label>
                  <br />
                  <input
                    value={formData.pincode}
                    name="pincode"
                    onInput={handlePininput}
                    onChange={handleChangeOn}
                    placeholder=""
                    className="addRM-inputs"
                    style={{ width: "130px", marginLeft: "35px" }}
                    type=""
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-sm-4 custom-mobile-col">
              <label className={errors.dob ? "text-danger" : "text-dark"}>
                Date Of Birth*
              </label>
              <br />

              <input
                value={formData.dob}
                name="dob"
                onChange={handleChangeOn}
                placeholder="Year-Month-Date"
                style={{ width: "280px" }}
                className="addRM-inputs"
                required
              />
              {dobError && <p style={{ color: 'red' }}>{dobError}</p>}

            </div>
            <div className="col-sm-4 custom-mobile-col">
      <label className={errors.password ? "text-danger" : "text-dark"}>
        New Password*
      </label>
      <br />
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <input
          value={formData.password}
          id="new-password"
          name="password"
          onChange={handlePasswordChangeOn}
          type={showPassword ? "text" : "password"} // Toggle between text/password
          placeholder=""
          style={{ width: "280px", marginLeft: "1px" }}
          className="addRM-inputs"
          required
        />
        {/* Eye icon */}
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
          }}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
      {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
    </div>

    <div className="col-sm-4 custom-mobile-col">
        <label className={errors.confirmPassword ? "text-danger" : "text-dark"}>
          Confirm Password*
        </label>
        <br />
    <div style={{ position: 'relative', display: 'inline-block' }}>
          <input
            value={formData.confirmPassword}
            placeholder=""
            onChange={handlePasswordChangeOn}
            type={showConfirmPassword ? "text" : "password"} // Toggle between text/password
            name="confirmPassword"
            id="confirm-password"
            className="addRM-inputs"
            style={{ width: "289px", marginRight: "50px" }}
            required
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: 'absolute',
              right: '60px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
            }}
          >
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        {confirmPasswordError && <p style={{ color: 'red' }}>{confirmPasswordError}</p>}
      
          </div>
          </div>
          <h5 className="areahead">Assign Area</h5>
          <div className="row mt-4">
            <div className="col-sm-4 custom-mobile-col">
              <label
                className={errors.assign_area ? "text-danger" : "text-dark"}
              >
                Area*
              </label>
              <br />
              <input
                value={formData.assign_area}
                name="assign_area"
                onChange={handleChangeOn}
                placeholder=""
                style={{ width: "280px" }}
                className="addRM-inputs"
                required
              />
            </div>
            <div className="col-sm-4 custom-mobile-col">
              <label
                className={errors.assign_city ? "text-danger" : "text-dark"}
              >
                City*
              </label>
              <br />
              <input
                value={formData.assign_city}
                name="assign_city"
                onChange={handleChangeOn}
                placeholder=""
                style={{ width: "280px", marginLeft: "1px" }}
                className="addRM-inputs"
                required
              />
            </div>
            <div className="col-sm-4 custom-mobile-col">
              <label
                className={errors.assign_state ? "text-danger" : "text-dark"}
              >
                State*
              </label>
              <br />
              <input
                value={formData.assign_state}
                placeholder=""
                onChange={handleChangeOn}
                name="assign_state"
                className="addRM-inputs"
                style={{ width: "289px", marginRight: "50px" }}
                required
              />
            </div>
            <br />
            <button
              className="btnz"
              style={{
                marginLeft: "68%",
                height: "35px",
                width: "289px",
                backgroundColor: "#0089FF",
                color: "white",
                borderRadius: "20px",
                border: "none",
                marginTop: "22px",
              }}
              onClick={validates}
            >
              Save
            </button>
          </div>
        </from>
      </div>
    </div>
  );
}
export default AddRegionalManager;