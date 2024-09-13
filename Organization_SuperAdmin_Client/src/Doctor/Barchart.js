import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Container, Row, Col } from 'react-bootstrap';
import 'chart.js/auto'; // Required for tree-shaking
import '@fontsource/inter';
import axios from 'axios'; // Ensure you have axios installed

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ doctorId }) => {
  const [view, setView] = useState('week');
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/statistics', {
          params: {
            interval: view === 'week' ? '1week' : view === 'month' ? '1month' : '1year',
            doctor_id: doctorId,
          },
        });

        const data = response.data;

        // Extract data for the current and previous periods based on the view
        const currentViewData = data[`Current ${view.charAt(0).toUpperCase() + view.slice(1)}`] || {};
        const previousViewData = data[`Previous ${view.charAt(0).toUpperCase() + view.slice(1)}`] || {};

        const labels = Object.keys(currentViewData);
        const currentData = Object.values(currentViewData);
        const previousData = Object.values(previousViewData);

        const formattedData = {
          labels,
          datasets: [
            {
              label: 'Current Data',
              data: currentData,
              backgroundColor: '#E8E8E8',
              borderColor: '#007bff',
              barThickness: 20,
              borderRadius: 5,
            },
            {
              label: 'Previous Data',
              data: previousData.length ? previousData : currentData.map(() => 0),
              backgroundColor: '#007bff',
              borderColor: '#A1A1A1',
              barThickness: 20,
              borderRadius: 5,
            },
          ],
        };

        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, [view, doctorId]);

  const getOptions = (view) => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#A1A1A1',
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#EFEFEF',
          },
          ticks: {
            stepSize: view === 'week' ? 1 : 10,
            color: '#A1A1A1',
            callback: function (value) {
              return value + 'h';
            },
          },
        },
      },
    };
  };

  const options = getOptions(view);

  return (
    <Container className="p-3">
      <Row className="mb-4 align-items-center">
        <Col md="auto">
          <h5 style={{ color: '#09244B' }}>Appointment Statistics</h5>
        </Col>
        <Col>
          <div className="button-group-container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div className="button-group" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#F2F4F6', border: 'none', borderRadius: '20px', display: 'flex' }}>
              <button
                onClick={() => setView('week')}
                style={{
                  marginRight: '5px',
                  border: 'none',
                  backgroundColor: view === 'week' ? '#fff' : '#F2F4F6',
                  cursor: 'pointer',
                  borderRadius: '14px',
                  color: '#526581',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#fff')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = view === 'week' ? '#fff' : '#F2F4F6')}
              >
                Week
              </button>
              <button
                onClick={() => setView('month')}
                style={{
                  marginRight: '5px',
                  border: 'none',
                  backgroundColor: view === 'month' ? '#fff' : '#F2F4F6',
                  cursor: 'pointer',
                  borderRadius: '14px',
                  padding: '5px 10px',
                  color: '#526581',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#fff')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = view === 'month' ? '#fff' : '#F2F4F6')}
              >
                Month
              </button>
              <button
                onClick={() => setView('year')}
                style={{
                  marginRight: '5px',
                  border: 'none',
                  backgroundColor: view === 'year' ? '#fff' : '#F2F4F6',
                  cursor: 'pointer',
                  borderRadius: '14px',
                  padding: '5px 10px',
                  color: '#526581',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#fff')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = view === 'year' ? '#fff' : '#F2F4F6')}
              >
                Year
              </button>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div style={{ height: '125px' }}>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <Bar data={chartData} options={options} />
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BarChart;