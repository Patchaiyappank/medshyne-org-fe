import React, { useState } from 'react';
import { Container, Image, Carousel } from 'react-bootstrap';
import './testimonials.css';

import profile from '../assets/Ellipse1.png';
import profile1 from '../assets/Ellipse2.png';
import profile2 from '../assets/Ellipse3.png';

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  return (
    <section className="testimonials">
      <Container>
        <h2 className="text-center mb-5 testimonials-name">Testimonials</h2>
        <Carousel
          indicators={false}
          interval={3000}
          className="testimonials-carousel"
          activeIndex={activeIndex}
          onSelect={handleSelect}
        >
          {/* Carousel Item 1 */}
          <Carousel.Item>
            <div className="testimonial-row">
              <div className="testimonial-card">
                <p className="text-muted mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <div className="d-flex">
                  <Image src={profile} roundedCircle className="mr-3" width={60} height={60} />
                  <div className="founddiv">
                    <h5 className="mb-0">Courtney Henry</h5>
                    <p className="text-muted founder">Founder</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <p className="text-muted mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <div className="d-flex">
                  <Image src={profile1} roundedCircle className="mr-3" width={60} height={60} />
                  <div className="founddiv">
                    <h5 className="mb-0">Jenny Wilson</h5>
                    <p className="text-muted founder">Founder</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <p className="text-muted mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <div className="d-flex">
                  <Image src={profile2} roundedCircle className="mr-3" width={60} height={60} />
                  <div className="founddiv">
                    <h5 className="mb-0">Cameron Williamson</h5>
                    <p className="text-muted founder">Founder</p>
                  </div>
                </div>
              </div>
            </div>
          </Carousel.Item>

          {/* Carousel Item 2 */}
          <Carousel.Item>
            <div className="testimonial-row">
              <div className="testimonial-card">
                <p className="text-muted mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <div className="d-flex">
                  <Image src={profile} roundedCircle className="mr-3" width={60} height={60} />
                  <div className="founddiv">
                    <h5 className="mb-0">Courtney Henry</h5>
                    <p className="text-muted founder">Founder</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <p className="text-muted mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <div className="d-flex">
                  <Image src={profile1} roundedCircle className="mr-3" width={60} height={60} />
                  <div className="founddiv">
                    <h5 className="mb-0">Jenny Wilson</h5>
                    <p className="text-muted founder">Founder</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <p className="text-muted mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <div className="d-flex">
                  <Image src={profile2} roundedCircle className="mr-3" width={60} height={60} />
                  <div className="founddiv">
                    <h5 className="mb-0">Cameron Williamson</h5>
                    <p className="text-muted founder">Founder</p>
                  </div>
                </div>
              </div>
            </div>
          </Carousel.Item>

          {/* Carousel Item 3 */}
          <Carousel.Item>
            <div className="testimonial-row">
              <div className="testimonial-card">
                <p className="text-muted mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <div className="d-flex">
                  <Image src={profile} roundedCircle className="mr-3" width={60} height={60} />
                  <div className="founddiv">
                    <h5 className="mb-0">Courtney Henry</h5>
                    <p className="text-muted founder">Founder</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <p className="text-muted mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <div className="d-flex">
                  <Image src={profile1} roundedCircle className="mr-3" width={60} height={60} />
                  <div className="founddiv">
                    <h5 className="mb-0">Jenny Wilson</h5>
                    <p className="text-muted founder">Founder</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <p className="text-muted mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <div className="d-flex">
                  <Image src={profile2} roundedCircle className="mr-3" width={60} height={60} />
                  <div className="founddiv">
                    <h5 className="mb-0">Cameron Williamson</h5>
                    <p className="text-muted founder">Founder</p>
                  </div>
                </div>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>

        <div className="carousel-controls text-center mt-4">
          {[0, 1, 2].map((index) => (
            <label key={index} className={`carousel-control ${activeIndex === index ? 'active' : ''}`}>
              <input
                type="radio"
                checked={activeIndex === index}
                onChange={() => handleSelect(index)}
                className="carousel-radio"
              />
              <span className="carousel-indicator"></span>
            </label>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Testimonials;
