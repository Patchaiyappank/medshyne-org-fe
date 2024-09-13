import React, { useState, useContext } from "react";
import "../styles/Createnew.css";
import medshyne from "../photos/medshyne.png";
import eye from "../photos/Vector.png";
import eyehide from "../photos/eyehide.png";
import { MyContext } from "../ProjectContext";
import { useNavigate } from "react-router-dom";

const Createnew = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const { userObj, setUserObj } = useContext(MyContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [getUserID, setUserID] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  // const {state} = useLocation();
  // const {createnewuser} = state;
  // const mergevalue  = createnewuser;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Check if any of the fields are empty
    if (!username || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }

      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    if (!passwordPattern.test(password)) {
      setErrorMessage("Password must contain atleast one uppercase letter, lowercase letter, special character, atleast 8 characters long");
      return;
    }

    try {
      const data = localStorage.getItem("userData");
      console.log(JSON.parse(data));

      const formData = new FormData();

      //console.log("Data Passed ",userObj);
      formData.append("username", username);
      formData.append("password", password);
      //formData.append('username', );
      //formData.append('password', );
      // console.log('Organization Name :', userObj[0]);
      //  setUserObj([...userObj,[username]]);
      // setUserObj([...userObj,[password]]);
      setUserObj(userObj.push(username));
      setUserObj(userObj.push(password));
      console.log("Merged Type :", userObj);
      const userData = {
        username: username,
        password: password,
        organization_name: userObj[0],
        organization_type: userObj[1],
        email_id: userObj[2],
        organization_mobile_no: userObj[3],
        address: userObj[4],
        state: userObj[5],
        pincode: userObj[6],
        gst_number: userObj[7],
        count_of_student: userObj[8],
        count_of_staff: userObj[9],
        organisation_register_no: userObj[10],
        upload_doc: userObj[11],
        city: userObj[12],
        how_hear_us: userObj[13],
        contact_name: userObj[14],
        designation: userObj[15],
        contact_email_id: userObj[16],
        contact_mobile_no: userObj[17],
      };
      console.log("user data from context api : ", userData);
      let options = {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      };
      let insertID;
      fetch(`${baseApiUrl}/createuser`, options)
        .then((response) => response.json())
        .then((data) => {
          if (data.Result === "Failure") {
            setErrorMessage(data.message); // Set the error message from the response
          } else {
         
            alert("Signed up successfully!");
            setUserObj([...userObj, insertID]); // Add insertID to userObj array
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            navigate("/"); // Navigate to home page
          }
        })
    } 
    catch (error) {
      console.log(error);
      setErrorMessage("Failed to sign up"); // Update error message accordingly
    }
  };

  const handleShow = () => {
    setShow(!show);
  };

  const handleShow1 = () => {
    setShow1(!show1);
  };

  return (
    <div className="d-flex pr-5 justify-content-end create-main-container">
  
      <div className="create-login-container">
        <div className="create-medshynelogo-container">
          <img src={medshyne} alt="Login" className="w-75 mt-n2 ms-4"></img>
        </div>
        <br></br>
        <h2 className="fs-4 ms-n3 mt-n2 fw-bold">Create your account</h2>
        <p className="create-text" >Create a New User Name and Password</p>

        {formSubmitted && errorMessage && (
          <p className="text-danger createnew-error mt-2 mb-n4">{errorMessage}</p>
        )}
        <form onSubmit={handleSignUp}>
          <div>
            <label className="create-username-label">User Name</label>
            <input
              className="border border-0 ps-3 position-relative create-input-field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
<br/>
           <div className="mt-n3">
              <label className="create-password-label">New Password </label>
              <div >
                <input
                  className="ps-3 border border-0 create-input-field"
                  type={show ? "text" : "password"}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="create-newpass-container">
                <label className="create-newvisible" onClick={handleShow}>
                  {show ? (
                    <img
                      src={eye}
                      alt="Login"
                      className="create-neweye-field"
                    ></img>
                  ) : (
                    <img src={eyehide} alt="Login" className="create-neweyehide-field"></img>
                  )}{" "}
                </label>
              </div>
              </div>
      
       <br/>
       <div className="mt-n3">
              <label className="create-password-label">Confirm Password</label>

              <div >
                <input
                  className="ps-3 border border-0 create-input-field"
                  type={show1 ? "text" : "password"}
                  onChange={handleConfirmPasswordChange}
                />
                <div className="create-newpass-container">
                  <label className="create-newvisible" onClick={handleShow1}>
                    {show1 ? (
                      <img
                        src={eye}
                        alt="Login"
                        className="create-neweye-field"
                      ></img>
                    ) : (
                      <img
                        src={eyehide}
                        alt="Login"
                        className="create-neweyehide-field"
                      ></img>
                    )}{" "}
                  </label>
                </div>
              </div>
</div>

          <button type="submit" className="create-signup-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Createnew;