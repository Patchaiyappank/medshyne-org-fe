import React, { useState, useEffect, useContext } from 'react';
// import './designation.css';
import './designation.css';
import del from './delete.png';
import edi from './edit.png';
import buttons from './buttoninss.png';
import access from './buttonin.png';
import AccessPopup from './AccessPopup';
import './AccessPopup.css'; 
import searchIcon from "./Search.png";
import poke from "./sideimage.png";
import { MyContext } from '../ProjectContext';

function Designation() {
  const [designations, setDesignations] = useState(() => {
   // const storedData = localStorage.getItem('designations');
   const storedData='';
    //return storedData ? JSON.parse(storedData) : [];
    return[];
  });
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [searchTerm, setSearchTerm] = useState('');
  const [editDesignationName, setEditDesignationName] = useState('');
  const [editDesignationRole, setEditDesignationRole] = useState('');
  const [showAddRow, setShowAddRow] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newDesignation, setNewDesignation] = useState({ id: '', name: '', role: '' });
  const [hiddenID, setHiddenID] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null); 
  const [showAccessPopup, setShowAccessPopup] = useState(false); 
  const [showPopup, setShowPopup] = useState(false);
  const [designationIdToDelete, setDesignationIdToDelete] = useState(null);
  const [departments, setDepartments] = useState([]); 
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [organization_name, setOrganization_name]=useState([]);
  const {getLoginCredentials,setLoginCredentials} = useContext(MyContext);
  //const [selectOrganization, setSelectOrganization] = useState(getLoginCredentials[0].organization_name);
  // const [selectOrganization, setSelectOrganization] = useState(() => {
  //   return getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
  // });  const [selectOrganization, setSelectOrganization] = useState(() => {
    

    const [selectOrganization, setSelectOrganization] = useState(() => {
      const storedOrganization = sessionStorage.getItem('organization');
      return storedOrganization ? storedOrganization : getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
    });
    
    useEffect(() => {
      sessionStorage.setItem('organization', selectOrganization);
    }, [selectOrganization]);




  const [error, setError] = useState(false);
 const ITEMS_PER_PAGE=5;
  
 const handleError = () => {
  setError(editDesignationName === '' || editDesignationRole === '');
}

 useEffect(() => {
  let term = searchTerm;
  let filtered;
  filtered = designations.filter((department) => {
    return department.designation_role.toLowerCase().includes(term.toLowerCase());
  });
  console.log("filter response: ", filtered);
  setDesignations(filtered);
  if (
    term == "" ||
    filtered == undefined ||
    filtered == null ||
    filtered.length == 0
  ) {
    fetchData();
  }
}, [searchTerm]);

useEffect(() => {
  let term = searchTerm.toLowerCase();
  let filtered;
  if (term === "" || !designations || designations.length === 0) {
    filtered = designations; // If the search term is empty or departments is not yet fetched, use the original departments
  } else {
    filtered = designations.filter((designation) => {
      return designation.department.toLowerCase().includes(term);
    });
  }
  setFilteredDesignations(filtered);
}, [searchTerm, designations]);


  useEffect(() => {
    //  fetchDesignations();
    fetchData();
     fetchDepartments();
    
  }, []); 



  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAdd = () => {
    setShowAddRow(true)
    
    setEditDesignationName("");
    setEditDesignationRole("");
   
   
  };


  const fetchData =  () => {
    try {
   
     fetch(`${baseApiUrl}/view_designation?organization_name=${selectOrganization}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json()).then(data =>{
        console.log('Response view_department data is:', data);
        setDesignations(data.result);
        
      }).catch((err) =>   console.log('Response view_department data  error is:', err));
    
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${baseApiUrl}/department_dropdown?organization_name=${selectOrganization}`);
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.data);
      } else {
        throw new Error('Failed to fetch departments');
      }
    } catch (error) {
      console.error(error);
    }
  };
 
  const handleAddDesignation = async () => {
    handleError();
    if (editDesignationName.trim() !== '' && editDesignationRole.trim() !== '') {
      try {
        const userData = {
          organization_name:selectOrganization,
          department: editDesignationName,
          designation_role: editDesignationRole
        };
  
        const response = await fetch(`${baseApiUrl}/add_designation`, {
          method: 'POST',
          body: JSON.stringify(userData),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          const lastInsertedID = data.result.insertId;
          setHiddenID(lastInsertedID);

          const newDesignationEntry = {
            id: lastInsertedID,
            name: editDesignationName,
            role: editDesignationRole,
            // createdDate: new Date().toLocaleDateString()
          };
  
          // Update state with the new designation appended to the existing array
          setDesignations(prevDesignations => [...prevDesignations, newDesignationEntry]);
  
          // Clear input fields and reset state
          setEditDesignationName('');
          setEditDesignationRole('');
          setShowAddRow(false);
          alert('Data added successfully!');
          fetchData();
        } else {
          throw new Error('Failed to add data');
        }
      } catch (error) {
        console.error(error);
        alert('Failed to add data');
      }
    }
  };

  const handleEditDesignationNameChange = (e) => {
    //alert('Edit designation value is :' + e.target.value);
    setEditDesignationName(e.target.value);
  }

 const handleEditDesignationRole = (e)=>
 {
  //alert('Edit designation role '+ e.target.value+' selected ');
  setEditDesignationRole(e.target.value);
 }
  
 const handleEdit = (index) => {
  const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
  setEditIndex(globalIndex);
  setEditDesignationName(designations[globalIndex].department);
  setEditDesignationRole(designations[globalIndex].designation_role);
};

  const handleUpdate = async (id, designationName, designationRole, index) => {
   // let desigName = designationName;
   // let desigRole = designationRole;
    alert('id ' + id + " " + editDesignationName + " " + editDesignationRole + " " + index);
    
    if (editDesignationName !== '' && editDesignationRole.trim() !== '' && editDesignationName !== null && editDesignationRole !== null) {
      try {
        const designationData = {
          id: Number(id),
          department: editDesignationName,
          designation_role: editDesignationRole,
          updated_by: 'user',
        };
        console.log('Designation Data :', designationData);
        
        const response = await fetch(`${baseApiUrl}/update_designtion`, {
          method: 'PUT',
          body: JSON.stringify(designationData),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          
          const updatedDesignations = [...designations];
          updatedDesignations[index] = {
            ...updatedDesignations[index],
            name: designationName, // Update local state with the edited name
            role: designationRole // Update local state with the edited role
          };
  
          //setDesignations(updatedDesignations);
          fetchData();
  
          alert('Designation updated successfully!');
        } else {
          console.log('Error API response', response);
          throw new Error('Failed to update designation');
        }
      } catch (error) {
        console.error(error);
        console.log('error API', error);
        alert('Failed to update designation');
      } finally {
        setEditIndex(null);
        setEditDesignationName('');
        setEditDesignationRole('');
      }
   }
  };
  

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${baseApiUrl}/delete_designation`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id }) // Assuming id is the id of the department you want to delete
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Optional: Log the response data
        alert('Department deleted successfully!');
        setShowPopup(false);
       fetchData();
      } else {
        throw new Error('Failed to delete department');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete department');
    }
  };
  

  const handlePopupaccesslevel = () => {
    setShowAccessPopup(!showAccessPopup);
  };


  const totalPages = Math.ceil(designations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDesignations = designations.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <span
          key={1}
          className={`desigantionpagination-page ${currentPage === 1 ? "active" : ""}`}
          onClick={() => handlePageChange(1)}
        >
          1
        </span>
      );

      if (startPage > 2) {
        pageNumbers.push(<span key="startEllipsis">{ellipsis}</span>);
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push(
        <span
          key={page}
          className={`desigantionpagination-page ${currentPage === page ? "active" : ""}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </span>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="endEllipsis">{ellipsis}</span>);
      }

      pageNumbers.push(
        <span
          key={totalPages}
          className={`desigantionpagination-page ${currentPage === totalPages ? "active" : ""}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </span>
      );
    }

    return pageNumbers;
  };
  

  return (
    <div className='desigantion-head'>
   <img
       
        src={poke}
        className="designation-bgimage"
        alt="Background"
      />
      <h2 className='desigantionheading'>Designation</h2>
     
       
      <div style={{marginTop:'-40px'}} className="designation-search me-5 ">
        <div className="designation-search-container">
          <div className="designation-flex">
            <input
            
              className="designation-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchTermChange(e)}
              placeholder=" Search..."
            />
            <div className="designation-search-icon">
              <img
              
                src={searchIcon}
                alt="Search Icon"
                className="designation-searchimage"
              />
            </div>
          </div>
        </div>
       
        <div className="designation-buttoncont" >
          <button
            className="designation-addbutton"
            // style={{
            //   backgroundColor: "#0089FF",
            //   fontSize: "14px",
            //   color: "white",
            // }}
            onClick={() => handleAdd()}
          >Add Designation
          </button>
        </div>
       
      </div>

      <br />
      <br />
      <div className='desigantion-border-container'>
        <table className="desigantion-table">
          <thead>
            <tr className='clr'>
              <th className='designation-hidden'></th>
              <th>Designation</th>
              <th>Department</th>
              <th>Access Level</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className='designation-total'>
        {searchTerm.trim() === '' && showAddRow && (
              <tr className='designation-table-row'>
                <td><input id="hidInput" type='hidden'className='designation-hidden' value={hiddenID}></input></td>
                <td>
                  <div className='desigantioncar'>
                    <div >
                      <input
                        type="text"
                        className={`department-headname ${'designation-input-error' ? 'desigantioncard-like' : ''}`} 
                        value={editDesignationRole}
                        onChange={(e) => setEditDesignationRole(e.target.value)}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className='desigantioncard'>
                    <div>
                      <select
                        value={editDesignationName}
                        className={`department-headname form-select defaultchangeee ${'designation-input-error' ? 'desigantioncard-like3' : ''}`} 
                        onChange={(e) => setEditDesignationName(e.target.value)}
                      >
                        <option value="">
                        </option>
                        {departments.map((department, index) => (
                          <option key={index} value={department}>{department}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </td>
                <td>
                  <div className='desigantionaccess'>
                    <img src={buttons} width={25} height={25} alt="Access Level Icon" />
                  </div>
                </td>
                <td>
                  <div className='desigantionbutton-row'>
                    <button className='designation-submit-button' onClick={handleAddDesignation}>
                      Submit
                    </button>
                  </div>
                </td>
                <td>
                  <div className='desigantionbutton-cancel'>
                    {showAddRow && (
                      <button className='designation-cancel-button' onClick={() => setShowAddRow(false)}>Cancel</button>
                    )}
                  </div>
                </td>
              </tr>
            )}
            
            {currentDesignations.map((designation, index) => {
              const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
              return (
                <tr key={index}>
                  <td>
                    <input type="hidden" value={designation.id} />
                  </td>
                  <td style={{ display: 'none' }}>{designation.id}</td>
                  <td>
                    {globalIndex === editIndex ? (
                      <input
                        className="department-headname2  "
                        type="text"
                        value={editDesignationRole}
                        onChange={handleEditDesignationRole}
                      />
                    ) : (
                      designation.designation_role
                    )}
                  </td>
                  <td>
                    {globalIndex === editIndex ? (
                      <select
                        value={editDesignationName}
                        className="desigantioncard-like1 form-control form-select defaultchangeee department-headname3"
                        onChange={handleEditDesignationNameChange}
                      >
                        <option value=""></option>
                        {departments.map((department, index) => (
                          <option key={index} value={department}>
                            {department}
                          </option>
                        ))}
                      </select>
                    ) : (
                      designation.department
                    )}
                  </td>
                  <td>
                    <div className="designationaccess">
                      <img
                        src={buttons}
                        alt="Access Level Icon"
                        onClick={handlePopupaccesslevel}
                        style={{ width: '25px', height: '25px', marginRight: '1px' }}
                      />
                    </div>
                  </td>
                  <td>
                    {globalIndex === editIndex ? (
                      <div className="designation-edit-container" style={{display:'flex',justifyContent:'space-between' }}>
                        <button
                          className="designationedit-submit-button"
                          onClick={() =>
                            handleUpdate(
                              designation.id,
                              designation.department,
                              designation.designation_role,
                              globalIndex
                            )
                          }
                        >
                          Submit
                        </button>
                        <button
                          className="designationedit-cancel-button"
                          onClick={() => setEditIndex(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="designationedit" onClick={() => handleEdit(index)}>
                        <img src={edi} width={30} />
                      </div>
                    )}
                  </td>
                  <td>
                    {globalIndex !== editIndex && (
                      <div className="designationdel">
                        <img
                          src={del}
                          onClick={() => {
                            setShowPopup(true);
                            setDesignationIdToDelete(designation.id);
                          }}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>



      {showPopup && (
        <div className="popup1-overlay">
      
          <div className="popup1-container">
            <p className="deleteappoint1">
              {" "}
              Designation{" "}
              <button
                className="close-button1"
                onClick={() => setShowPopup(false)}
              >
                ×
              </button>
            </p>
            <p className="popuppara1">
              Would you like to delete the designation from<br/>the list?
            </p>
            <div className="popup1-buttons">
              <button className="cancel1" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
              <button
                className="delete1"
                onClick={() => handleDelete(designationIdToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

<div className="staffkkkk-pagination">
        <span className="staffkkkk-prevoius-arrow" onClick={() => handlePageChange(currentPage - 1)}>&#8249;</span>
          <span className="staffkkkk-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </span>
          <span className="staffkkkk-pagination-pages">
            {renderPageNumbers()}
          </span>
          <span className="staffkkkk-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
            Next 
          </span>
          <span className="staffkkkk-next-arrow" onClick={() => handlePageChange(currentPage + 1)}>&#8250;</span>
        </div>
      {showAccessPopup && (
        <div className="popup-accessss">
          <div className="popup-cardddd">
            <div className="popup-content-container">
             
              <AccessPopup />
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default Designation;