import './Buyplan.css';
import React, { useState } from "react";
import check from './check-tick.png';
import multiple from './multipleicon.png';
import { Modal,Button } from 'react-bootstrap';
import loke from './rocksss.png'
function Buyplan() {

    const [hoveredCard, setHoveredCard] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Function to open the modal
    const handleShowModal = () => setShowModal(true);
  
    // Function to close the modal
    const handleCloseModal = () => setShowModal(false);

  const handleMouseOver = (cardIndex) => {
    setHoveredCard(cardIndex);
  };

  const handleMouseOut = () => {
    setHoveredCard(null);
  };
  return (
    <div className="buyplancontainer">

<h4 className="text-center plan-subscription" >
        Our plan Details for your 
      </h4>
      <h3 className="text-primary text-center">Organization</h3>
      <p className="text-center mb-5">
        Choose a plan that's right for you
      </p>
      <div className="row" > 
        <div className="col-md-4 no-gutters "> 
        <div
            className={`card ${hoveredCard === 0 ? 'card-hoveredss' : ''}`}
            style={{ border: 'none',cursor:'pointer'}}
            onMouseOver={() => handleMouseOver(0)}
            onMouseOut={handleMouseOut}
          >
            <div className="text-black fw-bold mt-3 ml-2 heading">
             <h6 style={{fontWeight:'650'}}>BASIC</h6> 
            </div>
         

            <p className="card-texts ml-2" style={{fontSize:'13px'}}>
                Ideal for individuals who need quick access <br></br>to basic
                features.
              </p>
            <h2 className="card-title ml-2 heading " style={{fontSize:'35px'}}>
  ₹299 <span className="per-month heading" style={{fontWeight:'normal',fontSize:'13px'}}>/ Month</span>
</h2>      
              
              <li className="list-group-item ml-2 mt-3">
    <img src={check} alt="check icon"  className="checkicons"/><span className="ml-3 payment">Unique Access ID</span>
  </li>
                <li className="list-group-item  ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment"> Maintaining Health Record</span>
                </li>
                <li className="list-group-item  ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment"> Medical Camp</span>
                </li>
                <li className="list-group-item  ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment"> Medicines</span>
                </li>
                <li className="list-group-item  ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment"> Nutrition screening</span>
                </li>
                <li className="list-group-item  ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment">Medikit</span>
                </li>
                <li className="list-group-item  ml-2">
                <img src={multiple} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 paymentss"> Awareness Program</span>
                </li>
                <li className="list-group-item  ml-2">
                <img src={multiple} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 paymentss"> Treatment Reduction</span>
                </li>
                <li className="list-group-item  ml-2">
                <img src={multiple} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 paymentss"> Group Counseling</span>
                </li>
                <li className="list-group-item  ml-2">
                <img src={multiple} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 paymentss"> BP Apparatus</span>
                </li>
                <li className="list-group-item  ml-2">
                <img src={multiple} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 paymentss"> Individual Counseling</span>
                </li>
                <li className="list-group-item  ml-2">
                <img src={multiple} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 paymentss"> Pulse Oximeter -1</span>
                </li>
                <li className="list-group-item  ml-2">
                <img src={multiple} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 paymentss">Summer Camps</span>
                </li>
                <li className="list-group-item  ml-2">
                <img src={multiple} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 paymentss"> Awareness Program for Teachers and Parents.</span>
                </li>
                <div class="d-flex justify-content-center">
                <button
        type="button"
        className="btn btn-primary"
        style={{ backgroundColor: 'white', color: 'blue', width: '80%', marginTop: '30px' }}
        onClick={handleShowModal}
      >
        Get Started Now
      </button>
      {showModal && (
          <Modal className="modal-contentsi" show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Body className="d-flex flex-column align-items-center">
            <img src={loke} style={{ width: '200px', height: '200px' }} alt="checklokeicon" className="checklokeicons mb-3" />
            <Button className="mt-2" style={{width:"200px"}}>OK</Button>
          </Modal.Body>
        </Modal>
        
        
       )}
      
  
</div>

              <br></br>
            </div>
          </div>
     
        <div className="col-md-4 no-gutters"> 
        <div
            className={`card ${hoveredCard === 1 ? 'card-hoveredss' : ''}`}
            style={{ border: 'none',cursor:'pointer' }}
            onMouseOver={() => handleMouseOver(1)}
            onMouseOut={handleMouseOut}
          >
            <div className="text-black fw-bold mt-3 ml-2">
             <h6 style={{fontWeight:'650'}}> STANDARD</h6>
            </div>
            <p className="card-texts ml-2" style={{fontSize:'13px'}}>
                Ideal for individuals who who need <br></br>advanced features and
                tools for client wo...
              </p>
              <h2 className="card-title ml-2"  style={{fontSize:'35px'}}>₹399<span className="per-month" style={{fontWeight:'normal',fontSize:'13px'}}>/ Month</span></h2>
            
                <li className="list-group-item ml-2 mt-3">
                <img src={check} alt="check icon"  className="checkicons"/><span className="ml-3 payment">Unique Access ID</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment"> Maintaining Health Record</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment"> Medical Camp</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment"> Medicines</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment"> Nutrition screening</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment">Medikit</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment"> Awareness Program</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 payment"> Treatment Reduction</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 payment"> Group Counseling</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 payment"> BP Apparatus</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={multiple} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 paymentss">Individual Counseling</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={multiple} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 paymentss"> Pulse Oximeter -1</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={multiple} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 paymentss">Summer Camps</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={multiple} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 paymentss"> Awareness Program for Teachers and Parents.</span>
                </li>
         
                <div class="d-flex justify-content-center">
  <button type="button" class="btn btn-primary" style={{backgroundColor: 'white', color: 'blue', width: '80%', marginTop: '30px'}}>Get Started Now</button>
</div>

            <br></br>
            </div>
          </div>

        <div className="col-md-4 no-gutters">
        <div
            className={`card ${hoveredCard === 2 ? 'card-hoveredss' : ''}`}
            style={{ border: 'none',cursor:'pointer' }}
            onMouseOver={() => handleMouseOver(2)}
            onMouseOut={handleMouseOut}
          >
            <div className="text-black mt-3 ml-2">
            <h6 style={{fontWeight:'650'}}> PREMIUM</h6>
            </div>
          
             
              <p className="card-texts ml-2" style={{fontSize:'13px'}}>
                Ideal for businesses who need personalized <br></br>services and
                security for large teams.
              </p>
              <h2 className="card-title ml-2 "  style={{fontSize:'35px'}}>₹499<span className="per-month" style={{fontWeight:'normal',fontSize:'13px'}}>/ Month</span></h2>
              
            
                <li className="list-group-item ml-2 mt-3">
                <img src={check} alt="check icon"  className="checkicons"/><span className="ml-3 payment">Unique Access ID</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment"> Maintaining Health Record</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment"> Medical Camp</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment"> Medicines</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment"> Nutrition screening</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment">Medikit</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                <span className="ml-3 payment"> Awareness Program</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 payment"> Treatment Reduction</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 payment"> Group Counseling</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 payment"> BP Apparatus</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 payment">Individual Counseling</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 payment"> Pulse Oximeter -1</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 payment">Summer Camps</span>
                </li>
                <li className="list-group-item ml-2">
                <img src={check} alt="check icon"  className="checkicons"/>
                  <span className="ml-3 payment"> Awareness Program for Teachers and Parents.</span>
                </li>
             
                <div class="d-flex justify-content-center">
  <button type="button" class="btn btn-primary" style={{backgroundColor: 'white', color: 'blue', width: '80%', marginTop: '30px'}}>Get Started Now</button>
</div>

              <br></br>
            </div>
          </div>
        </div>
        <br></br>
      </div>

  );
}
<br></br>
export default Buyplan;