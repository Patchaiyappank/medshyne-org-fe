import React, { useState, useEffect, useContext } from 'react';
import './Inventory.css';
import 'react-datepicker/dist/react-datepicker.css';
import button from './Icon/Button 43.png';
import down from './Icon/down.png';
import uparrow from './Icon/uparrow.png';
import Calendar from './Date.js';
import { MyContext } from '../ProjectContext';

const CombinedComponent = () => {
  const { getLoginCredentials, setLoginCredentials } = useContext(MyContext);
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [medicalHistoryData, setMedicalHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [medicineDetailsArray, setMedicineDetailsArray] = useState([]);
  const [medicineInventoryArray, setMedicineInventoryArray] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const ITEMS_PER_PAGE = 5;
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

  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentInventory = filteredInventory.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`used-page ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </span>
      );
    }

    return pageNumbers;
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  useEffect(() => {
    applyFilters(); // Apply filters whenever filter criteria change
  }, [searchTerm, startDate, endDate, medicineInventoryArray]);

  const applyFilters = () => {
    let filtered = medicineInventoryArray;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.patient_name.toLowerCase().includes(term) ||
          item.id_number.toString().includes(term)
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date); // Assuming item.date is in YYYY-MM-DD format
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
    }

    setFilteredInventory(filtered);
  };

  const dateCallBack = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${baseApiUrl}/viewall_medicineinventory?organization_name=${selectOrganization}`, options);
      
      // Check for 404 or other errors
      if (!response.ok) {
        console.error('HTTP error', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        return;
      }
  
      const data12 = await response.json();
      console.log('View_All_Medicines : ', data12);
      setMedicineInventoryArray(data12.general_prescription);
      setMedicineDetailsArray(data12.medicine_details);
      setMedicalHistoryData(data12.result);
    } catch (error) {
      console.error('Error: ', error);
    }
  };
  

  const toggleChildTable = (consult_id) => {
    setExpandedRow(expandedRow === consult_id ? null : consult_id);
  };

  const pointerCursorStyle = {
    cursor: 'pointer',
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    dateCallBack(start, end);
  };

  return (
    <div className='inventory-used-container'>
      <div className="inventory-searchh-bar">
        <div className='inventory-date-picker'>
          <input
            type="text"
            className="inventory-searchh-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
         
          <Calendar cbs={dateCallBack} className="inventory-calender" />
        </div>
      </div>
      <div className='inventory-user-content'>
        <table className='inventory-table'>
          <thead className='inventorytableheaddd'>
            <tr className='inventoryyyy'>
              <th className='inventory-name'>Name</th>
              <th>ID Number</th>
              <th>Consulting ID</th>
              <th>HCR Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody className='inventory-table-body '>
            {currentInventory.map((record, index) => (
              <React.Fragment key={index}>
                <tr className="inventory-tablee-row" onClick={() => toggleChildTable(record.consult_id)}>
                  <td>
                    <span role="img" aria-label="dropdown" style={pointerCursorStyle}>
                      {expandedRow === record.consult_id ? <img src={uparrow} className='uparow-container' style={{ marginLeft:'10px', height: '6px',paddingRight:'6px'}} alt="up" /> : <img style={{ width: '25px', height: '20px' }} src={down} alt="down" />}
                    </span>
                    {record.patient_name}
                  </td>
                  <td>{record.id_number}</td>
                  <td>{record.consult_id}</td>
                  <td>{record.hcr_name}</td>
                  <td>{record.date}</td>
                  
                </tr>
                {expandedRow === record.consult_id && (
                  <tr className="inventory-table-row">
                    <td colSpan="5">
                      <table className="inventory-child-table">
                        <tbody>
                          {medicineDetailsArray
                            .filter(medicine => medicine.consult_id === record.consult_id)
                            .map((childRecord, idx) => (
                              <tr key={idx} className='inventory-TableRow'>
                                <td>{childRecord.prescriptiondetails_id}</td>
                                <td>{childRecord.medicine_name}</td>
                                <td>HSN({childRecord.hsn_code})</td>
                                <td>Qunatity - {childRecord.count}</td>
                                <td>{childRecord.expiry_date}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="used-pagination">
      <span className="used-prevoius-arrow">&#8249;</span>
        <span
          className="used-pagination-arrow"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </span>

        <span className="used-pagination-pages">
          {renderPageNumbers()}
        </span>

        <span
          className="used-pagination-arrow"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next 
        </span>
        <span className="used-next-arrow">&#8250;</span>
      </div>
    </div>
  );
};

export default CombinedComponent;