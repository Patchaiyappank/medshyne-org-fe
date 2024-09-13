import React from "react";
import { useNavigate } from "react-router-dom";
import useScrollSpy from "./useScrollSpy"; // Import custom hook
import "./scroll.css";
import poke from "../photos/medshyne.png";
import NavBar from "../landingpage/Navbar";
import AboutUs from "../landingpage/Aboutus";
import HealthCare from "../landingpage/healthcare";
import OurPlan from "./Payement/Buyplan";
import Testimonials from "../landingpage/testimonials";
import Footer from "../landingpage/footer";
import ContactUsPage from "../landingpage/ContactUsPage";

function Scroll() {
  const sectionIds = ["navbar", "aboutus", "healthcare", "ourplan", "testimonials", "contactuspage"];
  const activeSection = useScrollSpy(sectionIds);
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="nav-clickbar">
      <div className="nav-navigation">
        <img src={poke} alt="Register" className="navli" />
        <nav className="navlist">
          <ul>
            <li className={activeSection === "navbar" ? "active" : ""}>
              <a href="#navbar">Home</a>
            </li>
            <li className={activeSection === "aboutus" ? "active" : ""}>
              <a href="#aboutus">About Us</a>
            </li>
            <li className={activeSection === "healthcare" ? "active" : ""}>
              <a href="#healthcare">HealthCare</a>
            </li>
            <li className={activeSection === "ourplan" ? "active" : ""}>
              <a href="#ourplan">OurPlan</a>
            </li>
            <li className={activeSection === "testimonials" ? "active" : ""}>
              <a href="#testimonials">Testimonials</a>
            </li>
            <li className={activeSection === "contactuspage" ? "active" : ""}>
              <a href="#contactuspage">Contact Us</a>
            </li>
            <li className="navlii"></li>
            <li>
              <button
                id="nav-button4"
                className="navli5"
                onClick={handleSignUpClick}
              >
                Register
              </button>
            </li>
            <li>
              <button
                id="nav-button4"
                className="navli5"
                onClick={handleLoginClick}
              >
                LogIn
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div id="navbar">
        <NavBar />
      </div>
      <div id="aboutus">
        <AboutUs />
      </div>
      <div id="healthcare">
        <HealthCare />
      </div>
      <div id="ourplan">
        <OurPlan />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="contactuspage">
        <ContactUsPage />
      </div>
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
}

export default Scroll;
