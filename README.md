# Incident Management Dashboard

An Incident Management Dashboard built with React, Material-UI, and Netlify Functions for managing and visualizing incident data. This application fetches incident data from an external API, provides filtering options, and displays insights with visual components like a pie chart and a data table.

## Features

- **Incident Data Visualization**: Displays incident status with a pie chart and detailed data in a table format.
- **Filters and Sorting**: Apply filters by status, priority, urgency, title, and date range. Sort incidents by creation date.
- **Clear Filters**: Reset all filters with a "Clear All Filters" button.
- **Mock Data Fallback**: Uses mock data if external API fetch fails.
- **Responsive Design**: Uses Material-UI for a clean, responsive interface.

## Technologies Used

- **React**: For building the frontend user interface.
- **Material-UI**: For UI components and styling.
- **Recharts**: For creating visual data charts.
- **Netlify Functions**: Serverless functions to fetch data from external APIs.
- **Axios**: For handling API requests.
- **date-fns & dayjs**: For date manipulation and formatting.

## Project Structure

```plaintext
.
├── netlify/functions          # Serverless functions for backend API calls
├── public                     # Public assets
├── src                        # Source files for the frontend
│   ├── components             # UI components (IncidentTable, IncidentPieChart, etc.)
│   ├── App.js                 # Main application component
│   ├── Dashboard.js           # Dashboard component with pie chart and table
│   ├── mockIncidents.json     # Mock data for incidents
│   └── index.js               # React DOM rendering entry point
└── README.md                  # Project documentation

## Getting Started with Deployment on Netlify

### Prerequisites

- **Node.js** and **npm**: Make sure you have Node.js and npm installed.
- **Netlify Account**: Sign up for a free account at [Netlify](https://www.netlify.com/).

### Steps to Deploy on Netlify

1. **Push the Code to GitHub**:
   - Ensure your code is pushed to a GitHub repository, as Netlify will connect to it directly.

2. **Set Up Environment Variables**:
   - In your project directory, create a `.env` file for local testing. Add your PagerDuty API key as shown below:
     ```plaintext
     PAGERDUTY_API_KEY=your_pagerduty_api_key
     ```
   - **Note**: This `.env` file is only for local testing. Netlify requires environment variables to be set in its dashboard for deployment.

3. **Login to Netlify**:
   - Go to [Netlify](https://app.netlify.com/) and log in.

4. **Connect to GitHub Repository**:
   - Click on **Add New Site** > **Import an Existing Project**.
   - Select **GitHub** and choose your repository.

5. **Configure Build Settings**:
   - Netlify should automatically detect the build command (`npm run build`) and the publish directory (`build` for React projects).
   - Under **Environment Variables** in the Netlify dashboard, add your `PAGERDUTY_API_KEY`:
     - **Key**: `PAGERDUTY_API_KEY`
     - **Value**: your PagerDuty API key

6. **Set Up Netlify Functions**:
   - In your repository, ensure that all serverless functions (e.g., `fetchIncidents.js`) are located in the `netlify/functions` directory.
   - Netlify will automatically detect and deploy these as serverless functions.

7. **Deploy**:
   - Click **Deploy Site** to start the first deployment.
   - Netlify will build and deploy the application. Once completed, you’ll see a live URL.

8. **Access Your Application**:
   - After deployment, access the live app using the URL Netlify provides. 
   - Your app will be accessible at a URL like: `https://your-netlify-app.netlify.app` (replace with your actual Netlify URL).
   - You can monitor serverless functions under the **Functions** tab in your Netlify dashboard, where you can also view logs and monitor activity.

### View the Live Application

Once deployed, you can view your application at the following URL:
**[https://your-netlify-app.netlify.app](https://your-netlify-app.netlify.app)**

Replace this URL with the actual one provided by Netlify after deployment.
