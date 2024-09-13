import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import profileimage1 from './profileimage.png';
import color from './color.png';
import defaultimg from './avatar.jpg';
import openEye from './eyeopen.png';
import closedEye from './eyeclose.png';
import './profilescreen.css';
import security from './secure.png';
import { useNavigate } from "react-router-dom";
import pencil from './pencil.png';

// import { MyContext } from './ProjectContext';



export default function Organization() {
//   const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [selectedImage, setSelectedImage] = useState(profileimage1);

//   const { getLoginCredentials, setLoginCredentials } = useContext(MyContext);

//   useEffect(() => {
//     if (getLoginCredentials) {
//       setSelectedImage(getLoginCredentials[0]?.profile || defaultimg);
//     }
//   }, [getLoginCredentials]);
  const [section, setSection] = useState("about");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [profileImg, setProfileImg] = useState('');
  const [profile, setprofile] = useState('');
  const [id, setid] = useState('');
  const [organization_name, setorganization_name] = useState('');
  const [organization_type, setorganization_type] = useState('');
  const [email_id, setemail_id] = useState('');
  const [organization_mobile_no, setorganization_mobile_no] = useState('');
  const [gst_number, setgst_number] = useState('');
  const [organisation_register_no, setorganisation_register_no] = useState('');
  const [address, setaddress] = useState('');
  const [file, setFile] = useState('');
  const [errorMessage1, setErrorMessage1] = useState("");
  const [organizationId, setorganizationId] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState(''); // State variable for new password
  const [confirmPassword, setConfirmPassword] = useState(''); // State variable for confirming password
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showConfirmPasswordInput, setShowConfirmPasswordInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // const { getLoginCredentials, setLoginCredentials } = useContext(MyContext);
  
  const Navigate = useNavigate();

  // const { state } = useLocation();
  // const { id } = state || {};
  const userIdFromDb = 1;

  useEffect(() => {
    if (userIdFromDb) {
     
      fetchUsername(userIdFromDb); 
    } else {
      console.error("No user ID found in location state.");
    }
  }, [userIdFromDb]);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setSelectedImage(storedImage);
    }
  }, []);

  const [errorNewPassword, setErrorNewPassword] = useState(false);
const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);


  const newPasswordInputType = showPasswordInput ? 'text' : 'password';
  const confirmPasswordInputType = showConfirmPasswordInput ? 'text' : 'password';
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setprofile(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    Navigate('/')
  }

  const containerStyle = {
    backgroundImage: `url(${color})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '250px',
    marginLeft: '1px',
    borderRadius: '23px 23px 0px 0px',
    width:'98%',
    marginTop:"10px",
  };



//   useEffect(() => {
//     if (getLoginCredentials && getLoginCredentials[0]) {
//       fetchAppointment(getLoginCredentials[0].userid);
//     }
//   }, [getLoginCredentials]);

  useEffect(() => {
    const storedData = localStorage.getItem('organizationData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setid(data.id);
      setemail_id(data.email_id);
      setprofile(data.profile);
      setorganization_name(data.organization_name);
      setorganization_type(data.organization_type);
      setorganization_mobile_no(data.organization_mobile_no);
      setgst_number(data.gst_number);
      setorganisation_register_no(data.organisation_register_no);
      setaddress(data.address);
      setorganizationId(data.id);
      setprofile(data.profile);
    }
  }, []);

  

  const fetchAppointment = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/viewbyid?` + new URLSearchParams({ id: id }));
      const data = await response.json();
      console.log(`Data: ${JSON.stringify(data)}`);
  
      // Store data in localStorage
      localStorage.setItem('organizationData', JSON.stringify(data.result[0]));
      setid(data.result[0].id); 
      setprofile(data.result[0].profile);
      setorganization_name(data.result[0].organization_name);
      setorganization_type(data.result[0].organization_type);
      setemail_id(data.result[0].email_id);
      setorganization_mobile_no(data.result[0].organization_mobile_no);
      setgst_number(data.result[0].gst_number);
      setorganisation_register_no(data.result[0].organisation_register_no);
      setaddress(data.result[0].address);
      setorganizationId(data.result[0].id);
    } catch (error) {
      console.error(`Error fetching organization details: ${error}`);
    }
  };


  const fetchUsername = async (userIdFromDb) => {
    try {
        // Construct the URL with the userIdFromDb as a query parameter
        // const response = await fetch(`${baseApiUrl}/username?mobile=(userIdFromDb)}`, 
          const response = await fetch(`http:localhost:5000/username`,
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

  const updatePassword = async () => {
    // Check if new password and confirm password match
    setErrorNewPassword(false);
    setErrorConfirmPassword(false);
    setErrorMessage1('');
  
    // Check if new password or confirm password fields are empty
    if (!newPassword) {
      setErrorNewPassword(true);
    }
    if (!confirmPassword) {
      setErrorConfirmPassword(true);
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage1('Password does not match');
      return;
    }
   
    if (!newPassword || !confirmPassword) {
      return; // Stop further execution if any field is empty
    }
  
    try {
      const response = await fetch(`http://localhost:5000/organization_newusername_password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id, // Send the organizationId
          username: username,
          password: newPassword, 
        }),
      });
      
      const data = await response.json();
      
      if (data && data.Result === 'Success') {
        console.log('Password updated successfully!');
        alert('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
        setErrorMessage1('');
      } else {
        console.error('Error updating password:', data.message);
        setErrorMessage1(data.message || 'An error occurred while updating the password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMessage1('An error occurred while updating the password');
    }
  };

  const setSectionWithId = (section, id) => {
    setSection(section);
    if (section === "password") {
      const fetchUsername = async (id) => {
        try {
          const response = await fetch(`http://localhost:5000/organization_name_get?id=${Number(id)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          const data = await response.json();
          console.log('Response username data is : ', data);
  
          if (data.result && data.result.length > 0) {
            setUsername(data.result[0].username);
          } else {
            console.warn('No username found for the given ID.');
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      };
      fetchUsername(id);
    }
  };

  const handleClick = () => {
    document.getElementById('profile-input').click();
  };
  
  // const [selectedImage, setSelectedImage] = useState(getLoginCredentials[0]?.profile || defaultimg);

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = async (e) => {
  //       const imageUrl = e.target.result;
  //       setSelectedImage(imageUrl);
  //       localStorage.setItem('profileImage', imageUrl); // Store the image in local storage
  //       try {
  //         const response = await fetch(`http://localhost:5000/update_userprofile`, {
  //           method: 'PUT',
  //           headers: {
  //             'Content-Type': 'application/json'
  //           },
  //           body: JSON.stringify({
  //             id: id,
  //             profile: imageUrl,
  //           }),
  //         });
  //         const data12 = await response.json();
  //         console.log(data12);
  //         alert('Image Uploaded');
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target.result;
        setSelectedImage(imageUrl);
        localStorage.setItem('profileImage', imageUrl); // Store the image in local storage
        try {
          const response = await fetch(`http://localhost:5000/update_userprofile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: id,
              profile: imageUrl,
            }),
          });
          const data12 = await response.json();
          console.log(data12);
          alert('Image Uploaded');
        } catch (err) {
          console.log(err);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  

  // Retrieve the profile image from local storage
  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setSelectedImage(storedImage);
    }
  }, []);
  

  return (
    <div className="main-container">
  
      <div className="  row   organization-background11" style={containerStyle}>

        <div className="edit-profile-button mb-5 ">
          <Button className="whole-button" 
            onClick={handleClick}
          >
            <img className="Edit-icon" src={pencil} height={15} width={12} alt="Edit Profile"></img>
            Edit Profile 
          </Button>
          <input id="profile-input" type="file" style={{ display: 'none' }} onChange={handleImageChange} />
        </div>
        <div className="ms-1 mb-2 col-auto">
  <div className="mt-1 ms-5 profilepictures">
    {selectedImage ? (
      <img src={selectedImage} width={140} height={150} alt="profileimage" style={{ border: '6px solid #FFFFFF', borderRadius: '10px' }} />
    ) : (
      <img src={profileimage1} width={140} height={150} alt="default profile" style={{ border: '6px solid #FFFFFF', borderRadius: '10px' }} />
    )}
  </div>
</div>


        <div style={{ marginTop: '90px' }} className="col ">
          {/* {console.log('GetLoginCredentiuals : ', getLoginCredentials)} */}
          <div><h3 className="text-xl fw-bold">{organization_name || "Medshyne"}</h3></div>
          <div><p className="text-sm text-gray-700 mt-n2">{organization_type || "School"}</p></div>
        </div>
      </div>
      <div className="organization-panel"  >
        <div className="about-password ms-5">
          <button
            className={`link-button ${section === "about" ? "active-button about-button" : "inactive-button"} about-button `}
            onClick={() => setSectionWithId("about", organizationId)}>
            About
          </button>
          <button
            className={`link-button ${section === "password" ? "active-button" : "inactive-button"} password-button`}
            onClick={() => setSectionWithId("password", organizationId)}>
            Password
          </button>
        </div>
        <hr style={{borderBottom:'2px solid #E8E8E8'}} />
        {section === "about" && (
          <div className="d-flex justify-content-start py-10">
            <div style={{ marginLeft: '-10px', }} className="d-flex w-75">
              <div style={{borderRight:'4px solid #E8E8E8'}} className="d-flex flex-column w-75 ms-5 p-4 bg-white " >
                <h5 className="text-2xl font-semibold mb-4" style={{ left: '-10px',color:'#21272A' }}>Organization Details</h5>
                <div style={{ width: '700px' }} className="row g-3">
                  <div style={{ color: '#00237D', left: '0px' }} className="col-6 fw-bold">Name</div>
                  <div style={{color:'#000000'}} className="col-6">{organization_name || "Loading..."}</div>
                  <div style={{ color: '#00237D' }} className="col-6 fw-bold">Email ID</div>
                  <div style={{color:'#000000'}} className="col-6">{email_id || "Loading ..."}</div>
                  <div style={{ color: '#00237D', left: '-1px' }} className="col-6 fw-bold">Mobile</div>
                  <div style={{color:'#000000'}} className="col-6">{organization_mobile_no || "Loading..."}</div>
                  <div style={{ color: '#00237D', left: '-2px' }} className="col-6 fw-bold">GST Number</div>
                  <div  style={{color:'#000000'}}className="col-6">{gst_number || "Loading..."}</div>
                  <div style={{ color: '#00237D', left: '-2px' }} className="col-6 fw-bold">Organization Registration number</div>
                  <div style={{color:'#000000'}} className="col-6">{organisation_register_no || "Loading..."}</div>
                  <div  style={{ color: '#00237D', left: '-2px' }} className="col-6 fw-bold">Address</div>
                  <div style={{color:'#000000'}}className="col-6">{address || "Loading..."}</div>
                </div>
              </div>
              <div style={{ marginLeft: '100px' }} className=" d-flex flex-column   bg-white justify-content-center ">
                <Button style={{ paddingLeft: '100px', paddingRight: '100px', borderRadius: '8px', }} className="mb-5 bg-primary text-white ">Invite</Button>
                <Button style={{ borderRadius: '8px', width: '270px' }} className="mb-5 bg-primary text-white">Terms & Conditions</Button>
                <Button style={{ borderRadius: '8px' }} className="bg-primary text-white" onClick={handleLogout}>Log out</Button>
              </div>
            </div>
          </div>
        )}
        {section === "password" && (
          <div className="min-vh-50 bg-light d-flex align-items-center justify-content-center">
            <div className="bg-white p-2  d-flex flex-column flex-md-row w-100 max-w-4xl">
              <div className="w-100 w-md-60 p-2" style={{ marginLeft: '23px' }}>
                <div className="mb-2">
                  <label htmlFor="username" className="form-label text-gray-700" style={{ marginLeft: '23px',color:"#21272A" }}>User Name</label>
                  <input
                    style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)", marginLeft: '23px', width: '570px',borderRadius:"8px",height:'41px' }}
                    type="text"
                    className="form-control mt-1" 
                    id="username"
                    value={username}
                    readOnly
                   onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <br />
                <div className="mb-2">
                <label
    htmlFor="new-password"
    className="form-label"
    style={{ marginLeft: '23px', color: errorNewPassword ? 'red' : '#21272A' }}
  >
    New Password
  </label>
                  <div className="input-group">
                    <div style={{ width: '570px', marginLeft: '23px' }} className="password-input">
                    <input
        style={{
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
          height: '41px',
          borderRadius: '8px',
          borderColor: errorNewPassword ? 'red' : '#ced4da'
        }}
        type={showPassword ? "text" : "password"}
        className="form-control"
        id="new-password"
        placeholder=""
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
                      <button className="toggle-password" type="button" onClick={togglePasswordVisibility}>
                        {showPassword ? <img src={openEye} width={23} height={17} alt="Open Eye" /> : <img src={closedEye} width={25} height={20} alt="Closed Eye" />}
                      </button>
                    </div>
                  </div>
                </div>
                <br />
                <div className="mb-2">
                <label
    htmlFor="confirm-password"
    className="form-label"
    style={{ marginLeft: '23px', color: errorConfirmPassword ? 'red' : '#21272A' }}
  >
    Confirm Password
  </label>
                  <div className="confirm-password-input" style={{ marginLeft: '23px' }}>
                  <input
      style={{
        boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
        width: '570px',
        borderRadius: '8px',
        height: '41px',
        borderColor: errorConfirmPassword ? 'red' : '#ced4da'
      }}
      type={showConfirmPassword ? "text" : "password"}
      className="form-control"
      id="confirm-password"
      placeholder=""
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />
                    <button className="toggle-confirm-password" type="button" onClick={toggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? <img src={openEye} width={23} height={17} alt="Open Eye" /> : <img src={closedEye} width={25} height={20} alt="Closed Eye" />}
                    </button>
                  </div>
                </div>
                {errorMessage1 && <div className="error-message" style={{ color: 'red', marginLeft: '23px' }}>{errorMessage1}</div>}
                <br />
                <Button
                  style={{ paddingLeft: '90px', paddingRight: '90px', marginLeft: '23px',borderRadius:'8px' }}
                  variant="primary"
                  className="organization-save"
                  onClick={updatePassword}
                >
                  Save
                </Button>
              </div>
              <div className="w-100 w-md-40 d-flex justify-content-center align-items-center">
                <img src={security} style={{ width: '450px', height: '450px', marginTop: '-20%' }} alt="Security Illustration" className="img-fluid" />
              </div>
            </div>
          </div>
        )}
      </div>
      <br></br>
    </div>
  );
}