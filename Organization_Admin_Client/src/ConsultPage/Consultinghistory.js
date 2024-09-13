import React, { useState,useEffect } from 'react';
import './Consultancy.css';
import ConsultDone from './ConsultDone.js';
import ConsultCancel from './ConsultCancel.js';

const Inventoryhead = () => {
  const [showUsed, setShowUsed] = useState(false);
  const [showStack, setShowStack] = useState(false);
  const [userButtonActive, setUserButtonActive] = useState(false); // State to track user button active state
  const [stackButtonActive, setStackButtonActive] = useState(false); // State to track stack button active state

  const handleToggleUserComponent = () => {
    setShowUsed(true);
    setShowStack(false);
    setUserButtonActive(true); // Activate user button
    setStackButtonActive(false); // Deactivate stack button
  };

  const handleToggleStackComponent = () => {
    setShowStack(true);
    setShowUsed(false);
    setUserButtonActive(false); // Deactivate user button
    setStackButtonActive(true); // Activate stack button
  };
  useEffect(()=>{
    handleToggleUserComponent();
  },[]);

  return (
    <div>
    <div className='consult-head-container'>
      <div ><h1 className='consult-in' style={{marginLeft:'33px', marginTop:'-585px', padding:'20px'}} > Consulting History</h1></div>
      <div className='consult-button'>
        {/* Apply conditional class based on userButtonActive state */}
        <div><button className={`consult-user ${userButtonActive ? 'active' : ''}`} style={{ height: '24px' ,  marginLeft:'100px'}} onClick={handleToggleUserComponent}>Total consulting Done</button></div>
        {/* Apply conditional class based on stackButtonActive state */}
        <div><button className={`consult-stack ${stackButtonActive ? 'active' : ''}`} style={{ marginLeft: '20px', marginTop: '-5px' }} onClick={handleToggleStackComponent}>Total consulting Canceled</button></div>
      </div>
      {showUsed && (
        <ConsultDone />
      )}

      {showStack && (
        <ConsultCancel />
      )}
    </div>
    </div> 
  );
};

export default Inventoryhead;