// netlify/functions/fetchIncidents.js
const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    const response = await axios.get('https://api.pagerduty.com/incidents', {
      headers: {
        Authorization: `Token token=${process.env.PAGERDUTY_API_KEY}`,
        Accept: 'application/vnd.pagerduty+json;version=2',
        'Content-Type': 'application/json',
      },
      params: { limit: 30 },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch incidents' }),
    };
  }
};
