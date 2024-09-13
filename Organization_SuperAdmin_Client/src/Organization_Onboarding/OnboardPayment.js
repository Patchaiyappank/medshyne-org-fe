import React, { useState, useEffect } from 'react';
import '@fontsource/inter';
import { FaCheck } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import './OnboardPayment.css';
import { useNavigate } from 'react-router-dom';
import image from './defimg.png';
import GenericPdfDownloader from './GenericPdfDownloader';

const ITEMS_PER_PAGE = 10;

const App = () => {
  const navigate = useNavigate();
  const [onboardpaymenting, setonboardpaymenting] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchonboardpaymenting(); // Fetch data on component mount
  }, []);

 
    const fetchonboardpaymenting = async () => {
      try {
        const response = await fetch(`http://localhost:5000/superAdmin_payments_paid`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch data');
        }
        const data = await response.json();
        setonboardpaymenting(data.paid_details);
      } catch (error) {
        console.error('Error fetching onboardpaymenting_Organization:', error.message || error);
        // Display an alert or set an error state to inform the user
        // e.g., setErrorState(true);
      }
    };
    

  const totalPages = Math.ceil(onboardpaymenting.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagination_onboardpaymenting = onboardpaymenting.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";
    const totalPages = Math.ceil(onboardpaymenting.length / ITEMS_PER_PAGE);
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <span
          key={1}
          className={`onboardListpagination-page ${
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
          className={`onboardListpagination-page ${
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
        pageNumbers.push(<span key="ellipsisEnd" className="onboardList-ellipsis">{ellipsis}</span>);
      }
      pageNumbers.push(
        <span
          key={totalPages}
          className={`onboardListpagination-page ${
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



  return (
    <div className="container">
     
      <div style={{borderRadius: '20px' }} className=" onboardpayment-table-container">
      

        <div className="mt-3 onboardpayment-table-container-innercell">
          <Table bordered={false} className="table-borderless onboardpayment-table-border" >
            <thead style={{ borderRadius: '20px'}}>
              <tr className='onboardpaymentingList-tableRow'>
                <th className='text-left ps-4'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Invoice Number</th>
                <th className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold' }}>Date</th>
                <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'bold' }}>Status</th>
                <th className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'bold' }}>Customer</th>
                <th className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'bold' }}>Purchase</th>
                <th className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'bold' }}>Invoice</th>

              </tr>
            </thead>
            <tbody >
              {pagination_onboardpaymenting.map((onboardpaymenting, index) => (
                <tr key={index} className='onboard-table-border'>
                 
                  <td className='text-center onboardpaymenting-table-details' >{onboardpaymenting.invoice_number}</td>
                  <td className='text-center onboardpaymenting-table-details' >{onboardpaymenting.transaction_date}</td>
                  <td className='text-center onboardpaymenting-table-details'>
                  <span className="onboardpayment-paid-status">
                  <FaCheck /> {onboardpaymenting.payment_status}
      </span></td>
                  <td className="align-middle">
                    <div className="d-flex ">
                      <img
                        src={onboardpaymenting.profile ? onboardpaymenting.profile : image}
                        
                        alt="organization"
                        className="rounded-circle me-2 onboardpayment-profile"
                      />
                      <div>
                        <div className='onboardpaymenting-table-details'>{onboardpaymenting.organization_name}</div>
                        <div className="onboardpayment-text-muted">{onboardpaymenting.organization_type}</div>
                      </div>
                    </div>
                  </td>
                  <td >
                    <div className='text-center onboardpaymenting-table-details'>{onboardpaymenting.plan_name}</div>
                  </td>
                  <td style={{ color: '#464E5F', textAlign:"center",fontSize: '14px', fontWeight: 'bold' }} >
                  <GenericPdfDownloader
                  rootElementId="pdfContent"
     
                  downloadFileName="Invoice"
               
                  invoiceDetails={onboardpaymenting.id}
                />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="onboardList-pagination">
        <span className="onboardList-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
          <span className="onboardList-prevoius-arrow">&#8249;</span> Previous
        </span>
        <span className="onboardList-pagination-pages">{renderPageNumbers()}</span>
        <span className="onboardList-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
          Next <span className="onboardList-next-arrow">&#8250;</span>
        </span>
      </div>
    </div>
  );
};

export default App;
