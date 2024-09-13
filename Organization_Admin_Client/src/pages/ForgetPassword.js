import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/forgetpass.css";
import forget from "../photos/pass.png";
import eye from '../photos/Vector.png';
import med from '../photos/medshyne.png';
import eyehide from '../photos/eyehide.png';
import { MyContext } from "../ProjectContext";

const Forget = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const { setUserObj } = useContext(MyContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [getUserIDFromDb, setUserIDFromDb] = useState(''); 
  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const { state } = useLocation();
  const { id } = state || {};
  const userIdFromDb = id;

  useEffect(() => {
    if (userIdFromDb) {
      setUserIDFromDb(userIdFromDb);
      fetchUsername(userIdFromDb); 
    } else {
      console.error("No user ID found in location state.");
    }
  }, [userIdFromDb]);


//   const fetchUsername = async (userIdFromDb) => {
//     try {
       
//         const response = await fetch(`${baseApiUrl}/username`, {
//             method: 'GET', 
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ input: userIdFromDb }) // Sending mobile number in the request body
//         });

//         // Parse the JSON response
//         const data = await response.json();
//         console.log('API response:', data);

//         // Check if the response is successful
//         if (data.Result === "Success") {
//             setUsername(data.result[0]);  // Set the username state
//             console.log("Username set to:", data.result[0]);
//         } else {
//             setErrorMessage(data.message);
//         }
//     } catch (error) {
//         console.error("Error in sending mobile number or fetching data:", error);
//         setErrorMessage("Failed to fetch username.");
//     }
// };

const fetchUsername = async (userIdFromDb) => {
  try {
      // Construct the URL with the userIdFromDb as a query parameter
      // const response = await fetch(`${baseApiUrl}/username?mobile=(userIdFromDb)}`, 
        const response = await fetch(`${baseApiUrl}/username?input=${userIdFromDb}`,
{
          method: 'GET', 
          headers: {
              'Content-Type': 'application/json'
          }
      });

      // Parse the JSON response
      const data = await response.json();
      console.log('API response:', data);

      // Check if the response is successful
      if (data.Result === "Success") {
        setUsername(data.result[0].username);  // Set the username state
        console.log("Username set to:", data.result[0].username);
      } else {
          setErrorMessage(data.message);
      }
  } catch (error) {
      console.error("Error in fetching username:", error);
      setErrorMessage("Failed to fetch username.");
  }
};

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

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
      const response = await fetch(`${baseApiUrl}/newusername_password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password,
          id: getUserIDFromDb
        })
      });
      const data = await response.json();
      console.log(data);
      if(data.Result === 'Success'){
      alert('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
      navigate('/');
    }else{
      setErrorMessage(data.message);
    }
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMessage("Failed to update password.");
    }
  };

  const handleShow = () => {
    setShow(!show);
  };

  const handleShow1 = () => {
    setShow1(!show1);
  };



  
  return (
    <div className="resetpassword-main-container">
      <img src={med} className="resetpassword-medshyne-logo" alt="Logo" />
      <div className="resetpassword-submain-container">
        <div className="resetpassword-left-container">
          <img src={forget} alt="Login" className="resetpassword-image-box" />
        </div>
        <div className="resetpassword-right-container">
          <div className="resetpassword-container">
            <h2 className="resetpassword-heading">Forgot Password</h2>
            <p className="resetpassword-para">Create a new User name and Password</p>
            {errorMessage && (
              <p className="text-danger">{errorMessage}</p>
            )}
            <form onSubmit={handleSignUp}>
              <div>
                <label className="resetpassword-label">User Name</label>
                <br />
                <input
                  className="resetpassword-input-field"
                  type="text"
                  value={username}
                 readOnly
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <br />
              <div className="mt-n3">
                <div>
                  <label className="resetpassword-label">New Password</label>
                  <div>
                    <input
                      className="resetpassword-input-field"
                      type={show ? "text" : "password"}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="resetpassword-hide-box">
                    <label className="resetpassword-eye-block" onClick={handleShow}>
                      {show ? (
                        <img src={eye} alt="Show" className="resetpassword-eye" />
                      ) : (
                        <img src={eyehide} alt="Hide" className="resetpassword-eye-hide" />
                      )}
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-n2">
                <div>
                  <label className="resetpassword-confirm-password">Confirm Password</label>
                  <div>
                    <input
                      className="resetpassword-input-field"
                      type={show1 ? "text" : "password"}
                      onChange={handleConfirmPasswordChange}
                    />
                    <div className="resetpassword-hide-box">
                      <label className="resetpassword-eye-block" onClick={handleShow1}>
                        {show1 ? (
                          <img src={eye} alt="Show" className="resetpassword-eye" />
                        ) : (
                          <img src={eyehide} alt="Hide" className="resetpassword-eye-hide" />
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className="resetpassword-reset">Reset Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forget;