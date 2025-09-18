import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../utils/api';
import '../Dashboard/Dashboard.css';
import './Dashboard.css';

const DeanDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalHODs: 0,
    totalDepartments: 0,
    pendingWorkplans: 0,
    completedEvaluations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all dashboard data in parallel
        const [hods, departments, workplans, evaluations] = await Promise.all([
          apiService.getHODs(),
          apiService.getDepartments(),
          apiService.getWorkplansForReview(),
          apiService.getAllEvaluations()
        ]);

        setStats({
          totalHODs: hods.length,
          totalDepartments: departments.length,
          pendingWorkplans: workplans.filter(w => w.status === 'pending').length,
          completedEvaluations: evaluations.filter(e => e.status === 'completed').length
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'dean') {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, Dean {user.name}</h1>
        <p>Faculty Overview Dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <h3>{stats.totalDepartments}</h3>
            <p>Departments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>{stats.totalHODs}</h3>
            <p>Department Heads</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>{stats.pendingWorkplans}</h3>
            <p>Pending Workplans</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>{stats.completedEvaluations}</h3>
            <p>Completed Evaluations</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/departments" className="action-card">
            View Departments
          </Link>
          <Link to="/lecturers" className="action-card">
            Assign to HODs
          </Link>
          <Link to="/workplans" className="action-card">
            My Workplans
          </Link>
          <Link to="/evaluations" className="action-card">
            View Evaluations
          </Link>
          <Link to="/reports" className="action-card">
            Generate Reports
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeanDashboard;