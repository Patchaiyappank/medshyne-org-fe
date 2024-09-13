import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import GenericPdfDownloader from './GenericPdfDownloder';
import './Pres.css';
import poke from '../stafflist/blank image.png'
import { useLocation } from 'react-router-dom';
import { MyContext } from "../ProjectContext";

const ProfileComponent = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const { getLoginCredentials, setLoginCredentials } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { state } = useLocation();
  const consult_id = state?.consult_id || ''; // Fallback to empty string if consult_id is not in state
  const [selectOrganization, setSelectOrganization] = useState(() => {
    return getLoginCredentials && getLoginCredentials[0]
      ? getLoginCredentials[0].organization_name
      : "";
  });
  
  console.log('Received consult_id:', consult_id); // Debugging statement

  const [profileData, setProfileData] = useState({
    patient_name: '',
    id_number: '',
    consult_id: '',
    doctor_name: '',
    class: '',
    time: '',
    hcr_name: '',
    age: '',
    sick_type: '',
    parent_mobile: '',
    profile: '',
    prescription_status:'',
    provided:''
  });

  const [prescriptionDetails, setPrescriptionDetails] = useState({
    general_prescription: [],
    consultation_details: [],
    medicine_details: []
  });

  const [providerCheckboxes, setProviderCheckboxes] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [tempData, setTempData] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${baseApiUrl}/viewbyid_prescription_before_provide?organization_name=${selectOrganization}`, {
          params: { consult_id }
        });
        setProfileData(response.data.general_prescription[0]);
        setPrescriptionDetails(response.data);
        setLoading(false);

        // Fetch expiry dates for each medicine
        await fetchExpiryDates(response.data.medicine_details);
      } catch (error) {
        setError(error.response ? error.response.data.message : 'Error fetching profile data');
        setLoading(false);
      }
    };

    const fetchExpiryDates = async (medicineDetails) => {
      try {
        const options = {};
        for (let medicine of medicineDetails) {
          const response = await axios.get(`${baseApiUrl}/expiry_dates_dropdown?organization_name=${selectOrganization}`, {
            params: { medicine_name: medicine.medicine_name }
          });
          options[medicine.medicine_name] = response.data.expiry_date; // Store the expiry dates
        }
        setDropdownOptions(options);
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
      }
    };

    fetchProfileData();
  }, [consult_id]);

  const toggleNewCheckBox = (index, presDetailsID, e) => {
    e.target.value = !e.target.value;

    let data = {
      prescriptiondetails_id: presDetailsID,
      provided: e.target.value ? 1 : 0
    };

    if (Array.isArray(tempData)) {
      let temp = tempData.filter(raw => raw.prescriptiondetails_id === presDetailsID && raw.provided === data.provided);
      if (temp === undefined || temp.length === 0) {
        setTempData(oldArray => [...oldArray, data]);
      } else {
        temp = tempData.filter(raw => raw.prescriptiondetails_id !== presDetailsID);
        setTempData(temp);
      }
    } else {
      setTempData(oldArray => [...oldArray, data]);
    }
  };
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const response = await axios.get(`${baseApiUrl}/expiry_dates_dropdown`);
        setDropdownOptions(response.data.options);
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
      }
    };

    fetchDropdownOptions();
  }, []);

  const handleDropdownChange = (medicineName, event) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [medicineName]: event.target.value
    }));
  };
  const handleSubmit = async () => {
    setSubmitClicked(true);

    try {
      const response = await fetch(`${baseApiUrl}/pills_provided`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tempData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }

      console.log('Prescription data submitted successfully');
    } catch (error) {
      console.error('Error submitting data:', error);
    }

    try {
      const response = await fetch(`${baseApiUrl}/update_quantity_and_provided`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }

      const responseData = await response.json();
      console.log(responseData);

      console.log('Prescription data submitted successfully');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div  className="container-fluid prescontainer ">
  <div className="card profile-container "  style={{borderRadius:'10px'}} >

      <div className="d-flex flex-row mt-3 ">
        <div className="col-md-2  ipresimg">
          <img src={profileData.profile || poke} alt="Profile" className="presimg-fluid"  />
        </div>
    
        <div className="col-md-10 ipress ">
          <div className="row">
            <div className="col-md-3 mt-1">
              <span>
                <h5 className="d-inline" >{profileData.patient_name}</h5><span style={{fontWeight:'450'}}>  ID:</span>&nbsp;&nbsp;
                <p className="d-inline" style={{fontSize:"17px"}}>{profileData.id_number}</p>
              </span>
            </div>
            <div className="col-md-3 col-sm-6 mt-1">
              <span>
                <h6 className="d-inline">Consulting ID</h6>&nbsp;&nbsp;
                <p className="d-inline">({profileData.consult_id})</p>
              </span>
            </div>
            <div className="col-md-2 col-sm-6  mt-1">
              <span>
                <h6 className="d-inline">Doctor:</h6>&nbsp;&nbsp;
                <p className="d-inline">{profileData.doctor_name}</p>
              </span>
            </div>
            <div className=" col-md-3   col-sm-6 ">
            <GenericPdfDownloader
              rootElementId="pdfContent"
              downloadFileName="Prescription"
              profileData={profileData}
              prescriptionDetails={prescriptionDetails}
            />
          </div> 
           
          </div>
      
          <div className="row " style={{marginTop:'-75px'}}>
            <div className="col-md-3 col-sm-6 mt-1">
              <span>
                <h6 className="d-inline">Class:</h6>&nbsp;
                <p className="d-inline">12th</p>
                <h6 className="d-inline"> Division:</h6>&nbsp;&nbsp;
                <p className="d-inline">B</p>
              </span>
            </div>
            <div className="col-md-3 col-sm-6 mt-1">
              <span>
                <h6 className="d-inline">Time:</h6>&nbsp;&nbsp;
                <p className="d-inline">{profileData.time}</p>
              </span>
            </div>
            <div className="col-md-3 col-sm-6 mt-1">
              <span>
                <h6 className="d-inline">HCR:</h6>&nbsp;&nbsp;
                <p className="d-inline">{profileData.hcr_name}</p>
              </span>
            </div>
          
          </div>
          <div className="row " >
            <div className="col-md-3 col-sm-6 mt-2">
              <span>
                <h5 className="d-inline" style={{}}>Age </h5>
                <h5 className="d-inline" style={{fontSize:"17px"}}>{profileData.age}</h5>
              </span>
            </div>
            <div className="col-md-3 col-sm-6 mt-2">
              <span>
                <h6 className="d-inline">Sick Type:</h6>&nbsp;&nbsp;
                <p className="d-inline">{profileData.sick_type}</p>
              </span>
            </div>
            <div className="col-md-3 col-sm-6 mt-2">
              <span>
                <h6 className="d-inline">Contact:</h6>&nbsp;&nbsp;
                <p className="d-inline">{profileData.parent_mobile}</p>
              </span>
            </div>
            
          </div>
        </div>
      </div>

   
  </div>

  <div className="card mt-3 profile-container" style={{borderRadius:'10px'}}>
    <div className="card-body ">
      <h6 style={{fontSize:"15px"}}>Prescription Medicines</h6>
      <p>These are the medicines you want to provide to the Patient as per the Prescription</p>
      <table className="tables" >
        <thead>
          <tr style={{fontSize:'12px'}}>
            <th className='prescriptionth' style={{ display: 'none' }}>Prescription Details ID</th>
            <th  className='prescriptionth'>Medicine Name</th>
            <th  className='prescriptionth'>Pills Tracking Time</th>
            <th  className='prescriptionth'>Food</th>
            <th  className='prescriptionth'>Days</th>
            <th  className='prescriptionth'> Quantity</th>
            <th  className='prescriptionth'>Expiry Date</th>
            <th className="text-center align-middle prescriptionth">Provided</th>
          </tr>
        </thead>
        <tbody>
          {prescriptionDetails.medicine_details.map((medicine, index) => (
            <tr key={index} style={{fontSize:'13px',textAlign:'start'}}>
              <td className='prescriptiontd' style={{display:'none'}}>{medicine.prescriptiondetails_id}</td>
              <td className='prescriptiontd'>{medicine.medicine_name}</td>
              <td className='prescriptiontd'>{medicine.periods}</td>
              <td className='prescriptiontd'>{medicine.food}</td>
              <td className='prescriptiontd'>{medicine.days}</td>
              <td className='prescriptiontd'>{medicine.count}</td>
              <td className='prescriptiontd'>
                    <select
                      value={selectedOptions[medicine.medicine_name] || ''}
                      onChange={(event) => handleDropdownChange(medicine.medicine_name, event)}
                      className="form-select"
                    >
                      {dropdownOptions[medicine.medicine_name]?.map((date, idx) => (
                        <option key={idx} value={date}>{date}</option>
                      ))}
                    </select>
                  </td>
              <td  className="text-center align-middle">
                <input 
                  name="chkBox"
                  className="checkboxpres"
                  type="checkbox"
                  defaultChecked={medicine.prescription_status === 2}
                  onChange={(e) => toggleNewCheckBox(index, medicine.prescriptiondetails_id, e)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="row">
                        <div className="col-md-9"></div>
                        <div className="col-md-3">
                            
                            {!submitClicked && (
                                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                                    <button className="btn btn-primary me-md-2" type="button" style={{ width: '200px',borderRadius:'10px',backgroundColor:'#0089FF',fontSize:'13px' }} onClick={handleSubmit}>Submit</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
    </div>
  </div>

  );
};

export default ProfileComponent;