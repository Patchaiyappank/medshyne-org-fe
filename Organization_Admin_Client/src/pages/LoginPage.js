import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import medshyne from "../photos/medshyne.png";
import eye from "../photos/Vector.png";
import eyehide from "../photos/eyehide.png";
import { MyContext } from '../ProjectContext';

const Login = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const { getLoginCredentials, setLoginCredentials } = useContext(MyContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleLog = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Username and Password cannot be empty");
      return;
    }
    try {
      const formData = new FormData();

      formData.append("username", username);
      formData.append("password", password);

      const userData = {
        username: username,
        password: password,
      };

      const response = await fetch(`${baseApiUrl}/loginusername`, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.Result == 'Failure') {
            setErrorMessage(data.message);
            return;
          }

          if (data.Result == 'UN_APPROVED') {
            setErrorMessage(
              <>
                You are not authorized. Please visit our{' '}
                <a href="/contactus" style={{ color: 'blue', textDecoration: 'underline' }}>
                  Contact Us
                </a>{' '}
              </>
            );
            throw new Error("Login failed, Invalid Credentials");
          } else {
            console.log(data);
            console.log("Result is data is : ", data);
            setLoginCredentials([...getLoginCredentials, data]);

            // Store login credentials in local storage
            localStorage.setItem('loginCredentials', JSON.stringify(data));

            console.log("Result is Data  state is : ", getLoginCredentials);
            navigate("/Dashboard", {
              state: {
                id: username,
              },
            });
          }
        }).catch(errorMessage => console.log(errorMessage));

      setUsername("");
      setPassword("");
    } catch (error) {
      setErrorMessage("Login failed. Please try again later.");
      alert("Login failed");
    }
  };

  const handleShow = () => {
    setShow(!show);
  };

  return (
    <div className="d-flex justify-content-end loginpage-main-container">
      <div className="loginpage-container">
        <div className="text-center">
          <img src={medshyne} alt="Login" className="loginpage-medshyne-logo" />
        </div>
        <br />
        <h2 className="fs-2 mt-n3 fw-bold">Log In</h2>
        {errorMessage && <p className="fs-6 text-danger">{errorMessage}</p>}
        <br />
        <form>
          <div className="loginpage-username-container">
            <label className="loginpage-username-label">User Name</label> <br />
            <input
              className="border border-0 ps-3 position-relative loginpage-input-field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <br />
          <div className="loginpage-password-container">
           
              <div className="fw-normal loginpage-label-container">
                <p className="loginpage-username-label">Password</p>
              </div>
              <br />
              <input
                className="ps-3 border border-0 loginpage-input-field"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="loginpage-eye-visible-label" onClick={handleShow}>
                {show ? (
                  <img
                    src={eye}
                    alt="Login"
                    className="loginpage-eye-field"
                  />
                ) : (
                  <img src={eyehide} alt="Login" className="loginpage-eyehide-field" />
                )}{" "}
              </label>
            </div>
       
          <h5 className="mt-0">
            {" "}
            <Link to="/forgetpass" className="loginpage-forgetpassword-link">
              Forgot Password ?
            </Link>
          </h5>

          <button className="loginpage-login-button" onClick={handleLog}>
            Log In
          </button>

          <br />
          <div className="mt-2 d-flex align-items-center">
            <span className="loginpage-vertical-linelog"></span>
            <span className="loginpage-text-vertical">(or)</span>
            <span className="loginpage-vertical-linelog"></span>
          </div>

          <Link to="/Mobile" className="loginpage-loginwithmobile-link">
            <button className="loginpage-login-button">Log In with Mobile OTP</button>
          </Link>
          <br />
          <div className="mt-1">
          
              <span className="loginpage-Noaccount">No account yet?</span> <Link to="/signup" className="loginpage-signup-link">Sign
              Up
            </Link>
          
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;