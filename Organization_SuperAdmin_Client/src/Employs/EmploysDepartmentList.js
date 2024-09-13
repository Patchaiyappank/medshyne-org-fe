import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Card, Button, Row, Col, FormControl } from 'react-bootstrap';
import editIcon from '../images/edit.png';
import deleteIcon from '../images/deleted.png';

const DepartmentTable = () => {
  const [departments, setDepartments] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [initialName, setInitialName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  
  useEffect(() => {
    // Fetch data from the API
    fetchCarouselData();
  }, []);
  
  const fetchCarouselData = async () => {
  fetch('http://localhost:5000/superAdmin_list_of_departments')
  .then(response => response.json())
  .then(data => {
    console.log("Fetched data:", data); // Log the fetched data

    // Update the departments state with the fetched data
    const formattedDepartments = data.departments.map(department => ({
      id: department.ID,
      name: department.Department_names,
      createdDate: department.Date,
      createdTime: department.Time,
    }));
    setDepartments(formattedDepartments);
  })
  .catch(error => {
    console.error('Error fetching department data:', error);
  });
}

  const handleEdit = (id, name) => {
    setEditingId(id);
    setInitialName(name);
    setNewDepartmentName(name);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/superAdmin_department_delete_btn/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete department');
        }
        return response.text();
      })
      .then(data => {
        console.log(data);
        // Remove the deleted department from the state
        setDepartments(departments.filter(department => department.id !== id));
      })
      .catch(error => {
        console.error('Error deleting department:', error);
        alert('Failed to delete department');
      });
  };


  const handleAddDepartment = () => {
    setIsAdding(true);
  };

  const handleSaveNewDepartment = () => {
    if (newDepartmentName.trim()) {
      const adminId = 1; // Replace this with actual admin ID or fetch it dynamically if needed

      fetch('http://localhost:5000/superAdmin_add_department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department_name: newDepartmentName,
          id: adminId, // Replace with actual admin ID
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Department inserted successfully') {
            const newDepartment = {
              id: departments.length + 1, // This should be updated if you have a real ID from the server
              name: newDepartmentName,
              createdDate: new Date().toISOString().split('T')[0],
              createdTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setDepartments([newDepartment, ...departments]);
            setNewDepartmentName('');
            setIsAdding(false);
            fetchCarouselData();
          } else {
            alert(data.error || 'Failed to add department');
          }
        })
        .catch(error => {
          console.error('Error adding department:', error);
          alert('Failed to add department');
        });
    }
  };

  const handleCancel = () => {
    setNewDepartmentName('');
    setIsAdding(false);
  };

  const handleSaveEdit = (id) => {
    if (newDepartmentName.trim()) {
      fetch('http://localhost:5000/superAdmin_department_edit_bts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          department_name: newDepartmentName,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Department name updated successfully') {
            const updatedDepartments = departments.map(department =>
              department.id === id
                ? { ...department, name: newDepartmentName }
                : department
            );
            setDepartments(updatedDepartments);
            setEditingId(null);
            setNewDepartmentName('');
          } else {
            alert(data.error || 'Failed to update department');
          }
        })
        .catch(error => {
          console.error('Error updating department:', error);
          alert('Failed to update department');
        });
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setNewDepartmentName('');
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

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = departments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(departments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div className="container mt-3">
      <Card style={{ padding: '20px', borderRadius: '10px', border: 'none' }}>
        <h5 style={{ color: '#343a40', fontSize: '18px', fontWeight:'bold' }}>List of Departments</h5>
        <Row>
          <Col className="text-start">
            <h6 style={{ color: '#B5B5C3', fontSize: '13px' }}>{departments.length} Departments</h6>
          </Col>
          <Col className="text-end">
            <Button onClick={handleAddDepartment} style={{
              border: 'none',
              fontSize: '12px',
              borderRadius: '27px',
              padding: '8px 20px',
              
              backgroundColor: '#0089FF',
              color: '#FFFFFF',
              marginTop: '-44px',
              width: '35%'
            }}>
              Add Department
            </Button>
          </Col>
        </Row>
        <Table className="mt-3" style={{ borderBottom: 'none' }}>
          <thead>
            <tr style={{ fontSize: '12px' }}>
              <th className='text-left ps-3'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Department Name</th>
              <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Created Date</th>
              <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Edit</th>
              <th className='text-center'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold', borderBottom: 'none'}}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((department) => (
              <React.Fragment key={department.id}>
                {(isAdding && department.id === departments[0].id) && (
                  <tr style={{ borderBottom: 'none'}}>
                    <td style={{  textAlign:'center', fontSize: '12px', color: '#000000', borderBottom: 'none' }}>
                      <FormControl
                        type="text"
                        value={newDepartmentName}
                        onChange={(e) => setNewDepartmentName(e.target.value)}
                        placeholder=""
                        style={{
                          width: '60%',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          fontSize:'12px'
                        }}
                      />
                    </td>
                    <td style={{ fontSize: '12px', color: '#464E5F', borderBottom: 'none' }}></td>
                    <td style={{ borderBottom: 'none', textAlign: 'center' }}>
                      <Button onClick={handleSaveNewDepartment} style={{ fontSize: '12px', backgroundColor: '#0089FF', borderRadius: '23px', paddingLeft: '20px', paddingRight: '20px', border: 'none' }}>
                        Submit
                      </Button>
                    </td>
                    <td style={{ borderBottom: 'none', textAlign:'center' }}>
                      <Button onClick={handleCancel} style={{color:'#FF0000', fontSize: '12px', fontWeight:'bold',backgroundColor: 'white', borderRadius: '23px', paddingLeft: '20px', paddingRight: '20px', border:'2px solid #FF0000' }}>
                        Cancel
                      </Button>
                    </td>
                  </tr>
                )}
                {editingId === department.id ? (
                  <tr style={{ borderBottom: 'none' }}>
                    <td style={{ fontSize: '12px', color: '#000000', borderBottom: 'none', paddingLeft: '20px' }}>
                      <FormControl
                        type="text"
                        value={newDepartmentName}
                        onChange={(e) => setNewDepartmentName(e.target.value)}
                        placeholder=""
                        style={{
                          width: '60%',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          fontSize: '12px'
                        }}
                      />
                    </td>
                    <td style={{ borderBottom: 'none' }}></td>
                    <td style={{ borderBottom: 'none', textAlign: 'center' }}>
                      <Button onClick={() => handleSaveEdit(department.id)} style={{ fontSize: '12px', backgroundColor: '#0089FF', borderRadius: '23px', paddingLeft: '20px', paddingRight: '20px', border: 'none' }}>
                        Submit
                      </Button>
                    </td>
                    <td style={{ borderBottom: 'none', textAlign: 'center' }}>
                      <Button onClick={handleEditCancel} style={{color:'#FF0000', fontSize: '12px', fontWeight:'bold',backgroundColor: 'white', borderRadius: '23px', paddingLeft: '20px', paddingRight: '20px', border:'2px solid #FF0000' }}>
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ) : (
                  <tr style={{ borderBottom: 'none' }}>
                    <td style={{ textAlign:'left', fontSize: '12px', color: '#000000', borderBottom: 'none', paddingLeft: '50px' }}>{department.name}</td>
                    <td style={{  textAlign:'center',fontSize: '12px', color: '#464E5F', borderBottom: 'none' }}>
                      {department.createdDate}
                      <br />
                      <span style={{ textAlign:'center', fontSize: '12px', color: '#B5B5C3' }}>{department.createdTime}</span>
                    </td>
                    <td style={{ textAlign:'center', borderBottom: 'none' }}>
                      <Button onClick={() => handleEdit(department.id, department.name)} variant="link">
                        <img src={editIcon} alt="Edit" style={{ width: '25px' }} />
                      </Button>
                    </td>
                    <td style={{ textAlign:'center', borderBottom: 'none' }}>
                      <Button onClick={() => handleDelete(department.id)} variant="link">
                        <img src={deleteIcon} alt="Delete" style={{ width: '25px' }} />
                      </Button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
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

export default DepartmentTable;
