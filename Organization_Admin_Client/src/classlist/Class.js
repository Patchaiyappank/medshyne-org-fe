import React, { useState, useEffect, useContext} from "react";
import "./Class.css";
import deleteIcon from "./delete.png";
import editIcon from "./edit.png";
import accessIcon from "./equal.png";
import searchIcon from "./Search.png";
import bgImage from "./picture.png";
import { MyContext } from '../ProjectContext';



const ITEMS_PER_PAGE = 5;

function Class() {
  // const baseApiUrl = process.env.REACT_APP_BASE_API_URL;
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [clas, setClas] = useState([]);
  const {getLoginCredentials,setLoginCredentials} = useContext(MyContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [editClass, setEditClass] = useState("");
  const [editDivision, setEditDivision] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editStrength, setEditStrength] = useState("");
  const [editHcr, setEditHcr] = useState("");
  const [editIncharge, setEditIncharge] = useState("");

  const [classIdToDelete, setClassIdToDelete] = useState(null);

  const [showAddRow, setShowAddRow] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [hiddenID, setHiddenID] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredClas, setFilteredClas] = useState([...clas]);
  
  // const [selectOrganization, setSelectOrganization] = useState(getLoginCredentials[0].organization_name);
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


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let term = searchTerm;
    let filtered;
    filtered = clas.filter((department) => {
      return department.department.toLowerCase().includes(term.toLowerCase());
    });
    console.log("filter response: ", filtered);
    setClas(filtered);
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
    if (term === "" || !clas || clas.length === 0) {
      filtered = clas;
    } else {
      filtered = clas.filter((department) => {
        return department.department.toLowerCase().includes(term);
      });
    }
    setFilteredClas(filtered);
  }, [searchTerm, clas]);

  const fetchData = () => {
    try {
      fetch(`${baseApiUrl}/view_all_classes?organization_name=${selectOrganization}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Response view_department data is:", data);
          setClas(data.result);
        })
        .catch((err) =>
          console.log("Response view_department data  error is:", err)
        );
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error appropriately
    }
  };

  // const handleAddClass = async () => {
  //   try {
  //     const classData = {
  //       organization_name:selectOrganization,
  //       classes_name: editClass,
  //       division: editDivision,
  //       department: editDepartment,
  //       strength: editStrength,
  //       HCR: editHcr,
  //       updated_by: editIncharge,
  //     };

  //     const response = await fetch(`${baseApiUrl}/add_class`, {
  //       method: "POST",
  //       body: JSON.stringify(classData),
  //       headers: {
  //         "Content-type": "application/json; charset=UTF-8",
  //       },
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(data);
  //       const lastInsertedID = data.result.insertId;
  //       setHiddenID(lastInsertedID);

  //       const newDepartmentEntry = {
  //         id: lastInsertedID,
  //         name: editClass,
  //         createdDate: new Date().toLocaleDateString(),
  //       };

  //       setClas((prevDepartments) => [...prevDepartments, newDepartmentEntry]);
  //       setEditClass("");
  //       setShowAddRow(false);
  //       alert("Data added successfully!");
  //       fetchData();
  //     } else {
  //       throw new Error("Failed to add data");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to add data");
  //   }
  // };

  const handleAddClass = async () => {
    try {
      const classData = {
        organization_name: selectOrganization,
        classes_name: editClass,
        division: editDivision,
        department: editDepartment,
        strength: editStrength,
        HCR: editHcr,
        updated_by: editIncharge,
      };
  
      const response = await fetch(`${baseApiUrl}/add_class`, {
        method: "POST",
        body: JSON.stringify(classData),
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
          name: editClass,
          createdDate: new Date().toLocaleDateString(),
        };
  
        setClas((prevDepartments) => [...prevDepartments, newDepartmentEntry]);
        setEditClass("");
        setShowAddRow(false);
        alert("Data added successfully!");
        fetchData();
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to add data: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert(`Failed to add data: ${error.message}`);
    }
  };
  

  
  

  const handleAddRowCancel = () => {
    setShowAddRow(false);
    setEditClass("");
    setEditDivision("");
    setEditDepartment("");
    setEditStrength("");
    setEditHcr("");
    setEditIncharge("");
  };

  // const handleEdit = (index) => {
  //   const classToEdit = clas[index];
  //   setEditClass(classToEdit.classes_name);
  //   setEditDivision(classToEdit.division);
  //   setEditDepartment(classToEdit.department);
  //   setEditStrength(classToEdit.strength);
  //   setEditHcr(classToEdit.HCR);
  //   setEditIncharge(classToEdit.updated_by);
  //   setEditIndex(index);
  // };


  const handleEdit = (index) => {
    const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
    const classToEdit = clas[globalIndex];
    setEditClass(classToEdit.classes_name);
    setEditDivision(classToEdit.division);
    setEditDepartment(classToEdit.department);
    setEditStrength(classToEdit.strength);
    setEditHcr(classToEdit.HCR);
    setEditIncharge(classToEdit.updated_by);
    setEditIndex(globalIndex);
  };


  const handleAdd = () => {
    setShowAddRow(true)
    
    setEditClass("");
    setEditDivision("");
    setEditDepartment("");
    setEditStrength("");
    setEditHcr("");
    setEditIncharge("");
   
  };

  const handleUpdate = async (id, index) => {
    //  alert( 'id '+ id +" "+  deptName + " "+ index );
    {
      try {
        const classData = {
          id: Number(id),
          classes_name: editClass,
          division: editDivision,
          department: editDepartment,
          strength: editStrength,
          HCR: editHcr,
          updated_by: editIncharge,
          updated_at: new Date().toLocaleDateString(),
        };
        console.log("Department Data :", classData);
        const response = await fetch(`${baseApiUrl}/update_class_id`, {
          method: "PUT",
          body: JSON.stringify(classData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          fetchData();

          alert("Class updated successfully!");
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
        setEditClass("");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${baseApiUrl}/delete_class_by_id`, {
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

  const totalPages = Math.ceil(filteredClas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentClas = filteredClas.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  const renderPageNumbers= () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(filteredClas.length / ITEMS_PER_PAGE);
  
    // Calculate the starting page number
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
    // Adjust the starting page number if necessary
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
  
    // Generate page numbers
    if (startPage > 1) {
      pageNumbers.push(
        <span key={1} className={`classpagination-page ${currentPage === 1 ? "active" : ""}`} onClick={() => handlePageChange(1)}>{1}</span>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="ellipsisStart" className="ellipsis">{ellipsis}</span>);
      }
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`classpagination-page ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </span>
      );
    }
  
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="ellipsisEnd" className="ellipsis">
        {ellipsis}</span>);
      }
      pageNumbers.push(
        <span
          key={totalPages}
          className={`classpagination-page ${currentPage === totalPages ? "active" : ""}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </span>
      );
    }
  
    return pageNumbers;
  };

  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="class-head">
      <img src={bgImage} className="class-bgimage" alt="Background" />
      <h2 className="class-depthead">Classes</h2>
      <div className="class-search">
        <div className="class-search-container">
          <div className="class-flex">
            <input
              className="class-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e)}
              placeholder="Search..."
            />
            <div className="class-search-img">
              <img
                src={searchIcon}
                alt="Search Icon"
                className="class-searchimage"
              />
            </div>
          </div>
        </div>
       
        <div className="class-buttoncont">
          <button
            className="class-addbutton"
          
            onClick={() => setShowAddRow(true)}
          ><div className="add-cls">Add Classes</div>
            
          </button>
        </div>
      </div>
      <br />
      <br />
      <div className="class-bordercontainer">
        <table className="class-table">
          <thead  className="department-head2">
            <tr>
              <th className="dept-head">Class</th>
              <th className="dept-head">Division</th>
              <th className="dept-head">Department</th>
              <th className="dept-head">Strength</th>
              <th className="dept-head">HCR</th>
              <th className="dept-head">Incharge</th>
              <th className="dept-head">Last update</th>
              <th className="dept-head">Edit</th>
              <th className="dept-head">Delete</th>
            </tr>
          </thead>

          <tbody className="class-body">
            {showAddRow && (
              <tr className="depart" >
                <td className="dept-head" style={{ textAlign: "center", fontSize: "15px"}}>
                  <input
                    className="class-input"
                    type="text"
                    value={editClass}
                    onChange={(e) => setEditClass(e.target.value)}
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  <input
                    className="class-input"
                    type="text"
                    value={editDivision}
                    onChange={(e) => setEditDivision(e.target.value)}
                  />
                </td>
                <td className="dept-head" style={{ textAlign: "center" }}>
                  <input
                    className="class-input"
                    type="text"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                  />
                </td>
                <td className="dept-head" style={{ textAlign: "center" }}>
                  <input
                    className="class-input"
                    type="text"
                    value={editStrength}
                    onChange={(e) => setEditStrength(e.target.value)}
                  />
                </td>
                <td className="dept-head" style={{ textAlign: "center" }}>
                  <input
                    className="class-input"
                    type="text"
                    value={editHcr}
                    onChange={(e) => setEditHcr(e.target.value)}
                  />
                </td>
                <td className="dept-head" style={{ textAlign: "center" }}>
                  <input
                    className="class-input"
                    type="text"
                    value={editIncharge}
                    onChange={(e) => setEditIncharge(e.target.value)}
                  />
                </td>
                <td className="dept-head" style={{ textAlign: "center" }}>
                  {new Date().toLocaleDateString()}
                </td>
                <td style={{ textAlign: "center" }}>
                  {/* <button className='department-submit-button' onClick={handleAddDepartment}> */}
                  <button
                    className="class-submit-button"
                    onClick={handleAddClass}
                  >
                    Submit
                  </button>
                </td>
                <td className="dept-head" style={{ textAlign: "center" }}>
                  <button
                    className="class-cancel-button"
                    onClick={handleAddRowCancel}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            )}
            {currentClas.map((classes, index) => {
  const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
  return (
    <tr key={index} className="class-tablerow">
      <td style={{ display: "none" }}>
        <input type="hidden" style={{ display: "none" }} value={classes.id} />
        {classes.id}
      </td>
      <td className="dept-head" style={{ textAlign: "center" }}>
        {editIndex === globalIndex ? (
          <input
            type="text"
            value={editClass}
            className="class-input"
            onChange={(e) => setEditClass(e.target.value)}
          />
        ) : (
          classes.classes_name
        )}
      </td>
      <td className="dept-head" style={{ textAlign: "center" }}>
        {editIndex === globalIndex ? (
          <input
            type="text"
            value={editDivision}
            className="class-input"
            onChange={(e) => setEditDivision(e.target.value)}
          />
        ) : (
          classes.division
        )}
      </td>
      <td style={{ textAlign: "center" }}>
        {editIndex === globalIndex ? (
          <input
            type="text"
            value={editDepartment}
            className="class-input"
            onChange={(e) => setEditDepartment(e.target.value)}
          />
        ) : (
          classes.department
        )}
      </td>
      <td className="dept-head" style={{ textAlign: "center" }}>
        {editIndex === globalIndex ? (
          <input
            type="text"
            value={editStrength}
            className="class-input"
            onChange={(e) => setEditStrength(e.target.value)}
          />
        ) : (
          classes.strength
        )}
      </td>
      <td  className="dept-head" style={{ textAlign: "center" }}>
        {editIndex === globalIndex ? (
          <input
            type="text"
            value={editHcr}
            className="class-input"
            onChange={(e) => setEditHcr(e.target.value)}
          />
        ) : (
          classes.HCR
        )}
      </td>
      <td className="dept-head" style={{ textAlign: "center" }}>
        {editIndex === globalIndex ? (
          <input
            type="text"
            value={editIncharge}
            className="class-input"
            onChange={(e) => setEditIncharge(e.target.value)}
          />
        ) : (
          classes.updated_by
        )}
      </td>

      <td className="dept-head class-datemethod" style={{ textAlign: "center", fontSize: "15"}}>
        {classes.created_date}
      </td>
      <td style={{ textAlign: "center" }}>
        {editIndex === globalIndex ? (
          <button
            className="class-submit-button"
            onClick={() => handleUpdate(classes.id, index)}
          >
            Submit
          </button>
        ) : (
          <div className="edit" onClick={() => handleEdit(index)}>
            <img src={editIcon} alt="Edit Icon" className="class-editicon" />
          </div>
        )}
      </td>
      <td style={{ textAlign: "center" }}>
                  {editIndex === globalIndex ? (
                    <button
                      className="class-cancel-button"
                      onClick={() => setEditIndex(null)}
                    >
                      Cancel
                    </button>
                  ) : (
                    <div
                      className="class-del"
                      onClick={() => {
                        setShowPopup(true);
                        setClassIdToDelete(classes.id);
                      }}
                    >
                      <img
                        src={deleteIcon}
                        width={30}
                        height={30}
                        alt="DeleteIcon"
                        className="class-delete-icon"
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
        <span className="staffkkkk-prevoius-arrow"  onClick={() => handlePageChange(currentPage - 1)}>&#8249;</span>
          <span className="staffkkkk-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </span>
          <span className="staffkkkk-pagination-pages">
            {renderPageNumbers()}
          </span>
          <span className="staffkkkk-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
            Next 
          </span>
          <span className="staffkkkk-next-arrow"onClick={() => handlePageChange(currentPage + 1)}>&#8250;</span>
        </div>

      {showPopup && (
        <div className="class-popup1-overlay">
          <div className="popup1-container-class">
            <p className="class-deleteappoint1">
              Class
              <button
                className="class-close-button1"
                onClick={() => setShowPopup(false)}
              >
                ×
              </button>
            </p>
            <p className="class-popuppara1">
              Would you like to delete the Class from<br/>the list?
            </p>
            <div className="class-popup1-buttons">
              <button
                className="class-cancel1"  style={{height:'32px'}}
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                className="class-delete1"  style={{height:'32px'}}
                onClick={() => handleDelete(classIdToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Class;