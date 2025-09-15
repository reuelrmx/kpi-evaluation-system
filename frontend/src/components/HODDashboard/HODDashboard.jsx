import React from 'react';
import '../Dashboard/Dashboard.css';
import { useUserContext } from '../../utils/api';
import Dashboard from '../Dashboard/Dashboard';

const HODDashboard = () => {
  // Use the Dashboard component and pass the user context
  const user = useUserContext();
  return (
    <div className="hod-dashboard-container">
      <Dashboard user={user} />
    </div>
  );
};

export default HODDashboard;