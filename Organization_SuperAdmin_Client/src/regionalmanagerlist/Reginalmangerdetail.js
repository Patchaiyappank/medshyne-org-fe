import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Button, Card, Image, Modal } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import axios from "axios";
import avatar3 from "../assest/defimg.png";
import "./Reginalmangerdetail.css";
import { LuPencilLine } from "react-icons/lu";

const RegionalManagerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get the ID from the URL
  const [rmDetails, setRmDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Initialize accessGranted state from local storage if available
  const [accessGranted, setAccessGranted] = useState(() => {
    const savedAccessState = localStorage.getItem(`accessGranted_${id}`);
    return savedAccessState === "true"; // Convert to boolean
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        lineTension: 0.6,
        cubicInterpolationMode: "monotone",
      },
    ],
  });

  const editRegional = () => {
    navigate(`/addregionalmanager/${id}`, {
      state: {
        mode: "edit",
      },
    });
  };

  const handleNavigate = () => {
    navigate(`/Sales/${id}`);
  };

  const handleNavigateorg = () => {
    navigate("/Onboard_List", { state: { onboarding_id: id } });
  };

  // Consolidated useEffect to handle both fetchRmDetails and fetchChartData
  useEffect(() => {

    fetchRmDetails();
    fetchChartData();
  }, [id]);

  const fetchRmDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/superAdmin_view_r_m_by_id/${id}`
      );
      const data = await response.json();

      console.log("API Response:", data);

      if (Array.isArray(data) && data.length > 0) {
        setRmDetails(data[0]);
      } else if (
        data.Result &&
        Array.isArray(data.Result) &&
        data.Result.length > 0
      ) {
        setRmDetails(data.Result[0]);
      } else {
        console.error("Unexpected API response format:", data);
      }

      if (data.Result && data.Result[0].access_btn === 1) {
        setAccessGranted(true);
        localStorage.setItem(`accessGranted_${id}`, "true");
      } else {
        localStorage.setItem(`accessGranted_${id}`, "false");
      }
    } catch (error) {
      console.error("Error fetching Regional Manager details:", error);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/superAdmin_r_m_onboarding_stats?r_m_id=${id}`
      );
      const data = response.data;

      const labels = data.map((item) => item.month);
      const totals = data.map((item) => item.total);

      setChartData({
        labels: labels,
        datasets: [
          {
            data: totals,
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            lineTension: 0.6,
            cubicInterpolationMode: "monotone",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };


  const handleDelete = () => {
    fetch(`http://localhost:5000/superAdmin_r_m_delete_btn?r_m_id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.Result === "Success") {
          navigate("/regional");
        } else {
          alert("Failed to delete Regional Manager. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      })
      .finally(() => {
        setShowModal(false); 
      });
  };

  const handleGrantAccess = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/superAdmin_r_m_give_access_btn",
        null,
        { params: { r_m_id: id } }
      );

      if (response.data.Result === "Success") {
        setAccessGranted(true);
        localStorage.setItem(`accessGranted_${id}`, "true");
        alert("Access Granted Successfully!");
        fetchRmDetails();
        fetchChartData();
      } else {
        alert("Failed to grant access.");
      }
    } catch (error) {
      console.error("Error granting access:", error);
      alert("Error occurred while granting access.");
    }
  };

  const handleStopAccess = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/superAdmin_r_m_stop_access_btn",
        null,
        { params: { r_m_id: id } }
      );

      if (response.data.Result === "Success") {
        setAccessGranted(false);
        localStorage.setItem(`accessGranted_${id}`, "false");
        alert("Access Stopped Successfully!");
        fetchRmDetails();
    fetchChartData();
      } else {
        alert("Failed to stop access.");
      }
    } catch (error) {
      console.error("Error stopping access:", error);
      alert("Error occurred while stopping access.");
    }
  };

  if (!rmDetails) {
    return <div>Loading...</div>;
  }

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const countryCode = phoneNumber.slice(0, 2);
    const localNumber = phoneNumber.slice(2);
    return `${countryCode}+ ${localNumber}`;
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };



  return (
    <div className="rmmaincontainer">
      <h1 className="mb-4 titles">Regional Manager</h1>
      <hr className="custom-hr" />
      <Row>
        <Col md={12}>
          <Card className="shadow-sm rmcontentcontainer">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={4}>
                  <div className="p-3 titile1">Regional Manager Details</div>
                </Col>
                <Col md={8} className="text-md-end text-center">
                  <div className="buttons">
                    <Button
                      className="editbtn"
                      onClick={() => editRegional(id)}
                    >
                      <LuPencilLine style={{ fontWeight: 'bold', fontSize: '18px', marginRight:'10px' }} />    Edit details
                    </Button>
                    {rmDetails.access_btn === 1 ? (
  <Button
    variant="danger"
    className="accessbtn"
    onClick={handleStopAccess}
  >
    <i className="fas fa-times icons" style={{ color: "red" }}></i>
    Stop Access
  </Button>
) : (
  <Button
    variant="success"
    className="accessbtn"
    onClick={handleGrantAccess}
  >
    <i className="fas fa-check icons"></i>
    Give Access
  </Button>
)}


                    {/* <Button variant="danger" className="delbtn" onClick={deleteRegionalManager}>
                      Delete
                    </Button> */}
                    <Button
                      variant="danger"
                      className="delbtn"
                      onClick={() => setShowModal(true)}
                    >
                      Delete
                    </Button>

                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                      <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Are you sure you want to delete this Regional Manager?
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={() => setShowModal(false)}
                        >
                          No
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                          Yes, Delete
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </Col>
              </Row>
              <hr className="custom-hr1" />
              <div className="container mt-5">
                <Row>
                  <Col
                    md={3}
                    className="image-container-detail text-center"
                    style={{ paddingLeft: "15px", paddingRight: "15px" }}
                  >
                    <div className="profile-image-wrapper-detail">
                      {rmDetails.profile ? (
                        <Image
                          src={rmDetails.profile}
                          className="profile-image-detail"
                          fluid
                        />
                      ) : (
                        <Image
                          src={avatar3}
                          className="profile-image-detail"
                          fluid
                        />
                      )}

                      {/* <Button variant="primary" className="upload-button-detail">
                        Upload
                      </Button> */}
                    </div>
                  </Col>

                  <Col md={9}>
                    <Row>
                      <Col md={4}>
                        <h6 className="rm-1">Name</h6>
                        <p>{rmDetails.r_m_name}</p>
                        <h6 className="rm-1">Gender</h6>
                        <p>{rmDetails.gender}</p>
                        <h6 className="rm-1">Age</h6>
                        <p>{rmDetails.age}</p>
                      </Col>
                      <Col md={4}>
                        <h6 className="rm-1">ID</h6>
                        <p>{rmDetails.r_m_id}</p>
                        <h6 className="rm-1">Qualification</h6>
                        <p>{rmDetails.qualification}</p>
                        <h6 className="rm-1">Blood Group</h6>
                        <p>{rmDetails.blood_group}</p>
                      </Col>
                      <Col md={4}>
                        <h6 className="rm-1">Mobile Number</h6>
                        <p>{formatPhoneNumber(rmDetails.phone_number)}</p>
                        <h6 className="rm-1">RM Code</h6>
                        <p>{rmDetails.RM_CODE}</p>
                        <h6 className="rm-1">E-Mail ID</h6>
                        <p>{rmDetails.e_mail}</p>
                      </Col>
                      <Col md={12}>
                        <h6 className="rm-1">Personal address:</h6>
                        <p>{rmDetails.address}, {rmDetails.state}, {rmDetails.pincode}</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>

              <div>
                <Row className="mt-5">
                  <Col md={4} className="mb-4 mb-md-0">
                    <Card className="rm-6 mb-3 content1">
                      <Card.Body className="card-body-container">
                        <div
                          className="text-container"
                          onClick={() => handleNavigateorg()}
                        >
                          <Card.Title className="rm-5">
                            Onboarded Organizations
                          </Card.Title>
                          <Card.Text className="number">
                            {rmDetails.total_onboarding_organization_count}
                          </Card.Text>
                        </div>
                        <Button
                          className="arrow-button"
                          style={{
                            transform: "scaleY(2)",
                            display: "inline-block",
                            fontWeight: "300",
                            fontSize: "12px",
                          }}
                          onClick={() => handleNavigateorg()}
                        >
                          &gt;
                        </Button>
                      </Card.Body>
                    </Card>
                    <Card className="rm-6 mb-3 content1">
                      <Card.Body className="card-body-container">
                        <div
                          className="text-container"
                          onClick={() => handleNavigate(rmDetails.r_m_id)}
                        >
                          <Card.Title className="rm-5">
                            Sales Executives
                          </Card.Title>
                          <Card.Text className="number">
                            {rmDetails.total_sales_executive_count}
                          </Card.Text>
                        </div>
                        <Button
                          className="arrow-button"
                          style={{
                            transform: "scaleY(2)",
                            display: "inline-block",
                            fontWeight: "300",
                            fontSize: "12px",
                          }}
                          onClick={() => handleNavigate(rmDetails.r_m_id)}
                        >
                          &gt;
                        </Button>
                      </Card.Body>
                    </Card>

                    <Card className="rm-8 content1">
                      <Card.Body>
                        <Card.Title className="rm-5">Assigned Area</Card.Title>
                        <Card.Text
                          className="number"
                          style={{ fontSize: "16px" }}
                        >
                          {rmDetails.assign_areas}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={8}>
                    <Card className="content1">
                      <Card.Body>
                        <Card.Title>Onboarded Organizations</Card.Title>
                        <div style={{ height: "270px" }}>
                          <Line data={chartData} options={options} />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RegionalManagerDashboard;
