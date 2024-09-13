import React, { useState, useEffect, useContext } from 'react';
import Calendar from './calendar.js';
import './home.css';
import Table from './table.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import calendarImage from '../assets/Calendar.png';
import dropdownImage from '../assets/down.png';
import './calendar.css';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../ProjectContext';


const Home = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const { getLoginCredentials, setLoginCredentials } = useContext(MyContext);
  const [profileImage, setProfileImage] = useState('/path/to/defaultImage.jpg');
  const [currentScreen, setCurrentScreen] = useState('home');
  const [totalConsultingRegister, setTotalConsultingRegister] = useStateInRange(0, 0, 20);
  const [totalConsultingToday, setTotalConsultingToday] = useStateInRange(0, 0, 18);
  const [totalConsultingDone, setTotalConsultingDone] = useStateInRange(0, 0, 18);
  const [totalClassCount, setTotalClassCount] = useStateInRange(0, 0, 24);
  const [totalStaffCount, setTotalStaffCount] = useStateInRange(0, 0, 32);
  const [totalStudentCount, setTotalStudentCount] = useStateInRange(0, 0, 24);
  const [inStockMedicine, setInStockMedicine] = useStateInRange(0, 0, 52);
  const [outOfStockMedicine, setOutOfStockMedicine] = useStateInRange(0, 0, 8);
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

  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  { currentScreen === 'home' && <Calendar /> }



  function useStateInRange(initialValue, min, max) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
      const clampedValue = Math.min(Math.max(value, min), max);
      setValue(clampedValue);
    }, [value, min, max]);

    return [value, setValue];
  }


  useEffect(() => {
    console.log("Fetching total consulting register count...");
    // Fetch total consulting register count
    fetch(`${baseApiUrl}/count_total_consulting_register?organization_name=${selectOrganization}`)
      .then(response => response.json())
      .then(data => {
        setTotalConsultingRegister(data.recordCount);
        console.log("Total consulting register count:", data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    console.log("Fetching total consulting done count...");
    // Fetch total consulting done count
    fetch(`${baseApiUrl}/count_total_consulting_done?organization_name=${selectOrganization}`)
      .then(response => response.json())
      .then(data => {
        setTotalConsultingDone(data.recordCount);
        console.log("Total consulting done count:", data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    console.log("Fetching in-stock medicine count..."); // Fetching in-stock medicine count
    fetch(`${baseApiUrl}/count_instock_medicine?organization_name=${selectOrganization}`)
      .then(response => response.json())
      .then(data => {
        setInStockMedicine(data.instock);
        console.log("In stock medicine count:", data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    console.log("Fetching total class count..."); // Fetching total class count
    fetch(`${baseApiUrl}/Total_classes_count?organization_name=${selectOrganization}`)
      .then(response => response.json())
      .then(data => {
        setTotalClassCount(data.classes);
        console.log("Total class count:", data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    console.log("Fetching total staff count..."); // Fetching total staff count
    fetch(`${baseApiUrl}/Total_staff_count?organization_name=${selectOrganization}`)
      .then(response => response.json())
      .then(data => {
        setTotalStaffCount(data.staff);
        console.log("Total staff count:", data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    console.log("Fetching total student count..."); // Fetching total student count
    fetch(`${baseApiUrl}/Total_student_count?organization_name=${selectOrganization}`)
      .then(response => response.json())
      .then(data => {
        setTotalStudentCount(data.student);
        console.log("Total student count:", data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    fetch(`${baseApiUrl}/count_outofstock_medicine?organization_name=${selectOrganization}`)
      .then(response => response.json())
      .then(data => {
        setOutOfStockMedicine(data.outofstock);
        console.log("Out of stock medicine count:", data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    // Fetch total consulting done count
    fetch(`${baseApiUrl}/count_total_consulting_done_today?organization_name=${selectOrganization}`)
      .then(response => response.json())
      .then(data => {
        setTotalConsultingDone(data.recordCount);
        console.log("Total consulting done count:", data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });



  }, []);
  // Empty dependency array ensures this effect runs only once on mount


  const handleIconClick = (icon) => setCurrentScreen(icon);

  const handleClass = () => {
    navigate('/Classes')
  }


  const handleStaff = () => {
    navigate('/Staff')
  }

  const handleStudent = () => {
    navigate('/Student')
  }

  const handleInStock = () => {
    navigate('/MedicineInventory')
  }

  const handleOutStock = () => {
    navigate('/MedicineInventory')
  }

  const handleConsultDone = () => {
    navigate('/ConsultingHistory')
  }

  const handleConsultRegister = () => {
    navigate('/ConsultingHistory')
  }
  const handleConsultPage = () => {
    navigate('/ConsultingHistory')
  }

  const formatDate = (date) => {
    return date ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
  };
  const fetchTableDataByDate = (dateRange) => {
    const [startDate, endDate] = dateRange;
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];

    fetch(`${baseApiUrl}/consulting_datefilter?startdate=${startDateString}&enddate=${endDateString}?organization_name=${selectOrganization}`)
      .then(response => response.json())
      .then(filteredData => {
        setFilteredData(filteredData.result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="container-fluid" style={{ marginTop: '90px', marginLeft: '90px', width: '93%' }}>
      <div className="row mt-3">
        <div className="col-md-7">
          {currentScreen === 'home' && (
            <h4 className="mt-2" style={{fontWeight:'500'}}>Statistics</h4>
          )}
        </div>
        <div className="col-md-4 d-flex justify-content-md-end flex-wrap  mt-md-0" style={{ marginLeft: '7%' }}>
          {currentScreen === 'home' && <Calendar onDateRangeChange={fetchTableDataByDate} />}
        </div>
      </div>
      <br />
      {currentScreen === 'home' && (
        <>
          <div className="row">
            <div className="col-md-3 ">
              <div className="card" onClick={handleConsultRegister} style={{ backgroundColor: '#FF7E7E', height: '98%', width: '95%', borderRadius: '7px' }}>
                <div className="">
                  <p className="card-title ml-3 statistics-text mt-2" >Total Consulting History</p>
                  <p className="card-text ml-3   " >{totalConsultingRegister}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 ">
              <div className="card " onClick={handleConsultPage} style={{ backgroundColor: '#C1F2B0', height: '98%', width: '95%', borderRadius: '7px' }}>
                <div className="">
                  <p className="card-title  ml-3 statistics-text mt-2" >Total Consulting Today</p>
                  <p className="card-text ml-3  " >{totalConsultingToday}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white " onClick={handleConsultDone} style={{ backgroundColor: '#FFD594', height: '98%', width: '95%', borderRadius: '7px' }}>
                <div className="">
                  <p className="card-title ml-3 statistics-text mt-2" >Total Consulting Done</p>
                  <p className="card-text  ml-3  " >{totalConsultingDone}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 ">
              <div className="card text-white " onClick={handleInStock} style={{ backgroundColor: '#A6C85B', height: '98%', width: '95%', borderRadius: '7px' }}>
                <div className="">
                  <p className="card-title ml-3 statistics-text mt-2">In Stock Medicine</p>
                  <p className="card-text ml-3 " >{inStockMedicine}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3" style={{  }}>
            <div className="col-md-3 " >
              <div className="card text-white " onClick={handleClass} style={{ backgroundColor: '#E8D8C4', height: '98%', width: '95%', borderRadius: '7px' }}>
                <div className="">
                  <p className="card-title ml-3 statistics-text mt-2" >Total Class Count</p>
                  <p className="card-text ml-3 " >{totalClassCount}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 ">
              <div className="card text-white " onClick={handleStaff} style={{ backgroundColor: '#8CB9BD', height: '98%', width: '95%', borderRadius: '7px' }}>
                <div className="">
                  <p className="card-title ml-3 statistics-text mt-2">Total Staff Count</p>
                  <p className="card-text ml-3" >{totalStaffCount}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 ">
              <div className="card text-white" onClick={handleStudent} style={{ backgroundColor: '#98C4FF', height: '98%', width: '95%', borderRadius: '7px' }}>
                <div className="">
                  <p className="card-title ml-3 statistics-text mt-2">Total Student Count</p>
                  <p className="card-text ml-3" >{totalStudentCount}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3  ">
              <div className="card text-white " onClick={handleOutStock} style={{ backgroundColor: '#EE5496', height: '98%', width: '95%', borderRadius: '7px' }}>
                <div className="">
                  <p className="card-title ml-3 statistics-text mt-2" >Out of Stock Medicine</p>
                  <p className="card-text ml-3 ">{outOfStockMedicine}</p>
                </div>
              </div>
            </div>
          </div>

        </>

      )}

      <div  className=""  style={{ display: 'block', width: '100%', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', marginBottom: '1rem' }}>
          <Table filteredData={filteredData} />
        </table>
      </div>
    </div>

    
  );
};


export default Home;