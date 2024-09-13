import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import './SettingsLandingpage.css';
import galImg from '../images/Rectangle 23877.png';  // Default placeholder image
import editimglpg from '../images/Edit12.png';

const SettingsLandingpage = () => {
  const [carousels, setCarousels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(galImg);
  const [inputUrl, setInputUrl] = useState('');
  const [showControls, setShowControls] = useState(false); // New state to control the visibility of buttons
  const [isAddingNewCarousel, setIsAddingNewCarousel] = useState(false);
  // Fetch carousel data from the backend API
  useEffect(() => {

    fetchCarousel();
  }, []);

  const fetchCarousel = async () => {
    try {
      const response = await axios.get('http://localhost:5000/carousel'); // Assuming this is your backend endpoint
      const data = response.data;

      setCarousels(data.map(item => ({
        id: item.id,
        imageUrl: item.carousel || galImg,  // Use default image if carousel is null
        url: item.url || ''                 // Use empty string if URL is null
      }))); 
      setShowControls(false); // Initially hide the controls after fetching carousels
    } catch (error) {
      console.error('Error fetching carousel data:', error);
    }
  };

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setSelectedImage(imageUrl);
        setCarousels((prevCarousels) => {
          const updatedCarousels = [...prevCarousels];
          updatedCarousels[currentPage - 1].imageUrl = imageUrl;
          return updatedCarousels;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  


// Handle save or edit based on whether the carouselId is present or not
const handleSaveOrEdit = async () => {
  try {
    // If adding a new carousel (isAddingNewCarousel is true), use POST to upload
    if (isAddingNewCarousel) {
      const response = await axios.post('http://localhost:5000/uploadCarousel', {
        base64Image: selectedImage,
        url: inputUrl
      });

      if (response.status === 200) {
        alert('Image inserted successfully.');
        setCarousels((prevCarousels) => [
          ...prevCarousels,
          { id: response.data.id, imageUrl: selectedImage, url: inputUrl }
        ]);
        setIsAddingNewCarousel(false); // Reset the flag after adding the carousel
        fetchCarousel(); // Refresh the carousel list
      } else {
        alert('Error uploading the image.');
      }
    } 
    // If editing an existing carousel (isAddingNewCarousel is false), use PUT
    else {
      const carouselId = carousels[currentPage - 1]?.id;

      if (carouselId) {
        const response = await axios.put(`http://localhost:5000/editCarousel/${carouselId}`, {
          base64Image: selectedImage,
          url: inputUrl
        });

        if (response.status === 200) {
          alert('Carousel updated successfully!');
          setCarousels((prevCarousels) => {
            return prevCarousels.map((carousel) =>
              carousel.id === carouselId ? { ...carousel, url: inputUrl } : carousel
            );
          });
          fetchCarousel(); // Refresh the carousel list
        } else {
          alert('Error updating the carousel.');
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
    alert('There was an error processing the request.');
  }
};

// Handle adding a new carousel
const handleAddCarousel = () => {
  setCarousels((prevCarousels) => [
    ...prevCarousels,
    { id: prevCarousels.length + 1, imageUrl: galImg, url: '' }
  ]);
  setCurrentPage(carousels.length + 1);
  setShowControls(true); // Show controls when adding a new carousel
  setIsAddingNewCarousel(true); // Set flag to true to trigger the POST in handleSaveOrEdit
};


  // Handle delete carousel
  const handleDeleteCarousel = async () => {
    if (carousels.length > 1) {
      const carouselId = carousels[currentPage - 1].id;  // Get the carousel ID

      try {
        const response = await axios.delete(`http://localhost:5000/deleteCarousel/${carouselId}`);

        if (response.status === 200) {
          alert('Carousel deleted successfully.');
          const updatedCarousels = carousels.filter((_, index) => index !== currentPage - 1);
          setCarousels(updatedCarousels);
          setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        }
      } catch (error) {
        console.error('Error deleting carousel:', error);
        alert('There was an error deleting the carousel.');
      }
    } else {
      alert("You can't delete the last carousel");
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= carousels.length) {
      setCurrentPage(newPage);
      setInputUrl(carousels[newPage - 1].url);
    }
  };

  // Render carousel
  const renderCarousel = () => {
    if (carousels.length === 0 || !carousels[currentPage - 1]) {
      return <div>No carousels available</div>;
    }

    const currentCarousel = carousels[currentPage - 1];

    return (
      <Card className="settingslandingpage-sub2-card">
        <Card.Body>
          <div className="ms-1 mb-2 col-auto position-relative">
            <div className="mt-0 ms-0 profilepictures">

              {currentCarousel.imageUrl ? (
                <img
                  src={currentCarousel.imageUrl}
                  width={1030}
                  height={400}
                  alt="carousel"
                  style={{ borderRadius: '20px', marginLeft: '.5%' }}
                />
              ) : (
                <img
                  src={galImg}
                  width={1030}
                  height={400}
                  alt="default"
                  style={{ borderRadius: '20px' }}
                />
              )}
            </div>

            {/* Conditionally render the "Choose File" button only if controls are shown */}
            {showControls && (
              <Button className="overlay-button" onClick={() => document.getElementById('profile-input').click()}>
                Choose File
              </Button>
            )}
          </div>

          <input
            id="profile-input"
            type="file"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />

          <Row>
            <Col md={7} className="mt-2 mb-1">
              <Form.Group>
                <h6 style={{ fontSize: '14px', fontFamily: 'roboto' }}>Enter URL</h6>
                <Form.Control 
                  type="text" 
                  placeholder="Placeholder" 
                  style={{ borderRadius: '10px' }} 
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={5} className="d-flex justify-content-end align-items-end mb-1">
              <Button className="setlapgbtn1 me-2" onClick={() => setShowControls(true)}>
                <img src={editimglpg} className="editimglpg1" alt="Edit" />
                Edit Details
              </Button>
              <Button className="setlapgbtn2 me-2" style={{ backgroundColor: '#E51837' }} onClick={handleDeleteCarousel}>
                Delete
              </Button>
              {showControls && (
                <Button className="setlapgbtn3 me-2" onClick={handleSaveOrEdit}>
                  Save
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  // Render pagination
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= carousels.length; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`organizationListpagination-page ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
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
              <Row className="mb-3">
                <Col>
                  <h5 className="mb-0 settingslandingpage-heading ms-3">Carousel</h5>
                  <p className="mb-2 ms-3 mt-2" style={{ fontSize: '13px', color: '#B5B5C3', fontWeight: '500' }}>
                    {carousels.length} Carousels
                  </p>
                </Col>
                <Col className="d-flex justify-content-end ">
                  <Button className="add-carousel" onClick={handleAddCarousel}>
                    Add Carousel
                  </Button>
                </Col>
              </Row>
              <h6 className='ms-3'>Carousel No {currentPage}</h6>
<br></br>
              {/* Render current carousel */}
              {renderCarousel()}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pagination */}
      <div className="organizationList-pagination">
        <span
          className="organizationList-pagination-arrow"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <span className="organizationList-prevoius-arrow">&#8249;</span> Previous
        </span>
        <span className="organizationList-pagination-pages">{renderPageNumbers()}</span>
        <span
          className="organizationList-pagination-arrow"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next <span className="organizationList-next-arrow">&#8250;</span>
        </span>
      </div>

    </Container>
  );
};

export default SettingsLandingpage;