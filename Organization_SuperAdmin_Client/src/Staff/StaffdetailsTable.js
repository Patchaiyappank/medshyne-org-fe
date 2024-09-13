import React, { useState } from 'react';
import deleted from '../images/deleted.png';
import view from '../images/view.jpg';
import profile from '../images/profiletable.jpg';

const getStatusColor = (status) => {
  switch (status) {
    case 'new':
      return {
        textAlign: 'center',
        backgroundColor: 'rgba(0, 137, 255, 0.1)',
        fontWeight: 'bold',
        color: '#0089FF',
        borderRadius: '27px',
        border: 'none',
      };
    case 'waiting':
      return {
        textAlign: 'center',
        backgroundColor: 'rgba(255, 235, 59, 0.1)',
        fontWeight: 'bold',
        color: '#FFEB3B',
        borderRadius: '27px',
        border: 'none',
      };
    case 'completed':
      return {
        textAlign: 'center',
        backgroundColor: 'rgba(115, 255, 66, 0.1)',
        fontWeight: 'bold',
        color: '#73FF42',
        borderRadius: '27px',
        border: 'none',
      };
    default:
      return {
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
      };
  }
};

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
    <div className="Support-pagination" style={{ textAlign: 'center', marginBottom: '5%', color: '#697077', fontWeight: '500' }}>
    <span
      className="Support-pagination-arrow"
      onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      style={{
        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        marginRight: '10px',fontSize:'12px',
        color: currentPage === 1 ? '#697077' : '#697077',
      }}
    >
      <span className="Support-prevoius-arrow" style={{ padding: '10px' }}>&#8249;</span> Previous
    </span>
    <span style={{fontSize:'12px'}} className="Support-pagination-pages">
      {renderPageNumbers()}
    </span>
    <span
      className="Support-pagination-arrow"
      onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      style={{
        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        marginLeft: '10px',fontSize:'12px',
        color: currentPage === 1 ? '#697077' : '#697077',
      }}
    >
      Next <span className="Support-next-arrow" style={{ padding: '10px' }}>&#8250;</span>
    </span>
  </div>

  );
};

const Table = ({ consultingData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleDelete = (id) => {
    console.log(`Delete record with ID: ${id}`);
  };

  const handleView = (id) => {
    console.log(`View details for ID: ${id}`);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = consultingData.filter((row) => {
    const patientName = row.patient_name ? row.patient_name.toLowerCase() : '';
    const consultId = row.consult_id ? row.consult_id.toString().toLowerCase() : '';
    
    return patientName.includes(searchQuery.toLowerCase()) || consultId.includes(searchQuery.toLowerCase());
  });
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container-ls">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h4 style={{ marginTop: '3%', marginLeft: '2%', fontWeight: 'bold', fontSize: '15px' }}>Consulting details</h4>
      </div>
      <div style={{ borderRadius: '30px', marginLeft: '2%', backgroundColor: 'white', marginTop: '-2%', width: '96%', fontSize: '10px' }} className="Dtable-containers">
        <table className="Consulting-table">
          <thead style={{ border: "1px solid rgb(235, 233, 233)", color: '#B5B5C3', marginTop: '20px', height: '40px', borderColor: '#FAFAFA', backgroundColor: '#FAFAFA', marginLeft: '4%' }}>
            <tr>
              <th style={{ width: '15%' }}>Patient Name</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Consulting ID</th>
              <th style={{ textAlign: 'center' }}>HCR</th>
              <th style={{ textAlign: 'center' }}>Sick Type</th>
              <th style={{ textAlign: 'center' }}>Assignee</th>
              <th style={{ textAlign: 'center' }}>Date & Time</th>
              <th>View</th>
              <th style={{ borderTopRightRadius: '5px' }}>Delete</th>
            </tr>
          </thead>
          <br></br>
          <tbody style={{ color: '#464E5F', fontWeight: '700', marginTop: '10px' }}>
            {currentItems.map((row) => (
              <tr key={row.consult_id} style={{ paddingBottom: '10px' }}>
                <td>
                  <img style={{ width: '25%', marginRight: '5px' }} src={profile} alt="Profile" /> {row.patient_name}
                </td>
                <td style={{ ...getStatusColor(row.status), height: '1px' }}>{row.status}</td>
                <td style={{ textAlign: 'center' }}>{row.consult_id}</td>
                <td style={{ textAlign: 'center' }}>{row.hcr_name}</td>
                <td style={{ textAlign: 'center' }}>{row.sick_type}</td>
                <td style={{ textAlign: 'center' }}>{row.assignee}</td>
                <td>
                  <div style={{ textAlign: 'center' }}>{row.date}</div>
                  <div style={{ color: '#B5B5C3', textAlign: 'center' }}>{row.from_time}</div>
                </td>
                <td>
                  <img src={view} width={30} height={30} alt="View" style={{ cursor: 'pointer' }} onClick={() => handleView(row.consult_id)} />
                </td>
                <td>
                  <img src={deleted} width={30} height={30} alt="Delete" style={{ cursor: 'pointer' }} onClick={() => handleDelete(row.consult_id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <br />
    </div>
  );
};

export default Table;
