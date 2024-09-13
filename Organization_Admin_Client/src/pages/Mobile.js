import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Mobile.css'; 
import medshyne from '../photos/medshyne.png';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import eye from '../photos/Vector.png';
import eyehide from '../photos/eyehide.png';
import { MyContext } from '../ProjectContext';

const Mobile = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [show, setShow] = useState(false);
  const {getLoginCredentials,setLoginCredentials} = useContext(MyContext);
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validPhoneNumber, setValidPhoneNumber] = useState(true);
  const navigate = useNavigate(); // useNavigate called here

  const handleChange = (value) => {
    if (/^\d*$/.test(value)) {
      setPhoneNumber(value);
      setValidPhoneNumber(validatePhoneNumber(value));
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern.test(phoneNumber);
  };
  

  const handleSendOtp = async (e) => {
    e.preventDefault();
  
    // Clear any existing error message
    setErrorMessage('');
  
    // Validate phone number
    if (!phoneNumber.trim()) {
      setErrorMessage('Phone number must be filled');
      return;
    }
  
    try {
      const userData = {
        mobile: phoneNumber
      };
  
      const response = await fetch(`${baseApiUrl}/organization_check_mobileNumber_sendOtp`, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        }
      });
  
      const data = await response.json();
  
      // Check the message and set the error message conditionally
      if (data.message === 'Mobile number does not exist') {
        setErrorMessage(data.message);
      }
      // if (data.is_Approved==0) {
      //   setErrorMessage(
      //     <>
      //       You are not authorized. Please visit our{' '}
      //       <a href="/contactus" style={{ color: 'blue', textDecoration: 'underline' }}>
      //         Contact Us
      //       </a>{' '}
      //     </>
      //   );
        
      // } \
      else{ alert(data.message);}
    
  
    } catch (error) {
      console.error(error);
      setErrorMessage('Invalid phone number or OTP sending failed. Please try again.');
      alert('Failed to send OTP');
    }
  };
  

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim() || !otp.trim()) {
      setErrorMessage('Phonenumber and OTP cannot be empty');
      return;
    }
    
    try {
      const userData = {
        otp: otp,
        mobile_number: phoneNumber
      };
      
      const response = await fetch(`${baseApiUrl}/organization_loginWithOTP_by_mobileNumber`, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
      });
      const data = await response.json();
      if (response.ok) {
        console.log('OTP value: ' + data);
        alert('OTP successful');
        setOtp('');
        setLoginCredentials([...getLoginCredentials,data]);
          console.log("Result is Data  state is : ", getLoginCredentials);
        navigate('/Dashboard'); // Navigate to '/main'
      } else {
        setErrorMessage('OTP verification failed. Please try again.');
       
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Login failed. Please try again later.');
     
    }
  };
  
  

  const handleShow = () => {
    setShow(!show);
  };

  return (
    <div className='d-flex justify-content-end mobilepage-main-container'>
      <div className="mobilepage-container">
        <div className="text-center">
          <img src={medshyne} alt="Login" className='mobilepage-medshyne-logo' />
        </div>
        <br/>
        <h2 className='fs-3 mt-n2 fw-bold'>Log In</h2>
   
        {errorMessage && <p className="fs-6 text-danger">{errorMessage}</p>}
    <br/>
        <form>
          <div className="mobilepage-username-container">
            <label className='mobilepage-username-label'>Enter Mobile Number</label>
            <div className='mobilepage-phone-container'>
              <PhoneInput
                containerClass='dummycls mobilephone'
                country={'in'}
                value={phoneNumber}
                className="mobile-org-phone"
                onChange={handleChange}
                inputProps={{
                  required: true,
                  pattern: '[0-9]*',
                }}
              />
            </div>
            {!validPhoneNumber && <p className='fs-6 text-danger'>Please enter a valid phone number.</p>}
          </div>
          <br></br>
          <div>
            <div className="mobilepage-password-container">
              <label className='mobilepage-username-label'>Enter OTP</label><br></br>
              <input className='ps-3 border border-0 mobilepage-input-field'
                type={show ? "text" : "password"} 
                value={otp}
                onChange={(e) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(newValue);
  }}
              />
              <label className='mobilepage-eye-visible-label' onClick={handleShow}>
                {show ? <img src={eye} alt="Login" className="mobilepage-eye-field" /> : <img src={eyehide} alt="Login" className="mobilepage-eyehide-field" />}
              </label>
            </div>
          </div>
          <button type="button" className='mobilepage-forgetpassword-link' onClick={handleSendOtp}>Resend OTP</button> 
          <div className='d-flex mt-n2'>
            <button type="button" className='mobilepage-sendotp-button' onClick={handleSendOtp}>Send OTP</button>
            <button type="button" className='mobilepage-login-button' onClick={handleVerifyOtp}>Log In</button>
          </div>
          <br/>
          <hr className='mobilepage-horizontalline'/>
          <div>
            <span className='mobilepage-Noaccount'>No account yet?</span>
            <Link to="/signup" className='mobilepage-signup-link'> Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Mobile;
