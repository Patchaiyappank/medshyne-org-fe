import React, { useState } from 'react';
import './Login.css'; // Import the CSS file
import logo from './Artboard .png';
import '@fontsource/inter';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setIsTyping(event.target.value !== '');
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    handleInputChange(event);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    handleInputChange(event);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login_super_admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server response is not JSON");
      }

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        navigate('/Dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Server error');
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      console.log('Sending password reset request...');
      const response = await fetch('http://localhost:5000/superAdmin_forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_id: email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Password reset email sent:', data);
        window.alert('A password reset link has been sent to your email.'); // Show success message in alert
        setError('');
      } else {
        setError(data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setError('Server error');
    }
  };

  return (
    <div className="logintotal">
      <div className="row w-100">
        <div className='d-flex justify-content-end login-padding-box'>
          <div className="col-md-6">
            <div className="cardsizelogin">
              <div className="me-2">
                <img src={logo} alt="Medshyne" className="img-fluid" style={{ maxWidth: '240px' }} />
              </div>
              <h3 style={{ marginRight: "52%", fontWeight: 'bold', color: "#393939", marginTop:'20px' }} className="">Log In</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form className="mb-5" onSubmit={handleSubmit}>
                <div style={{ marginRight: '150px', color: '#9E9E9E', fontSize: '15px' }} className="mb-3 custom-input-container">
                  <input
                    type="email"
                    className="form-control form-controlemail"
                    id="email"
                    placeholder='Email'
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleInputChange}
                    onFocus={handleInputChange}
                  />
                 
                </div>
                <div className="mb-3 position-relativelogin">
                  <input
                    type={showPassword ? 'text' : 'password'} // Toggle between text and password
                    className="form-control form-controlemail"
                    id="password"
                    placeholder='Password'
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <span 
                    className="password-toggle-iconlogin"
                    onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <a style={{ marginLeft: '253px', color: "#575756" }} href="#" className="text-decoration-none mb-3" onClick={handleForgotPassword}>Forgot Password ?</a>
                </div>
                <button type="submit" className="btn btn-primary loginbutton">Log In</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;