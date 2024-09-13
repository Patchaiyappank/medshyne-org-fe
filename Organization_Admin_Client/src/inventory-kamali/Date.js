import React, { useState, useRef, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaAngleDown } from 'react-icons/fa';
import axios from 'axios';
import "./Inventory.css";
import { MyContext } from '../ProjectContext';

const Calendar = ({ cbs }) => {
  const {getLoginCredentials,setLoginCredentials} = useContext(MyContext);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [medicineInventoryArray, setMedicineInventoryArray] = useState(null);
  const [medicineDetailsArray, setMedicineDetailsArray] = useState(null);
  const [error, setError] = useState(null);
  const calendarRef = useRef(null);
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

  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
 

  const handleDateChange = async (dates) => {
    const [start_date, end_date] = dates;
    setStartDate(start_date);
    setEndDate(end_date);
    setLoading(true);

    try {
      if (!start_date || !end_date || isNaN(start_date.getTime()) || isNaN(end_date.getTime())) {
        throw new Error("Please select valid start and end dates.");
      }

      // Format dates
      const formattedStartDate = formatDate(start_date);
      const formattedEndDate = formatDate(end_date);

      console.log("Sending request with start date:", formattedStartDate, "and end date:", formattedEndDate);

      // Call the callback with formatted dates
      cbs(formattedStartDate, formattedEndDate);

      // Fetch data
      const response = await axios.get(`${baseApiUrl}/inventory_datefilter?organization_name=${selectOrganization}`, {
        params: {
          start_date: formattedStartDate,
          end_date: formattedEndDate
        }
      });

      console.log("Response data:", response.data.medicineInventoryArray);

      setMedicineInventoryArray(response.data.medicineInventoryArray);
      setMedicineDetailsArray(response.data.medicineDetailsArray);
      setError(null);
    } catch (error) {
      console.error("Error occurred:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setCalendarOpen(false);
    }
  };

  // Function to format date to YYYY-MM-DD format
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const dateRangeString = startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : '';

  const handleCalendarIconClick = () => {
    setCalendarOpen(!isCalendarOpen);
  };

  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setCalendarOpen(false);
    }
  };

  useEffect(() => {
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  return (
    <div ref={calendarRef} style={{ position: 'relative', width: '200px', borderRadius: '15px',marginLeft:'20px' }}>
      <input
        type="text"
        value={dateRangeString}
        placeholder='Jul 13, 2024 - Jul 27, 2024'
        readOnly
        style={{ width: '200px', fontSize: '12px', paddingRight: '10px', height: '30px', paddingLeft: '25px' }}
      />
      <FaAngleDown
        onClick={handleCalendarIconClick}
        style={{
          position: 'absolute',
          top: '50%',
          right: '5px',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          color: 'grey',
        }}
        className='date-rangeString'
      />
      <FaCalendarAlt
        onClick={handleCalendarIconClick}
        className='date-rangeString'
        style={{
          position: 'absolute',
          top: '50%',
          left: '5px',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          color: 'grey',
        }}
      />

      {isCalendarOpen && (
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          selectsRange
          startDate={startDate}
          endDate={endDate}
          inline
          calendarContainer={(props) => (
            <div
              style={{
                position: 'absolute',
                top: '36px',
                left: '-35px',
                zIndex: '1',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                padding: '10px',
              }}
            >
              {props.children}
            </div>
          )}
        />
      )}
    </div>
  );
};

export default Calendar;