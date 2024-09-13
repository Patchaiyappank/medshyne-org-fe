import React, { useState, useCallback, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Container, Card, Modal } from 'react-bootstrap';
import './StudentList.css';
import View from '../assest/View.png';
import Delete from '../assest/deleted.png';
import Edit from '../assest/edit.png';
import FilterIcon from '../assest/filter.png';
import AddIcon from '../assest/Add-user.png';
import SearchIcon from '../assest/lens.png';
import DefaultImage from '../assest/blank image.png'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
 

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/superAdmin_list_of_student', {
          params: { organization_name: 'demo12 school' }
        });
        if (response.data.Result === "Success") {
          setStudents(response.data.result);
        } else {
          setError(response.data.message || 'Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
        setError('An error occurred while fetching student details.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchStudents();
  }, []);

  const handleAddStudent = () => {
    navigate("/AddStudent", { state: {  mode: "new" } });
  };
  const handleViewClick = (id_number) => {
    alert(`Navigating to student member with ID: ${id_number}`);
    navigate(`/StudentView`, {state: {id_number}});
    console.log("ID passed:", id_number);
  };

  const handleEditClick = (id_number) => {
    alert(id_number);
    navigate("/AddStudent", {
      state: {
        id_number: id_number,
        mode: "edit",
      },
    });
    console.log(`Edit staff with ID ${id_number}`);
  };

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedStudent(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedStudent) {
      try {
        const response = await axios.put(`http://localhost:5000/superAdmin_student_delete_btn`, null, {
          params: { id_number: selectedStudent.id_number },
        });
  
        if (response.data.Result === "Success") {
          setStudents((prevStudents) =>
            prevStudents.filter((student) => student.id_number !== selectedStudent.id_number)
          );
          alert("Student deleted successfully.");
        } else {
          alert(response.data.message || "Failed to delete the student.");
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert("An error occurred while deleting the student.");
      } finally {
        setShowDeleteModal(false);
        setSelectedStudent(null);
      }
    }
  };
  

  const handleChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  }, []);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(students.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = students.slice(indexOfFirstItem, indexOfLastItem);

  const filteredStudents = currentItems.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(students.length / itemsPerPage);

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= maxPagesToShow - 2) {
        for (let i = 1; i <= maxPagesToShow - 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - (maxPagesToShow - 2)) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages.map((page, index) => (
      page === '...' ? (
        <span key={index} className="studentlist-pagination-ellipsis">...</span>
      ) : (
        <span
          key={page}
          className={`studentlist-pagination-item ${page === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </span>
      )
    ));
  };

  return (
    <Container className="mt-4 me-4">
        <h1 className="mt-n1 ps-1 fs-4 fw-bold">Organization Name</h1>
        <hr/>
      <Row>
        <Col>
          <Card className="studentlist-main-card">
            <Card.Body>
              <Card className="studentlist-sub-card">
                <Card.Body>
                  <Row className="align-items-center mb-3">
                    <Col>
                      <h2 style={{ color: '#212121', fontSize: '18px', fontWeight: 'bold' }}>List of Students</h2>
                      <p className="mb-4" style={{ fontSize: '13px', color: '#B5B5C3' }}>{students.length} Students</p>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <div className="studentlist-search-filter-add">
                        <div className="studentlist-search-input-container">
                          <img src={SearchIcon} alt="Search" className="studentlist-search-icon" />
                          <Form.Control
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleChange}
                            className="form-control studentlist-search-input"
                          />
                        </div>
                       
                        <Button variant="primary" className="studentlist-add-button"   onClick={handleAddStudent}>
                          <img src={AddIcon} alt="Add" className="studentlist-icon" /> Add Students
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Table className="studentlist-table">
                    <thead>
                      <tr>
                        <th className="studentlist-th"  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Name</th>
                        <th className='text-center studentlist-th'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Division</th>
                        <th className='text-center studentlist-th'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>HCR</th>
                        <th className='text-center studentlist-th'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Parents Contact</th>
                        <th className='text-center studentlist-th'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Last Update</th>
                        <th className='text-center studentlist-th'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>View</th>
                        <th className='text-center studentlist-th'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Edit</th>
                        <th className='text-center studentlist-th'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <tr key={student.id}>
                            <td className="studentlist-tds">
                              <img src={DefaultImage} alt={student.name} className="studentlist-image" />
                              <span className='studentlist-name'>{student.name}</span>
                            </td>
                            <td className="studentlist-td">{student.division}</td>
                            <td className="studentlist-td">{student.hcr}</td>
                            <td className="studentlist-td">{student.mobile_number}</td>
                            <td className="studentlist-td">{student.doc}</td>
                            <td className="studentlist-td">
                              <Button variant="link" className="studentlist-icon-button">
                                <img src={View} alt="View" className="studentlist-icon" onClick={() => {handleViewClick(student.id_number);}}/>
                              </Button>
                            </td>
                            <td className="studentlist-td">
                              <Button variant="link" className="studentlist-icon-button"  onClick={() => { handleEditClick(student.id_number) }}>
                                <img src={Edit} alt="Edit" className="studentlist-icon" />
                              </Button>
                            </td>
                            <td className="studentlist-td">
                              <Button variant="link" className="studentlist-icon-button" onClick={() => handleDeleteClick(student)}>
                                <img src={Delete} alt="Delete" className="studentlist-icon" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No students found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>

          <div className="studentlist-pagination">
            <span
              className="studentlist-pagination-arrow"
              onClick={() => handlePageChange(currentPage - 1)}
              style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              <span className="studentlist-prevoius-arrow">&#8249;</span> Previous
            </span>
            <span className="studentlist-pagination-pages">{renderPageNumbers()}</span>
            <span
              className="studentlist-pagination-arrow"
              onClick={() => handlePageChange(currentPage + 1)}
              style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next <span className="studentlist-next-arrow">&#8250;</span>
            </span>
          </div>
        </Col>
      </Row>

      {/* Move the Modal here, outside the map loop */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentList;
