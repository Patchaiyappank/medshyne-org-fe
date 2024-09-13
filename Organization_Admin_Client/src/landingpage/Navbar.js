import React, { useState, useEffect } from "react";
import "./Navbar.css";
import image2 from "../photos/LandImage(2).png";
import image3 from "../photos/LandImage(3).jpg";
import image4 from "../photos/LandImage(4).jpg";
import image1 from "../photos/LandImage(1).jpg";
import leftArrow from "../photos/LeftArrow.png";
import rightArrow from "../photos/RightArrow.png";
import { motion } from "framer-motion";
import arrow from "../photos/MakeApp.png";

export default function NavBar(props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [image1, image2, image3, image4]; // Array of image URLs

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 9000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  const goToNextImage = () => {
    // Set the next image index immediately
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevImage = () => {
    // Set the previous image index immediately
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <motion.div
      className="slideshow-container"
      initial={{ opacity: 0, y: "-100vh" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
    >
      <div className="slide">
        <img
          src={images[currentImageIndex]}
          alt={`Slide ${currentImageIndex}`}
        />
        {currentImageIndex === 0 && (
          <div className="image-content">
            {/* <h1 className='carouseltexthead'>Describe what your company does <br /> in a few words</h1>
                                    <p className='carouseltextpara'>Describe exactly what the company does and what a customer can expect when working with the company. Avoid using verbose words or phrases.</p>
                                     <Button className='firstbutton'>Book a consultation</Button>  */}
          </div>
        )}
        {currentImageIndex === 1 && (
          <div className="land-container">
            <img src={arrow} className="land-seemore"></img>
          </div>
        )}
        {currentImageIndex === 2 && (
          <div className="image-content">
            {/* <h1 className='carouseltexthead'>Describe what your company does <br /> in a few words</h1>
                                    <p className='carouseltextpara'>Describe exactly what the company does and what a customer can expect when working with the company. Avoid using verbose words or phrases.</p>
                                     <Button className='firstbutton'>Book a consultation</Button>  */}
          </div>
        )}
        {currentImageIndex === 3 && (
          <div className="image-content">
            {/* <h1 className='carouseltexthead'>Overview of all scheduled <br /> consultations and health <br /> check-ups</h1>
                                    <p className='carouseltextpara'>Describe exactly what the company does and what a customer can expect when working with the company. Avoid using verbose words or phrases.</p>
                                    <Button className='firstbutton'>Book a consultation</Button>  */}
          </div>
        )}
      </div>
      <br />

      <div className="thumbnails-container">
        <div className="thumbnails">
          <img
            src={leftArrow}
            className="thumbnail-nav"
            onClick={goToPrevImage}
          ></img>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index}`}
              className={
                index === currentImageIndex ? "thumbnail active" : "thumbnail"
              }
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
          <img
            src={rightArrow}
            className="thumbnail-nav1"
            onClick={goToPrevImage}
          ></img>
        </div>

        
      </div>
    </motion.div>
  );
}
