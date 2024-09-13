import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import calendarImage from '../assets/Calendar.png';
import dropdownImage from '../assets/down.png';
import './calendar.css';

const Calendar = ({ onDateRangeChange }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [placeholder, setPlaceholder] = useState("");
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (dates[0] && dates[1]) {
      setCalendarOpen(false);
      onDateRangeChange(dates);
    }
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
  };

  const dateRangeString = dateRange[0] && dateRange[1] ? `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}` : '';

  const toggleCalendar = () => {
    setCalendarOpen(!isCalendarOpen);
  };
  useEffect(() => {
    const currentDate = new Date();
    const month = currentDate.toLocaleString("default", { month: "short" });
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();

    const startOfMonth = `${month} 01, ${year}`;
    const endOfMonth = `${month} ${new Date(year, currentDate.getMonth() + 1, 0).getDate()}, ${year}`;
    
    setPlaceholder(`${startOfMonth} - ${endOfMonth}`);
  }, []);

  return (
    <div className="mr-2">
      <img  
        src={calendarImage}
        alt="Calendar"
        style={{
          position: 'absolute',
          cursor: 'pointer',
          marginTop: '9px',
          marginLeft: '5px',
          width: '12px', 
          height: '12px', 
        }}
        onClick={toggleCalendar}
      />
      <input 
        className='txt'
        type="text" 
        value={dateRangeString}
        placeholder={placeholder}
        readOnly
        onClick={toggleCalendar}
      />
      <img 
        id='drp'
        src={dropdownImage}
        alt="Dropdown"
        style={{
          position: 'absolute',
          cursor: 'pointer',
        
          marginLeft: '-18px', 
          width: '12px', 
          height: '12px',
          marginTop:'9px',
        }}
        onClick={toggleCalendar}
      />

      {isCalendarOpen && (
        <DatePicker
          selected={dateRange[0]}
          onChange={handleDateChange}
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          inline
          selectsRange
          calendarContainer={(props) => (
            <div className="custom-calendar-container"
              // style={{
              //   position: 'absolute',
              //   zIndex: '1',
              //   backgroundColor: '#fff',
              //   boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              //   padding: '10px',
              //   marginLeft: '-40px',
              //   marginTop: '5px',
              // }}
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