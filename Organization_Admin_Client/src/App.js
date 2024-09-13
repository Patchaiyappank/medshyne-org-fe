import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import Mobile from "./pages/Mobile";
import ForgetPass from "./pages/ForgetPass";
import ForgetPassword from "./pages/ForgetPassword";
import Otp from "./pages/Otp";
import OtpVerify from "./pages/OtpVerify";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Blog from "./pages/Blog";
import ContactUs from "./pages/ContactUs";
import Createnew from "./pages/Createnew";
import { MyContext } from "./ProjectContext";
import { useState } from "react";
import Dashboard from "./Navigate_Path/Dashboard";
import Department from "./Navigate_Path/Department";
import Designation from "./Navigate_Path/Designation";
import MedicineInventory from "./Navigate_Path/MedicineInventory";
import Staff from "./Navigate_Path/Staff";
import StaffForm from "./Navigate_Path/StaffForm";
import Student from "./Navigate_Path/Student";
import Classes from "./Navigate_Path/Classes";
import ConsultingHistory from "./Navigate_Path/ConsultingHistory";
import StudentForm from "./Navigate_Path/StudentForm";
import Profile from "./Navigate_Path/Profile";
import AppointmentDetails from "./Navigate_Path/AppointmentDetails";
import BookAppointment from "./Navigate_Path/BookAppointment";
import Prescription from "./Navigate_Path/Prescription";
import StaffDetails from "./Navigate_Path/StaffDetails";
import AppointmentEdit from "./Navigate_Path/AppointmentEdit";
import Recoverys from "./Navigate_Path/Recoverys";
import StudentDetails from "./Navigate_Path/StudentDetails";
import MenuList from "./Navigate_Path/MenuList";
import Payments from "./Navigate_Path/Payments";
import Chat from "./Navigate_Path/Chat";
import Appointment from "./pages/Appointment";
// import Appointmentview from "./pages/Appointment"
import Stock from "./inventory-kamali/Stack";
import PlanSubscription from "./Navigate_Path/PlanSubscription";
// import VideoCalls from "./videocalls";




import Landingpage from "./components/landingpage";
import { Navbar } from "react-bootstrap";





function App() {
  const [userObj, setUserObj] = useState([{}]);
  const [getLoginCredentials,setLoginCredentials] = useState([]);
  const [iconClick,setIconClick]= useState('home');
  // alert(process.env.REACT_APP_BASE_API_URL)
  function handleSideBarClick(str)
  {
      setIconClick(str);
  }

  function getHandleSideBarClick()
  {
    return iconClick;
  }
  

  
  return (

    
    <div className="App">



    
<MyContext.Provider value={{userObj, setUserObj,iconClick,setIconClick, getLoginCredentials,setLoginCredentials}}>
        <BrowserRouter>
        
            <Routes>
               <Route path="/" element={<Landingpage />}/>
                <Route path="/contactUs" element={<ContactUs />}/>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/forgetpass" element={<ForgetPass/>}/>
                <Route path="/forget" element={<ForgetPassword/>} />
                <Route path="/Mobile" element={<Mobile/>} />
                <Route path="/Createnew" element={<Createnew/>} />
                <Route path="/appointment" element={<Appointment/>} />
                <Route path="/otp" element={<Otp/>} />
                <Route path="/otpverify" element={<OtpVerify/>} />
                <Route path="/Blog" element={<Blog/>} />
                <Route path="/Dashboard" element={<Dashboard/>} />
                <Route path="/Department" element={<Department/>} />
                <Route path="/Designation" element={<Designation/>} /> 
                <Route path="/MedicineInventory" element={<MedicineInventory/>} />
                <Route path="/Staff" element={<Staff />} />
                <Route path="/StaffForm" element={<StaffForm />} />
                <Route path="/Student" element={<Student />} /> 
                <Route path="/Classes" element={<Classes />} /> 
                <Route path="/ConsultingHistory" element={<ConsultingHistory />} />
                <Route path="/StudentForm" element={<StudentForm />} /> 
                <Route path="/Profile" element={<Profile/>} />
                <Route path="/AppointmentDetails" element={<AppointmentDetails/>} />
                <Route path="/BookAppointment" element={<BookAppointment/>} />
                <Route path="/Prescription" element={<Prescription/>} />
                <Route path="/StaffDetails" element={<StaffDetails/>} />
                <Route path="/AppointmentEdit" element={<AppointmentEdit/>} />
                <Route path="/Recoverys" element={<Recoverys/>} />
                <Route path="/StudentDetails" element={<StudentDetails/>} />
                <Route path="/MenuList" element={<MenuList/>} />
                <Route path="/Payments" element={<Payments/>} />
                <Route path="/Chat" element={<Chat/>} />
                <Route path="/Stock" element={<Stock/>} />
                <Route path="/PlanSubscription" element={<PlanSubscription/>} />
                {/* <Route path="/VideoCalls" element={< VideoCalls/>} /> */}
            </Routes>
        </BrowserRouter>
</MyContext.Provider>    
    </div>
  
  );
}

export default App;