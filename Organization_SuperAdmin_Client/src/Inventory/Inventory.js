import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Inventory.css";
import { useNavigate } from "react-router-dom";
import actionIcon from "../images/actionbutton.png";
import GenericPdfDownloader from '../Inventory/GenericPdfDownloder';

// Importing image
import Img from "./image 3.png";
import Img2 from "./image 2.png";
import Img1 from "./Button 98.png";
import Img4 from "../images/defimg.png";

const ITEMS_PER_PAGE = 10;

const InventorySettings = () => {
  const [activeTab, setActiveTab] = useState("Medstocks");
  const [getpayment, setPayment] = useState([]);
  const [fetchinventoryorder1, setPaymentorder] = useState([]);
  const [fetchinventoryTransactions, setPaymenttransactions] = useState([]);
  const [inStockCount, setInStockCount] = useState(0);
  const [fetchinventoryorder, setorderCount] = useState(0);
  const [outStockCount, setOutStockCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterActive, setFilterActive] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchinventory();
    fetchinventoryinstock();
    fetchinventoryoutstock();
    fetchinventoryordercount();
    fetchInventoryOrderTable();
    fetchInventoryTransactionsTable();
  }, []);
  //Medicine List table
  const fetchinventory = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/viewall_admin_medicine_list"
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch data: ${response.status} ${errorText}`
        );
      }
      const data = await response.json();

      if (data.Result === "Success" && Array.isArray(data.result)) {
        setPayment(data.result);
        console.log("Fetched data:", data.result);
      } else {
        throw new Error("Unexpected data structure");
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };
  //ordercount
  const fetchinventoryordercount = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/superAdmin_orders_count"
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch data: ${response.status} ${errorText}`
        );
      }
      const data = await response.json();

      // Log the entire data response to inspect it
      console.log("API Response:", data);

      if (
        data.Result === "Success" &&
        typeof data.pendingOrdersCount === "number"
      ) {
        console.log("Setting inStockCount to:", data.pendingOrdersCount);
        setorderCount(data.pendingOrdersCount);
      } else {
        throw new Error("Unexpected data structure");
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  //instockcount
  const fetchinventoryinstock = async () => {
    try {
      const response = await fetch("http://localhost:5000/count_admin_instock");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch data: ${response.status} ${errorText}`
        );
      }
      const data = await response.json();

      // Log the entire data response to inspect it
      console.log("API Response:", data);

      if (data.Result === "Success" && typeof data.instock === "number") {
        console.log("Setting inStockCount to:", data.instock);
        setInStockCount(data.instock);
      } else {
        throw new Error("Unexpected data structure");
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };
  //outofstock
  const fetchinventoryoutstock = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/count_admin_outofstock"
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch data: ${response.status} ${errorText}`
        );
      }
      const data = await response.json();

      // Log the entire data response to inspect it
      console.log("API Response:", data);

      if (data.Result === "Success" && typeof data.outofstock === "number") {
        console.log("Setting inStockCount to:", data.outofstock);
        setOutStockCount(data.outofstock);
      } else {
        throw new Error("Unexpected data structure");
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  //order table

  const fetchInventoryOrderTable = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/superAdmin_viewAll_orders"
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch data: ${response.status} ${errorText}`
        );
      }
      const data = await response.json();

      // Log the entire data response to inspect it
      console.log("API Response:", data);

      // Assuming the response is structured correctly and data is what you're expecting
      setPaymentorder(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  //Transactions table

  const fetchInventoryTransactionsTable = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/superAdmin_viewAll_transaction"
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch data: ${response.status} ${errorText}`
        );
      }
      const data = await response.json();

      // Log the entire data response to inspect it
      console.log("API Response:", data);

      // Assuming the response is structured correctly and data is what you're expecting
      setPaymenttransactions(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleNavigate = () => {
    navigate("/stockupdate");
  };

  // Pagination calculations
  const totalPages = Math.ceil(getpayment.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagination_paymenting = getpayment.slice(startIndex, endIndex);
  const fetchinventoryTransaction = fetchinventoryTransactions.slice(startIndex, endIndex);
  
  const fetchinventoryorder2 = fetchinventoryorder1.slice(startIndex, endIndex);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <span
          key={1}
          className={`inventorypagination-page ${
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
          className={`inventorypagination-page ${
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
        pageNumbers.push(<span key="ellipsisEnd" className="inventory-ellipsis">{ellipsis}</span>);
      }
      pageNumbers.push(
        <span
          key={totalPages}
          className={`inventorypagination-page ${
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

  const handleNewBill = () => {
    navigate('/Invoice_Billing');
  }


  const handleBillNavigate = (Bill_id) => {
    navigate('/Billing', {
      state: { id: Bill_id},
    });
   
  };

  return (
    <Container 
      fluid
      className="inventory-container1 "
      style={{ backgroundColor: "#F9F9F9" }}
    >
      <Row className="mb-4">
        <Col>
          <h1
            className='mt-3 ps-4 fs-3 fw-bold' style={{marginLeft:"10px"}}>
            Inventory
          </h1>
        </Col>
        <hr style={{color: '#0000003A', marginLeft: "-23px", marginTop: "2px" }} />
      </Row>

      <Row>
        <Col className="nav-headbutton" >
          <ul className="nav mt-3">
            <li className="nav-item1">
              <a
                className={`nav-link ${
                  activeTab === "Medstocks"
                    ? "active3-button "
                    : "inactive-button-2"
                }`}
                href="#"
                onClick={() => handleTabClick("Medstocks")}
              >
                Med&nbsp;stocks
              </a>
            </li>
            <li className="nav-item2">
              <a
                className={`nav-link ${
                  activeTab === "Orders"
                    ? "active4-button "
                    : "inactive-button-1"
                }`}
                href="#"
                onClick={() => handleTabClick("Orders")}
               // style={{ paddingLeft: "29px" }}
              >
                Orders
              </a>
            </li>
            <li className="nav-item3">
              <a
                className={`nav-link ${
                  activeTab === "Transactions"
                    ? "active2-button "
                    : "inactive-button-3"
                }`}
                href="#"
                onClick={() => handleTabClick("Transactions")}
                // style={{ paddingLeft: "10px" }}
              >
                Transactions
              </a>
            </li>
          </ul>
        </Col>
      </Row>

      {/* Conditionally render content based on activeTab */}
      {activeTab === "Medstocks" && (
        <Row className="dashboard1">
          <Col xs={12} sm={4} className="mb-3">
            <div className="container3"  onClick={() => handleTabClick("Orders")}>
              <div className="icon1">
                <img src={Img} alt="Orders Icon" className="profile-img1" />
              </div>
              <div className="text-containers">
                <div className="text2">Orders</div>
                <div className="number4">{fetchinventoryorder}</div>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={4} className="mb-3">
            <div className="container2">
              <div className="icon1">
                <img
                  src={Img1}
                  alt="In Stock Medicine Icon"
                  className="profile-img2"
                />
              </div>
              <div className="text-containers">
                <div className="text1">In&nbsp;Stock&nbsp;Medicine</div>
                <div className="number4">{inStockCount}</div>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={4} className="mb-3">
            <div className="container4">
              <div className="icon1">
                <img
                  src={Img2}
                  alt="Out of Stock Medicine Icon"
                  className="profile-img2"
                />
              </div>
              <div className="text-containers">
                <div className="text6">
                  Out&nbsp;of&nbsp;Stock&nbsp;Medicine
                </div>
                <div className="number6">{outStockCount}</div>
              </div>
            </div>
          </Col>

          <div className="container-inventory1 row mt-12">
            <div className="border1">
              <Row>
                <Col className="col-sm-10">
                  <h3 className="MedicineList">Medicine List</h3>
                  <p className="MedicineList1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </Col>
                <Col className="col-sm-2 text-right">
                  <Button
                    variant="primary"
                    className="stock-update-button2"
                    onClick={handleNavigate}>
                    Stock Update
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col className="my-custom-classone">
                  <Table responsive>
                    <thead >
                      <tr className="responsive-table-head">
                        <th>
                          <span className="header-medicine">Medicine&nbsp;Name</span>
                        </th>
                        <th>
                           <span className="header-hsn">HSN&nbsp;Code</span>
                        </th>
                        <th>
                          <span className="header-stock">Stock&nbsp;Status</span>
                        </th>
                        <th>
                          <span className="header-quantity">Quantity</span>
                        </th>
                        <th>
                          <span className="header-expiry">Expiry&nbsp;Date</span>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="inventory-table-body">
                      {pagination_paymenting.map((item, index) => (
                        <tr key={index} className="med-stock-table-heiht">
                          <td>
                            <span className="cell-medicine"></span>
                            {item.medicine}
                          </td>
                          <td>
                            <span className="cell-hsn1"></span>
                            {item.hsn_code}
                          </td>
                          <td
                            className="cell-stock"
                            style={{
                              color:
                                item.stock_status === "OutOfStock"
                                  ? "#EE5496"
                                  : "#A6C85B",
                            }}
                          >
                            <span className="cell-stock"></span>
                            {item.stock_status}
                          </td>
                          <td className="cell-quantity">
                            <span className="cell-quantity"></span>
                            {item.quantity}
                          </td>
                          <td className="cell-expiry">
                            <span className="cell-expiry"></span>
                            {item.expiry_date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
          </div>
          <div className="inventory-pagination">
        <span className="inventory-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
          <span className="inventory-prevoius-arrow">&#8249;</span> Previous
        </span>
        <span className="inventory-pagination-pages">{renderPageNumbers()}</span>
        <span className="inventory-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
          Next <span className="inventory-next-arrow">&#8250;</span>
        </span>
      </div>
        </Row>
      )}

   {activeTab === "Orders" && (
    <div>
  <div className="container inventory-table-wrapper1">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="table-title">Medicine Orders</h2>
        <p className="table-subtitle">
          {fetchinventoryorder1.length} Orders
        </p>
      </div>
    </div>
    <div
      className="inventory-shadow-sm-payment-table"
      style={{
        marginTop: "-20px"
      }}>
      <div className="mt-3 1-payment-tableinner">
        <Table
          bordered={false}
          className="table-borderless-payment" responsive="md">
          <thead>
            <tr className="thead-orderheading text-center">
              {['Order ID', 'Date', 'Status', 'Name', 'RM', 'Order details'].map((header, idx) => (
                <th
                  key={idx}
                  style={{
                    color: "#667085",
                    backgroundColor: "#FAFAFA",
                    fontWeight: "400",
                  }}
                  className={`th-${header.toLowerCase().replace(' ', '-')}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {fetchinventoryorder2.map((order, index) => (
              <tr key={index} className="tr-order-body">
                <td className="text-center td-order-id">{order.order_id}</td>
                <td className="text-center td-date">{order.order_date}</td>
                <td className="text-center td-status">
                  <span
                    style={{
                      color:
                        order.status === 'Pending' ? '#FFC33D' :
                        order.status === 'Delivered' ? '#027A48' :
                        order.status === 'Expired' ? '#FF0000' :
                        '#464E5F',
                      backgroundColor:
                        order.status === 'Pending' ? '#FFC33D1A' :
                        order.status === 'Delivered' ? '#ECFDF3' :
                        order.status === 'Expired' ? '#FF0000' :
                        'transparent',
                        padding: '4px 8px', // Optional: Add some padding around the text
                        borderRadius: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="td-org-name text-center">
                  <div className="d-flex align23">
                    <img
                      src={Img4}
                      width={35}
                      height={35}
                      alt="inventory"
                      className="org-img rounded-circle1"
                    />
                    <div>
                      <div className="org-info-name">
                        {order.organization_name}
                      </div>
                      <div className="org-info-type text-muted">
                        {order.organization_type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="td-rm-name text-center">{order.r_m_name}</td>
                <td className="td-profile text-center">
                  <button
                    className="btn-action"
                    onClick={() =>
                      handleBillNavigate(order.order_id)
                    }
                  >
                    <img
                      src={actionIcon}
                      alt="Action"
                      className="img-action-icon"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  
  </div>
  <div className="inventory-pagination">
        <span className="inventory-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
          <span className="inventory-prevoius-arrow">&#8249;</span> Previous
        </span>
        <span className="inventory-pagination-pages">{renderPageNumbers()}</span>
        <span className="inventory-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
          Next <span className="inventory-next-arrow">&#8250;</span>
        </span>
      </div>

  </div>
)}


      {activeTab === "Transactions" && (
        <div>
      <Table bordered={false} className="transpayment">
      <div className="container transaction-table-wrapper">
        <div className="d-flex justify-content-between mb-4">
          <div className="title-sub">
            <h2 className="table-title">Transactions History</h2>
            <p className="table-subtitle">
              {fetchinventoryTransactions.length} transactions history
            </p>
          </div>
          <button className="btn btn-primary new-billing-button" onClick={() =>
                      handleNewBill()
                    }>New Billing</button>  
        </div>
        <div style={{ boxShadow: "none" }} className="trans-payment-table-trans">
          <div className="mt-3 trans-payment-table-inner">
            <div className="table-responsive1">
              <table className="table">
                <thead className="trans-payment-table-header">
                  <tr>
                    <th className="header-invoice-id" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'400'}}>Invoice ID</th>
                    <th className="header-date" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'400'}}>Date</th>
                    <th className="header-status" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'400'}}>Status</th>
                    <th className="header-organization"style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'400'}}>Name</th>
                    <th className="header-cashier" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'400'}}>Cashier</th>
                    <th className="header-receiver" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'400'}}>Receiver</th>
                    <th className="header-invoice" style={{ color: '#667085', backgroundColor: '#FAFAFA' ,fontWeight:'400'}}>Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {fetchinventoryTransaction.map((order, index) => (
                    <tr key={index} className="trans-payment-table-row">
                      <td className="innumber">{order.invoice_number}</td>
                      <td className="orderdate1">{order.order_date}</td>
                      <td className="orderstatus"> <span
    style={{
      color:
      order.status === 'Provided' ? '#FFC33D' :
      order.status === 'Stock add' ? '#027A48' :
      order.status === 'Expired' ? '#FF0000' :
        '#464E5F', // Default text color
      backgroundColor:
      order.status === 'Provided' ? '#FFC33D1A' :
      order.status === 'Stock add' ? '#ECFDF3' :
       order.status === 'Expired' ? '#FF00001A':
        'transparent', // Default background color
      padding: '4px 8px', // Optional: Add some padding around the text
      borderRadius: '8px',
      whiteSpace:'nowrap' 
      
    }}
  >{order.status}
  </span></td>
                      <td>
                        <div className="d-flex align23">
                          <img src={Img4} width={30} height={30} alt="organization" className="org-img rounded-circle23" />
                          <div>
                            <div className="org-info-name">{order.organization_name}</div>
                            <div className="org-info-type text-muted">{order.organization_type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="cashierorder">{order.cashier}</td>
                      <td className="receiverorder">{order.receiver}</td>
                      <td className="transinvoice">
                        <GenericPdfDownloader
                          rootElementId="pdfContent"
                          downloadFileName="Invoice"
                          invoiceDetails={order.invoice}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
    </Table>
    <div className="inventory-pagination">
        <span className="inventory-pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
          <span className="inventory-prevoius-arrow">&#8249;</span> Previous
        </span>
        <span className="inventory-pagination-pages">{renderPageNumbers()}</span>
        <span className="inventory-pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
          Next <span className="inventory-next-arrow">&#8250;</span>
        </span>
      </div>
    </div>
       
      )}
    
    </Container>



  );
};
export default InventorySettings;
