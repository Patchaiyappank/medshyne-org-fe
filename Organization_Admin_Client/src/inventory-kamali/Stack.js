import React, { useState, useEffect, useContext } from 'react';
import './Stack.css';
import full from './Icon/Button 98.png';
import out from './Icon/image 2.png';
import left from './Icon/left.png';
import right from './Icon/right.png';
import { MyContext } from '../ProjectContext';


const StackComponent = () => {
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL.trim();
  const {getLoginCredentials,setLoginCredentials} = useContext(MyContext);
    const [stackData, setStackData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
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
  

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
       // body: JSON.stringify(update),
    };

    
    // Function to fetch data from the API
    const fetchData = async () => {
        try {
            const response = await fetch(`${baseApiUrl}/view_medicine_list?organization_name=${selectOrganization}`, options);
            const data = await response.json();
            console.log('Response data is:', data.result);
            setStackData(data.result);
        } catch (error) {
            console.error('Error:', error); 
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data when component mounts
    }, []);

    // Function to handle page change


    const determineStockStatus = (quantity) => {
        return quantity > 0 ? 'In Stock' : 'Out of Stock';
    };

    const determineStockClassName = (quantity) => {
        return quantity > 0 ? 'in-stock' : 'out-of-stock';
    };

    // Counting the items with quantity greater than 0
    const inStockCount = stackData.filter(item => item.quantity > 0).length;
    
    // Counting the items with quantity equal to 0
    const outOfStockCount = stackData.filter(item => item.quantity === 0).length;

    const ITEMS_PER_PAGE = 5;  

    const totalPages = Math.ceil(stackData.length / ITEMS_PER_PAGE);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const currentStock = stackData.slice(startIndex, endIndex);
    
      const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
        }
      };

      const renderPageNumbers= () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        const ellipsis = "...";
      
        // Calculate the total number of pages
        const totalPages = Math.ceil(stackData.length / ITEMS_PER_PAGE);
      
        // Calculate the starting page number
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
        // Adjust the starting page number if necessary
        if (endPage - startPage < maxVisiblePages - 1) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
      
        // Generate page numbers
        if (startPage > 1) {
          pageNumbers.push(
            <span key={1} className={`stock-page ${currentPage === 1 ? "active" : ""}`} onClick={() => handlePageChange(1)}>{1}</span>
          );
          if (startPage > 2) {
            pageNumbers.push(<span key="ellipsisStart" className="ellipsis">{ellipsis}</span>);
          }
        }
      
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(
            <span
              key={i}
              className={`stock-page ${currentPage === i ? "active" : ""}`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </span>
          );
        }
      
        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            pageNumbers.push(<span key="ellipsisEnd" className="ellipsis">
            {ellipsis}</span>);
          }
          pageNumbers.push(
            <span
              key={totalPages}
              className={`stock-page ${currentPage === totalPages ? "active" : ""}`}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </span>
          );
        }
      
        return pageNumbers;
      };
    return (
        <div className='inventory-stack-container'>
            <div className='inventory-imgg'>
                <div className='inventory-cardcontainer'>
                    <img id='inventory-simage' src={full} alt='' /><span className='inventory-stockspan'>In Stock Medicine</span>
                    <div className='inventory-numberimage'>{inStockCount}</div>
                </div>
                <div className='inventory-cardcontainer1'>
                    <img id='inventory-simagee' src={out} /><span className='inventory-outspan'>Out of Stock Medicine</span>
                    <div className='inventory-numberimage1'>{outOfStockCount}</div>
                </div>
            </div>
            <div className='inventory-stackk-med'>
                <p className='inventory-stack-head'>Medicine List</p>
                <div className='inventory-Stackkk-con'>
                    <div className="stack-content">
                        <h6 className='stack-subtitle'>Overview of available medicines, including stock status, quantities, and expiration dates.</h6>
                        <button className='stack-button' >Medicine Refill</button>
                    </div>
                  
                   
                </div>

                <div className="inventory-table-Stack">
                    <table  className="" >
                        <thead >
                            <tr>
                                <th >Medicine Name</th>
                                <th >HSN Code</th>
                                <th >Stock Status</th>
                                <th >Quantity</th>
                                <th >Expiry date</th>
                            </tr>
                        </thead>
                        <tbody >
                            {currentStock.map((item) => (
                                <tr key={item.medicine_list_id} >
                                    <td>{item.medicine}</td>
                                    <td >{item.hsn_code}</td>
                                    <td className={determineStockClassName(item.quantity)} >{determineStockStatus(item.quantity)}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.expiry_date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="stock-pagination">
            <span className="stock-prevoius-arrow">&#8249;</span>
        <span
          className="stock-pagination-arrow"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </span>

        <span className="stock-pagination-pages">
          {renderPageNumbers()}
        </span>

        <span
          className="stock-pagination-arrow"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next 
        </span>
        <span className="stock-next-arrow">&#8250;</span>
      </div>
        </div>
    );
};

export default StackComponent;