import React, { useState, useEffect, useContext } from "react";
import "./depert.css";
import deleteIcon from "./delete.png";
import editIcon from "./edit.png";
import accessIcon from "./equal.png";
import searchIcon from "./Search.png";
import bgImage from "./department.jpg";
import { MyContext } from '../ProjectContext';


function Department() {
  const { getLoginCredentials, setLoginCredentials } = useContext(MyContext);
  const [departments, setDepartments] = useState([]);
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [searchTerm, setSearchTerm] = useState("");
  const [editDepartmentName, setEditDepartmentName] = useState("");
  const [showAddRow, setShowAddRow] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [hiddenID, setHiddenID] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [departmentIdToDelete, setDepartmentIdToDelete] = useState(null);
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

  const [error, setError] = useState(false);
  const ITEMS_PER_PAGE = 5;
  useEffect(() => {
    fetchData();
  }, []);

  const handleError = () => {
    setError(editDepartmentName === '');
  }

  useEffect(() => {
    let term = searchTerm.toLowerCase();
    let filtered;
    if (term === "" || !departments || departments.length === 0) {
      filtered = departments;
    } else {
      filtered = departments.filter((department) => {
        return department.department.toLowerCase().includes(term);
      });
    }
    setFilteredDepartments(filtered);
  }, [searchTerm, departments]);

  const fetchData = () => {
    try {
      fetch(`${baseApiUrl}/view_department?organization_name=${selectOrganization}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Response view_department data is:", data);
          setDepartments(data.result);
          setFilteredDepartments(data.result); // Ensure filteredDepartments is also set
        })
        .catch((err) =>
          console.log("Response view_department data  error is:", err)
        );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddDepartment = async () => {
    if (editDepartmentName.trim() !== "") {
      try {
        const departmentData = {
          organization_name:selectOrganization,
          department: editDepartmentName,
        };
  
        const response = await fetch(`${baseApiUrl}/adddepartment`, {
          method: "POST",
          body: JSON.stringify(departmentData),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          const lastInsertedID = data.result.insertId;
          setHiddenID(lastInsertedID);
  
          const newDepartmentEntry = {
            id: lastInsertedID,
            department: editDepartmentName,
            created_date: new Date().toLocaleDateString(),
          };
  
          setDepartments((prevDepartments) => [
            ...prevDepartments,
            newDepartmentEntry,
          ]);
          setEditDepartmentName("");
          setShowAddRow(false);
          alert("Data added successfully!");
          fetchData();
        } else {
          throw new Error("Failed to add data");
        }
      } catch (error) {
        console.error(error);
        alert("Failed to add data");
      }
    } else {
      alert("Please enter a department name.");
    }
  };
  

  const handleAddRowCancel = () => {
    setShowAddRow(false);
    setEditDepartmentName("");
  };

  const handleEdit = (index) => {
    const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
    setEditDepartmentName(filteredDepartments[globalIndex].department);
    setEditIndex(globalIndex);
  };

  const handleUpdate = async (id, departmentName, index) => {
    let deptName = editDepartmentName;
    if (deptName.trim() !== "" && deptName !== null) {
      try {
        const departmentData = {
          id: Number(id),
          department: deptName,
          updated_by: "user",
        };
        console.log("Department Data :", departmentData);
        const response = await fetch(`${baseApiUrl}/updatedepartment`, {
          method: "PUT",
          body: JSON.stringify(departmentData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);

          const updatedDepartments = [...departments];
          updatedDepartments[index] = {
            ...updatedDepartments[index],
            department: editDepartmentName,
          };

          fetchData();
          alert("Department updated successfully!");
        } else {
          console.log("Error API response", response);
          throw new Error("Failed to update department");
        }
      } catch (error) {
        console.error(error);
        console.log("error API", error);
        alert("Failed to update department");
      } finally {
        setEditIndex(null);
        setEditDepartmentName("");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${baseApiUrl}/deletedepartment`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert("Department deleted successfully!");
        setShowPopup(false);
        fetchData();
      } else {
        throw new Error("Failed to delete department");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete department");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const totalPages = Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDepartments = filteredDepartments.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";
    const totalPages = Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE);

    //calculate the starting page number
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust the starting page number if necessary
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
     //Generate page numbers
    if (startPage > 1) {
      pageNumbers.push(
        <span
          key={1}
          className={`departmentpagination-page ${
            currentPage === 1 ? "active" : ""
          }`}
          onClick={() => handlePageChange(1)}
        >
          {1}
        </span>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="ellipsisStart" className="ellipsis">{ellipsis}</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`departmentpagination-page ${
            currentPage === i ? "active" : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </span>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="ellipsisEnd" className="ellipsis">{ellipsis}</span>);
      }
      pageNumbers.push(
        <span
          key={totalPages}
          className={`departmentpagination-page ${
            currentPage === totalPages ? "active" : ""
          }`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </span>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="department-head">
      <img
        src={bgImage}
        className="department-bgimage"
        alt="Background"
      />
      <h2 className="department-depthead">
        Department
      </h2>

      <div className="department-search">
        <div className="department-search-container">
          <div className="department-flex">
            <input
              className="department-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e)}
              placeholder=" Search...."
            />
            <div className="department-search-img">
              <img
                src={searchIcon}
                alt="Search Icon"
                className="department-searchimage"
              />
            </div>
          </div>
        </div>
     
        <div className="department-buttoncont">
          <button
            className="department-addbutton"
            onClick={() => setShowAddRow(true)}
          >
            Add Department
          </button>
        </div>
      </div>

      <br />
      <br />
      <div className="department-border-container">
        <table className="department-table">
          <thead  className="department-head2">
            <tr > 
              <th className="dept-head" >Department Name</th>
              <th className="dept-head">Created Date</th>
              <th className="dept-head" >Edit</th >
              <th className="dept-head">Delete</th>
            </tr>
          </thead>
          
          

          <tbody className="department-bodyy  ">
            {showAddRow && (
              <tr >
                <td>
                  <input
                    id="department-input-id"
                    className={error ? 'input-error' : 'input-success'}
                    type="text"
                    value={editDepartmentName}
                    onChange={(e) => setEditDepartmentName(e.target.value)}
                  />
                </td>
                <td className="department-datestyle">
                  {new Date().toLocaleDateString()}
                </td>
                <td>
                  <button className="department-submit-button" onClick={handleAddDepartment}>
                    Submit
                  </button>
                </td>
                <td >
                  <button className="department-cancel-button" onClick={handleAddRowCancel}>
                    Cancel
                  </button>
                </td>
              </tr>
            )}
            {currentDepartments.map((department, index) => {
              const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
              return (
                <tr key={index} className="department-tablerow">
                  <td style={{ display: "none" }}>
                    <input type="hidden" style={{ display: "none" }} value={department.id} />
                    {department.id}
                  </td>
                  <td className="department-border">
                    {editIndex === globalIndex ? (
                      <input
                        type="text"
                        value={editDepartmentName}
                        className="department-headname"
                        onChange={(e) => setEditDepartmentName(e.target.value)}
                      />
                    ) : (
                      department.department
                    )}
                  </td>
                  <td className="department-datemethod">
                    {department.created_date}
                  </td>
                  <td>
                    {editIndex === globalIndex ? (
                      <div className="department-edit-container" style={{display:'flex',justifyContent:'space-between' }}>
                        <button 
                          className="departmentedit-submit-button"
                          onClick={() => handleUpdate(department.id, department.department, globalIndex)}
                        >
                          Submit
                        </button >
                        <button
                          className="departmentedit-cancel-button"
                          onClick={() => setEditIndex(null) }
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="edit" onClick={() => handleEdit(index)}>
                        <img src={editIcon} alt="Edit Icon" className="editicon" />
                      </div>
                    )}
                  </td>
                  <td>
                    {editIndex !== globalIndex && (
                      <div
                        className="department-del"
                        onClick={() => {
                          setShowPopup(true);
                          setDepartmentIdToDelete(department.id);
                        }}
                      >
                        <img
                          src={deleteIcon}
                          width={30}
                          height={30}
                          alt="Delete Icon"
                          className="delete-icon"
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

      {showPopup && (
        <div className="popup1-overlay">
          <div className="popup1-container">
            <p className="deleteappoint1">
              Department
              <button className="close-button1" onClick={() => setShowPopup(false)}>
                ×
              </button>
            </p>
            <p className="popuppara1">Would you like to delete the department from<br/>the list?</p>
            <div className="popup1-buttons">
              <button className="cancel1" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
              <button className="delete1" onClick={() => handleDelete(departmentIdToDelete)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Department;