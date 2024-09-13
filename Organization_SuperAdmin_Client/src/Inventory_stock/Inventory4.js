import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import "./Inventory4.css"; // If the correct file is Inventory4.css
import { useNavigate } from "react-router-dom"; // Ensure react-router-dom is installed and imported correctly

const Inventory = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([
    {
      id: 1,
      selectedMedicine: "",
      selectedHsnCode: "",
      selectedQuantity: "",
      selectedExpiryDate: "",
    },
  ]);

  const [medicines, setMedicines] = useState([]);
  const [hsnCodes, setHsnCodes] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [expiryDates, setExpiryDates] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [selectedHsnCode, setSelectedHsnCode] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("");
  const [selectedExpiryDate, setSelectedExpiryDate] = useState("");
  const [medicine, setMedicine] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [data, setData] = useState({}); // Holds fetched data from the API

  const handleDeleteRecords = async () => {
    // Collect all records to delete with unique values for each row
    const recordsToDelete = rows.map((row) => ({
      medicine: row.selectedMedicine,
      hsn_code: row.selectedHsnCode,
      quantity: row.selectedQuantity,
      expiry_date: row.selectedExpiryDate,
    }));

    try {
      const response = await axios.delete(
        "http://localhost:5000/superAdmin_own_deleteMedicine",
        {
          data: { records: recordsToDelete },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 207) {
        console.log(response.data);

        if (response.data.message === "All records deleted successfully") {
          alert("Records deleted successfully");
          setRows([{ id: Date.now() }]);
          setSelectedMedicine("");
          setSelectedHsnCode("");
          setSelectedQuantity("");
          setSelectedExpiryDate("");

          navigate("/inventory");
        }

        if (response.data.errors.length > 0) {
          alert(response.data.message);
          console.error("Some records were not deleted:", response.data.errors);
        } else {
          // Reset the form and rows
          setRows([{ id: Date.now() }]);
          setSelectedMedicine("");
          setSelectedHsnCode("");
          setSelectedQuantity("");
          setSelectedExpiryDate("");
        }
      }
    } catch (error) {
      console.error("Error deleting records:", error);
    }
  };

  // Fetch data from APIs
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/superAdmin_own_medicines_dropDown"
        );
        if (response.data.Result === "Success") {
          setMedicines(response.data.medicine);
        } else {
          console.error("Failed to fetch medicines:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines(); // Fetch medicines on component mount
  }, []);

  const fetchHsnCodes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/superAdmin_own_hsn_dropDown"
      ); // Adjust URL if necessary
      if (response.data.Result === "Success") {
        setHsnCodes(response.data.hsn_codes); // Make sure response.data.hsn_codes exists and is an array
      } else {
        console.error("Failed to fetch HSN codes:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching HSN codes:", err);
    }
  };

  useEffect(() => {
    fetchHsnCodes(); // Call the function within useEffect
  }, []); // Empty dependency array to run only once

  const fetchexpirydate = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/superAdmin_own_expiry_date_dropDown"
      ); // Adjust URL if necessary
      if (response.data.Result === "Success") {
        setExpiryDates(response.data.expiry_dates); // Make sure response.data.hsn_codes exists and is an array
      } else {
        console.error("Failed to fetch expiry_dates:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching expiry_dates", err);
    }
  };

  useEffect(() => {
    fetchexpirydate(); // Call the function within useEffect
  }, []); // Empty dependency array to run only once

  const fetchquantity = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/superAdmin_own_quantity_dropDown"
      ); // Adjust URL if necessary
      if (response.data.Result === "Success") {
        setQuantities(response.data.quantities); // Make sure response.data.hsn_codes exists and is an array
      } else {
        console.error("Failed to fetch quantities:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching quantities:", err);
    }
  };

  useEffect(() => {
    fetchquantity(); 
  }, []); 

  const fetchData = async () => {
    try {
      // API request using axios
      const response = await axios.get("/superAdmin_newBilling_dropDowns", {
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

  const handleRowChange = (rowId, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    );
    fetchFilteredOptions(field, value, rowId);
  };

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

  const handleBillingTypeChange = (e) => {
    const billingType = e.target.value;
    if (billingType === "Dispose Expired To Organization") {
      navigate("/stock1");
    } else if (billingType === "Add Stock") {
      navigate("/AddStock");
    }
  };

  return (
    <Container fluid className="custom3-inventory-container mt-3">
      {/* Header Section */}
      <Row className="mb-3">
        <Col>
          <h2 className="custom3-inventory-title">Stock Update</h2>
          <hr className="custom3-divider" />
        </Col>
      </Row>

      {/* Details Section */}
      <Row className="custom3-details-container mb-4">
        <Col xs={12}>
          <p className="custom3-inventory-subtitle">Add a Stock Update</p>
          <hr className="custom3-divider1" />
        </Col>

        {/* Form Section */}
        <Row>
          <Col>
            <Form className="p-0">
              <Row className="mb-3">
                <Col lg={4} md={4} sm={12} className="mb-2">
                  <Form.Group controlId="billingType">
                    <Form.Label className="custom3-form-label">
                      Select Billing Type
                    </Form.Label>
                    <div className="custom3-input-with-icon">
                      <Form.Select
                        className="form-control custom2-form-select"
                        onChange={handleBillingTypeChange}
                      >
                        <option>Dispose Expired</option>
                        <option>Dispose Expired To Organization</option>
                        <option>Add Stock</option>
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
            <h4 className="custom3-bill-details-title">Bill details</h4>
            <Table bordered hover className="custom3-table">
              <thead className="custom3-table-header">
                <tr className="custom3-table-row">
                  <th className="custom3-light-font">Medicine Name</th>
                  <th className="custom3-light-font">HSN code</th>
                  <th className="custom3-light-font">Quantity</th>
                  <th className="custom3-light-font">Expiry date</th>
                </tr>
              </thead>
              <tbody>{/* Add more rows as needed */}</tbody>
            </Table>
          </Col>
        </Row>

        {/* Render Rows Dynamically */}
        {rows.map((row) => (
          <Row className="mb-3" key={row.id}>
            <Col md={3} sm={3} className="custom3-input-with-icon">
              <Form.Select
                className="form-control custom3-form-select1"
                value={row.selectedMedicine || ""}
                onChange={(e) =>
                  handleRowChange(row.id, "selectedMedicine", e.target.value)
                }
              >
                <option value="">Select Medicine</option>
                {medicines.map((medicine, index) => (
                  <option
                    key={index}
                    value={medicine}
                    onChange={(e) => setSelectedMedicine(e.target.value)}
                  >
                    {medicine}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3} sm={3} className="custom3-input-with-icon">
              <Form.Select
                className="form-control custom3-form-select1"
                value={row.selectedHsnCode || ""}
                onChange={(e) =>
                  handleRowChange(row.id, "selectedHsnCode", e.target.value)
                }
              >
                <option value="">Select HSN Code</option>
                {hsnCodes.map((hsnCode, index) => (
                  <option key={index} value={hsnCode}>
                    {hsnCode}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={3} sm={3} className="custom3-input-with-icon">
              <Form.Select
                className="form-control custom3-form-select1"
                value={row.selectedQuantity || ""}
                onChange={(e) =>
                  handleRowChange(row.id, "selectedQuantity", e.target.value)
                }
              >
                <option value="">Select Quantity</option>
                {quantities.map((quantity, index) => (
                  <option key={index} value={quantity}>
                    {quantity}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2} sm={2} className="custom3-input-with-icon">
              <Form.Select
                className="form-control custom3-form-select1"
                value={row.selectedExpiryDate || ""}
                onChange={(e) =>
                  handleRowChange(row.id, "selectedExpiryDate", e.target.value)
                }
              >
                <option value="">Expiry Date</option>
                {expiryDates.map((expiryDate, index) => (
                  <option key={index} value={expiryDate}>
                    {expiryDate}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={1} sm={1} className="custom3-delete-icon-col">
              <img
                src={require("./delete.png")}
                alt="Delete"
                className="custom3-delete-icon"
                onClick={() => removeRow(row.id)}
                style={{ cursor: "pointer" }} // This adds a pointer cursor to indicate it's clickable
              />
            </Col>
          </Row>
        ))}

        {/* Button Section */}
        <Row>
          <Col className="d-flex justify-content-start">
            <Button className="custom3-button" type="button" onClick={addRow}>
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
            </Button>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Inventory;
