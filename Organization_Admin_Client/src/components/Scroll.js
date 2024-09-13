import React, { useRef, useEffect, useState } from "react";

import { Link } from "react-router-dom";
import "./Scroll.css";
import poke from '../photos/medshyne.png';
import NavBar from './NavBar.js';
import Aboutus from '../pages/Aboutus.js';
import Blog from '../pages/Blog.js';
import Services from '../pages/Services.js';
import Contactus from '../pages/ContactUs.js';

const Scroll = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageRef = useRef(null);

  const [scrollCounter, setScrollCounter] = useState(0);
  const SCROLL_THRESHOLD = 19;

  useEffect(() => {
    const handleScroll = (event) => {
      const deltaY = event.deltaY;

      setScrollCounter(prevCounter => {
        const newCounter = prevCounter + Math.sign(deltaY);

        if (Math.abs(newCounter) >= SCROLL_THRESHOLD) {
          if (newCounter > 0) {
            setCurrentPage(prevPage => Math.min(prevPage + 1, 5));
          } else {
            setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
          }
          return 0; // Reset counter after page change
        }

        return newCounter;
      });
    };

    window.addEventListener('wheel', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  // useEffect(() => {
  //   const handleScroll = (event) => {
  //     const deltaY = event.deltaY;
  //     // Increasing current page if scrolling down, decreasing if scrolling up
  //     if (deltaY > 0) {
  //       setCurrentPage(prevPage => Math.min(prevPage + 1, 5));
  //     } else if (deltaY < 0) {
  //       setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  //     }
  //   };


  //   window.addEventListener("wheel", handleScroll);

  //   return () => {
  //     window.removeEventListener("wheel", handleScroll);
  //   };
  // }, []);


  return (
   
    <div>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <div  ref={pageRef}>
     
        <div>
          {currentPage === 1 && <NavBar />}
          {currentPage === 2 && <Aboutus />}
          {currentPage === 3 && <Services />}
          {currentPage === 4 && <Blog />}
          {currentPage === 5 && <Contactus />}
        </div>
      </div>
    </div>
   
  );
};

const Navigation = ({ currentPage, onPageChange }) => {
  return (
    <div className="nav-clickbar">
      <div className="nav-navigation">
        <div>
          <img src={poke} alt="Register" className="navli"></img>
        </div>
        <div className="navlist">
          <button onClick={() => onPageChange(1)}  id="navbar-button" className={currentPage === 1 ? 'active' : ''}>Home</button>
          <button onClick={() => onPageChange(2)} id="navbar-button1" className={currentPage === 2 ? 'active' : ''}>About Us</button>
          <button onClick={() => onPageChange(3)} id="navbar-button2" className={currentPage === 3 ? 'active' : ''}>Services</button>
          <button onClick={() => onPageChange(4)} id="navbar-button3" className={currentPage === 4 ? 'active' : ''}>Blog</button>
          <button onClick={() => onPageChange(5)} id="navbar-button4" className={currentPage === 5 ? 'active' : ''}>Contact Us</button>
          <span className="navlii"></span> 
          {/* Register and Login buttons navigate only when clicked */}
          <Link to="/signup">
            <button id="nav-button4" className="navli5"> Register</button>
          </Link>
          <Link to="/login">
          <button onClick={() => onPageChange(6)} id="nav-button5" className="navli6">Log In</button>
          </Link>
        </div>
        

      </div>
      {/* <hr></hr>  */}
    </div>
  );
};

export default Scroll;
