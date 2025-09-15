import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [evaluations, setEvaluations] = useState([]);
  const [workplans, setWorkplans] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user || !user.departmentId) throw new Error('Missing department info');

        const [evals, plans, deptLecturers] = await Promise.all([
          api.getEvaluationsByDepartment(user.departmentId),
          api.getWorkplansByDepartment(user.departmentId),
          api.getDepartmentLecturers(user.departmentId),
        ]);

        setEvaluations(evals);
        setWorkplans(plans);
        setLecturers(deptLecturers);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  const completedEvaluations = evaluations.filter(e => e.status === 'completed').length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome, {user.name}</h1>
          <p>Department: {user.departmentName || 'N/A'}</p>
        </div>
        <div className="current-date">{new Date().toLocaleDateString()}</div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <h3>{completedEvaluations}</h3>
            <p>Completed Evaluations</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>{workplans.length}</h3>
            <p>Total Workplans</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>{lecturers.length}</h3>
            <p>Total Lecturers</p>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="dashboard-content">
        <div className="content-column">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Workplans</h3>
            </div>
            <div className="activity-list">
              {workplans.slice(0, 5).map(plan => (
                <div className="activity-item" key={plan.id}>
                  <div className="activity-content">
                    <p>{plan.title}</p>
                    <span className="activity-time">{new Date(plan.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="content-column">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Evaluations</h3>
            </div>
            <div className="activity-list">
              {evaluations.slice(0, 5).map(evalItem => (
                <div className="activity-item" key={evalItem.id}>
                  <div className="activity-content">
                    <p>{evalItem.kpiName} - {evalItem.status}</p>
                    <span className="activity-time">{new Date(evalItem.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
