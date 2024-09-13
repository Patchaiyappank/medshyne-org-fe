import React, { useState, useEffect, useContext } from 'react';
import './Consultancy.css';
import 'react-datepicker/dist/react-datepicker.css';
// import button from './consultIcon/Button 43.png';
import down from './down.png';
import uparrow from './uparrow.png';
import axios from 'axios';
import search from './consultIcon/search.png';
import GenericPdfDownloader from './GenericPdfDownloder.js';
import CalendarComponent from './Date.js';
import { useNavigate } from "react-router-dom";
import { MyContext } from '../ProjectContext';

const CombinedComponent = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [medicalHistoryData, setMedicalHistoryData] = useState([]);
  const { getLoginCredentials, setLoginCredentials } = useContext(MyContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [getMedicineDetails, setMedicineDetails] = useState([]);
  const [getGeneralPrescription, setGeneralPrescription] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(getGeneralPrescription.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentConsultDone = getGeneralPrescription.slice(startIndex, endIndex);


  

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
    const totalPages = Math.ceil(getGeneralPrescription.length / ITEMS_PER_PAGE);

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


  useEffect(() => {
    let term = searchTerm;
    let filtered;
    filtered = getGeneralPrescription.filter((department) => {
      return department.patient_name.toLowerCase().includes(term.toLowerCase());
    });
    console.log("filter response: ", filtered);
    setGeneralPrescription(filtered);
    if (
      term === "" ||
      filtered === undefined ||
      filtered === null ||
      filtered.length === 0
    ) {
      fetchData();
    }
  }, [searchTerm]);

  useEffect(() => {
    let term = searchTerm.toLowerCase();
    let filtered;
    if (term === "" || !getGeneralPrescription || getGeneralPrescription.length === 0) {
      filtered = getGeneralPrescription;
    } else {
      filtered = getGeneralPrescription.filter((department) => {
        return department.patient_name.toLowerCase().includes(term);
      });
    }
    setGeneralPrescription(filtered);
  }, [searchTerm, getGeneralPrescription]);

  const dateCallBack = (generalPresArrayList, medicineDetailsArrayList) => {
    setGeneralPrescription(generalPresArrayList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseApiUrl}/get_consulting_api_a?organization_name=${selectOrganization}`);
      setGeneralPrescription(response.data.arrayList);
      setMedicineDetails(response.data.balanceArrayList);
      console.log('consulting done List : ', response.data.arrayList, response.data.balanceArrayList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChildTable = (consult_id) => {
    setExpandedRow(expandedRow === consult_id ? null : consult_id);
  };

  const pointerCursorStyle = {
    cursor: 'pointer',
  };

  const consult_done = async (id_number) => {
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


  const consult_done_staff = (id_number) => {
    alert(id_number);
    navigate('/StaffDetails', {
      state: {
        id_number: id_number,
        mode: 'view'
      }
    });
    console.log(`View staff with ID ${id_number}`);
  };

  const renderRows = () => {
    return currentConsultDone.map((record, index) => (
      <React.Fragment key={index}>
        <tr className="consult-table-row" onClick={() => toggleChildTable(record.consult_id)}>
          <td className='consult-page-done' style={{ paddingLeft: expandedRow === record.consult_id ? '20px' : '10px' }}>
            <span role="img" aria-label="dropdown" style={pointerCursorStyle}>
              {expandedRow === record.consult_id ? (
                <img src={uparrow} style={{ width: '20px', height: '8px', paddingRight: '10px' }} alt="up" />
              ) : (
                <img style={{ width: '30px', height: '30px' }} src={down} alt="down" />
              )}
            </span>
            {record.patient_name}
          </td>
          <td>{record.sick_type}</td>
          <td>{record.consult_id}</td>
          <td>{record.class_and_division}</td>
          <td>{record.date}</td>
        </tr>

        {expandedRow === record.consult_id && getMedicineDetails.filter(med => med.consult_id === record.consult_id).map((childRecord, childIndex) => (
          <React.Fragment key={`child-${childIndex}`}>
            <tr className='table-row-consult' style={{ border: 'none' }}>
              <td className="consult-page-done-idnumber1">
                <strong>ID Number</strong>
                <span onClick={() => consult_done(childRecord.id_number)} className='consult-view-page'>(view)</span>
                <br />{childRecord.id_number}
              </td>
              <td className="consult-page-done-idnumber"><strong>HCR(ID)</strong><br />{childRecord.hcr_id_number}</td>
              <td className="consult-page-done-idnumber"><strong>Time</strong><br />{childRecord.from_time}</td>
              <td className="center-content" rowSpan="2" colSpan="2">
                <GenericPdfDownloader
                  className="table-row-pdf"
                  downloadFileName="CustomPdf"
                  rootElementId="testId"
                  consult_id={record.consult_id}
                />
              </td>
            </tr>
            <tr className='table-row-consult' style={{ border: 'none' }}>
              <td className="consult-page-done-idnumber1"><strong>Mobile Number</strong><br />{childRecord.mobile_number}</td>
              <td className="consult-page-done-idnumber"><strong>(HCR)Name</strong><span onClick={() => consult_done_staff(childRecord.hcr_id_number)} className='consult-view-page'>view</span><br />{childRecord.hcr_name}</td>
              <td className="consult-page-done-idnumber"><strong>Doctor</strong><br />{childRecord.assignee}</td>
            </tr>
          </React.Fragment>
        ))}
      </React.Fragment>

    ));
  };

  const handleConsultingClick = (consult_id) => {
    localStorage.setItem('consult_id', consult_id);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='consult-used-container' id='testId'>
      <div className='consult-search-calender'>
        <div className="consult-searchh-bar">
          <input
            type="text"
            className="consult-searchh-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e)}
          />
          <img className='consult-search' src={search} alt="View" />
        </div>
        <div className='consult-date-picker'>
          {/* <img className='consult-imageee' src={button} alt="View" /> */}
          <CalendarComponent cb={dateCallBack} className="consult-calender" />
        </div>
      </div>



      <div className='consult-user-content'>
        <p className='consult-head'>Consulting Done</p>
        <h6 className='consult-subhead'>Overview of completed consultations with Patient details and consultation records</h6>
        <div className="consult-table-responsive">
          <table>
            <thead className='consult-Tablerow'>
              <tr>
                <th>Name</th>
                <th>Sick Type</th>
                <th>consultation ID</th>
                <th>Division</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {renderRows()}
            </tbody>
          </table>
        </div>
      </div>

      <div className="home-pagination">
        <span
          className="home-previous-arrow"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <span className="home-icon-arrow">&#8249;</span> Previous
        </span>

        <span className="home-pagination-pages">{renderPageNumbers()}</span>

        <span
          className="home-previous-arrow"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next <span className="home-icon-arrow">&#8250;</span>
        </span>
      </div>

    </div>
  );
};

export default CombinedComponent;