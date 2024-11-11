import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { Box, Typography } from '@mui/material';

const COLORS = ['#d32f2f', '#FFBF00', '#388e3c'];

const IncidentPieChart = ({ incidents }) => {
  // Count the statuses of incidents
  const statusCounts = incidents.reduce(
    (acc, { status }) => {
      acc[status]++;
      return acc;
    },
    { Triggered: 0, Acknowledged: 0, Resolved: 0 }
  );

  // Calculate the total open incidents (Triggered and Acknowledged)
  const totalOpenIncidents = statusCounts.Triggered + statusCounts.Acknowledged;

  // Prepare data for the pie chart
  const data = Object.keys(statusCounts).map((key, i) => ({
    name: key,
    value: statusCounts[key],
    color: COLORS[i],
  }));

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={100}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '16px', fontWeight: 'bold' }}
        >
          {`Open Incidents: ${totalOpenIncidents}`}
        </text>
      </PieChart>
      <Box ml={4}>
        {data.map((entry) => (
          <Box display="flex" alignItems="center" mb={1} key={entry.name}>
            <Box width={16} height={16} bgcolor={entry.color} mr={1} />
            <Typography>{`${entry.value} ${entry.name}`}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default IncidentPieChart;