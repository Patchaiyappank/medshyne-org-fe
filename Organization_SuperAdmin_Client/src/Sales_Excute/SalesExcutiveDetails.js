import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './SalesExcutiveDetails.css'
import avt from '../assest/Avatar 2.png'
import edit from '../assest/Editsss.png'
import access from '../assest/tick-circle.png'
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import stop from '../assest/access_stop.png'

function SalesExcutiveDetails() {


  const [salesExecutive, setSalesExecutive] = useState(null);
  const [profileImg, setProfileImg] = useState();
  const [accessGranted, setAccessGranted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const { id, r_m_id } = useParams();
  // const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  // const {id_number} = location.state || {};
  // const {id_number } = location.state || {};
  console.log(`Received ID: ${id}`);
  const handleDelete = async () => {

    fetch(`http://localhost:5000/superAdmin_sales_executive_delete_btn?sal_exe_id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.Result === "Success") {
          alert('Regional Manager Deleted Successfully!');
          navigate(`/Sales/${salesExecutive.r_m_id}`);
        } else {
          alert('Failed to delete Regional Manager. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
      });

    // try {
    //   const response = await axios.put(
    //     `http://localhost:5000/superAdmin_sales_executive_delete_btn/${id}`,
    //     // null, // No body, so pass null
    //     // {
    //     //   params: { sal_exe_id: id },
    //     // }
    //   );

    //   if (response.data.Result === "Success") {
    //     alert('Regional Manager Deleted Successfully!');
    //     navigate('/Sales');
    //   } else {
    //     alert('Failed to delete Regional Manager. Please try again.');
    //   }
    // } catch (error) {
    //   console.error('Error deleting Regional Manager:', error);
    //   alert('An error occurred. Please try again later.');
    // }
  };
  const handleGrantAccess = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/superAdmin_sales-executive_give_access_btn`,
        null,
        {
          params: { sal_exe_id: id },
        }
      );


      if (response.data.Result === "Success") {
        setAccessGranted(true);
        alert('Access granted successfully!');
        fetchSalesExecutive();
      } else {
        alert('Failed to grant access.');
      }
    } catch (error) {
      console.error('Error granting access:', error);
      alert('Error occurred while granting access.');
    }
  };

  const handleStopAccess = async () => {
    try {
      const response = await axios.put(
        'http://localhost:5000/superAdmin_sales-executive_stop_access_btn',
        null,
        {
          params: { sal_exe_id: id },
        }
      );

      if (response.data.Result === "Success") {
        setAccessGranted(false);
        alert('Access Stopped Successfully!');
        fetchSalesExecutive();
      } else {
        alert('Failed to stop access.');
      }
    } catch (error) {
      console.error('Error stopping access:', error);
      alert('Error occurred while stopping access.');
    }
  };
  useEffect(() => {



    fetchSalesExecutive();
  }, [id]);

  const fetchSalesExecutive = async () => {
    try {
      //   const response = await axios.get(`http://localhost:5000/superAdmin_view_sales-executive_by_id/${id}`);

      //   setSalesExecutive(response.data[0]);
      //   // if (data.Result && response.data.Result[0].access_btn === 1) {
      //   //   setAccessGranted(true);
      //   // }

      // } catch (error) {
      //   console.error("Error fetching sales executive details:", error);
      //   if (error.response) {
      //     console.error("Response data:", error.response.data);
      //     console.error("Response status:", error.response.status);
      //     console.error("Response headers:", error.response.headers);
      //   }
      // }
      const response = await fetch(
        `http://localhost:5000/superAdmin_view_sales-executive_by_id/${id}`
      ); // Use the dynamic ID here
      const data = await response.json();

      // Log the raw response
      console.log("API Response:", data);


      // Adjust based on the actual response structure
      if (Array.isArray(data) && data.length > 0) {
        // Directly setting the first item in the array
        // setRmDetails(data[0]);
        setSalesExecutive(data[0]);
      } else if (
        data.Result &&
        Array.isArray(data.Result) &&
        data.Result.length > 0
      ) {
        // Handle if the API response has a `Result` field
        //  setRmDetails(data.Result[0]);
        setSalesExecutive(data[0].Result[0]);
      } else {
        console.error("Unexpected API response format:", data);
      }

      if (data.Result && response.data.Result[0].access_btn === 1) {
        setAccessGranted(true);
      }
      // if (data.Result && Array.isArray(data.Result) && data.Result.length > 0) {
      //   const salesExecutive = data.Result[0]; // Access the first sales executive
      //   setSalesExecutive(salesExecutive); // Set the state for sales executive

      //   // Check and set the access based on access_btn value
      //   if (salesExecutive.access_btn === 1) {
      //     setAccessGranted(true);
      //   } else {
      //     setAccessGranted(false);
      //   }
      // } else {
      //   console.error("Unexpected API response format:", data);
      // }

    }
    catch (error) {
      console.error("Error fetching Regional Manager details:", error);
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImg(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);

      event.target.value = null;
    }
  }

  const handleEdit = (id_number) => {
    alert(id_number);
    navigate(`/Stock/${r_m_id}`, {
      state: {
        id_number: id_number,
        mode: 'edit'
      }
    });
    console.log(`Edit salesExcutive with ID ${id_number}`);
  };
  return (

    <div className='overall-SalesExcutivedetails' style={{ backgroundColor: '#F9F9F9' }}><br />
      <h3 className='SalesExcutivedetails-head'>&nbsp;&nbsp;Regional manager</h3>


      <hr className='line' style={{ border: '1px solid #0000001A', marginBottom: '7px', marginTop: '20px', marginLeft: '5px' }} />

      <div className='SalesExcutivedetails-container-fluid SalesExcutivedetails-content' style={{ marginLeft: '21px' }}>
        <div className="row mt-3">
          <div className="col-sm-6 custom-mobile-col">
            <div className="p-4 " style={{ marginTop: '20px', fontSize: '14px', color: '#212121', fontWeight: '500' }}>Sales Executive details</div>
          </div>
          <div className="col-sm-6 custom-mobile-col">
            <div className="p-3 row">
              <div className="col-sm-2 custom-mobile-col">
                <button className="SalesExcutivedetails-btn" onClick={() => handleEdit(id)} style={{ width: '125px', marginTop: '10px', marginLeft: '-10px', backgroundColor: '#0089FF' }}>
                  <img style={{ marginRight: '10px', marginBottom: '3px', marginLeft: '-10px' }} src={edit} height={15} width={12} alt="Edit Profile" />Edit details</button>
              </div>
              <div className="col-sm-2 custom-mobile-col">
                {/* {salesExecutive.access_btn ==1 ? (
                <button onClick={handleStopAccess} className="SalesExcutivedetails-btn btn-primary" style={{width:'145px', marginTop: '10px', marginLeft: '50px', backgroundColor: 'red' }}>
                  <img style={{ marginRight: '10px', marginBottom: '3px', marginLeft: '-10px' }} src={stop} height={25} width={22} alt="Edit Profile" />Stop Access</button>
                ) : (
                  <button onClick={handleGrantAccess} className="SalesExcutivedetails-btn btn-primary" style={{width:'145px', marginTop: '10px', marginLeft: '50px', backgroundColor: '#00AB4F' }}>
                  <img style={{ marginRight: '10px', marginBottom: '3px', marginLeft: '-10px' }} src={access} height={25} width={22} alt="Edit Profile" />Give Access</button>
                  )} */}
                   {salesExecutive ? (
                <button
                  onClick={salesExecutive.access_btn == 1 ? handleStopAccess : handleGrantAccess}
                  className="SalesExcutivedetails-btn btn-primary"
                  style={{
                    width: '145px',
                    marginTop: '10px',
                    marginLeft: '50px',
                    backgroundColor: salesExecutive.access_btn == 1 ? 'red' : '#00AB4F'
                  }}>
                  <img
                    style={{ marginRight: '10px', marginBottom: '3px', marginLeft: '-10px' }}
                    src={salesExecutive.access_btn == 1 ? stop : access}
                    height={25}
                    width={22}
                    alt={salesExecutive.access_btn == 1 ? "Stop Access" : "Give Access"}
                  />
                  {salesExecutive.access_btn == 1 ? "Stop Access" : "Give Access"}
                </button>
              ) : (
                <p></p>
              )}

              </div>
              <div className="col-sm-2 custom-mobile-col">
                <button onClick={handleDelete} className="SalesExcutivedetails-btn btn-success" style={{ width: '165px', marginTop: '10px', marginLeft: '130px', backgroundColor: '#E51837' }}>Delete</button>
              </div>
            </div>
          </div>
          <hr className='line' style={{ border: '2px solid #0000001A', marginBottom: '7px', marginTop: '-1px', marginLeft: '16px', width: '1040px' }} />
        </div>
        <div className="row mt-3">
          {salesExecutive ? (
            <div className="col-sm-4 custom-mobile-col">

              {/* {profileImg ? (<img className="img-avt" width={290} height={255} borderRadius={10} src={profileImg} />
                ) : (<img className="img-avt" width={290} height={255} src={avt} />

                )} */}
              <img className="img-avt" width={290} height={255} style={{ borderRadius: '15px', paddingLeft: '10px' }} src={salesExecutive.profile} />
              <input id="profile-input" type="file" style={{ display: 'none' }} onChange={handleImageChange} />
              {/* <button onClick={handleClick} className="pic-btn" style={{ width: '40%', height: '40px', backgroundColor: '#0089FF', borderRadius: '30px', marginLeft: '24%', marginTop: '-30px', border: 'none', color: 'white' }}>upload</button> */}

            </div>
          ) : (
            <p></p>
          )}
          <div className="col-sm-8 custom-mobile-col" >
            <div className="p-3">
              {salesExecutive ? (
                <from>
                  <div className="row">

                    <div className="col-sm-3 custom-mobile-col">

                      <label style={{ color: '#B5B5C3' }}>Employee Nmae</label><br />
                      <h6 style={{ color: '#464E5F' }}>{salesExecutive.sal_exe_name}</h6>

                    </div>

                    <div className="col-sm-3 custom-mobile-col">
                      <label style={{ color: '#B5B5C3' }}>ID</label><br />
                      <h6 style={{ color: '#464E5F' }}>{salesExecutive.sal_exe_id}</h6>
                    </div>
                    <div className="col-sm-2 custom-mobile-col">
                      <label style={{ color: '#B5B5C3' }}>Mobile&nbsp;Number</label><br />
                      <h6 style={{ color: '#464E5F' }}>{salesExecutive.phone_number_code}</h6>
                    </div>
                  </div><br />
                  <div className="row">
                    <div className="col-sm-3 custom-mobile-col">
                      <label style={{ color: '#B5B5C3' }}>Gender</label><br />
                      <h6 style={{ color: '#464E5F' }}>{salesExecutive.gender}</h6>
                    </div>
                    <div className="col-sm-3 custom-mobile-col">
                      <label style={{ color: '#B5B5C3' }}>Qualification</label><br />
                      <h6 style={{ color: '#464E5F' }}>{salesExecutive.qualification}</h6>
                    </div>
                    <div className="col-sm-2 custom-mobile-col">
                      <label style={{ color: '#B5B5C3' }}>Email Address</label><br />
                      <h6 style={{ color: '#464E5F' }}>{salesExecutive.e_mail}</h6>
                    </div>
                  </div><br />
                  <div className="row">
                    <div className="col-sm-4 custom-mobile-col">
                      <label style={{ color: '#B5B5C3' }}>Age</label><br />
                      <h6 style={{ color: '#464E5F' }}>{salesExecutive.age}</h6>
                    </div>
                    <div className="col-sm-4 custom-mobile-col" style={{ marginLeft: '-53px' }}>
                      <label style={{ color: '#B5B5C3' }}>Blood Group</label><br />
                      <h6 style={{ color: '#464E5F' }}>{salesExecutive.blood_group}</h6></div>
                  </div><br />
                  <div className="row">
                    <div className="col-sm-8 custom-mobile-col">
                      <label style={{ color: '#B5B5C3' }}>Address</label><br />
                      <h6 style={{ color: '#464E5F' }}>{salesExecutive.total_address}</h6>
                    </div>

                  </div>
                </from>
              ) : (
                <p></p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
export default SalesExcutiveDetails;