import React, { useState, useEffect } from "react";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
// import placeholderImage from './doctor1.png';
import './Appoinment.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import appoint from "./Appointment.png";


export default function Component() {

  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [getname, setname] = useState('');
  const [getclasses, setclasses] = useState('');
  const [getdivision, setdivision] = useState('');
  const [getID, setID] = useState('');
  const [doctorDetails, setDoctorDetails] = useState([]);
  const [getAvailabilityDetails, setAvailabilityDetails] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTiming, setSelectedTiming] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedHCR, setSelectedHCR] = useState('');
  const [selectedTimingFrom, setSelectedTimingFrom] = useState(null);
  const [appointmentSubmitted, setAppointmentSubmitted] = useState(false);
  const [selectedTimingsByDoctor, setSelectedTimingsByDoctor] = useState({});
  const [getSickType, setSickType] = useState("");
  const [currentSelectedTiming, setCurrentSelectedTiming] = useState(null);
  const[symptom,setSymptoms]=useState("");
  const navigate = useNavigate();
  
  // const [selectedTimingFrom, setSelectedTimingFrom] = useState(null);


  const [doctorName, setDoctorName] = useState("");
  const [doctorEducation, setDoctorEducation] = useState("");
  const [doctorProfile, setDoctorProfile] = useState("");
  const [doctorExperience, setDoctorExperience] = useState("");
 

  

  const [isLoading, setIsLoading] = useState(false); 


  const handleCancleView = () => {

    navigate('/Dashboard')

  }



  useEffect(() => {
    // fetchData();
    fetchdoctorData();
    //fetchHcrNames();
  }, []);

  const handleChange = (e) => {
    setID(e.target.value);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
  };
    
  const { state } = useLocation();
  const consult_id = state?.consult_id;
  
  useEffect(() => {
    if (consult_id) {
      fetchappointment(consult_id);
    } else {
      console.error('No consult_id provided.');
    }
  }, [consult_id]);


  const fetchappointment =  (consult_id) => {
    alert(consult_id)
    const data = { consult_id: consult_id};
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    try {
      const bodyText = { consult_id: consult_id};
      setIsLoading(true);
      const response =  fetch(`${baseApiUrl}/viewbyid_appointment_detail`,options)
      .then((response) => response.json())
      .then((responseText) => {
           if(responseText.staff== undefined)
           return responseText;
        console.log('appointment detail', responseText);
        setID(responseText.staff[0].consult_id);
        setname(responseText.staff[0].patient_name);
        setclasses(responseText.staff[0].classes);
       setdivision(responseText.staff[0].division);
       setSelectedRole(responseText.staff[0].hcr_name);
     setSickType(responseText.staff[0].sick_type)
    setDoctorName(responseText.staff[0].assignee);
    setDoctorEducation(responseText.staff[0].education);
    setDoctorProfile(responseText.staff[0].doctor_profile);
    setDoctorExperience(responseText.staff[0].work_experience); 
    setSymptoms(responseText.staff[0].health_problem);
    setSelectedTimingFrom(responseText.staff[0].from_time);
      
      })
      .catch((error) => {
          console.error(error);
      });
    } catch (error) {
      console.error(error);
    }
  }

  const updateAppointmentDetails =  (consult_id) => {
    try {
      console.log('Updating appointment details for id_number:', consult_id);
  
      const data = {
        consult_id: consult_id, 
        patient_name: getname,
        classes: getclasses,
        division: getdivision,
        health_problem: symptom,
        sick_type: getSickType,
        hcr_name: selectedRole,
        assignee: doctorName,
        from_time: selectedTimingFrom
      };
      
      
     // const url = '${baseApiUrl}/edit_appointment_details/${id_number}';
     const url = `${baseApiUrl}/edit_appointment_details`;
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then(response => response.json())
      .then(data => console.log('Data Updated ',data)).catch(err => console.log('Error ',err));
  
      alert("Appointment updated successfully");
      navigate('/Dashboard');
      
    } catch (error) {
      console.error('Error updating appointment details:', error);
    }
  };
  
  
   // Inside handleSelectTimingFrom function
const handleSelectTimingFrom = (timing) => {
  console.log("Selected timing from handleSelectTimingFrom:", timing.from_time); // Add logging here
  setSelectedTimingFrom(timing.from_time); 
  setCurrentSelectedTiming(timing);
  setSelectedTimingsByDoctor((prevSelectedTimings) => ({
    ...prevSelectedTimings,
    [selectedDoctor?.doctor_id]: timing,
  }));
};

// Inside your component where you're displaying the selected timing


  // const updatedAvailabilityDetails = getAvailabilityDetails.map((timing) => {
  //   if (timing.child_available_id === timing.child_available_id) {
  //     return { ...timing, disable_bts: 1 }; // Set disable_bts to 1 to disable the timing
  //   }
  //   return timing;
  // });

  // console.log("Updated Availability Details:", updatedAvailabilityDetails);

  // setAvailabilityDetails(updatedAvailabilityDetails);
  // localStorage.setItem(
  //   "selectedTimings",
  //   JSON.stringify(selectedTimingsByDoctor)
  // );
  const updateViewTime = async (timing) => {
    try {
      const response = await fetch(`${baseApiUrl}/update_view_time`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disable_bts: 1, // Update disable_bts to 1
          child_available_id: timing.child_available_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update view time');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error updating view time:', error);
    }
  };



  useEffect(() => {
    if (appointmentSubmitted && selectedTiming) {
      updateViewTime(selectedTiming.child_available_id);
    }
  }, [appointmentSubmitted, selectedTiming]);

 

     
  useEffect(() => {
    const sickTypeElement = document.getElementById('sick-type');
    const symptomElement = document.getElementById('symptom');
    if (appointmentSubmitted) {
      console.log("Doctor Details:", selectedDoctor);
      console.log("assignee:", selectedDoctor?.doctor_name); // Use optional chaining to prevent errors if selectedDoctor is null
      console.log("Patient Details:", {
        id_number: getID,
        patient_name: getname,
        classes: getclasses,
        division: getdivision,
        sick_type: sickTypeElement.value,
        health_problem: symptomElement.value,
        hcr_name: selectedRole
      });
    }
  }, [appointmentSubmitted]);

  // useEffect(() => {
  //   console.log("Selected Timing:", selectedTiming);
  // }, [selectedTiming]);

  // useEffect(() => {
  //   console.log("Updated Timings:", getAvailabilityDetails);
  // }, [getAvailabilityDetails]);

  // useEffect(() => {
  //   if (appointmentSubmitted && selectedTimingFrom) {
  //     updateAppointment();
  //   }
  // }, [appointmentSubmitted, selectedTimingFrom]);


  // const updateAppointment = async (formattedTime) => {
  //   try {
  //     // Check if formattedTime is a valid date string
  //     if (isNaN(new Date(formattedTime))) {
  //       console.error('Invalid date string:', formattedTime);
  //       return;
  //     }
  
  //     // Check if id_number is provided and valid
  //     if (!getID || isNaN(parseInt(getID))) {
  //       console.error('Invalid id_number:', getID);
  //       return;
  //     }
  
  //     // Format the selected timing from
  //     const formattedFromTime = new Date(formattedTime).toLocaleTimeString('en-US', { hour12: false });
  //     console.log('Formatted from time:', formattedFromTime); // Log the formatted time for debugging
  
  //     const response = await fetch('${baseApiUrl}/insert_appointment', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         id_number: parseInt(getID), // Ensure id_number is an integer
  //         patient_name: getname,
  //         classes: getclasses,
  //         division: getdivision,
  //         sick_type: document.getElementById('sick-type').value, // Replace with actual value
  //         health_problem: document.getElementById('symptom').value, // Replace with actual value
  //         hcr_name: selectedHCR,
  //         doctor_id: selectedDoctor?.doctor_id,
  //         assignee: selectedDoctor?.doctor_name,
  //         from_time: formattedFromTime, // Use the formattedFromTime instead of formattedTime
  //       }),
  //     });
  
  //     const data = await response.json();
  //     console.log('Inserted Appointment', data);
  //   } catch (error) {
  //     console.error('Error inserting appointment:', error);
  //   }
  // };
  
  
 // Inside handleGetAppointment function
 const handleGetAppointment = async () => {
  // setAppointmentSubmitted(true);
  // console.log("Selected timing for appointment:", selectedTimingFrom);

  // // Check if selectedTimingFrom is defined
  // if (!selectedTimingFrom) {
  //   console.error('Selected timing is undefined');
  //   return;
  // }

  // // Convert the selected time to a valid time format
  // const selectedDate = new Date();
  // const [hours, minutes] = selectedTimingFrom.split(':');
  // selectedDate.setHours(parseInt(hours, 10));
  // selectedDate.setMinutes(parseInt(minutes, 10));

  // // Check if selectedDate is a valid date
  // if (isNaN(selectedDate.getTime())) {
  //   console.error('Invalid selected date:', selectedTimingFrom);
  //   return;
  // }

  // // Format the selected date
  // const formattedTime = selectedDate.toISOString();

  // // Call updateAppointment with the formatted time
  // await updateAppointment(formattedTime);

  await updateAppointmentDetails(consult_id);
};


  const buttonClass = (timing) => {
    if (timing.disable_bts === 1) {
      return "btn btn-secondary disabled"; // Gray out unavailable timings
    } else if (selectedTimingFrom === timing.from_time && !appointmentSubmitted) {
      return "btn btn-primary"; // Primary color for selected timing
    } else if (selectedTimingFrom === timing.from_time && appointmentSubmitted) {
      return "btn btn-secondary disabled"; // Gray out the selected timing after submission
    } else {
      return "btn btn-outline-primary"; // Available timings in outline primary color
    }
  };
  
  let timeButtons;
  useEffect(() => {
    timeButtons = getAvailabilityDetails.map((item, index) => {
      return <Button key={index} value={item.day}>{item.day}</Button>;
    });
  }, [doctorDetails, getAvailabilityDetails]);


  // useEffect(() => {
  //   if (Array.isArray(getAvailabilityDetails)) {
  //     timeButtons = getAvailabilityDetails.map((item, index) => {
  //       return <Button key={index} value={item.day}>{item.day}</Button>;
  //     });
  //   } else {
  //     console.error('getAvailabilityDetails is not an array');
  //   }
  // }, [doctorDetails, getAvailabilityDetails]);
  

  // const fetchData = () => {
  //   try {
  //     fetch(`${baseApiUrl}/consulting_detail?id_number=${getID}`, {
  //       method: 'GET',
  //       'Content-Type': 'application/json'
  //     }).then((response) => response.json())
  //       .then((data12) => {
  //         console.log('GET DATA FETCHED ',data12);
  //         setname(data12.name);
  //         setclasses(data12.classes);
  //         setdivision(data12.division);
  //       })
  //       .catch((error) => console.error('Error:', error));
  //   } catch (error) {
  //     console.error("Error fetching details:", error);
  //   }
  // };

  const fetchdoctorData = async () => {
    try {
      const response = await fetch(`${baseApiUrl}/view_time`, {
        method: 'GET'
      });
      const data = await response.json();
      console.log('Doctor Data ',data.availabilityDetails);
      console.log('Doctor Data ',data.doctorDetails);
      setDoctorDetails(data.doctorDetails);
      setAvailabilityDetails(data.availabilityDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const fetchHcrNames = () => {
  //   try {
  //     fetch('${baseApiUrl}/hcrname_dropdown')
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log('HCR NAMES FETCHED', data);
  //       if (data.Result === "Success") {
  //         setHcrNames(data.data);
  //       } else {
  //         console.error('Error fetching HCR names:', data.message);
  //       }
  //     })
  //     .catch(error => console.error('Error:', error));
  //   } catch (error) {
  //     console.error("Error fetching HCR names:", error);
  //   }
  // };

  return (
    <div className="" style={{ backgroundColor: '#F5F5F5', padding: '5%', minHeight: '100vh',marginTop:'3%' }}>
      <h4 className="mb-4 ml-5 fw-bold" >General Physician Doctors Available</h4>
      <div className="row row-cols-lg-7 ms-3">
        
          
              <div className="ms-3 col">
              <div className="d-flex flex-column align-items-start p-4 border bg-white shadow-sm" style={{ width: '210px' }}>
              <img  className="mb-2  mx-auto" src={doctorProfile} style={{ maxWidth: "90%", height: "auto",borderRadius:'10px' }} />
                  <div>
                  <h6 className="text-sm mb-1 fw-bold ms-1" style={{ fontSize: '12px' }}>
                  {doctorName}
                  <span className="text-xs fw-medium ms-2" style={{ fontSize: '11px' }}>({doctorEducation})</span>
                </h6>
                <p className="text-xs text-muted mb-1 ms-1" style={{ fontSize: '10px' }}>
                {doctorExperience} years of Experience
                </p>
              </div>
                   
              <Button className={`btn btn-sm  'btn-primary mt-2 `}
              style={{border: '2px solid #0089FF',color:'#0089FF',backgroundColor:"white",marginLeft:'5px',  width: '140px',
                    fontSize:'14px',
                    height: '35px', alignItems: 'center',
                    marginTop: '10px',}}>Selected</Button>
  
                </div>
              </div>
          
        </div>
        <br/>
        <div className="mx-5 p-4 mt-1" style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",backgroundColor:'white',width:'92%',borderRadius:'10px' }}>
        <h2 className="text-xl fw-semibold mb-4">Consulting details</h2>
        <div className="row mb-3">
        <div className="col-md-4 d-flex flex-column">
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="id">ID</label>
            <InputGroup className=" shadow-sm rounded-3" style={{ height: '60%' }}>
              <FormControl id="id" placeholder="ID" aria-label="ID" value={getID} readOnly  style={{ 
              height: '100%', 
              outline: 'none', 
              boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)', 
              border: '2px solid #ECECEC', 
              borderRadius: '7px' 
            }} />
            </InputGroup>
          </div>
          <div className="col-md-6">
            <label htmlFor="name">Name</label>
            <InputGroup className="shadow-sm rounded-3"  style={{ height: '60%' }}>
              <FormControl id="name" placeholder="Name" value={getname} readOnly   style={{ 
              height: '100%', 
              outline: 'none', 
              boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)', 
              border: '2px solid #ECECEC', 
              borderRadius: '7px' ,backgroundColor:'white'
            }} />
            </InputGroup>
          </div>
          </div>
          <div className="row mt-3">
          <div className="col-md-6">
            <label htmlFor="class">Class</label>
            <InputGroup className="shadow-sm rounded-3" style={{ height: '60%' }}>
              <FormControl id="class" placeholder="Class" aria-label="Class" value={getclasses} readOnly   style={{ 
              height: '100%', 
              outline: 'none', 
              boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)', 
              border: '2px solid #ECECEC', 
              borderRadius: '7px',backgroundColor:'white' 
            }} />
            </InputGroup>
          </div>
          <div className="col-md-6">
            <label htmlFor="division">Division</label>
            <InputGroup className="shadow-sm rounded-3"  style={{ height: '60%' }}>
              <FormControl id="division" placeholder="Division" aria-label="Division" value={getdivision} readOnly style={{ 
              height: '100%', 
              outline: 'none', 
              boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)', 
              border: '2px solid #ECECEC', 
              borderRadius: '7px' ,backgroundColor:'white'
            }}  />
            </InputGroup>
          </div>
          </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="symptom">Tell us your symptom or health problem</label>
            <InputGroup className="shadow-sm rounded-3"  style={{ height: '46%' }}>
              <FormControl as="textarea" id="symptom" placeholder="Type your message..." value={symptom} onChange={(e) => setSymptoms(e.target.value)} 
                      style={{
                        height: '100%',
                        outline: 'none', 
                        boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)', 
                        border: '2px solid #ECECEC', 
                        borderRadius: '7px'
                      }}  />
            </InputGroup>
          </div>
          <div className="col-md-3 ml-5" >
            <img src={appoint} alt="Loading GIF" className="img-fluid mx-auto d-block" style={{ width: '200px', height: '270px' }} />
          </div>
        </div>
       
        <div className="row mb-3" style={{marginTop:'-110px'}}>
          <div className="col-md-4">
            <label htmlFor="sick-type">Sick Type</label>
            <InputGroup className="mb-3 shadow-sm rounded-3">
              <FormControl as="textarea" id="sick-type" placeholder="Placeholder" aria-label="Sick Type" style={{  height: '40px', outline: 'none', boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)', border: '2px solid #ECECEC', borderRadius: '7px' }} value={getSickType} onChange={(e) => setSickType(e.target.value)} />
              </InputGroup>
          </div>
          <div className="col-md-4">
            <Form.Group controlId="health-care-rep">
              <Form.Label>Roles</Form.Label>
              <div className="input-group">
                <select className="form-select" onChange={(e) => setSelectedRole(e.target.value)} style={{ height: '40px', outline: 'none', boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)', border: '2px solid #ECECEC', borderRadius: '7px' }}>
                  <option value="Student">Student</option>
                  <option value="Staff" selected>Staff</option>
                  <option value="HCR">HCR</option>
                </select>
              </div>
            </Form.Group>
          </div>
        </div>
  
        <div className="mb-4">
            <h3 className="text-lg fw-semibold mb-2 ms-2">Availability</h3>
            <br />
            <div className="d-flex flex-wrap">
              <button style={{color:'white',backgroundColor:'grey',border: '2px solid grey',marginLeft:'10px',paddingLeft:'20px',paddingRight:'20px'}}>{selectedTimingFrom}</button>
              </div>
          </div>
    <br/>
          <div  className="d-flex justify-content-between">
            <button  style={{ paddingLeft: '20px', paddingRight: '20px',height:'40px', marginLeft: '10px',borderRadius:'10px' }} type="button" className="cancelpopup" onClick={handleCancleView} >Cancel</button>
            <button  style={{ paddingLeft: '70px', paddingRight: '70px',width:'33%', marginLeft: 'auto',borderRadius:'10px',height:'40px' }}  type="button" className="btn btn-primary" onClick={handleGetAppointment}>Book Appointment</button>
          </div>   
        </div>
        </div>
      
    );
};