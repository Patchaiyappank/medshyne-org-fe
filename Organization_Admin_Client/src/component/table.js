import React, { useState, useEffect, useContext } from "react";
import trash from "../assets/trash.png";
import circle from "../assets/addcircle.png";
import "./table.css";
import deleted from "../assets/deleted.png";
import edit from "../assets/edit.png";
import view from "../assets/View.png";
import cancelIcon from "../assets/cancel.png";
import { useNavigate } from "react-router-dom";
import { Button,Modal } from "react-bootstrap";
import { MyContext } from "../ProjectContext";
const ITEMS_PER_PAGE = 5;

const Table = ({ filteredData }) => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const { getLoginCredentials, setLoginCredentials } = useContext(MyContext);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  const [getTemp, setTemp] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [data, setData] = useState([createInitialRow()]);
  const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] = useState(false); // New state
  const [checkboxesArray, setCheckboxesArray] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [consultingIdToDelete, setConsultingIdToDelete] = useState(null);
  // const [selectOrganization, setSelectOrganization] = useState(() => {
  //   return getLoginCredentials && getLoginCredentials[0]
  //     ? getLoginCredentials[0].organization_name
  //     : "";
  // });

  const [selectOrganization, setSelectOrganization] = useState(() => {
    const storedOrganization = sessionStorage.getItem('organization');
    return storedOrganization ? storedOrganization : getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
  });
  
  useEffect(() => {
    sessionStorage.setItem('organization', selectOrganization);
  }, [selectOrganization]);

  const [showMultipleDeletePopup, setShowMultipleDeletePopup] = useState(false);
  const handleTrashIconClick = () => {
    if (selectedRowCount > 0) {
      setShowMultipleDeletePopup(true);
    }
  };

  
  

  const [isAllSelected, setIsAllSelected] = useState(false);

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      // Select all rows
      const allRowIds = data.map((row) => row.consult_id);
      setSelectedRows(allRowIds);
    } else {
      // Deselect all rows
      setSelectedRows([]);
    }

    // Update state for header checkbox and whether any row is selected
    setIsAllSelected(isChecked);
    setIsAnyCheckboxSelected(isChecked && data.length > 0);
  };

  // Handle individual row checkbox
  const handleCheckboxChange = (id, e) => {
    const isChecked = e.target.checked;
    const newSelectedRows = isChecked
      ? [...selectedRows, id]
      : selectedRows.filter((rowId) => rowId !== id);

    setSelectedRows(newSelectedRows);

    // Update state for header checkbox based on row selections
    setIsAllSelected(newSelectedRows.length === data.length);
    setIsAnyCheckboxSelected(newSelectedRows.length > 0);
  };
  
  


  let tempCheckBoxes = [];
  //  const [selectedId, setSelectedId] = useState(null);
  let timeClass = "";
  let statusColorClass = "";
  function createInitialRow() {
    const currentDate = new Date();
    const month = currentDate.toLocaleString("default", { month: "long" });
    const formattedDate = `${month} ${currentDate.getDate()}, ${currentDate.getFullYear()} `;

    return {
      id: "567",
      status: "New",
      subject: "Sharma (Student)",
      hcr: "Sharma",
      stickType: "Fever",
      assignee: "Dr. Nisha",
      date: formattedDate,
    };
  }
  let interval = 0;

  useEffect(() => {
    interval = setInterval(() => {
      fetchTableData();
      //data.
      console.log("Timer Called");
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // localStorage.setItem('consultingData', JSON.stringify(data));
  }, [data]);


  // const handleCheckboxChange = (id, e) => {
  //   //alert('id :' + id);
  //   if (e.target.checked === true) {
  //     setCheckboxesArray([...checkboxesArray, id]);
  //     // alert('Array Length checked '+checkboxesArray.length);
  //   } else {
  //     let chkBox = checkboxesArray.filter((idx) => idx != id);
  //     setCheckboxesArray(chkBox);
  //     //alert('Array Length filter '+checkboxesArray.length);
  //   }
  //   const newSelectedRows = selectedRows.includes(id)
  //     ? selectedRows.filter((rowId) => rowId !== id)
  //     : [...selectedRows, id];

  //   setSelectedRows(newSelectedRows);
  //   setIsAllSelected(newSelectedRows.length === data.length);

  //   // Update the state to reflect whether any checkbox is selected
  //   setIsAnyCheckboxSelected(newSelectedRows.length > 0);
  // };


  const [rowCount, setRowCount] = useState(0);
  const [selectedRowCount, setSelectedRowCount] = useState(0);

  useEffect(() => {
    setRowCount(data.length);
    setSelectedRowCount(selectedRows.length);
  }, [data, selectedRows]);

  const fetchTableData = () => {
    fetch(
      `${baseApiUrl}/viewall_appointment_details?organization_name=${selectOrganization}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);

        const formattedData = data.result.map((row) => {
          // Check if "to_time" exists, if yes, update status to "completed"
          const status = row.to_time ? "completed" : row.status;
          // Format date if needed
          const month_date = formatDate(row.appointment_date);
          return {
            ...row,
            status: status,
            month_date: month_date,
          };
        });
        setData(formattedData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleMultipleDeleteAppointment = () => {
    if (selectedRows.length === 0) {
      alert("No appointments selected for deletion.");
      return;
    }

      fetch(`${baseApiUrl}/Is_deleted_multiple_delete_appointment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ consult_id: selectedRows }), 
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result === "success") {
            alert("Appointments deleted successfully!");
            fetchTableData();
            setSelectedRows([]);
          } else {
            console.error("Error:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });

  };

  const handleDeleteAppointment = (consultId) => {
    console.log("Deleting appointment with consultId:", consultId);

    fetch(`${baseApiUrl}/Is_deleted_multiple_delete_appointment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ consult_id: [consultId] }), // Pass consultId in an array
    })
      .then((response) => response)
      .then((data) => {
        console.log("Delete API Response:", data);

        alert("Department deleted successfully!");
        setShowPopup(false);
        fetchTableData();

        setSelectedRows([]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      setData(filteredData);
    }
  }, [filteredData]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Invalid Date";
    }

    const appointmentDate = new Date(dateString);

    const monthAbbreviation = appointmentDate.toLocaleString("default", {
      month: "short",
    });
    const day = appointmentDate.getDate();

    return `${monthAbbreviation} ${day}`;
  };

  const handleNewConsultingClick = () => {
    navigate("/BookAppointment");

    // Add your logic here for handling the "New Appointment" button click
    // For example, you can open a modal or navigate to a new page for creating a new appointment
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return " #73FF42-row";
      case "new":
        return "#0089FF-row";
      case "waiting":
        return "#FFEB3C-row";
      case "cancelled":
        return " #FF0000 -row";

      default:
        return "";
    }
  };
  const handleViewClick = (consult_id) => {
    const row = data.find((row) => row.consult_id === consult_id);
    alert(consult_id);
    if (row) {
      navigate("/AppointmentDetails", {
        state: {
          id: row.consult_id,
        },
      });
    } else {
      console.error(`Row with consult_id ${consult_id} not found.`);
    }
  };

  const handleEditClick = (consult_id) => {
    const row = data.find((row) => row.consult_id === consult_id);
    alert(consult_id);
    if (row) {
      navigate("/AppointmentEdit", {
        state: {
          consult_id: row.consult_id,
        },
      });
    } else {
      console.error(`Row with consult_id ${consult_id} not found.`);
    }
  };

  const updateStatusToWaiting = (consultId) => {
    console.log("Consult ID:", consultId);
    fetch(`${baseApiUrl}/update_status_waiting`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ consult_id: consultId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Update Status Response:", data);
        // Optionally handle success response
      })
      .catch((error) => {
        console.error("Error:", error);
        // Optionally handle error
      });
  };

  const isWithin5MinutesBeforeAppointment = (appointmentTime, consultId) => {
    const currentTime = new Date();
    // alert();
    if (!appointmentTime || appointmentTime == undefined) {
      return false;
    }
    let railwayTimeArray = appointmentTime.toString().split(" ");
    if (
      railwayTimeArray == undefined ||
      railwayTimeArray == null ||
      railwayTimeArray.length == 0
    ) {
      return false;
    }
    let railTime = railwayTimeArray[4];
    if (railTime == undefined || railTime == null) {
      return false;
    }
    let tempArray = railTime.split(":");
    if (tempArray == undefined || tempArray == null || tempArray.length == 0) {
      return false;
    }
    console.log(
      "Railway Time",
      railTime,
      "        ",
      appointmentTime.toString()
    );

    console.log(
      "splitted time",
      Number(tempArray[0]),
      "  ",
      Number(tempArray[1]),
      " ",
      " ",
      Number(tempArray[2])
    );
    //const fiveMinutesBeforeAppointment = new Date(appointmentTime.getTime() - 5 * 60 * 1000);
    const d = new Date();
    const fiveMinutesBeforeAppointment = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      Number(tempArray[0]),
      Number(tempArray[1]) - 5,
      Number(tempArray[2]),
      0
    );
    console.log("Current Time:", currentTime);
    console.log(
      "Five Minutes Before Appointment:",
      fiveMinutesBeforeAppointment
    );
    console.log("Appointment Time:", appointmentTime);

    // const result = currentTime >= fiveMinutesBeforeAppointment && currentTime < appointmentTime;

    const result =
      currentTime >= fiveMinutesBeforeAppointment &&
      currentTime <= appointmentTime;

    console.log(
      "Logic is : ",
      currentTime,
      " ",
      fiveMinutesBeforeAppointment,
      "  ",
      currentTime,
      " ",
      appointmentTime
    );
    console.log("Result:", result);

    if (result) {
      // Call the function to update status to Waiting
      updateStatusToWaiting(consultId);
    }

    return result;
  };

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentdashboarddata = data.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";

    // Calculate the total number of pages
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

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
        <span
          key={1}
          className={`homepagination-pages ${currentPage === 1 ? "active" : ""
            }`}
          onClick={() => handlePageChange(1)}
        >
          {1}
        </span>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsisStart" className="ellipsis">
            {ellipsis}
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`homepagination-pages ${currentPage === i ? "active" : ""
            }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </span>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsisEnd" className="ellipsis">
            {ellipsis}
          </span>
        );
      }
      pageNumbers.push(
        <span
          key={totalPages}
          className={`homepagination-pages ${currentPage === totalPages ? "active" : ""
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
    <div className="dashboard-table">
      <div className="header-container">
        <div className="header-left">
          <p style={{ marginRight: "5px", fontWeight: "600",fontSize:'20px',fontFamily:'roboto',lineHeight:'42px',color:'#171A1F' }}>
            Today Consulting
          </p>
          {selectedRowCount > 0 && (
            <p
              className="home-select"
              style={{ fontWeight: "bold", fontSize: "12px" }}
            >
              ({selectedRowCount}) Selected
              <img
                style={{
                  height: "15px",
                  width: "20px",
                  marginLeft: "13px",
                  marginBottom: "-2px",
                }}
                src={trash}
                alt="Trash Icon"
                className="trash-icon"
                onClick={handleTrashIconClick}
                
              />
            </p>
            
          )}
          {showMultipleDeletePopup && (
      <div className="popup1-overlay">
        <div className="popup1-container">
          <p className="deleteappoint1">
            Delete Appointments
            <button
              className="close-button1"
              onClick={() => setShowMultipleDeletePopup(false)}
            >
              ×
            </button>
          </p>
          <p className="popuppara1">
            Are you sure you want to delete the selected appointments?
          </p>
          <div className="popup1-buttons">
            <button
              className="cancel1"
              onClick={() => setShowMultipleDeletePopup(false)}
            >
              Cancel
            </button>
            <button
              className="delete1"
              onClick={() => {
                handleMultipleDeleteAppointment();
                setShowMultipleDeletePopup(false); // Close popup after deletion
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
        </div>
        <div className="header-right">
          <button
            style={{
            
              fontSize: "12px",
            }}
            className="new-consulting-button "
            onClick={handleNewConsultingClick}
          >
            <img src={circle} alt="Circle Icon" className="circle-icon" />
            <span className="news">
              {isAnyCheckboxSelected ? "Start Consulting" : "New Appointment"}
            </span>
          </button>
        </div>
      </div>
      <div
        style={{
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
          paddingTop: "2px",
          paddingBottom: "20px",
        marginRight:'10px'
        }}
        className="table-containers"
      >
        <table className="tls">
          <thead className="home-table">
            <tr>
              <th style={{ borderTopLeftRadius: "5px"}}>
                <input type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAllChange} />
              </th>
              <th>Status</th>
              <th>Consulting ID</th>
              <th>Patient Name</th>
              <th>HCR</th>
              <th>Sick Type</th>
              <th>Assignee</th>
              <th style={{ width: "11%" }}>Date/Time</th>
              <th>View</th>
              <th>Edit</th>
              {/* Hidden column for ID Number */}
              <th style={{ display: "none" }}>ID Number</th>
              <th style={{ borderTopRightRadius: "5px" }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentdashboarddata.map((row, index) => {
              const appointmentTime = new Date(
                `${row.date} ${new Date().getFullYear()} ${row.from_time}`
              );
              timeClass = isWithin5MinutesBeforeAppointment(
                appointmentTime,
                row.consult_id
              )
                ? "red-time"
                : "";

              statusColorClass = getStatusColor(row.status);

              return (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.consult_id)}
                      onChange={(e) => handleCheckboxChange(row.consult_id, e)}
                    />
                  </td>
                  <td>
                    {["waiting"].includes(row.status) ? (
                      <span
                        style={{
                          color: "white",
                          backgroundColor: "#FFEB3C",
                          border: `1px solid #FFEB3C`,
                          padding: "4px 14px",
                          borderRadius: "20px",
                        }}
                      >
                        {row.status}
                      </span>
                    ) : row.status === "new" ? (
                      <span
                        style={{
                          color: "white",
                          backgroundColor: "#0089FF",
                          border: "1px solid #0089FF",
                          padding: "4px 22px",
                          borderRadius: "20px",
                        }}
                      >
                        {row.status}
                      </span>
                    ) : row.status === "cancelled" ? (
                      <span
                        style={{
                          color: "white",
                          backgroundColor: "#FF0000",
                          border: "1px solid #FF0000",
                          padding: "4px 10px",
                          borderRadius: "20px",
                        }}
                      >
                        {row.status}
                      </span>
                    ) : row.status === "completed" ? (
                      <span
                        style={{
                          color: "white",
                          backgroundColor: "#73FF42",
                          border: "1px solid #73FF42",
                          padding: "4px 8px",
                          borderRadius: "20px",
                        }}
                      >
                        {row.status}
                      </span>
                    ) : null}
                  </td>
                  <td>{row.consult_id}</td>
                  <td>{row.patient_name}</td>
                  <td>{row.hcr_name}</td>
                  <td>{row.sick_type}</td>
                  <td>{row.assignee}</td>

                  <td style={{ display: "none" }}>{row.consult_id}</td>
                  <td>
                    <div>{formatDate(row.date)}</div>
                    <div className="appointment-time">
                      {["waiting", "new", "cancelled"].includes(row.status) ? (
                        <span>
                          {`Start on - `}
                          <span className={timeClass}>{row.from_time}</span>
                        </span>
                      ) : row.status === "completed" ? (
                        <span>{`${row.from_time} - ${row.to_time}`}</span>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    <img
                      style={{ width: "30px", height: "30px" }}
                      src={view}
                      alt="View Icon"
                      className="action-icon"
                      onClick={() => handleViewClick(row.consult_id)}
                    />
                  </td>
                  <td>
                    <img
                      style={{ width: "30px", height: "30px" }}
                      src={edit}
                      alt="Edit Icon"
                      className="action-icon"
                      onClick={() => handleEditClick(row.consult_id)}
                    />
                  </td>
                  <td>
                    <img
                      style={{ width: "30px", height: "30px" }}
                      src={deleted}
                      alt="Edit Icon"
                      className="action-icon"
                      onClick={() => {
                        setShowPopup(true);
                        setConsultingIdToDelete(row.consult_id);
                      }} // Pass the consult_id to the handler
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="home-pagination">
        <span
          className="home-previous-arrow"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <span className="home-icon-arrow mr-3">&#8249;</span> Previous
        </span>

        <span className="home-pagination-pages">{renderPageNumbers()}</span>

        <span
          className="home-previous-arrow"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next <span className="home-icon-arrow ml-3">&#8250;</span>
        </span>
      </div>

      {showPopup && (
        <Modal  className="modal-contentsi"  show={showPopup} onHide={() => setShowPopup(false)} centered>
      
        <Modal.Body >
        <div className="staffk-deleteappoint1">
        Consulting
       <button
         className="staff-close-button1"
         onClick={() => setShowPopup(false)}
         aria-label="Close"
       >
         ×
       </button>
  </div>
          <p className="viewstaff-popuppara1" style={{fontSize:'13px'}}>Would you like to delete the consulting?</p>
     
          <Button variant="secondary" className="viewstaff-cancel1"  onClick={() => setShowPopup(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="viewstaff-delete1 ml-4" onClick={() => handleDeleteAppointment(consultingIdToDelete)}>
            Delete
          </Button>
          </Modal.Body>
       
      </Modal>
      )}
    </div>
  );
};

export default Table;