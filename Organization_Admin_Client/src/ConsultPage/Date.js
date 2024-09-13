import React, { useState, useRef, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaAngleDown } from 'react-icons/fa';
import axios from 'axios';
import { MyContext } from '../ProjectContext';

// import ConsultDone from './ConsultDone.js'; 

const CalendarComponent = ({ cb }) => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { getLoginCredentials, setLoginCredentials } = useContext(MyContext);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalPrescription, setGeneralPrescription] = useState(null);
  const [medicineDetails, setMedicineDetails] = useState(null);
  const [error, setError] = useState(null);
  const calendarRef = useRef(null);
  const [selectOrganization, setSelectOrganization] = useState(() => {
    return getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
  });

  const handleDateChange = async (date) => {
    const [start_date, end_date] = date;
    setStartDate(start_date);
    setEndDate(end_date);
    setLoading(true);
  
    try {
      if (!start_date || !end_date || isNaN(start_date.getTime()) || isNaN(end_date.getTime())) {
        throw new Error("Please select valid start and end dates.");
      }
  
      // Convert JavaScript Date format to YYYY-MM-DD format
      const formattedStartDate = formatDate(start_date);
      const formattedEndDate = formatDate(end_date);
  
      console.log("Sending request with start date:", formattedStartDate, "and end date:", formattedEndDate);
  
      // API call using axios
      const response = await axios.get(`${baseApiUrl}/consult_done_date_filter`, {
        params: {
          organization_name: selectOrganization,
          start_date: formattedStartDate,
          end_date: formattedEndDate
        }
      });
  
      console.log("Response data:", response.data.arrayList);
  
      setGeneralPrescription(response.data.arrayList);
      setMedicineDetails(response.data.balanceArrayList);
      cb(response.data.arrayList, response.data.balanceArrayList);
  
      setError(null);
    } catch (error) {
      console.error("Error occurred:", error);
      setError('Network error: Unable to fetch data.');
    } finally {
      setLoading(false);
      setCalendarOpen(false);
    }
  };
  

  // const handleDateChange = async (date) => {
  //   const [start_date, end_date] = date;
  //   setStartDate(start_date);
  //   setEndDate(end_date);
  //   setLoading(true);

  //   try {
  //     if (!start_date || !end_date || isNaN(start_date.getTime()) || isNaN(end_date.getTime())) {
  //       throw new Error("Please select valid start and end dates.");
  //     }

  //     // Convert JavaScript Date format to YYYY-MM-DD format
  //     const formattedStartDate = formatDate(start_date);
  //     const formattedEndDate = formatDate(end_date);

  //     console.log("Sending request with start date:", formattedStartDate, "and end date:", formattedEndDate);

  //     const response = await axios.get(`${baseApiUrl}/consult_done_date_filter?organization_name=${selectOrganization}`, {
  //       params: {
  //         start_date: formattedStartDate,
  //         end_date: formattedEndDate
  //       }
  //     });

  //     console.log("Response data:", response.data.arrayList);

  //     setGeneralPrescription(response.data.arrayList);
  //     setMedicineDetails(response.data.balanceArrayList);
  //     cb(response.data.arrayList, response.data.balanceArrayList);

  //     setError(null);
  //   } catch (error) {
  //     console.error("Error occurred:", error);
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //     setCalendarOpen(false);
  //   }
  // };

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
    <div ref={calendarRef} style={{ position: 'relative', width: '200px', borderRadius: '15px' }}>
      <input
        type="text"
        value={dateRangeString}
        placeholder='Jul 13, 2024 - Jul 27, 2024'
        readOnly
        style={{ width: '200px', border:'1px solid #ccc',fontSize: '12px', paddingRight: '15px', height: '30px', paddingLeft: '27px', marginLeft: '55px', marginBottom: '140px', textOverflow: 'ellipsis' }}
      />
      <FaAngleDown
        onClick={handleCalendarIconClick}
        style={{
          position: 'absolute',
          top: '50%',
          right: '-22%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          color: 'grey',
          marginLeft: '15px',
          marginTop: '-70px',
        }}
      />
      <FaCalendarAlt
        onClick={handleCalendarIconClick}
        style={{
          position: 'absolute',
          top: '9%',
          left: '30%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          color: 'grey',
          padding: '1px'
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
                top: '20%',
                right: '90',
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

export default CalendarComponent;
