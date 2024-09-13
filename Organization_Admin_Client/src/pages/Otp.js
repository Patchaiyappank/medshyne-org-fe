import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Otp.css'; // Ensure this path is correct for your project structure
import Otpimage from '../photos/OTP.png';
import { Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Otp() {

  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const [verificationColor, setVerificationColor] = useState('');
  const [inputError, setInputError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showResendMessage, setShowResendMessage] = useState(false);

  const navigate = useNavigate();

  const { state } = useLocation();
  const { mobile } = state;

  const phoneid = mobile;
  const isPhoneNumber = /^\d{10}$/.test(phoneid);

  const content = (
    <p>Sent to + {`${phoneid.substring(0, 4)}*****${phoneid.substring(phoneid.length - 3)}`}</p>
  );

  const inputRefs = useRef([]);
  useEffect(() => {
    let intervalId;
    if (resendDisabled) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            setResendDisabled(false);
            clearInterval(intervalId);
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [resendDisabled]);

  const handleInputChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);
      setInputError(false); // Reset input error on change
      if (value !== '') {
        const nextIndex = index + 1;
        if (nextIndex < otp.length) {
          inputRefs.current[nextIndex].focus();
        }
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && otp[index] === '') {
      const previousIndex = index - 1;
      if (previousIndex >= 0) {
        inputRefs.current[previousIndex].focus();
      }
    }
  };

  const handleVerifyOTP = () => {
    const enteredOTP = otp.join('');

 // Check if any field is empty
 if (otp.some((digit) => digit === '')) {
  setVerificationStatus('All fields must fill');
  setVerificationColor('text-danger');
  setInputError(true);
  inputRefs.current[0].focus();
  return;
}

    if (enteredOTP === '123456') {
      setVerificationStatus('OTP verified successfully!');
      setVerificationColor('text-success');
      navigate('/Createnew');
    } else {
      setVerificationStatus('The code you entered is wrong');
      setVerificationColor('text-danger');
      setInputError(true);
      setShowResendMessage(true); // Show the "Didn't receive the code?" message
      setOTP(['', '', '', '', '', '']);
     
      inputRefs.current[0].focus();
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    
        try {
          console.log("Entered Data:", phoneid); // Log the entered data in the console
    
          // API call to send OTP
          const response = await fetch(`${baseApiUrl}/SendOtp_signup_password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ entry: phoneid }),
          });
    
          const responseData = await response.json();
    
          if (responseData.value === 'fail') {
            setErrorMessage(responseData.message);
            setResendDisabled(false); // Enable resend button if failed
          } else {
            alert(responseData.message);
          }
        } catch (error) {
          // setErrorMessage('Failed to send OTP. Please try again later.');
          alert('Please enter 123456');
          console.error(error);
          setResendDisabled(false); // Enable resend button if an error occurs
        }
            setResendDisabled(true);
        setTimer(60);
        setTimeout(() => {
          setResendDisabled(false);
        }, 60000);
        setVerificationStatus('');
        setInputError(false); // Reset input error on resend
      };

  return (
    <div className="otpscreen-container">
      <div className="d-flex ps-4 otpscreen-main-container">
        <div className="row align-items-center">
          <button className="otpscreen-back-button" onClick={() => navigate('/signup')}>Back</button>
          <div className="col-md-6">
            <div className="otpscreen-image-container">
              <img src={Otpimage} className="otpscreen-image ps-5 mt-3" alt="OTP" />
            </div>
          </div>

          <div className="col-md-6 ">
            <div className="text-center mb-4">
              <h2 className="otpscreen-heading font-weight-bold">Verification</h2>
                 {errorMessage && <p className="text-danger mt-3 ">{errorMessage}</p>}
              <p className="text-muted font-weight-bold" style={{fontSize:'19px'}}>Please enter the verification code</p>
              <div className="mt-n3 font-weight-bold" style={{fontSize:'19px'}}>
                {content}
              </div>
            </div>  
            <div className="text-center mt-5">
              <div className="border-0 mb-4 d-flex justify-content-center">
              <div >
            {otp.map((digit, index) => (
              <React.Fragment key={index}>
                <input id="OTPinputstyle"
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`otp-input ${verificationStatus === 'The code you entered is wrong' ? 'border-danger mt-n5 mb-n5 otpscreen-error-background' : ''}`}
                />
                {/* {index === 2 && <span>&nbsp;&nbsp;&nbsp;</span>} Add space after 3rd box */}
              </React.Fragment>
            ))}
          </div>
              </div>
              {verificationStatus && (
                <p className={`otpscreen-verification-message ${verificationColor}`}>{verificationStatus}</p>
              )}
              <button className="btn btn-primary verify" onClick={handleVerifyOTP} style={{width:'173px' , height:'57px', fontSize:'20px'}}>Verify Now</button>
              <div className="mt-3 text-center">
                {!resendDisabled ? (
                  <div className="d-inline-flex align-items-center">
                    {showResendMessage && <p className="text-muted mb-0 me-2">Didn't receive the code?</p>}
                    <button className="otpscreen-resend-button text-decoration-underline" style={{fontSize:'16px'}} onClick={handleResendOTP}>Resend code</button>
                  </div>
                ) : (
                  <p className="text-muted mb-0">Didn't receive the code? <span className="fw-bold">{timer}</span></p>
                )}
              </div>
              <div className="mt-3">
                <p className="text-muted" style={{fontSize:'16px'}}>Already have an account? <Link to="/login" className="otpscreen-resend-button text-decoration-underline" style={{fontSize:'16px'}}>Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Otp;