import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap';
import './barchart.css';

const BarChart = () => {
  const [progress, setProgress] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Year');
  const [maxValue, setMaxValue] = useState(0);

  // Function to fetch data from the API
  const fetchRevenueData = async (filterType) => {
    let queryParam = '';
    switch (filterType) {
      case 'Month':
        queryParam = 'month=1'; // Change to get the current month dynamically if needed
        break;
      case 'Year':
        queryParam = 'year=1'; // Change to get the current year dynamically if needed
        break;
      default:
        queryParam = 'year=1';
    }

    try {
      const response = await fetch(`http://localhost:5000/superAdmin_revenue_stats?${queryParam}`);
      const data = await response.json();

      // Parse the API response to match the format required by the component
      const formattedData = data.map(item => ({
        month: item.year || item.month, // Adjust based on your API response format
        value: Math.floor(item.total_amount / 1000), // Example: Scale the amount for better visualization
      }));

      setProgress(formattedData);

      // Calculate the maximum value from the data to set the Y-axis scale
      const maxVal = Math.max(...formattedData.map(item => item.value));
      setMaxValue(maxVal);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  const handleFilter = (filterType) => {
    setSelectedFilter(filterType);
    fetchRevenueData(filterType);
  };

  useEffect(() => {
    handleFilter('Year'); // Default filter
  }, []);

  // Generate Y-axis labels based on the max value
  const generateYAxisLabels = () => {
    const step = maxValue / 4; // Divide the Y-axis into 4 parts
    return [maxValue, maxValue - step * 1, maxValue - step * 2, maxValue - step * 3].map(label => `${label}k`);
  };

  return (
    <Col className='dashboard-chart-card' xs={12} md={12}>
      <div className="dashboardchart col-sm">
        <div className="dashboard-card-header d-flex justify-content-between align-items-center ms-3">
          <div className="dashboard-revenue">Revenue</div>
          <select
            className="form-select dashboardyear"
            value={selectedFilter}
            onChange={(e) => handleFilter(e.target.value)}
            style={{ width: '86px', marginTop: '15px', border: 'none', color: '#0F2552', fontWeight: 'bold', fontSize: '12px',cursor:'pointer' }}
          >
            <option value="Month">Month</option>
            <option value="Year">Year</option>
          </select>
        </div>
        <hr />
        <div className="card-body">
          <div className="dashboard-chart-container ms-2">
            <div className="dashboard-y-axis">
              {generateYAxisLabels().map((label, index) => (
                <div key={index} className="dashboard-y-axis-label">{label}</div>
              ))}
            </div>
            <div className="dashboard-chart">
              {progress.map(({ month, value }, index) => (
                <div key={month + index} className="dashboard-month-container" style={{ width: '29px', margin: '0 5px', fontSize: '12px' }}>
                  <div className="dashboard-vertical-progress">
                    <div
                      className="dashboard-progress-bar"
                      role="progressbar"
                      style={{ height: `${(value / maxValue) * 100}%` }}
                      aria-valuenow={value}
                      aria-valuemin="0"
                      aria-valuemax="1000"
                    ></div>
                  </div>
                  <div className="dashboard-month-label">{month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default BarChart;
