import React, { useState,useEffect } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import "./Billing1.css";
import Select from 'react-select'; // Import react-select
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';


const Inventory = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const navigate = useNavigate();
  const [organizationNames, setOrganizationNames] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [organizationIDs, setOrganizationIDs] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [regionalManager, setRegionalManager] = useState("");
  const [salesExecutives, setSalesExecutives] = useState([]);
  const [r_m_id, setR_m_id] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [hsnCodes, setHsnCodes] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [expiryDates, setExpiryDates] = useState([]);
  const [medicine, setMedicine] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [data, setData] = useState({});

  // Initialize state with 5 rows
  // const [rows, setRows] = useState(
  //   Array.from({ length: 5 }, (_, index) => ({ id: index }))
  // );

  // Function to add a new row
  const addRow = () => {
    setRows([...rows, { id: Date.now() }]);
  };

  // Function to remove a row
  const removeRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  useEffect(() => {
    // fetchInvoiceId();
    fetchOrganizationNames();
     fetchOrganizationIDs();
     fetchMedicines();
     fetchHsnCodes();
     fetchQuantities();
     fetchExpiryDates();
  }, []);
  
  useEffect(() => {
    if (r_m_id) {
      fetchSalesExecutives(r_m_id);
    }
  }, [r_m_id]);

  const fetchSalesExecutives = async (r_m_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/sales_executives_dropDown/${r_m_id}`
      );
      const data = await response.json();
      setSalesExecutives(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch sales executives", error);
    }
  };
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

  const handleOrganizationNameChange = (event) => {
    const selectedName = event.target.value;
    setSelectedOrganization(selectedName);
    if (selectedName) {
      fetchOrganizationIdByName(selectedName);
    }
  };

  const fetchOrganizationIdByName = async (name) => {
    try {
      const response = await fetch(
        `http://localhost:5000/superAdmin_get_organization_name_id?organization_name=${name}`
      );
      const data = await response.json();
      setSelectedOrganizationId(data.id);
      setRegionalManager(data.r_m_name);
      setR_m_id(data.r_m_id);
    } catch (error) {
      console.error("Failed to fetch organization ID", error);
    }
  };

  const handleOrganizationIDChange = (event) => {
    const selectedID = event.target.value;
    setSelectedOrganizationId(selectedID);
    if (selectedID) {
      fetchOrganizationNameById(selectedID);
    }
  };

  const fetchData = async () => {
    try {
      // API request using axios
      const response = await axios.get("http://localhost:5000/superAdmin_newBilling_dropDowns", {
        params: {
          medicine,
          hsn_code: hsnCode,
          quantity,
          expiry_date: expiryDate,
        },
      });
  
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [medicine, hsnCode, quantity, expiryDate]); // Re-run fetch when these dependencies change

  const fetchFilteredOptions = async (field, value, rowId) => {
    try {
      const params = new URLSearchParams();
      if (field === "selectedMedicine") {
        params.append("medicine", value);
      } else if (field === "selectedHsnCode") {
        params.append("hsn_code", value);
      } else if (field === "selectedQuantity") {
        params.append("quantity", value);
      } else if (field === "selectedExpiryDate") {
        params.append("expiry_date", value);
      }

      const response = await fetch(
        `http://localhost:5000/superAdmin_newBilling_dropDowns?${params.toString()}`
      );
      const data = await response.json();

      if (data.Result === "Success") {
        setRows((prevRows) =>
          prevRows.map((row) => {
            if (row.id === rowId) {
              return {
                ...row,
                selectedMedicine: data.medicine || row.selectedMedicine,
                selectedHsnCode: data.hsn_code || row.selectedHsnCode,
                selectedQuantity: data.quantity || row.selectedQuantity,
                selectedExpiryDate: data.expiry_date || row.selectedExpiryDate,
              };
            }
            return row;
          })
        );
      } else {
        console.error("Failed to fetch filtered options:", data.message);
      }
    } catch (error) {
      console.error("Error fetching filtered options:", error);
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

  const fetchOrganizationNameById = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/superAdmin_get_organization_name_id?id=${id}`
      );
      const data = await response.json();
      setSelectedOrganization(data.organization_name);
      setRegionalManager(data.r_m_name);
      setR_m_id(data.r_m_id);
    } catch (error) {
      console.error("Failed to fetch organization name", error);
    }
  };
 
  const fetchMedicines = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/superAdmin_own_medicines_dropDown"
      );
      const data = await response.json();
      if (data.Result === "Success") {
        setMedicines(data.medicine);
      } else {
        console.error("Failed to fetch medicines:", data.message);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };
  const fetchHsnCodes = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/superAdmin_own_hsn_dropDown"
      );
      const data = await response.json();
      if (data.Result === "Success") {
        setHsnCodes(data.hsn_codes);
      } else {
        console.error("Failed to fetch HSN codes:", data.message);
      }
    } catch (error) {
      console.error("Error fetching HSN codes:", error);
    }
  };
  const fetchQuantities = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/superAdmin_own_quantity_dropDown"
      );
      const data = await response.json();
      if (data.Result === "Success") {
        setQuantities(data.quantities);
      } else {
        console.error("Failed to fetch quantities:", data.message);
      }
    } catch (error) {
      console.error("Error fetching quantities:", error);
    }
  };
  const fetchExpiryDates = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/superAdmin_own_expiry_date_dropDown"
      );
      const data = await response.json();
      if (data.Result === "Success") {
        setExpiryDates(data.expiry_dates);
      } else {
        console.error("Failed to fetch expiry dates:", data.message);
      }
    } catch (error) {
      console.error("Error fetching expiry dates:", error);
    }
  };

  const [rows, setRows] = useState([
    { id: Date.now(), selectedMedicine: '', selectedHsnCode: '', selectedQuantity: '', selectedExpiryDate: '' }
  ]);
  
  // This is what your medicinesData is built from
  // const medicinesData = rows.map(row => ({
  //   medicine_name: row.selectedMedicine,
  //   hsn_code: row.selectedHsnCode,
  //   quantity: row.selectedQuantity,
  //   expiry_date: row.selectedExpiryDate
  // }));

  // const handleRowChange = (rowId, field, value) => {
  //   setRows((prevRows) =>
  //     prevRows.map((row) =>
  //       row.id === rowId ? { ...row, [field]: value } : row
  //     )
  //   );
  //   fetchFilteredOptions(field, value, rowId);
  // };
  const handleRowChange = (id, field, value) => {
    // Update rows state
    const updatedRows = rows.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  
    // Update orderData.medicines based on row changes
    const updatedMedicines = updatedRows.map(row => ({
      medicine_name: row.selectedMedicine,
      hsn_code: row.selectedHsnCode,
      quantity: row.selectedQuantity,
      expiry_date: row.selectedExpiryDate,
    }));
  
    setOrderData(prevData => ({
      ...prevData,
      medicines: updatedMedicines, // Sync medicines in orderData with rows
    }));
  };

  const getCurrentDate = () => {
    const date = new Date();
    // Format the date as YYYY-MM-DD, or change the format as needed
    return date.toISOString().split('T')[0]; 
  };


  const [orderData, setOrderData] = useState({
    order_id: id,
    order_date: getCurrentDate(),
    medicines: '',
    cashier: 'ram',
    receiver:'',
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/superAdmin_order_submit_btn', orderData);
      alert('Successfully added')
      navigate('/inventory')
      setResponseMessage(`Order submitted successfully. Invoice Number: ${response.data.invoice_number}`);
      // navigate('/Billing');
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting order');
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...orderData.medicines];
    updatedMedicines[index] = { ...updatedMedicines[index], [field]: value };
    setOrderData({ ...orderData, medicines: updatedMedicines });
  };

  const addMedicine = () => {
    setOrderData({ ...orderData, medicines: [...orderData.medicines, { medicine_name: '', hsn_code: '', quantity: '', expiry_date: '' }] });
  };

  const handleSalesExecutiveChange = (e) => {
    setOrderData({
      ...orderData,
      receiver: e.target.value, // Update receiver in orderData
    });
  };

  return (
    <Container fluid className="custom6-inventory-container mt-3">
      {/* Header Section */}
      <Row className="mb-3">
        <Col>
          <h2 className="custom6-inventory-title">Billing</h2>
          <hr className="custom6-divider" />
        </Col>
      </Row>

      {/* Details Section */}
      <Row className="custom6-details-container mb-4">
        <Col xs={12}>
          <p className="custom6-inventory-subtitle">Add a new bill</p>
          <hr className="custom6-divider1" />
        </Col>

        {/* Form Section */}
        <Row>
          <Col>
            <Form className="p-0">
              <Row className="mb-3">
                <Col lg={4} md={4} sm={12} className="mb-2">
                <Form.Group controlId="billingType">
  <Form.Label className="custom6-form-label">Order NO</Form.Label>
  <div className="custom6-input-with-icon">
    <Form.Control
      type="text"
      placeholder="#9058489"
      className="form-control custom6-form-input"
      value={id}
    />
  </div>
</Form.Group>

                </Col>
                <Col lg={4} md={4} sm={12} className="mb-2">
                  <Form.Group controlId="organizationName">
                    <Form.Label className="custom6-form-label">
                    Organization Name*
                                        </Form.Label>
                    <div className="custom6-input-with-icon">
                      <Form.Select className="form-control custom6-form-select"
                       value={selectedOrganization}
                       onChange={handleOrganizationNameChange}
                      >
                          <option value="">Select an organization</option>
                      {organizationNames.map((name, index) => (
                          <option key={index} value={name}>
                            {name}
                          </option>
                        ))}
                        {/* Add other options here */}
                      </Form.Select>
                    </div>
                  </Form.Group>
                </Col>
                <Col lg={4} md={4} sm={12} className="mb-2">
                  <Form.Group controlId="organizationId">
                    <Form.Label className="custom6-form-label">
                      Organization ID
                    </Form.Label>
                    <div className="custom6-input-with-icon">
                      <Form.Select className="form-control custom6-form-select"
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
                <Col lg={4} md={4} sm={12} className="mb-2">
                  <Form.Group controlId="organizationId">
                    <Form.Label className="custom6-form-label">
                    Regional manager                    </Form.Label>
                    <div className="custom6-input-with-icon">
                    <Form.Control
                        type="text"
                        placeholder="Regional Manager"
                        value={regionalManager}
                        className="form-control custom7-form-select"
                        readOnly
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col lg={4} md={4} sm={12} className="mb-2">
                  <Form.Group controlId="organizationId">
                    <Form.Label className="custom6-form-label">
                    Sales Exclusive Name
                    </Form.Label>
                    <div className="custom6-input-with-icon">
                      <Form.Select className="form-control custom6-form-select"
                       value={orderData.receiver} 
                       onChange={handleSalesExecutiveChange}
                      >
                      <option value="">Select Sales Executive</option>
                        {salesExecutives.map((exe, index) => (
                          <option key={index} value={exe.sal_exe_name}>
                            {exe.sal_exe_name}
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
            <h4 className="custom6-bill-details-title">Bill details</h4>
            <Table bordered hover className="custom6-table">
              <thead className="custom6-table-header">
                <tr className="custom6 table-row">
                  <th className="custom6-light-font">Medicine Name</th>
                  <th className="custom6-light-font">HSN code</th>
                  <th className="custom6-light-font">Quantity</th>
                  <th className="custom6-light-font">Expiry date</th>
                </tr>
              </thead>
              <tbody>{/* Add more rows as needed */}</tbody>
            </Table>
          </Col>
        </Row>

        {/* Render Rows Dynamically */}
        {rows.map((row) => (
          <Row className="mb-3" key={row.id}>
            <Col md={3} className="custom6-input-with-icon">
            <Form.Select 
               value={row.selectedMedicine || ""}
               onChange={(e) =>
                 handleRowChange(row.id, "selectedMedicine", e.target.value)
               }
              className="custom6-form-select1 custom-react-select"

              placeholder="Medicine Name"
            //  isSearchable={true} // Enables search functionality
              
            >
               <option value="">Medicine Name</option>
                {medicines.map((medicine, index) => (
                  <option key={index} value={medicine}>
                    {medicine}
                  </option>
                ))}
                </Form.Select>
          </Col>
            <Col md={3} className="custom6-input-with-icon">
              <Form.Select className="form-control custom6-form-select1"
              value={row.selectedHsnCode || ""}
                onChange={(e) =>
                  handleRowChange(row.id, "selectedHsnCode", e.target.value)
                }
              >
                <option value="">HSN Code</option>
                {hsnCodes.map((hsn, index) => (
                  <option key={index} value={hsn}>
                    {hsn}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3} className="custom6-input-with-icon">
              <Form.Select className="form-control custom6-form-select1"
              value={row.selectedQuantity || ""}
                onChange={(e) =>
                  handleRowChange(row.id, "selectedQuantity", e.target.value)
                }
              >
                <option value="">Quantity</option>
                {quantities.map((quantity, index) => (
                  <option key={index} value={quantity}>
                    {quantity}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2} className="custom6-input-with-icon">
              <Form.Select className="form-control custom6-form-select1"
              value={row.selectedExpiryDate || ""}
                onChange={(e) =>
                  handleRowChange(row.id, "selectedExpiryDate", e.target.value)
                }
              >
                <option value="">Expiry Date</option>
                {expiryDates.map((date, index) => (
                  <option key={index} value={date}>
                    {date}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={1} className="custom6-delete-icon-col">
              <img
                src={require("./delete.png")}
                alt="Delete"
                className="custom6-delete-icon"
                onClick={() => removeRow(row.id)}
                style={{ cursor: "pointer" }} // This adds a pointer cursor to indicate it's clickable
              />
            </Col>
          </Row>
        ))}

        {/* Button Section */}
        <Row>
          <Col className="d-flex justify-content-start">
            <Button className="custom6-button" type="button" onClick={addRow}>
              New
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-end mt-4">
            <Button onClick={handleSubmit} className="custom6-button2" type="button">
            Submit            </Button>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Inventory;
