import React, {useEffect, useState,useContext} from 'react';
import { useLocation } from 'react-router-dom'; 
import './group.css';
import dep from '../assets/teacher.png'; 
import deg from '../assets/person.png';
import sta from '../assets/user.png';
import cls from '../assets/book.png'; 
import std from '../assets/people.png';
import del from '../assets/trash.png'; 
import Home from '../component/home.js';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../ProjectContext';



const Group = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const {getLoginCredentials,setLoginCredentials} = useContext(MyContext);
  const Navigate = useNavigate();
  const location = useLocation();
  const [totalDepartmentCount, setTotalDepartmentCount] = useStateInRange(0, 0, 32);
  const [totalDesignationCount, setTotalDesignationCount] = useStateInRange(0, 0, 32);
  const [totalRecoveryCount, setTotalRecoveryCount] = useStateInRange(0, 0, 32);
  const [totalClassCount, setTotalClassCount] = useStateInRange(0, 0, 24);
  const [totalStaffCount, setTotalStaffCount] = useStateInRange(0, 0, 32);
  const [totalStudentCount, setTotalStudentCount] = useStateInRange(0, 0, 24);
  //   const [selectOrganization, setSelectOrganization] = useState(() => {
  //   return getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
  // });

  const [selectOrganization, setSelectOrganization] = useState(() => {
    const storedOrganization = sessionStorage.getItem('organization');
    return storedOrganization ? storedOrganization : getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
  });
  
  useEffect(() => {
    sessionStorage.setItem('organization', selectOrganization);
  }, [selectOrganization]);


  // const [selectOrganization, setSelectOrganization] = useState(() => {
  //   const storedOrganization = localStorage.getItem('organization');
  //   return storedOrganization ? storedOrganization : getLoginCredentials && getLoginCredentials[0] ? getLoginCredentials[0].organization_name : '';
  // });
  
  // useEffect(() => {
  //   localStorage.setItem('organization', selectOrganization);
  // }, [selectOrganization]);


  function useStateInRange(initialValue, min, max) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
      const clampedValue = Math.min(Math.max(value, min), max);
      setValue(clampedValue);
    }, [value, min, max]);

    return [value, setValue];
  }


  useEffect(() => {
    console.log("Fetching total department count..."); // Fetching total class count
      fetch(`${baseApiUrl}/Total_department_count?organization_name=${selectOrganization}`)
        .then(response => response.json())
        .then(data => {
          setTotalDepartmentCount(data.count);
          console.log("Total depeartment count:", data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });

        console.log("Fetching total designation count..."); // Fetching total class count
        fetch(`${baseApiUrl}/Total_designation_count?organization_name=${selectOrganization}`)
          .then(response => response.json())
          .then(data => {
            setTotalDesignationCount(data.count);
            console.log("Total designation count:", data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });

          console.log("Fetching total recovery count..."); // Fetching total class count
          fetch(`${baseApiUrl}/Total_recovery_count?organization_name=${selectOrganization}`)
            .then(response => response.json())
            .then(data => {
              setTotalRecoveryCount(data.count);
              console.log("Total recovery count:", data);
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
      .then(response =>response.json())
      .then(data => {
        setTotalStudentCount(data.student);
        console.log("Total student count:", data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
     


  }, []); 


  // Functions to navigate to different pages
  const movetodepartment = () => {
    Navigate('/Department');
  }

  const movetodesignation = () => {
    Navigate('/Designation');
  }

  const movetostaff = () => {
    Navigate('/Staff');
  }

  const movetostudent = () => {
    Navigate('/Student');
  }

  const movetoclass = () => {
    Navigate('/Classes');
  }

  const movetorecovery = () => {
    Navigate('/Recoverys');
  }

  return (
    <div className="group-main">
      <section id="topics">
        <h2>Menu</h2>
        <ul id="uls">
          <li
            className={`lis ${location.pathname === "/Department" ? "active" : ""}`}
          >
            <img src={dep} alt="Departments Icon" onClick={movetodepartment} />
            <div
              className="movetodepartment"
              style={{ height: "15px", width: "220px", marginBottom: "5px" }}
              onClick={movetodepartment}
            >
              Departments
            </div>
            <p className="navbar-department" onClick={movetodepartment}>
              {totalDepartmentCount}
            </p>
          </li>
          <li
            className={`lis ${location.pathname === "/Designation" ? "active" : ""}`}
          >
            <img
              src={deg}
              alt="Designations Icon"
              onClick={movetodesignation}
            />
            <div
              className="movetodesignation"
              style={{ height: "15px", width: "220px", marginBottom: "5px" }}
              onClick={movetodesignation}
            >
              Designations
            </div>
            <p className="navbar-department" onClick={movetodesignation}>
              {totalDesignationCount}
            </p>
          </li>
          <li
            className={`lis ${
              location.pathname === "/Staff" || location.pathname === "/StaffForm"
                ? "active"
                : ""
            }`}
          >
            <img src={sta} alt="Staffs Icon" onClick={movetostaff} />
            <div
              className="movetostaff"
              style={{ height: "15px", width: "220px", marginBottom: "5px" }}
              onClick={movetostaff}
            >
              Staffs
            </div>
            <p className="navbar-department" onClick={movetostaff}>
              {totalStaffCount}
            </p>
          </li>

          <li
            className={`lis ${location.pathname === "/Classes" ? "active" : ""}`}
          >
            <img src={cls} alt="Classes Icon" onClick={movetoclass} />
            <div
              className="movetoclass"
              style={{ height: "15px", width: "220px", marginBottom: "5px" }}
              onClick={movetoclass}
            >
              Classes
            </div>
            <p className="navbar-department" onClick={movetoclass}>
              {totalClassCount}
            </p>
          </li>
          <li
            className={`lis ${
              location.pathname === "/Student" || location.pathname === "/StudentForm"
                ? "active"
                : ""
            }`}
          >
            <img src={std} alt="Students Icon" onClick={movetostudent} />
            <div
              className="movetostudent"
              style={{ height: "15px", width: "220px", marginBottom: "5px" }}
              onClick={movetostudent}
            >
              Students
            </div>
            <p className="navbar-department" onClick={movetostudent}>
              {totalStudentCount}
            </p>
          </li>
          <li
            className={`lis ${location.pathname === "/Recoverys" ? "active" : ""}`}
          >
            <img src={del} alt="Deleted Icon" onClick={movetorecovery} />
            <div
              className="movetoclass"
              style={{ height: "15px", width: "220px", marginBottom: "5px" }}
              onClick={movetorecovery}
            >
              Recovery
            </div>
            <p className="navbar-department" onClick={movetorecovery}>
              {totalRecoveryCount}
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Group;





