import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/forget1pass.css";
import forget from "../photos/pass.png";
import med from '../photos/medshyne.png';

const ForgetPass = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [enter, setEnter] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

const handleSignUp = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  
    // Check if any of the fields are empty
    if (!enter) {
      setErrorMessage("Please enter email address or mobile number");
      return;
    }
  
    let formattedEntry = enter;
    if (!enter.includes("@") || !enter.includes(".com")) {
      if (!/^\d{10}$/.test(enter)) {
        setErrorMessage("Please enter a valid 10-digit mobile number.");
        return;
      }
      // Assume it's a mobile number and add "91" prefix if it's a number
      formattedEntry = `91${enter}`;
    }

    try {
      console.log("Entered Data:", enter); // Log the entered data in the console
  
      // API call to send OTP
      const response = await fetch(`${baseApiUrl}/SendOtp_forgot_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entry: formattedEntry }),
      });
  
      const responseData = await response.json();
  
     
        if (responseData.value === 'fail') {
          setErrorMessage(responseData.message);
        } else {
          setEnter('');
          alert(responseData.message);
          navigate('/otpverify', { state: { id: formattedEntry } });
        }
    
    } catch (error) {
      setErrorMessage('Failed to send OTP. Please try again later.');
      console.error(error);
    }
  };
  


  return (
    <div className="forgetpassword-main-container">
      <img src={med} className="forgetpassword-medshyne-logo" alt="Login" />
      <div className="forgetpassword-left-container">
        <img src={forget} alt="Login" className="forgetpassword-image-box" />
      </div>
      <div className="forgetpassword-right-container">
        <h2 className="forgetpassword-heading">Forgot Password</h2>
        <p className="forgetpassword-para">Please enter your email address or mobile number to send an OTP</p>

        {errorMessage && (
          <p className="text-danger">{errorMessage}</p>
        )}

        <form onSubmit={handleSignUp}>
          <div>
            <input
              className="forgetpassword-input-field"
              type="text"
              value={enter}
              onChange={(e) => setEnter(e.target.value)}
            />
          </div>
          <div className="d-flex">
            <button className="forgetpassword-cancel-button"><Link to="/login" className='forgetpassword-cancel-link'>Cancel</Link></button>
            <button type="submit" className="forgetpassword-send-button">Send OTP</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPass;
