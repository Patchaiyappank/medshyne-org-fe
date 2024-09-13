import React, { useState, useEffect } from 'react';
import deleted from '../images/deleted.png';
import './Dashboardtable.css';
import view from '../images/view.jpg';
import profile from '../images/profiletable.jpg';
import searchIcon from '../images/search.jpg';


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
            backgroundColor: i === currentPage ? 'rgba(0, 137, 255, 0.1)' : '',
            color: i === currentPage ? '#0089FF' : '',
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

const Table = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin_total_consultation", {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.result);
        console.log('Fetched Data:', result.result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/Is_delete_admin_appointment?consult_id=${id}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.Result === "Success") {
        setData(data.filter(row => row.consult_id !== id));
        console.log('Record deleted:', result);
      } else {
        console.error('Error deleting record:', result.message);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleView = (id) => {
    console.log(`View details for ID: ${id}`);
    // Add your view logic here
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter(row =>
    row.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.consult_id.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{marginRight:'20px',width:'84.5%' }} className="container-sm  ">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h4 style={{ marginTop: '6%', marginLeft: '2%', fontWeight: 'bold' }}>Total Consulting</h4>
        <div className="searchh-filter" style={{ display: 'flex', alignItems: 'center', marginRight: '2%' }}>
          <div className="searchh-bar" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginRight: '10px', marginTop: '10%' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search..."
              style={{ padding: '5px 10px', borderRadius: '25px', paddingRight: '30px', height: '30px', border: 'none', width: '400px', fontSize: '14px' }}
            />
            <img src={searchIcon} alt="Search" style={{ position: 'absolute', right: '10px', width: '10px' }} />
          </div>
         
        </div>
      </div>
      <div style={{ borderRadius: '30px', marginLeft: '2%', backgroundColor: 'white', marginTop: '-2%', width: '96%', fontSize: '10px' }} className="Dtable-containers">
        <table className="Consulting-table">
          <thead style={{ border: "1px solid rgb(235, 233, 233)", color: '#B5B5C3', height: '50px', borderColor: '#FAFAFA', backgroundColor: '#FAFAFA', marginLeft: '9%' }}>
            <tr>
              <th style={{ width: '15%', fontSize:'12px' }}>Organization Name</th>
              <th style={{ textAlign: 'center', fontSize:'12px' }}>Status</th>
              <th style={{ textAlign: 'center', fontSize:'12px' }}>Consulting ID</th>
              <th style={{ textAlign: 'center', fontSize:'12px' }}>Patient Name</th>
              <th style={{ textAlign: 'center', fontSize:'12px' }}>Sick Type</th>
              <th style={{ textAlign: 'center', fontSize:'12px' }}>Assignee</th>
              <th style={{ textAlign: 'center', fontSize:'12px' }}>Date & Time</th>
              <th  style={{ textAlign: 'center', fontSize:'12px' }}>View</th>
              <th style={{ borderTopRightRadius: '5px' ,textAlign:'center', fontSize:'12px'}}>Delete</th>
            </tr>
          </thead>
          <tbody style={{ color: '#464E5F', fontWeight: '700' }}>
            {currentItems.map((row) => (
              <tr key={row.consult_id}>
                <td>
                  <img style={{ width: '25%', marginRight: '5px' }} src={profile} alt="Profile" /> {row.organization_name}
                </td>
                <td style={{ ...getStatusColor(row.status) }}>{row.status}</td>
                <td style={{ textAlign: 'center' }}>{row.consult_id}</td>
                <td style={{ textAlign: 'center' }}>{row.patient_name}</td>
             
                <td style={{ textAlign: 'center' }}>{row.sick_type}</td>
                <td style={{ textAlign: 'center' }}>{row.assignee}</td>
                <td>
                  <div style={{ textAlign: 'center' }}>{row.date}</div>
                  <div style={{ color: '#B5B5C3', textAlign: 'center' }}>{row.from_time}</div>
                  {/* - {row.to_time} */}
                </td>
                <td>
                  <img src={view} width={30} height={30} alt="View" style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => handleView(row.consult_id)} />
                </td>
                <td>
                  <img src={deleted} width={30} height={30} alt="Delete" style={{ cursor: 'pointer' , textAlign: 'center'}} onClick={() => handleDelete(row.consult_id)} />
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
