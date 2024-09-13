import Appointment from '../pages/Appointment.js';
import Navbar from '../component/navbar.js';
import Sidebar from '../component/sidebar.js';
// import VideoCall from './videocall/VideoCall.js';
// import VideoCall from './pages/videocall.js';


function AppointmentDetails() {
  return (
    <div >
    <Navbar />
     <Sidebar />
  <Appointment/>
  {/* <VideoCall/> */}
     
      
    </div>
  );
}
export default AppointmentDetails;
