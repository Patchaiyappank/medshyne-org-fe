import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import './AccessPopup.css';
import deleted from '../assets/deleted.png';
import edit from '../assets/edit.png';
import view from '../assets/View.png';
import { MyContext } from '../ProjectContext';


const AccessControl = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const {getLoginCredentials,setLoginCredentials} = useContext(MyContext);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [divisionsList, setDivisionsList] = useState([]);
  const modalRef = useRef(null);
  // const [selectOrganization, setSelectOrganization] = useState(() => {
  //   return getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
  // });


  const [selectOrganization, setSelectOrganization] = useState(() => {
    const storedOrganization = sessionStorage.getItem('organization');
    return storedOrganization ? storedOrganization : getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
  });
  
  useEffect(() => {
    sessionStorage.setItem('organization', selectOrganization);
  }, [selectOrganization]);

  // useEffect(() => {
  //   axios.get(`${baseApiUrl}/access_level${selectOrganization}`)

  //     .then(response => {
    
  //       setDepartmentsList(response.data.departments);
  //       setClassesList(response.data.classes);
  //       setDivisionsList(response.data.divisions);
  //     })
  //     .catch(error => {
  //       console.error('Error retrieving data: ', error);
  //     });
  // }, []);

  useEffect(() => {
    // Ensure that selectOrganization is properly formatted
    const queryParams = `?organization_name=${encodeURIComponent(selectOrganization)}`;
  
    axios.get(`${baseApiUrl}/access_level${queryParams}`) // Correctly append the query parameter
      .then(response => {
        setDepartmentsList(response.data.departments);
        setClassesList(response.data.classes);
        setDivisionsList(response.data.divisions);
      })
      .catch(error => {
        console.error('Error retrieving data: ', error);
      });
  }, [selectOrganization]); // Ensure selectOrganization is defined and valid
  
  
  

  const handleCloseModal = () => setShowModal(false);

  const handleDepartmentChange = (selectedDepartment) => {
    if (departments.some(dep => dep.id === selectedDepartment.id)) {
      setDepartments(departments.filter(dep => dep.id !== selectedDepartment.id));
    } else {
      setDepartments([...departments, selectedDepartment]);
    }
  };

  const handleClassChange = (selectedClass) => {
    if (classes.some(cls => cls.id === selectedClass.id)) {
      setClasses(classes.filter(cls => cls.id !== selectedClass.id));
    } else {
      setClasses([...classes, selectedClass]);
    }
  };

  const handleDivisionChange = (selectedDivision) => {
    if (divisions.some(div => div.id === selectedDivision.id)) {
      setDivisions(divisions.filter(div => div.id !== selectedDivision.id));
    } else {
      setDivisions([...divisions, selectedDivision]);
    }
  };

  const handlePermissionChange = (permission) => {
    if (permission === 'edit') {
      if (selectedPermissions.includes(1)) {
        setSelectedPermissions(selectedPermissions.filter(p => p !== 1));
        // Also deselect 'view' if 'edit' is deselected
        setSelectedPermissions(selectedPermissions.filter(p => p !== 0));
      } else {
        setSelectedPermissions([...selectedPermissions, 1, 0]); // Select both 'edit' and 'view'
      }
    } else if (permission === 'delete') {
      if (selectedPermissions.includes(2)) {
        setSelectedPermissions(selectedPermissions.filter(p => p !== 2));
      } else {
        setSelectedPermissions([...selectedPermissions, 2, 1, 0]);
      }
    } else { // permission === 'view'
      if (selectedPermissions.includes(0)) {
        setSelectedPermissions(selectedPermissions.filter(p => p !== 0));
      } else {
        setSelectedPermissions([...selectedPermissions, 0]);
      }
    }
  };

  const handleAllDepartmentsSelect = () => {
    if (departments.length === departmentsList.length) {
      setDepartments([]);
    } else {
      setDepartments(departmentsList.map(dep => ({ name: dep.department, id: dep.id })));
    }
  };

  
  const handleAllClassesSelect = () => {
    if (classes.length === classesList.length) {
      setClasses([]);
    } else {
      setClasses(classesList.map(cls => ({ name: cls.classes, id: cls.id })));
    }
  };


  const handleAllDivisionsSelect = () => {
    if (divisions.length === divisionsList.length) {
      setDivisions([]);
    } else {
      setDivisions(divisionsList.map(division => ({ name: division.division, id: division.id })));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const departmentUpdates = departments.map(dep => ({
      id: dep.id,
      access_level: selectedPermissions.includes(2) ? 2 : selectedPermissions.includes(1) ? 1 : 0
    }));

    const classUpdates = classes.map(cls => ({
      id: cls.id,
      access_level: selectedPermissions.includes(2) ? 2 : selectedPermissions.includes(1) ? 1 : 0
    }));

    const divisionUpdates = divisions.map(div => ({
      id: div.id,
      access_level: selectedPermissions.includes(2) ? 2 : selectedPermissions.includes(1) ? 1 : 0
    }));

    axios.put(`${baseApiUrl}/update_department_accesslevel`, { departments: departmentUpdates })
      .then(response => console.log(response.data))
      .catch(error => console.error('Error updating department access levels:', error));

    axios.put(`${baseApiUrl}/update_classes_accesslevel`, { classes: classUpdates })
      .then(response => console.log(response.data))
      .catch(error => console.error('Error updating classes access levels:', error));

    axios.put(`${baseApiUrl}/update_divisions_accesslevel`, { divisions: divisionUpdates })
      .then(response => console.log(response.data))
      .catch(error => console.error('Error updating divisions access levels:', error));

    handleCloseModal(); // Close modal after submission
  };

  const handleCancel = () => {
    setDepartments([]);
    setClasses([]);
    setDivisions([]);
    setSelectedPermissions([]);
    handleCloseModal();
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleCloseModal();
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      backdrop="true"
      size="lg"
      className="modal-fullscreen"
      onClick={handleBackdropClick}
    >
      <Modal.Body>
        <Container ref={modalRef} className="h-100 access-control-container rounded-card">
          <Row className="align-items-center">
            <Col xs={12}>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <h5 className="text-left">Access Level</h5>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col xs={12} sm={12} md={12} className="mb-1">
                  <Button
                    variant="outline-primary"
                    onClick={() => handlePermissionChange('view')}
                    className={`mx-1 view-btn ${selectedPermissions.includes(0) ? 'active' : ''}`}
                    size="sm"
                    block
                  >
                    <img src={view} alt="View Icon" className="icon-img" style={{ height: 18, width: 18, marginRight: 5, backgroundColor: 'white', borderRadius: '50%' }} /> View
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => handlePermissionChange('edit')}
                    className={`mx-1 edit-button ${selectedPermissions.includes(1) ? 'active' : ''}`}
                    size="sm"
                    block
                  >
                    <img src={edit} alt="Edit Icon" className="icon-img" style={{ height: 18, width: 18, marginRight: 5, backgroundColor: 'white', borderRadius: '50%' }} /> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => handlePermissionChange('delete')}
                    className={`mx-1 delete-btn ${selectedPermissions.includes(2) ? 'active' : ''}`}
                    size="sm"
                    block
                  >
                    <img src={deleted} alt="Delete Icon" className="icon-img" style={{ height: 18, width: 18, marginRight: 5, backgroundColor: 'white', borderRadius: '50%' }} /> Delete
                  </Button>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col md={12}>
                  <div className="d-flex align-items-center">
                    <h5>Department</h5>
                    <Button
                      variant="outline-secondary"
                      onClick={handleAllDepartmentsSelect}
                      className={`ml-2 all-select-btn ${departments.length === departmentsList.length ? 'active' : ''}`}
                      size="sm"
                    >
                      All select
                    </Button>
                  </div>
                  <div className="d-flex flex-wrap">
                    {departmentsList.map((department) => (
                      <Button
                        key={department.id}
                        variant={departments.some(dep => dep.id === department.id) ? 'primary' : 'outline-primary'}
                        className="mx-1 department-btn"
                        onClick={() => handleDepartmentChange({ name: department.department, id: department.id })}
                        size="sm"
                      >
                        {department.department}
                      </Button>
                    ))}
                  </div>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col md={10}>
                  <div className="d-flex align-items-center">
                    <h5>Classes</h5>
                    <Button
                      variant="outline-secondary"
                      onClick={handleAllClassesSelect}
                      className={`ml-2 all-select-btn ${classes.length === classesList.length ? 'active' : ''}`}
                      size="sm"
                    >
                      All select
                    </Button>
                  </div>
                  <div className="d-flex flex-wrap">
                    {classesList.map((classData) => (
                      <Button
                        key={classData.id}
                        variant={classes.some(cls => cls.id === classData.id) ? 'primary' : 'outline-primary'}
                        className="mx-1 classes-btn"
                        onClick={() => handleClassChange({ name: classData.classes, id: classData.id })}
                        size="sm"
                      >
                        {classData.classes_name}
                      </Button>
                    ))}
                  </div>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col md={10}>
                  <div className="d-flex align-items-center">
                    <h5>Division</h5>
                    <Button
                      variant="outline-secondary"
                      onClick={handleAllDivisionsSelect}
                      className={`ml-2 all-select-btn ${divisions.length === divisionsList.length ? 'active' : ''}`}
                      size="sm"
                    >
                      All select
                    </Button>
                  </div>
                  <div className="d-flex flex-wrap">
                    {divisionsList.map((division) => (
                      <Button
                        key={division.id}
                        variant={divisions.some(div => div.id === division.id) ? 'primary' : 'outline-primary'}
                        className="mx-1 division-btn"
                        onClick={() => handleDivisionChange({ name: division.division, id: division.id })}
                        size="sm"
                      >
                        {division.division}
                      </Button>
                    ))}
                  </div>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col xs={12} className="text-center mb-4">
                <br/> <br/>
                  <Row>
                    <Col xs={6} sm={6} md={6} className="text-center mb-1">
                      <Button
                        variant="outline-danger"
                        className="btn-cancel mb-2"
                        onClick={handleCancel}
                        block
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </Col>
                    <Col xs={6} sm={6} md={6} className="text-center mb-1">
                      <Button
                        variant="outline-primary"
                        className="btn-submit mb-2"
                        onClick={handleSubmit}
                        block
                        size="sm"
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default AccessControl;