import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col } from 'react-bootstrap';
import deseditIcon from '../images/edit.png';
import desdeleteIcon from '../images/deleted.png';
import desaccessIcon from '../images/accesslevel.png';

const DesignationTable = () => {
  const [showAddRow, setShowAddRow] = useState(false);
  const [newDesignation, setNewDesignation] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]); // For dropdown data
  const [editingIndex, setEditingIndex] = useState(null);
  const [editDesignation, setEditDesignation] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [showAccessLevel, setShowAccessLevel] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  useEffect(() => {
    // Fetch designation data from the API
    fetch('http://localhost:5000/superAdmin_list_of_designation')
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data); // Console log to inspect the data
        setData(data.departments);
        setTotalCount(data.totalCount);
      })
      .catch((error) => {
        console.error('Error fetching designation data:', error);
      });

    // Fetch department dropdown data from the API
    fetch('http://localhost:5000/superAdmin_department_dropDown')
      .then((response) => response.json())
      .then((departmentNames) => {
        setDepartments(departmentNames);
      })
      .catch((error) => {
        console.error('Error fetching department dropdown data:', error);
      });
  }, []);

  const handleAddClick = () => {
    setShowAddRow(true);
    setShowAccessLevel(true);
  };

  const handleInputChange = (e) => {
    setNewDesignation(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setNewDepartment(e.target.value);
  };

  const handleSubmit = () => {
    if (newDesignation.trim() && newDepartment) {
      // Make the API call to add the new designation
      fetch('http://localhost:5000/superAdmin_add_designation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department_name: newDepartment,
          designation_name: newDesignation,
          id: 1, // Replace with the actual ID from the logged-in super admin
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.message === 'Designation inserted successfully') {
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString();
            const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            setData([
              {
                Designation_names: newDesignation,
                Department_names: newDepartment,
                Date: formattedDate,
                time: formattedTime,
                accessLevel: 'Default Access',
              },
              ...data,
            ]);
            setNewDesignation('');
            setNewDepartment('');
            setShowAddRow(false);
            setShowAccessLevel(false);
            setTotalCount(totalCount + 1);
          } else {
            console.error('Error adding designation:', result.error);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };


  const handleCancel = () => {
    setNewDesignation('');
    setNewDepartment('');
    setShowAddRow(false);
    setShowAccessLevel(false);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditDesignation(data[index].Designation_names);
    setEditDepartment(data[index].Department_names);
  };

  const handleEditDesignationChange = (e) => {
    setEditDesignation(e.target.value);
  };

  const handleEditDepartmentChange = (e) => {
    setEditDepartment(e.target.value);
  };

 

  const handleSubmitEdit = (id) => {
    const updatedDesignation = {
      id: id,
      designation_name: editDesignation,
      department_name: editDepartment,
    };
  
    console.log('Sending data:', updatedDesignation);
  
    fetch('http://localhost:5000/superAdmin_designation_edit_bts', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDesignation),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('API result:', result);
  
        if (result.message === 'Designation and department name updated successfully') {
          // Update the data in the state
          const updatedData = data.map((item) =>
            item.id === id
              ? { ...item, designation_name: editDesignation, department_name: editDepartment }
              : item
          );
  
          setData(updatedData);
  
          // Reset editing states to return the row to non-editable state
          setEditingIndex(null); // This will stop showing the input fields
          setEditDesignation(''); // Clear the designation input state
          setEditDepartment(''); // Clear the department input state

          
        } else {
          console.error('Unexpected API response:', result.message);
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  };
  
  
  


  

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditDesignation('');
    setEditDepartment('');
  };

   const handleDeleteClick = (id, index) => {
    // Make API call to delete designation
    fetch(`http://localhost:5000/superAdmin_designation_delete_btn?id=${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.Result === 'Success') {
          const updatedData = data.filter((_, i) => i !== index);
          setData(updatedData);
          setTotalCount(totalCount - 1);
        } else {
          console.error('Error deleting designation:', result.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
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
 const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
 const totalPages = Math.ceil(data.length / rowsPerPage);


 const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};



  return (
    <div className="container mt-4">
      <Card style={{ padding: '10px', borderRadius: '10px', border: 'none' }}>
        <Card.Body>
          <Row className="mt-0">
            <Card.Title style={{ color: '#343a40', fontSize: '18px', fontWeight:'bold' }}>List of Designations</Card.Title>
            <Col style={{ textAlign: 'left' }}>
              <p style={{ color: '#B5B5C3', fontSize: '13px' }}>
                {totalCount + (showAddRow ? 1 : 0)}  Designations
              </p>
            </Col>
            <Col style={{ textAlign: 'right', marginTop: '-22px' }}>
              <button
                onClick={handleAddClick}
                style={{
                  border: 'none',
                  fontSize: '12px',
                  borderRadius: '27px',
                  padding: '8px 20px',
                  backgroundColor: '#0089FF',
                  color: '#FFFFFF',
                  marginTop: '-7px',
                  width: '35%',
                }}
              >
                Add Designation
              </button>
            </Col>
          </Row>
          <Table responsive>
            <thead>
              <tr style={{ fontSize: '12px', textAlign: 'center' }}>
                <th className='text-left ps-1'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Designation</th>
                <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Department Name</th>
                <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Created Date</th>
                <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Access Level</th>
                <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Edit</th>
                <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {showAddRow && (
                <tr>
                  <td style={{ fontSize: '12px', color: '#000000', borderBottom: 'none', textAlign: 'center' }}>
                    <input
                      type="text"
                      value={newDesignation}
                      onChange={handleInputChange}
                      style={{
                        width: '70%',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px',
                        border: 'none',
                        height: '30px',
                        paddingLeft:'20px',
                        borderRadius: '10px',
                      }}
                    />
                  </td>
                  <td style={{ fontSize: '12px', color: '#000000', borderBottom: 'none', textAlign: 'center' }}>
                    <select
                      value={newDepartment}
                      onChange={handleDepartmentChange}
                      style={{
                        width: '90%',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px',
                        border: 'none',
                        height: '30px',
                        borderRadius: '10px',
                      }}
                    >
                      <option value=""></option>
                      {departments.map((department, index) => (
                        <option key={index} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ borderBottom: 'none' }}></td>
                  <td style={{ borderBottom: 'none', textAlign: 'center' }}>
                    {showAccessLevel && <img src={desaccessIcon} alt="access" style={{ width: '25px', cursor: 'pointer' }} />}
                  </td>
                  <td style={{ borderBottom: 'none', textAlign: 'center' }}>
                    <button
                      onClick={handleSubmit}
                      style={{
                        backgroundColor: '#0089FF',
                        border: 'none',
                        borderRadius: '23px',
                        fontSize: '12px',
                        width: '100%',
                        color: 'white',
                        padding: '5px',
                      }}
                    >
                      Submit
                    </button>
                  </td>
                  <td style={{ borderBottom: 'none', textAlign: 'center' }}>
                    <button
                      onClick={handleCancel}
                      style={{
                        backgroundColor: 'white',
                        border: '2px solid #FF0000',
                        fontWeight:'bold',
                        borderRadius: '23px',
                        fontSize: '12px',
                        width: '100%',
                        color: '#FF0000',
                        padding: '5px',
                      }}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              )}
              {currentRows.map((row, index) => (
                <tr key={index}>
                  <td style={{ fontSize: '12px', color: '#000000', borderBottom: 'none', textAlign: 'center' }}>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editDesignation}
                        onChange={handleEditDesignationChange}
                        style={{
                          width: '70%',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          fontSize: '12px',
                          border: 'none',
                          height: '30px',
                          borderRadius: '10px',
                        }}
                      />
                    ) : (
                      row.Designation_names
                    )}
                  </td>
                  <td style={{ fontSize: '12px', color: '#000000', borderBottom: 'none', textAlign: 'center' }}>
                    {editingIndex === index ? (
                      <select
                        value={editDepartment}
                        onChange={handleEditDepartmentChange}
                        style={{
                          width: '90%',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          fontSize: '12px',
                          border: 'none',
                          height: '30px',
                          borderRadius: '10px',
                        }}
                      >
                        <option value=""></option>
                        {departments.map((department, i) => (
                          <option key={i} value={department}>
                            {department}
                          </option>
                        ))}
                      </select>
                    ) : (
                      row.Department_names
                    )}
                  </td>
                  <td style={{ fontSize: '12px', color: '#464E5F', borderBottom: 'none', textAlign: 'center' }}>
                    {row.Date}
                    <br />
                    <span style={{ fontSize: '10px', color: '#888888' }}>{row.Time}</span>
                  </td>
                  <td style={{ fontSize: '12px', color: '#000000', borderBottom: 'none', textAlign: 'center' }}>
                    <img src={desaccessIcon} alt="access" style={{ width: '25px', cursor: 'pointer' }} />
                  </td>
                  <td style={{ borderBottom: 'none', textAlign: 'center' }}>
                    {editingIndex === index ? (
                      <button
                        onClick={() => handleSubmitEdit(row.id)}
                        style={{
                          backgroundColor: '#0089FF',
                          border: 'none',
                          borderRadius: '23px',
                          fontSize: '12px',
                          width: '100%',
                          color: 'white',
                          padding: '5px',
                        }}
                      >
                        Submit
                      </button>
                    ) : (
                      <img
                        src={deseditIcon}
                        alt="edit"
                        onClick={() => handleEditClick(index)}
                        style={{ width: '28px', cursor: 'pointer' }}
                      />
                    )}
                  </td>
                  <td style={{ borderBottom: 'none', textAlign: 'center' }}>
                    {editingIndex === index ? (
                      <button
                        onClick={handleCancelEdit}
                        style={{
                          backgroundColor: 'white',
                          border: '2px solid #FF0000',
                          borderRadius: '23px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          width: '100%',
                          color: '#FF0000',
                          padding: '5px',
                        }}
                      >
                        Cancel
                      </button>
                    ) : (
                      <img
                        src={desdeleteIcon}
                        alt="delete"
                        onClick={() => handleDeleteClick(row.id,index)}
                        style={{ width: '28px', cursor: 'pointer' }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
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

export default DesignationTable;