import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./healthcare.css";
import Patient from "../assets/card1.png";
import Office from "../assets/card2.png";
import Doctor from "../assets/card3.png";
import arrow from "../assets/arrow.png";

function HealthCare() {
  return (
    <Container fluid className="healthcare-container">
      <Row className="mt-5">
        <Col className="text-left">
          <div className="healthcare-intro-container">
            <h1 className="mb-4 healthcare-server-name">
              We will serve you with
              <br />
              <span className="healthcare-title-highlight">
                healthcare
              </span>{" "}
              services
            </h1>
          </div>
        </Col>
        <Col className="healthcare-intro-right">
          <div className="healthcare-intro-container">
            <p className="healthcare-intro-texts">
              We provide a variety of services that can <br /> make it easier
              for you to fulfill your needs.
            </p>
            <div className="healthcare-learn-containers">
              <button className="healthcare-learns-seemore">
                Learn More
                <span>
                  <img
                    src={arrow}
                    className="healthcare-service-arrow-about"
                    alt="arrow icon"
                  />
                </span>
              </button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Cards Section */}
      <Row className="mt-5 healthcare-Super-cards">
        <Col className="mb-4">
          <div className="card border-0 shadow-sm h-100 healthcare-Main-Cards">
            <div className="card-body healthcare-admin-content">
              <h2 className="card-title healthcare-header-content">
                Health Records <br /> Management
              </h2>
              <p className="card-text healthcare-sub-para">
                Student profiles with personal details, medical history,
                allergies, and vaccinations.
              </p>
              <img
                src={Patient}
                className="card-img-bottom"
                alt="Illustration of health records management"
              />
            </div>
          </div>
        </Col>
        <Col className="mb-4">
          <div className="card border-0 shadow-sm h-100 healthcare-Main-Cards">
            <div className="card-body healthcare-admin-content">
              <h2 className="card-title healthcare-header-content">
                Student Data <br /> Management
              </h2>
              <p className="card-text healthcare-sub-para">
                Ability to update or add student health <br />
                records.
              </p>
              <img
                src={Office}
                className="card-img-bottom healthcare-card-img"
                alt="Illustration of student data management"
              />
            </div>
          </div>
        </Col>
        <Col className="mb-4">
          <div className="card border-0 shadow-sm h-100 healthcare-Main-Cards">
            <div className="card-body healthcare-admin-content">
              <h2 className="card-title healthcare-header-content">
                Appointment and Consultation
              </h2>
              <p className="card-text healthcare-sub-para">
                Appointment scheduling and consultations with healthcare
                providers.
              </p>
              <img
                src={Doctor}
                className="card-img-bottom"
                alt="Illustration of appointment and consultation"
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default HealthCare;
