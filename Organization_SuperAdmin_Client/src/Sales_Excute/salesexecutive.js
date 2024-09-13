import React, { useState, useEffect } from 'react';
import '@fontsource/inter';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import './salesexecutive.css';
import actionIcon from '../assest/actionbutton.png';
import { useParams } from "react-router-dom";
import { useNavigate,useLocation } from 'react-router-dom';
import img from '../images/defimg.png';
const ITEMS_PER_PAGE = 10;

const App = () => {
  const {id} = useParams();
  //const r_m_id = 1; 
 
  const navigate = useNavigate();
  const [salesexecutive, setsalesexecutive] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
 // const {r_m_id } = location.state || {};
  const state = location.state || {};
  const {id_number} = location.state || {};

  // useEffect(() => {
  //   fetchsalesexecutive();
  // }, []);

  const [formData, setFormData] = useState({
  //  id_number: 'formData.id_number',
   
});
  const fetchsalesexecutive = async () => {
    try {
      const response = await fetch(`http://localhost:5000/superAdmin_total_sales_executives_by_r_m_id/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      // Assuming API directly returns array
      setsalesexecutive(data);
      setFormData({
        ...formData,
        id_number: data.sal_exe_id || '',
       
    });
    } catch (error) {
      console.error('Error fetching sales executive:', error);
    }
  };
  useEffect(() => {
    fetchsalesexecutive();
  }, [id]);

  const newExecutive = () => {
    navigate(`/Stock/${id}`);
  };

  const handleSingleRegionalmanagerClick = (id_number) => {
    navigate(`/salesexecutive/${id_number}`);
  };
  // const handleSinglesalesExecutiveClick = () => {
  //   navigate('/salesexecutive');
  // };
  // const handleSinglesalesExecutiveClick = (id_number) => {
  //   navigate('/salesexecutive', {
  //     state: {
  //       id_number: formData.id_number
  //     }
  //   });
  //   console.log(`with ID ${id_number}`);
   
  // };

  const totalPages = Math.ceil(salesexecutive.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagination_salesexecutive = salesexecutive.slice(startIndex, endIndex);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";
    const totalPages = Math.ceil(salesexecutive.length / ITEMS_PER_PAGE);
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <span
          key={1}
          className={`salesexecutivepagination-page ${
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
          className={`salesexecutivepagination-page ${
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
        pageNumbers.push(<span key="ellipsisEnd" className="salesexecutive-ellipsis">{ellipsis}</span>);
      }
      pageNumbers.push(
        <span
          key={totalPages}
          className={`salesexecutivepagination-page ${
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  return (
    <div className="salesexecutive-container">
      <header className="d-flex justify-content-between align-items-center">
        <h3 style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold', marginLeft: '2%', marginTop: '4.5%' }}>
          Sales Executive list
        </h3>
        <button className="addsales-button mb-1" onClick={newExecutive}>
          Add Sales Executive
        </button>
      </header>

      <hr style={{ color: 'rgba(0, 0, 0, 0.2)', marginTop: '2.5%' }}></hr>

      <div style={{ padding: '20px', borderRadius: '20px' }} className="shadow-sm p-2 mb-2 salesexecutive-maincard">
        <div className="header-row"></div>

        <div className="salesexecutivelist-table-responsive mt-3">
          <Table bordered={false} className="table-borderless">
            <thead>
              <tr className="salesexecutive-table-container">
                <th className="ms-5" style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA', fontWeight: '400' }}>Name</th>
                <th style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA', fontWeight: '400' }}>ID</th>
                <th style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA', fontWeight: '400'}}>Email</th>
                <th style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA', fontWeight: '400' }}>Phone Number</th>
                <th style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA', fontWeight: '400' }}>Date Added</th>
                <th style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA', fontWeight: '400' }}>Gender</th>
                <th style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA', fontWeight: '400' }}></th>
                <th style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA', fontWeight: '400' }}></th>
              </tr>
            </thead>
            <tbody className='salesexecutive-body-container'>
              {pagination_salesexecutive.map((manager, index) => (
                <tr key={index}>
                    <td>
                     <img src={manager.profile?manager.profile:img} 
                     className='salesexecutive-profile'/>
                     <span style={{ color: '#464E5F', fontSize: '12px', fontWeight: '500' }} className='salesexecutive-name'>{manager.sal_exe_name}</span>
                  </td>
                  <td style={{ color: '#464E5F', fontSize: '12px', fontWeight: '500',lineHeight:'32px'  }}>{manager.sal_exe_id}</td>
                  <td style={{ color: '#464E5F', fontSize: '12px', fontWeight: '500',lineHeight:'32px'  }}>{manager.e_mail}</td>
                  <td style={{ color: '#464E5F', fontSize: '12px', fontWeight: '500',lineHeight:'32px'  }}>{manager.phone_number}</td>
                  <td style={{ color: '#464E5F', fontSize: '12px', fontWeight: '500',lineHeight:'32px'  }}>{manager.Date}</td>
                  <td style={{ color: '#464E5F', fontSize: '12px', fontWeight: '500',lineHeight:'32px'  }}>{manager.gender}</td>
                  <td className="text-center align-middle">
                    <button className="action-button ms-4" onClick={() => handleSingleRegionalmanagerClick(manager.sal_exe_id)}>
                      <img src={actionIcon} alt="Action" className="action-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="salesexecutive-pagination">
        <span className="salesexecutive-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
          <span className="salesexecutive-prevoius-arrow">&#8249;</span> Previous
        </span>
        <span className="salesexecutive-pagination-pages">{renderPageNumbers()}</span>
        <span className="salesexecutive-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
          Next <span className="salesexecutive-next-arrow">&#8250;</span>
        </span>
      </div>
    </div>
  );
};

export default App;
