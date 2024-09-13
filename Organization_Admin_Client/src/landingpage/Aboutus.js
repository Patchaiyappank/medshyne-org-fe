import React from "react";
import "./Aboutus.css";
import about from "../photos/Aboutus.png";
import { motion } from "framer-motion";
import arrow from "../assets/arrow.png";

const Aboutus = () => {
  return (
    <div className="about-maincontainer">
      <motion.div
        className="about-paracontainer"
        initial={{ opacity: 0, x: "-100vw" }} // Start from top (-100vh) and fully transparent
        animate={{ opacity: 1, x: 0 }} // Move to the center (0) and become fully opaque
        exit={{ opacity: 2 }} // Fade out when exiting
        transition={{ duration: 2 }}
      >
        <div className="about-top">
          <h1 className="about-head">
            Hi there, We're <span className="about-spantext">Medshyne</span>
          </h1>
          <p className="about-para">
            Medshyne is a comprehensive healthcare app designed for the health
            and wellness needs of school students. This app aims to provide a
            centralized platform for students, parents, and school authorities
            to manage and monitor various aspects of students' health, ensuring
            a safe and conducive learning environment. It's designed to connect
            clinicians with school students online during school hours. This app
            aims to streamline healthcare services within the school
            environment, providing timely medical interventions, virtual
            consultations, and health monitoring for students.
          </p>

          <p className="about-para">
            Resolving the issue of students becoming sick at school is essential
            to preserving a safe and supportive learning environment. schools
            can create a healthier environment that{" "}
          </p>
        </div>
        <div className="about-container">
          <button className="about-seemore">
            Read More
            <span>
              <img src={arrow} className="service-arrow-about"></img>
            </span>
          </button>
        </div>
      </motion.div>
      <motion.div
        className="about-imagecontainer"
        initial={{ opacity: 0, x: "100vw" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 2 }}
        transition={{ duration: 2 }}
      >
        <img src={about} className="aboutimage"></img>
      </motion.div>
    </div>
  );
};

export default Aboutus;
