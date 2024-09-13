import React, { useEffect, useState } from "react";
import './stock.css'
import avt from '../assest/defimg.png'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams, useLocation } from "react-router-dom";

function AddSalesExcutive() {
    const [profileImg, setProfileImg] = useState();
    const { r_m_id } = useParams();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisible1, setPasswordVisible1] = useState(false);
    const navigate = useNavigate();
    const [base64, setBase64] = useState('');
    const [errors, setErrors] = useState({});
    // const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
    const { state } = useLocation();
    const location = useLocation();
    const [file, setFile] = useState(null);
    const [currentErrorMessage, setCurrentErrorMessage] = useState('');
    const [ErrorMessage, setErrorMessage] = useState('');
    const [ErrorMessage1, setErrorMessage1] = useState('');
    console.log('Location State:', location.state);
    // const { id_number } = location.state || {};
    const [salesExecutive, setSalesExecutive] = useState(null);
    const { mode = 'add', id_number } = location.state || {};
    // const { id_number, mode } = location.state || {};
    console.log(`Received ID: ${id_number}`);
    // const { mode } = state;
    const pageMode = mode;
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    

   
    const [formData, setFormData] = useState({
        r_m_id: r_m_id,
        profile: '',
        sal_exe_name: '',
        phone_number: '',
        qualification: '',
        e_mail: '',
        blood_group: '',
        gender: '',
        address: '',
        state: '',
        pincode: '',
        dob: '',
        confirmPassword: '',
        password: ''
    });


    const handleChangeON = (e) => {
        const { name, value } = e.target;

        // Regex to check date format dd-mm-yyyy
        const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])-\d{4}$/;

        if (name === 'dob' && !dateRegex.test(value)) {
            console.log('Invalid date format');
            // You can add error handling here or update some state to show an error message.
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };


    const handlePhoneChange = (value) => {
        if (validatePhoneNumber(value)) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                phone_number: value,
            }));
        } else {
            // Optionally, you can handle invalid phone number input here
            console.log("Invalid phone number");
        }
    };

    const handleEmailChange = (value) => {
        if (validateEmail(value)) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                e_mail: value,
            }));
        } else {
            // Optionally, you can handle invalid email input here
            setErrorMessage('Email must include "@" and ".com"');
        }
    };


    const validateEmail = (e_mail) => {
        // Basic email validation pattern
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        return emailPattern.test(e_mail) && e_mail.endsWith('.com');
    };
    // Password validation function
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
        // if (!passwordRegex.test(password)) {
        //     return 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and must be at least 6 characters long';
        // }
        // return '';

    };

    // Function to handle password validation
    const handlePasswordChange = (value) => {
        if (validatePassword(value)) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                password: value,
            }));
        }
        else {
            setErrorMessage1('Password must contain at least one uppercase, one lowercase, one digit, and must be at least 6 characters long');
        }


    };

    const handlepasswordInput = (e) => {
        let value = e.target.value;
    
        // Single regex to check all conditions: length >= 6, at least one uppercase letter, and one special character
        const isValidPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    
        if (!isValidPassword.test(value)) {
            setPasswordError("Password must be at least 6 characters long, contain at least one uppercase letter, and one special character.");
        } else {
            setPasswordError(""); // No error if all conditions are met
        }
    
        e.target.value = value;
    };
    

    const handlepasswordInput1 = (e) => {
        let value = e.target.value;
    
        // Single regex to check all conditions: length >= 6, at least one uppercase letter, and one special character
        const isValidPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    
        if (!isValidPassword.test(value)) {
            setPasswordError("Password must be at least 6 characters long, one uppercase letter and one special character.");
        } else {
            setPasswordError(""); // No error if all conditions are met
        }
    
        e.target.value = value;
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
    const validate = () => {
        let valid = true;

        // Email validation
        if (!formData.e_mail.includes('@') || !formData.e_mail.endsWith('.com')) {
            setErrors(prevErrors => ({ ...prevErrors, e_mail: 'Invalid email format' }));
            valid = false;
        } else {
            setErrors(prevErrors => ({ ...prevErrors, e_mail: '' }));
        }

        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(formData.password)) {
            setErrors(prevErrors => ({ ...prevErrors, password: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and must be at least 6 characters long' }));
            valid = false;
        } else {
            setErrors(prevErrors => ({ ...prevErrors, password: '' }));
        }

        // Confirm Password validation
        if (formData.password !== formData.confirmPassword) {
            setErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Passwords do not match' }));
            valid = false;
        } else {
            setErrors(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
        }

        // Mobile Number validation
        const phoneNumberRegex = /^\d{10}$/;
        if (!phoneNumberRegex.test(formData.phone_number)) {
            setErrors(prevErrors => ({ ...prevErrors, phone_number: 'Mobile number must be exactly 10 digits long' }));
            valid = false;
        } else {
            setErrors(prevErrors => ({ ...prevErrors, phone_number: '' }));
        }
        let tempErrors = {};
        if (!formData.sal_exe_name) tempErrors.sal_exe_name = "Name is required";
        if (!formData.phone_number) tempErrors.phone_number = "Mobile Number is required";
        if (!formData.e_mail) tempErrors.e_mail = "Email is required";
        if (!formData.gender) tempErrors.gender = "Gender is required";
        if (!formData.blood_group) tempErrors.blood_group = "blood_group is required";
        if (!formData.qualification) tempErrors.qualification = "qualification is required";
        if (!formData.address) tempErrors.address = "Address is required";
        if (!formData.state) tempErrors.state = "required";
        if (!formData.pincode) tempErrors.pincode = "required";
        if (!formData.dob) tempErrors.dob = "DOB is required";
        if (!formData.password) tempErrors.password = "Password is required";
        if(!formData.confirmPassword) tempErrors.confirmPassword = "Confirm Password is required";
        if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Passwords do not match";

        setErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;

    };

    const handleEmailInput = (e) => {
        let value = e.target.value;
        value = value.trim().toLowerCase(); // Automatically convert to lowercase
    
        // Regex pattern to enforce presence of '@' and '.com', and disallow uppercase letters
        // Validate email
  if (!value.includes('@') || !value.includes('.com')) {
    setEmailError('Email must include "@" and ".com"');
  } else {
    setEmailError('');
  }
        e.target.value = value;
    };
    

    useEffect(() => {
        if (mode === 'edit' && id_number) {
            fetchSalesExecutiveDetails(id_number);
        }
    }, [mode, id_number]);

    const fetchSalesExecutiveDetails = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/superAdmin_view_sales-executive_by_id/${id}`);
            const executiveData = response.data[0];
            setSalesExecutive(executiveData);
            setFormData({
                ...formData,
                profile: executiveData.profile || '',
                sal_exe_name: executiveData.sal_exe_name || '',
                phone_number: executiveData.phone_number || '',
                qualification: executiveData.qualification || '',
                e_mail: executiveData.e_mail || '',
                blood_group: executiveData.blood_group || '',
                gender: executiveData.gender || '',
                address: executiveData.address || '',
                dob: executiveData.formatted_dob || '',
                state: executiveData.state || '',
                pincode: executiveData.pincode || '',
                password: executiveData.password || '',
                confirmPassword: executiveData.password || '',
                r_m_id: executiveData.r_m_id || '',
            });
        } catch (error) {
            console.error('Error fetching sales executive details:', error);
            setCurrentErrorMessage('Failed to load sales executive details.');
        }
    };

 

    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }

        try {
            if (mode === 'add') {
                const imageBase64 = formData.profile instanceof File ? await toBase64(formData.profile) : formData.profile;
                const updatedFormData = { ...formData, profile: imageBase64 };

                const response = await fetch(`http://localhost:5000/superAdmin_add_sales_executives_by_r_m_id`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedFormData),
                });

                if (response.ok) {
                    alert('Sales executive added successfully!');
                    navigate(`/Sales/${formData.r_m_id}`);
                } else {
                    alert(response.message);
                }
            } else if (mode === 'edit' && id_number) {
                const response = await axios.put(`http://localhost:5000/superAdmin_update_sales-executive_by_id/${id_number}`, formData);

                if (response.status === 200) {
                    alert('Successfully updated');
                    navigate(`/Sales/${formData.r_m_id}`);
                } else {
                    alert(response.message);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing the request.');
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors('Passwords do not match.');
        } else {
            setErrors('');
            console.log('Passwords match, form can be submitted');
        }
    };


    const validates = () => {

        handleSubmit();
    };

    const handleFile = async (event) => {
        const selectedFile = event.target.files[0];
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

        if (selectedFile && allowedTypes.includes(selectedFile.type)) {
            if (selectedFile.size <= 2 * 1024 * 1024) {
                try {
                    const base64Data = await toBase64(selectedFile);
                    setFile(base64Data);
                    setFormData({ ...formData, profile: base64Data });
                    setCurrentErrorMessage('');
                } catch (error) {
                    console.error("Error converting file to Base64:", error);
                }
            } else {
                setFile(null);
                setCurrentErrorMessage('File size exceeds 2MB limit');
            }
        } else {
            setFile(null);
            setCurrentErrorMessage('Only PDF, JPG, JPEG, and PNG file types are allowed.');
        }
    };

    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };


    const handleClick = () => {
        document.getElementById('profile-input').click();
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
    const handleBloodInput = (e) => {
        let value = e.target.value;
        value = value.replace(/^\s+/, "");
        value = value.replace(/[^A-Za-z+-]/g, "");
        e.target.value = value;
    };
    const handleNameInput = (e) => {
        let value = e.target.value;
        value = value.replace(/^\s+/, "");
        value = value.replace(/[^A-Za-z\s'-]/g, "");
        e.target.value = value;
    };

    const validatePhoneNumber = (phone_number) => {
        // Remove any non-digit characters (optional, depending on your requirements)
        const cleanedPhoneNumber = phone_number.replace(/\D/g, '');

        // Check if the phone number has at least 10 digits
        if (cleanedPhoneNumber.length < 12) {
            return false; // Phone number is invalid
        }

        // Validate the phone number using the pattern
        const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
        return phoneNumberPattern.test(phone_number);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
      };

      const togglePasswordVisibility1 = () => {
        setPasswordVisible1(!passwordVisible1);
      };

    const handleChangeOns = (date) => {
        const formattedDate = {
            year: date.getFullYear(),
            month: date.getMonth() + 1, // getMonth() is zero-indexed
            day: date.getDate(),
        };

        setFormData((prevData) => ({
            ...prevData,
            dob: formattedDate,
        }));
    };

    const selectedDate = formData.dob
        ? new Date(formData.dob.year, formData.dob.month - 1, formData.dob.day)
        : null;


    return (
        <div className='overall-addSalesExectives' style={{ backgroundColor: '#F9F9F9', height: '100%' }}><br />
            <h3 className='addSalesExective-heads'>&nbsp;&nbsp;{pageMode === 'add' ? 'Add' : 'Edit'} Sales Executive</h3>
            <hr className='addSalesExective-lines' style={{ border: '1px solid #0000001A', marginBottom: '20px', marginTop: '-10px', marginLeft: '5px' }} />
            <div className='addSalesExcutive-container-fluid addSalesExective-conents' style={{ marginLeft: '21px', marginTop: '-12px' }}>
                <div className="row mt-3">
                    <div className="col-sm-6 custom-mobile-col">
                        <div className="p-4 " style={{ marginTop: '20px', fontSize: '14px', color: '#212121' }}>Sales Executive Details</div>
                    </div>
                    <div className="col-sm-6 custom-mobile-col">
                        {/* <div className="p-3 "><button onClick={handleDelete} className="addSalesExective-btns " style={{ marginTop: '10px', marginLeft: '63%', height: '40px' }}>Delete</button></div> */}
                    </div>
                    <hr className='line' style={{ border: 'none', backgroundColor: '#b8b5b5', height: '2px', marginBottom: '7px', marginTop: '-6px', marginLeft: '19px', width: '96%' }} />
                </div>
                <div className="row mt-3" style={{ paddingLeft: '17px' }}>
                    <div className="col-sm-4 custom-mobile-col">
                        <div className="p-3 pic-avt">
                            <div style={{ width: '75%', height: '75%' }}>


                                <input

                                    type="file"
                                    onChange={handleFile}
                                    id="profile-input"

                                    style={{ display: 'none' }}
                                />
                                {formData.profile ? (
                                    <img
                                        src={typeof formData.profile === 'string' ? formData.profile : URL.createObjectURL(formData.profile)}
                                        name="profile"
                                        value={formData.profile}
                                        alt="Uploaded file preview"
                                        width={250} height={190}
                                        style={{ borderRadius: '25px' }}
                                    />
                                ) : (
                                    <img
                                        src={avt}
                                        name="profile"
                                        value={formData.profile}
                                        alt="Uploaded file preview"
                                        width={250} height={200}
                                        style={{ borderRadius: '25px', marginTop: '-9px' }}
                                    />
                                )}
                                <button
                                    onClick={handleClick}
                                    className="pic-btn"
                                    style={{
                                        width: '47%',
                                        height: '40px',
                                        backgroundColor: '#0089FF',
                                        borderRadius: '30px',
                                        marginLeft: '30%',
                                        //  marginTop: '-25px',
                                        marginBottom: '-12px',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',

                                    }}
                                >
                                    Upload
                                </button>
                                {currentErrorMessage && (
                                    <p style={{ color: 'red', marginTop: '10px' }}>{currentErrorMessage}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4 custom-mobile-col" >

                        <div className="p-3">
                            <from>
                                <label className={errors.sal_exe_name ? "text-danger" : "text-dark"} >Sales Executive Name*</label><br />
                                <input value={formData.sal_exe_name} spellCheck="false" name="sal_exe_name" onInput={handleNameInput} onChange={handleChangeOn} placeholder="" className="addSalesExective-inputs" type="text" style={{ width: '300px' }} required /><br /><br />
                                <label className={errors.qualification ? "text-danger" : "text-dark"}>Qualification</label><br />
                                <input value={formData.qualification} spellCheck="false" name="qualification" onChange={handleChangeOn} placeholder="" className="addSalesExective-inputs" style={{ width: '300px' }} required /> <br /><br />
                                <label className={errors.blood_group ? "text-danger" : "text-dark"}>Blood Group</label><br />
                                {/* <input value={formData.blood_group} spellCheck="false" onInput={handleBloodInput} name="blood_group" onChange={handleChangeOn} placeholder="" className="addSalesExective-inputs" style={{ width: '300px' }} required /> */}
                                <select
                                    value={formData.blood_group}
                                    className="addSalesExective-inputs"
                                    name="blood_group"
                                    onChange={handleChangeOn}
                                    style={{
                                        width: "300px",
                                        height: "35px",
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
                                <label className={errors.phone_number ? "text-danger" : "text-dark"} >Mobile Number*</label><br />
                                <PhoneInput placeholder="" className="salesexcutive-inputStyle"
                                    country={"in"}
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={(value) => handlePhoneChange(value)}
                                    inputProps={{
                                        name: "phone_number",
                                        required: true,
                                        autoFocus: false,
                                    }}
                                    inputStyle={{
                                        width: '270px',
                                        height: '35px',
                                        borderRadius: '10px'
                                    }}
                                    buttonStyle={{
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                    }}
                                    dropdownStyle={{
                                        borderRadius: '10px',

                                    }}
                                />
                                <br />
                                <label className={errors.e_mail ? "text-danger" : "text-dark"} >E-mail ID*</label><br />
                                <input value={formData.e_mail} spellCheck="false" name="e_mail" onInput={handleEmailInput}
                                    onChange={handleChangeOn} placeholder="" className="addSalesExective-inputs mb-n5" type="email" style={{ width: '270px' }} required /><br /><br />
                                {emailError && <p className="error text-danger mt-n5">{emailError}</p>}



                                <label className={errors.gender ? "text-danger" : "text-dark"}>Gender</label><br />
                                <select value={formData.gender} className="addSalesExective-inputs" name="gender" onChange={handleChangeOn}
                                    style={{
                                        width: "270px",
                                        height: "35px",
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
                                    id="options" required>
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
                    <div className="row mt-2" style={{ marginTop: '-40px', paddingLeft: '10px' }}>
                        <div className="col-sm-8 custom-mobile-col">
                            <label className={errors.address ? "text-danger" : "text-dark"} >Address*</label><br />
                            <input value={formData.address} spellCheck="false" name="address" onChange={handleChangeOn} placeholder="" className="addSalesExective-inputs address-slaesexe" style={{ width: '625px' }} type="" required />
                        </div>
                        <div className="col-sm-4 custom-mobile-col">
                            <div className="row">
                                <div className="col-sm-4 custom-mobile-col">

                                    <label className={errors.state ? "text-danger" : "text-dark"} >State*</label><br />
                                    <input value={formData.state} spellCheck="false" name="state" onChange={handleChangeOn} placeholder="" className="addSalesExective-inputs" style={{ width: '140px' }} type="" required />
                                </div>
                                <div className="col-sm-4 custom-mobile-col" style={{ marginLeft: '1px' }}>

                                    <label className={errors.pincode ? "text-danger" : "text-dark"} style={{ marginLeft: '35px' }}>pincode*</label><br />
                                    <input value={formData.pincode} spellCheck="false" name="pincode" onInput={handlePininput} onChange={handleChangeOn} placeholder="" className="addSalesExective-inputs pincodeleft" style={{ width: '135px', marginLeft: '35px' }} type="" required />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-3" style={{ marginTop: '-40px', paddingLeft: '10px' }}>



                        <div className="col-sm-4 custom-mobile-col" >
                            <label className={errors.dob ? "text-danger" : "text-dark"} >Date Of Birth*</label><br />
                            {/* <DatePicker 
                                selected={selectedDate}
                                onChange={handleChangeOns}
                                dateFormat="yyyy-MM-dd"
                                className="addSalesExective-input datepickerstaffadd "
                                placeholderText=""
                />  */}
                            <input value={formData.dob} spellCheck="false" placeholder="year-month-date" name="dob" onChange={handleChangeOn} style={{ width: '280px' }} className="addSalesExective-inputs" required />

                        </div>
                        <div className="col-sm-4 custom-mobile-col">
                            <label className={errors.password ? "text-danger" : "text-dark"} >New Password*</label><br />
                            <div style={{ position: 'relative', width: '280px' }}>
  <input
    value={formData.password}
    type={passwordVisible ? "text" : "password"}
    spellCheck="false"
    onInput={handlepasswordInput}
    id='new-password'
    name="password"
    onChange={handleChangeOn}
    placeholder=""
    style={{ width: '100%', paddingRight: '40px', marginLeft: '1px' }} // paddingRight to make room for the icon
    className="addSalesExective-inputs"
    required
  />
  <span
    onClick={togglePasswordVisibility}
    style={{
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer'
    }}
  >
    <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
  </span>
</div>

         {passwordError && <p className=" text-danger">{passwordError}</p>}

                        </div>
                        <div className="col-sm-4 custom-mobile-col">
                            <label className={errors.confirmPassword ? "text-danger" : "text-dark"} >Confirm Password*</label><br />
                            <div style={{ position: 'relative', width: '280px' }}>
  <input
    value={formData.confirmPassword}
    type={passwordVisible1 ? "text" : "password"}
    spellCheck="false"
    onInput={handlepasswordInput1}
    id='confirm-password'
    name="confirmPassword"
    onChange={handleChangeOn}
    placeholder=""
    style={{ width: '100%', paddingRight: '40px', marginLeft: '1px' }} // paddingRight to make room for the icon
    className="addSalesExective-inputs"
    required
  />
  <span
    onClick={togglePasswordVisibility1}
    style={{
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer'
    }}
  >
    <FontAwesomeIcon icon={passwordVisible1 ? faEye : faEyeSlash} />
  </span>
</div>

                        </div>
                        <br />
                        <button value={formData.r_m_id} className="btnz" style={{ marginLeft: '68%', height: '35px', width: '289px', backgroundColor: '#0089FF', color: 'white', borderRadius: '20px', border: 'none', marginTop: '20px' }}
                            onClick={validates}  >
                            {/* onClick={() => validate()} */}
                            Save
                        </button>
                    </div>
                </from>
            </div>
        </div>
    );
}
export default AddSalesExcutive;