import React, { useState, useEffect } from 'react';
import './Dashboardtable.css';
import deleted from '../images/deleted.png';
import edit from '../images/edit.png';
import view from '../images/view.jpg';
import profile from '../images/profiletable.jpg';

const getStatusColor = (status) => {
  switch (status) {
    case 'new':
      return {
        textAlign: 'center',
        backgroundColor: 'rgba(0, 137, 255, 0.1)',
        fontWeight: 'bold',
        color: '#0089FF',
        borderRadius: '27px',
        border: 'none',
      };
    case 'waiting':
      return {
        textAlign: 'center',
        backgroundColor: 'rgba(255, 235, 59, 0.1)',
        fontWeight: 'bold',
        color: '#FFEB3B',
        borderRadius: '27px',
        border: 'none',
      };
    case 'completed':
      return {
        textAlign: 'center',
        backgroundColor: 'rgba(115, 255, 66, 0.1)',
        fontWeight: 'bold',
        color: '#73FF42',
        borderRadius: '27px',
        border: 'none',
      };
    default:
      return {
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
      };
  }
};

const Table = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin_viewall_appointment", {
          method: 'GET'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.result);
        console.log('Fetched Data:', result.result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/Is_delete_admin_appointment?consult_id=${id}`, {
        method: 'PUT'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.Result === "Success") {
        setData(data.filter(row => row.consult_id !== id));
        console.log('Record deleted:', result);
      } else {
        console.error('Error deleting record:', result.message);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleView = (id) => {
    console.log(`View details for ID: ${id}`);
    // Add your view logic here
  };

  return (
    <div>
      <div style={{ borderRadius: '28px',  backgroundColor: 'white', width: '100%' }} className="dashboard-table-containers">
        <table className="dashboard-table">
          <thead style={{ border: "1px solid rgb(235, 233, 233)", color: '#B5B5C3', borderColor: '#FAFAFA',fontSize:'12px' }}>
            <br></br>
            <tr>
              <th>Organization Name</th>
              <th style={{textAlign:'center'}}>Status</th>
              <th style={{textAlign:'center'}}>Consulting ID</th>
              <th style={{textAlign:'center'}}>Patient Name</th>
              <th style={{textAlign:'center'}}>Sick Type</th>
              <th style={{textAlign:'center'}}>Assignee</th>
              <th style={{textAlign:'center'}}>Date & Time</th>
              <th style={{textAlign:'center'}}>View</th>
              <th style={{marginLeft:'10px'}}>Edit</th>
              <th style={{ borderTopRightRadius: '5px' }}>Delete</th>
            </tr>
          </thead>
          <tbody style={{ color: '#464E5F', fontWeight: '700' ,paddingTop:'10px',paddingBottom:'10px'}}>
            {data.slice(0, 10).map((row) => (
              <tr key={row.consult_id}>
                <td>
                  <img style={{ width: '39px',paddingLeft:'10px' }} src={profile} alt="Profile" />  {row.organization_name}
                </td>
                <td style={{ ...getStatusColor(row.status) }}>{row.status}</td>
                <td style={{textAlign:'center'}}>{row.consult_id}</td>
                <td style={{textAlign:'center'}}>{row.patient_name}</td>
               
                <td style={{textAlign:'center'}}>{row.sick_type}</td>
                <td style={{textAlign:'center'}}>{row.assignee}</td>
                <td>
                  <div style={{textAlign:'center'}}>{row.date}</div>
                  <div style={{ color: '#B5B5C3',textAlign:'center' }}>{row.from_time} </div>
                  {/* - {row.to_time} */}
                </td>
                <td>
                  <img src={view} width={30} height={30} alt="View" style={{ cursor: 'pointer' }} onClick={() => handleView(row.consult_id)} />
                </td>
                <td>
                  <img src={edit} width={30} height={30} alt="Edit" style={{ cursor: 'pointer' }} />
                </td>
                <td>
                  <img src={deleted} width={30} height={30} alt="Delete" style={{ cursor: 'pointer' }} onClick={() => handleDelete(row.consult_id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
