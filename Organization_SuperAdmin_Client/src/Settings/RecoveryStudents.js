import React, { useState, useCallback, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import './RecoveryStudents.css'; // Ensure this file contains updated class names
import View from '../images/view.jpg';
import Recovery from '../images/Frame 48095789.png';
import Edit from '../assest/edit.png';
import SearchIcon from '../images/search.jpg'
// import FilterIcon from '../images/Vector.jpg'
import { useNavigate } from 'react-router-dom';
import defImg from '../images/defimg.png';

const ITEMS_PER_PAGE = 10;

const RecoveryStudents = () => {
 
  const [recoveryStudents, setRecoveryStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
   

    fetchRecoveryStudents();
  }, []);

  
  const fetchRecoveryStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/superAdmin_recovery_deleted_student_details');
      setRecoveryStudents(response.data);
    } catch (error) {
      console.error('Error fetching staff details:', error);
      setError('Failed to fetch staff details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const recoverStaffdetails = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/superAdmin_recovery_deleted-student/${id}`);
      
      if (response.data.Result === 'Success') {
        console.log('Staff recovery successful:', response.data.message);
        alert(response.data.message);
        fetchRecoveryStudents(); // Refresh the list of recovered students
      } else {
        console.log('Recovery failed:', response.data.message);
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error recovering staff:', error.response?.data?.message || error.message);
    }
  };
  

  const handleChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  }, []);


 

  
  const totalPages = Math.ceil(recoveryStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const filteredStaffs = recoveryStudents.filter(recoveryStudents =>
    recoveryStudents.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const pagination_recoveryStudents = filteredStaffs.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

 
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";
    const totalPages = Math.ceil(recoveryStudents.length / ITEMS_PER_PAGE);
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <span
          key={1}
          className={`studentsListpagination-page ${
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
          className={`studentsListpagination-page ${
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
        pageNumbers.push(<span key="ellipsisEnd" className="studentsList-ellipsis">{ellipsis}</span>);
      }
      pageNumbers.push(
        <span
          key={totalPages}
          className={`studentsListpagination-page ${
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


  const handleSingleStudentviewClick = (student_view_id) => {
    console.log('studentsing ID being passed:', student_view_id); // Log the ID to console
    navigate('/StudentView', {
      state: { id_number: student_view_id },
    });
  };

  const handleSingleStudenteditClick = (student_edit_id) => {
    console.log('studentsing ID being passed:', student_edit_id); // Log the ID to console
    navigate('/AddStudent', {
      state: { id_number: student_edit_id },
    });
  };
  return (
    <Container style={{fontSize:'12px'}} className="mt-0">
      <Row>
        <Col>
          <Card className="recoverystudents-main-card">
            <Card.Body >
              <Card className="recoverystudents-sub-card">
              <div className='Recoveryorgan-card-body'>
                
                  <Row className="  recoverystudentsmain mb-1">
                    <Col>
                      <h5 className="mb-0 recoverystudents-heading" style={{fontSize:'16px'}}>Deleted Students</h5>
                      <p className="mb-2"style={{color:'#B5B5C3',fontWeight:'500'}}>{recoveryStudents.length} Staffs</p>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <div className="recoverystudents-search-filter-add">
                        <div className="recoverystudents-search-input-container">
                          <img src={SearchIcon} alt="Search" className="recoverystudents-search-icon" />
                          <Form.Control
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleChange}
                            className="form-control recoverystudents-search-input"
                          />
                        </div>
                       
                      
                      </div>
                    </Col>
                  </Row>
                  <div className='recoverystudents-table-container'>
                  <Table className="recoverystudents-table">
                    <thead className='recoverystudents-table-head'>
                    <tr>
                        <th className="recoverystudents-th"   style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Name</th>
                        <th className="recoverystudents-th" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Division</th>
                        <th className="recoverystudents-th" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Hcr</th>
                        <th className="recoverystudents-th" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Parents content</th>
                        <th className="recoverystudents-th" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>last Update</th>
                        <th className="recoverystudents-th" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>view</th>
                        <th className="recoverystudents-th" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Edit</th>
                        <th className="recoverystudents-th" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Recovery</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagination_recoveryStudents.length > 0 ? (
                        pagination_recoveryStudents.map((recoveryStudents) => (
                          <tr key={recoveryStudents.id}>
                            <td className="recoverystudents-tds" style={{textAlign:'center'}}>
                              <img src={recoveryStudents.profile ? recoveryStudents.profile : defImg} alt={recoveryStudents.profile} className="recoverystudents-image" />
                              <span className='recoverystudents-name'>{recoveryStudents.name}</span>
                            </td>
                            <td className="border border-0 recoverystudentst-td" style={{textAlign:'center'}}>{recoveryStudents.class_division}</td>
                            <td className="recoverystudents-td" style={{textAlign:'center'}}>{recoveryStudents.hcr}</td>  
                            <td className="recoverystudents-td" style={{textAlign:'center'}}>
                              {recoveryStudents.relations.map((relation, index) => (
                                <div key={index}>
                                 {relation.mobile_number}
                                </div>
                              ))}
                            </td>
                            <td className="recoverystudents-td" style={{textAlign:'center'}}>{recoveryStudents.dou}</td>

                            <td className="recoverystudents-td"style={{textAlign:'center'}}>
                              <Button variant="link" className="recoverystudents-icon-button">
                                <img src={View} alt="View" className="recoverystudents-icon" onClick={() => handleSingleStudentviewClick(recoveryStudents.id_number)}/>
                              </Button>
                            </td>
                            <td className="recoverystudents-td" style={{textAlign:'center'}}>
                              <Button variant="link" className="recoverystudents-icon-button">
                                <img src={Edit} alt="Edit" className="recoverystudents-icon" onClick={() => { handleSingleStudenteditClick(recoveryStudents.id_number)}} />
                              </Button>
                            </td>
                            <td className="recoverystudents-td" style={{textAlign:'center'}}>
                              <Button variant="link" className="recoverystudents-icon-button">
                                <img src={Recovery} alt="Delete" className="recoverystudents-icon" onClick={() => {recoverStaffdetails(recoveryStudents.id_number)}}/>
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
      
               <div className="studentsList-pagination">
        <span className="studentsList-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
          <span className="studentsList-prevoius-arrow">&#8249;</span> Previous
        </span>
        <span className="studentsList-pagination-pages">{renderPageNumbers()}</span>
        <span className="studentsList-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
          Next <span className="studentsList-next-arrow">&#8250;</span>
        </span>
      </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RecoveryStudents;