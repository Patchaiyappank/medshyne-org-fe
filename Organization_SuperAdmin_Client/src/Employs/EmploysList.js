import React, { useEffect, useState } from 'react';
import '@fontsource/inter';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import addicon from '../assest/Add-user.png';
import actionIcon from '../assest/actionbutton.png';
import profileIcon from '../assest/Photodoctor.png'; // Use the imported profile image
import { useNavigate } from 'react-router-dom';
import img from '../images/defimg.png';

const EmploysList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  useEffect(() => {
    fetch('  http://localhost:5000/superAdmin_list_of_employees')
      .then(response => response.json())
      .then(data => {
        setEmployees(data.employees);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const newEmployee = () => {
    navigate('/AddEmpolyee');
  };

  const handleSingleEmployeeClick = (employee_id) => {
    console.log('Employee ID being passed:', employee_id);
    navigate('/ViewEmpolyee', {
      state: { id: employee_id },
    });
  };




  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
      const pageNumbers = [];
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <span
            key={i}
            onClick={() => onPageChange(i)}
            style={{
              cursor: 'pointer',
              margin: '0 5px',
              padding: '5px 10px',
              backgroundColor: i === currentPage ? 'rgba(0, 137, 255, 0.1)' : '',
              color: i === currentPage ? '#0089FF' : '',
              borderRadius: '25px',
            }}
          >
            {i}
          </span>
        );
      }
      return pageNumbers;
    };

    return (
      <div className="Support-pagination" style={{ textAlign: 'center', marginBottom: '5%', color: '#697077', fontWeight: '500' }}>
        <span
          className="Support-pagination-arrow"
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          style={{
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            marginRight: '10px',
            fontSize: '12px',
            color: '#697077',
          }}
        >
          <span className="Support-prevoius-arrow" style={{ padding: '10px' }}>&#8249;</span> Previous
        </span>
        <span style={{ fontSize: '12px' }} className="Support-pagination-pages">
          {renderPageNumbers()}
        </span>
        <span
          className="Support-pagination-arrow"
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          style={{
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            marginLeft: '10px',
            fontSize: '12px',
            color: '#697077',
          }}
        >
          Next <span className="Support-next-arrow" style={{ padding: '10px' }}>&#8250;</span>
        </span>
      </div>
    );
  };
 // Pagination logic
 const indexOfLastRow = currentPage * rowsPerPage;
 const indexOfFirstRow = indexOfLastRow - rowsPerPage;
 const currentRows = employees.slice(indexOfFirstRow, indexOfLastRow);
 const totalPages = Math.ceil(employees.length / rowsPerPage);


 const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};

  return (
    <div className="container me-5 mt-2">
      <div style={{ padding: '20px', borderRadius: '20px', backgroundColor: '#FFFFFF' }} className="shadow-sm p-2 mb-5">
        <div className="header-row">
          <div>
            <h5 style={{ color: '#212121', fontSize: '18px', fontWeight:'bold' }} className="mt-3">List of Employs</h5>
            <h6 style={{ fontSize: '13px', color: '#B5B5C3' }}>
              {employees.length} available Employees
            </h6>
          </div>
          <button
            style={{
              border: 'none',
              fontSize: '14px',
              borderRadius: '27px',
              width: '20%',
             padding: '8px 10px',
              backgroundColor: '#0089FF',
              color: '#FFFFFF',
            }}
            onClick={newEmployee}
          >
            <img style={{ height: '14%', width: '14%', marginRight: '8px' }} src={addicon} alt="Add" />
            Add new Employee
          </button>
        </div>

        <div className="employs-table-responsive mt-3">
          <Table bordered={false} className="table-borderless">
            <thead>
              <tr style={{ fontSize: '12px' }}>
                <th className='text-left ps-3'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Employee Name</th>
                <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>ID</th>
                <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Email</th>
                <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Phone Number</th>
                <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Date Added</th>
                <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Gender</th>
                <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}></th>
              </tr>
            </thead>
            <tbody>
              { currentRows.map((employee, index) => (
                <tr key={index}>
                  <td className="align-middle">
                    <div className="d-flex align-items-center">
                      <img
                        src={employee.profile ? employee.profile : img} // Use fetched profile or default image
                        width={30}
                        alt="employee"
                        className="rounded-circle me-2"
                      />
                      <div>
                        <div style={{ color: '#464E5F', fontSize: '12px', fontWeight: '500' }}>{employee.emp_name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign:'center', color: '#464E5F', fontSize: '12px', fontWeight: '500' }}>{employee.emp_id}</td>
                  <td style={{  textAlign:'center',color: '#464E5F', fontSize: '12px', fontWeight: '500' }}>{employee.e_mail}</td>
                  <td style={{  textAlign:'center',color: '#464E5F', fontSize: '12px', fontWeight: '500' }}>{employee.phone_number}</td>
                  <td>
                    <div style={{  textAlign:'center',color: '#464E5F', fontSize: '12px', fontWeight: '500' }}>
                      {employee.date} <br />
                      <span style={{ textAlign:'center', fontSize: '11px', color: '#B5B5C3' }}>{employee.time}</span>
                    </div>
                  </td>
                  <td style={{  textAlign:'center',color: '#464E5F', fontSize: '12px', fontWeight: '500' }}>{employee.gender}</td>
                  <td className="text-center align-middle">
                    <button className="action-button" onClick={() => handleSingleEmployeeClick(employee.emp_id)}>
                      <img style={{ color:'#181C32', marginTop:'-12px', width:'19px', height:'19px' }} src={actionIcon} alt="Action" className="action-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <br>
      </br>
      <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
    </div>
  );
};

export default EmploysList;
