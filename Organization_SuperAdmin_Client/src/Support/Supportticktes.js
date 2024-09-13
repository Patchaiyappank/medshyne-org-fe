import React, { useState, useEffect, useRef } from 'react';
import supportprofilee from '../images/supportprofile.jpg';
import filterIcon from '../images/Vector.jpg'; // Path to your filter icon
import {
  Badge,
  Card,
  Col,
  Container,
  ListGroup,
  Navbar,
  Row,
  Button,
  Form
} from 'react-bootstrap';
import './Support.css';

function Supportticktes() {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 6;
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    inProgress: false,
    solved: false,
    open: false,
  });
  const filterButtonRef = useRef(null); // Reference for the filter button

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:5000/view_all_ticket_details');
        const data = await response.json();
        if (data.Result === "Success") {
          setTickets(data.result.map(ticket => ({
            id: ticket.ticket_id,
            description: ticket.subject,
            status: ticket.ticket_status,
            name: ticket.name,
            submitted: ticket.submitted,
          })));
        } else {
          console.error('Error fetching tickets:', data.message);
          setTickets([]);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setTickets([]);
      }
    };

    fetchTickets();
  }, []);

  const applyFilters = () => {
    let filteredTickets = [...tickets];
    if (filters.inProgress) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === 'IN PROGRESS');
    }
    if (filters.solved) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === 'solved');
    }
    if (filters.open) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === 'open');
    }
    setTickets(filteredTickets);
    setShowFilter(false);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.checked,
    });
  };

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'IN PROGRESS':
        return {
          color: '#FFD739',
          backgroundColor: 'rgba(255, 215, 57, 0.1)',
          border: 'none',
          borderRadius: '17px',
          fontWeight: '700',
          fontSize: '10px',
          padding: '4px 22px'
        };
      case 'open':
        return {
          color: '#E51837',
          backgroundColor: 'rgba(229, 24, 55, 0.1)',
          border: 'none',
          padding: '4px 22px',
          borderRadius: '17px',
          fontWeight: '700'
        };
      case 'solved':
        return {
          color: '#45C49C',
          backgroundColor: '#EBF9F5',
          border: 'none',
          padding: '4px 22px',
          borderRadius: '17px',
          fontWeight: '700'
        };
      default:
        return {};
    }
  };

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(tickets.length / ticketsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <span
          key={i}
          onClick={() => setCurrentPage(i)}
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
    <div className="App">
      <Navbar expand="lg">
        <Container className="d-flex justify-content-between">
          <Navbar.Brand style={{ fontSize: '12px' }}>
            Total:{' '}
            <span style={{ fontWeight: 'bold', color: 'black' }}>
              {tickets.length} Tickets
            </span>
          </Navbar.Brand>
          <div style={{ position: 'relative' }}>
            <button
              ref={filterButtonRef}
              className="filter-button"
              style={{
                color: '#061B2E',
                padding: '5px 10px',
                borderRadius: '25px',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                height: '30px',
                width: '70px',
                fontSize: '12px',
                fontWeight: '600',
                border: 'none'
              }}
              onClick={() => setShowFilter(!showFilter)}
            >
              Filter
              <img src={filterIcon} alt="Filter" style={{ width: '15px', marginLeft: '5px' }} />
            </button>
            {showFilter && (
              <div
                className="filter-dropdown"
                style={{
                  position: 'absolute',
                  top: '120%',
                  right:0,
                  backgroundColor: 'white',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  padding: '10px',
                  zIndex: 10,
                  width: '140px',
                  fontSize:'12px',
                  height:'115px'
                }}
              >
                <Form>
                  <Form.Check
                    type="checkbox"
                    id="inProgress"
                    label="IN PROGRESS"
                    name="inProgress"
                    checked={filters.inProgress}
                    onChange={handleFilterChange}
                  />
                  <Form.Check
                    type="checkbox"
                    id="solved"
                    label="Solved"
                    name="solved"
                    checked={filters.solved}
                    onChange={handleFilterChange}
                  />
                  <Form.Check
                    type="checkbox"
                    id="open"
                    label="Open"
                    name="open"
                    checked={filters.open}
                    onChange={handleFilterChange}
                  />
                </Form>
                <Button
                  variant="primary"
                  onClick={applyFilters}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: 'none',
                    color: '#3FA2F6',
                    marginTop: '-12px',
                    marginLeft:'30px'
                  }}
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </Container>
      </Navbar>

      <Container className="mt-1">
        <Row>
          {currentTickets.map((ticket) => (
            <Col key={ticket.id} md={4} className="mb-4">
              <Card style={{ border: 'none' }}>
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div text="dark">
                      <i className="bi-chat-left-text"></i>
                    </div>
                    <div
                      style={{
                        minWidth: '50px',
                        fontSize: '10px',
                        ...getStatusStyle(ticket.status),
                      }}
                    >
                      {ticket.status}
                    </div>
                  </div>
                  <Row>
                    <Col xs={2}>
                      <img
                        src={supportprofilee}
                        style={{ width: '30px', borderRadius: '5%', marginTop: '-0px' }}
                        alt="Profile"
                      />
                    </Col>
                    <Col xs={9}>
                      <Card.Title className="" style={{ fontWeight: 'bolder', fontSize: '12px', marginTop: '8px' }}>
                        {ticket.description}
                      </Card.Title>
                    </Col>
                  </Row>
                  <hr style={{ color: ' rgba(0, 0, 0, 0.2)', marginTop: '10px' }}></hr>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col style={{ color: '#7E92A2', fontSize: '12px', marginTop: '-12px' }}>
                          <strong>User:</strong>
                        </Col>
                        <Col style={{ color: '#7E92A2', fontSize: '12px', marginTop: '-13px' }}>
                          <strong>Submitted:</strong>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={{ fontWeight: 'bolder', fontSize: '12px' }}>{ticket.name}</Col>
                        <Col style={{ fontWeight: 'bolder', fontSize: '12px' }}>{ticket.submitted}</Col>
                      </Row>
                      <Row className="mt-2">
                        <Col style={{ color: '#7E92A2', fontSize: '12px' }}>
                          <strong>Ticket ID:</strong>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col style={{ fontWeight: 'bolder', fontSize: '11px' }}>{ticket.id}</Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="Support-pagination" style={{ textAlign: 'center', marginBottom: '5%', color: '#697077', fontWeight: '500' }}>
          <span
            className="Support-pagination-arrow"
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            style={{
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              marginRight: '10px',
              fontSize: '12px',
              color: currentPage === 1 ? '#697077' : '#697077',
            }}
          >
            <span className="Support-prevoius-arrow" style={{ padding: '10px' }}>&#8249;</span> Previous
          </span>
          <span style={{ fontSize: '12px' }} className="Support-pagination-pages">
            {renderPageNumbers()}
          </span>
          <span
            className="Support-pagination-arrow"
            onClick={() => currentPage < Math.ceil(tickets.length / ticketsPerPage) && setCurrentPage(currentPage + 1)}
            style={{
              cursor: currentPage === Math.ceil(tickets.length / ticketsPerPage) ? 'not-allowed' : 'pointer',
              marginLeft: '10px',
              fontSize: '12px',
              color: currentPage === Math.ceil(tickets.length / ticketsPerPage) ? '#697077' : '#697077',
            }}
          >
            Next <span className="Support-next-arrow" style={{ padding: '10px' }}>&#8250;</span>
          </span>
        </div>
      </Container>
    </div>
  );
}

export default Supportticktes;
