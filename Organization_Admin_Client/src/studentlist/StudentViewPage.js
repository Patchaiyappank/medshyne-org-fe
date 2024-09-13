import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import GenericPdfDownloader from './GenericPdfDownloder.js';
import "../stafflist/staffview.css";
import poke from './blank image.png'
import { Modal,Button } from 'react-bootstrap';

function StudentViewPage() {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const studentIndividualID = Number(state.id_number);
  const [openChildRowIndex, setOpenChildRowIndex] = useState(null);
  const [staffData, setStaffData] = useState(null);

  const [staffDetails, setStaffDetails] = useState({
    name: '',
    profile: '',
    id_number: '',
    designation: '',
    department: '',
    class_and_division: '',
    age: '',
    gender: '',
    blood_group: '',
    address: '',
    mobile_number: '',
    allergies_define: '',
    any_disease_define: '',
    hcr_id: '',
    hcr_name: '',
    sick_type: '',
    consult_id: '',
    division: '',
    date: '',
    student_id: '',
    time: '',
    assignee: '',
    relation:'',
    parent_name:'',
    past_health_report:'',
    pincode:'',
    state:'',
    current_health_report:''
  });

  const [getFirstArray, setFirstArray] = useState([]);
  const [getSecondArray, setSecondArray] = useState([]);
  const [getConsultingArray, setConsultingArray] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    const fetchData = async (id_number) => {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        const response = await fetch(
          `${baseApiUrl}/consulting_studentprofile_by_id?id_number=${Number(id_number)}`,
          options
        );

        if (!response.ok) {
          throw new Error('Failed to fetch details');
        }

        const data = await response.json();

        // Handling firstArray
        if (data.firstArray && data.firstArray.length > 0) {
          const { name, profile, id_number, designation } = data.firstArray[0];
          setStaffDetails((prevState) => ({
            ...prevState,
            name,
            profile,
            id_number,
            designation
          }));
        }

        // Handling secondArray
        if (data.secondArray && data.secondArray.length > 0) {
          const {
            name,
            department,
            class_and_division,
            age,
            gender,
            blood_group,
            address,
            relation,
            parent_name,
            mobile_number,
            allergies_define,
            any_disease_define,
            past_health_report,
            pincode,
            state,
            current_health_report
          } = data.secondArray[0];
          setStaffDetails((prevState) => ({
            ...prevState,
            name,
            department,
            class_and_division,
            age,
            gender,
            blood_group,
            address,
            relation,
            parent_name,
            mobile_number,
            allergies_define,
            any_disease_define,
            pincode,
            state,
            past_health_report,
            current_health_report
          }));
        }
        // Handling thirdArray
        if (data.consultingArray && data.consultingArray.length > 0) {
          const {
            sick_type,
            consult_id,
            division,
            date_time,
            student_id,
            hcr_id,
            hcr_name,
            time,
            assignee
          } = data.consultingArray[0];
          setStaffDetails((prevState) => ({
            ...prevState,
            sick_type,
            consult_id,
            division,
            date_time,
            student_id,
            hcr_id,
            hcr_name,
            time,
            assignee
          }));
        }

        // Set state for all arrays
        setFirstArray(data.firstArray || []);
        setSecondArray(data.secondArray || []);
        setConsultingArray(data.consultingArray || []);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    fetchData(studentIndividualID);
  }, [studentIndividualID]);

  const toggleChildRow = (index) => {
    setOpenChildRowIndex((prevState) => (prevState === index ? null : index));
  };

  const handleDelete = async (id_number) => {
    alert(id_number);
    navigate('/Student');
    if (staffData) {
      setStaffData(staffData.filter((staff) => staff.id_number !== id_number));
    }

    try {
      const response = await fetch(`${baseApiUrl}/softdelete_student?idNumber=${id_number}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete student: ${errorMessage}`);
      }

      const data = await response.json();
      console.log(data);
      setDeleteMessage('Student deleted successfully!');
    } catch (error) {
      console.error('Error deleting staff:', error);
      setDeleteMessage('Failed to delete student.');
    }
  };


  const [show, setShow] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = async (type) => {
    try {
      let reportUrl = '';
      if (type === 'current') {
        reportUrl = staffDetails.current_health_report;
      } else if (type === 'past') {
        reportUrl =staffDetails.past_health_report;
      }
      setModalImage(reportUrl);
      setShow(true);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };
  const handleEdit = (id_number) => {
    alert(id_number);
    navigate('/StudentForm', {
      state: {
        id_number: id_number,
        mode: 'edit'
      }
    });
    console.log(`Edit staff with ID ${id_number}`);
  };

  const renderChildRow = (index) => {
    if (openChildRowIndex === index) {
      return (
        <tr className="" key={index}>
          <td colSpan="5">
            <div className="ichild-row-content" style={{ fontWeight: 500 }}>
              <table className="iviewstaf" style={{ borderTop: 'none', borderBottom: 'none' }}>
                <tbody>
                  <tr className="itable-row-bottom">
                    <td className="iconsult-page-done-idnumber"><strong style={{marginLeft:'25px'}}>Student ID</strong><br /><p style={{marginLeft:'25px',fontWeight:'normal'}}>{getConsultingArray[index].id_number}</p></td>
                    <td className="iconsult-page-done-idnumber"><strong >HCR ID</strong><br /> <p style={{fontWeight:'normal'}}>{getConsultingArray[index].hcr_id}</p></td>
                    <td className="iconsult-page-done-idnumber"><strong >Time</strong><br /> <p style={{fontWeight:'normal'}}>{getConsultingArray[index].time}</p></td>
                    <td className="center-content" rowSpan="2" colSpan="2" >
                    <GenericPdfDownloader
                  className="table-row-pdf"
                downloadFileName="CustomPdf"
                rootElementId="testId"
                consult_id={getConsultingArray[index].consult_id}
              />
                 </td>
                  </tr>

                  <tr>
                    <td className="iconsult-page-done-idnumber"><strong style={{ marginLeft: '25px' }} >Mobile Number</strong><br /> <p  style={{ marginLeft: '25px', fontWeight: 'normal' }}>{getConsultingArray[index].mobile_number}</p></td>
                    <td className="iconsult-page-done-idnumber"><strong    >(HCR) Name</strong><br />  <p >{getConsultingArray[index].hcr_name}</p> </td>
                    <td className="iconsult-page-done-idnumber"><strong >Doctor</strong> <br /> <p > {getConsultingArray[index].assignee} </p></td>
                  </tr>
                </tbody>
              </table>
          
            </div>
          </td>
        </tr>
      );
    }
    return null;
  };

  const renderStaffData = () => {
    if (getConsultingArray.length > 0) {
      return (
        <tbody>
          {getConsultingArray.map((item, index) => (
            <React.Fragment key={index}>
                          <tr className={openChildRowIndex === index ? 'no-bottom-border' : ''} style={{fontSize:'11px'}}>
                <td onClick={() => toggleChildRow(index)} className="table-cell">
                  {openChildRowIndex === index ? <BsChevronUp className="table-cell-icon" /> : <BsChevronDown className="table-cell-icon" />}
                  <span >{item.name}</span>
                </td>
                <td className="table-cell" style={{fontWeight:'normal'}}><span style={{marginLeft:"5px"}}>{item.sick_type}</span></td>
                <td className="table-cell" style={{fontWeight:'normal'}}>{item.consult_id}</td>
                <td className="table-cell" style={{fontWeight:'normal'}}>{item.class_and_division}</td>
                <td className="table-cell" style={{fontWeight:'normal'}}>{item.date_time}</td>
              </tr>
              {renderChildRow(index)}
            </React.Fragment>
          ))}
        </tbody>
      );
    }
    return null;
  };

  return (
    <div className="">
      <div className="container-fluid"  style={{marginTop:'90px',marginLeft:'80px',width:'93%',height:'auto'}}>
        <div className="iview-container" >
          <div className="iview-head">
            <h5 className="istaff-head-title ml-4" style={{ fontWeight: "bold"}}>Student Details</h5></div>
 </div>
          <div className="istaffview-container d-flex  align-items-center justify-content-end"  style={{marginTop:' -37px'}}>
            <button
              onClick={() => {setShowPopup(true);}}
              style={{ width: "87px",height:'33px',  borderColor: "#0089FF", color: "#0089FF",fontSize:"13px",borderWidth:'2px', color: "#0089FF",borderRadius:'5px' }}
              className="btn mr-3 ">
              Delete
            </button>
            <button
              onClick={() => handleEdit(studentIndividualID)}
              style={{ width: "85px", backgroundColor: "#0089FF", color: "white",height:'33px',fontSize:"13px",borderRadius:'6px' }}
              className="btn mr-3 staffview-button"
            >
              Edit
            </button>
          </div>
       

        <div className="row">
          <div className=" col-md-3 mt-2">
            <div className="card"  style={{borderRadius:'10px',height:'100%'}}>
              <img
                src={staffDetails.profile || poke}
                alt=""
                className="iStudent-pic"
              />
              <div className="text-center mt-2">
                <p className="staffnames">{staffDetails.name}</p>
                <p className="bold staffidnumber">ID Number: <span className="lighterfont">{staffDetails.id_number}</span></p>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-9 mt-2">
            <div className="card iprofiledetails-container" style={{borderRadius:'10px'}} >
              <div className="icontainer-table" >
              <div class="table-responsive">
                <table className="table mt-3"  style={{width:'95%'}}>
              
                  <thead className="itable-header">
                    <tr  className="" style={{fontSize:'12px'}}>
                      <th> <span style={{marginLeft:'15px'}}>Name</span></th>
                      <th><span style={{marginLeft:"5px"}}>Sick Type</span></th>
                      <th>Consulting ID</th>
                      <th>Division</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  {renderStaffData()}
                </table>
              </div>
            </div>
          </div>
          </div>
     </div>
        <div className="card mt-3  istaffviewdetails-container border-right full-height"  >
          <div className="istaffview-contact">
            <div className="row   row-space-container">
              <div className="col-md-3 col-12 text-start  border-right full-height">
                <h5 className="icard-title mt-4" >
                  <strong>Personal Details</strong>
                </h5>
                <p className="icard-text" >
                  <strong>Name:</strong> {staffDetails.name} <br />
                  <strong>Department:</strong> {staffDetails.department} <br />
                  <strong>Class/Division:</strong> {staffDetails.class_and_division} <br />
                  <strong>Age:</strong> {staffDetails.age} <br />
                  <strong>Gender:</strong> {staffDetails.gender}<br />
                  <strong>Blood Group:</strong> {staffDetails.blood_group}
                </p>
              </div>
              <div className="col-md-3 col-12 border-right full-height text-start  ">
                <div className="card-body staffcard-body">
                  <h5 className="icard-title">
                    <strong>Address</strong>
                  </h5>
                  <p className="icard-text" >
                    {staffDetails.address}
                    <br></br>
                    {staffDetails.pincode}
                    <br></br>
                   {staffDetails.state}
                    <br />
{/*                    
                    <strong>{staffDetails.relation}:</strong> {staffDetails.parent_name}<br /> */}
                    <strong>Mobile:</strong> {staffDetails.mobile_number}
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-12 text-start full-height border-right ">
                <div className="card-body staffcard-body">
                  <h5 className="icard-title mt-1" >
                    <strong>Allergies</strong>
                  </h5>
                  <p className="icard-text">
                    {staffDetails.allergies_define}
                  </p>
                  <h5 className="icard-title mt-1"  >
                    <strong>Any Disease</strong>
                  </h5>
                  <p className="icard-text">
                    {staffDetails.any_disease_define}
                  </p>
                </div>
              </div>
              <div className=" col-md-3 col-12 text-center">
              <div className="card-body staffcard-body">
      <h5 className="card-titles staffcard-title">Current Health Report</h5>
      <button className="btn iresponsive-button"  onClick={() => handleShow('current')}>
        View Document
      </button>
      
      <h5 className="card-titles staffcard-title mt-3">Past Health Report</h5>
      <button className="btn iresponsive-button" onClick={() => handleShow('past')}>
        View Document
      </button>

     
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <img src={modalImage} alt="Health Report" style={{ width: '100%' }} />
        </Modal.Body>
      </Modal>

    </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
         <Modal  className="modal-contentsi"  show={showPopup} onHide={() => setShowPopup(false)} centered>
      
         <Modal.Body >
         <div className="staffk-deleteappoint1">
       Delete Student
        <button
          className="staff-close-button1"
          onClick={() => setShowPopup(false)}
          aria-label="Close"
        >
          ×
        </button>
   </div>
           <p className="viewstaff-popuppara1">Would you like to delete the student?</p>
      
           <Button variant="secondary" className="viewstaff-cancel1" onClick={() => setShowPopup(false)}>
             Cancel
           </Button>
           <Button variant="danger" className="viewstaff-delete1 ml-4" onClick={() => handleDelete(studentIndividualID)}>
             Delete
           </Button>
           </Modal.Body>
        
       </Modal>
      )}
    </div>
  );
}

export default StudentViewPage;