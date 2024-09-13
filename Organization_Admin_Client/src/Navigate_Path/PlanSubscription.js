import React from 'react';

import Navbar from '../component/navbar.js';
import Sidebar from '../component/sidebar.js';
import Buyplan from '../Payement/Buyplan.js';
function PlanSubscription() {
    return(
        <div>
          
            <Navbar />
            <Sidebar /> 
            <Buyplan/>   
        </div>
    )

    }
    
export default PlanSubscription;   