import React from 'react';
import '../App.css';

function Dashboard() {
  return (
    <iframe
      frameBorder="0"
      className="dashboard"
      title="dashboard"
      src="https://pnap.vizion.ai/kibana?embed=true"
      height="100%"
    />
  );
}

export default Dashboard;