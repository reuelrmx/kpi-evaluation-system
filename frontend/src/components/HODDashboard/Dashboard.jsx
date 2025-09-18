import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dashboardApi from '../../api/dashboard';
import './Dashboard.css';

const HODDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    teamMembers: 0,
    activeKPIs: 0,
    completedEvaluations: 0,
    pendingReviews: 0
  });
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardApi.getDepartmentData();
        // Filter data for HOD's department only
        const departmentData = data.find(dept => dept.id === user.departmentId);
        if (departmentData) {
          setStats({
            teamMembers: departmentData.lecturers,
            activeKPIs: departmentData.activeKPIs || 0,
            completedEvaluations: departmentData.completedEvaluations || 0,
            pendingReviews: departmentData.pendingReviews || 0
          });
          setTeamPerformance(departmentData.performance || []);
        }
        
        const activities = await dashboardApi.getRecentActivity();
        // Filter activities for HOD's department
        setRecentActivity(activities.filter(activity => 
          activity.departmentId === user.departmentId
        ));
      } catch (err) {
        console.error('Error fetching HOD dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.departmentId) {
      fetchDashboardData();
    }
  }, [user]);

  const renderQuickActions = () => (
    <div className="quick-actions-grid">
      <Link to="/lecturers" className="action-btn">
        <span className="action-icon">groups</span>
        <span>My Team</span>
      </Link>
      <Link to="/lecturers" className="action-btn">
        <span className="action-icon">assignment</span>
        <span>Assign to Lecturers</span>
      </Link>
      <Link to="/workplans" className="action-btn">
        <span className="action-icon">assignment_turned_in</span>
        <span>My Workplans</span>
      </Link>
      <Link to="/evaluations" className="action-btn">
        <span className="action-icon">fact_check</span>
        <span>Review Evaluations</span>
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <div className="error-content">
            <h3>Dashboard Error</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome, HOD {user.name}!</h1>
          <p>Department Management Dashboard</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">groups</div>
          <div className="stat-content">
            <h3>{stats.teamMembers}</h3>
            <p>Team Members</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">assignment</div>
          <div className="stat-content">
            <h3>{stats.activeKPIs}</h3>
            <p>Active KPIs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">fact_check</div>
          <div className="stat-content">
            <h3>{stats.completedEvaluations}</h3>
            <p>Completed Evals</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">pending</div>
          <div className="stat-content">
            <h3>{stats.pendingReviews}</h3>
            <p>Pending Review</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-column">
          <div className="card">
            <h3>Team Performance</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teamPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#11486B" name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3>Quick Actions</h3>
            {renderQuickActions()}
          </div>
        </div>

        <div className="content-column">
          <div className="card activity-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'evaluation' ? 'fact_check' : 'assignment'}
                    </div>
                    <div className="activity-content">
                      <p>{activity.description}</p>
                      <span className="activity-time">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">No recent activity</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODDashboard;