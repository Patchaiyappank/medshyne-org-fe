import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '@fontsource/inter';
import close from '../images/close.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import './OnboardUnpaid.css';
import actionIcon from '../assest/actionbutton.png';
import { useNavigate } from 'react-router-dom';
import image from './defimg.png';

const ITEMS_PER_PAGE = 10;

const App = () => {
  const navigate = useNavigate();
  const [onboardunpaiding, setonboardunpaiding] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  // Function to handle opening the modal
  const handleShowModal = () => setShowModal(true);

  // Function to handle closing the modal
  const handleCloseModal = () => setShowModal(false);

  const handleSendNotification = async () => {
    try {
      const payload = {
        message, // The notification message to be sent
      };
  
      // Sending the message to the backend
      const response = await fetch('http://localhost:5000/sendInactiveSubscriptionEmails', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        alert(`Failed to send notification: ${responseData.message}`);
      } else {
        alert('Notification sent successfully!');
        handleCloseModal(); // Close modal after successful notification
        setMessage();
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error sending notification. Please try again later.');
    }
  };
  

  useEffect(() => {
    fetchonboardunpaiding(); // Fetch data on component mount
  }, []);


    const fetchonboardunpaiding = async () => {
      try {
        const response = await fetch(`http://localhost:5000/superAdmin_payments_unPaid`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch data');
        }
        const data = await response.json();
        setonboardunpaiding(data.unpaid_details);
      } catch (error) {
        console.error('Error fetching onboardunpaiding_Organization:', error.message || error);
        // Display an alert or set an error state to inform the user
        // e.g., setErrorState(true);
      }
    };
    

  const totalPages = Math.ceil(onboardunpaiding.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagination_onboardunpaiding = onboardunpaiding.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";
    const totalPages = Math.ceil(onboardunpaiding.length / ITEMS_PER_PAGE);
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



  const handleSingleOrganizationClick = (onboardunpaid_id) => {
    console.log('onboardunpaiding ID being passed:', onboardunpaid_id); // Log the ID to console
    navigate('/Organizationdetails', {
      state: { id: onboardunpaid_id },
    });
  };

  return (
    <div className="container">
     
      <div style={{borderRadius: '20px' }} className="shadow-sm onboardunpaid-table-container">
        <div className="onboardunpaid-header-row">
          <div>
            <h5 style={{ color: '#212121', fontSize: '18px', fontWeight: 'bold' }} className=" mt-3">Unpaid Organization</h5>
            <h6 style={{ fontSize: '13px', color: '#B5B5C3' }} >
              {onboardunpaiding.length} Organization
            </h6>
          </div>
          <button className="add-onboardunpaid-button mt-1" onClick={handleShowModal} >
            Send Notification
          </button>
        </div>

        <div className="mt-3 onboardunpaid-table-container-innercell">
          <Table bordered={false} className="table-borderless onboardunpaid-table-border" >
            <thead style={{ borderRadius: '20px'}}>
              <tr className='onboardunpaidingList-tableRow vertical-middle'>
                <th className='text-left ps-4'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Name</th>
                <th className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold' }}>ID</th>
                <th  className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'bold' }}>Last Purchase</th>
                <th className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'bold' }}>Phone number</th>
                <th className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'bold' }}>Expired Date</th>
                <th className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'bold', whiteSpace:'nowrap' }}>Payment Status</th>
                <th className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'bold' }}></th>
              </tr>
            </thead>
            <tbody>
              {pagination_onboardunpaiding.map((onboardunpaiding, index) => (
                <tr key={index} className='onboardunpaid-table-border'>
                  <td className="align-middle">
                    <div className="d-flex">
                      <img
                        src={onboardunpaiding.profile ? onboardunpaiding.profile : image}
                        
                        alt="organization"
                        className="rounded-circle me-2 onboardunapid-profile"
                      />
                      <div>
                        <div className='onboardunpaiding-table-details'>{onboardunpaiding.organization_name}</div>
                        <div className="onboardunpaid-text-muted">{onboardunpaiding.organization_type}</div>
                      </div>
                    </div>
                  </td>
                  <td className='text-center onboardunpaiding-table-details' >{onboardunpaiding.id}</td>
                  <td className='text-center onboardunpaiding-table-details' >{onboardunpaiding.plan_name}</td>
                  <td className='text-center onboardunpaiding-table-details'>{onboardunpaiding.organization_mobile_no}</td>
                  <td >
                    <div className='text-center onboardunpaiding-table-details'>{onboardunpaiding.expiry_date}</div>
                  </td>
                  <td className='text-center onboardunpaiding-status'>
  <span className="unpaid-pending-status">
        {onboardunpaiding.payment_status}
      </span></td>
                  <td className="">
                    <button className="onboardunpaid-action-button " onClick={() => handleSingleOrganizationClick(onboardunpaiding.id)}>
                      <img src={actionIcon} alt="Action" className="onboardunpaid-action-icon" />
                    </button>
                  </td>
                  <td></td>
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



      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header className='popup-main-container mt-2'>
          <Modal.Title className='popup-send-notify'>Send Notification</Modal.Title>
          <div className='popup-container'>
          <img 
    src={close}
    alt="Close" className='popup-close'
    style={{ cursor: 'pointer' }} 
    onClick={handleCloseModal} // handleClose is the function to close the modal
  />
          </div>
          
        </Modal.Header>
        <Modal.Body >
          <Form>
            <Form.Group controlId="message">
              <Form.Label className='popup-message-block'>Message</Form.Label>
              <Form.Control
              className='popup-message'
                as="textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className='popup-footer'>
          <Button variant="primary" className="mt-1 w-100" onClick={handleSendNotification}>
            Send Notification
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

    
  );
};

export default App;


// onboard-table-border