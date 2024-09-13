import React, { useState, useCallback, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Container, Card, Modal } from 'react-bootstrap';
import axios from 'axios';
import './StaffList.css';
import View from '../assest/View.png';
import Delete from '../assest/deleted.png';
import Edit from '../assest/edit.png';
import AddIcon from '../assest/Add-user.png';
import SearchIcon from '../assest/lens.png';
import DefaultImage from '../assest/blank image.png';
import { useNavigate } from 'react-router-dom';

const StaffList = () => {
  const [staffs, setStaffs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/superAdmin_List_of_staffs', {
          params: { organization_name: 'demo12 school' }
        });
        setStaffs(response.data || []);
      } catch (error) {
        console.error('Error fetching staff details:', error);
      }
    };

    fetchStaffs();
  }, []);

  const handleAddClick = () => {
    navigate('/AddStaff', { state: { mode: 'new' } });
  };

  const handleViewClick = (id_number) => {
    alert(`You are about to view details for staff member with ID: ${id_number}`);
    navigate(`/StaffView`, { state: { id_number } });
  };

  const handleEditClick = (id_number) => {
    alert(`You are about to view details for staff member with ID: ${id_number}`);
    navigate('/AddStaff', { state: { id_number, mode: 'edit' } });
  };
  
  const handleDeleteClick = (staff) => {
    setSelectedStaff(staff);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedStaff(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedStaff) {
      try {
        const response = await axios.put('http://localhost:5000/superAdmin_staff_delete_btn', null, {
          params: { id_number: selectedStaff.id_number },
        });
  
        if (response.data.Result === "Success") {
          setStaffs((prevStaffs) =>
            prevStaffs.filter((staff) => staff.id_number !== selectedStaff.id_number)
          );
          alert("Staff deleted successfully.");
        } else {
          alert(response.data.message || "Failed to delete the staff.");
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert("An error occurred while deleting the staff.");
      } finally {
        setShowDeleteModal(false);
        setSelectedStaff(null);
      }
    }
  };

  const handleChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(staffs.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = staffs.slice(indexOfFirstItem, indexOfLastItem);

  const filteredStaffs = currentItems.filter((staff) => {
    const name = staff.name || ''; // Default to empty string if null/undefined
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(staffs.length / itemsPerPage);

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
        <span key={index} className="stafflist-pagination-ellipsis">...</span>
      ) : (
        <span
          key={page}
          className={`stafflist-pagination-item ${page === currentPage ? 'active' : ''}`}
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
      <hr style={{color:' rgba(0, 0, 0, 0.2)'}}></hr>
      <Row>
        <Col>
          <Card className="stafflist-main-card">
            <Card.Body>
              <Card className="stafflist-sub-card">
                <Card.Body>
                  <Row className="align-items-center mb-3">
                    <Col>
                      <h2 className=" " style={{ color: '#212121', fontSize: '18px', fontWeight: 'bold' }}>List of Staffs</h2>
                      <p className="mb-4" style={{ fontSize: '13px', color: '#B5B5C3' }}>{staffs.length} staffs</p>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <div className="stafflist-search-filter-add">
                        <div className="stafflist-search-input-container">
                          <img src={SearchIcon} alt="Search" className="stafflist-search-icon" />
                          <Form.Control
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleChange}
                            className="form-control stafflist-search-input"
                          />
                        </div>
                        <Button variant="primary" className="stafflist-add-button" onClick={handleAddClick}>
                          <img src={AddIcon} alt="Add" className="stafflist-icon" /> Add Staffs
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Table className="stafflist-table">
                    <thead>
                      <tr>
                        <th className='ps-3  stafflist-head'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Name</th>
                        <th className='text-center stafflist-head'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Division</th>
                        <th className='text-center stafflist-head'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>HCR</th>
                        <th className='text-center stafflist-head'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Parents Contact</th>
                        <th className='text-center stafflist-head'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Last Update</th>
                        <th className='text-center stafflist-head'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>View</th>
                        <th className='text-center stafflist-head'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Edit</th>
                        <th className='text-center stafflist-head'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaffs.length > 0 ? (
                        filteredStaffs.map((staff) => (
                          <tr key={staff.id_number}>
                            <td className="stafflist-tds">
                              <img src={staff.profile || DefaultImage} alt={staff.name} className="stafflist-image" />
                              <span className='stafflist-name'>{staff.name}</span>
                            </td>
                            <td className="stafflist-td">{staff.division}</td>
                            <td className="stafflist-td">{staff.hcr}</td>
                            <td className="stafflist-td">{staff.mobile_number}</td>
                            <td className="stafflist-td">{staff.dou}</td>
                            <td className="stafflist-td">
                              <img
                                src={View}
                                alt="View"
                                className="stafflist-icon"
                                onClick={() => handleViewClick(staff.id_number)}
                                style={{ cursor: 'pointer' }}
                              />
                            </td>
                            <td className="stafflist-td">
                              <img
                                src={Edit}
                                alt="Edit"
                                className="stafflist-icon"
                                onClick={() => handleEditClick(staff.id_number)}
                                style={{ cursor: 'pointer' }}
                              />
                            </td>
                            <td className="stafflist-td">
                              <img
                                src={Delete}
                                alt="Delete"
                                className="stafflist-icon"
                                onClick={() => handleDeleteClick(staff)}
                                style={{ cursor: selectedStaff ? 'pointer' : 'not-allowed' }}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="stafflist-no-results">No matching results found.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
          <div className="stafflist-pagination">
            <span
              className="stafflist-pagination-arrow"
              onClick={() => handlePageChange(currentPage - 1)}
              style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              <span className="stafflist-prevoius-arrow">&#8249;</span> Previous
            </span>
            <span className="stafflist-pagination-pages">{renderPageNumbers()}</span>
            <span
              className="stafflist-pagination-arrow"
              onClick={() => handlePageChange(currentPage + 1)}
              style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next <span className="stafflist-next-arrow">&#8250;</span>
            </span>
          </div>
        </Col>
      </Row>
      
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedStaff?.name}?
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

export default StaffList;
