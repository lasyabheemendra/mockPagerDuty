const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5001;

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000' // Allow only requests from frontend origin
  }));

app.get('/api/incidents', async (req, res) => {
  try {
    console.log('here in backend');
    const response = await axios.get('https://api.pagerduty.com/incidents', {
      headers: {
        Authorization: `Token token=${process.env.PAGERDUTY_API_KEY}`,
        Accept: 'application/vnd.pagerduty+json;version=2',
        'Content-Type': 'application/json',
      },
      params: { limit: 30 },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ message: 'Failed to fetch incidents' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
