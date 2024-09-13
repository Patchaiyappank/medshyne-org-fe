import React, { useState, useEffect,useContext ,useRef } from "react";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
//import placeholderImage from './doctor1.png';
import appoint from "./Appointment.png";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import './Appoinment.css';
import { useLocation } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import poke from '../stafflist/blank image.png'
import axios from 'axios';
import moment from 'moment';
import { MyContext } from '../ProjectContext';

export default function Component() {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [details, setDetails] = useState({
    id_number: "",
    name: "",
    classes: "",
    division: ""
  });
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const {getLoginCredentials,setLoginCredentials} = useContext(MyContext);
  const [selectOrganization, setSelectOrganization] = useState(() => {
    const storedOrganization = sessionStorage.getItem('organization');
    return storedOrganization ? storedOrganization : getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
  });
  
  useEffect(() => {
    sessionStorage.setItem('organization', selectOrganization);
  }, [selectOrganization]);


  const [getname, setname] = useState('');
  const [getclasses, setclasses] = useState('');
  const [getdivision, setdivision] = useState('');
  const [getID, setID] = useState('');
  const [doctorDetails, setDoctorDetails] = useState([]);
  const [getAvailabilityDetails, setAvailabilityDetails] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState();
  const [selectedTiming, setSelectedTiming] = useState(null);
  const navigate = useNavigate();

  const [selectedTimingFrom, setSelectedTimingFrom] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  
  const [appointmentSubmitted, setAppointmentSubmitted] = useState(false);
  const [selectedTimingsByDoctor, setSelectedTimingsByDoctor] = useState({});
  
const [currentSelectedTiming, setCurrentSelectedTiming] = useState(null);

  // useEffect(() => {
  //   fetchData();
  //   fetchdoctorData();
    
  // }, [getID]);

  useEffect(() => {
    fetchData();
    fetchdoctorData();
  }, [getID]);


  const handleChange = (e) => {
    setID(e.target.value);
  };

  const handleSelectTimingFrom = (item) => {
    console.log("Selected item:", item); // Debug item
    if (item.disable_bts === 0) {
      console.log("Updating timing:", item.from_time); // Debug timing update
      setSelectedTiming(item.from_time);
      setSelectedTimingFrom(item.from_time);
      // Store additional data if needed
      setCurrentSelectedTiming(item);
    }
  };
  
  


  useEffect(() => {
    if (selectedDoctorId) {
      const selectedDoctor = doctorDetails.find((doctor) => doctor.doctor_id === selectedDoctorId);
      if (selectedDoctor) {
        setSelectedDoctor(selectedDoctor);
      }
    }
  }, [selectedDoctorId, doctorDetails]);

  // const handleSelectTimingFrom = (timing) => {
  //   setSelectedTiming(timing);
  //   setSelectedTimingFrom(timing.from_time); 
  //   console.log("Selected timing from:", timing);
  //   setCurrentSelectedTiming(timing.from_time);
  // };
  
  useEffect(() => {
    if (appointmentSubmitted && selectedTiming) {
      updateViewTime(selectedTiming);
    }
  }, [appointmentSubmitted, selectedTiming]);

  const updateAvailabilityDetails = (childAvailableId, newValue) => {
    setAvailabilityDetails(prevDetails => {
      return prevDetails.map(item => {
        if (item.child_available_id === childAvailableId) {
          // Update the disable_bts property
          return { ...item, disable_bts: newValue };
        }
        return item;
      });
    });
  };




  const updateViewTime = (timing) => {
    try {
      if (!timing || !timing.child_available_id) {
        console.error('Invalid timing data:', timing);
        return;
      }
  
      console.log('Updating view time for child_available_id:', timing.child_available_id); // Log the child_available_id
  
      fetch(`${baseApiUrl}/update_view_time`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disable_bts: 1,
          child_available_id: timing.child_available_id,
        }),
      })
      .then((response) => {
        console.log('Response Status:', response.status); // Log status code
        return response.json();
      })
      .then((data) => {
        if (!data.success) {
          throw new Error('Update failed: ' + data.message); // Log server error message
        }
        console.log('Updated timing:', data);
  
        const updatedAvailabilityDetails = getAvailabilityDetails.map((item) => {
          if (item.child_available_id === timing.child_available_id) {
            return { ...item, disable_bts: 1 };
          }
          return item;
        });
        setAvailabilityDetails(updatedAvailabilityDetails);
      })
      .catch((error) => {
        console.error('Error updating view time:', error.message);
      });
    } catch (error) {
      console.error('Error updating view time:', error.message);
    }
  };
  
  
  
const handleCancleView = () => {

navigate('/Dashboard')

}






const validateForm = () => {
  let isValid = true;

  const checkElement = (id, valueCheckFn) => {
    const element = document.getElementById(id);
    const errorElement = document.getElementById(`${id}-error`);

    if (!element) return;

    const isEmpty = valueCheckFn(element.value.trim());

    if (isEmpty) {
      element.style.borderColor = 'red';
      if (errorElement) {
        errorElement.style.display = 'block';
      }
      isValid = false;
    } else {
      element.style.borderColor = '';
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    }
  };

  // Perform general validation
  checkElement('doctor', (value) => !value);
  checkElement('id', (value) => !value);
  checkElement('name', (value) => !value);
  checkElement('class', (value) => !value);
  checkElement('division', (value) => !value);
  checkElement('symptom', (value) => !value);
  checkElement('sick-type', (value) => !value);
  checkElement('health-problem', (value) => !value);

  // Special validation for roles dropdown
  const rolesElement = document.getElementById('roles');
  if (rolesElement && rolesElement.value === 'None') {
    rolesElement.style.borderColor = 'red';
    isValid = false;
  } else if (rolesElement) {
    rolesElement.style.borderColor = '';
  }

  return isValid;
};





useEffect(() => {
  // Check if appointment is submitted and doctor is not selected
  if (appointmentSubmitted && !selectedDoctor) {
    alert("Please select a doctor before submitting the appointment.");
    return; // Prevent further execution of this effect
  }

  const sickTypeElement = document.getElementById('sick-type');
  const symptomElement = document.getElementById('symptom');
  if (appointmentSubmitted) {
    console.log("Doctor Details:", selectedDoctor);
    console.log("assignee:", selectedDoctor?.doctor_name); 
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
}, [appointmentSubmitted, selectedDoctor]);

useEffect(() => {
  console.log("Selected Timing:", selectedTiming);
}, [selectedTiming]);

useEffect(() => {
  console.log("Updated Timings:", getAvailabilityDetails);
}, [getAvailabilityDetails]);

  

const updateAppointment = async (formattedTime, selectedRole) => {
  try {
    // Check if formattedTime is a valid date string
    if (isNaN(new Date(formattedTime))) {
      console.error('Invalid date string:', formattedTime);
      return;
    }

    // Check if id_number is provided and valid
    if (!getID || isNaN(parseInt(getID))) {
      console.error('Invalid id_number:', getID);
      return;
    }

    let formattedFromTime = new Date(formattedTime).toLocaleTimeString('en-US', { hour12: false });
    formattedFromTime = formattedFromTime.split(':').slice(0, 2).join(':') + ':00';

    console.log('Formatted from time:', formattedFromTime);

    const response = await fetch(`${baseApiUrl}/insert_appointment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_number: parseInt(getID),
        patient_name: getname,
        classes: getclasses,
        organization_name: selectOrganization,
        division: getdivision,
        sick_type: document.getElementById('sick-type').value,
        health_problem: document.getElementById('symptom').value,
        hcr_name: selectedRole,
        doctor_id: selectedDoctor?.doctor_id,
        assignee: selectedDoctor?.doctor_name,
        from_time: formattedFromTime,
      }),
    });

    const data = await response.json();
    console.log('Inserted Appointment', data);

    // Call updateViewTime to change disable_bts to 1 after successful appointment submission
    if (selectedTiming) {
      await updateViewTime(currentSelectedTiming); // Make sure currentSelectedTiming includes child_available_id
    }
  } catch (error) {
    console.error('Error inserting appointment:', error);
  }
};


  const handleGetAppointment = async () => {
    let alertMessage = '';
  
    // Check for form validity and doctor selection
    if (!validateForm()) {
      alertMessage += 'Kindly fill in all required fields, ';
    }
    if (!selectedDoctor) {
      alertMessage += ' select a doctor,';
    }
    if (!selectedTimingFrom) {
      alertMessage += 'choose a time to complete your booking.';
    }
  
    // Show alert if there are messages
    if (alertMessage) {
      alert(alertMessage.trim());
      return;
    }
  
    try {
      // Set appointment submitted to true
      setAppointmentSubmitted(true);
      console.log("Selected timing for appointment:", selectedTimingFrom);
  
      // Validate selectedTimingFrom
      if (!selectedTimingFrom) {
        console.error('Selected timing is undefined');
        return;
      }
  
      // Convert the selected time to a valid time format
      const selectedDate = new Date();
      const [hours, minutes] = selectedTimingFrom.split(':');
      selectedDate.setHours(parseInt(hours, 10));
      selectedDate.setMinutes(parseInt(minutes, 10));
  
      // Validate the date
      if (isNaN(selectedDate.getTime())) {
        console.error('Invalid selected date:', selectedTimingFrom);
        return;
      }
  
      // Format the selected date
      const formattedTime = selectedDate.toISOString();
  
      // Call updateAppointment with the formatted time
      await updateAppointment(formattedTime, selectedRole);
  
      // Update availability details and disable the selected timing
      if (currentSelectedTiming) {
        updateAvailabilityDetails(currentSelectedTiming.child_available_id, 1);
      }
      alert("Book appointment successfully");
      // navigate('/Dashboard');
    } catch (error) {
      console.error('Error handling appointment:', error);
    }
  };
  
  const buttonClass = (timing) => {
    const isSelected = timing.from_time === selectedTiming;
    return timing.disable_bts === 1 
      ? "btn-secondary" 
      : isSelected 
        ? "btn-primary selected" 
        : "btn-outline-primary";
  };
  
  
  


  let timeButtons;

  useEffect(() => {
    timeButtons = getAvailabilityDetails.map((item, index) => {
      return <Button key={index} value={item.day}>{item.day}</Button>;
    });
  }, [doctorDetails, getAvailabilityDetails]);

 

  const fetchData = () => {
    try {
      fetch(`${baseApiUrl}/consulting_detail?id_number=${getID}&organization_name=${selectOrganization}`, {
        method: 'GET',
        'Content-Type': 'application/json'
      }).then((response) => response.json())
        .then((data12) => {
          console.log('GET DATA FETCHED ', data12);
          setname(data12.name);
          setclasses(data12.classes);
          setdivision(data12.division);
          // Update the selectedDoctor state if the doctor is already selected
          if (selectedDoctor) {
            setSelectedDoctor(selectedDoctor);
          }
        })
        .catch((error) => console.error('Error:', error));
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

 
  const fetchdoctorData = async () => {
    try {
      const response = await fetch(`${baseApiUrl}/view_doctor_details`, {  // Updated endpoint
        method: 'GET'
      });
      const data = await response.json();
      console.log('Doctor Data ', data.doctorDetails);
      setDoctorDetails(data.doctorDetails);
      // setAvailabilityDetails(data.availabilityDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


const handleSelectDoctor = (doctor) => {
  setSelectedDoctorId(doctor.doctor_id);
  setSelectedDoctor(doctor);

  axios.get(`${baseApiUrl}/view_availability_details`, {
    params: { doctor_id: doctor.doctor_id }
  })
  .then(response => {
    const data = response.data;
    if (data.result === "success") {
      console.log("Availability details:", data.availabilityDetails);

      const currentTime = new Date();

      const updatedAvailabilityDetails = data.availabilityDetails.map(slot => {
        const slotTime = new Date(slot.date + ' ' + slot.time);
        return {
          ...slot,
          isPast: slotTime <= currentTime // Mark as past if the slot time is less than or equal to current time
        };
      });

      // Set the updated availability details in your state
      setAvailabilityDetails(updatedAvailabilityDetails);
    } else {
      console.log(data.message);
    }
  })
  .catch(error => {
    console.error('Error fetching availability details:', error);
  });
};

  

  const scrl = useRef(null);  // Use ref to access the scrollable container
  const [scrollX, setScrollX] = useState(0);
  const [scrollEnd, setScrollEnd] = useState(false);

  const slide = (shift) => {
    if (scrl.current) {
      scrl.current.scrollBy({
        left: shift,
        behavior: 'smooth',
      });
      setScrollX(scrollX + shift);

      // Check if the end is reached
      if (
        Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <=
        scrl.current.offsetWidth
      ) {
        setScrollEnd(true);
      } else {
        setScrollEnd(false);
      }
    }
  };

  const scrollCheck = () => {
    if (scrl.current) {
      setScrollX(scrl.current.scrollLeft);
      if (
        Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <=
        scrl.current.offsetWidth
      ) {
        setScrollEnd(true);
      } else {
        setScrollEnd(false);
      }
    }
  };






  return (

    <div className="" style={{ backgroundColor: '#F5F5F5', minHeight: '100vh',marginTop:'80px',marginLeft:'60px' }}>
    <h4 className="mb-4  fw-bold " style={{marginLeft:'6%'}} >General Physician Doctors Available</h4>

    <div className="container-fluid doctor-scroll-container " style={{ marginLeft:'22px', whiteSpace: 'nowrap', padding: '10px', width: '95%', position: 'relative' }}>
      <div className="rows d-flex flex-nowrap align-items-center">
        
        {/* Left Arrow */}
        <div onClick={() => slide(-100)} 
             className={`left-arrow-left ${(scrollX < 1) ? 'is-disabled-hide' : ''} ml-2`} 
            >
          <MdArrowBackIos size="20px"   style={{cursor:"pointer"}}/>
        </div>
        
        {/* Scrollable Container */}
        <div ref={scrl} onScroll={scrollCheck} className="doctor-scroll-container" style={{ display: 'flex', overflowX: 'auto', scrollBehavior: 'smooth' }}>
  {doctorDetails.map((doctor) => (
    <div key={doctor.doctor_id} className=" col-auto" style={{ width: "250px" }}>
      <div className="d-flex flex-column align-items-start p-4 border bg-white shadow-sm">
        <img alt={doctor.doctor_name} className="mb-2 mx-auto" src={doctor.profile || poke} style={{ width: "90%", height: "auto" }} />
        <div>
          <h6 className="text-sm mb-1 fw-bold ms-2" style={{ fontSize: '14px'}}>
            {`Dr. ${doctor.doctor_name}`}
            <span className="text-xs fw-medium ms-3" style={{ fontSize: '13px'}}>
              ({doctor.education})
            </span>
          </h6>
          <p className="text-xs text-muted mb-1 ms-2" style={{ fontSize: '12px' }}>
            {doctor.work_experience} years of Experience
          </p>
        </div>
        <Button
          className={`btn btn-sm ${selectedDoctor === doctor ? 'btn-outline-primary' : 'btn-primary'} mt-2 ms-2 `}
          onClick={() => handleSelectDoctor(doctor)}
          style={{
            alignItems: 'center',
            marginTop: '10px',
            width: '150px',
            fontSize: '14px',
            height: '35px',
            fontWeight: '450',
            backgroundColor: selectedDoctor === doctor ? 'white' : '',
            color: selectedDoctor === doctor ? '#0089FF' : '',
            border: selectedDoctor === doctor ? '2px solid #0089FF' : '',
            boxShadow: 'none', // Removes focus/hover outline highlight
            outline: 'none' // Removes additional outline
          }}
        >
          {selectedDoctor === doctor ? 'Selected' : 'Select Doctor'}
        </Button>
      </div>
    </div>
  ))}
</div>

        
        {/* Right Arrow */}
        <div className={`right-arrow-right ${(!scrollEnd) ? '' : 'is-disabled-hide'} mr-2 `} 
             onClick={() => slide(+100)} 
            >
          <MdArrowForwardIos size="20px" style={{cursor:"pointer"}} />
        </div>
        
      </div>
    </div>

    <div className="mx-5 p-4 mt-1" style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", backgroundColor: 'white', width: '92%', borderRadius: '10px' }}>
        <h4 className="text-xl fw-semibold mb-4 ">Consulting details</h4>
        <div className="row mb-3">
  <div className="col-md-4 d-flex flex-column">
    <div className="row">
      <div className="col-md-6">
        <label htmlFor="id">ID</label>
        <InputGroup className="shadow-sm rounded-4" style={{ height: '60%' }}>
          <FormControl 
            id="id" 
            style={{ 
              height: '100%', 
              outline: 'none', 
              boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)', 
              border: '2px solid #ECECEC', 
              borderRadius: '7px' 
            }} 
            placeholder="ID" 
            aria-label="ID" 
            value={getID} 
            onChange={handleChange} 
          />
        </InputGroup>
      </div>
      <div className="col-md-6">
        <label htmlFor="name">Name</label>
        <InputGroup className="shadow-sm rounded-3" style={{ height: '60%' }}>
          <FormControl 
            id="name" 
            placeholder="Name" 
            value={getname} 
            readOnly 
            style={{ 
              height: '100%', 
              outline: 'none', 
              boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)', 
              border: '2px solid #ECECEC', 
              borderRadius: '7px' ,backgroundColor:'white'
            }} 
          />
        </InputGroup>
      </div>
    </div>
    <div className="row mt-3">
      <div className="col-md-6">
        <label htmlFor="class">Class</label>
        <InputGroup className="shadow-sm rounded-3" style={{ height: '60%' }}>
          <FormControl 
            id="class" 
            placeholder="Class" 
            aria-label="Class" 
            value={getclasses} 
            readOnly 
            style={{ 
              height: '100%', 
              outline: 'none', 
              boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)', 
              border: '2px solid #ECECEC', 
              borderRadius: '7px',backgroundColor:'white' 
            }} 
          />
        </InputGroup>
      </div>
      <div className="col-md-6 ">
        <label htmlFor="division">Division</label>
        <InputGroup className="shadow-sm rounded-3" style={{ height: '60%' }}>
          <FormControl 
            id="division" 
            placeholder="Division" 
            aria-label="Division" 
            value={getdivision} 
            readOnly 
            style={{ 
              height: '100%', 
              outline: 'none', 
              boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)', 
              border: '2px solid #ECECEC', 
              borderRadius: '7px' ,backgroundColor:'white'
            }} 
          />
        </InputGroup>
      </div>
    </div>
  </div>
  <div className="col-md-4">
    <label htmlFor="symptom">Tell us your Symptoms or Health Problem</label>
    <InputGroup className="shadow-sm rounded-3" style={{ height: '46%' }}>
      <FormControl 
        as="textarea" 
        id="symptom" 
        placeholder="Type your message..." 
        style={{
          height: '100%',
          outline: 'none', 
          boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)', 
          border: '2px solid #ECECEC', 
          borderRadius: '7px'
        }} 
      />
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
              <FormControl as="textarea" id="sick-type" placeholder="Placeholder" aria-label="Sick Type" style={{  height: '40px', outline: 'none', boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)', border: '2px solid #ECECEC', borderRadius: '7px' }} />
            </InputGroup>
          </div>
          <div className="col-md-4">
            <Form.Group id="health-care-rep">
              <Form.Label >Roles</Form.Label>
              <div className="input-group" >
                <select id="roles" className="form-select" onChange={(e) => setSelectedRole(e.target.value)} style={{ height: '40px', outline: 'none', boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)', border: '2px solid #ECECEC', borderRadius: '7px' }}>
    
                  <option value="None" selected>None</option>
                  <option value="HCR">HCR</option>
                  <option value="Staff">Staff</option>
                  <option value="Student">Student</option>
                </select>
              </div>
            </Form.Group>
          </div>
         
        </div>

        {selectedDoctor && (
  <div className="mb-4">
    <h3 className="text-lg fw-semibold ms-2">Availability</h3>
    <br />
    <div className="d-flex flex-wrap">
    {getAvailabilityDetails.map((item, index) => {
  const buttonClassName = buttonClass(item);
  const isDisabled = item.disable_bts === 1;

  return (
    <button
      key={index}
      type="button"
      className={`btn me-2 ms-3 mt-2 ${buttonClassName}`}
      onClick={() => handleSelectTimingFrom(item)}
      disabled={isDisabled}
    >
      {moment(item.from_time, 'HH:mm').format('hh:mm A')}
    </button>
  );
})}





    </div>
  </div>
)}



        <br />
        <div className="d-flex justify-content-between">
  <button
    style={{ paddingLeft: '20px', paddingRight: '20px',height:'40px', marginLeft: '10px',borderRadius:'10px' }}
    type="button"
    className="cancelpopup"
    onClick={handleCancleView}
  >
    Cancel
  </button>
  
  <button
    style={{ paddingLeft: '70px', paddingRight: '70px',width:'33%', marginLeft: 'auto',borderRadius:'10px',height:'40px' }}
    type="button"
    className="btn btn-primary"
    onClick={handleGetAppointment}
  >
    Book Appointment
  </button>
</div>

      </div>
      <br></br>  
    </div>
  
  )
};