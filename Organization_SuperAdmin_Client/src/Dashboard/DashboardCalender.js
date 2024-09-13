import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Col } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Dashboardcalender.css'; // Ensure this path is correct
import { format } from 'date-fns';
import callarrow from '../images/arrowdate24px.png';
import datelefticon from '../images/daterighticon.png';
import daterighticon from '../images/datelefticon.png';

const DateRangePicker = ({ onDateRangeChange }) => {
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [tempDates, setTempDates] = useState([null, null]);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (dates) => {
    setTempDates(dates);
  };
  const handleCancel = () => {
    setTempDates(selectedDates);
    setIsOpen(false);
  };
  
  const handleChoose = () => {
    setSelectedDates(tempDates);
    setIsOpen(false);
    onDateRangeChange(tempDates); // Notify parent about date range change

    // Extract start and end dates
    const [startDate, endDate] = tempDates;

    // Convert dates to the required format for the API
    const fromDate = startDate ? format(startDate, 'yyyy-MM-dd') : '';
    const toDate = endDate ? format(endDate, 'yyyy-MM-dd') : '';

    // Fetch data from API
    fetch(`http://localhost:5000/superAdmin_dashboard_data_filter?from_date=${fromDate}&to_date=${toDate}`)
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
        // Process API response here (e.g., update state, display data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleInputClick = () => {
    setTempDates(selectedDates);
    setIsOpen(true);
  };

  const handleIconClick = () => {
    setIsOpen((prevState) => !prevState);
  };

  const formatDateRange = (dates) => {
    const [start, end] = dates;
    if (!start) return 'Select a Date';
    if (!end) return `${format(start, 'eee, do MMM')}`;
    return `${format(start, 'eee, do MMM')} - ${format(end, 'eee, do MMM')}`;
  };

  return (
    <Col md={12} id='calender'>
      <div className="datepicker-wrapper">
        <DatePicker
          selected={tempDates[0]}
          onChange={handleChange}
          startDate={tempDates[0]}
          endDate={tempDates[1]}
          selectsRange
          className="dashboard-datepicker-input"
          dateFormat="eee, do MMM"
          open={isOpen}
          onClickOutside={() => setIsOpen(false)}
          onInputClick={handleInputClick}
          placeholderText={formatDateRange(selectedDates)}
          renderCustomHeader={({ monthDate, customHeaderCount, decreaseMonth, increaseMonth }) => (
            <div>
              <button
                aria-label="Previous Month"
                className="react-datepicker__navigation react-datepicker__navigation--previous"
                style={customHeaderCount === 1 ? { visibility: 'hidden' } : null}
                onClick={decreaseMonth}
              >
                <img src={datelefticon} className='datelefticon' style={{width:'6px',marginRight:'35px'}} alt="Previous" />
              </button>
              <span className="react-datepicker__current-month">
                {monthDate.toLocaleString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <button
                aria-label="Next Month"
                className="react-datepicker__navigation react-datepicker__navigation--next"
                onClick={increaseMonth}
              >
                <img src={daterighticon} className='daterighticon' alt="Next" style={{width:'6px',marginLeft:'35px'}} />
              </button>
            </div>
          )}
          calendarContainer={({ children }) => (
            <div className="calendar-container">
              {children}
              <div className="buttons-container">
                <button
                  className="btn btn-sm button-custom"
                  style={{ backgroundColor: '#DDDDDD', color: '#888888', width: '39%', marginLeft: '30px' }}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm button-custom"
                  style={{ backgroundColor: '#1D5EFF', color: 'white', fontSize: '12px', marginRight: '0px' }}
                  onClick={handleChoose}
                >
                  Choose Dates
                </button>
              </div>
            </div>
          )}
        />
        <img className='dashboard-dateicon' src={callarrow} onClick={handleIconClick} style={{width:'6px'}} alt="Toggle Calendar" />
        <span role="alert" aria-live="polite" className="react-datepicker__aria-live"></span>
      </div>
    </Col>
  );
};

export default DateRangePicker;
