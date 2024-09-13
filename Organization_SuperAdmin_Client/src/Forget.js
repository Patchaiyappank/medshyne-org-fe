import React, { useState } from 'react';
import './Forget.css';
import forget from './images/forgetimg.png'
import eyehide from './images/eyehide.png';
import eye from './images/eye.png';
import forgetlogo from './images/forget-logo.png';

const ForgetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = () => {
    // Add your logic here to handle password reset
    if (newPassword === confirmPassword) {
      // Passwords match, proceed with reset
      console.log('Password reset successful');
    } else {
      // Passwords do not match, show error
      console.error('Passwords do not match');
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
    <img style={{width:'16%', marginLeft:'50px',marginBottom:'-90px'}}  src={forgetlogo}/>
    <div className="forget-password-container">
       
      <div className="forget-password-image">
        <img style={{width:'100%'}}  src={forget} alt="Forget Password" />
      </div>
      <div className="forget-password-card" >
        <h3  style={{marginTop:'30px', fontWeight:'700'}} >Forgot Password </h3>
        <p>Create a new password</p>
        <div  className="forget-password-fields">
          <p style={{ paddingBottom:'10px'}}>New Password</p>
          <div className="new-password">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}  
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="eye-icon" onClick={toggleShowNewPassword}>
              <img src={showNewPassword ? eyehide : eye} alt="Toggle Password Visibility" />
            </div>
          </div>
          <p   style={{marginTop:'10px', paddingBottom:'10px'}}>Confirm Password</p>
          <div className="new-password">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="eye-icon" onClick={toggleShowConfirmPassword}>
              <img src={showConfirmPassword ? eyehide : eye} alt="Toggle Password Visibility" />
              
            </div>
            <button onClick={handleReset}>Reset Password</button>
          </div>
        </div>
      
      </div>
    </div>
    </div>
  );
};

export default ForgetPasswordPage;
