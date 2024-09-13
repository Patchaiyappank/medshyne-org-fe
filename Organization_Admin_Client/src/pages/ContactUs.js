import React, { useState } from "react";

import "../styles/ContactUs.css";

import medshyne from "../photos/medshyne.png";

const ContactUs = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [getname, setname] = useState("");
  const [getemail, setemail] = useState("");
  const [getmessage, setmessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleNameChange = (event) => {
    setname(event.target.value);
  };

  // const handleEmailChange = (event) => {
  //   setemail(event.target.value);
  // };

  const handleEmailChange = (event) => {
    const inputEmail = event.target.value;
    setemail(inputEmail);
  
    // Regex for validating email that ends with '.com'
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/;
  
    if (!emailPattern.test(inputEmail)) {
      setErrorMessage("Email must include '@' and end with '.com'");
    } else {
      setErrorMessage(""); // Clear error message if valid
    }
  };
  
  const handleMessageChange = (event) => {
    setmessage(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value.trim();
    const email = e.target.elements.email.value.trim();
    const message = e.target.elements.message.value.trim();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/;
 
    if (!name || !email || !message) {
      setErrorMessage("Please fill all the fields.");
     
      return;
    }

    if (!emailPattern.test(email)) {
      setErrorMessage("Email must include '@' and end with '.com'");
      return;
    }

    // Prepare the data to be sent to the API
    const formData = {
      name: name,
      email: email,
      message: message,
    };

    // Make a POST request to your API endpoint
    fetch(`${baseApiUrl}/contactus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // If the response is successful, you can handle it here
        console.log("Form submitted successfully!");
        // Optionally, you can reset the form fields here
        e.target.reset();
        setErrorMessage("");
        alert("Email send successfully"); // Clear any previous error messages
        setname("");
        setemail("");
        setmessage("");
      })

      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
        // Handle errors here, such as displaying an error message to the user
        setErrorMessage(
          "There was a problem submitting the form. Please try again later."
        );
      });
  };

  return (

      <div className="contact-main-container">
        <div className="contact-text-container">
          <h1 className="contact-heading">Please Wait For Verification</h1>
          <p className="contact-para">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
          </p>
        </div>
        <div className="d-flex justify-content-end">
        <div className="contact-box-container">
        <div className="text-center">
        <img src={medshyne} alt="Login" className="contact-medshyne-logo" />
        </div>
          <h1 className="fs-4 ms-n3 mt-2 fw-bold">Contact us</h1>
          <p className="contact-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <form onSubmit={handleSubmit}>
            {errorMessage && <p className="text-danger mb-n4">{errorMessage}</p>}
            <label className="contact-username-label">Name</label>
            <br />
            <input
              type="text"
              name="name"
              value={getname}
              onChange={handleNameChange}
              className="contactus-input-field mb-n4"
              spellCheck='false'
            />
            <br />
            <label className="mt-3 contact-password-label">Email</label>
            <br />
            <input
              type="text"
              name="email"
              value={getemail}
              onChange={handleEmailChange}
              className="contactus-input-field mb-n4"
              spellCheck='false'
            />
           
            <br />
            <label className="mt-3 contact-password-label">Message</label>
            <br />
            <div className="contact-textarea-container">
              <textarea
                id="message"
                name="message"
                value={getmessage}
                onChange={handleMessageChange}
                placeholder="Type your message..."
                className="contact-input-field-box"
                spellCheck='false'
              ></textarea>
            </div>

            <button
              type="submit"
              onSubmit={handleSubmit}
              className="mt-2 contact-submit-button"
            >
              Submit
            </button>
          </form>
        </div>
        </div>
      </div>

  );
};

export default ContactUs;