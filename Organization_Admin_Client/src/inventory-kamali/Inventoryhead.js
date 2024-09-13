import React, { useState, useEffect, useContext } from 'react';
import './Inventory.css';
import CombinedComponent from './Inventory.js';
import StackComponent from './Stack.js';
import { MyContext } from '../ProjectContext';

const Inventoryhead = () => {
  const { getLoginCredentials, setLoginCredentials } = useContext(MyContext); // Destructure here
  const [showUsed, setShowUsed] = useState(false);
  const [showStack, setShowStack] = useState(false);
  const [userButtonActive, setUserButtonActive] = useState(false); // State to track user button active state
  const [stackButtonActive, setStackButtonActive] = useState(false); // State to track stack button active state
  const [organizationName, setOrganizationName] = useState('');

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

  // useEffect(() => {
  //   handleToggleUserComponent();
  // }, []);


  useEffect(() => {
    handleToggleUserComponent();
    if (getLoginCredentials && getLoginCredentials[0]) {
      setOrganizationName(getLoginCredentials[0].organization_name);
    }
  }, [getLoginCredentials]);
  return (
    <div className='inventoryhead-container'>
      <div>
        <h4 className="inventory-in">Medicine Inventory</h4>
      </div>
      <div className='inventory-button'>
        {/* Apply conditional class based on userButtonActive state */}
        <button className={`inventory-user ${userButtonActive ? 'active' : ''}`} onClick={handleToggleUserComponent}>Used</button>
        {/* Apply conditional class based on stackButtonActive state */}
        <button className={`inventory-stack ${stackButtonActive ? 'active' : ''}`} style={{ marginLeft: '10px', marginTop: '-0px' }} onClick={handleToggleStackComponent}>Stocks</button>
      </div>
      {showUsed && (
        <CombinedComponent />
      )}
      {showStack && (
        <StackComponent />
      )}
    </div>
  );
};

export default Inventoryhead;
