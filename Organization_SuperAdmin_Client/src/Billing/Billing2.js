import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import "./Billing2.css";
import axios from 'axios';
import { useLocation,useNavigate } from 'react-router-dom';

const Inventory = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [cashier, setCashier] = useState('');
  const [receiver, setReceiver] = useState('');
  const [error, setError] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [invoiceId, setInvoiceId] = useState("");
  const [organizationNames, setOrganizationNames] = useState([]);
  const [organizationIDs, setOrganizationIDs] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
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
  const navigate = useNavigate();
  const [data, setData] = useState({}); // Holds fetched data from the API
  const [rows, setRows] = useState([
    {
      id: 1,
      selectedMedicine: "",
      selectedHsnCode: "",
      selectedQuantity: "",
      selectedExpiryDate: "",
    },
  ]);

  useEffect(() => {
    fetchInvoiceId();
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

  // const fetchInvoiceId = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:5000/superAdmin_create-invoice_newBilling"
  //     );
  //     const data = await response.json();
  //     setInvoiceId(data.invoice_number);
  //   } catch (error) {
  //     console.error("Error fetching invoice ID:", error);
  //   }
  // };

  const fetchInvoiceId = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/superAdmin_create-invoice_newBilling"
      );
      const data = await response.json();
  
      // Update orderData with the fetched invoice number
      setOrderData((prevData) => ({
        ...prevData,
        invoice_number: data.invoice_number,
      }));
    } catch (error) {
      console.error("Error fetching invoice ID:", error);
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
      setRegionalManager(data.r_m_name);
      setR_m_id(data.r_m_id);
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
      setRegionalManager(data.r_m_name);
      setR_m_id(data.r_m_id);
    } catch (error) {
      console.error("Failed to fetch organization name", error);
    }
  };

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

  // const fetchData = async () => {
  //   try {
  //     // API request using axios
  //     const response = await fetch.get("http://localhost:5000/superAdmin_newBilling_dropDowns", {
  //       params: {
  //         medicine,
  //         hsn_code: hsnCode,
  //         quantity,
  //         expiry_date: expiryDate,
  //       },
  //     });

  //     setData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

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

  // const handleRowChange = (rowId, field, value) => {
  //   setRows((prevRows) =>
  //     prevRows.map((row) =>
  //       row.id === rowId ? { ...row, [field]: value } : row
  //     )
  //   );
  //   fetchFilteredOptions(field, value, rowId);
  // };

  // const fetchFilteredOptions = async (field, value, rowId) => {
  //   try {
  //     const params = new URLSearchParams();
  //     if (field === "selectedMedicine") {
  //       params.append("medicine", value);
  //     } else if (field === "selectedHsnCode") {
  //       params.append("hsn_code", value);
  //     } else if (field === "selectedQuantity") {
  //       params.append("quantity", value);
  //     } else if (field === "selectedExpiryDate") {
  //       params.append("expiry_date", value);
  //     }

  //     const response = await fetch(
  //       `http://localhost:5000/superAdmin_newBilling_dropDowns?${params.toString()}`
  //     );
  //     const data = await response.json();

  //     if (data.Result === "Success") {
  //       setRows((prevRows) =>
  //         prevRows.map((row) => {
  //           if (row.id === rowId) {
  //             return {
  //               ...row,
  //               selectedMedicine: data.medicine || row.selectedMedicine,
  //               selectedHsnCode: data.hsn_code || row.selectedHsnCode,
  //               selectedQuantity: data.quantity || row.selectedQuantity,
  //               selectedExpiryDate: data.expiry_date || row.selectedExpiryDate,
  //             };
  //           }
  //           return row;
  //         })
  //       );
  //     } else {
  //       console.error("Failed to fetch filtered options:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching filtered options:", error);
  //   }
  // };

  // const handleOrganizationNameChange = (event) => {
  //   const selectedName = event.target.value;
  //   setSelectedOrganization(selectedName);
  //   if (selectedName) {
  //     fetchOrganizationIdByName(selectedName);
  //   }
  // };

const handleOrganizationNameChange = (e) => {
  const organizationName = e.target.value;
  setSelectedOrganization(organizationName);

if (organizationName) {
      fetchOrganizationIdByName(organizationName);
    }
  // Update orderData with the selected organization
  setOrderData((prevData) => ({
    ...prevData,
    organization_name: organizationName,
  }));
};


  // const handleOrganizationIDChange = (event) => {
  //   const selectedID = event.target.value;
  //   setSelectedOrganizationId(selectedID);
  //   if (selectedID) {
  //     fetchOrganizationNameById(selectedID);
  //   }
  // };

const handleOrganizationIDChange = (e) => {
  const organizationID = e.target.value;
  setSelectedOrganizationId(organizationID);

if (organizationID) {
      fetchOrganizationNameById(organizationID);
    }
  // Update orderData with the selected organization
  setOrderData((prevData) => ({
    ...prevData,
     organization_id: organizationID,
  }));
};




  const addRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        selectedMedicine: "",
        selectedHsnCode: "",
        selectedQuantity: "",
        selectedExpiryDate: "",
      },
    ]);
  };

  const removeRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };




  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  
  //   // Validate input data
  //   if (!invoiceNumber || !cashier || !organizationName || !receiver) {
  //     setError('All fields are required.');
  //     return;
  //   }
  
  //   if (!Array.isArray(medicines) || medicines.length === 0) {
  //     setError('At least one medicine must be added.');
  //     return;
  //   }
  
  //   // Optional: Validate medicine data
  //   const invalidMedicines = medicines.filter(med => !med.medicine_name || !med.expiry_date || !med.hsn_code || !med.quantity || med.quantity <= 0);
  //   if (invalidMedicines.length > 0) {
  //     setError('Each medicine must have a name, expiry date, HSN code, and a positive quantity.');
  //     return;
  //   }
  
  //   // Clear error if validation passes
  //   setError('');
  
  //   const data = {
  //     invoice_number: invoiceNumber,
  //     medicines: medicines,
  //     cashier,
  //     organization_name: organizationName,
  //     receiver,
  //   };
  
  //   try {
  //     const response = await fetch('http://localhost:5000/superAdmin_newBill_sumbit_btn', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(rows),
  //     });
  
  //     if (response.ok) {
  //       const result = await response.text();
  //       alert(result);
  //       // Handle success (e.g., clear form or redirect)
  //     } else {
  //       const errorText = await response.text();
  //       setError(errorText);
  //     }
  //   } catch (err) {
  //     console.error('Error:', err);
  //     setError('An unexpected error occurred.');
  //   }
  // };
  

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  
  //   // Validate input data
  //   if (!invoiceNumber || !cashier || !organizationName || !receiver) {
  //     setError('All fields are required.');
  //     return;
  //   }
  
  //   if (!Array.isArray(medicines) || medicines.length === 0) {
  //     setError('At least one medicine must be added.');
  //     return;
  //   }
  
  //   // Validate medicine data
  //   const invalidMedicines = medicines.filter(
  //     (med) =>
  //       !med.medicine_name || !med.expiry_date || !med.hsn_code || !med.quantity || med.quantity <= 0
  //   );
  //   if (invalidMedicines.length > 0) {
  //     setError('Each medicine must have a name, expiry date, HSN code, and a positive quantity.');
  //     return;
  //   }
  
  //   // Clear error if validation passes
  //   setError('');
  
  //   const data = {
  //     invoice_number: invoiceNumber,
  //     medicines: medicines,
  //     cashier,
  //     organization_name: organizationName,
  //     receiver,
  //   };
  
  //   try {
  //     const response = await fetch('http://localhost:5000/superAdmin_newBill_sumbit_btn', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data), // Fix here by sending 'data' instead of 'rows'
  //     });
  
  //     if (response.ok) {
  //       const result = await response.text();
  //       alert(result);
  //       // Handle success (e.g., clear form or redirect)
  //     } else {
  //       const errorText = await response.text();
  //       setError(errorText);
  //     }
  //   } catch (err) {
  //     console.error('Error:', err);
  //     setError('An unexpected error occurred.');
  //   }
  // }; 
    const [orderData, setOrderData] = useState({
      invoice_number: invoiceId,
      cashier:'raj',
      organization_name: '',
      organization_id: '',
      receiver:'',
      medicines: '', // Add medicine data here
    });



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


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
      // const response = await axios.post('http://localhost:5000/superAdmin_newBill_sumbit_btn', orderData);
      // setResponseMessage(`Order submitted successfully. Invoice Number: ${response.data.invoice_number}`);
      // alert('sucessfully added')
      // navigate('/inventory');
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(
            'http://localhost:5000/superAdmin_newBill_sumbit_btn',
            orderData
         
          );
             alert('Successfully added')
            navigate('/inventory')
          // setResponseMessage(
          //   `Order submitted successfully. Invoice Number: ${response.data.invoice_number}`
          // );
      
          // Alert and navigation after the response is fully processed
         // Ensure you are using `useNavigate` from 'react-router-dom'
        } catch (err) {
          setError(err.response?.data?.message || 'Error submitting order');
        }
      };
      
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Error submitting order');
  //   }
  // };




  // const handleSubmit = async (event) => {
  //   event.preventDefault();
    
  //   // Validate input data
  //   if (!invoiceNumber || !cashier || !organizationName || !receiver) {
  //     setError('All fields are required.');
  //     return;
  //   }
  
  //   // Extract medicines data from rows
  //   // const medicinesData = rows.map(row => ({
  //   //   medicine_name: row.selectedMedicine,
  //   //   hsn_code: row.selectedHsnCode,
  //   //   quantity: row.selectedQuantity,
  //   //   expiry_date: row.selectedExpiryDate
  //   // }));
  
  //   // Validate medicines
  //   const invalidMedicines = medicinesData.filter(
  //     (med) =>
  //       !med.medicine_name || !med.expiry_date || !med.hsn_code || !med.quantity || med.quantity <= 0
  //   );
  //   if (invalidMedicines.length > 0) {
  //     setError('Each medicine must have a name, expiry date, HSN code, and a positive quantity.');
  //     return;
  //   }
  
  //   // Prepare data for submission
 
  //   try {
  //     const response = await axios.post('http://localhost:5000/superAdmin_newBill_sumbit_btn',orderData);
       
  //     console.log('Response status:', response.status); // Log status code
  
  //     if (response.ok) {
  //       const result = await response.text();
  //       console.log('Success:', result); // Log success response
  //       alert(result);
  //     } else {
  //       const errorText = await response.text();
  //       console.log('Error response:', errorText); // Log error response
  //       setError(errorText);
  //     }
  //   } catch (err) {
  //     console.error('Error:', err);
  //     setError('An unexpected error occurred.');
  //   }
  // };
  
  const handleSalesExecutiveChange = (e) => {
    setOrderData({
      ...orderData,
      receiver: e.target.value, // Update receiver in orderData
    });
  };

  const handleInvoiceChange = (e) => {
    setOrderData({
      ...orderData,
      invoice_number:invoiceId, // Update receiver in orderData
    });
  };


  return (
    <Container fluid className="custom7-inventory-container mt-3">
      <Row className="mb-3">
        <Col>
          <h2 className="custom7-inventory-title">Stock Update</h2>
          <hr className="custom7-divider" />
        </Col>
      </Row>

      <Row className="custom7-details-container mb-4">
        <Col xs={12}>
          <p className="custom7-inventory-subtitle">Add a Stock Update</p>
          <hr className="custom7-divider1" />
        </Col>

        <Row>
          <Col>
            <Form className="p-0">
              <Row className="mb-3">
                <Col lg={4} md={4} sm={12} className="mb-2">
                  <Form.Group controlId="billingType">
                    <Form.Label className="custom7-form-label">
                      Invoice ID
                    </Form.Label>
                    <div className="custom7-input-with-icon">
                      <Form.Control
                        type="text"
                        placeholder="#9058489"
                        className="form-control custom7-form-select"
                        value={orderData.invoice_number} 
                        // onChange={handleInvoiceChange}
                        readOnly
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg={4} md={4} sm={12} className="mb-2">
                  <Form.Group controlId="organizationName">
                    <Form.Label className="custom7-form-label">
                      Organization Name
                    </Form.Label>
                    <div className="custom7-input-with-icon">
                      <Form.Select
                        className="form-control custom7-form-select"
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
                    <Form.Label className="custom7-form-label">
                      Organization ID
                    </Form.Label>
                    <div className="custom7-input-with-icon">
                      <Form.Select
                        className="form-control custom7-form-select"
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
                  <Form.Group controlId="regionalManager">
                    <Form.Label className="custom7-form-label">
                      Regional Manager
                    </Form.Label>
                    <div className="custom7-input-with-icon">
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
                  <Form.Group controlId="salesExclusiveName">
                    <Form.Label className="custom7-form-label">
                      Sales Exclusive Name
                    </Form.Label>
                    <div className="custom7-input-with-icon">
                      <Form.Select className="form-control custom7-form-select"
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
            <h4 className="custom7-bill-details-title">Bill details</h4>
            <Table bordered hover className="custom7-table">
              <thead className="custom7-table-header">
                <tr className="custom7 table-row">
                  <th className="custom7-light-font">Medicine Name</th>
                  <th className="custom7-light-font">HSN code</th>
                  <th className="custom7-light-font">Quantity</th>
                  <th className="custom7-light-font">Expiry date</th>
                </tr>
              </thead>
              <tbody>{/* Add more rows as needed */}</tbody>
            </Table>
          </Col>
        </Row>

        {rows.map((row) => (
          <Row className="mb-3" key={row.id}>
            <Col  md={3} sm={3} className="custom7-input-with-icon">
              <Form.Select
                className="form-control custom7-form-select1"
                value={row.selectedMedicine || ""}
                onChange={(e) =>
                  handleRowChange(row.id, "selectedMedicine", e.target.value)
                }
              >
                <option value="">Medicine Name</option>
                {medicines.map((medicine, index) => (
                  <option key={index} value={medicine}>
                    {medicine}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col  md={3} sm={3} className="custom7-input-with-icon">
              <Form.Select
                className="form-control custom7-form-select1"
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

            <Col  md={3} sm={3} className="custom7-input-with-icon">
              <Form.Select
                className="form-control custom7-form-select1"
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

            <Col  md={2} sm={2} className="custom7-input-with-icon">
              <Form.Select
                className="form-control custom7-form-select1"
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

            <Col md={1} sm={1} className="custom7-delete-icon-col">
              <img
                src={require("./delete.png")}
                alt="Delete"
                className="custom7-delete-icon"
                onClick={() => removeRow(row.id)}
                style={{ cursor: "pointer" }} // This adds a pointer cursor to indicate it's clickable
              />
            </Col>
          </Row>
        ))}

        <Row>
          <Col className="d-flex justify-content-start">
            <Button className="custom7-button" type="button" onClick={addRow}>
              New
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-end mt-4">
            <Button onClick={handleSubmit} className="custom7-button2" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Inventory;
