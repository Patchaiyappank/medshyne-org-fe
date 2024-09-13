import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import './OrganizationList.css';
import round from '../images/imageround.png';
import iconImage from '../images/actionbutton.png';
import searchIcon from '../images/search.jpg';
import { useNavigate } from 'react-router-dom';

const OrganizationTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalOrganizations, setTotalOrganizations] = useState(0);

  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:5000/superAdmin_list_of_organizations')
      .then(response => response.json())
      .then(result => {
        if (result.Result === "Success") {
          setData(result.organizations);
          setTotalOrganizations(result.organization_count);
        } else {
          console.error('Failed to fetch organizations data');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSingleOrganizationClick = (id) => {
    navigate('/Organizationdetails', { state: { id } });
  };

  // Filter data based on searchQuery (by organization name, ID, and RM name)
  const filteredData = data.filter(item => 
    (item.organization_name && item.organization_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.id && item.id.toString().includes(searchQuery)) ||
    (item.r_m_name && item.r_m_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
      const pageNumbers = [];
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <span
            key={i}
            onClick={() => onPageChange(i)}
            style={{
              cursor: 'pointer',
              margin: '0 5px',
              padding: '5px 10px',
              backgroundColor: i === currentPage ? 'rgba(0, 137, 255, 0.1)' : '#0089FF',
              color: i === currentPage ? '#0089FF' : 'rgba(0, 137, 255, 0.1)',
              borderRadius: '25px',
            }}
          >
            {i}
          </span>
        );
      }
      return pageNumbers;
    };

    return (
      <div className="Organization-pagination" style={{ textAlign: 'center', marginBottom: '0%', color: '#697077', fontWeight: '500' }}>
        <span
          className="Organization-pagination-arrow"
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          style={{
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            marginRight: '10px', fontSize: '14px',
            color: '#697077',
          }}
        >
          <span className="Organization-prevoius-arrow" style={{ padding: '10px', fontSize: '14px' }}>&#8249;</span> Previous
        </span>
        <span style={{ fontSize: '12px' }} className="Organization-pagination-pages">
          {renderPageNumbers()}
        </span>
        <span
          className="Organization-pagination-arrow"
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          style={{
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            marginLeft: '10px', fontSize: '14px',
            color: '#697077',
          }}
        >
          Next <span className="Organization-next-arrow" style={{ padding: '10px', fontSize: '14px' }}>&#8250;</span>
        </span>
      </div>
    );
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-4 " style={{ marginRight: '30%' }}>
      <div className="card-container p-3 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 style={{ color: '#212121', fontSize: '18px', fontWeight: 'bold' }}>List of Organizations</h3>
            <p style={{ color: "#B5B5C3", fontSize: "13px" }}>{totalOrganizations} Organizations</p>
          </div>
          <div className="search-bar" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginRight: '10px', marginTop: '-2%', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius: '25px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className='list_org_search'
              style={{ padding: '5px 10px', color: 'black', fontWeight: '700px', borderRadius: '25px', paddingRight: '30px', height: '30px', border: 'none', width: '400px', fontSize: '12px', outline: 'none' }}
            />
            <img src={searchIcon} alt="Search" style={{ position: 'absolute', right: '10px', width: '10px' }} />
          </div>
        </div>
        <div className="organization-fulltable">
          <Table className="organization-table">
            <thead>
              <tr>
                <th style={{ color: '#B5B5C3', textAlign:'left',fontSize: "13px" }}>Name</th>
                <th style={{ color: '#B5B5C3', textAlign:'center', fontSize: "13px" }}>ID</th>
                <th style={{ color: '#B5B5C3', textAlign:'center',fontSize: "13px" }}>Email</th>
                <th style={{ color: '#B5B5C3', textAlign:'center',fontSize: "13px" }}>Phone number</th>
                <th style={{ color: '#B5B5C3', textAlign:'center',fontSize: "13px" }}>Date added</th>
                <th style={{ color: '#B5B5C3', textAlign:'center',fontSize: "13px" }}>RM Name</th>
                <th style={{ color: '#B5B5C3', textAlign:'center',fontSize: "13px" }}></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td style={{ color: '#464E5F', fontSize: "10px", fontWeight: 'bold' }}>
                    <div className="d-flex ">
                      <img src={item.profile || round} alt="avatar" className="avatar" />
                      <div className="ms-3">
                        <div style={{ color: '#464E5F', fontSize: "12px", fontWeight: '500' }}>{item.organization_name}</div>
                        <div style={{ color: '#B5B5C3', fontSize: "12px", fontWeight: '400' }}>{item.organization_type}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: '#464E5F',textAlign:'center', fontSize: "12px", fontWeight: '500' }}>{item.id}</td>
                  <td style={{ color: '#464E5F',textAlign:'center', fontSize: "12px", fontWeight: '500' }}>{item.email_id}</td>
                  <td style={{ color: '#464E5F', textAlign:'center',fontSize: "12px", fontWeight: '500' }}>{item.organization_mobile_no}</td>
                  <td style={{ color: '#464E5F', textAlign:'center',fontSize: "12px", fontWeight: '500' }}>{item.Date}</td>
                  <td style={{ color: '#464E5F', textAlign:'center',fontSize: "12px", fontWeight: '500' }}>{item.r_m_name}</td>
                  <td style={{ color: '#464E5F',textAlign:'center', fontSize: "12px", fontWeight: '500' }}>
                    <img src={iconImage} width={20} height={20} alt="icon" onClick={() => handleSingleOrganizationClick((item.id))} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default OrganizationTable;