import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "./Search.png";
import access from "./buttonin.png";
import picture from "../asset/picture.jpg";
import view from "../asset/view-icon.png";
import edit from "../asset/Edit-icon.png";
import Delete from "../asset/delete.png";
import { MyContext } from '../ProjectContext';
import "./StaffList.css";
import "bootstrap/dist/css/bootstrap.min.css";

function StaffList() {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const { getLoginCredentials } = useContext(MyContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [staffData, setStaffData] = useState([]);
  const [filteredStaffData, setFilteredStaffData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  // const [selectOrganization] = useState(() => {
  //   return getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
  // });


  const [selectOrganization, setSelectOrganization] = useState(() => {
    const storedOrganization = sessionStorage.getItem('organization');
    return storedOrganization ? storedOrganization : getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
  });
  
  useEffect(() => {
    sessionStorage.setItem('organization', selectOrganization);
  }, [selectOrganization]);
  
  const [showPopup, setShowPopup] = useState(false);
  const [staffIdToDelete, setStaffIdToDelete] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`${baseApiUrl}/viewallstaff?organization_name=${selectOrganization}`);
      const data = await response.json();

      // Filter out deleted staff
      const activeStaff = data.result.filter(staff => !staff.is_deleted);
      setStaffData(activeStaff);
      setFilteredStaffData(activeStaff); // Initialize filtered data with all staff

      console.log('ViewallStaff Result:', activeStaff);
    } catch (error) {
      console.log('ViewAllStaff Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectOrganization]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    if (term) {
      const filtered = staffData.filter((staff) => staff.name.toLowerCase().startsWith(term));
      setFilteredStaffData(filtered);
    } else {
      setFilteredStaffData(staffData); // Reset to all staff when search is cleared
    }
  }, [searchTerm, staffData]);

  const totalPages = Math.ceil(filteredStaffData.length / ITEMS_PER_PAGE);
  const currentStaff = filteredStaffData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
        <span key={1} className={`staffk-page ${currentPage === 1 ? "active" : ""}`} onClick={() => handlePageChange(1)}>{1}</span>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="ellipsisStart" className="ellipsis">{ellipsis}</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`staffk-page ${currentPage === i ? "active" : ""}`}
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
          className={`staffk-page ${currentPage === totalPages ? "active" : ""}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </span>
      );
    }

    return pageNumbers;
  };

  const handleDelete = () => {
    fetch(`${baseApiUrl}/softdelete_staff?idNumber=${staffIdToDelete}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Result === "Success") {
          // Update staffData by removing the deleted staff
          const updatedStaff = staffData.filter((staff) => staff.id_number !== staffIdToDelete);
          setStaffData(updatedStaff);
          setFilteredStaffData(updatedStaff); // Also update filtered data
          setShowPopup(false);
        } else {
          console.error("Failed to delete staff:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error in deleting staff:", error);
      });
  };

  const handleView = (id_number) => {
    navigate('/StaffDetails', { state: { id_number, mode: 'view' } });
  };

  const handleEdit = (id_number) => {
    navigate('/StaffForm', { state: { id_number, mode: 'edit' } });
  };

  const handlestaffdetails = () => {
    navigate('/StaffForm', { state: { mode: 'new' } });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="staffk-overall-cont">
      <div className="staffk-bg-image">
        <img src={picture} alt="" className="Staffk-img" />
      </div>
      <div>
      <h2 className='staffk-heading'>Staffs</h2>
      </div>
      <div className="staffk-search">
        <div className="staffk-search-container">
          <div className="staffk-flex">
            <input
              className="staffk-search-input"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search ..."
            />
            <div className="staffk-staffksearch-icon">
              <img src={searchIcon} alt="Search Icon" className="staffk-searchimage" />
            </div>
          </div>
        </div>
         
         <div style={{marginTop:'-10px'}} >
          <button className="staffk-addbutton" onClick={handlestaffdetails}>
            Add Staff
          </button>
        </div>
      </div>
      <div>
        <div className="staffk-table-division">
          <table className="staffk-table-container" id="Stafflist-table">
            <thead>
              <tr className="staffk-list-tablehead">
                <th>Profile</th>
                <th>Name</th>
                <th>Designation</th>
                <th>HCR</th>
                <th className="nowrapk-container">Staffs Contact</th>
                <th>Last update</th>
                <th>View</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody className="staffk-table-content">
              {currentStaff.map((staff) => (
                <tr key={staff.id} className="staffk-list-tablehead">
                  <td className="staffk-profile">
                    <img src={staff.profile} alt="" className="staffk-Profile-pic" style={{ marginRight: '15px' }} />
                  </td>
                  <td>{staff.name}</td>
                  <td>{staff.designation}</td>
                  <td>{staff.hcr}</td>
                  <td>+{staff.mobile_number}</td>
                  <td>{staff.updated_at}</td>
                  <td>
                    <button className="staffk-icon" onClick={() => handleView(staff.id_number)} aria-label="View Staff">
                      <img src={view} alt="" className="staffk-table-icon" />
                    </button>
                  </td>
                  <td>
                    <button className="staffk-icon" onClick={() => handleEdit(staff.id_number)} aria-label="Edit Staff">
                      <img src={edit} className="staffk-table-icon" alt="Edit" />
                    </button>
                  </td>
                  <td>
                    <button
                      className="staffk-icon"
                      onClick={() => {
                        setShowPopup(true);
                        setStaffIdToDelete(staff.id_number);
                      }}
                      aria-label="Delete Staff"
                    >
                      <img src={Delete} className="staffk-table-icon" alt="Delete" style={{ marginLeft: '15px' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="staffk-pagination">
        <span className="staffk-prevoius-arrow">&#8249;</span>
          <span className="staffk-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </span>
          <span className="staffk-pagination-pages">
            {renderPageNumbers()}
          </span>
          <span className="staffk-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
            Next 
          </span>
          <span className="staffk-next-arrow">&#8250;</span>
        </div>
      </div>
      {showPopup && (
        <div className="staffk-popup1-overlay">
          <div className="staffk-popup1-container">
            <div className="staffk-deleteappoint1">
              Delete Staff
              <button
                className="staff-close-button1"
                onClick={() => setShowPopup(false)}
              >
                ×
              </button>
            </div>
            <p className="staff-popuppara1">
              Would you like to delete the staff from the list?
            </p>
            <div className="staff-popup1-buttons">
              <button className="staff-cancel1" style={{height:'32px'}}
                onClick={() => setShowPopup(false)}>
                Cancel
              </button>
              <button
                className="staff-delete1" style={{height:'32px'}}
                onClick={() => handleDelete(staffIdToDelete)}
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

export default StaffList;