import React, { useState, useCallback, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SettingsBlog.css'; // Ensure this file contains updated class names
import galImg from '../images/Rectangle 23877.png';
import editimglpg from '../images/Edit12.png';

const ITEMS_PER_PAGE = 10;

const SettingsLandingpage = () => {
  const [settingsLandingpage, setSettingsLandingpage] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(galImg);
  const [fileSelected, setFileSelected] = useState(false); // Track file selection state

  useEffect(() => {
    const fetchSettingsLandingpage = async () => {
      try {
        const response = await axios.get('http://localhost:5000/superAdmin_deleted-org_list');
        console.log('Response data:', response.data); // Log the data received from the API
        setSettingsLandingpage(response.data);
      } catch (error) {
        console.error('Error fetching organization details:', error);
      }
    };
  
    fetchSettingsLandingpage();
  }, []);
  
  const handleClick = () => {
    document.getElementById('profile-input').click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target.result;
        setSelectedImage(imageUrl);
        localStorage.setItem('profileImage', imageUrl); // Store the image in local storage
        setFileSelected(true); // Update state to indicate file is selected

        try {
          const response = await fetch(``, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              profile: imageUrl,
            }),
          });
          const data12 = await response.json();
          console.log(data12);
          alert('Image Uploaded');
        } catch (err) {
          console.log(err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const totalPages = Math.ceil(settingsLandingpage.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagination_settingsLandingpage = settingsLandingpage.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";
    const totalPages = Math.ceil(settingsLandingpage.length / ITEMS_PER_PAGE);
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

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card className="settingslandingpage-main-card">
            <Card.Body>
              <Row className="mb-3 ms-1">
                <Col>
                  <h5 className="mb-0 settingslandingpage-heading" style={{ fontSize: '16px', fontFamily: 'Poppins' }}>Blog</h5>
                  <p className="mb-2 mt-1" style={{ fontSize: '12px', color: '#B5B5C3', fontWeight: '500' }}>{settingsLandingpage.length} blog</p>
                </Col>
                <Col className="d-flex justify-content-end me-4">
                  <Button className='add-carousel'>Add Blog</Button>
                </Col>
                <h6 style={{ fontFamily: 'inter', fontSize: '20px', fontWeight: '600' }}>Blog No 1</h6>
              </Row>

              <Card className="settingslandingpage-sub2-card">
                <Card.Body>
              <Row className='mt-2'>
                    <Col md={5}>
                  <div className="edit-profile-button mb-0 mt-2">
                    <input id="profile-input" type="file" style={{ display: 'none' }} onChange={handleImageChange} />
                  </div>
                  <div className="ms-1 mb-2 col-auto position-relative">
                    <div className="mt-0 ms-0 profilepictures">
                      {selectedImage ? (
                        <img src={selectedImage} width={400} height={300} alt="profileimage" style={{ borderRadius: '20px', marginLeft: '.5%' }} />
                      ) : (
                        <img src={galImg} width={400} height={300} alt="default profile" style={{ borderRadius: '20px' }} />
                      )}
                    </div>
                    </div>
              
                      </Col>
                
                 
                    <Col md={7}>
                    <Col className='mt-4 ms-3 me-3 '>
                      <Form.Group >
                        <h6 style={{fontFamily:'Roboto'}}>Title*</h6>
                         <Form.Control type="text" placeholder="Placeholder" />
                       </Form.Group>
                       </Col>
                       <Row>
                      <Col md={6}>
                       <Button className=" mt-5 ms-3 me-3 overlay-button2" onClick={handleClick}>Choose File</Button>
                       <input
                         id="profile-input"
                         type="file"
                         style={{ display: 'none' }}
                         onChange={handleImageChange}
                       />
                       </Col>
                       <Col md={6} >
                       <Form.Group className=' mt-4 ms-3 me-3'>
                       
                        <h6 style={{fontFamily:'Roboto'}}>Key Words 1</h6>
                        <Form.Control type="text" placeholder="Placeholder" />
                      </Form.Group>
                      
                     </Col>
                    </Row>
                       <Row>
                       <Col md={6}>
                       <Form.Group className=' mt-4 ms-3 me-3'>
                        
                         <h6 style={{fontFamily:'Roboto'}}>Key Words 2</h6>
                         <Form.Control type="text" placeholder="Placeholder" />
                       </Form.Group>
                       </Col>
                        <Col md={6}>
                       <Form.Group className=' mt-4 ms-3 me-3'>
                       
                         <h6 style={{fontFamily:'Roboto'}}>Key Words 3</h6>
                   <Form.Control type="text" placeholder="Placeholder" />
                       </Form.Group>
                      
 </Col>
                       </Row>
       
                       </Col>
                       </Row>
                   <Col md={12}>
                   <Form.Group className="mt-3 mb-4 ms-2 me-2" >
              
                   <h6 style={{fontFamily:'Roboto'}}>Blog Description*</h6>
                     <Form.Control as="textarea" rows={7} placeholder="Description" />
                   </Form.Group>
                   </Col>
                </Card.Body>
              </Card>
              <Row>
                   
                    <Col md={12} className="d-flex justify-content-center align-items-center mb-1">
                      <Button className="setlapgbtn1 me-2" style={{ fontFamily: 'Poppins' }}>
                        <img src={editimglpg} className='editimglpg1' alt="edit-icon" /> Edit Details
                      </Button>
                      <Button className="setlapgbtn2 me-2" style={{ backgroundColor: '#E51837', fontFamily: 'Poppins' }}>Delete</Button>
                      <Button className="setlapgbtn3 me-2" style={{ fontFamily: 'Poppins' }}>Save</Button>
                    </Col>
                  </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pagination Section */}
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

export default SettingsLandingpage;




