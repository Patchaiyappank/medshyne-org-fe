import React, { useState, useEffect } from 'react';
import '@fontsource/inter';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import './regionalmanagerlist.css';
import addicon from '../assest/Add-user.png';
import actionIcon from '../assest/actionbutton.png';
import searchicon from '../assest/search icon.png';
import { useNavigate } from 'react-router-dom';
import defimage from './defimg.png';

const ITEMS_PER_PAGE = 10;

const App = () => {
  const navigate = useNavigate();
  const [regionalmanager, setregionalmanager] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchregionalmanager();
  }, []);

  const fetchregionalmanager = async () => {
    try {
      const response = await fetch('http://localhost:5000/superAdmin_list_of_regionalManager');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch data: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      setregionalmanager(data.regionalManagers);
     
    } catch (error) {
      console.error('Error fetching regional managers:', error);
    }
  };


  const newRegional = () => {
    navigate('/addregionalmanager');
  };

  const handleSingleRegionalmanagerClick = (id) => {
    navigate(`/regional-manager/${id}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  const filteredManagers = regionalmanager
  .filter((manager) => {
    const phoneNumber = manager.phone_number ? String(manager.phone_number) : '';
    const stateArea = manager.state_area ? manager.state_area.toLowerCase() : '';
    return (
      manager.r_m_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stateArea.includes(searchTerm.toLowerCase())  // Adding state_area to the search filter
    );
  })
  .sort((a, b) => b.ID - a.ID);  // Sort by ID in descending order


  // .filter((manager) => {
  //   const phoneNumber = manager.phone_number ? String(manager.phone_number) : '';
  //   return (
  //     manager.r_m_name.toLowerCase().includes(searchTerm.toLowerCase()) 
  //   );
  // })
  // .sort((a, b) => b.ID - a.ID); 

const totalPages = Math.ceil(filteredManagers.length / ITEMS_PER_PAGE);
const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const endIndex = startIndex + ITEMS_PER_PAGE;
const regionalManagerPage = filteredManagers.slice(startIndex, endIndex);


  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <span
          key={1}
          className={`regionalmanagerpagination-page ${
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
          className={`regionalmanagerpagination-page ${
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
        pageNumbers.push(<span key="ellipsisEnd" className="regionalmanager-ellipsis">{ellipsis}</span>);
      }
      pageNumbers.push(
        <span
          key={totalPages}
          className={`regionalmanagerpagination-page ${
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

  const formatPhoneNumber = (phoneNumber) => {
    // Assume the first two digits are the country code
    const countryCode = phoneNumber.slice(0, 2);
    const localNumber = phoneNumber.slice(2);
    
    // Format the local number in the desired pattern (e.g., "62855-18545")
    const formattedLocalNumber = `${localNumber.slice(0, 5)}-${localNumber.slice(5)}`;
    
    return `(${countryCode}) ${formattedLocalNumber}`;
  };
  
  return (
    <div className="regional-container">
      <header className="my-2">
        <h3 style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold', marginLeft:'2%',marginTop:'4.5%' }}>Regional manager</h3>
        <hr style={{color:' rgba(0, 0, 0, 0.2)', marginTop: '2.5%'}}></hr>
      </header>
      <br />
      <div style={{ padding: '20px', borderRadius: '20px'}} className="shadow-sm p-2 mb-5 regionalmanagerlist-maincard">
        <div className="header-row">
          <div>
            <h5 style={{ color: '#212121', fontSize: '18px', fontWeight:'520',fontFamily: 'Poppins' }} className=" mt-3">List of Regional manager </h5>
            <h6 style={{ fontSize: '13px', color: '#B5B5C3',fontFamily: 'Poppins' }}>{filteredManagers.length} available Regional manager</h6>
          </div>
          <div className='d-flex justify-content-between align-items-center regionalmanger-searchblock'>
            <input
              className="search-button mt-1"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img src={searchicon} className="search-icon" alt="Search" />
          </div>

          <button className="add-btn mt-1" onClick={newRegional}>
            <img src={addicon} alt="Add" className="button-icon" />
            Add Regional manager
          </button>
        </div>

        <div className="regionalmanagerlist-table-responsive mt-3">
          <Table bordered={false} className="regional-table-borderless">
            <thead>
              <tr style={{fontSize: '13px'}}>
                <th className='ms-5' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'400'}}>Name</th>
                <th  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'400' }}>ID</th>
                <th  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'400' }}>Email</th>
                <th  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'400' }}>Phone number</th>
                <th  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'400' }}>Date added</th>
                <th  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'400', marginLeft: '50px' }}>City/Area</th>
                <th  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'400' }}></th>
              </tr>
            </thead>
            <tbody className='regionalmanager-body-container'>
            {regionalManagerPage.map((manager) => (
    <tr key={manager.ID} className='regionalmanager-tablerow'>
      <td>
        <img 
          src={manager.profile?manager.profile:defimage} 
         className='regionalmanagerlist-profile'/>
        <span style={{ color: '#464E5F', fontSize: '12px', fontWeight: '500',lineHeight: '32px'}} className='regionalmanagerlist-name'>{manager.r_m_name}</span>
      </td>
      <td style={{ color: '#464E5F', fontSize: '12px', fontWeight: '500',lineHeight: '32px' }}>{manager.ID}</td>
      <td style={{ color: '#464E5F', fontSize: '12px', fontWeight: '500',lineHeight: '32px' }}>{manager.e_mail}</td>
      <td style={{ color: '#464E5F', fontSize: '12px', fontWeight: '500',lineHeight: '32px' }}>{formatPhoneNumber(manager.phone_number)}</td>
      <td style={{ color: '#464E5F', fontSize: '12px', fontWeight: '500',lineHeight: '32px' }}>{manager.Date ? new Date(manager.Date).toLocaleDateString() : 'N/A'}</td>
      <td style={{ color: '#464E5F', fontSize: '12px', fontWeight: '500',lineHeight: '32px' }}>{manager.state_area}</td>
      <td className="text-center align-middle">
        <button className="action-button ms-4" onClick={() => handleSingleRegionalmanagerClick(manager.ID)}>
          <img src={actionIcon} alt="Action" className="action-icon" />
        </button>
      </td>
    </tr>
  ))}

            </tbody>
          </Table>
        </div>
      </div>

      <div className="regionalmanager-pagination">
        <span className="regionalmanager-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
          <span className="regionalmanager-prevoius-arrow">&#8249;</span> Previous
        </span>
        <span className="regionalmanager-pagination-pages">{renderPageNumbers()}</span>
        <span className="regionalmanager-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
          Next <span className="regionalmanager-next-arrow">&#8250;</span>
        </span>
      </div>
    </div>
  );
};

export default App;
