import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IncidentTable from './IncidentTable';
import IncidentPieChart from './IncidentPieChart';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import mockIncidents from '../mockIncidents.json';

const Dashboard = () => {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('https://api.pagerduty.com/incidents', {
        headers: {
          Authorization: 'Token token=y_NbAkKc66ryYTWUXYEu',
          Accept: 'application/vnd.pagerduty+json;version=2',
          'Content-Type': 'application/json',
        },
        params: { limit: 30 },
      });
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

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    if (alertMessage) {
      alert(alertMessage);
      setAlertMessage(null);
    }
  }, [alertMessage]);

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