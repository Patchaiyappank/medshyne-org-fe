import React from "react";
import "./footer.css";
import medshyneLogo from "../assets/logo.png";
import twitter from "../assets/X.png";
import faceBook from "../assets/Facebook.png";
import instagram from "../assets/Instagram.png";
import youTube from "../assets/Youtube.png";
import linkedIn from "../assets/LinkedIn.png";

const Footer = () => {
  return (
    <footer className="footer landing-footer">
      <div className="landing-footer-first">
        <div className="landing-footer-logo">
          <img
            src={medshyneLogo}
            alt="medshynelogo"
            style={{ width: "21%", height: "7%" }}
          />
        </div>
        <div className="landing-footer-address">
          Address: <p>Level 1, 12 Sample St, Sydney NSW 2000</p>
        </div>
        <div className="landing-footer-contact">
          Contact:<br />
          <p
            style={{
              borderBottom: "1px solid #000",
              display: "inline-block",
              marginBottom: "5px",
              marginTop: "5px",
              lineHeight: "1" 
            }}
          >
            1800 123 4567
          </p>
          <br />
          <p
            style={{ borderBottom: "1px solid #000", display: "inline-block", lineHeight: "1"  }}
          >
            info@relume.io
          </p>
        </div>
        <div className="landing-footer-social-media">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={faceBook} />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={instagram} />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={twitter} />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={linkedIn} />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={youTube} />
          </a>
        </div>
      </div>
      <div className="landing-footer-second">
        <div className="column landing-footer-column"></div>
        <div className="column landing-footer-column"></div>
      </div>
      <div className="landing-footer-third third">
        <hr className="divider landing-footer-divider" />
        <div className="third-content landing-footer-third-content">
          <div className="left landing-footer-left">
            &copy; 2023 Relume. All Rights Reserved.
          </div>
          <div className="right landing-footer-right">
            <a href="#privacy" className="link landing-footer-link">
              Privacy Policy
            </a>
            <a href="#terms" className="link landing-footer-link">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;