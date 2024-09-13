import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '@fontsource/inter';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import './OnboardingList.css';
import actionIcon from '../assest/actionbutton.png';
import { useNavigate } from 'react-router-dom';
import image from './defimg.png';

const ITEMS_PER_PAGE = 10;

const App = () => {
  const navigate = useNavigate();
  const [onboarding, setOnboarding] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();
  const {  onboarding_id } = location.state || {};
  const onboard_id = onboarding_id;


  useEffect(() => {
    fetchOnboarding(onboard_id); // Fetch data on component mount
  }, [onboard_id]);

  const fetchOnboarding = async (onboard_id) => {
    try {
      const url = onboard_id
        ? `http://localhost:5000/superAdmin_onboarding_organizations_regionalmanager_list/${onboard_id}`
        : `http://localhost:5000/superAdmin_onboarding_organizations`;
  
      const response = await fetch(url);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch data');
      }
  
      const data = await response.json();
      setOnboarding(data.organizations);
    } catch (error) {
      console.error('Error fetching Onboarding_Organization:', error.message || error);
    }
  };
  

    // const fetchOnboarding = async () => {
    //   try {
    //     const response = await fetch(`http://localhost:5000/superAdmin_onboarding_organizations`);
    //     if (!response.ok) {
    //       const data = await response.json();
    //       throw new Error(data.message || 'Failed to fetch data');
    //     }
    //     const data = await response.json();
    //     setOnboarding(data.organizations);
    //   } catch (error) {
    //     console.error('Error fetching Onboarding_Organization:', error.message || error);
    //   }
    // };
    

  const totalPages = Math.ceil(onboarding.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagination_onboarding = onboarding.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";
    const totalPages = Math.ceil(onboarding.length / ITEMS_PER_PAGE);
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <span
          key={1}
          className={`onboardListpagination-page ${
            currentPage === 1 ? "active" : ""
          }`}
          onClick={() => handlePageChange(1)}
        >
          {1}
        </span>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="ellipsisStart" className="ellipsis">{ellipsis}</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`onboardListpagination-page ${
            currentPage === i ? "active" : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </span>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="ellipsisEnd" className="onboardList-ellipsis">{ellipsis}</span>);
      }
      pageNumbers.push(
        <span
          key={totalPages}
          className={`onboardListpagination-page ${
            currentPage === totalPages ? "active" : ""
          }`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </span>
      );
    }
    return pageNumbers;
  };

  const newOnboard = () => {
   
    navigate('/AddOrganization', { state: { mode: 'new' } });
  };

  const handleSingleOrganizationClick = (onboard_id) => {
    console.log('Onboarding ID being passed:', onboard_id); // Log the ID to console
    navigate('/Organizationdetails', {
      state: { id: onboard_id },
    });
  };

  return (
    <div className="">
     
      <div style={{borderRadius: '20px' }} className=" onboardList-table-container">
        <div className="onboardList-header-row">
          <div>
            <h5 style={{ color: '#212121', fontSize: '18px', fontWeight: 'bold' }} className=" mt-3">On boarding Organization</h5>
            <h6 style={{ fontSize: '13px', color: '#B5B5C3' }} >
              {onboarding.length} Organization
            </h6>
          </div>
          <button className="add-onboardList-button mt-1" onClick={newOnboard}>
            Add Organization
          </button>
        </div>

        <div className="mt-3 onboardList-table-container-innercell">
          <Table bordered={false} className="table-borderless onboardList-table-border" >
            <thead className='mb-2' style={{ borderRadius: '20px'}}>
              <tr className='onboardListingList-tableRow'>
                <th className='text-left ps-4'  style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold'}}>Name</th>
                <th className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA' ,fontWeight:'bold' }}>ID</th>
                <th  className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'bold' }}>Email</th>
                <th className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'bold', whiteSpace: 'nowrap' }}>Phone number</th>
                <th className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'bold' }}>Date</th>
                <th className='text-center' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'bold' }}>Status</th>
                <th className='text-center w-1' style={{ color: '#B5B5C3', backgroundColor: '#FAFAFA',fontWeight:'bold' }}></th>
              </tr>
            </thead>
            <tbody>
              {pagination_onboarding.map((onboarding, index) => (
                <tr key={index} className='text-start onboardlist-table-border '>
                  <td className='onboardlsit-profile-container'>
                    <div className="d-flex onboardlist-profile-container">
                      <img
                        src={onboarding.profile ? onboarding.profile : image}
                        alt="organization"
                        className="rounded-circle me-2 onboardlsit-profile"
                      />
                      <div>
                        <div className='onboardListing-table-details'>{onboarding.organization_name}</div>
                        <div className="onboardList-text-muted">{onboarding.organization_type}</div>
                      </div>
                    </div>
                  </td>
                  <td className='text-center onboardListing-table-details' >{onboarding.id}</td>
                  <td className='text-center onboardListing-table-details' >{onboarding.email_id}</td>
                  <td className=' text-center onboardListing-table-details'>{onboarding.organization_mobile_no}</td>
                  <td className='text-center onboardListing-table-details'>{onboarding.Date}</td>
                  <td className='text-center'>
  <span
    style={{
      color:
        onboarding.status === 'Completed' ? '#22C55E' :
        onboarding.status === 'On Process' ? '#FFC33D' :
        onboarding.status === 'Reject' ? '#FF0000' :
        '#464E5F', // Default text color
      backgroundColor:
        onboarding.status === 'Completed' ? '#E6F7EE' :
        onboarding.status === 'On Process' ? '#FFF8E1' :
        onboarding.status === 'Reject' ? '#FDEDED' :
        'transparent', // Default background color
      padding: '3px 7px', // Optional: Add some padding around the text
      borderRadius: '10px',
      whiteSpace:'nowrap' 
    }}
    className='onboardList-status'
  >
    {onboarding.status}
  </span>
</td>
                  <td className="">
                    <button className="onboardList-action-button" onClick={() => handleSingleOrganizationClick(onboarding.id)}>
                      <img src={actionIcon} alt="Action" className="onboardList-action-icon" />
                    </button>
                  </td>
                
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="onboardList-pagination">
        <span className="onboardList-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
          <span className="onboardList-prevoius-arrow">&#8249;</span> Previous
        </span>
        <span className="onboardList-pagination-pages">{renderPageNumbers()}</span>
        <span className="onboardList-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
          Next <span className="onboardList-next-arrow">&#8250;</span>
        </span>
      </div>
    </div>
  );
};

export default App;



// onboard-table-border