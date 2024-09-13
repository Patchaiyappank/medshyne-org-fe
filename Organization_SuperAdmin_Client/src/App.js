import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import LoginPage from './Login.js';
import DashboardLiveTable from './Dashboard/DashboardLiveTable.js'
import Dashboard from './Dashboard/Dashboard.js';
import SupportPage from "./Support/Supporthead.js"
import SupportTickets from './Support/Supportticktes.js';
import DashboardConsultingTable from './Dashboard/DashboardConsultingTable.js';
import OnboardHeader from './Organization_Onboarding/OnboardHeader.js';
import Onboard_List from './Organization_Onboarding/OnboardHeader_List.js';
import Onboard_Unpaid from './Organization_Onboarding/OnboardHeader_unpaid.js';
import ListOnboard from './Organization_Onboarding/OnboardingList.js';
import AddOrganization from './Organization_Onboarding/AddOrganization.js';

import DoctorList from './Doctor//DoctorList';
import Doctordetails from './Doctor/Doctordetails';
import Onedoctor from './Doctor/Onedoctor.js';

import Inventory from './Inventory/Inventory.js';
import DisposeExpired from './Inventory_stock/Inventory4.js';
import AddStock from './Inventory_stock/Inventory3.js';
import Stock1 from './Inventory_stock/Inventory.js';
import Billing from './Billing/OrdersDetail.js';
import NewBilling from './Billing/Billing1.js';
import Invoice_Billing from './Billing/Billing2.js';


import StockInventory from './Inventory_stock/Inventory.js';

import AddEmpolyee from "./Employs/AddEmployee.js";
import ViewEmpolyee from "./Employs/EmployeeDetails.js";
import ListOfEmploye from "./Employs/EmploysList.js";

import EmploysManagenmenthead from './Employs/EmploysManagenmenthead.js';

import SalesExcutiveList from './Sales_Excute/salesexecutive.js'
import SalesExecutive from './Sales_Excute/SalesExcutiveDetails.js';
import Stock from './Sales_Excute/stock.js';
import Organization_List from './OrganizationList/OrganizationList.js';
import OrganizationDetails from './OrganizationList/Organizationdetails.js';
import StaffList from './Staff/StaffList.js';
import StudentList from './Student/StudentList.js';
import AddStudent from './Student/AddStudent.js';
import AddStaff from './Staff/Addstaff.js';
import StaffView from './Staff/Staffdetails.js';
import StudentView from './Student/Studentdetails.js';


import ForgotPassword from './ForgetPassword/ForgetPassword.js' ;




import RegionalManager from "./regionalmanagerlist/regionalmanagerlist.js";
import AddRegionalManager from "./regionalmanagerlist/Regionalmanager.js";
import RegionalManagerDetails from "./regionalmanagerlist/Reginalmangerdetail.js";

import Settings from "./Settings/Settings.js";
import RecoveryStaff from "./Settings/RecoveryStaffs.js";
import RecoveryStudents from './Settings/RecoveryStudents.js';
// import Profilescreen from "./Settings/profileHeader.js";

const AppContent = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === '/';
  const isForgetPage = location.pathname === '/ForgotPassword';

  return (
    <div className="d-flex">
    
      {!isLoginPage && !isForgetPage && <Sidebar />}
      {/* {!isForgetPage && <Sidebar />}  */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/SupportPage" element={<SupportPage />} />
          <Route path="/Supportticktes" element={<SupportTickets />} />
          <Route path="/DashboardConsultingTable" element={<DashboardConsultingTable />} />
          <Route path="/DashboardLiveTable" element={<DashboardLiveTable />} />
          <Route path="/DoctorList" element={<DoctorList />} />
          <Route path="/Doctordetails" element={<Doctordetails />} />
          <Route path="/Onedoctor" element={<Onedoctor />} />

          <Route path="/OrganizationHeader" element={<OnboardHeader />} />
          <Route path="/Onboard_List" element={<Onboard_List />} />
          <Route path="/Onboard_Unpaid" element={<Onboard_Unpaid />} />

          <Route path="/ListOfOnboard_Organization" element={<ListOnboard />} />
          <Route path="/AddOrganization" element={<AddOrganization />} />

          <Route path="/inventory" element={<Inventory />} />
          <Route path="/stockupdate" element={<StockInventory />} />
          <Route path="/AddStock" element={<AddStock />} />
          <Route path="/DisposeExpired" element={<DisposeExpired />} />
          <Route path="/stock1" element={<Stock1 />} />
          <Route path='/Billing' element={<Billing />} />
          <Route path='/NewBilling' element={<NewBilling />} />
<Route path='/Invoice_Billing' element={<Invoice_Billing />} />
          <Route path="/regional" element={<RegionalManager />} />
          <Route path="/addregionalmanager" element={<AddRegionalManager />} />
          <Route path="/addregionalmanager/:id" element={<AddRegionalManager />} />
          <Route path="/regional-manager/:id" element={<RegionalManagerDetails />} />

          <Route path="/EmploysManagenmenthead" element={<EmploysManagenmenthead />} />

          <Route path="/AddEmpolyee" element={<AddEmpolyee />} />
          <Route path="/ViewEmpolyee" element={<ViewEmpolyee />} />
          <Route path="/Sales/:id" element={<SalesExcutiveList />} />
          <Route path="/Stock/:r_m_id" element={<Stock />} />
          <Route path="/salesexecutive/:id" element={<SalesExecutive />} />


<Route path="/OrganizationList" element={<Organization_List />} />
          <Route path="/Organizationdetails" element={<OrganizationDetails />} />
          <Route path="/Stafflist" element={<StaffList />} />
          <Route path="/Studentlist" element={<StudentList />} />
          <Route path="/AddStudent" element={<AddStudent />} />
          <Route path="/AddStaff" element={<AddStaff />} /> 
          <Route path="/StaffView" element={<StaffView />} />
          <Route path="/StudentView" element={<StudentView />} />


          <Route path='/settings' element={<Settings />} />
          <Route path='/recovery-staff' element={<RecoveryStaff />} />
          <Route path='/recovery-student' element={<RecoveryStudents />} />

          {/* <Route path="/profilescreen" element={<Profilescreen />} /> */}
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
