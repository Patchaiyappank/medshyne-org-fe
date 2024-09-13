import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "./Search.png";
import access from "./buttonin.png";
import picture from "./student.png";
import view from "../asset/view-icon.png";
import edit from "../asset/Edit-icon.png";
import Delete from "../asset/delete.png";
import { MyContext } from "../ProjectContext";
import "../studentlist/StudentList.css";
import "bootstrap/dist/css/bootstrap.min.css";

function StudentList() {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const navigate = useNavigate();
  const { getLoginCredentials } = useContext(MyContext);
  // const [selectOrganization, setSelectOrganization] = useState(
  //   getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : ''
  // );


  const [searchTerm, setSearchTerm] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [studentIdToDelete, setStudentIdToDelete] = useState(null);

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStudent = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };



  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 8;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`studentk-page ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </span>
      );
    }
    return pageNumbers;
  };
  const [selectOrganization, setSelectOrganization] = useState(() => {
    const storedOrganization = sessionStorage.getItem('organization');
    return storedOrganization ? storedOrganization : getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
  });
  
  useEffect(() => {
    sessionStorage.setItem('organization', selectOrganization);
  }, [selectOrganization]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = studentData.filter((student) => {
      // Filter by first letter of name
      return student.name && student.name.toLowerCase().startsWith(term);
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when search term changes
  }, [searchTerm, studentData]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`${baseApiUrl}/viewallstudent?organization_name=${selectOrganization}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setStudentData(data.result);
        setFilteredData(data.result); // Initialize filtered data with all students
      })
      .catch((error) => console.error("ViewAllStudent Error:", error));
  };

  const handleView = (id_number) => {
    navigate("/StudentDetails", { state: { id_number, mode: "view" } });
  };

  const handleEdit = (id_number) => {
    navigate("/StudentForm", { state: { id_number, mode: "edit" } });
  };

  const handleAddStudent = () => {
    navigate("/StudentForm", { state: {  mode: "new" } });
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value.trim());
  };

  const handleDelete = () => {
    fetch(`${baseApiUrl}/softdelete_student?idNumber=${studentIdToDelete}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Result === "Success") {
          setStudentData(studentData.filter((student) => student.id_number !== studentIdToDelete));
          setFilteredData(studentData.filter((student) => student.id_number !== studentIdToDelete));
          setShowPopup(false);
        } else {
          console.error("Failed to delete student:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error in deleting student:", error);
      });
  };

  return (
    <div className="studentk-overall-cont">
      <div>
        <img src={picture} alt="" className="studentk-img" />
      </div>
      <h2 className="studentk-heading">Students</h2>
      <div className="studentk-search">
        <div className="studentk-search-container">
          <div className="studentk-flex">
            <input
              className="studentk-search-input"
              type="text"
              value={searchTerm}
              onChange={handleSearchTermChange}
              placeholder="Search..."
            />
            <div className="studentk-studentksearch-icon">
              <img src={searchIcon} alt="Search Icon" className="studentk-searchimage" />
            </div>
          </div>
        </div>
       
        <div className="studentk-buttoncont">
          <button
            className="studentk-addbutton"
            style={{ backgroundColor: "#0089FF", fontSize: "14px", color: "white" }}
            onClick={handleAddStudent}
          >
            Add Student
          </button>
        </div>
      </div>
      <div className="studentk-table-division">
        <table className="studentk-table-container">
          <thead>
            <tr className="studentk-list-tablehead">
              <th>Profile</th>
              <th>Name</th>
              <th>Division</th>
              <th>HCR</th>
              <th className="nowrapk-container">Parents contact</th>
              <th>Last update</th>
              <th>View</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="studentk-table-content">
            {currentStudent.map((student) => (
              <tr key={student.id} className="studentk-list-tablehead">
                <td className="studentk-Profile-pic" style={{ paddingTop: "10px", paddingBottom: "5px" }}>
                  <img src={student.profile} alt="" className="studentk-Profile-pic" />
                </td>
                <td>{student.name}</td>
                <td>{student.division}</td>
                <td>{student.HCR}</td>
                <td>{student.parent_mobile_number}</td>
                <td>{student.last_update}</td>
                <td>
                  <button className="studentk-icon" onClick={() => handleView(student.id_number)} aria-label="View student">
                    <img src={view} alt="" className="student-table-icon" />
                  </button>
                </td>
                <td>
                  <button className="studentk-icon" onClick={() => handleEdit(student.id_number)} aria-label="Edit student">
                    <img src={edit} className="student-table-icon" alt="Edit" />
                  </button>
                </td>
                <td>
                  <button
                    className="studentk-icon"
                    onClick={() => { setShowPopup(true); setStudentIdToDelete(student.id_number); }}
                    aria-label="Delete student"
                  >
                    <img src={Delete} className="student-table-icon" alt="Delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="studentk-pagination">
      <span className="studentk-prevoius-arrow">&#8249;</span>
        <span className="studentk-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </span>
        <span className="studentk-pagination-pages">
          {renderPageNumbers()}
        </span>
        <span className="studentk-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
          Next 
        </span>
        <span className="studentk-next-arrow">&#8250;</span>
      </div>
      {showPopup && (
        <div className="studentk-popup1-overlay">
          <div className="studentk-popup1-container">
            <p className="studentk-deleteappoint1">
              Delete Student
              <button className="studentk-close-button1" onClick={() => setShowPopup(false)}>
                ×
              </button>
            </p>
            <p className="studentk-popuppara1">Are you sure you want to delete this student?</p>
            <div className="studentk-popup1-buttons">
              <button className="studentk-cancel1" onClick={() => setShowPopup(false)}>Cancel</button>
              <button className="studentk-delete1" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;