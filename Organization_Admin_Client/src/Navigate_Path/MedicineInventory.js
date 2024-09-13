import React from 'react';
import Sidebar from '../component/sidebar.js';
import Navbar from '../component/navbar.js';
import Inventoryhead from '../inventory-kamali/Inventoryhead.js';

function MedicineInventory(){
  return (
    <div >
      <Navbar />
<Sidebar/>
<Inventoryhead/>
    </div>
  );
}
export default MedicineInventory;
