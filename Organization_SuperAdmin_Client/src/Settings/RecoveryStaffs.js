import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Form, Row, Col, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import './RecoveryStaffs.css'; // Ensure this file contains updated class names
import View from '../images/view.jpg';
import Recovery from '../images/Frame 48095789.png';
import Edit from '../assest/edit.png';
import SearchIcon from '../images/search.jpg';
import defImg from '../images/defimg.png';

const ITEMS_PER_PAGE = 10;

const RecoveryStaffsList = () => {
  const [recoveryStaffs, setRecoveryStaffs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    
  
    fetchRecoveryStaffs();
  }, []);
  
  const fetchRecoveryStaffs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/superAdmin_recovery_deleted-staff_details');
      console.log('API response:', response.data);
      
      // Assuming the correct array is in response.data.staffs or adjust based on the actual response
      if (Array.isArray(response.data.data)) {
        setRecoveryStaffs(response.data.data);
      } else if (Array.isArray(response.data.data.staffs)) {
        setRecoveryStaffs(response.data.data.staffs);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching staff details:', error);
      setError('Failed to fetch staff details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const handleChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  }, []);

  const totalPages = Math.ceil(recoveryStaffs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const filteredStaffs = recoveryStaffs.filter(staff =>
    staff.name && staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const paginationRecoveryStaffs = filteredStaffs.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";
    const totalPages = Math.ceil(recoveryStaffs.length / ITEMS_PER_PAGE);
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <span
          key={1}
          className={`staffsListpagination-page ${
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
          className={`staffsListpagination-page ${
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
        pageNumbers.push(<span key="ellipsisEnd" className="staffsList-ellipsis">{ellipsis}</span>);
      }
      pageNumbers.push(
        <span
          key={totalPages}
          className={`staffsListpagination-page ${
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


  const recoverStaff = async (id_number) => {
    try {
      const response = await axios.put(`http://localhost:5000/superAdmin_recovery_deleted-staff_details_recovery/${id_number}`);
      
      if (response.data.Result === 'Success') {
        console.log('Staff recovery successful:', response.data.message);
        alert(response.data.message);
        fetchRecoveryStaffs();
        // Handle success (e.g., show a notification, refresh the list)
      } else {
        console.log('Recovery failed:', response.data.message);
        alert(response.data.message);
        // Handle failure (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error recovering staff:', error.response?.data?.message || error.message);
      // Handle error (e.g., show an error notification)
    }
  };

  const handleSingleStaffviewClick = (staff_view_id) => {
    console.log('staffsing ID being passed:', staff_view_id); // Log the ID to console
    navigate('/StaffView', {
      state: { id_number: staff_view_id},
    });
  };

  const handleSingleStaffeditClick = (staff_view_id) => {
    console.log('staffsing ID being passed:', staff_view_id); // Log the ID to console
    navigate('/AddStaff', {
      state: { id_number: staff_view_id },
    });
  };


  return (
    <Container style={{ fontSize: '12px' }} className="mt-0">
      <Row>
        <Col>
          <Card className="recoverystaffs-main-card">
            <Card.Body>
              <Card className="recoverystaffs-sub-card">
              <div className='Recoveryorgan-card-body'>
                
                  <Row className=" recoverystaffmain mb-3 mt-0">
                    <Col>
                      <h5 className="mb-0 recoverystaffs-heading" style={{ fontSize: '16px' }}>Deleted Staffs</h5>
                      <p className="mb-0"style={{color:'#B5B5C3',fontWeight:'500'}}>{recoveryStaffs.length} staffs</p>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <div className="recoverystaffs-search-filter-add">
                        <div className="recoverystaffs-search-input-container">
                          <img src={SearchIcon} alt="Search" className="recoverystaffs-search-icon" />
                          <Form.Control
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleChange}
                            className="form-control recoverystaffs-search-input"
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className='recoverystaffs-table-container'>
                  <Table className="recoverystaffs-table">
                    <thead  className='recoverystaff-table-head'>
                      <tr>
                        <th className="recoverystaffs-th"  style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Name</th>
                        <th className="recoverystaffs-th"  style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Designation</th>
                        <th className="recoverystaffs-th"  style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>HCR</th>
                        <th className="recoverystaffs-th"  style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Staff contact</th>
                        <th className="recoverystaffs-th"  style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Last Update</th>
                        <th className="recoverystaffs-th"  style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>View</th>
                        <th className="recoverystaffs-th"  style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Edit</th>
                        <th className="recoverystaffs-th"  style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Recovery</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginationRecoveryStaffs.length > 0 ? (
                        paginationRecoveryStaffs.map((recoveryStaffs, index) => (
                          <tr key={index}>
                            <td className="recoverystaffs-tds mt-0"  style={{textAlign:'center'}}>
                              <img src={recoveryStaffs.profile ? recoveryStaffs.profile : defImg} alt={recoveryStaffs.name} className="recoverystaffs-image" />
                              <span className='recoverystaffs-name'>{recoveryStaffs.name}</span>
                            </td>
                            <td className="recoverystaffs-td" style={{textAlign:'center'}}>{recoveryStaffs.designation}</td>
                            <td className="recoverystaffs-td"  style={{textAlign:'center'}}>{recoveryStaffs.hcr}</td>
                            <td className="recoverystaffs-td"  style={{textAlign:'center'}}>{recoveryStaffs.mobile_number}</td>
                            <td className="recoverystaffs-td"  style={{textAlign:'center'}}>{recoveryStaffs.date}</td>
                            <td className="recoverystaffs-td"  style={{textAlign:'center'}}>
                              <Button variant="link" className="recoverystaffs-icon-button">
                                <img src={View} alt="View" className="recoverystaffs-icon" onClick={() => handleSingleStaffviewClick(recoveryStaffs.id_number)}/>
                              </Button>
                            </td>
                            <td className="recoverystaffs-td"  style={{textAlign:'center'}}>
                              <Button variant="link" className="recoverystaffs-icon-button">
                                <img src={Edit} alt="Edit" className="recoverystaffs-icon"  onClick={() => handleSingleStaffeditClick(recoveryStaffs.id_number)} />
                              </Button>
                            </td>
                            <td className="recoverystaffs-td"  style={{textAlign:'center'}}>
                              <Button variant="link" className="recoverystaffs-icon-button">
                                <img src={Recovery} alt="Recovery" className="recoverystaffs-icon"  onClick={() => {recoverStaff(recoveryStaffs.id_number)}}/>
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center">No staffs found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  </div>
                
                </div>
              </Card>
            </Card.Body>
          </Card>
     
               <div className="staffsList-pagination">
        <span className="staffsList-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
          <span className="staffsList-prevoius-arrow">&#8249;</span> Previous
        </span>
        <span className="staffsList-pagination-pages">{renderPageNumbers()}</span>
        <span className="staffsList-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
          Next <span className="staffsList-next-arrow">&#8250;</span>
        </span>
      </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RecoveryStaffsList;