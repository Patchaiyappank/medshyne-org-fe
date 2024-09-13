import React, { useState, useEffect } from 'react';
import './Forget.css';
import forget from '../images/forgetimg.png';
import eyehide from '../images/eyehide.png';
import eye from '../images/eye.png';
import forgetlogo from '../images/forget-logo.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const ForgotPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [showNewPassword,setShowNewPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState(''); // To show feedback messages
  const [loading, setLoading] = useState(false); // To handle loading state
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    setToken(token);
  }, []);

  // const handleReset = async () => {


  //   if (newPassword !== confirmPassword) {
  //     setMessage('Passwords do not match');
  //     return;
  //   }
  
  //   try {
  //     const response = await fetch('http://localhost:5000/resetpassword', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ token, password: newPassword }),
  //     });
  
  //     const result = await response.json();
  
  //     if (!response.ok) {
  //       setMessage(result.message || 'Error resetting password');
  //     } else {
  //       alert('Password reset successful');
        
  //     }
  //   } catch (error) {
  //     setMessage('Error resetting password: ' + error.message);
  //   }
  // };


  const handleReset = async () => {

    const passwordValidation = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    if (!newPassword || !confirmPassword) {
      setMessage('Password fields cannot be empty');
      return;
    }

    if (!passwordValidation.test(newPassword)) {
      setMessage('Password must be at least 6 characters long, contain an uppercase letter, and a special character');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

   

    try {
      const response = await fetch('http://localhost:5000/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password: newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || 'Error resetting password');
      } else {
        alert('Password reset successful');
        navigate('/');
      }
    } catch (error) {
      setMessage('Error resetting password: ' + error.message);
    }
};

  
  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>
      <img style={{ width: '16%', marginLeft: '50px', marginBottom: '-90px' }} src={forgetlogo} alt="Forget Logo" />
      <div className="forget-password-container">
        <div className="forget-password-image">
          <img style={{ width: '100%' }} src={forget} alt="Forget Password" />
        </div>
        <div className="forget-password-card">
          <h3 style={{ marginTop: '30px'
          , fontWeight: '700' }}>Forgot Password</h3>
          <p>Create a new password</p>
          {message && <p className="text-danger">{message}</p>}
          <div className="forget-password-fields">
            <p style={{ paddingBottom: '10px' }}>New Password</p>
            <div className="forget-new-password">
              <input
                className='forgetinput'
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="eye-iconn" onClick={toggleShowNewPassword}>
                <img src={showNewPassword ? eyehide : eye} alt="Toggle Password Visibility" />
              </div>
            </div>
            <p style={{ marginTop: '10px', paddingBottom: '10px' }}>Confirm Password</p>
            <div className="forget-new-password">
              <input
                className='forgetinput'
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="eye-icon" onClick={toggleShowConfirmPassword}>
                <img src={showConfirmPassword ? eyehide : eye} alt="Toggle Password Visibility" />
              </div>
            </div>
            <button className='forget-button' onClick={handleReset} disabled={loading}
          >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;