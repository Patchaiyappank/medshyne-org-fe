import React from 'react'
import {motion} from 'framer-motion';
import "../styles/services.css";
import video from "./video(1).mp4";
import video1 from "./video(2).mp4";
import video2 from "./video(3).mp4";
import arrow from "./arrow.png";


const Services = () => {
  return (
    <div>
    <motion.div  className='background-image'
       initial = {{opacity:0}} 
    animate = {{opacity:1}}
    exit = {{opacity:0}}
    transition = {{duration:3}}
   > 
   
 
    <div><p className='service-para'>What you get from us?</p></div>
    <div className='service-container'>
      <div className='service-division'>
      <div className='service-text'>
      <h3>Video Consultation</h3>
      <p>Receive easy, personalized care from home. Speak virtually with qualified medical professionals about any medical concerns via our platform.</p></div>
      <video  className='service-video' autoPlay muted loop>
        <source src={video} type="video/mp4" />
      </video>
      
      </div>
      <div className='service-division'>
      <div className='service-text'>
      <h3>Clinic Visit</h3>
      <p>Receive individualized treatment without leaving your house. Our skilled medical professionals deliver high-quality healthcare right to your home.</p></div>
      <video  className='service-video' autoPlay muted loop>
        <source src={video1}  type="video/mp4" />
      </video>
      </div>
      <div className='service-division'>
      <div className='service-text'>
      <h3>Home Visit</h3>
      <p>Receive individualized treatment without leaving your house. Our skilled medical professionals deliver high-quality healthcare right to your home.</p></div>
      <video  className='service-video' autoPlay muted loop>
        <source src={video2}  type="video/mp4" />
      </video>
      </div>
      

    </div>
    <br/>
    <br/>
    <div className='arrow-container'>
        <button className='service-seemore'>  <span className="see-more-text">See More</span><span><img src={arrow} className='service-arrow'></img></span></button>
      </div>
    </motion.div>
    </div>
  )
}

export default Services
