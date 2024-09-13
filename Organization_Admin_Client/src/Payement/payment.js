import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap'; 
import './payment.css';
import failed from './failed.png';
import paid from './paid.png';
import { useNavigate } from 'react-router-dom';

const SubscriptionsDetails = () => {
  const [currentPlan, setCurrentPlan] = useState("Standard");

  const handlePlanChange = (plan) => {
    setCurrentPlan(plan);
  };
  const navigate = useNavigate();
  const transactions = [
    {
      id: 54894893298,
      date: "Oct. 21, 2021",
      price: 499,
      plan: "Basic subscription",
      status: "Failed",
    },
    {
      id: 3454363456346,
      date: "Oct. 21, 2021",
      price: 499,
      plan: "Basic subscription",
      status: "Paid",
    },
    // Add more transactions as needed
  ];

  const handleView = () => {
    navigate('/PlanSubscription');
  };
  return (
    <div className="container-fluid" style={{ marginLeft: '100px', marginTop: '80px', width: '92%' }}>
      <div className="row">
        <div className="col-md-12">
          <div className="card" style={{ border: 'none', borderRadius: '10px' }}>
            <div className="row mt-3 mb-4">
              <h6 className="ml-4" style={{fontWeight:'bold'}}>Subscriptions Details</h6>
              <div className="col-md-4" style={{paddingLeft: '25px'}}>
                <div className="card ml-3" style={{ backgroundColor: '#F9F9F9', border: 'none', width: '314px', borderRadius:'16px' }}>
                  <p className="ml-4 mt-3 fw-bold 3" style={{ fontSize: '13px', paddingLeft: '25px' }}>
                    Start date: <span style={{ marginLeft: '60px' }}>Oct. 21, 2021</span>
                  </p> 
                  <p className="ml-4 mt-1 fw-bold" style={{ fontSize: '13px' ,paddingLeft: '25px'}}>
                    Next Invoice: <span style={{ marginLeft: '45px' }}>Oct. 21, 2021</span>
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card mr-3" style={{ backgroundColor: '#F9F9F9', border: 'none', width: '314px', borderRadius:'16px' ,marginLeft:'-40px'}}>
                  <p className="card-texts ml-5 mt-3 fw-bold" style={{ fontSize: '13px', paddingLeft: '20px' }}>
                    Current Plan:
                    <span style={{ marginLeft: '55px' }}>Standard</span>
                  </p>
                  <div className="d-flex justify-content-center mb-3" style={{paddingLeft: '50px'}}>
                    <Button
                      className="text-white d-flex justify-content-center align-items-center mr-5"
                      style={{
                        width: '160px',
                        borderRadius: '15px',
                        height: '25px',
                        backgroundColor: '#0089FF',
                        fontSize: '12px',
                        lineHeight: '25px',
                        padding: '0',
                        paddingLeft: '5px'
                      }}
                      onClick={ handleView}
                    >
                      Buy Plan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="card" style={{ borderRadius: '10px' }}>
            <div className="row mt-4">
              <div className="col-md-12">
                <h6 className="ml-5" style={{fontWeight:'bold'}}>Plan Transaction</h6>
                <p className="ml-5" style={{ fontSize: '14px' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <table className="tabless">
  <thead>
    <tr>
      <th className="prescriptionthh"><span className="transpay">Transaction ID</span></th>
      <th className="prescriptionthh">Date</th>
      <th className="prescriptionthh">Price</th>
      <th className="prescriptionthh">Subscription Plan</th>
      <th className="prescriptionthh">Status</th>
      <th className="prescriptionthh">Invoice</th>
    </tr>
  </thead>
  <tbody>
    {transactions.map((transaction) => (
      <tr key={transaction.id}>
        <td className="prescriptiontdd"><span className="transpay1">{transaction.id}</span></td>
        <td className="prescriptiontdd"><span className="transdate">{transaction.date}</span></td>
        <td className="prescriptiontdd"><span className="transprice">₹{transaction.price}</span></td>
        <td className="prescriptiontdd"><span className="transplan">{transaction.plan}</span></td>
        <td className="prescriptiontdd">
          {transaction.status === "Paid" ? (
            <img src={paid} alt="Paid" style={{ width: '80px', height: '20px' }} />
          ) : (
            <img src={failed} alt="Failed" style={{ width: '80px', height: '20px' }} />
          )}
        </td>
        <td className="prescriptiontdd">
          {transaction.status === "Paid" && (
            <button className="btn text-start btn-link" style={{ color: "#6941C6", fontSize: '15px' }}>
              Download
            </button>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsDetails;