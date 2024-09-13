import React, { useState, useEffect, useContext } from 'react';
import './OnboardHeader.css';
import ListofOrganization from '../OrganizationList/OrganizationList.js';
import OnboardListing from './OnboardingList.js';
import OnboardPayment from './OnboardPayment.js';
import OnboardUnpaid from './OnboardUnpaid.js';


const Inventoryhead = () => {
const[showList, setShowList] = useState(false);
  const [showonboard, setShowOnboard] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showUnpaid, setShowUnpaid] = useState(false);
  const [listButtonActive, setlistButtonActive] = useState(false); // State to track list button active state
  const [onboardButtonActive, setonboardButtonActive] = useState(false); // State to track user button active state
  const [paymentButtonActive, setpaymentButtonActive] = useState(false); // State to track stack button active state
  const [unpaidButtonActive, setunpaidButtonActive] = useState(false); 

  useEffect(() => {
    handleToggleOnboardComponent();
  }, []);

  const handleToggleListComponent = () => {
    setShowList(true);
    setShowOnboard(false);
    setShowPayment(false);
    setShowUnpaid(false);
    setlistButtonActive(true); // Activate list button
    setonboardButtonActive(false); // Activate user button
    setpaymentButtonActive(false); // Deactivate stack button
    setunpaidButtonActive(false); 
  };

  const handleToggleOnboardComponent = () => {
    setShowOnboard(true);
    setShowList(false);
    setShowPayment(false);
    setShowUnpaid(false);
    setlistButtonActive(false);
    setonboardButtonActive(true); // Activate user button
    setpaymentButtonActive(false); // Deactivate stack button
    setunpaidButtonActive(false); 
  };

  const handleTogglePaymentComponent = () => {
    setShowPayment(true);
    setShowOnboard(false);
    setShowList(false);
    setShowUnpaid(false);
    setonboardButtonActive(false);
  setlistButtonActive(false);
    setunpaidButtonActive(false);// Deactivate user button
    setpaymentButtonActive(true); // Activate stack button
  };

  const handleToggleUnpaidComponent = () => {
    setShowUnpaid(true);
    setShowPayment(false);
    setShowOnboard(false);
    setShowList(false);
    setlistButtonActive(false); // Deactivate list button
    setonboardButtonActive(false); // Deactivate user button
    setpaymentButtonActive(false); // Activate stack button
    setunpaidButtonActive(true);
  };



  return (
    <div className='onboard-head-container'>
      <div>
        <h1 className="mt-3 ps-4 fs-3 fw-bold">Organization</h1>
      </div>
      <hr style={{color:' rgba(0, 0, 0, 0.2)'}}></hr>
      <div className='onboard-button'>
       {/* Apply conditional class based on listButtonActive state */}
       <button className={`onboard-list ${listButtonActive ? 'active' : ''}`} onClick={handleToggleListComponent}>List</button>
        
        {/* Apply conditional class based on onboardButtonActive state */}
        <button className={`onboard-list ${onboardButtonActive ? 'active' : ''}`} onClick={handleToggleOnboardComponent}>On boarding</button>
        {/* Apply conditional class based on paymentButtonActive state */}
        <button className={`onboard-list ${paymentButtonActive ? 'active' : ''}`} onClick={handleTogglePaymentComponent}>Payments</button>
        {/* Apply conditional class based on unpaidButtonActive state */}
        <button className={`onboard-list ${unpaidButtonActive ? 'active' : ''}`}  onClick={handleToggleUnpaidComponent}>Unpaid</button>
      
      </div>
      {showList && (
        <ListofOrganization />
      )}
      {showonboard && (
        <OnboardListing />
      )}
      {showPayment && (
        <OnboardPayment />
      )}
      {showUnpaid && (
        <OnboardUnpaid />
      )}
    </div>
  );
};

export default Inventoryhead;
