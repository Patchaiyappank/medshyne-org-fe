import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import GenericPdfDownloader from './GenericPdfDownloder'
import "../stafflist/staffview.css";
import poke from './blank image.png'
import { Modal,Button } from 'react-bootstrap';

function StaffViewPage() {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const navigate = useNavigate();
  const [openRowIndex, setOpenRowIndex] = useState(null); // Track the currently open row index
  const [staffData, setStaffData] = useState(null);
  const [staffIdToDelete, setStaffIdToDelete] = useState(null);
  const [getName, setName] = useState('');
  const [getProfile, setProfile] = useState('');
  const [getIdNumber, setIdNumber] = useState('');
  const [getDesignation, setDesignation] = useState('');
  const [getDepartment, setDepartment] = useState('');
  const [getClassAndDivision, setClassAndDivision] = useState('');
  const [getAge, setAge] = useState('');
  const [getGender, setGender] = useState('');
  const [getBloodGroup, setBloodGroup] = useState('');
  const [getAddress, setAddress] = useState('');
  const[getPincode,setPincode] = useState('')
  const[getState,setState] = useState('');
  const [getMobileNumber, setMobileNumber] = useState('');
  const [getAllergiesDefine, setAllergiesDefine] = useState('');
  const [getAnyDiseaseDefine, setAnyDiseaseDefine] = useState('');
  const [getFirstArray, setFirstArray] = useState([]);
  const [getSecondArray, setSecondArray] = useState([]);
  const [getConsultingArray, setConsultingArray] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [getPastHealthReport, setPastHealthReport] = useState('');
  const [getCurrentHealthReport, setCurrentHealthReport] = useState('');

  const { state } = useLocation();
  const { id_number } = state;
  const staffIndividualID =Number(id_number);

  useEffect(() => {
    const fetchData = async (id_number) => {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      try {
        const bodyText = { id_number };
        alert('id is:' + id_number);
        const response = fetch(`${baseApiUrl}/consulting_staffprofile_by_id?id_number=${Number(staffIndividualID)}`, options)
          .then(response => response.json())
          .then(data12 => {
            console.log(data12);
            setName(data12.firstArray[0].name);
            setProfile(data12.firstArray[0].profile);
            setIdNumber(data12.firstArray[0].id_number);
           setDesignation(data12.firstArray[0].designation);
            setName(data12.secondArray[0].name);
            setDepartment(data12.secondArray[0].department);
            setClassAndDivision(data12.secondArray[0].class_and_division);
            setAge(data12.secondArray[0].age);
            setGender(data12.secondArray[0].gender);
            setBloodGroup(data12.secondArray[0].blood_group);
            setAddress(data12.secondArray[0].address);
             setPincode(data12.secondArray[0].pincode);
             setState(data12.secondArray[0].state);
            setMobileNumber(data12.secondArray[0].mobile_number);
            setAllergiesDefine(data12.secondArray[0].allergies_define);
            setAnyDiseaseDefine(data12.secondArray[0].any_disease_define);
            setFirstArray(data12.firstArray);
            setSecondArray(data12.secondArray);
            setConsultingArray(data12.consultingArray);
            setPastHealthReport(data12.secondArray[0].past_health_report);
            setCurrentHealthReport(data12.secondArray[0].current_health_report);
          }).catch(err => console.log(err));

        console.log('response is : ' + response);
        if (response.ok) {
          const responseText = await response.json(); // Parse the JSON data
        } else {
          console.error("Failed to fetch details");
        }
      } catch (error) {
        console.error("Error fetching staff details:", error);
      }
    };
    fetchData(staffIndividualID);
  }, [staffIndividualID]);

  const toggleChildRow = (index) => {
    setOpenRowIndex(prevIndex => (prevIndex === index ? null : index)); // Toggle the clicked row, close others
  };

  const handleDelete = (id_number) => {
    alert(id_number);
    navigate('/Staff')
    if (staffData) {
      setStaffData(staffData.filter((staff) => staff.id_number !== id_number));
    }

    fetch(`${baseApiUrl}/softdelete_staff?idNumber=${id_number}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error deleting staff:', error);
      });
  };

  const [show, setShow] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = async (type) => {
    try {
      let reportUrl = '';
      if (type === 'current') {
        reportUrl = getCurrentHealthReport;
      } else if (type === 'past') {
        reportUrl = getPastHealthReport;
      }
      setModalImage(reportUrl);
      setShow(true);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };



  const handleEdit = (id_number) => {
    alert(id_number);
    navigate('/StaffForm', {
      state: {
        id_number: id_number,
        mode: 'edit'
      }
    });
    console.log(`Edit staff with ID ${id_number}`);
  };

  const renderChildRow = (index) => {
    if (openRowIndex === index) {
      return (
        <tr className="" key={`child-${index}`} >
          <td colSpan="5">
            <div className="ichild-row-content" style={{ fontWeight: 500 }}>
              <table className="iviewstaf" style={{ borderTop: 'none', borderBottom: 'none' }}>
                <tbody>
                <tr className="itable-row-bottom">
  <td className="iconsult-page-done-idnumber">
    <strong style={{ marginLeft: '25px' }}>Staff ID</strong><br />
    <p style={{ marginLeft: '25px', fontWeight: 'normal' }}>{getConsultingArray[index].id_number}</p>
  </td>
  <td className="iconsult-page-done-idnumber">
    <strong>HCR ID</strong><br />
    <p style={{ fontWeight: 'normal' }}>{getConsultingArray[index].hcr_id}</p>
  </td>
  <td className="iconsult-page-done-idnumber">
    <strong>Time</strong><br />
    <p style={{ fontWeight: 'normal' }}>{getConsultingArray[index].time}</p>
  </td>
  <td className="center-content" rowSpan="2" colSpan="2">
    <GenericPdfDownloader
      className="table-row-pdf"
      downloadFileName="CustomPdf"
      rootElementId="testId"
      consult_id={getConsultingArray[index].consult_id}
    />
  </td>
</tr>

<tr className="itable-row-bottom">
<td className="iconsult-page-done-idnumber">
    <strong style={{ marginLeft: '25px' }}>Mobile Number</strong><br />
    <p style={{ marginLeft: '25px', fontWeight: 'normal' }}>{getConsultingArray[index].mobile_number}</p>
</td>
<td className="iconsult-page-done-idnumber">
    <strong>(HCR) Name</strong><br />
    <p>{getConsultingArray[index].hcr_name}</p>
</td>
<td className="iconsult-page-done-idnumber">
    <strong>Doctor</strong><br />
    <p>{getConsultingArray[index].assignee}</p>
</td>
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
            <tr className={openRowIndex === index ? 'no-bottom-border' : ''} style={{fontSize:'11px'}}>
            <td 
    onClick={() => toggleChildRow(index)} 
    className="table-cell"
>
    {openRowIndex === index ? 
        <BsChevronUp className="table-cell-icon" /> : 
        <BsChevronDown className="table-cell-icon" />
    } 
    <span>{item.name}</span>
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
      <div className="container-fluid" style={{marginTop:'90px',marginLeft:'80px',width:'93%',height:'auto'}}>
        <div className="iview-container" >

          <div className="iview-head">
            <h5 className="istaff-head-title ml-4" style={{fontWeight:'bold'}}>Staff Details</h5></div>
            </div>
          <div className="istaffview-container d-flex  align-items-center justify-content-end" style={{marginTop:'-37px'}} >
            <button onClick={() => {
              setShowPopup(true);
              setStaffIdToDelete(staffIndividualID)
            }}
              style={{ width: "87px",height:'33px', borderColor: "#0089FF",fontSize:"13px",borderWidth:'2px', color: "#0089FF",borderRadius:'5px'}}
              className="btn mr-3 "
            >
              Delete
            </button>


            <button
              onClick={() => handleEdit(staffIndividualID)}
              style={{ width: "85px", backgroundColor: "#0089FF",height:'33px',fontSize:"13px",color: "white",borderRadius:'6px' }}
              className="btn mr-3 staffview-button"
            >
              Edit
            </button>
          </div>
   
        <div className="row">
          <div className="col-md-3 mt-2  ">
            <div className="card" style={{borderRadius:'10px',height:'100%'}}>
              <img
                src={getProfile || poke}
              
                alt=""
                className="iStudent-pic"
              />
           <div className="text-center mt-2">
  <p className="staffnames">{getName}</p>
  <p className="bold staffidnumber">ID Number: {getIdNumber}</p>
  <p className="bold staffdesignationid fw-bold">Designation: <span className="lighterfont">{getDesignation}</span></p>
</div>

            </div>
          </div>
          <div className="col-sm-12 col-md-9 mt-2">
            <div className="card iprofiledetails-container" style={{borderRadius:'10px'}}>
              <div className="icontainer-table" >
              <div class="table-responsive">
                <table className="table mt-3" style={{width:'95%'}}>
              
                  <thead className="itable-header">
                  <tr className="headingtablestaff">
    <th><span style={{marginLeft:'15px'}}>Name</span></th>
    <th>  <span style={{marginLeft:'5px'}}>Sick Type</span></th>
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
        <div className="card card-container istaffviewdetails-container border-right full-height">
  <div className="istaffview-contact">
    <div className="row row-space-container">
      <div className="col-md-3 col-12 text-start border-right full-height">
        <h5 className="icard-title mt-4">
          <strong>Personal Details</strong>
        </h5>
        <p className="icard-text">
          <strong>Name:</strong> {getName} <br />
          <strong>Department:</strong> {getDepartment} <br />
          <strong>Incharge For:</strong> {getClassAndDivision} <br />
          <strong>Age:</strong> {getAge} <br />
          <strong>Gender:</strong> {getGender}<br />
          <strong>Blood Group:</strong> {getBloodGroup}
        </p>
      </div>
      <div className="col-md-3 col-12 border-right full-height text-start">
        <div className="card-body staffcard-body">
          <h5 className="icard-title mt-1">
            <strong>Address</strong>
          </h5>
          <p className="icard-text">
            {getAddress}
            <br />
            {getPincode}
            <br />
            {getState}
            <br/>
            <strong>Mobile:</strong> {getMobileNumber}
          </p>
        </div>
      </div>
      <div className="col-md-3 col-12 border-right full-height text-start">
        <div className="card-body staffcard-body">
          <h5 className="icard-title mt-1">
            <strong>Allergies</strong>
          </h5>
          <p className="icard-text">
            {getAllergiesDefine}
          </p>
          <h5 className="icard-title mt-1">
            <strong>Any Disease</strong>
          </h5>
          <p className="icard-text">
            {getAnyDiseaseDefine}
          </p>
        </div>
      </div>
      <div className="col-md-3 col-12 text-center">
      <div className="card-body staffcard-body ">
      <h5 className="card-titles staffcard-title " >Current Health Report</h5>
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
       Delete Staff
        <button
          className="staff-close-button1"
          onClick={() => setShowPopup(false)}
          aria-label="Close"
        >
          ×
        </button>
   </div>
           <p className="viewstaff-popuppara1">Would you like to delete the staff?</p>
      
           <Button variant="secondary" className="viewstaff-cancel1" onClick={() => setShowPopup(false)}>
             Cancel
           </Button>
           <Button variant="danger" className="viewstaff-delete1 ml-4" onClick={() => handleDelete(staffIndividualID)}>
             Delete
           </Button>
           </Modal.Body>
        
       </Modal>
      )}
    
    </div>
  );
}

export default StaffViewPage;