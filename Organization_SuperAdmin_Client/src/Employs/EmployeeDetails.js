import React, { useState, useEffect } from "react";
import '../Employs/EmployeeDetails.css'
import avt from '../assest/Avatar 2.png'
import edit from '../assest/Editsss.png'
import access from '../assest/tick-circle.png'
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import stop from '../assest/access_stop.png'
function EmplyeeDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state || {};
  const [employee, setEmployee] = useState({

    profile: ''

  });
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [currentErrorMessage, setCurrentErrorMessage] = useState('');
 
  const {id} = location.state || {};
  
  const handleDeleteEmployee = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/superAdmin_employee_delete_by_id?emp_id=${id}`);
  
      if (response.data.Result === "Success") {
        console.log(response.data.message);
        alert('Employee successfully Deleted ')
        navigate('/EmploysManagenmenthead', {
          state: { mode: 'Employ' }
        });
      } else {
        console.error(response.data.message);
        // Handle failure scenario (e.g., show an error message to the user)
      }
    } catch (error) {
      console.error("There was an error deleting the employee:", error);
      // Handle error scenario (e.g., show a generic error message to the user)
    }
  };

  const [accessGranted, setAccessGranted] = useState(false);



const handleGrantAccesst = async () => {
  try {
    const accessStatus = 1;
    const response = await axios.put(
      `http://localhost:5000/superAdmin_employee_give_access_bts?emp_id=${id}`,
      { give_access: accessStatus }
    );

    if (response.data.Result === "Success") {
      console.log(response.data.message);
      alert("Access granted successfully");
      setAccessGranted(true); // Set state to reflect the access is now granted
    } else {
      console.error(response.data.message);
    }
  } catch (error) {
    console.error("There was an error granting access:", error);
  }
};

const handleStopAccess = async () => {
  try {
    const accessStatus = 0;
    const response = await axios.put(
      `http://localhost:5000/superAdmin_employee_give_access_bts?emp_id=${id}`,
      { give_access: accessStatus }
    );

    if (response.data.Result === "Success") {
      console.log(response.data.message);
      alert("Access revoked successfully");
      setAccessGranted(false); // Set state to reflect the access is now stopped
    } else {
      console.error(response.data.message);
    }
  } catch (error) {
    console.error("There was an error stopping access:", error);
  }
};

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:5000/superAdmin_view_employee_by_id?emp_id=${id}}`);
        if (!response.ok) {
          throw new Error('Employee not found or server error');
        }
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEmployee();
  }, [id]);

  const [profileImage, setProfileImage] = useState('');

  const handleFile = async (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      if (selectedFile.size <= 2 * 1024 * 1024) {
        try {
          const base64Data = await toBase64(selectedFile);
          setFile(base64Data);
          setEmployee({ ...employee, profile: base64Data });
          setCurrentErrorMessage('');
        } catch (error) {
          console.error("Error converting file to Base64:", error);
        }
      } else {
        setFile(null);
        setCurrentErrorMessage('File size exceeds 2MB limit');
      }
    } else {
      setFile(null);
      setCurrentErrorMessage('Only PDF, JPG, JPEG, and PNG file types are allowed.');
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

 

  const handleProfileUpdate = async () => {
    // Trigger the file input to open the file picker dialog
    document.getElementById('profile-input').click();
  
    // Listen for file selection
    document.getElementById('profile-input').onchange = async (event) => {
      const file = event.target.files[0];
  
      if (file) {
        // Convert the file to a Base64 string
        const toBase64 = (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
  
        const imageBase64 = await toBase64(file);
  
        const updatedFormData = { ...employee, profile: imageBase64 };
  
        try {
          const response = await axios.put(
            `http://localhost:5000/superAdmin_employee_updateProfile?emp_id=${id}`,
            updatedFormData,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
  
          if (response.data.Result === 'Success') {
            alert('Profile updated successfully!');
          } else {
            alert('Failed to update profile.');
          }
        } catch (error) {
          console.error('Error uploading the profile image:', error);
          alert('An error occurred while updating the profile.');
        }
      }
    };
  };
  
  const handleEdit = (id_number) => {
    alert(id_number);
    navigate('/AddEmpolyee', {
      state: {
        id_number: id_number,
        mode: 'edit'
      }
    });
    console.log(`Edit salesExcutive with ID ${id_number}`);
  };

  return (

    <div className='overall-Employeedetails' style={{ backgroundColor: '#F9F9F9' }}><br />
      <h3 className='SalesExcutivedetails-head'>&nbsp;&nbsp;Employ</h3>


      <hr className='Employeedetails-line' style={{ border: '1px solid #0000001A', marginBottom: '7px', marginTop: '20px', marginLeft: '5px' }} />

      <div className='container-fluid Employeedetails-content' style={{ marginLeft: '21px' }}>
        <div className="row mt-3">
          <div className="col-sm-6 custom-mobile-col">
            <div className="p-4 " style={{ marginTop: '20px', fontSize: '14px', color: '#212121', fontWeight: '500' }}>Employ details</div>
          </div>
          <div className="col-sm-6 custom-mobile-col employee-button">
            <div className="p-3 row">
              <div onClick={() => handleEdit(employee.emp_id)} className="col-sm-2 custom-mobile-col">
                <button className="SalesExcutivedetails-btn " style={{ width: '125px', marginTop: '10px', marginLeft: '-10px', backgroundColor: '#0089FF' }}>
                  <img style={{ marginRight: '10px', marginBottom: '3px', marginLeft: '-10px' }} src={edit} height={15} width={12} alt="Edit Profile" />Edit details</button>
              </div>
              <div className="col-sm-2 custom-mobile-col">
              {accessGranted ? (
                <button onClick={handleStopAccess} className="SalesExcutivedetails-btn btn-primary" style={{ width: '145px', marginTop: '10px', marginLeft: '50px', backgroundColor: 'red' }}>
                  <img style={{ marginRight: '10px', marginBottom: '3px', marginLeft: '-10px' }} src={stop} height={25} width={22} alt="Edit Profile" /> Stop Access</button>
              ) : (
                <button onClick={handleGrantAccesst} className="SalesExcutivedetails-btn btn-primary" style={{ width: '145px', marginTop: '10px', marginLeft: '50px', backgroundColor: '#00AB4F' }}>
                  <img style={{ marginRight: '10px', marginBottom: '3px', marginLeft: '-10px' }} src={access} height={25} width={22} alt="Edit Profile" />Give Access</button>
              )}
             </div>
             
              <div className="col-sm-2 custom-mobile-col">
                <button onClick={() => handleDeleteEmployee(employee.emp_id)} className="SalesExcutivedetails-btn btn-success" style={{ width: '165px', marginTop: '10px', marginLeft: '130px', backgroundColor: '#E51837' }}>Delete</button>
              </div>
             
            </div>
          </div>
          <hr className='employee-line' style={{ border: '2px solid #0000001A', marginBottom: '7px', marginTop: '-1px', marginLeft: '13px', width: '999px' }} />
        </div>
        <div className="row mt-3">

          <div className="col-sm-4 custom-mobile-col">

            {/* {profileImg ? (<img className="img-avt" width={290} height={255} borderRadius={10} src={profileImg} />
                ) : (<img className="img-avt" width={290} height={255} src={avt} />

                )} */}
            {/* <input id="profile-input" onChange={handleFile} type="file" style={{ display: 'none' }} />
                <img className="img-avt" width={290} height={255} style={{borderRadius:'15px'}} src={formData.profile} name="profile" value={formData.profile} />
     
                <button onClick={handleProfileUpdate} className="upload-btn" style={{ width: '40%', height: '40px', backgroundColor: '#0089FF', borderRadius: '30px', marginLeft: '24%', marginTop: '-10px', border: 'none', color: 'white' }}>upload</button>
                */}
            <input

              type="file"
              onChange={handleFile}
              id="profile-input"

              style={{ display: 'none' }}
            />
            {employee.profile ? (
              <img
                src={typeof employee.profile === 'string' ? employee.profile : URL.createObjectURL(employee.profile)}
                name="profile"
                value={employee.profile}
                alt="Uploaded file preview"
                width={290} height={255}
                style={{ borderRadius: '25px' }}
              />
            ) : (
              <img
                src={avt}
                name="profile"
                value={employee.profile}
                alt="Uploaded file preview"
                width={290} height={255}
                style={{ borderRadius: '25px', marginTop: '-9px' }}
              />
            )}
            <button
              onClick={handleProfileUpdate}
              className="upload-btn" style={{ width: '40%', height: '40px', backgroundColor: '#0089FF', borderRadius: '30px', marginLeft: '24%', marginTop: '-10px', border: 'none', color: 'white' }}
            >
              Upload
            </button>
            {currentErrorMessage && (
              <p style={{ color: 'red', marginTop: '10px' }}>{currentErrorMessage}</p>
            )}


          </div>

          <div className="col-sm-8 custom-mobile-col" >
            <div className="p-2">

              <from>
                <div className="row">

                  <div className="col-sm-3 custom-mobile-col">

                    <label style={{ color: '#B5B5C3' }}>Employee&nbsp;Name</label><br />
                    {employee ? (
                      <h6 style={{ color: '#464E5F' }}>{employee.emp_name}</h6>
                    ) : (
                      <p></p>
                    )}

                  </div>

                  <div className="col-sm-3 custom-mobile-col">
                    <label style={{ color: '#B5B5C3' }}>ID</label><br />
                    {employee ? (
                      <h6 style={{ color: '#464E5F' }}>{employee.emp_id}</h6>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div className="col-sm-2 custom-mobile-col">
                    <label style={{ color: '#B5B5C3' }}>Mobile&nbsp;Number</label><br />
                    {employee ? (
                      <h6 style={{ color: '#464E5F' }}>{employee.phone_number}</h6>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div><br />
                <div className="row">
                  <div className="col-sm-3 custom-mobile-col employ-gender">
                    <label style={{ color: '#B5B5C3' }}>Gender</label><br />
                    {employee ? (
                      <h6 style={{ color: '#464E5F' }}>{employee.gender}</h6>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div className="col-sm-3 custom-mobile-col">
                    <label style={{ color: '#B5B5C3' }}>Qualification</label><br />
                    {employee ? (
                      <h6 style={{ color: '#464E5F' }}>{employee.qualification}</h6>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div className="col-sm-2 custom-mobile-col">
                    <label style={{ color: '#B5B5C3' }}>Email&nbsp;Address</label><br />
                    {employee ? (
                      <h6 style={{ color: '#464E5F' }}>{employee.e_mail}</h6>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div><br />
                <div className="row">
                  <div className="col-sm-4 custom-mobile-col">
                    <label style={{ color: '#B5B5C3' }}>Age</label><br />
                    {employee ? (
                      <h6 style={{ color: '#464E5F' }}>{employee.age}</h6>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div className="col-sm-4 custom-mobile-col" style={{ marginLeft: '-53px' }}>
                    <label style={{ color: '#B5B5C3' }}>Blood&nbsp;Group</label><br />
                    {employee ? (
                      <h6 style={{ color: '#464E5F' }}>{employee.blood_group}</h6>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div><br />
                <div className="row">
                  <div className="col-sm-8 custom-mobile-col">
                    <label style={{ color: '#B5B5C3' }}>Address</label><br />
                    {employee ? (
                      <h6 style={{ color: '#464E5F' }}>{employee.address}</h6>
                    ) : (
                      <div></div>
                    )}
                  </div>

                </div>
              </from>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
export default EmplyeeDetails;