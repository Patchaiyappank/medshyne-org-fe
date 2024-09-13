import React, { useState, useEffect } from "react";
import "../styles/Appointment.css";
// import VideoCall from "../videocall/VideoCall";
import { useNavigate, useLocation } from "react-router-dom";
import note from "../photos/notedoctor.png";
import note3 from "../photos/viewimage.png";
import "bootstrap/dist/css/bootstrap.min.css";
import {Button,Modal} from 'react-bootstrap';
import { IoEye } from "react-icons/io5";
import poke from '../stafflist/blank image.png'
const Appointment = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [const_id, setConst_id] = useState("");
  const [consult_id, setConsult_id] = useState("");
  const [studprofile, setstudprofile] = useState("");
  const [studname, setstudname] = useState("");
  const [stud_id, setstud_id] = useState("");
  const [studclass, setstudclass] = useState("");
  const [studage, setstudage] = useState("");
  const [studdiv, setstuddiv] = useState("");
  const [sickmsg, setsickmsg] = useState("");
  const [hcr, sethcr] = useState("");
  const [sick_type, setsick_type] = useState("");
  const [docprofile, setdocprofile] = useState("");
  const [docname, setdocname] = useState("");
  const [docdegree, setdocdegree] = useState("");
  const [docexp, setdocexp] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [redColor, setRedColor] = useState(1);
  const [width, setWidth] = useState(0);
  let difference = 0;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  let appointment_from_time = "";
  let appointment_to_time = "";

  // start

  const handleChange = (event) => {
    setdocname(event.target.value);
  };

  const handleChange1 = (event) => {
    setdocdegree(event.target.value);
  };

  // Calculate the width of the input field dynamically based on the length of the input value
  //const inputWidth = `${docname.length * 12}px`;

  const inputWidth = docname
    ? `${Math.min(docname.length * 14, 196)}px`
    : "2px";

  const inputWidth1 = docdegree
    ? `${Math.min(docdegree.length * 7, 70)}px`
    : "2px";

  // End

  const { state } = useLocation();
  const { id } = state;
  const appointid = id;

  useEffect(() => {
    fetchappointment(appointid);
  }, [appointid]);

  const fetchappointment = (id) => {
    alert(id);
    const data = { consult_id: id };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    setIsLoading(true);
    fetch(`${baseApiUrl}/viewbyid_appointment_detail`, options)
      .then((response) => {
        console.log("Response status:", response.status);
        return response.json();
      })
      .then((responseText) => {
        if (responseText.staff === undefined) return responseText;
        console.log("appointment detail", responseText);
        setConst_id(responseText.staff[0].consult_id);
        setConsult_id(responseText.staff[0].consult_id);
        setstudprofile(responseText.staff[0].profile);
        setstudname(responseText.staff[0].patient_name);
        setsick_type(responseText.staff[0].sick_type);
        setstud_id(responseText.staff[0].id_number);
        setsickmsg(responseText.staff[0].health_problem);
        setstudclass(responseText.staff[0].classes);
        setstudage(responseText.staff[0].age);
        setstuddiv(responseText.staff[0].division);
        setdocprofile(responseText.staff[0].doctor_profile);
        sethcr(responseText.staff[0].hcr_name);
        setdocname(responseText.staff[0].assignee);
        setdocdegree(responseText.staff[0].education);
        setdocexp(responseText.staff[0].work_experience);

        appointment_from_time = responseText.staff[0].from_time;
        setFromTime(appointment_from_time);

        if (responseText.staff[0].to_time) {
          appointment_to_time = responseText.staff[0].to_time;
          setToTime(appointment_to_time);
        }

        var time1 = new Date().toLocaleTimeString("en-US");
        var time2 = appointment_from_time;
        difference = strToMins(time1) - strToMins2(time2);

        setRedColor(parseInt(difference));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function strToMins(t) {
    var s = t.toString().replace("PM").trim().split(":");
    return Number(s[0]) * 60 + Number(s[1]);
  }
  function strToMins2(t) {
    if (t == undefined || t == null) return 0;
    var s = t.toString().replace("PM").trim();
    //alert('S value is '+ s);
    s = s.split(":");
    //alert('first part is '+ s[0]);z
    //alert('second part is '+ s[1]);
    var firstPart = parseInt(s[0]) * parseInt("60");
    //alert('calc first part '+ firstPart);
    var secondPart = parseInt(s[1]);
    // alert('calc second part '+ secondPart);
    var thirdPart = firstPart + secondPart;
    //alert('calc third part '+ thirdPart);
    return thirdPart;
  }

  function minsToStr(t) {
    return Math.trunc(t / 60) + ":" + ("00" + (t % 60)).slice(-2);
  }

  // start

  const [showPopup, setShowPopup] = useState(false);

  // Function to handle cancel appointment


  // End

  const handleConsultButtonClick = () => {
    if (redColor >= -5 && redColor <= 5) {
      // Check if button color is blue
      // Redirect to the next page
      navigate("/VideoCall"); // Use navigate function instead of history.push
    } else {
      // Your functionality when the button is clicked and it's not blue
      alert("Consulting time is Expired");
    }
  };

  // view
  const handleEdit = (const_id) => {
    navigate("/Dashboard", {
      state: {
        consult_id: const_id,
      },
    });
  };

  //cancel
  const handleEdit1 =  ( const_id) => {
    navigate('/Dashboard',{
      state: {
        consult_id:const_id
      }
    });
     };

  // Cancel appointment
  // const handleEdit2 =  ( const_id) => {

  // navigate('/Dashboard',{
  //   state: {
  //     consult_id:const_id
  //   }
  // });
  // }; 
  
  const handleCancelAppointment = () => {
    // Make the API request to update the appointment status
    fetch(`${baseApiUrl}/update_status_cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ consult_id: const_id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Result === 'Success') {
          // Close the popup and redirect or refresh the data as needed
          setShowPopup(false);
          // Optionally, redirect or refresh the data
          navigate('/Dashboard'); // or any other action
        } else {
          // Handle the error
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while cancelling the appointment.');
      });
  };
  

  // Medicine Prescription
  const handleEdit3 = (consult_id) => {
    console.log("Navigating with consult_id:", consult_id); // Debugging statement
    navigate("/Prescription", { state: { consult_id } });
  };

  // Edit
  const handleEdit4 = (consult_id) => {
    navigate("/AppointmentEdit", { state: { consult_id } });
  };

  const changeHandler = (evt) => {
    //setWidth(evt.target.value.length);
  };
  const consult_done = async (id_number) => {
    alert(id_number);

    try {
      // First API call
      const response = await fetch(`${baseApiUrl}/consulting_profile_by_id?id_number=${id_number}`);

      if (!response.ok) {
        throw new Error('Network response was not ok for the first API');
      }

      const data = await response.json();

      if (data.Result === "Failure") {
        console.error('Error from first API:', data.message);
        return;
      }

      const role = data.firstArray[0].role;
      console.log('Role from first API:', role);

      let path;

      // Check role and make the second API call if necessary
      if (role === 'student') {
        path = '/StudentDetails';
      } else if (role === 'staff') {
        console.log(`Fetching staff profile for ID ${id_number}`);

        path = '/StaffDetails';
      } else {
        console.error('Unknown role:', role);
        return;
      }

      navigate(path, {
        state: {
          id_number: id_number,
          mode: 'view',
          data: {
            Profile: data,
          }
        }
      });

      console.log(`Navigated to ${path} with ID ${id_number}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
<div className="container-fluid" style={{ marginLeft: '7%', marginTop: '7%', width: '92%' }}>
  <div className="card p-3 " >
    <div className="row"  style={{ marginLeft: '1%' }}>
      {/* Appointment Details */}
      <div className="col-12">
        <h4 className="mt-1 ml-2">Appointment details</h4>
        <h5 className="ml-2">Consulting ID {const_id}</h5>
      </div>
    </div>

    <div className="row mt-2"  style={{ marginLeft: '1%' }}>
      {/* Student Info */}
      <div className="col-md-4 mt-3 ml-2" style={{ }}>
        <div className="card" style={{   borderRadius: '7px',border: '1px solid #ECECEC',boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",height:'100%'}}>
          <div className="d-flex">
            <img
              src={studprofile || poke}
              alt="Student Profile"
              className="img-fluid ml-3 mt-3"
              style={{ width: '100px', height: '110px',borderRadius:'10px' }}
            />
            <div className="ml-3">
              <div className="row mt-4">
                {/* Name and Age in one row */}
                <div className="col">
                  <h6 className="">{studname}</h6>
                </div>
                <div className="col ml-2">
                  <h6 className="mb-0">Age {studage}</h6>
                </div>
              </div>

              <div className="row mt-2">
                {/* ID and View Button in one row */}
                <div className="col mt-2">
                  <h6 className="">ID: <span style={{ fontWeight: '300' }}>{stud_id}</span></h6>
                </div>
                <div className="col ml-2">
                        <button
                    onClick={() => consult_done(stud_id)}
                    className="btn btn-outline btn-sm mt-1 "
                    style={{  fontSize: '14px', lineHeight: '1', height: '25px', width: '72px',border:'1px solid #9CD3FF'}}
                  >
                    <IoEye style={{
        color: '#007bff', // Example: Set the color
        fontSize: '15px',
        marginBottom:'2px',
         // Example: Set the font size
        // Example: Add some spacing
        cursor: 'pointer' // Example: Change cursor on hover
      }} /> View
                  </button>
                </div>
              </div>

              <div className="row mt-2" >
                {/* Class and Division in one row */}
                <div className="col">
                  <p className="" style={{fontSize:"14px"}}><span style={{fontWeight:'500'}}>Class:</span>{studclass}</p>
                </div>
                <div className="col">
                  <p className="" style={{fontSize:"14px"}}><span style={{fontWeight:'500'}}>Division:</span>{studdiv}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Symptoms/Problem Input */}
      <div className="col-md-4" style={
        {marginLeft:'4%'}
      }>
        <label htmlFor="symptoms" style={{fontSize:'14px'}}>Tell us your symptom or health problem</label>
        <textarea
          id="symptoms"
          className="form-control"
          value={sickmsg} 
          rows="5"
          placeholder="Type your message..."
          style={{   borderRadius: '7px',border: '1px solid #ECECEC',boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"}}
        ></textarea>
      </div>
    </div>

    <div className="row mt-3"  style={{ marginLeft: '1%' }}>
      <div className="col-md-4 ml-2">
        <label htmlFor="sickType"  style={{fontSize:'14px'}}>Sick Type</label>
        <input
         
          id="sickType"
          className="form-control"
          value={sick_type}
          style={{  borderRadius: '7px',border: '1px solid #ECECEC',boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",height:'62%'}}
        />
      </div>
    <div className="col-md-4 "  style={
        {marginLeft:'4%'}
      }>
  <label htmlFor="roles" style={{ fontSize: '14px' }}>Roles</label>
  <input
    id="roles"
    className="form-control"  value={hcr}
    style={{
      border: '1px solid #ECECEC',boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      borderRadius: '7px',
      zIndex: 1,  // Ensures dropdown appears on top
      position: 'relative',height:'62%'
    }}
 />
    
  
</div>

    </div>

    {/* Doctor Info and Start Time Cards */}
    <div className="row mt-4"  style={{ marginLeft: '1%' }}>
      <div className="col-md-4 ml-2" >
        <div className="card h-100  d-flex align-items-stretch mb-2" style={{  borderRadius: '7px',border: '1px solid #ECECEC',boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"}}>
          <div className="row align-items-center">
            <div className="col-3 ml-1 d-flex ">
              <img src={docprofile || poke} alt="doctor profile " style={{  width:'80px',marginTop:'10px' }} />
            </div>
            <div className="col-8 mr-3">
              <h5 className="font-semibold mb-0">
                {docname}
                <span className="d-inline" style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>
                  ({docdegree})
                </span>
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: '16px' }}>
                {docexp} of Experience
              </p>
            </div>
          </div>
        </div>
       
      </div>

      <div className="col-md-4" style={{ marginLeft: '4%' }}>
  <div className="card h-100 appointment-time-card" style={{  borderRadius: '7px',border: '1px solid #ECECEC',boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"}}>
    <div className="d-flex justify-content-between align-items-center">
      <div className="appointment-starton">
        {toTime ? 'Time' : 'Start On'}
        <br />
        <input
          type="text"
          className={toTime ? "appointment-starttime" : "appointment-start"}
          value={`${fromTime}${toTime ? ` - ${toTime}` : ''}`}
          readOnly
          style={{
            color: redColor >= -5 && redColor <= 5 ? 'red' : 'black',
            fontSize: '1.2rem',  // Adjust font size for responsiveness
            width: '100%'  // Ensure input takes full width within its container
          }}
        />
      </div>
      {toTime ? null : (
        <Button
          className="appointment-consult "
          onClick={handleConsultButtonClick}
          style={{
            backgroundColor: redColor >= -5 && redColor <= 5 ? '#0089FF' : '#6E7787',
            borderColor: redColor >= -5 && redColor <= 5 ? '#0089FF' : '#6E7787',
            marginLeft: 'auto',  // Pushes the button to the right side
            fontSize: '1rem',  // Adjust font size for responsiveness
            padding: '0.5rem 1rem'  // Responsive padding
          }}
        >
          Start Consulting
        </Button>
      )}
    </div>
  </div>
</div>

    </div>

  
          <div className=" row appointment-cancel-edit-medicine1 " style={{display:'flex',flexDirection:'row',marginLeft:"1%"}}>
          <div className="col-md-4 mt-2 ml-2" >
            <button
              className={toTime ? 'appointment-para-medicine' : 'appointment-para'}
              onClick={toTime ? () => handleEdit1(consult_id) : () => setShowPopup(true)}
            >
              {toTime ? 'Close' : 'Cancel Appointment'}
            </button>
          </div>
         
          <div className="col-md-4 d-flex justify-content-end align-items-start mt-2"  style={
        {marginLeft:'4%'}
      }>
  <Button
    className={toTime ? 'appointment-para-medicinepres' : 'appointment-para1'}
    onClick={toTime ? () => handleEdit3(consult_id) : () => handleEdit4(consult_id)}
    // style={{border:'1px solid #9CD3FF}}
  >
    {toTime ? 'Prescription Medicine' : 'Edit'}
  </Button>
</div>
         
          <div className="col-md-1  " >
           
          </div>
        
     
      <div className="col-md-2 appointment-col3 " >
            <img src={note} className="appointment-notedoctor" alt="Full" style={{width:'170px',height:'480px',marginTop:'-420px'}}/> 
          </div>
          </div>
    </div>
 
    {showPopup && (
        

<Modal  className="modal-contentsi"  show={showPopup} onHide={() => setShowPopup(false)} centered>
      
<Modal.Body >
<div className="staffk-deleteappoint1">
Cancel Appointment
<button
 className="staff-close-button1"
 onClick={() => setShowPopup(false)}
 aria-label="Close"
>
 ×
</button>
</div>
  <p className="viewstaff-popuppara1">Would you like to cancel the appointment?</p>

  <Button variant="secondary" className="viewstaff-cancel1"  onClick={() => setShowPopup(false)}>
    Cancel
  </Button>
  <Button variant="danger" className="viewstaff-delete1 ml-4" onClick={handleCancelAppointment}>
    Delete
  </Button>
  </Modal.Body>

</Modal>
      )}
  </div>


   
  )}
export default Appointment;