import React, { useState } from 'react';
import './ContactUsPage.css';
import image1 from '../assets/Rectangle 23792.png';
import image2 from '../assets/Rectangle 23793.png';
import axios from 'axios';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateField = (name, value) => {
    const errors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobilePattern = /^\d{10}$/; // Adjust pattern as needed for mobile number

    if (name === 'name' && !value.trim()) errors.name = 'Full Name is required.';
    if (name === 'email' && !value.trim()) errors.email = 'Email Address is required.';
    else if (name === 'email' && !emailPattern.test(value)) errors.email = 'Invalid email format.';
    if (name === 'mobile_number' && !value.trim()) errors.mobile_number = 'Mobile Number is required.';
    else if (name === 'mobile_number' && !mobilePattern.test(value)) errors.mobile_number = 'Invalid mobile number.';
    if (name === 'message' && !value.trim()) errors.message = 'Message is required.';

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      ...errors,
      [name]: errors[name] || '',
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate the specific field that changed
    validateField(name, value);
  };

  const validateForm = () => {
    const errors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobilePattern = /^\d{10}$/; // Adjust pattern as needed for mobile number

    if (!formData.name.trim()) errors.name = 'Full Name is required.';
    if (!formData.email.trim()) errors.email = 'Email Address is required.';
    else if (!emailPattern.test(formData.email)) errors.email = 'Invalid email format.';
    if (!formData.mobile_number.trim()) errors.mobile_number = 'Mobile Number is required.';
    else if (!mobilePattern.test(formData.mobile_number)) errors.mobile_number = 'Invalid mobile number.';
    if (!formData.message.trim()) errors.message = 'Message is required.';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await axios.post('http://localhost:5000/landingPage_contactus', formData);
      setSuccess('Message sent successfully!');
      window.alert('Mail Sent Successfully!'); // Show alert on success
      setFormData({
        name: '',
        email: '',
        mobile_number: '',
        message: '',
      });
    } catch (error) {
      setError('Failed to send message. Please try again.');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="contact-us-container">
      <h1 className='contact-h1'>Contact Us</h1>
      <div className="content contact-content">
        <div className="images-container">
          <img src={image1} alt="First" className="image-style1" style={{ margin: '-70px 80px 40px -80px' }} />
          <img src={image2} alt="Second" className="image-style2" style={{ margin: '10px 80px -5px -30px' }} />
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="input-field contact-input-field"
          />
          {validationErrors.name && <p className="error-message">{validationErrors.name}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="input-field contact-input-field"
          />
          {validationErrors.email && <p className="error-message">{validationErrors.email}</p>}
          <input
            type="tel"
            name="mobile_number"
            placeholder="Mobile Number"
            value={formData.mobile_number}
            onChange={handleChange}
            className="input-field contact-input-field"
          />
          {validationErrors.mobile_number && <p className="error-message">{validationErrors.mobile_number}</p>}
          <textarea
            name="message"
            placeholder="Drop Your Message"
            value={formData.message}
            onChange={handleChange}
            className="input-field textarea-field contact-textarea-field"
          ></textarea>
          {validationErrors.message && <p className="error-message">{validationErrors.message}</p>}
          <button type="submit" className="contact-send-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <p>{error || success}</p>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUsPage;
