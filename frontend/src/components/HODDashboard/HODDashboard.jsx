import React, { useEffect, useState } from 'react';
import Dashboard from '../Dashboard/Dashboard';
import api from '../../utils/api';

const HODDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = api.getCurrentUser();
        if (!currentUser) return;

        // Fetch full user info from API (to get departmentId)
        const fullUser = await api.getUser(currentUser.id);
        setUser(fullUser);
      } catch (error) {
        console.error('Error fetching HOD info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="loading-spinner"></div>;
  if (!user) return <div className="error-message">Failed to load HOD info.</div>;

  return <Dashboard user={user} />;
};

export default HODDashboard;
