import React, { useState, useEffect, useContext  } from "react";
import "./Recovery.css";
import { useNavigate } from "react-router-dom";
import views from './trailing-icon.png';
import profi from '../photos/Rectangle.png';
import recover from './reco.png';
import "bootstrap/dist/css/bootstrap.min.css";
import searchIcon from "../photos/Search.png";
import { MyContext } from '../ProjectContext';


const ITEMS_PER_PAGE =5;

function Recovery() {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const {getLoginCredentials,setLoginCredentials} = useContext(MyContext);
  const [recoveryData, setRecoveryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search terms
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
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
  //   fetchData();
  // }, []); 


  const handleViewClick = async (id_number) => {
    alert(id_number);

    try {
        // First API call
        const response = await fetch(`${baseApiUrl}/consulting_profile_by_id?id_number=${id_number}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok for the first API');
        }

        const data = await response.json();
        
        if (data.Result === "Failure") {
            console.error('Error from first API:', data.message);
            return;
        }

        const role = data.firstArray[0].role;
        console.log('Role from first API:', role);

        let path;
      
        // Check role and make the second API call if necessary
        if (role === 'student') {
            path = '/StudentDetails';
        } else if (role === 'staff') {
            console.log(`Fetching staff profile for ID ${id_number}`);

            path = '/StaffDetails';
        } else {
            console.error('Unknown role:', role);
            return;
        }

        navigate(path, {
            state: {
                id_number: id_number,
                mode: 'view',
                data: {
                    Profile: data,
                }
            }
        });

        console.log(`Navigated to ${path} with ID ${id_number}`);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


  useEffect(() => {
    let term = searchTerm;
    let filtered;
    filtered = recoveryData.filter((name) => {
      return name.name.toLowerCase().includes(term.toLowerCase());
    });
    console.log("filter response: ", filtered);
    setRecoveryData(filtered);
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
    if (term === "" || !recoveryData || recoveryData.length === 0) {
      filtered = recoveryData; // If the search term is empty or departments is not yet fetched, use the original departments
    } else {
      filtered = recoveryData.filter((name) => {
        return name.name.toLowerCase().includes(term);
      });
    }
    setRecoveryData(filtered);
  }, [searchTerm, recoveryData]);


  const fetchData = () => {
    // Fetch data from the API when the component mounts
    fetch(`${baseApiUrl}/recoveryviewall?organization_name=${selectOrganization}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Recovery Data:', data);
        if (data.Result === 'Success') {
          // Set the combined data directly to the state
          setRecoveryData(data.data); // Use the data field from the response
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  
  const handleSearchChange = (event) => {
   const value = event.target.value;
   setSearchTerm(value);
   // Filter the recoveryData based on the search term
   const filteredData = recoveryData.filter(item =>
     item.name.toLowerCase().includes(value.toLowerCase())
   );
   // Update the recoveryData state with the filtered data
   setRecoveryData(filteredData);
   fetchData();
 };

  const handleRecovery = (idNumber) => {
   
    console.log('Recovering item with id:', idNumber);
    fetch(`${baseApiUrl}/recovery_student_and_staff`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_number: idNumber }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.Result === 'Success') {
          // Update state or perform any necessary action upon successful recovery
          console.log('Recovery successful');
          // Remove the recovered item from the list
          setRecoveryData(recoveryData.filter(item => item.id_number !== idNumber));
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
   

 
  // const handleViewClick = (id_number) => {
  //   const item = recoveryData.find(item => item.id_number === id_number);
  //   alert(item); // Add this line to inspect the item object
  //   if (item) {
  //     navigate('/Main11', {
  //       state: {
  //         id_number: item.id_number,
  //       }
  //     });
  //   } else {
  //     console.error(`Row with id_number ${id_number} not found.`);
  //   }
  // };



  const totalPages = Math.ceil(recoveryData.length / ITEMS_PER_PAGE);
  const currentRecovery = recoveryData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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

  return (
    <div className="recovery-container">
      <div className="recovery-overall-cont">
        <div>
          <h3 className="headingrecovery mt-4"><span className="ml-2">Recovery</span></h3>
        </div>

      <div className="recovery-search-container mt-2 ml-3">
           
            <div className='recovery-flex'>
              <input
                className="recovery-search-input"
    
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search...."
              />
            </div>
            <div className="recovery-search-icon">
              <img
                src={searchIcon}
                alt="Search Icon"
                className="recovery-searchimage"
              />
            </div>
          </div>
        <div className="istaffk-table-division col-lg-12 col-md-10 mt-4">
        <table className="istaffk-table-container" id="Stafflist-table" style={{borderRadius:'10px' }}>
            <thead>
              <tr className="istaffk-list-tablehead ml-2">
                <th>Profile</th>
                <th>Name</th>
                <th>Division</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Last update</th>
                <th>View</th>
                <th>Recovery</th>
                <th style={{ display: 'none' }}>ID</th>
              </tr>
            </thead>
            <tbody>
              {currentRecovery.map((item, index) => (
                <tr className="staffk-list-tablehead" key={index} >
                  <td >
                    <img src={item.profile} alt=""  width={20} height={20} className="Profile-pic" />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.class_and_division}</td>
                  <td>{item.role}</td>
                  <td>{item.mobile_number}</td>
                  <td>{item.updated_at}</td>
                  <td>
                     <button onClick={() =>{ handleViewClick(item.id_number);}} className="staffk-icon">
                      <img src={views} alt=""  className="staffk-table-icon" />
                    </button>
                  </td>
                  <td>
                  <button   className="staffk-icon"  onClick={() => {
        if (item.id_number) {
          console.log('Recovering item with id:', item.id_number);
          handleRecovery(item.id_number);
        } else {
          console.log('ID number is undefined for item:', item);
        }
      }}>
        <img src={recover} className="staffk-table-icon" alt="Recovery" />
      </button>
                  </td>
                  <td style={{ display: 'none' }}>{item.id_number}</td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* <div className="recovery-pagination">
        <span
          className="recovery-pagination-arrow"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <span className="recovery-prevoius-arrow">&#8249;</span> Previous
        </span>

        <span className="recovery-pagination-pages">
          {renderPageNumbers()}
        </span>

        <span
          className="recovery-pagination-arrow"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next <span className="recovery-next-arrow">&#8250;</span>
        </span>
      </div>  */}
  <div className="staffkkkk-pagination">
        <span className="staffkkkk-prevoius-arrow"  onClick={() => handlePageChange(currentPage - 1)}>&#8249;</span>
          <span className="staffkkkk-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </span>
          <span className="staffkkkkr-pagination-pages">
            {renderPageNumbers()}
          </span>
          <span className="staffkkkk-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
            Next 
          </span>
          <span className="staffkkkk-next-arrow"onClick={() => handlePageChange(currentPage + 1)}>&#8250;</span>
        </div>
      </div>
      </div>
   
  );
}
export default Recovery;