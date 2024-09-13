import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Otpverify.css'; // Ensure this path is correct for your project structure
import Otpimage from '../photos/OTP.png';
import { Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Otp() {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [errorMessage, setErrorMessage] = useState('');
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const [verificationColor, setVerificationColor] = useState('');
  const [inputError, setInputError] = useState(false);
  const [showResendMessage, setShowResendMessage] = useState(false);

  const navigate = useNavigate();

  const { state } = useLocation();
  const { id } = state;
  const emailorphoneid =id;

  const isPhoneNumber = /^\d{12}$/.test(emailorphoneid);


  const content = emailorphoneid.includes('@') ? (
    // If email
    <p>Sent to {`${emailorphoneid.substring(0, 6)}******@${emailorphoneid.split('@')[1]}`}</p>
  ) : (
    // If phone number
    <p>
  Sent to {isPhoneNumber ? 
  `+${emailorphoneid.substring(0, 2)} ${emailorphoneid.substring(2, 4)}*****${emailorphoneid.substring(emailorphoneid.length - 3)}` 
  : emailorphoneid}
</p> );

  const inputRefs = useRef([]);

  // Timer effect
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

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const enteredOTP = otp.join('');

    if (otp.some((digit) => digit === '')) {
      setVerificationStatus('All fields must fill');
      setVerificationColor('text-danger');
      setInputError(true);
      inputRefs.current[0].focus();
      return;
    }

    try {
      console.log("Entered OTP:", enteredOTP);

      // API call to verify OTP
      const response = await fetch(`${baseApiUrl}/organization_verification_verify_now`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp: enteredOTP, entry: emailorphoneid }),
      });

      const responseData = await response.json();
      if (responseData.message === 'OTP verified successfully.') {
        setVerificationStatus('OTP verified successfully!');
        setVerificationColor('text-success');
        setShowResendMessage(false); // Hide the "Didn't receive the code?" message on success
        navigate('/forget', { state: { id: emailorphoneid } });
      } else {
        setVerificationStatus('The code you entered is wrong');
        setVerificationColor('text-danger');
        setInputError(true);
        setShowResendMessage(true); // Show the "Didn't receive the code?" message on failure
        setOTP(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
      }
    } catch (error) {
      setVerificationStatus('Failed to verify OTP. Please try again later.');
      setVerificationColor('text-danger');
      console.error(error);
    }
  };

  const handleResendOTP = async (e) => {
e.preventDefault();

    try {
      console.log("Entered Data:", emailorphoneid); // Log the entered data in the console

      // API call to send OTP
      const response = await fetch(`${baseApiUrl}/SendOtp_forgot_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entry: emailorphoneid }),
      });

      const responseData = await response.json();

      if (responseData.value === 'fail') {
        setErrorMessage(responseData.message);
        setResendDisabled(false); // Enable resend button if failed
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      setErrorMessage('Failed to send OTP. Please try again later.');
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
    <div className="otpforgetscreen-container">
      <div className="d-flex ps-4 otpforgetscreen-main-container">
        <div className="row align-items-center">
          <button className="otpforgetscreen-back-button" onClick={() => navigate('/forgetpass')}>Back</button>
          <div className="col-md-6">
            <div className="otpforgetscreen-image-container">
              <img src={Otpimage} className="otpforgetscreen-image ps-5 mt-3" alt="OTP" />
            </div>
          </div>
          <div className="col-md-6 ">
            <div className="text-center mb-4">
              <h2 className="font-weight-bold otpforgetscreen-heading">Verification</h2>
              <p className="text-muted font-weight-bold">Please enter the verification code</p>
              <div className="mt-n3 font-weight-bold">
                {content}
              </div>
            </div>
            <div className="text-center mt-5">
              <div className="border-0 mb-4 d-flex justify-content-center">
                <div>
                  {otp.map((digit, index) => (
                    <React.Fragment key={index}>
                      <input id="OTPinputstyle"
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`otpverify-input ${inputError ? 'border-danger mt-n5 mb-n5 otpforgetscreen-error-background' : ''}`}
                      />
                      {index === 2 && <span>&nbsp;</span>} {/* Add space after 3rd box */}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              {verificationStatus && (
                <p className={`otpforgetscreen-verification-message ${verificationColor}`}>{verificationStatus}</p>
              )}
              <button className="btn btn-primary verify" onClick={handleVerifyOTP}>Verify Now</button>
              <div className="mt-3">
                {!resendDisabled ? (
                  <div className="d-inline-flex align-items-center">
                    {showResendMessage && <p className="text-muted mb-0 me-2">Didn't receive the code?</p>}
                    <button className="otpscreen-resend-button text-decoration-underline" onClick={handleResendOTP}>Resend code</button>
                  </div>
                ) : (
                  <p className="text-muted mb-0">Didn't receive the code? <span className="fw-bold">{timer}</span></p>
                )}
              </div>
              <div className="mt-3">
                <p className="text-muted">Already have an account? <Link to="/login" className="otpforgetscreen-resend-button text-decoration-underline">Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Otp;

