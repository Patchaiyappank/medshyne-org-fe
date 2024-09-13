import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import "./Inventory.css";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const navigate = useNavigate();
  const [organizationNames, setOrganizationNames] = useState([]);
  const [organizationIDs, setOrganizationIDs] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [hsnCodes, setHsnCodes] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [rowHsnCodes, setRowHsnCodes] = useState({});
  const [rowQuantities, setRowQuantities] = useState({});
  const [rowExpiryDates, setRowExpiryDates] = useState({});
  const [records, setRecords] = useState([]);
  const [errors, setErrors] = useState([]);

  const [quantities, setQuantities] = useState([]);
  const [expiryDates, setExpiryDates] = useState([]);

  useEffect(() => {
    fetchOrganizationNames();
    fetchOrganizationIDs();
  }, []);

  const fetchOrganizationNames = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/superAdmin_organizations_dropdown"
      );
      const data = await response.json();
      setOrganizationNames(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch organizations", error);
    }
  };

  const fetchOrganizationIDs = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/superAdmin_organizations_id_dropdown"
      );
      const data = await response.json();
      setOrganizationIDs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching organization IDs:", error);
    }
  };

  const fetchOrganizationIdByName = async (name) => {
    try {
      const response = await fetch(
        `http://localhost:5000/superAdmin_get_organization_name_id?organization_name=${name}`
      );
      const data = await response.json();
      setSelectedOrganizationId(data.id);
    } catch (error) {
      console.error("Failed to fetch organization ID", error);
    }
  };

  const fetchOrganizationNameById = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/superAdmin_get_organization_name_id?id=${id}`
      );
      const data = await response.json();
      setSelectedOrganization(data.organization_name);
    } catch (error) {
      console.error("Failed to fetch organization name", error);
    }
  };

  const handleOrganizationNameChange = (event) => {
    const selectedName = event.target.value;
    setSelectedOrganization(selectedName);
    if (selectedName) {
      fetchOrganizationIdByName(selectedName);
    }
  };

  const handleOrganizationIDChange = (event) => {
    const selectedID = event.target.value;
    setSelectedOrganizationId(selectedID);
    if (selectedID) {
      fetchOrganizationNameById(selectedID);
    }
  };

  useEffect(() => {
    if (selectedOrganization) {
      fetchMedicines(selectedOrganization);
    }
  }, [selectedOrganization]);

  const fetchMedicines = async (organizationName) => {
    try {
      const response = await fetch(
        `http://localhost:5000/superAdmin_medicines_dropDown?organization_name=${organizationName}`
      );
      const data = await response.json();
      if (data.Result === "Success") {
        setMedicines(data.medicine);
      } else {
        setMedicines([]);
      }
    } catch (error) {
      console.error("Failed to fetch medicines", error);
      setMedicines([]);
    }
  };

  useEffect(() => {
    if (selectedOrganization && selectedMedicine) {
      fetchHsnCodes(selectedOrganization, selectedMedicine);
    }
  }, [selectedMedicine]);

  const fetchHsnCodes = async (organizationName, medicineName, rowId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/superAdmin_hsn_dropDown?organization_name=${organizationName}&medicine=${medicineName}`
      );
      const data = await response.json();
      if (data.Result === "Success") {
        setRowHsnCodes((prev) => ({
          ...prev,
          [rowId]: data.hsn_codes,
        }));
      } else {
        setRowHsnCodes((prev) => ({
          ...prev,
          [rowId]: [],
        }));
      }
    } catch (error) {
      console.error("Failed to fetch HSN codes", error);
      setRowHsnCodes((prev) => ({
        ...prev,
        [rowId]: [],
      }));
    }
  };

  const handleMedicineChange = (id, value) => {
    handleRowChange(id, "medicineName", value);
    fetchHsnCodes(selectedOrganization, value, id);
    fetchQuantities(selectedOrganization, value, id); // Add this line
    fetchExpiryDates(selectedOrganization, value, id); // Add this line
  };

  const fetchQuantities = async (organizationName, medicineName, rowId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/superAdmin_quantity_dropDown?organization_name=${organizationName}&medicine=${medicineName}`
      );
      const data = await response.json();
      if (data.Result === "Success") {
        setRowQuantities((prev) => ({
          ...prev,
          [rowId]: data.quantities,
        }));
      } else {
        setRowQuantities((prev) => ({
          ...prev,
          [rowId]: [],
        }));
      }
    } catch (error) {
      console.error("Failed to fetch quantities", error);
      setRowQuantities((prev) => ({
        ...prev,
        [rowId]: [],
      }));
    }
  };

  const fetchExpiryDates = async (organizationName, medicineName, rowId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/superAdmin_expiry_date_dropDown?organization_name=${organizationName}&medicine=${medicineName}`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setRowExpiryDates((prev) => ({
          ...prev,
          [rowId]: data.map((item) => item.expiry_date),
        }));
      } else {
        setRowExpiryDates((prev) => ({
          ...prev,
          [rowId]: [],
        }));
      }
    } catch (error) {
      console.error("Failed to fetch expiry dates", error);
      setRowExpiryDates((prev) => ({
        ...prev,
        [rowId]: [],
      }));
    }
  };

  const [rows, setRows] = useState(
    Array.from({ length: 1 }, (_, index) => ({
      id: index,
      medicineName: "",
      hsnCode: "",
      quantity: "",
      expiryDate: "",
    }))
  );

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        medicineName: "",
        hsnCode: "",
        quantity: "",
        expiryDate: "",
      },
    ]);
  };
  const handleDeleteRecords = async () => {
    const hasEmptyFields = rows.some(
      (row) =>
        !row.medicineName ||
        !row.hsnCode ||
        !row.quantity ||
        !row.expiryDate ||
        !selectedOrganization
    );
  
    if (hasEmptyFields) {
      alert("Please fill in all the details before disposing.");
      return;
    }
  
    const recordsToDelete = rows.map((row) => ({
      medicine: row.medicineName,
      hsn_code: row.hsnCode,
      quantity: row.quantity,
      organization_name: selectedOrganization,
      expiry_date: row.expiryDate,
    }));

    try {
      const response = await fetch(
        "http://localhost:5000/superAdmin_deleteMedicine_org",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ records: recordsToDelete }),
        }
      );

      if (response.ok) {
        alert("Records deleted successfully");
        resetForm();
        navigate("/inventory");
      } else {
        const responseData = await response.json();
        alert(responseData.message || "Failed to delete records");
      }
    } catch (error) {
      console.error("Error deleting records:", error);
      alert(
        "An error occurred while deleting records. Please try again later."
      );
    }
  };

  const resetForm = () => {
    setRows([
      {
        id: Date.now(),
        medicineName: "",
        hsnCode: "",
        quantity: "",
        expiryDate: "",
      },
    ]);
    setSelectedOrganization("");
    setSelectedOrganizationId("");
  };

  const removeRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleRowChange = (id, field, value) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const navigatepage = (e) => {
    const navigatepage = e.target.value;
    if (navigatepage === "Add Stock") {
      navigate("/AddStock");
    } else if (navigatepage === "Dispose Expired") {
      navigate("/DisposeExpired");
    }
  };

  return (
    <Container fluid className="custom-inventory-container mt-3">
      {/* Header Section */}
      <Row className="mb-3">
        <Col>
          <h2 className="custom-inventory-title">Stock Update</h2>
          <hr className="custom-divider" />
        </Col>
      </Row>

      {/* Details Section */}
      <Row className="custom-details-container mb-4">
        <Col xs={12}>
          <p className="custom-inventory-subtitle">Add a Stock Update</p>
          <hr className="custom-divider1" />
        </Col>

        {/* Form Section */}
        <Row>
          <Col>
            <Form className="p-0">
              <Row className="mb-3">
                <Col lg={4} md={4} sm={12} className="mb-2">
                  <Form.Group controlId="billingType">
                    <Form.Label className="custom-form-label">
                      Select Billing Type
                    </Form.Label>
                    <div className="custom-input-with-icon">
                      <Form.Select
                        className="form-control custom-form-select"
                        onChange={navigatepage}
                      >
                        <option>Dispose Expired To Organization</option>
                        <option>Add Stock</option>
                        <option>Dispose Expired</option>
                      </Form.Select>
                    </div>
                  </Form.Group>
                </Col>
                <Col lg={4} md={4} sm={12} className="mb-2">
                  <Form.Group controlId="organizationName">
                    <Form.Label className="custom-form-label">
                      Organization Name
                    </Form.Label>
                    <div className="custom-input-with-icon">
                      <Form.Select
                        className="form-control custom-form-select"
                        value={selectedOrganization}
                        onChange={handleOrganizationNameChange}
                      >
                        <option value="">Select an organization</option>
                        {organizationNames.map((name, index) => (
                          <option key={index} value={name}>
                            {name}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  </Form.Group>
                </Col>
                <Col lg={4} md={4} sm={12} className="mb-2">
                  <Form.Group controlId="organizationId">
                    <Form.Label className="custom-form-label">
                      Organization ID
                    </Form.Label>
                    <div className="custom-input-with-icon">
                      <Form.Select
                        className="form-control custom-form-select"
                        value={selectedOrganizationId}
                        onChange={handleOrganizationIDChange}
                      >
                        <option value="">Select an ID</option>
                        {organizationIDs.map((id, index) => (
                          <option key={index} value={id}>
                            {id}
                          </option>
                        ))}
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
            <h4 className="custom-bill-details-title">Bill details</h4>
            <Table bordered hover className="custom-table">
              <thead className="custom-table-header custom-theader">
                <tr className="custom table-row">
                  <th className="custom-light-font">Medicine Name</th>
                  <th className="custom-light-font">HSN code</th>
                  <th className="custom-light-font">Quantity</th>
                  <th className="custom-light-font">Expiry date</th>
                </tr>
              </thead>
              <tbody>{/* Add more rows as needed */}</tbody>
            </Table>
          </Col>
        </Row>

        {/* Render Rows Dynamically */}
        {rows.map((row) => (
          <Row className="mb-3" key={row.id}>
            <Col md={3} sm={3} className="custom-input-with-icon">
              <Form.Select
                className="form-control custom-form-select1"
                value={row.medicineName}
                onChange={(e) => handleMedicineChange(row.id, e.target.value)} // Updated line
              >
                <option>Medicine Name</option>
                {medicines.map((medicine, index) => (
                  <option key={index} value={medicine}>
                    {medicine}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3} sm={3} className="custom-input-with-icon">
              <Form.Select
                className="form-control custom3-form-select1"
                value={row.hsnCode}
                onChange={(e) =>
                  handleRowChange(row.id, "hsnCode", e.target.value)
                }
              >
                <option>HSN Code</option>
                {(rowHsnCodes[row.id] || []).map((code, index) => (
                  <option key={index} value={code}>
                    {code}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3} sm={3} className="custom-input-with-icon">
              <Form.Select
                className="form-control custom-form-select1"
                value={row.quantity}
                onChange={(e) =>
                  handleRowChange(row.id, "quantity", e.target.value)
                }
              >
                <option>Quantity</option>
                {(rowQuantities[row.id] || []).map((quantity, index) => (
                  <option key={index} value={quantity}>
                    {quantity}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2} sm={2} className="custom-input-with-icon">
              <Form.Select
                className="form-control custom-form-select1"
                value={row.expiryDate}
                onChange={(e) =>
                  handleRowChange(row.id, "expiryDate", e.target.value)
                }
              >
                <option>Expiry Date</option>
                {(rowExpiryDates[row.id] || []).map((date, index) => (
                  <option key={index} value={date}>
                    {date}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={1} sm={1} className="custom-delete-icon-col">
              <img
                src={require("./delete.png")}
                alt="Delete"
                className="custom-delete-icon"
                onClick={() => removeRow(row.id)}
                style={{ cursor: "pointer" }}
              />
            </Col>
          </Row>
        ))}

        {/* Button Section */}
        <Row>
          <Col className="d-flex justify-content-start">
            <Button className="custom-button" type="button" onClick={addRow}>
              New
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-end mt-4">
            <Button
              className="custom3-button2"
              type="button"
              onClick={handleDeleteRecords}
            >
              Dispose Medicine
            </Button>{" "}
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Inventory;