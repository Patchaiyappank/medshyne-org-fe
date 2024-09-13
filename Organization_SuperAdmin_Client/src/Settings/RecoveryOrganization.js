import React, { useState, useCallback, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RecoveryOrganization.css'; // Ensure this file contains updated class names
import defImg from '../images/defimg.png';
import actionIcon from '../assest/actionbutton.png';
const ITEMS_PER_PAGE = 10;

const OrganizationList = () => {
  const [recoveryOrganization, setRecoveryOrganization] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
const navigate = useNavigate();
 
  useEffect(() => {
    const fetchRecoveryOrganization = async () => {
      try {
        const response = await axios.get('http://localhost:5000/superAdmin_deleted-org_list');
        console.log('Response data:', response.data); // Log the data received from the API
        setRecoveryOrganization(response.data);
      } catch (error) {
        console.error('Error fetching organization details:', error);
      }
    };
  
    fetchRecoveryOrganization();
  }, []);
  

  const handleChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  }, []);


  const totalPages = Math.ceil(recoveryOrganization.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagination_recoveryOrganization = recoveryOrganization.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";
    const totalPages = Math.ceil(recoveryOrganization.length / ITEMS_PER_PAGE);
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <span
          key={1}
          className={`organizationListpagination-page ${
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
          className={`organizationListpagination-page ${
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
        pageNumbers.push(<span key="ellipsisEnd" className="organizationList-ellipsis">{ellipsis}</span>);
      }
      pageNumbers.push(
        <span
          key={totalPages}
          className={`organizationListpagination-page ${
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

  const handleSingleStudentClick = (recovery_org_id) => {
    console.log('organizationing ID being passed:', recovery_org_id); // Log the ID to console
    navigate('/Organizationdetails', {
      state: { id: recovery_org_id },
    });
  };
  return (
    <Container style={{fontSize:'12px'}} className="mt-0">
      <Row>
        <Col>
          <Card className="organizationlist-main-card ">
            <Card.Body>
              <Card className="organizationlist-sub-card">
                <div className='Recoveryorgan-card-body'>
                  <Row className=" recoveryorganizationmain mb-0">
                    <Col >
                      <h5 className="mb-0 organizationlist-heading" style={{fontSize:'16px'}}>Deleted Organization</h5>
                      <p className="mb-2" style={{color:'#B5B5C3',fontWeight:'500'}}>{recoveryOrganization.length} Organization</p>
                    </Col>
                  </Row>
                  <div className='organizationlist-table-container'>
                  <Table className="organizationlist-table">
                    <thead className='organizationlist-table-head'>
                      <tr>
                        <th className="organizationlist-th"  style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Name</th>
                        <th className="organizationlist-th"  style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>ID</th>
                        <th className="organizationlist-th"  style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Email</th>
                        <th className="organizationlist-th"  style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Phone number</th>
                        <th className="organizationlist-th" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Date added</th>
                        <th className="organizationlist-th" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}>Rm Name</th>

                        <th className="organizationlist-th border border-0"  style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'700',textAlign:'center'}}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagination_recoveryOrganization.length > 0 ? (
                        pagination_recoveryOrganization.map((recoveryOrganization) => (
                          <tr key={recoveryOrganization.id}>
                            <td className="organizationlist-tds" style={{textAlign:'center'}}>
                              <img src={recoveryOrganization.profile ? recoveryOrganization.profile : defImg} alt={recoveryOrganization.profile} className="organizationlist-image" />
                              <span className='organizationlist-name'>{recoveryOrganization.organization_name}</span>
                            </td>
                            <td className="organizationlist-td"style={{textAlign:'center'}}>{recoveryOrganization.id}</td>
                            <td className="organizationlist-td"style={{textAlign:'center'}}>{recoveryOrganization.email_id}</td>
                            <td className="organizationlist-td"style={{textAlign:'center'}}>{recoveryOrganization.organization_mobile_no}</td>
                            <td className="organizationlist-td"style={{textAlign:'center'}}>{recoveryOrganization.Date}</td>
                            <td className="organizationlist-td"style={{textAlign:'center'}}>{recoveryOrganization.r_m_name}</td>
                            <td className="border border-0">
                    <button className=" organizationList-action-button ms-4 border border-0 "style={{textAlign:'center'}} onClick={() => handleSingleStudentClick(recoveryOrganization.id)}>
                      <img src={actionIcon} alt="Action" className="recovery-organizationList-action-icon border border-0" />
                    </button>
                  </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center">No Organization found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  </div>
                </div>
              </Card>
            </Card.Body>
          </Card>

        </Col>
      </Row>
      <div className="organizationList-pagination">
        <span className="organizationList-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
          <span className="organizationList-prevoius-arrow">&#8249;</span> Previous
        </span>
        <span className="organizationList-pagination-pages">{renderPageNumbers()}</span>
        <span className="organizationList-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
          Next <span className="organizationList-next-arrow">&#8250;</span>
        </span>
      </div>
    </Container>
  );
};

export default OrganizationList;