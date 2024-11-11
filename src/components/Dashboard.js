import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IncidentTable from './IncidentTable';
import IncidentPieChart from './IncidentPieChart';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import mockIncidents from '../mockIncidents.json';

const Dashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);

  // Fetch incidents from PagerDuty API or fallback to mock data on error
  const fetchIncidents = async () => {
    try {
      const response = await axios.get('/.netlify/functions/fetchIncidents');
    
      // Check if incidents are empty; fallback to mock data if no incidents found
      if (response.data.incidents.length === 0) {
        setIncidents(mockIncidents);
      } else {
        setIncidents(response.data.incidents);
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
      setAlertMessage('Failed to fetch incidents. Using mock data.');
      setIncidents(mockIncidents);
    }
  };

  // UseEffect hook to fetch incidents on component mount
  useEffect(() => {
    fetchIncidents();
  }, []);

  // UseEffect hook to display alert message if there's an error
  useEffect(() => {
    if (alertMessage) {
      alert(alertMessage);
      setAlertMessage(null);
    }
  }, [alertMessage]);

  // Render the dashboard UI with incident data and localization support
  return (
    <div className="dashboard">
      <h2>Incidents Dashboard</h2>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
          <IncidentPieChart incidents={incidents} />
          <IncidentTable incidents={incidents} />
      </LocalizationProvider>
    </div>
  );
};

export default Dashboard;