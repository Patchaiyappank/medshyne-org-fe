import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Table from './Dashboardtable.js';
import DashboardCalender from './DashboardCalender.js';
import DashboardBarchart from './DashboardBarchart.js';
import './Dashboard.css';

const App = () => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState([
    { name: 'Pending Revenue', text: 0 },
    { name: 'Total Revenue', text: 0 },
    { name: 'Total Organization', text: 0 },
    { name: 'Total Consultation', text: 0 },
    { name: 'Tickets Open', text: 0 },
    { name: 'Tickets Closed', text: 0 }
  ]);
  const [dateRange, setDateRange] = useState([null, null]);
 // Fetch data based on the selected date range
  useEffect(() => {
    const [startDate, endDate] = dateRange;

    // Convert dates to the required format for the API
    const fromDate = startDate ? startDate.toISOString().split('T')[0] : '';
    const toDate = endDate ? endDate.toISOString().split('T')[0] : '';

    // Fetch data from API based on the date range
    fetch(`http://localhost:5000/superAdmin_dashboard_data_filter?from_date=${fromDate}&to_date=${toDate}`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          setCardData([
            { name: 'Pending Revenue', text: data.pendingRevenue || 0 },
            { name: 'Total Revenue', text: data.totalRevenue || 0 },
            { name: 'Total Organization', text: data.totalOrganizationCount || 0 },
            { name: 'Total Consultation', text: data.totalConsultingCount || 0 },
            { name: 'Tickets Open', text: data.openTicketsCount || 0 },
            { name: 'Tickets Closed', text: data.closedTicketsCount || 0 }
          ]);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [dateRange]);

  const handleCardClick = (cardName) => {
    switch (cardName) {
      case 'Pending Revenue':
        navigate('');
        break;
      case 'Total Revenue':
        navigate('');
        break;
      case 'Total Consultation':
        navigate('/DashboardConsultingTable');
        break;
      case 'Total Organization':
        navigate('/OrganizationHeader');
        break;
      case 'Tickets Open':
        navigate('/SupportPage');
        break;
      case 'Tickets Closed':
        navigate('/SupportPage');
        break;
      default:
        break;
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  return (
    <Container className='Dashboard-container'>
      <h4 className='mt-3 ps-3, fs-3 fw-bold'>Home</h4>
      <hr style={{ color: '#0000003A', width:'100%', marginLeft:'-50px' }} />
      <Row>
        <Col md={4}></Col>
        <Col md={4}></Col>
        <Col md={4}>
          <DashboardCalender onDateRangeChange={handleDateRangeChange} />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Row className="g-3 mt-2 me-1 ms-4">
            {cardData.map((card, index) => (
              <Col md={4} key={index}>
                <Card
                  className="dashboard-custom-card"
                  style={{ borderRadius: '20px' }}
                  onClick={() => handleCardClick(card.name)}
                >
                  <Card.Body style={{ borderRadius: '20px', height: '100px' }}>
                    <Card.Title style={{ fontSize: '11px', cursor: 'pointer' }}>{card.name}</Card.Title>
                    <Card.Text
                      style={{
                        fontSize: '16px',
                        marginTop: '5%',
                        fontWeight: '700',
                        color: card.name === 'Tickets Open' && card.text < 11 ? 'red' : 'inherit',
                        cursor: 'pointer'
                      }}
                    >
                      {card.text}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col className='mt-3' md={6}>
          <div className="chartbar">
            <div className="chart-container">
              <DashboardBarchart />
            </div>
          </div>
        </Col>
      </Row>
      <div className="d-flex justify-content-between">
        <h5 style={{ fontWeight: 'bold', marginTop: '2%', marginLeft: '3%' }}>Live Appointment</h5>
        <button
          className='dashboard-seeall'
          style={{
            width: '100px',
            height: '31px',
            fontSize: '13px',
            marginTop: '1%',
            backgroundColor: '#0089FF',
            border: 'none',
            borderRadius: '25px',
            color: 'white',
            marginRight: '2%'
          }}
          onClick={() => navigate('/DashboardLiveTable')}
        >
          See All
        </button>
      </div>
      <div className="table-container">
        <Table />
      </div>
      <br />
    </Container>
  );
};

export default App;
