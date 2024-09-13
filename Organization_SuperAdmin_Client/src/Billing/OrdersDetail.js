import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Badge, Container, Button, Table } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import './OrdersDetail.css';

const OrdersDetail = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = state;

  const orderId = id;

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/super_Admin_getOrderDetails/${orderId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        } else {
          throw new Error('Network response was not ok');
        }
      }
      const data = await response.json();
      console.log('Order details data:', data); // Log the response data
      setOrderDetails(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError(error.message);
    }
  };

  const handleNewBillNavigate = () => {
      navigate('/NewBilling', { state: { id } });
  };

  const handleScreenshot = () => {
    const element = document.getElementById('order-details-section');
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Order_${orderDetails.order_id}.pdf`);
    });
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid className="order-details-inventory-container mt-3">
      <Row className="mb-3">
        <Col>
          <h2 className="order-details-inventory-title" style={{ marginLeft: "20px", marginTop: "-10px" }}>Order Details</h2>
          <hr className="order-details-divider" style={{ marginLeft: "-15px" }} />
        </Col>
      </Row>

      <Row className="order-details-details-container" id="order-details-section">
        <Col xs={12} className="order-details-order-header d-flex">
          <p className="order-details-inventory-subtitle">Order {orderDetails.order_id}</p>
          <Badge className={`order-details-badge-status ${orderDetails.status.toLowerCase()}`}>
            {orderDetails.status}
          </Badge>
        </Col>

        <Row className="order-details-info-row mb-4">
          <Col lg={3} md={3}  className="mb-2">
            <p className="order-details-info-title">Organization&nbsp;Name</p>
            <p className="order-details-info-content">{orderDetails.organization_name}</p>
          </Col>
          <Col lg={3} md={3}  className="mb-2">
            <p className="order-details-info-title">Organization&nbsp;ID</p>
            <p className="order-details-info-content">{orderDetails.organization_mobile_no}</p>
          </Col>
          <Col lg={3} md={3}  className="mb-2">
            <p className="order-details-info-title">Regional&nbsp;Manager</p>
            <p className="order-details-info-content">{orderDetails.r_m_name}</p>
          </Col>
          <Col lg={3} md={3}  className="mb-2">
            <p className="order-details-info-title">Mobile&nbsp;Number</p>
            <p className="order-details-info-content">{orderDetails.organization_mobile_no}</p>
          </Col>
        </Row>

        <Row className="order-details-info-row">
          <Col lg={9} xs={12}>
            <p className="order-details-info-title">Address</p>
            <p className="order-details-info-content1">{orderDetails.address}</p>
          </Col>
          <Col lg={3} xs={12}>
            <p className="order-details-info-title">Date</p>
            <p className="order-details-info-content">{orderDetails.order_date}</p>
          </Col>
        </Row>

        <Row className="justify-content-between align-items-center my-3">
          <Col md="auto">
            <h5 className="order-details-items-ordered-title">Items Ordered</h5>
          </Col>
          <Col md="auto">
            <Button className="order-details-btn-custom" onClick={handleScreenshot}>Print Order</Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <Table responsive bordered className="order-details-orders-table">
              <thead>
                <tr>
                  <th className='ordermedname'>Medicine&nbsp;Name</th>
                  <th className='orderhsncode1'>HSN&nbsp;Code</th>
                  <th className='orderquantity'>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.medicines.map((order, index) => (
                  <tr key={index}>
                    <td className='order-details-medicinename'>{order.medicine_name}</td>
                    <td className='text-centerhsn'>{order.hsn_code}</td>
                    <td className='text-centerqu'>{order.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row className="justify-content-end mt-3">
          <Col md="auto">
            <Button className="order-details-btn-custom2" onClick={handleNewBillNavigate}>
              Billing
            </Button>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default OrdersDetail;