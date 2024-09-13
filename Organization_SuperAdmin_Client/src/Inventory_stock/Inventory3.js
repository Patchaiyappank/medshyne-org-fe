import React, { useState } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./Inventory3.css";

const Inventory = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([
    {
      id: Date.now(),
      medicine: "",
      hsn_code: "",
      quantity: "",
      expiry_date: null,
      isValid: true, // Add isValid state to track validation
      
    },
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        medicine: "",
        hsn_code: "",
        quantity: "",
        expiry_date: new Date(),
        isValid: true, // Initialize new rows with valid state
      },
    ]);
  };

  const removeRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleBillingTypeChange = (e) => {
    const billingType = e.target.value;
    if (billingType === "Dispose Expired To Organization") {
      navigate("/stock1");
    } else if (billingType === "Dispose Expired") {
      navigate("/DisposeExpired");
    }
  };

  const handleInputChange = (id, field, value) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, [field]: value, isValid: true } : row
      )
    );
  };

  const handleFormSubmit = async () => {
    let isFormValid = true;

    const validatedRows = rows.map((row) => {
      const isRowValid =
        row.medicine.trim() !== "" &&
        row.hsn_code.trim() !== "" &&
        row.quantity.trim() !== "" &&
        row.expiry_date !== null;

      if (!isRowValid) {
        isFormValid = false;
      }

      return { ...row, isValid: isRowValid };
    });

    setRows(validatedRows);

    if (!isFormValid) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const inventoryItems = rows.map((row) => ({
        medicine: row.medicine,
        hsn_code: row.hsn_code,
        quantity: parseInt(row.quantity, 10),
        expiry_date: row.expiry_date.toLocaleDateString('en-CA'), // This ensures the date is formatted as yyyy-MM-dd in local timezone
      }));
      

      const response = await fetch(
        "http://localhost:5000/superAdmin_addOrUpdateInventory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inventoryItems),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(
          `Inventory updated successfully. Invoice Number: ${data.invoice_number}`
        );
        navigate("/inventory");
      } else {
        const errorData = await response.json();
        alert(`Failed to update inventory: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <Container fluid className="custom2-inventory-container mt-3">
      <Row className="mb-3">
        <Col>
          <h2 className="custom2-inventory-title">Stock Update</h2>
          <hr className="custom2-divider" />
        </Col>
      </Row>

      <Row className="custom2-details-container mb-4">
        <Col xs={12}>
          <p className="custom2-inventory-subtitle">Add a Stock Update</p>
          <hr className="custom2-divider1" />
        </Col>

        <Row>
          <Col>
            <Form className="p-0">
              <Row className="mb-3">
                <Col lg={4} md={4} sm={12} className="mb-2">
                  <Form.Group controlId="billingType">
                    <Form.Label className="custom2-form-label">
                      Select Billing Type
                    </Form.Label>
                    <div className="custom2-input-with-icon">
                      <Form.Select
                        className="form-control custom2-form-select"
                        onChange={handleBillingTypeChange}
                      >

                        <option>Add Stock </option>
                        <option>Dispose Expired To Organization</option>
                        <option>Dispose Expired</option>
                      </Form.Select>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <h4 className="custom2-bill-details-title">Bill details</h4>
            <Table bordered hover className="custom2-table">
              <thead className="custom2-table-header">
                <tr className="custom2 table-row">
                  <th className="custom2-light-font">Medicine Name</th>
                  <th className="custom2-light-font">HSN code</th>
                  <th className="custom2-light-font">Quantity</th>
                  <th className="custom2-light-font">Expiry date</th>
                </tr>
              </thead>
              <tbody>{/* Add more rows as needed */}</tbody>
            </Table>
          </Col>
        </Row>

        {rows.map((row) => (
          <Row className="mb-3" key={row.id}>
            <Col md={3} sm={3} className="custom2-input-with-icon">
              <Form.Control
                type="text"
                placeholder="Medicine Name"
                className={`form-control custom2-form-select1 ${
                  !row.isValid && row.medicine.trim() === "" ? "border-danger" : ""
                }`}
                value={row.medicine}
                onChange={(e) =>
                  handleInputChange(row.id, "medicine", e.target.value)
                }
              />
            </Col>
            <Col md={3} sm={3} className="custom2-input-with-icon">
              <Form.Control
                type="text"
                placeholder="HSN Code"
                className={`form-control custom2-form-select1 ${
                  !row.isValid && row.hsn_code.trim() === "" ? "border-danger" : ""
                }`}
                value={row.hsn_code}
                onChange={(e) =>
                  handleInputChange(row.id, "hsn_code", e.target.value)
                }
              />
            </Col>
            <Col md={3} sm={3} className="custom2-input-with-icon">
              <Form.Control
                type="text"
                placeholder="Quantity"
                className={`form-control custom2-form-select1 ${
                  !row.isValid && row.quantity.trim() === "" ? "border-danger" : ""
                }`}
                value={row.quantity}
                onChange={(e) =>
                  handleInputChange(row.id, "quantity", e.target.value)
                }
              />
            </Col>
            <Col md={2} sm={2} className="custom2-input-with-icon">
              <DatePicker
                selected={row.expiry_date}
                onChange={(date) =>
                  handleInputChange(row.id, "expiry_date", date)
                }
                className={`form-control custom3-form-select1 ${
                  !row.isValid && row.expiry_date === null ? "border-danger" : ""
                }`}
                dateFormat="yyyy-MM-dd"
                placeholderText="Date"
              />
            </Col>
            <Col md={1} sm={1} className="custom2-delete-icon-col">
              <img
                src={require("./delete.png")}
                alt="Delete"
                className="custom2-delete-icon"
                onClick={() => removeRow(row.id)}
                style={{ cursor: "pointer" }}
              />
            </Col>
          </Row>
        ))}

        <Row>
          <Col className="d-flex justify-content-start">
            <Button className="custom2-button" type="button" onClick={addRow}>
              New
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-end mt-4">
            <Button
              className="custom2-button2"
              type="button"
              onClick={handleFormSubmit}
            >
              Add Stock
            </Button>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Inventory;