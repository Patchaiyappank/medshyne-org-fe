import React, { useState, useEffect } from 'react';
import '@fontsource/inter';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import './DoctorList.css';
import addicon from '../assest/Add-user.png';
import actionIcon from '../assest/actionbutton.png';
import profileIcon from '../assest/Photodoctor.png';
import { useNavigate } from 'react-router-dom';
import img from '../images/defimg.png';

const ITEMS_PER_PAGE = 10;

const App = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchDoctors(); // Fetch data on component mount
  }, []);


  const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagination_doctors = doctors.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";
    const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <span
          key={1}
          className={`onboardListpagination-page ${
            currentPage === 1 ? "active" : ""
          }`}
          onClick={() => handlePageChange(1)}
        >
          {1}
        </span>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="ellipsisStart" className="ellipsis">{ellipsis}</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`onboardListpagination-page ${
            currentPage === i ? "active" : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </span>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="ellipsisEnd" className="onboardList-ellipsis">{ellipsis}</span>);
      }
      pageNumbers.push(
        <span
          key={totalPages}
          className={`onboardListpagination-page ${
            currentPage === totalPages ? "active" : ""
          }`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </span>
      );
    }
    return pageNumbers;
  };


  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin_doctor_viewall');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      if (data.Result === 'Success') {
        setDoctors(data.result); // Assuming result is an array of doctors
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Handle error state or alert user
    }
  };

  const newDoctor = () => {
    navigate('/Doctordetails');
  };

  const handleSingleDoctorClick = (doctor_id) => {
    console.log('Doctor ID being passed:', doctor_id); // Log the ID to console
    navigate('/Onedoctor', {
      state: { id: doctor_id },
    });
  };

  return (
    <div style={{marginLeft:'14.8%'}} className="container">
      <header className="my-2">
        <h3 className=' mt-3 ps-4 fs-3 fw-bold'>Doctors</h3>
        <hr style={{color:' rgba(0, 0, 0, 0.2)'}}></hr>
      </header>
      <br />
      <div style={{ padding: '20px', borderRadius: '20px',backgroundColor:"white" }} className=" p-2 mb-5">
        <div className="header-row">
          <div>
            <h5 style={{ color: '#212121', fontSize: '18px', fontWeight: 'bold' }} className=" mt-3">List of Doctors</h5>
            <h6 style={{ fontSize: '13px', color: '#B5B5C3' }} >
              {doctors.length} available doctors
            </h6>
          </div>
          <button className="add-doctor-button mt-1" onClick={newDoctor}>
            <img src={addicon} alt="Add" className="button-icon" />
            Add new Doctor
          </button>
        </div>

        <div className="table-responsive mt-3">
          <Table bordered={false} className="table-borderless">
            <thead>
              <tr style={{ fontSize: '13px' }}>
                <th className='text-left ps-2'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Name</th>
                <th  className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>ID</th>
                <th   className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Email</th>
                <th  className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Phone number</th>
                <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Date added</th>
                <th  className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Gender</th>
                <th  className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}></th>
              </tr>
            </thead>
            <tbody>
              {pagination_doctors.map((doctor, index) => (
                <tr key={index}>
                  <td className="align-middle">
                    <div className="d-flex align-items-center">
                      <img
                        src={doctor.profile?doctor.profile : img}
                        width={40}
                        alt="doctor"
                        className="rounded-circle me-2"
                      />
                      <div>
                        <div style={{ color: '#464E5F', fontSize: '12px', fontWeight: '500' }}>{doctor.doctor_name}</div>
                        <div style={{ color: '#B5B5C3', fontSize: '11px' }} className="text-muted">{doctor.dr_specialization}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign:'center',color: '#464E5F', fontSize: '12px', fontWeight: '500' }} >{doctor.doctor_id}</td>
                  <td style={{ textAlign:'center', color: '#464E5F', fontSize: '12px', fontWeight: '500' }} >{doctor.email}</td>
                  <td style={{textAlign:'center', color: '#464E5F', fontSize: '12px', fontWeight: '500' }}>{doctor.mobile_no}</td>
                  <td >
                    <div style={{ textAlign:'center',color: '#464E5F', fontSize: '12px', fontWeight: '500' }}>{doctor.date}</div>
                    <div style={{ textAlign:'center',color: '#B5B5C3', fontSize: '13px' }} className="text-muted">{doctor.time}</div>
                  </td>
                  <td style={{ textAlign:'center',color: '#464E5F', fontSize: '12px', fontWeight: '500' }} >{doctor.gender}</td>
                  <td className="text-center align-middle">
                    <button className="action-button ms-4" onClick={() => handleSingleDoctorClick(doctor.doctor_id)}>
                      <img src={actionIcon} alt="Action" className="action-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="onboardList-pagination">
        <span className="onboardList-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
          <span className="onboardList-prevoius-arrow">&#8249;</span> Previous
        </span>
        <span className="onboardList-pagination-pages">{renderPageNumbers()}</span>
        <span className="onboardList-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
          Next <span className="onboardList-next-arrow">&#8250;</span>
        </span>
      </div>
    </div>
  );
};

export default App;